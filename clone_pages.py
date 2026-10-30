import subprocess, os, re

pages = [
"/brumadinho","/brumadinho/agenda","/brumadinho/clipping","/brumadinho/documentos",
"/brumadinho/duvidas","/brumadinho/fale-conosco","/brumadinho/formularios",
"/brumadinho/galeria-de-fotos","/brumadinho/glossario","/brumadinho/governanca",
"/brumadinho/historico-do-projeto",
"/brumadinho/noticia/comunicado-cronograma-de-pagamentos-do-ptr-e-do-pe",
"/brumadinho/noticia/comunicado-encerramento-do-ptr",
"/brumadinho/noticia/comunicado-novo-auxilio-emergencial-4",
"/brumadinho/noticia/comunicado-pagamento-nae",
"/brumadinho/noticia/informe-de-rendimentos-para-o-imposto-de-renda-2026-ja-disponivel",
"/brumadinho/noticia/nova-agenda-de-atendimento-nae",
"/brumadinho/noticias","/brumadinho/ouvidoria","/brumadinho/publicacoes",
"/brumadinho/transparencia","/brumadinho/videos",
"/node/2290","/node/2395","/noticias/60",
]

all_asset_paths = set()

for page in pages:
    outdir = "." + page
    os.makedirs(outdir, exist_ok=True)
    outfile = outdir + "/index.html"
    url = "https://ptr.fgv.br" + page
    r = subprocess.run(["curl","-s","--http1.1",url,"-o",outfile], capture_output=True)
    if not os.path.exists(outfile) or os.path.getsize(outfile) < 100:
        print("FAIL fetch", page)
        continue
    html = open(outfile, encoding='utf-8', errors='replace').read()
    # rewrite absolute urls to relative
    html = html.replace('https://ptr.fgv.br/', '/')
    open(outfile,'w',encoding='utf-8').write(html)
    # collect asset paths
    for m in re.finditer(r'(?:href|src|poster|data-src|data-lazy-src)="([^"]+)"', html):
        u = m.group(1)
        if u.startswith('/'):
            all_asset_paths.add(u.split('?')[0])
    for m in re.finditer(r'url\(([^)]+)\)', html):
        u = m.group(1).strip().strip("'\"")
        if u.startswith('/'):
            all_asset_paths.add(u.split('?')[0])
    for m in re.finditer(r'srcset="([^"]+)"', html):
        for part in m.group(1).split(','):
            u = part.strip().split()[0]
            if u.startswith('/'):
                all_asset_paths.add(u.split('?')[0])
    print("OK", page, len(html))

# save asset list
with open('all_asset_paths.txt','wb') as f:
    for p in sorted(all_asset_paths):
        f.write((p+'\n').encode())
print("total unique assets:", len(all_asset_paths))
