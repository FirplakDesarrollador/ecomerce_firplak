'use client';

import React, { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Html, Lightformer, Line, OrbitControls, useGLTF, useProgress, useTexture } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import type { LavamanosOpcion, MuebleBano } from '../catalogoMuebles';
import { CORTE_FIN, CORTE_INICIO, crearMaterialAcabado, prepararTextura, type UniformesAcabado } from './materialAcabado';
import { VITELLI_RIG } from './vitelliRig';

export type VistaCamara = 'tresCuartos' | 'frente' | 'interior' | 'cenital';
export type PuntoInteres = 'cajon' | 'lavamanos' | 'grifo';
type IdLavamanos = LavamanosOpcion['id'];

export interface EscenarioVitelliProps {
  mueble: MuebleBano;
  acabado: string;
  lavamanos: IdLavamanos;
  abierto: boolean;
  vista: VistaCamara;
  /** Cambia en cada pedido de vista, aunque se repita la misma. */
  vistaPedido: number;
  medidas: boolean;
  /** Comparar acabados: a la izquierda `acabado`, a la derecha `acabadoB`. */
  comparar: { acabadoB: string; corte: number } | null;
  activo: boolean;
  reducirMovimiento: boolean;
  puntosVisibles: boolean;
  onPunto: (p: PuntoInteres) => void;
  onInteraccion: () => void;
  onListo: () => void;
  /** 0-100 mientras descargan modelo y texturas. */
  onProgreso: (p: number) => void;
}

// Encuadres en metros (origen: pared, base del mueble, centro del ancho).
const VISTAS: Record<VistaCamara, { pos: [number, number, number]; obj: [number, number, number] }> = {
  tresCuartos: { pos: [1.06, 0.98, 1.8], obj: [0, 0.36, 0.24] },
  frente: { pos: [0, 0.52, 1.98], obj: [0, 0.35, 0.24] },
  interior: { pos: [0.82, 0.9, 1.98], obj: [-0.03, 0.27, 0.3] },
  cenital: { pos: [0, 2.02, 0.52], obj: [0, 0.5, 0.24] },
};

const suave = (x: number) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));
const salidaRebote = (x: number) => {
  const c1 = 1.35, c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
};
const acercar = (actual: number, meta: number, dt: number, k: number) => actual + (meta - actual) * (1 - Math.exp(-dt * k));

/* ---------- Preparacion de la escena (funciones de modulo: mutan objetos three) ---------- */

interface Nodos {
  puerta: THREE.Object3D;
  bisagras: THREE.Object3D;
  cajonSup: THREE.Object3D;
  cajonInf: THREE.Object3D;
  grifo: THREE.Object3D;
  sifon: THREE.Object3D;
  lavamanos: Record<IdLavamanos, THREE.Object3D>;
  marmol: Record<IdLavamanos, THREE.MeshPhysicalMaterial>;
}

function nodo(raiz: THREE.Object3D, nombre: string) {
  const o = raiz.getObjectByName(nombre);
  if (!o) throw new Error(`El modelo no trae el grupo ${nombre}`);
  return o;
}

