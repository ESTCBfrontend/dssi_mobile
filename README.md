# DSSI Mobile

Base mobile do projeto DSSI: React Native, Expo e TypeScript.

## Começar

Instala Node.js 24 e npm, clona o repositório e executa:

```bash
npm ci
npm start
```

Segue as instruções do Expo para abrir a aplicação num dispositivo ou emulador. No PowerShell, caso a política de execução bloqueie npm, usa `npm.cmd`.

## Verificações locais

```bash
npm run lint
npm run typecheck
npm run test:ci
npm run bundle:android
```

O pipeline executa estas verificações em PRs e pushes para develop e main. A exportação Android verifica o bundle JavaScript; não produz nem testa uma aplicação nativa instalada e não valida a compilação iOS.

Consulta [CONTRIBUTING.md](CONTRIBUTING.md) e [AGENTS.md](AGENTS.md).

Os princípios de qualidade e a direção de organização do código estão em [docs/architecture.md](docs/architecture.md). Decisões duradouras novas seguem o processo de proposta e aprovação descrito em AGENTS.md.
