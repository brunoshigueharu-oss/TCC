"""Constrói os SVGs em unidades geométricas; executar a partir desta pasta."""
from pathlib import Path
from math import sin, cos, sqrt, radians
from html import escape
import xml.etree.ElementTree as ET

RAIZ = Path(__file__).resolve().parent.parent
ROXO = '#674b7b'
ESCURO = '#3d294f'
MEIO = '#523960'
PRETO = '#211915'
GUIA = '#957da7'
ET.register_namespace('', 'http://www.w3.org/2000/svg')
ET.register_namespace('inkscape', 'http://www.inkscape.org/namespaces/inkscape')

def n(v):
    return f'{v:.6f}'.rstrip('0').rstrip('.')

def pt(p):
    return f'{n(p[0])} {n(p[1])}'

def polar(cx, cy, r, a):
    return (cx+r*cos(radians(a)), cy+r*sin(radians(a)))

def esp(p):
    return (600-p[0], p[1])

def grupo(id, conteudo, **attrs):
    s = ' '.join(f'{k.replace("_", "-")}="{v}"' for k,v in attrs.items())
    return f'<g id="{id}" {s}>{conteudo}</g>'

def camada(id, nome, conteudo):
    return f'<g id="{id}" inkscape:groupmode="layer" inkscape:label="{nome}">{conteudo}</g>'

def path(id, d, fill=PRETO, **attrs):
    s = ' '.join(f'{k.replace("_", "-")}="{v}"' for k,v in attrs.items())
    return f'<path id="{id}" d="{d}" fill="{fill}" {s}/>'

def circle(id,x,y,r,fill,**attrs):
    s=' '.join(f'{k.replace("_", "-")}="{v}"' for k,v in attrs.items())
    return f'<circle id="{id}" cx="{n(x)}" cy="{n(y)}" r="{n(r)}" fill="{fill}" {s}/>'

def rect(id,x,y,w,h,fill,**attrs):
    s=' '.join(f'{k.replace("_", "-")}="{v}"' for k,v in attrs.items())
    return f'<rect id="{id}" x="{n(x)}" y="{n(y)}" width="{n(w)}" height="{n(h)}" fill="{fill}" {s}/>'

def ellipse(id,x,y,rx,ry,rot,fill,**attrs):
    s=' '.join(f'{k.replace("_", "-")}="{v}"' for k,v in attrs.items())
    return f'<ellipse id="{id}" cx="{n(x)}" cy="{n(y)}" rx="{n(rx)}" ry="{n(ry)}" transform="rotate({n(rot)} {n(x)} {n(y)})" fill="{fill}" {s}/>'

def anel(id,x,y,re,ri,fill):
    return path(id, circulo_d(x,y,re)+' '+circulo_d(x,y,ri),fill,fill_rule='evenodd')

def circulo_d(x,y,r):
    return f'M{n(x-r)} {n(y)} A{n(r)} {n(r)} 0 1 0 {n(x+r)} {n(y)} A{n(r)} {n(r)} 0 1 0 {n(x-r)} {n(y)} Z'

def elipse_d(x,y,rx,ry):
    return f'M{n(x-rx)} {n(y)} A{n(rx)} {n(ry)} 0 1 0 {n(x+rx)} {n(y)} A{n(rx)} {n(ry)} 0 1 0 {n(x-rx)} {n(y)} Z'

def texto(x,y,conteudo,tam=18,fill=PRETO,peso=400,ancora='start'):
    return f'<text x="{x}" y="{y}" font-family="Arial, Helvetica, sans-serif" font-size="{tam}" font-weight="{peso}" fill="{fill}" text-anchor="{ancora}">{escape(conteudo)}</text>'

def svg(nome, titulo, desc, conteudo,w=600,h=600,view=None):
    view=view or f'0 0 {w} {h}'
    s=f'''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" width="{w}" height="{h}" viewBox="{view}" role="img" aria-labelledby="titulo descricao">
<title id="titulo">{escape(titulo)}</title>
<desc id="descricao">{escape(desc)}</desc>
{conteudo}
</svg>'''
    raiz=ET.fromstring(s)
    ET.indent(raiz, space='  ')
    s='<?xml version="1.0" encoding="UTF-8"?>\n'+ET.tostring(raiz,encoding='unicode')+'\n'
    (RAIZ/nome).write_text(s,encoding='utf-8')
    return s