function prepararModelo(raiz: THREE.Object3D, acabado: THREE.Material): Nodos {
  const negro = new THREE.MeshStandardMaterial({ color: '#16171a', metalness: 0.55, roughness: 0.38 });
  const fijos: Record<string, THREE.Material> = {
    GrifoNegro: negro,
    SifonNegro: negro,
    Cromo: new THREE.MeshStandardMaterial({ color: '#e1e3e6', metalness: 1, roughness: 0.14 }),
    Aluminio: new THREE.MeshStandardMaterial({ color: '#c4c7cb', metalness: 1, roughness: 0.28 }),
    TapaBlanca: new THREE.MeshStandardMaterial({ color: '#f3f3f1', metalness: 0.2, roughness: 0.2 }),
  };
  const ids: IdLavamanos[] = ['oslo', 'siena', 'genova', 'parma'];
  // Un marmol por lavamanos: el que sale se desvanece sin tocar al que entra.
  const marmol = Object.fromEntries(
    ids.map((id) => [
      id,
      new THREE.MeshPhysicalMaterial({
        color: '#fbfbf9',
        roughness: 0.13,
        clearcoat: 1,
        clearcoatRoughness: 0.06,
        transparent: true,
      }),
    ])
  ) as Record<IdLavamanos, THREE.MeshPhysicalMaterial>;
  const lavamanos = Object.fromEntries(ids.map((id) => [id, nodo(raiz, `Lavamanos_${id}`)])) as Record<IdLavamanos, THREE.Object3D>;
  for (const id of ids) {
    lavamanos[id].traverse((o) => {
      if ((o as THREE.Mesh).isMesh) (o as THREE.Mesh).material = marmol[id];
    });
  }
  raiz.traverse((o) => {
    const m = o as THREE.Mesh;
    if (!m.isMesh) return;
    m.castShadow = true;
    m.receiveShadow = true;
    const nombre = (m.material as THREE.Material).name;
    if (nombre === 'Acabado') m.material = acabado;
    else if (fijos[nombre]) m.material = fijos[nombre];
  });
  return {
    puerta: nodo(raiz, 'Puerta'),
    bisagras: nodo(raiz, 'Bisagras'),
    cajonSup: nodo(raiz, 'CajonSuperior'),
    cajonInf: nodo(raiz, 'CajonInferior'),
    grifo: nodo(raiz, 'Grifo'),
    sifon: nodo(raiz, 'Sifon'),
    lavamanos,
    marmol,
  };
}

/** Escena lista para animar: materiales, texturas y acabado inicial. */
function montarModelo(raiz: THREE.Object3D, texturas: THREE.Texture[], inicial: number, anisotropia: number) {
  const { material, uniformes } = crearMaterialAcabado();
  const nodos = prepararModelo(raiz, material);
  for (const t of texturas) prepararTextura(t, anisotropia);
  material.map = texturas[inicial];
  uniformes.texturaB.value = material.map;
  return { nodos, material, u: uniformes };
}

/* ---------- Modelo animado ---------- */

interface ModeloProps {
  mueble: MuebleBano;
  acabado: string;
  lavamanos: IdLavamanos;
  abierto: boolean;
  comparar: EscenarioVitelliProps['comparar'];
  reducirMovimiento: boolean;
}

