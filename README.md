# Nodus

Companheiro visual de treino. Sem instalação, sem build, sem npm.

## ⚠️ Ao atualizares para uma versão nova

- ✅ Substitui: `index.html`, `app.js`, `styles.css`, pasta `assets/`
- ❌ **Nunca substituas `data/live-data.json`** se já tiveres a Sincronização
  GitHub ativa — é a tua base de dados real, só tua, nunca vem incluída
  nas atualizações a partir daqui em diante. Sobrescrevê-la apaga os
  teus treinos/exercícios reais pelos dados de exemplo.
- Os outros ficheiros em `data/` (exercises.js, workouts.js, etc.) só
  servem de exemplo/reserva inicial — podes substituí-los sem risco
  depois de teres a sincronização GitHub ativa.

## Como abrir

- **PC**: faz duplo-clique em `index.html`. Abre no browser por definição.
- **Tablet / telemóvel**: dentro da app do OneDrive, abre `index.html` e escolhe
  "abrir no browser" (Chrome, Safari, etc.). Se o teu OneDrive não tiver essa
  opção diretamente, aponta o browser do dispositivo à pasta sincronizada
  localmente (em Android/iOS o browser normalmente consegue abrir ficheiros
  locais através do seletor de ficheiros, em "Abrir ficheiro").
- Não precisas de internet depois de aberto — tudo corre localmente.

## Estrutura

```
nodus/
├── index.html          ← abre este ficheiro
├── styles.css
├── app.js
├── data/
│   ├── exercises.js     ← biblioteca de exercícios (editável)
│   ├── workouts.js       ← templates de treino (editável)
│   └── settings.js       ← definições, incl. cor core da app
└── assets/
    ├── exercises/        ← coloca aqui os teus GIFs/MP4/WebM
    ├── thumbnails/
    ├── yoga/
    └── mobility/
```

## Histórico de sessões (a tal "mini base de dados")

Cada vez que terminas um treino no Player (ou marcas ✓ manualmente no
Plano/Início), fica um registo no **Histórico** (separador dentro do
Plano → "Ver histórico"): data, nome do treino, letra e categoria.
Vês contagens do mês (treinos de força vs. sessões de yoga) e a lista
completa organizada por mês, ao longo do ano.

**Como consolidar entre PC, tablet e telemóvel:**
Como os browsers não deixam uma página escrever sozinha num ficheiro a
cada treino, o histórico de cada dispositivo fica local até o exportares.
No ecrã de Histórico:
1. Toca em **"Exportar"** → descarrega `history.json` com as sessões
   deste dispositivo.
2. Nos outros dispositivos, toca em **"Importar"** e escolhe esse
   ficheiro (ou um já mais completo, vindo de outro aparelho).
3. A fusão é automática e sem duplicados — junta tudo pela combinação
   data + treino, por isso podes importar o mesmo ficheiro várias vezes
   sem problema.

Sugestão prática: uma vez por semana, exporta de cada dispositivo e
importa tudo num só (por exemplo sempre no PC), guardando esse
`history.json` "mestre" dentro da pasta sincronizada do OneDrive como
cópia de segurança do ano todo.

## Plano semanal e mensal

Os treinos de força usam letras (A, B, C...) em vez de nomes de dia fixos —
o clássico "Treino A/B/C". Em `data/plan.js` defines que letra corresponde
a que dia da semana (ex: Segunda = A, Quarta = B). Isto também é editável
pelo Admin Panel, em "Plano semanal".

No separador **Plano** (ícone 📅) vês um calendário do mês, com a letra do
treino de cada dia e um traço em dias de descanso. Tocando num dia com
treino, abre o Workout Player diretamente. No Início, a secção "Esta
semana" mostra os próximos 7 dias com um botão ✓ para marcares o treino
como feito — fica logo registado no Histórico (ver secção acima).

## Dias de treino e Yoga

O Yoga continua fora deste esquema de letras por agora (fica só agrupado
por categoria, como antes) — quando quiseres estruturá-lo da mesma forma,
di-me.

## Marca (logo e imagem hero)

- `assets/branding/logo.png` — o logótipo "NODUS", recortado e com fundo
  transparente. Aparece no topo de todos os ecrãs da app.
- `assets/branding/hero-strength-yoga.jpg` — a imagem de destaque (treino à
  esquerda, yoga à direita), usada como banner grande no Início e também
  como fundo dos dois ícones "Treino"/"Yoga" (cada um mostra o lado
  correspondente da imagem).

Para trocares estas imagens no futuro, basta substituíres os ficheiros por
outros com o mesmo nome — a app não precisa de nenhuma alteração de código.

## Séries por exercício

Cada exercício dentro de um treino tem agora um número de séries (ex: 4
séries de supino). No Player, completas uma série → descansas → repete
o mesmo exercício até esgotares as séries → só depois passa ao exercício
seguinte. O botão mostra "Completar série" enquanto restam séries, e
"Completar exercício" na última.