# Logo: elipses geradoras espelhadas e círculo craniano.
def e(t):
    a=radians(t)
    return (200+(90*cos(a)-70*sin(a))/sqrt(2),295+(90*cos(a)+70*sin(a))/sqrt(2))

def raiz_bissecao(f,a,b):
    for _ in range(80):
        m=(a+b)/2
        if f(a)*f(m)<=0:b=m
        else:a=m
    return (a+b)/2

t_inter=raiz_bissecao(lambda t:(e(t)[0]-300)**2+(e(t)[1]-215)**2-180**2,140,200)
P=e(t_inter)
T=e(-45)
t_base=raiz_bissecao(lambda t:e(t)[1]-325,-45,0)
B=e(t_base)
W=e(120)
# Pé e braço oblíquo terminam no círculo de raio 17u, centro (30u,40u).
F25=polar(300,400,170,25)
F45=polar(300,400,170,45)
F65=polar(300,400,170,65)
F83=polar(300,400,170,83)
VALE=polar(300,400,80,55)

def base_fan():
    # Sentido horário, a partir da ponta da asa direita.
    return (f'A160 160 0 0 1 390 425 L{pt(F25)} A170 170 0 0 1 {pt(F45)} '
            f'L{pt(VALE)} L{pt(F65)} A170 170 0 0 1 {pt(F83)} L300 510 '
            f'L{pt(esp(F83))} A170 170 0 0 1 {pt(esp(F65))} L{pt(esp(VALE))} '
            f'L{pt(esp(F45))} A170 170 0 0 1 {pt(esp(F25))} L210 425 A160 160 0 0 1 84 315')

cabeca_d=(f'M{pt(P)} A180 180 0 1 1 {pt(esp(P))} '
          f'A90 70 -45 0 0 {pt(esp(T))} L{pt(T)} A90 70 45 0 0 {pt(P)} Z')
corpo_d=(f'M84 315 L{pt(W)} A90 70 45 0 0 {pt(B)} '
         f'L{pt(esp(B))} A90 70 -45 0 0 {pt(esp(W))} L516 315 '+base_fan()+' Z')

def logo():
    s=path('cabeca-circular',cabeca_d)+path('corpo-e-seis-tentaculos',corpo_d)
    for lado,x,rot in [('esquerdo',200,45),('direito',400,-45)]:
        d=elipse_d(x,295,70,50)+' '+elipse_d(x,295,45,32.5)
        s+=path('aro-'+lado,d,fill_rule='evenodd',transform=f'rotate({rot} {x} 295)')
        s+=rect('pupila-'+lado,x-22.5,288.75,45,12.5,PRETO,transform=f'rotate({rot} {x} 295)')
    return s

# Versão óptica: contorno unido e uma abertura em cada olho.
def micro():
    x=sqrt(180**2-100**2)
    d=f'M{n(300-x)} 315 A180 180 0 1 1 {n(300+x)} 315 L516 315 '+base_fan()+f' L{n(300-x)} 315 Z'
    # Converte cada elipse rotacionada para um subcaminho de arcos elípticos.
    for cx,rot in [(210,45),(390,-45)]:
        dx=64*cos(radians(rot));dy=64*sin(radians(rot))
        d+=f' M{n(cx-dx)} {n(295-dy)} A64 48 {rot} 1 0 {n(cx+dx)} {n(295+dy)} A64 48 {rot} 1 0 {n(cx-dx)} {n(295-dy)} Z'
    s=path('silhueta-com-aberturas-opticas',d,fill_rule='evenodd')
    for lado,cx,rot in [('esquerda',210,45),('direita',390,-45)]:
        s+=rect('pupila-optica-'+lado,cx-22.5,283.75,45,22.5,PRETO,transform=f'rotate({rot} {cx} 295)')
    return s

# Mascote: todos os contornos são círculos, elipses ou arcos circulares.
def braco(id,esquerdo=False):
    d='M345 365 A90 90 0 0 0 525 365 A17.5 17.5 0 0 0 490 365 A55 55 0 0 1 380 365 Z'
    s=path(id,d,ESCURO)
    return grupo(id+'-espelho',s,transform='translate(600 0) scale(-1 1)') if esquerdo else s