function ModeloVitelli({ mueble, acabado, lavamanos, abierto, comparar, reducirMovimiento }: ModeloProps) {
  const gltf = useGLTF(mueble.modelo, false, true);
  const texturas = useTexture(mueble.acabados.map((a) => a.textura));
  const gl = useThree((s) => s.gl);
  const camara = useThree((s) => s.camera);
  // Objetos three que la animacion muta: viven en un ref, fuera del render.
  const recursos = useRef<null | { nodos: Nodos; material: THREE.MeshStandardMaterial; u: UniformesAcabado }>(null);
  const indice = (id: string) => Math.max(0, mueble.acabados.findIndex((a) => a.id === id));

  const estado = useRef({
    apertura: 0,
    intro: 0,
    acabadoMostrado: acabado,
    barrido: null as null | { hacia: string; t: number },
    lavMostrado: lavamanos,
    cambioLav: null as null | { desde: IdLavamanos; hacia: IdLavamanos; t: number },
    grifo: new THREE.Vector3(...VITELLI_RIG.lavamanos[lavamanos].grifo),
    sifon: new THREE.Vector3(...VITELLI_RIG.lavamanos[lavamanos].sifon),
  });

  const inicial = indice(acabado);
  useLayoutEffect(() => {
    const r = montarModelo(gltf.scene, texturas, inicial, Math.min(8, gl.capabilities.getMaxAnisotropy()));
    recursos.current = r;
    return () => r.material.dispose();
    // Solo al cargar: los cambios de acabado los anima useFrame.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gltf.scene, texturas, gl]);

  const plano = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), -0.5), []);
  const rayo = useMemo(() => new THREE.Raycaster(), []);
  const punto = useMemo(() => new THREE.Vector3(), []);
  const ndc = useMemo(() => new THREE.Vector2(), []);

  useFrame((_, delta) => {
    const r = recursos.current;
    if (!r) return;
    const n = r.nodos;
    const dt = Math.min(delta, 0.05);
    const e = estado.current;
    const u = r.u;
    const mat = r.material;
    const velocidad = reducirMovimiento ? 4 : 1;

    // Entrada: el lavamanos baja y asienta sobre el mueble.
    e.intro = Math.min(1, e.intro + dt * (reducirMovimiento ? 10 : 0.9));

    // Puerta y cajones: escalonados, con frenado de cierre lento al final.
    e.apertura = acercar(e.apertura, abierto ? 1 : 0, dt, 3.2 * velocidad);
    n.puerta.rotation.y = VITELLI_RIG.puerta.anguloAbierta * suave(e.apertura * 1.12);
    n.cajonSup.position.z = VITELLI_RIG.cajones.superior * suave((e.apertura - 0.1) * 1.25);
    n.cajonInf.position.z = VITELLI_RIG.cajones.inferior * suave((e.apertura - 0.2) * 1.3);
    n.bisagras.visible = e.apertura > 0.3;

    // Acabado: comparar manda; si no, barrido hacia el acabado elegido.
    if (comparar) {
      e.barrido = null;
      e.acabadoMostrado = acabado;
      mat.map = texturas[indice(comparar.acabadoB)];
      u.texturaB.value = texturas[indice(acabado)];
      // El corte sigue al deslizador: proyecta su x de pantalla al frente del mueble.
      rayo.setFromCamera(ndc.set(comparar.corte * 2 - 1, 0), camara);
      u.corte.value = rayo.ray.intersectPlane(plano, punto) ? punto.x : 0;
      u.brillo.value = 0.18;
      u.suavizado.value = 0.004;
    } else {
      if (!e.barrido && acabado !== e.acabadoMostrado) {
        e.barrido = { hacia: acabado, t: 0 };
        u.texturaB.value = texturas[indice(acabado)];
      }
      if (e.barrido) {
        e.barrido.t = Math.min(1, e.barrido.t + dt * 1.15 * velocidad);
        const t = e.barrido.t;
        u.corte.value = CORTE_INICIO + (CORTE_FIN - CORTE_INICIO) * suave(t);
        u.brillo.value = Math.sin(Math.PI * t) * 0.55;
        u.suavizado.value = 0.02;
        if (t >= 1) {
          mat.map = texturas[indice(e.barrido.hacia)];
          e.acabadoMostrado = e.barrido.hacia;
          e.barrido = null;
        }
      }
      if (!e.barrido) {
        mat.map = texturas[indice(e.acabadoMostrado)];
        u.texturaB.value = mat.map;
        u.corte.value = CORTE_INICIO - 1;
        u.brillo.value = 0;
      }
    }

    // Lavamanos: el anterior sube y se desvanece; el nuevo baja y asienta.
    if (!e.cambioLav && lavamanos !== e.lavMostrado) {
      e.cambioLav = { desde: e.lavMostrado, hacia: lavamanos, t: 0 };
      e.lavMostrado = lavamanos;
    }
    for (const id of Object.keys(n.lavamanos) as IdLavamanos[]) {
      n.lavamanos[id].visible = false;
      n.lavamanos[id].position.y = 0;
      n.marmol[id].opacity = 1;
    }
    const metaGrifo = VITELLI_RIG.lavamanos[e.lavMostrado].grifo;
    const metaSifon = VITELLI_RIG.lavamanos[e.lavMostrado].sifon;
    let saltoGrifo = 0;
    if (e.cambioLav) {
      const c = e.cambioLav;
      c.t = Math.min(1, c.t + dt * 1.1 * velocidad);
      const sale = Math.min(1, c.t / 0.45);
      const entra = Math.max(0, (c.t - 0.3) / 0.7);
      const viejo = n.lavamanos[c.desde];
      viejo.visible = sale < 1;
      viejo.position.y = suave(sale) * 0.24;
      n.marmol[c.desde].opacity = 1 - suave(sale);
      const nuevo = n.lavamanos[c.hacia];
      nuevo.visible = entra > 0;
      nuevo.position.y = (1 - salidaRebote(entra)) * 0.3;
      n.marmol[c.hacia].opacity = Math.min(1, entra * 3);
      saltoGrifo = Math.sin(Math.PI * c.t) * 0.08;
      if (c.t >= 1) e.cambioLav = null;
    } else {
      const actual = n.lavamanos[e.lavMostrado];
      actual.visible = true;
      actual.position.y = (1 - salidaRebote(e.intro)) * 0.3;
      n.marmol[e.lavMostrado].opacity = Math.min(1, e.intro * 3);
    }
    e.grifo.set(
      acercar(e.grifo.x, metaGrifo[0], dt, 5 * velocidad),
      acercar(e.grifo.y, metaGrifo[1], dt, 5 * velocidad),
      acercar(e.grifo.z, metaGrifo[2], dt, 5 * velocidad)
    );
    e.sifon.set(
      acercar(e.sifon.x, metaSifon[0], dt, 4 * velocidad),
      acercar(e.sifon.y, metaSifon[1], dt, 4 * velocidad),
      acercar(e.sifon.z, metaSifon[2], dt, 4 * velocidad)
    );
    n.grifo.position.copy(e.grifo);
    n.grifo.position.y += saltoGrifo + (1 - salidaRebote(e.intro)) * 0.3;
    n.sifon.position.copy(e.sifon);
  });

  return <primitive object={gltf.scene} />;
}

