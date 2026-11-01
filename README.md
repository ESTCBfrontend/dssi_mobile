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

Implementados: [MDS/Button](docs/components/Button.md), [MDS/StatusBadge](docs/components/StatusBadge.md), [MDS/AlertIcon](docs/components/AlertIcon.md), [MDS/TextField](docs/components/TextField.md), [MDS/FormField](docs/components/FormField.md), [MDS/Checkbox](docs/components/Checkbox.md), [MDS/Radio](docs/components/Radio.md), [MDS/RadioGroup](docs/components/RadioGroup.md), [MDS/Switch](docs/components/Switch.md), [MDS/CheckboxGroup](docs/components/CheckboxGroup.md), [MDS/ProgressBar](docs/components/ProgressBar.md), [MDS/LoadingIndicator](docs/components/LoadingIndicator.md), [MDS/Textarea](docs/components/Textarea.md), [MDS/Alert](docs/components/Alert.md), [MDS/Card](docs/components/Card.md), [MDS/ContentPanel](docs/components/ContentPanel.md), [MDS/FormGroup](docs/components/FormGroup.md), [MDS/PageButton](docs/components/PageButton.md), [MDS/Pagination](docs/components/Pagination.md), [MDS/Tab](docs/components/Tab.md), [MDS/Tabs](docs/components/Tabs.md), [MDS/TabPanel](docs/components/TabPanel.md), [MDS/ActivityItem](docs/components/ActivityItem.md), [MDS/Timeline](docs/components/Timeline.md), [MDS/AttachmentItem](docs/components/AttachmentItem.md), [MDS/PhotoTile](docs/components/PhotoTile.md), [MDS/ChecklistItem](docs/components/ChecklistItem.md), [MDS/TaskProgress](docs/components/TaskProgress.md), [MDS/Checklist](docs/components/Checklist.md), [MDS/ClientSummary](docs/components/ClientSummary.md), [MDS/EquipmentCard](docs/components/EquipmentCard.md) e [MDS/ServiceOrderCard](docs/components/ServiceOrderCard.md), com tema configurável. As demonstrações executáveis ficam apenas locais.

Os testes específicos do Button, do StatusBadge, do AlertIcon, do TextField, do FormField, do Checkbox, do Radio, do RadioGroup, do Switch, do CheckboxGroup, do ProgressBar, do LoadingIndicator, do Textarea, do Alert, do Card, do ContentPanel, do FormGroup, do PageButton, do Pagination, do Tab, do Tabs, do TabPanel, do ActivityItem, do Timeline, do AttachmentItem, do PhotoTile, do ChecklistItem, do TaskProgress, do Checklist, do ClientSummary, do EquipmentCard, do ServiceOrderCard e do tema executam-se apenas localmente, por decisão do utilizador:

```bash
npm run test:components
```

`npm test` também os inclui. O `test:ci` conserva a descoberta dos restantes testes e exclui apenas as suites locais indicadas na configuração através de `jest.ci.config.cjs`.