def pernas():
    s=''
    for lado,cx,rot in [('esquerdo',240,-6),('direito',360,6)]:
        s+=ellipse('tentaculo-externo-'+lado,cx,420,20,140,rot,ESCURO)
    for lado,cx,rot in [('esquerdo',280,-4),('direito',320,4)]:
        s+=ellipse('tentaculo-interno-'+lado,cx,420,25,150,rot,MEIO)
    return s

def mascote(duplo=False,atento=False):
    s=braco('braco-direito')
    if duplo:s+=braco('braco-esquerdo',True)
    s+=pernas()
    s+=circle('cabeca',300,200,170,ROXO)
    s+=rect('ponte-dos-oculos',170,211.25,260,17.5,PRETO)
    for lado,x in [('esquerdo',170),('direito',430)]:
        s+=anel('armacao-'+lado,x,220,115,97.5,PRETO)
        # Recobre a ponte no interior do aro com o disco de preenchimento.
        s+=circle('interior-do-aro-'+lado,x,220,97.5,ROXO)
        s+=circle('olho-'+lado,x,220,75,'#ffffff')
        if atento:
            s+=circle('pupila-atenta-'+lado,x,220,20,PRETO)
        else:
            s+=rect('pupila-'+lado,x-33.75,212.5,67.5,15,PRETO)
    s+=path('sorriso','M277.5 295 H322.5 A22.5 22.5 0 0 1 277.5 295 Z','#ffffff')
    if duplo:
        # Ventosas na linha média do anel; só três em cada braço.
        for lado in ['direita','esquerda']:
            for i,a in enumerate([35,65,95]):
                p=polar(435,365,72.5,a)
                if lado=='esquerda':p=esp(p)
                s+=circle(f'ventosa-{lado}-{i+1}',*p,5.5,ROXO)
    return s

# União exata do círculo da cabeça e dos dois círculos das bochechas.
def inter_circulos(c0,r0,c1,r1):
    dx=c1[0]-c0[0];dy=c1[1]-c0[1];d=sqrt(dx*dx+dy*dy)
    a=(r0*r0-r1*r1+d*d)/(2*d);h=sqrt(r0*r0-a*a)
    x=c0[0]+a*dx/d;y=c0[1]+a*dy/d
    return ((x-h*dy/d,y+h*dx/d),(x+h*dy/d,y-h*dx/d))

def familia():
    cruz=inter_circulos((300,210),170,(190,255),92)
    superior=min(cruz,key=lambda p:p[1]);inferior=max(cruz,key=lambda p:p[1])
    d=(f'M{pt(superior)} A170 170 0 0 1 {pt(esp(superior))} '
       f'A92 92 0 0 1 {pt(esp(inferior))} A170 170 0 0 1 {pt(inferior)} '
       f'A92 92 0 0 1 {pt(superior)} Z')
    for cx in [190,410]:d+=' '+circulo_d(cx,255,65)
    # Corpo começa abaixo dos olhos: as aberturas são transparentes reais.
    s=path('tentaculos-em-leque','M170 340 H430 L516 355 A145 145 0 0 1 390 425 L'+pt(F25)+' A170 170 0 0 1 '+pt(F45)+' L'+pt(VALE)+' L'+pt(F65)+' A170 170 0 0 1 '+pt(F83)+' L300 510 L'+pt(esp(F83))+' A170 170 0 0 1 '+pt(esp(F65))+' L'+pt(esp(VALE))+' L'+pt(esp(F45))+' A170 170 0 0 1 '+pt(esp(F25))+' L210 425 A145 145 0 0 1 84 355 Z')
    s+=path('cabeca-e-armacoes-circulares',d,fill_rule='evenodd')
    for lado,x in [('esquerda',190),('direita',410)]:s+=rect('pupila-'+lado,x-30,247.5,60,15,PRETO)
    return s

# Pranchas: rótulos e cotas ficam fora da camada de arte.
def linha(x1,y1,x2,y2,**attrs):
    at=' '.join(f'{k.replace("_", "-")}="{v}"' for k,v in attrs.items())
    return f'<line x1="{n(x1)}" y1="{n(y1)}" x2="{n(x2)}" y2="{n(y2)}" {at}/>'

