# Nodus (React + TypeScript)

Reescrita da app em React + TypeScript + Vite + Tailwind, com build e
publicação automáticos via GitHub Actions.

## Setup (uma vez)

1. **Apaga o conteúdo atual do repositório** (exceto `data/live-data.json`,
   que é a tua base de dados real — guarda-o de lado antes de apagar tudo,
   e volta a colocá-lo depois em `data/live-data.json` neste novo projeto).
2. Copia todo o conteúdo deste zip para o repositório.
3. Se tinhas imagens de exercícios próprias (`assets/exercises/*.png`),
   coloca-as em `public/assets/exercises/` neste novo projeto.
4. Faz commit e push para o `main`.
5. No GitHub: **Settings → Pages → Source → "GitHub Actions"** (em vez de
   "Deploy from a branch"). Isto só precisas de fazer uma vez.
6. O Action (`.github/workflows/deploy.yml`) corre sozinho a cada push,
   faz o build e publica — não precisas de gerar nada localmente.

## A partir de agora

- Cada vez que eu te der alterações de código, é só copiares os ficheiros
  `src/`, `public/` (exceto `assets/exercises/` se já tiveres as tuas
  imagens lá) e fazeres commit. O Action trata do resto.
- **Nunca apagues `data/live-data.json`** do repositório — é a tua base
  de dados real, nunca deve ser substituída pelos ficheiros que eu te dou.
- A sincronização GitHub em Admin funciona exatamente como antes.

## Testar localmente (opcional)

Se quiseres testar antes de fazer commit:

```bash
npm install
npm run dev
```

Abre o URL que aparecer (normalmente `http://localhost:5173`).