/* ---------- Estudio: pared, piso, espejo ---------- */

function Estudio() {
  return (
    <group>
      <mesh position={[0, 0.9, -0.004]} receiveShadow>
        <planeGeometry args={[7, 3.4]} />
        <meshStandardMaterial color="#ebe5dc" roughness={0.93} />
      </mesh>
      <mesh position={[0, -0.31, 1.5]} rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[7, 3]} />
        <meshStandardMaterial color="#d8d0c4" roughness={0.88} />
      </mesh>
      {/* Espejo redondo retroiluminado, como en la escena del bano de la landing */}
      <group position={[0, 1.08, 0.012]}>
        <mesh position-z={-0.004}>
          <circleGeometry args={[0.335, 96]} />
          <meshBasicMaterial color="#fff3e0" transparent opacity={0.55} toneMapped={false} />
        </mesh>
        <mesh>
          <circleGeometry args={[0.3, 96]} />
          <meshStandardMaterial color="#e2e6e8" metalness={0.85} roughness={0.08} />
        </mesh>
      </group>
    </group>
  );
}

/* ---------- Camara con encuadres animados ---------- */

function Camara({ vista, vistaPedido, onInteraccion }: { vista: VistaCamara; vistaPedido: number; onInteraccion: () => void }) {
  const controles = useRef<OrbitControlsImpl | null>(null);
  const camara = useThree((s) => s.camera);
  const leer = useThree((s) => s.get);
  const viaje = useRef({ activo: true, pos: new THREE.Vector3(), obj: new THREE.Vector3() });

  useEffect(() => {
    // Aleja la camara en visores verticales (movil) en vez de recortar el
    // mueble. El aspecto se lee al pedir la vista y no en cada resize: en movil
    // la barra del navegador cambia el alto y devolveria la camara sola.
    const { size } = leer();
    const factor = Math.max(1, 1.2 / (size.width / Math.max(1, size.height)));
    const v = VISTAS[vista];
    const obj = new THREE.Vector3(...v.obj);
    viaje.current.obj.copy(obj);
    viaje.current.pos.set(...v.pos).sub(obj).multiplyScalar(factor).add(obj);
    viaje.current.activo = true;
  }, [vista, vistaPedido, leer]);

  useFrame((_, delta) => {
    const c = controles.current;
    const v = viaje.current;
    if (!c || !v.activo) return;
    // Tope de 0.1 s: en equipos lentos el viaje no se eterniza.
    const k = 1 - Math.exp(-Math.min(delta, 0.1) * 2.6);
    camara.position.lerp(v.pos, k);
    c.target.lerp(v.obj, k);
    c.update();
    if (camara.position.distanceTo(v.pos) < 0.003 && c.target.distanceTo(v.obj) < 0.003) v.activo = false;
  });

  return (
    <OrbitControls
      ref={controles}
      makeDefault
      enablePan={false}
      enableDamping
      dampingFactor={0.08}
      minDistance={0.6}
      maxDistance={3.4}
      minPolarAngle={0.04}
      maxPolarAngle={1.52}
      // El mueble va contra la pared: no se rodea por detras.
      minAzimuthAngle={-1.15}
      maxAzimuthAngle={1.15}
      onStart={() => {
        viaje.current.activo = false;
        onInteraccion();
      }}
    />
  );
}