def grade():
    s=''
    for v in range(0,601,10):
        op='.3' if v%50==0 else '.12'
        s+=linha(v,0,v,600,stroke=GUIA,stroke_width='.65',opacity=op)
        s+=linha(0,v,600,v,stroke=GUIA,stroke_width='.65',opacity=op)
    return grupo('malha-de-um-modulo',s)

def cruz(x,y):
    return linha(x-5,y,x+5,y)+linha(x,y-5,x,y+5)

def cota_h(x1,x2,y,rotulo):
    s=linha(x1,y,x2,y)+linha(x1,y-5,x1,y+5)+linha(x2,y-5,x2,y+5)
    return grupo('cota-'+str(x1)+'-'+str(x2)+'-'+str(y),s,stroke=ESCURO,stroke_width='1')+texto((x1+x2)/2,y-8,rotulo,11,ESCURO,500,'middle')

def guias_logo():
    s=circle('gerador-cranio',300,215,180,'none')+circle('gerador-das-pontas',300,400,170,'none')
    distancia=sqrt(126**2+110**2)
    altura=sqrt(160**2-(distancia/2)**2)
    centro_asa=(453-110*altura/distancia,370-126*altura/distancia)
    for lado,c in [('direita',centro_asa),('esquerda',esp(centro_asa))]:
        s+=circle('gerador-asa-'+lado,*c,160,'none',opacity='.38',stroke_dasharray='3 5')+cruz(*c)
    for x,rot in [(200,45),(400,-45)]:
        for rx,ry in [(90,70),(70,50),(45,32.5)]:s+=ellipse(f'gerador-{x}-{rx}',x,295,rx,ry,rot,'none')
        s+=linha(x-95*cos(radians(rot)),295-95*sin(radians(rot)),x+95*cos(radians(rot)),295+95*sin(radians(rot)),stroke_dasharray='5 4')+cruz(x,295)
    for a in [25,45,65,83,97,115,135,155]:
        p=polar(300,400,175,a);s+=linha(300,400,*p,stroke_dasharray='4 4')
    s+=linha(300,0,300,600,stroke_dasharray='7 5')+linha(80,295,520,295,stroke_dasharray='7 5')+cruz(300,215)+cruz(300,400)
    s=grupo('circulos-elipses-e-eixos',s,stroke=GUIA,stroke_width='1.15',fill='none')
    s+=cota_h(120,480,20,'36u')+cota_h(200,400,190,'20u')+cota_h(280,320,315,'4u')
    return grade()+s

def guias_mascote():
    s=circle('gerador-cabeca',300,200,170,'none')+cruz(300,200)
    for x in [170,430]:
        for r in [115,97.5,75]:s+=circle(f'gerador-{x}-{r}',x,220,r,'none')
        s+=cruz(x,220)
    for x,rx,ry,rot in [(240,20,140,-6),(360,20,140,6),(280,25,150,-4),(320,25,150,4)]:
        s+=ellipse('gerador-tentaculo-'+str(x),x,420,rx,ry,rot,'none')
        p1=polar(x,420,ry,90+rot);p2=polar(x,420,ry,270+rot)
        s+=linha(*p1,*p2,stroke_dasharray='4 4')
    for r in [90,55]:s+=circle('gerador-braco-'+str(r),435,365,r,'none')
    s+=circle('gerador-ponta-braco',507.5,365,17.5,'none')+cruz(435,365)
    s+=circle('gerador-sorriso',300,295,22.5,'none')
    s+=linha(300,0,300,600,stroke_dasharray='7 5')+linha(25,220,575,220,stroke_dasharray='7 5')
    s=grupo('circulos-elipses-e-eixos',s,stroke=GUIA,stroke_width='1.15',fill='none')
    return grade()+s+cota_h(130,470,15,'34u')+cota_h(170,430,80,'26u')+cota_h(315,345,200,'3u')

def renomear(s,prefixo):
    # Toda instância tem IDs próprios; nenhuma dependência de <use> ou símbolos.
    import re
    return re.sub(r'id="([^"]+)"',lambda m:f'id="{prefixo}-{m.group(1)}"',s)

def inst(s,x,y,k,prefixo,opacity=None):
    at={'transform':f'translate({x} {y}) scale({k})'}
    if opacity:at['opacity']=opacity
    return grupo(prefixo,renomear(s,prefixo),**at)

