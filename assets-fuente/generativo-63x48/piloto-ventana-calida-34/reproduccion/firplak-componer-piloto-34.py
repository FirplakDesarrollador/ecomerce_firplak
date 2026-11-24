from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import numpy as np,json
out=Path(r'C:/Users/isaza/OneDrive/Documentos/FIRPLAK e-commerce/assets-fuente/generativo-63x48/piloto-ventana-calida-34')
meta=json.loads((out/'encuadre-v3.json').read_text())
plate=Image.open(out/'fondo-A-placa.png').convert('RGB')
box=tuple(meta['product_crop_in_background'])
background=plate.resize((1600,1600),Image.Resampling.LANCZOS,box=box)
background.save(out/'fondo-cuadro-producto.png')
report={}
for basin in ['oslo','genova']:
 p=out/basin
 product=Image.open(p/'producto.png').convert('RGBA')
 a=np.asarray(product,dtype=np.float32)/255
 f=np.asarray(background,dtype=np.float32)/255
 shadow=np.asarray(Image.open(p/'sombra.png').convert('RGBA'),dtype=np.float32)[...,3:4]/255
 back=f*(1-shadow)
 comp=np.clip(a[...,:3]*a[...,3:4]+back*(1-a[...,3:4]),0,1)
 Image.fromarray(np.uint8(comp*255+.5)).save(p/'compuesto.png')
 Image.fromarray(np.uint8(np.clip(back,0,1)*255+.5)).save(p/'fondo-sombra.png')
 mask=Image.open(p/'mascara-mueble.png').convert('RGBA')
 ma=np.asarray(mask,dtype=np.float32)/255
 material_mask=np.uint8(np.clip(ma[...,:3].mean(-1)*ma[...,3],0,1)*255+.5)
 Image.fromarray(material_mask).save(p/'mascara-mueble-gris.png')
 assert (material_mask>240).sum()>100000,'Missing furniture mask'
 bbox=product.getchannel('A').getbbox()
 assert bbox[0]>4 and bbox[1]>4 and bbox[2]<1596 and bbox[3]<1596, bbox
 report[basin]={'product_bbox':bbox,'furniture_pixels':int((material_mask>240).sum()),'shadow_max':float(shadow.max()),'shadow_pixels':int((shadow>.05).sum())}
(out/'revision-montajes.json').write_text(json.dumps(report,indent=2))
print(json.dumps(report))