/* ---------- Puntos de interes y cotas ---------- */

function Punto({ posicion, etiqueta, onClick }: { posicion: [number, number, number]; etiqueta: string; onClick: () => void }) {
  return (
    <Html position={posicion} center zIndexRange={[20, 0]}>
      <button
        type="button"
        onClick={onClick}
        aria-label={etiqueta}
        title={etiqueta}
        className="group relative flex h-11 w-11 items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#324354]"
      >
        <span className="absolute h-7 w-7 rounded-full bg-white/70 motion-safe:animate-ping" />
        <span className="relative h-3.5 w-3.5 rounded-full border-2 border-white bg-[#324354] shadow-md transition-transform duration-150 group-hover:scale-125" />
      </button>
    </Html>
  );
}

function Cota({ desde, hasta, texto }: { desde: [number, number, number]; hasta: [number, number, number]; texto: string }) {
  const medio: [number, number, number] = [(desde[0] + hasta[0]) / 2, (desde[1] + hasta[1]) / 2, (desde[2] + hasta[2]) / 2];
  return (
    <group>
      <Line points={[desde, hasta]} color="#324354" lineWidth={1.6} />
      <Html position={medio} center zIndexRange={[15, 0]}>
        <span className="whitespace-nowrap rounded-full bg-[#324354] px-2.5 py-1 text-xs font-semibold text-white shadow-md">
          {texto}
        </span>
      </Html>
    </group>
  );
}

function Cotas({ lavamanos }: { lavamanos: IdLavamanos }) {
  const L = VITELLI_RIG.lavamanos[lavamanos];
  const x = L.ancho / 2;
  const frente = L.fondo + 0.03;
  const arriba = L.alto + 0.06;
  // Media unidad visible (63,5 cm) en vez de redondear a una medida que no es.
  const cm = (m: number) => `${(Math.round(m * 200) / 2).toLocaleString('es-CO')} cm`;
  return (
    <group>
      <Cota desde={[-x, arriba, frente]} hasta={[x, arriba, frente]} texto={`Ancho ${cm(L.ancho)}`} />
      <Cota desde={[x + 0.07, 0, frente]} hasta={[x + 0.07, L.alto, frente]} texto={`Alto ${cm(L.alto)}`} />
      <Cota desde={[x + 0.07, arriba, 0]} hasta={[x + 0.07, arriba, L.fondo]} texto={`Fondo ${cm(L.fondo)}`} />
    </group>
  );
}

function Puntos({ lavamanos, onPunto }: { lavamanos: IdLavamanos; onPunto: (p: PuntoInteres) => void }) {
  const L = VITELLI_RIG.lavamanos[lavamanos];
  const a = VITELLI_RIG.anclas;
  return (
    <group>
      <Punto posicion={[a.cajon[0], a.cajon[1], a.cajon[2]]} etiqueta="Cajones con cierre lento" onClick={() => onPunto('cajon')} />
      <Punto posicion={[a.lavamanos[0], L.alto + 0.004, a.lavamanos[2]]} etiqueta="Lavamanos" onClick={() => onPunto('lavamanos')} />
      <Punto
        posicion={[a.grifo[0] + L.grifo[0], a.grifo[1] + L.grifo[1], a.grifo[2] + L.grifo[2]]}
        etiqueta="Grifería"
        onClick={() => onPunto('grifo')}
      />
    </group>
  );
}

