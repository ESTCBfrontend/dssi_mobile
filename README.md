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

## Componentes da interface

O [guia de componentes React Native Mobile](docs/COMPONENTS_MOBILE_REACT_NATIVE.md) reúne o catálogo `MDS/*` do Figma, comportamento esperado, propostas de props, variantes, composição, exemplos de utilização e critérios de validação. Consulta-o ao criar, alterar ou reutilizar componentes, com ou sem assistência de IA. O catálogo orienta a implementação incremental; não representa uma biblioteca já implementada.

Implementados: [MDS/Button](docs/components/Button.md), [MDS/StatusBadge](docs/components/StatusBadge.md), [MDS/AlertIcon](docs/components/AlertIcon.md), [MDS/TextField](docs/components/TextField.md) e [MDS/FormField](docs/components/FormField.md), com tema configurável. As demonstrações executáveis ficam apenas locais.

Os testes específicos do Button, do StatusBadge, do AlertIcon, do TextField, do FormField e do tema executam-se apenas localmente, por decisão do utilizador:

```bash
npm run test:components
```

`npm test` também os inclui. O `test:ci` conserva a descoberta dos restantes testes e exclui apenas as suites locais indicadas na configuração através de `jest.ci.config.cjs`.