L=logo();M=mascote();MI=micro();FA=familia();DU=mascote(True);AT=mascote(False,True)
pecas=[
 ('logo-final.svg','Logo — reconstrução geométrica',L,'Silhueta simétrica, elipses a 45 graus e recortes transparentes. Módulo de 10 unidades.'),
 ('mascote-final.svg','Mascote — reconstrução geométrica',M,'Pose de saudação original; cabeça circular, óculos concêntricos, tentáculos elípticos e braço circular.'),
 ('logo-alternativa-01-micro.svg','Logo — alternativa óptica',MI,'Aberturas únicas e pupilas reforçadas para 16 a 32 pixels; uma única cor e fundo transparente.'),
 ('logo-alternativa-02-familia.svg','Logo — alternativa circular',FA,'Olhos circulares e pupilas horizontais aproximam o símbolo do mascote.'),
 ('mascote-alternativa-01-acolhimento.svg','Mascote — dois braços',DU,'Saudação bilateral com seis ventosas, inspirada nos rascunhos; simetria e gesto acolhedor.'),
 ('mascote-alternativa-02-atencao.svg','Mascote — estado de atenção',AT,'Pupilas circulares para um estado desperto durante instruções e descobertas; mesma estrutura da versão principal.')]
for nome,titulo,s,desc in pecas:svg(nome,titulo,desc,camada('arte','Arte',s))