/* ---------- Escenario ---------- */

function Escena(props: EscenarioVitelliProps) {
  const { mueble, acabado, lavamanos, abierto, comparar, reducirMovimiento, onListo } = props;
  const avisado = useRef(false);
  useFrame(() => {
    if (!avisado.current) {
      avisado.current = true;
      onListo();
    }
  });
  return (
    <>
      <color attach="background" args={['#efe9e1']} />
      <ambientLight intensity={0.25} />
      <directionalLight
        position={[-1.4, 2.6, 2.3]}
        intensity={1.7}
        color="#fff6ea"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
        shadow-camera-left={-1.3}
        shadow-camera-right={1.3}
        shadow-camera-top={1.6}
        shadow-camera-bottom={-0.8}
        shadow-camera-near={0.5}
        shadow-camera-far={7}
      />
      {/* Ambiente local (sin HDR de CDN): caja de luz cenital, ventana calida, relleno frio */}
      <Environment resolution={256} frames={1}>
        {/* Fondo calido del cuarto: sin el, a ras el marmol y los metales reflejan negro */}
        <color attach="background" args={['#cfc7bb']} />
        <Lightformer form="rect" intensity={2.2} position={[0, 3, 1.4]} rotation-x={Math.PI / 2} scale={[4, 2.4, 1]} />
        <Lightformer form="rect" intensity={2.6} color="#fff0dc" position={[-3, 1.4, 1.6]} rotation-y={Math.PI / 2} scale={[2.4, 2.8, 1]} />
        <Lightformer form="rect" intensity={0.9} color="#e4ecf4" position={[3, 1.2, 1.4]} rotation-y={-Math.PI / 2} scale={[2.2, 2.2, 1]} />
        <Lightformer form="rect" intensity={1.1} position={[0, 0.8, 4]} rotation-y={Math.PI} scale={[3.2, 1.4, 1]} />
      </Environment>
      <Estudio />
      <ModeloVitelli
        mueble={mueble}
        acabado={acabado}
        lavamanos={lavamanos}
        abierto={abierto}
        comparar={comparar}
        reducirMovimiento={reducirMovimiento}
      />
      {props.medidas && <Cotas lavamanos={lavamanos} />}
      {props.puntosVisibles && <Puntos lavamanos={lavamanos} onPunto={props.onPunto} />}
      <Camara vista={props.vista} vistaPedido={props.vistaPedido} onInteraccion={props.onInteraccion} />
    </>
  );
}

export default function EscenarioVitelli3D(props: EscenarioVitelliProps) {
  const { progress } = useProgress();
  const { onProgreso } = props;
  useEffect(() => onProgreso(progress), [progress, onProgreso]);
  const lav = props.mueble.lavamanos.find((l) => l.id === props.lavamanos);
  const acab = props.mueble.acabados.find((a) => a.id === props.acabado);
  return (
    <Canvas
      // PCF: three r186 ya no trae PCFSoftShadowMap (el valor por defecto de r3f).
      shadows="percentage"
      dpr={[1, 1.8]}
      frameloop={props.activo ? 'always' : 'never'}
      camera={{ fov: 32, near: 0.05, far: 20, position: [1.9, 1.5, 2.9] }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      role="img"
      aria-label={`Mueble ${props.mueble.nombre} en acabado ${acab?.nombre ?? ''} con lavamanos ${lav?.nombre ?? ''}, en 3D`}
    >
      <React.Suspense fallback={null}>
        <Escena {...props} />
      </React.Suspense>
    </Canvas>
  );
}
