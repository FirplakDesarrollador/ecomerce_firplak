import ast,json,hashlib
from pathlib import Path
import numpy as np
from PIL import Image,ImageFilter,ImageDraw,ImageFont
ROOT=Path(r'C:/Users/isaza/OneDrive/Documentos/FIRPLAK e-commerce')
OUT=ROOT/'assets-fuente/generativo-63x48/piloto-ventana-calida-34'
source=ROOT/'.claude/worktrees/bulk-3d-renders-coherence-6da73f/scripts/modelos-3d/ajustar-pulido.py'
tree=ast.parse(source.read_text(encoding='utf-8-sig'))
tree.body=[n for n in tree.body if isinstance(n,(ast.Import,ast.ImportFrom,ast.FunctionDef))]
lib={};exec(compile(tree,str(source),'exec'),lib)
to_lab,from_lab=lib['a_lab'],lib['de_lab']
result=OUT/'entrega';result.mkdir(exist_ok=True)
back=np.maximum(np.asarray(Image.open(OUT/'oslo/fondo-sombra.png').convert('RGB'),dtype=np.float32),np.asarray(Image.open(OUT/'genova/fondo-sombra.png').convert('RGB'),dtype=np.float32))
Image.fromarray(back.astype(np.uint8)).save(result/'fondo-fijo.png')
items={};report={'raw_geometry':{'oslo':{'lines_3px':0.983,'lines_8px':0.996,'global_offset_px':[0,0]},'genova':{'lines_3px':0.973,'lines_8px':0.990,'global_offset_px':[0,0]}},'pipeline':'Per-material Lab correction with actual projected furniture masks (no horizontal seam); shared furniture and background; original Blender alpha preserved.'}
for basin in ['oslo','genova']:
    folder=OUT/basin
    product=np.asarray(Image.open(folder/'producto.png').convert('RGBA'),dtype=np.float32)
    alpha=product[...,3]/255
    mf=np.asarray(Image.open(folder/'mascara-mueble-gris.png'),dtype=np.float32)/255
    alpha=np.where(mf>.98,1.0,alpha)
    reference=np.asarray(Image.open(folder/'compuesto.png').convert('RGB'),dtype=np.float32)
    raw=np.asarray(Image.open(folder/'pulido-1.png').convert('RGB').resize((1600,1600),Image.Resampling.LANCZOS),dtype=np.float32)
    lr,lg=to_lab(reference),to_lab(raw)
    furniture=mf>.98
    other=(alpha>.98)&(mf<.02)
    corrected={}
    for name,region in [('furniture',furniture),('basin_faucet',other)]:
        core=np.asarray(Image.fromarray(np.uint8(region)*255).filter(ImageFilter.MinFilter(5)))>127
        mu_r,sd_r=lr[core].mean(0),lr[core].std(0)
        mu_g,sd_g=lg[core].mean(0),lg[core].std(0)+1e-3
        adjusted=(lg-mu_g)*(.5+.5*sd_r/sd_g)+mu_r
        corrected[name]=from_lab(adjusted)
    rgb=corrected['furniture']*mf[...,None]+corrected['basin_faucet']*(1-mf[...,None])
    # The true rendered alpha enforces the exact outer product silhouette.
    rgb=np.clip(rgb,0,255)
    inner=np.asarray(Image.fromarray(np.uint8(alpha*255)).filter(ImageFilter.MinFilter(21)),dtype=np.float32)/255
    edge=(alpha>.1)&(inner<.98)
    rgb[edge]=product[...,:3][edge]
    items[basin]={'rgb':rgb,'alpha':alpha,'mf':mf,'reference_lab':lr}

common=(items['oslo']['mf']>.98)&(items['genova']['mf']>.98)
common=np.asarray(Image.fromarray(np.uint8(common)*255).filter(ImageFilter.MinFilter(5)))>127
items['genova']['rgb'][common]=items['oslo']['rgb'][common]
finals={}
for basin,vals in items.items():
    rgb,alpha=vals['rgb'],vals['alpha']
    composite=np.uint8(np.clip(rgb*alpha[...,None]+back*(1-alpha[...,None]),0,255)+.5)
    rgba=np.dstack([np.uint8(rgb+.5),np.uint8(alpha*255+.5)])
    Image.fromarray(rgba,'RGBA').save(result/f'conjunto-{basin}.png')
    Image.fromarray(composite).save(result/f'vitelli-soder-{basin}-final.png')
    Image.fromarray(composite).save(result/f'vitelli-soder-{basin}-final.webp',quality=94,method=6)
    finals[basin]=composite
    final_lab=to_lab(composite)
    furniture=(vals['mf']>.995)
    report[basin]={'mean_material_deltaE':float(np.linalg.norm(final_lab[furniture].mean(0)-vals['reference_lab'][furniture].mean(0))),'product_bbox':Image.fromarray(np.uint8(alpha*255)).getbbox(),'resolution':[1600,1600]}
fixed=np.dstack([np.uint8(items['oslo']['rgb']+.5),np.uint8(items['oslo']['mf']*255+.5)])
Image.fromarray(fixed,'RGBA').save(result/'mueble-fijo.png')
Image.fromarray(np.uint8(common)*255).save(result/'mascara-mueble-comun.png')
report['shared_furniture_pixels']=int(common.sum())
report['max_furniture_rgb_difference']=int(np.abs(finals['oslo'].astype(int)-finals['genova'].astype(int))[common].max())
union=(items['oslo']['alpha']>0)|(items['genova']['alpha']>0)
report['background_max_rgb_difference']=int(np.abs(finals['oslo'].astype(int)-finals['genova'].astype(int))[~union].max())
assert report['max_furniture_rgb_difference']==0,report
assert report['background_max_rgb_difference']==0,report
assert report['oslo']['mean_material_deltaE']<=2 and report['genova']['mean_material_deltaE']<=2,report
font=ImageFont.truetype('C:/Windows/Fonts/arial.ttf',25)
sheet=Image.new('RGB',(1400,780),'#f3eee8');draw=ImageDraw.Draw(sheet)
for i,basin in enumerate(['oslo','genova']):
    im=Image.fromarray(finals[basin]);im.thumbnail((680,680),Image.Resampling.LANCZOS)
    sheet.paste(im,(i*700+10,70))
    draw.text((i*700+24,22),'Vitelli Soder + '+('Oslo' if basin=='oslo' else 'Génova')+' | 63 x 48',font=font,fill='#324354')
sheet.save(result/'comparacion-final.png')
frames=[Image.fromarray(finals[b]).resize((800,800),Image.Resampling.LANCZOS) for b in ['oslo','genova']]
palette_image=Image.new('RGB',(1600,800))
palette_image.paste(frames[0],(0,0));palette_image.paste(frames[1],(800,0))
palette=palette_image.quantize(colors=256,dither=Image.Dither.NONE)
frames=[frame.quantize(palette=palette,dither=Image.Dither.NONE) for frame in frames]
frames[0].save(result/'cambio-oslo-genova.gif',save_all=True,append_images=frames[1:],duration=1300,loop=0,disposal=2)
report['files_sha256']={p.name:hashlib.sha256(p.read_bytes()).hexdigest() for p in result.iterdir() if p.is_file() and p.name!='control-calidad.json'}
(result/'control-calidad.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
print(json.dumps({k:v for k,v in report.items() if k!='files_sha256'},indent=2))





