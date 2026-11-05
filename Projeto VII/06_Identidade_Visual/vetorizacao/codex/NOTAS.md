# Logo e mascote — construção geométrica

Comece pela [prancha geral](prancha-geral.svg). São **9 SVGs**: duas reconstruções, duas pranchas de construção e quatro alternativas. As prévias estão em `previas/`; os geradores, em `apoio/`.

## Sistema

- **Base comum:** área de 600 × 600, módulo **u = 10**, subdivisões até u/4 e eixo vertical x = 30u. Coordenadas abaixo partem do canto superior esquerdo. Pontos de interseção são calculados, não encaixados à força na grade.
- **Logo:** crânio circular R18u em (30u; 21,5u). Óculos centrados em (20u; 29,5u) e (40u; 29,5u), inclinados a ±45°. Semieixos das três elipses: 9u × 7u, 7u × 5u e 4,5u × 3,25u. Pupilas 4,5u × 1,25u. Ponte negativa com 2u de altura. Asas em arcos R16u; quatro pontas inferiores sobre R17u, centro (30u; 40u), nos ângulos 25°, 45°, 65°, 83° e seus espelhos.
- **Mascote:** cabeça R17u em (30u; 20u). Óculos em (17u; 22u) e (43u; 22u), com raios 11,5u / 9,75u / 7,5u para armação externa, interna e olho. Espessura do aro e da ponte: 1,75u. Pupilas 6,75u × 1,5u; sorriso semicircular R2,25u.
- **Tentáculos do mascote:** pares de elipses com semieixos 2u × 14u, inclinados a ±6°, e 2,5u × 15u, a ±4°. Braço com arcos concêntricos R9u e R5,5u, centro (43,5u; 36,5u), unidos por uma ponta R1,75u tangente a ambos.

## Correções em relação aos originais

Igualei os pares, alinhei olhos, pupilas e armações, centralizei ponte e sorriso e substituí contornos livres por círculos, elipses e arcos. A logo conserva o leque e os olhos inclinados; o mascote conserva a saudação e os quatro tentáculos pendentes. O braço ficou mais circular e os pés mais regulares. Os gradientes deram lugar a três roxos chapados para separar os planos.

As junções pontudas da logo são **vértices intencionais**, não tangências. Elipses concêntricas também não constituem um contorno de espessura constante. A reconstrução regulariza o desenho; não é um decalque pixel a pixel.

## Alternativas

| Arquivo | Motivo |
|---|---|
| `logo-alternativa-01-micro.svg` | Une a massa, elimina um nível de contorno e engrossa as pupilas. Olhos aproximados 1u de cada lado, preservando margem externa. Indicada para **16–32 px**. |
| `logo-alternativa-02-familia.svg` | Usa olhos circulares e pupilas horizontais para aproximar símbolo e personagem. Conserva os seis braços do leque; perde parte da energia diagonal original. |
| `mascote-alternativa-01-acolhimento.svg` | Espelha o braço levantado e acrescenta três ventosas por lado. Gesto para boas-vindas e celebração, derivado dos rascunhos. |
| `mascote-alternativa-02-atencao.svg` | Troca as barras por pupilas circulares R2u. Estado mais desperto para apresentar instruções e descobertas, usando a mesma anatomia. |

## Edição, conferência e limites

As peças individuais têm fundo transparente e nenhum texto. As logos usam uma tinta (`#211915`) e vazados reais, sem branco simulando recortes. As pranchas separam **Arte**, **Construção**, **Legendas** e **Fundo** em grupos nomeados; o Illustrator pode tratá-los como grupos em vez de camadas. As legendas usam Arial com alternativas locais, sem fonte externa.

Todos os SVGs foram renderizados localmente e conferidos. A prancha compara 16, 24, 32, 48 e 64 px e inclui versões negativas. **A logo detalhada perde os aros a 16 px**: use a óptica nessa escala. Isso não substitui uma futura prova no contexto real do app. Não foi feita uma abertura de conferência dentro do Illustrator; os arquivos usam apenas geometria SVG básica, sem filtros, máscaras, imagens ou dependências externas.
