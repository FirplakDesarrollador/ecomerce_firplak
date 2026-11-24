import ast,json
from pathlib import Path
import bpy
ROOT=Path(__file__).resolve().parents[2]
PILOT=ROOT/'assets-fuente/generativo-63x48/piloto-ventana-calida-34'
OUT=ROOT/'assets-fuente/generativo-63x48/piloto-capas';OUT.mkdir(exist_ok=True)
source=ROOT/'scripts/modelos-3d/render-en-ambiente.py'
tree=ast.parse(source.read_text(encoding='utf-8-sig'))
tree.body=[n for n in tree.body if not(isinstance(n,ast.Expr) and isinstance(n.value,ast.Call) and isinstance(n.value.func,ast.Name) and n.value.func.id=='main')]
lib={'__file__':str(source),'__name__':'layer_library'};exec(compile(tree,str(source),'exec'),lib)
def setup(basin):
 bpy.ops.wm.open_mainfile(filepath=str(PILOT/'referencia-ambiente-34-v3-completo.blend'))
 pref=bpy.context.preferences.addons['cycles'].preferences;pref.compute_device_type='HIP';pref.refresh_devices()
 for d in pref.devices:d.use=d.type!='CPU'
 s=bpy.context.scene;s.cycles.device='GPU';s.cycles.samples=64
 s.render.film_transparent=True;s.render.image_settings.color_mode='RGBA'
 objects=lib['cargar_producto'](basin,str(ROOT/'public/images/muebles/vitelli-63/acabados/soder.webp'))
 projector=s.camera.copy();projector.data=s.camera.data.copy();s.collection.objects.link(projector)
 lib['proyectar_fondo'](str(PILOT/'fondo-A-placa.png'),projector,.8)
 s.camera.data.lens=100;s.camera.data.shift_x=s.camera.data.shift_y=0
 s.render.resolution_x=s.render.resolution_y=1600
 for o in bpy.data.objects:
  if lib['es_greybox'](o):o.visible_camera=False;o.visible_shadow=False
 return s,objects

def kind(o):
 if o.name.startswith(('Lavamanos_','Grifo_')):return 'lavamanos'
 if o.name.startswith(('Carcasa_','Puerta_','CajonSuperior_','CajonInferior_','Bisagras_')):return 'mueble'
 return 'otro'

def emission(name,v):
 m=bpy.data.materials.new(name);m.use_nodes=True;n=m.node_tree.nodes;n.clear()
 e=n.new('ShaderNodeEmission');e.inputs['Color'].default_value=(v,v,v,1)
 o=n.new('ShaderNodeOutputMaterial');m.node_tree.links.new(e.outputs[0],o.inputs[0]);return m

for basin in ['oslo','genova']:
 s,objects=setup(basin)
 white,black=emission('MaskWhite',1),emission('MaskBlack',0)
 s.view_settings.view_transform='Standard';s.cycles.samples=32;s.cycles.use_denoising=False
 s.world.node_tree.nodes['Background'].inputs['Strength'].default_value=0
 for o in objects:
  o.data.materials.clear();o.data.materials.append(white if kind(o)=='lavamanos' else black)
 s.render.filepath=str(OUT/f'mascara-lavamanos-{basin}.png');bpy.ops.render.render(write_still=True)
 if basin=='oslo':
  for o in objects:
   o.data.materials.clear();o.data.materials.append(white if kind(o)=='mueble' else black)
  s.render.filepath=str(OUT/'mascara-mueble-visible.png');bpy.ops.render.render(write_still=True)
s,objects=setup('oslo')
for o in objects:
 if kind(o)!='mueble':o.hide_render=True
s.render.filepath=str(OUT/'mueble-completo-render.png');bpy.ops.render.render(write_still=True)
receiver=lib['principled']('ShadowReceiver',(.8,.8,.8),.9)
for o in bpy.data.objects:
 if lib['es_greybox'](o):
  o.data.materials.clear();o.data.materials.append(receiver);o.visible_camera=True;o.visible_shadow=True;o.is_shadow_catcher=True
for o in objects:o.visible_camera=False
s.render.filepath=str(OUT/'sombra-vitelli.png');bpy.ops.render.render(write_still=True)
print('INDEPENDENT_LAYERS_RENDERED',OUT)