def prancha_construcao(nome,titulo,s,guias,notas):
    fundo=camada('fundo','Fundo',rect('papel',0,0,1600,1080,'#ffffff'))
    legendas=texto(60,65,titulo,30,PRETO,700)+texto(60,100,'Construção geométrica · u = 10 unidades · área de trabalho = 60u × 60u',17,ROXO)
    legendas+=texto(70,155,'ARTE',13,ROXO,700)+texto(830,155,'SISTEMA / SOBREPOSIÇÃO',13,ROXO,700)
    artes=inst(s,50,170,1.15,'arte-limpa')+inst(s,820,170,1.15,'arte-sob-guias','.2')
    constr=inst(guias,820,170,1.15,'geometria-sobreposta')
    legendas+=texto(60,905,'REGRAS DE CONSTRUÇÃO',13,ROXO,700)
    for i,t in enumerate(notas):legendas+=texto(60+(i%2)*775,940+(i//2)*37,t,17)
    svg(nome,titulo,'A camada Construção pode ser ocultada. Cotas em módulos; geometria descrita nas notas.',fundo+camada('arte','Arte',artes)+camada('construcao','Construção',constr)+camada('legendas','Legendas',legendas),1600,1080)

prancha_construcao('logo-construcao.svg','Logo / reconstrução fiel',L,guias_logo(),[
 'Crânio: R18u. Centros dos óculos: (20u; 29,5u) e (40u; 29,5u).',
 'Semieixos: 9u × 7u / 7u × 5u / 4,5u × 3,25u. Rotação: ±45°.',
 'Pupilas: 4,5u × 1,25u. Ponte negativa: altura 2u, entre y30,5u e y32,5u.',
 'Pontas: R17u em (30u; 40u). Ângulos: 25°, 45°, 65°, 83° e espelhos.',
 'Asas: arcos R16u. Encontros com olhos e leque conservam vértices.',
 'Recortes transparentes; nenhuma máscara ou forma branca na logo.'
])
prancha_construcao('mascote-construcao.svg','Mascote / reconstrução fiel',M,guias_mascote(),[
 'Cabeça: R17u. Óculos: R11,5u / R9,75u. Olhos: R7,5u.',
 'Centros dos óculos: (17u; 22u) e (43u; 22u). Aro e ponte: 1,75u.',
 'Tentáculos: elipses 2u × 14u (±6°) e 2,5u × 15u (±4°), em semieixos.',
 'Braço: arcos R9u / R5,5u. Ponta: R1,75u, tangente aos dois arcos.'
])

# Prancha geral editorial, com todas as peças e miniaturas de construção.
fundo=rect('papel',0,0,1800,1840,'#ffffff')
leg=texto(60,65,'UM POLVO, DUAS ESCALAS',32,PRETO,700)+texto(60,100,'Reconstrução geométrica e caminhos de evolução · estudo vetorial para Bruno',18,ROXO)
leg+=texto(60,146,'01 / REFERÊNCIAS RECONSTRUÍDAS',13,ROXO,700)
arts='';cons=''
for i,(s,t,sub) in enumerate([(L,'Logo','Silhueta e expressão preservadas.'),(M,'Mascote','Pose original, círculos concêntricos.'),(L,'Construção da logo','Simetria, elipses e leque radial.'),(M,'Construção do mascote','Círculos, elipses e tangências.')]):
    x=60+i*440
    arts+=inst(s,x,170,.67,'principal-'+str(i),'.18' if i>=2 else None)
    if i>=2:cons+=inst(guias_logo() if i==2 else guias_mascote(),x,170,.67,'guias-'+str(i))
    leg+=texto(x,610,t,22,PRETO,700)+texto(x,640,sub,15)
leg+=texto(60,710,'02 / ALTERNATIVAS COM PROPÓSITO',13,ROXO,700)
for i,(s,t,sub,sub2) in enumerate([(MI,'A1 · Logo óptica','Menos contornos, pupilas maiores.','Prioridade: leitura entre 16 e 32 px.'),(FA,'A2 · Logo circular','Olhos e expressão próximos do mascote.','Prioridade: unidade entre os dois sinais.'),(DU,'B1 · Acolhimento','Dois braços e ventosas nos gestos.','Prioridade: recepção e celebração.'),(AT,'B2 · Atenção','Pupilas abertas, mesma anatomia.','Prioridade: instrução e descoberta.')]):
    x=60+i*440;arts+=inst(s,x,735,.67,'alternativa-'+str(i))
    leg+=texto(x,1175,t,22,PRETO,700)+texto(x,1207,sub,15)+texto(x,1232,sub2,15)
leg+=texto(60,1310,'03 / TESTE DE REDUÇÃO E DE FUNDO',13,ROXO,700)
leg+=texto(60,1350,'Tamanho nominal',16,PRETO,700)+texto(60,1395,'Logo reconstruída',16)+texto(60,1455,'Alternativa óptica',16)
for i,tam in enumerate([16,24,32,48,64]):
    x=290+i*116
    leg+=texto(x,1350,f'{tam} px',14,ROXO)
    arts+=inst(L,x,1360,tam/600,'reducao-logo-'+str(tam))
    arts+=inst(MI,x,1420,tam/600,'reducao-micro-'+str(tam))
leg+=texto(60,1530,'Comparar a 100%: reduzir a prancha também reduz estas amostras.',15,ROXO)
# Prova de transparência: a cor do papel aparece nos recortes.
fundo+=rect('amostra-roxa',955,1340,375,215,ROXO)+rect('amostra-escura',1350,1340,375,215,PRETO)
arts+=inst(L.replace(PRETO,'#ffffff'),968,1335,.36,'logo-reversa')
arts+=inst(MI.replace(PRETO,'#ffffff'),1510,1335,.36,'micro-reversa')
leg+=texto(1175,1415,'Uma tinta.',17,'#ffffff',700)+texto(1175,1443,'Recortes',15,'#ffffff')+texto(1175,1465,'transparentes.',15,'#ffffff')
leg+=texto(1370,1415,'Óptica',17,'#ffffff',700)+texto(1370,1443,'em negativo.',15,'#ffffff')
leg+=texto(60,1645,'SISTEMA COMPARTILHADO',13,ROXO,700)
leg+=texto(60,1685,'u = 10 · eixo x = 30u · pares espelhados · círculos e elipses · paleta provisória',19)
leg+=texto(60,1723,'A logo usa inclinação e recortes; o mascote mantém olhos frontais e saudação. As alternativas testam a aproximação entre eles.',17)
leg+=texto(60,1780,'Arte, Construção e Legendas são grupos separados. Arquivos individuais sem fundo e sem texto na marca.',15,ROXO)
svg('prancha-geral.svg','Prancha geral — logo e mascote','Duas reconstruções, duas construções, quatro alternativas e provas de redução e transparência.',camada('fundo','Fundo',fundo)+camada('arte','Arte',arts)+camada('construcao','Construção',cons)+camada('legendas','Legendas',leg),1800,1840)
print(f'Gerados {len(pecas)+3} SVGs. Interseção crânio/elipse: t={t_inter:.9f}°, P={P}.')
