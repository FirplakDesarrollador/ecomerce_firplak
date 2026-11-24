import ast,json
from pathlib import Path
import bpy
ROOT=Path(r'C:/Users/isaza/OneDrive/Documentos/FIRPLAK e-commerce')
SRC=ROOT/'.claude/worktrees/bulk-3d-renders-coherence-6da73f/scripts/modelos-3d/render-en-ambiente.py'
OUT=ROOT/'assets-fuente/generativo-63x48/piloto-ventana-calida-34'
tree=ast.parse(SRC.read_text(encoding='utf-8-sig'))
tree.body=[n for n in tree.body if not(isinstance(n,ast.Expr) and isinstance(n.value,ast.Call) and isinstance(n.value.func,ast.Name) and n.value.func.id=='main')]
lib={'__file__':str(SRC),'__name__':'pilot_library'}
exec(compile(tree,str(SRC),'exec'),lib)

def hip():
 p=bpy.context.preferences.addons['cycles'].preferences
 p.compute_device_type='HIP';p.refresh_devices()
 for d in p.devices:d.use=d.type!='CPU'
 bpy.context.scene.cycles.device='GPU'

def emission(name,value):
 m=bpy.data.materials.new(name);m.use_nodes=True
 nodes=m.node_tree.nodes;nodes.clear()
 e=nodes.new('ShaderNodeEmission');e.inputs['Color'].default_value=(value,value,value,1)
 o=nodes.new('ShaderNodeOutputMaterial');m.node_tree.links.new(e.outputs[0],o.inputs[0])
 return m

def is_furniture(o):
 while o:
  if o.name=='Mueble':return True
  o=o.parent
 return False

for basin in ['oslo','genova']:
 bpy.ops.wm.open_mainfile(filepath=str(OUT/'referencia-ambiente-34-v3-completo.blend'))
 hip();s=bpy.context.scene;s.cycles.samples=96
 s.render.film_transparent=True;s.render.image_settings.color_mode='RGBA'
 cam=s.camera
 objects=lib['cargar_producto'](basin,str(ROOT/'public/images/muebles/vitelli-63/acabados/soder.webp'))
 projector=cam.copy();projector.data=cam.data.copy();s.collection.objects.link(projector)
 lib['proyectar_fondo'](str(OUT/'fondo-A-placa.png'),projector,0.8)
 cam.data.lens=100;cam.data.shift_x=cam.data.shift_y=0
 s.render.resolution_x=s.render.resolution_y=1600
 folder=OUT/basin;folder.mkdir(exist_ok=True)
 for o in bpy.data.objects:
  if lib['es_greybox'](o):o.visible_camera=False;o.visible_shadow=False
 s.render.filepath=str(folder/'producto.png');bpy.ops.render.render(write_still=True)
 # Binary material mask from the actual camera; preserves the angled 3/4 seam.
 white=emission('FurnitureMask',1);black=emission('OtherMask',0)
 material_backup={o.name:list(o.data.materials) for o in objects}
 for o in objects:
  o.data.materials.clear();o.data.materials.append(white if is_furniture(o) else black)
 s.view_settings.view_transform='Standard';s.world.node_tree.nodes['Background'].inputs['Strength'].default_value=0
 s.cycles.samples=4
 s.render.filepath=str(folder/'mascara-mueble.png');bpy.ops.render.render(write_still=True)
 for o in objects:
  o.data.materials.clear()
  for mat in material_backup[o.name]:o.data.materials.append(mat)
 s.view_settings.view_transform='AgX';s.world.node_tree.nodes['Background'].inputs['Strength'].default_value=.6
 s.cycles.samples=96
 receiver=lib['principled']('ReceptorSombra',(.8,.8,.8),.9)
 for o in bpy.data.objects:
  if lib['es_greybox'](o):
   o.data.materials.clear();o.data.materials.append(receiver)
   o.visible_camera=True;o.is_shadow_catcher=True;o.visible_shadow=True
 for o in objects:o.visible_camera=False
 s.render.filepath=str(folder/'sombra.png');bpy.ops.render.render(write_still=True)
 print('COMPLETED_PRODUCT',basin,flush=True)