No Builder, cada exercício tem dois pequenos contadores (− / +): um para
"Séries" e outro para "Descanso". Por omissão, um exercício novo entra
com 3 séries e 60s de descanso — ajusta como quiseres.

O botão "→" no Player salta sempre para o exercício seguinte por
completo (todas as séries restantes), útil se quiseres avançar sem
esperar pelo descanso.

## Layout adaptado a tablet/computador

A app deteta automaticamente a largura da janela/ecrã (não o tipo de
dispositivo) — em ecrãs a partir de ~860px de largura (tablet em modo
paisagem, computador), a navegação passa de barra inferior para uma
barra lateral esquerda, o conteúdo ocupa mais largura, e a grelha de
dias A-E passa a 3 colunas. Não precisas de configurar nada — o mesmo
`index.html` adapta-se sozinho ao reduzires/aumentares a janela ou
rodares o tablet.

## A app "não atualiza" mesmo depois de trocares os ficheiros?

Isto acontece porque a app dá sempre prioridade às tuas próprias edições
sobre os ficheiros novos que colocares em `data/` — para nunca apagar o
teu trabalho sem querer. Se sentires que estás preso numa versão antiga
dos exercícios/treinos/plano (por exemplo, depois de muitos testes),
vai a **Admin → "Repor dados de origem"**. Isto volta a mostrar os dados
mais recentes vindos com a app, mas apaga as tuas edições nessas áreas —
o histórico de sessões nunca é afetado por este botão.

Sempre que editares algo (nome do treino, exercício, cor, etc.), aparece
uma pequena confirmação "Guardado ✓" no fundo do ecrã — não há botão de
"Guardar" explícito porque tudo grava automaticamente e de imediato.

## Estrutura: Admin vs. Gerir

- **Admin** (⚙): só definições — nome da pessoa, cor de destaque, plano
  semanal, sincronização/exportar, repor dados de origem.
- **Gerir** (novo separador): aqui crias e editas **treinos** (agrupados
  por categoria, com botão de editar/apagar) e **exercícios** — incluindo
  associar exercícios aos treinos (via "Editar" → abre o Builder).

## Editar um treino — modo de rascunho com Guardar

Ao editares um treino (pelo lápis, ou por "Editar" em Gerir), entras num
**modo de edição**: tudo o que fazes (adicionar/remover exercício,
ajustar séries/descanso, mudar nome ou etiqueta do dia) fica só num
rascunho local até tocares em **"Guardar treino"**. Se saíres sem
guardar (✕), as alterações são descartadas — nada fica persistido a
meio. O Player nunca é afetado pelo que estás a editar; só reflete a
última versão guardada.

## "Que treino queres fazer hoje?" mostra tudo

Esta secção (dentro de Treino) mostra **todos os treinos de força que
criares**, não só um conjunto fixo de 5. A "Etiqueta do dia" (A, B, C...)
é só usada para a rotação semanal (Plano) e para destacar "HOJE" — não é
obrigatória para o treino aparecer aqui. Cria quantos quiseres, com ou
sem letra.

## Fases e variação automática

Cada treino já não é uma lista simples de exercícios — é uma sequência de
**fases** (ex: "Primary Lift", "Pull", "Stability"), cada uma com o seu
próprio número de séries e descanso. No Builder, cada fase tem uma
**lista de opções** (pool) de exercícios que a podem preencher.

- **1 exercício na fase**: comporta-se como antes, sempre o mesmo.
- **2+ exercícios na fase**: a cada vez que **começas** esse treino no
  Player, a app escolhe automaticamente um da lista, **rodando** para o
  seguinte de cada vez (nunca repete o mesmo duas vezes seguidas,
  desde que haja mais que uma opção). Assim, "Push" pode dar-te
  Push-up numa sessão e Chest press na seguinte, sem teres de gerir
  isso manualmente.

O Player mostra sempre a fase antes do exercício (ex: "PRIMARY LIFT").
Isto é guardado por dispositivo — se treinares o mesmo dia em aparelhos
diferentes, a rotação de cada um é independente.

Treinos antigos (da versão anterior, com lista simples de exercícios)
são convertidos automaticamente para este formato na primeira vez que
abrires esta versão — não precisas de repor nada.

## Sincronização em tempo real via GitHub (opcional)

Se hospedares esta app no GitHub Pages, podes ligar a sincronização de
dados diretamente ao repositório — todos os dispositivos com isto
configurado veem sempre a mesma versão, sem exportar/importar nada.

**Como ativar:**
1. Cria um token de acesso pessoal (fine-grained) em
   `github.com/settings/tokens?type=beta`, com acesso só a este
   repositório e permissão "Contents: Read and write".
2. Em **Admin → "Sincronização GitHub"**, preenche o dono do repositório,
   nome do repositório, ramo (normalmente `main`) e o token.
3. Toca em **"Guardar e sincronizar"**.

Repete isto em cada dispositivo que quiseres ligado (cada um guarda o
seu próprio token, localmente, nunca partilhado nos dados sincronizados).

**Como funciona:**
- Os dados (exercícios, treinos, plano, histórico) ficam num único
  ficheiro `data/live-data.json` no repositório.
- Cada gravação cria um commit automático nesse ficheiro — normal e
  esperado, faz parte de como isto funciona.
- Sem internet, ou sem isto configurado, a app continua a funcionar
  100% local (como antes), e sincroniza assim que voltar a haver ligação.
- Se dois dispositivos gravarem em simultâneo, a app tenta automaticamente
  uma segunda vez antes de desistir — não deverias notar nada na prática
  com só duas pessoas a usar.
- Podes desligar isto a qualquer momento em Admin, sem perderes os dados
  (ficam guardados localmente também).

## Terminologia: Categoria e Treino

- **Categoria** (ex: "Upper Body Strength") — o que escolhes para treinar.
  Cria/edita em Gerir.
- **Treino** (ex: "Primary Lift", "Pull Strength") — cada unidade dentro
  de uma categoria, com o seu nº de séries, descanso, e uma lista de
  exercícios possíveis (roda entre eles a cada sessão se houver mais que
  um).

## Player: navegação livre e lista de estado

Ao entrares numa categoria, o Player mostra uma lista de todos os seus
treinos (pendente ○ / feito ✓ / ignorado –). Podes:
- Tocar em qualquer treino da lista para ires direto a ele, em qualquer
  ordem — não precisas de completar o atual primeiro.
- Usar as setas ← → para andares livremente entre treinos.
- Marcar um treino como feito/pendente (para o repetires) ou ignorado
  (para o saltares) a qualquer momento.
- Tocar em "Terminar sessão agora" para acabares e registares no
  histórico, mesmo sem teres feito todos os treinos.

Ao completares todas as séries do treino atual, a app avança sozinha
para o próximo pendente — mas isso é só uma sugestão, podes sempre ir
para onde quiseres.

## Adicionar um exercício novo

Duas formas:

1. **Pelo Admin Panel** (dentro da app, ícone ⚙): preenche o formulário,
   guarda. Fica gravado neste dispositivo.
2. **Editando `data/exercises.js` diretamente**: copia um bloco `{ ... }`
   existente e ajusta os campos. Não precisas de reiniciar nada — só
   recarregar a página.

## Media (GIF / vídeo)

- Formatos aceites: `.gif`, `.mp4`, `.webm`.
- Prefere **MP4/WebM** a GIF sempre que possível — ficam muito mais leves
  para a mesma duração de clip, o que ajuda ao sincronizares via OneDrive.
- Coloca o ficheiro em `assets/exercises/` (ou `yoga/`, `mobility/`) e aponta
  o caminho relativo no campo "gif" do exercício, ex:
  `assets/exercises/dumbbell-row.mp4`.

## Sincronizar entre PC, tablet e telemóvel via OneDrive

1. Coloca esta pasta `nodus/` dentro da tua pasta do OneDrive.
2. Espera que sincronize em todos os dispositivos.
3. Abre `index.html` em qualquer um deles — os exercícios, treinos e cor
   core vêm sempre de `data/*.js`, por isso todos os dispositivos arrancam
   com a mesma biblioteca.

**Importante sobre edições feitas dentro da app (Admin Panel):**
Por segurança, os browsers não deixam uma página local escrever ficheiros
no disco sozinha. Isto significa que:

- Edições no Admin Panel (adicionar/editar/apagar exercício, mudar a cor)
  ficam guardadas **apenas neste dispositivo** (num armazenamento interno
  do browser).
- Para essas alterações chegarem aos outros dispositivos, clica em
  **"Exportar dados atualizados"** no Admin. Isto descarrega 3 ficheiros
  (`exercises.js`, `workouts.js`, `settings.js`) — substitui os ficheiros
  correspondentes dentro de `data/` na pasta sincronizada pelo OneDrive.
- Depois de substituíres, os outros dispositivos só precisam de recarregar
  a página (ou esperar a sincronização do OneDrive terminar) para verem as
  alterações.

Se preferires nunca usar o Admin Panel e só editar `data/exercises.js` à
mão num único sítio (ex: sempre no PC) e deixar o OneDrive sincronizar,
funciona igualmente bem — e evita por completo o passo de exportação.

## Cor core da app

Está em `data/settings.js`, campo `accentColor`. Podes mudar tanto lá como
pelo Admin Panel (ícone ⚙ → paleta de cores). É a única cor de destaque
usada em toda a app — todo o resto fica a preto, branco e cinza.
