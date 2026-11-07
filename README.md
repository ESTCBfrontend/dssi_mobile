# DSSI Mobile

Base mobile do projeto DSSI: React Native, Expo e TypeScript.

## Começar

Instala Node.js 24 e npm, clona o repositório e executa:

```bash
npm ci
npm start
```

Segue as instruções do Expo para abrir a aplicação num dispositivo ou emulador. No PowerShell, caso a política de execução bloqueie npm, usa `npm.cmd`.

Para preparar o Windows de raiz, instalar o Android Studio e criar um emulador, consulta o [guia de desenvolvimento Android](docs/desenvolvimento-android.md). Ao desenvolver, mantém o emulador e a aplicação abertos para acompanhar as alterações.

Se usares o VS Code, instala a extensão [Expo Tools](https://marketplace.visualstudio.com/items?itemName=expo.vscode-expo-tools) para tentares ligar a Debug Console à app. O guia explica como iniciar a sessão de depuração e documenta uma limitação de ligação observada.

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

## Documentação para desenvolver

| Documento | Quando consultar |
| --- | --- |
| [AGENTS.md](AGENTS.md) | Instruções operacionais para agentes, âmbito, validação e aprovação de decisões. |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Processo da equipa, branches, PRs e manutenção da documentação. |
| [Arquitetura](docs/architecture.md) | Responsabilidades, dependências, estado atual e organização aprovada de adoção gradual. |
| [Guia de implementação](docs/implementation-guide.md) | Como desenvolver uma funcionalidade ou adaptar código por etapas, com exemplos e documentos a atualizar. |
| [Referência provisória de ordens](docs/contrato-ordens-provisorio.md) | Comparar modelos e serviços locais Web/Mobile e preparar os pontos a acordar com o Backend. |
| [Ambiente Android](docs/desenvolvimento-android.md) | Preparar e correr a aplicação, observar o emulador e diagnosticar problemas. |
| [Componentes](docs/COMPONENTS_MOBILE_REACT_NATIVE.md) e fichas em `docs/components` | Reutilização, comportamento e validação dos componentes da interface. |

As tarefas seguintes devem manter estas referências coerentes com o código. A estrutura pretendida não significa que todos os diretórios ou adaptações já estejam implementados.

As alterações relevantes por entregar e por versão estão em [CHANGELOG.md](CHANGELOG.md).

## Diagnóstico em preparação

A origem inicial é configurada em `src/composition/data-source/appDataSource.ts` e usa API por defeito. Em desenvolvimento, o botão com o inseto abre as ferramentas e permite selecionar temporariamente API ou Mock; a escolha regressa à configuração inicial ao recarregar a aplicação. Os botões de informação explicam as opções. Para ocultar o menu, altera `ENABLE_DEBUG_LAYER` em `src/composition/debug/debugConfig.ts` para `false` e recarrega a aplicação. A seleção temporária e o menu não estão disponíveis em builds de produção, independentemente da flag.

O menu principal agrupa «Origem de dados» e, quando Mock está selecionado, os mocks de ordens e de intervenções. Nas ordens, «Cenário» abre as opções normal, vazio, erro e lento; podes adicionar exemplos individualmente ou em conjunto, limpar ou repor os dados iniciais. Nas intervenções, podes adicionar exemplos individualmente ou em conjunto e removê-los. Uma intervenção só é adicionada quando a ordem fictícia associada está presente. Limpar ou repor ordens, ou mudar o cenário, remove as intervenções. A ajuda e os resultados aparecem em notificações temporárias: a mais recente substitui imediatamente a anterior e desaparece após três segundos, mesmo que feches o menu. Tocar fora do painel ou usar «Voltar» regressa ao nível anterior; no menu principal fecha-o.

O ecrã «Os meus serviços» apresenta inicialmente todas as ordens fictícias quando selecionas Mock, com filtros por data e pelos serviços por agendar; acompanha alterações efetuadas no Debug Menu. Em **Técnico fictício**, podes selecionar João Almeida ou Mariana Ferreira para consultar apenas as ordens atribuídas diretamente ao respetivo ID, tanto na lista como no detalhe. Seleciona **Todas as ordens** para regressar à consulta inicial. O técnico ativo é indicado nos ecrãs. Esta simulação não cria uma sessão, não afeta a API e perde-se ao recarregar; mudar de cenário ou repor os dados mantém o técnico escolhido. Os controlos de adicionar/remover exemplos continuam a gerir todas as ordens em memória. É possível abrir o detalhe e consultar os dados disponíveis, sem executar ações de negócio. A prioridade aparece na lista e no detalhe, com as designações Baixa, Normal e Alta, como na Web; valores ainda não reconhecidos mantêm o texto recebido do serviço. A API real ainda não está implementada: a sua seleção apresenta uma mensagem de indisponibilidade. Os mocks são provisórios, ficam em memória e perdem-se ao recarregar; os restantes destinos de navegação ainda não estão disponíveis.

A lista e o detalhe consultam o contrato local `WorkOrderService`, com operações de listagem e consulta por identificador. A origem API usa atualmente um adaptador que informa que a integração ainda não está disponível; não existem pedidos HTTP ou formatos de resposta acordados nesta implementação.

O layout fornece o serviço ativo à funcionalidade; a seleção e as notificações mock ficam na composição. Se configurares a origem inicial como Mock em `appDataSource.ts`, os dados continuam disponíveis mesmo com o menu oculto. As atualizações em segundo plano conservam os dados já carregados; mudar de origem mantém as consultas separadas.

O logging técnico é independente da flag e usa a consola local: eventos informativos são apresentados em desenvolvimento; avisos e erros também em produção. Em desenvolvimento, procura `[DSSI]` no terminal onde executaste `npm.cmd start`; os níveis `[INFO]`, `[WARN]` e `[ERROR]` identificam cada evento. Carrega em **j** no terminal Expo para abrir a consola do React Native DevTools. Para ligar a Debug Console do VS Code à app, segue os passos de [depuração do guia Android](docs/desenvolvimento-android.md#5-trabalhar-e-ver-alterações). Em produção, a consola Expo não recebe os logs; no Android podem ser consultados no log nativo. Não são incluídos dados pessoais ou credenciais. A [arquitetura](docs/architecture.md#diagnóstico-e-origem-de-dados) descreve a orientação aprovada e o estado atual.

Nas ordens fictícias, o terminal mostra o cenário selecionado e os totais de exemplos adicionados e já existentes. Ao consultar a listagem, o início e o fim da operação têm o mesmo número de correlação; o fim inclui duração e resultado, sem dados das ordens. O Debug Menu ainda não consulta essa listagem.

Ao adicionar um exemplo fictício de ordem ou intervenção, o respetivo JSON versionado é apresentado formatado no terminal em desenvolvimento. Exemplos já existentes ou rejeitados não voltam a ser apresentados. O logger já consegue formatar campos numéricos de metadados explicitamente autorizados de uma resposta API, mas ainda não existem operações API ligadas para o usar. A [arquitetura](docs/architecture.md#diagnóstico-e-origem-de-dados) descreve os limites e a integração pendente.

Também está preparado o registo de método, resultado, estado HTTP e duração de futuros pedidos API, com correlação entre início e fim. Ainda não há pedidos reais ligados a este mecanismo; URLs, cabeçalhos e mensagens de erro externas não são registados.

## Componentes da interface

O [guia de componentes React Native Mobile](docs/COMPONENTS_MOBILE_REACT_NATIVE.md) reúne o catálogo `MDS/*` do Figma, comportamento esperado, propostas de props, variantes, composição, exemplos de utilização e critérios de validação. Consulta-o ao criar, alterar ou reutilizar componentes, com ou sem assistência de IA. O catálogo orienta a implementação incremental; não representa uma biblioteca já implementada.

Implementados: [MDS/Button](docs/components/Button.md), [MDS/StatusBadge](docs/components/StatusBadge.md), [MDS/AlertIcon](docs/components/AlertIcon.md), [MDS/TextField](docs/components/TextField.md), [MDS/FormField](docs/components/FormField.md), [MDS/Checkbox](docs/components/Checkbox.md), [MDS/Radio](docs/components/Radio.md), [MDS/RadioGroup](docs/components/RadioGroup.md), [MDS/Switch](docs/components/Switch.md), [MDS/CheckboxGroup](docs/components/CheckboxGroup.md), [MDS/ProgressBar](docs/components/ProgressBar.md), [MDS/LoadingIndicator](docs/components/LoadingIndicator.md), [MDS/Textarea](docs/components/Textarea.md), [MDS/Alert](docs/components/Alert.md), [MDS/Card](docs/components/Card.md), [MDS/ContentPanel](docs/components/ContentPanel.md), [MDS/FormGroup](docs/components/FormGroup.md), [MDS/PageButton](docs/components/PageButton.md), [MDS/Pagination](docs/components/Pagination.md), [MDS/Tab](docs/components/Tab.md), [MDS/Tabs](docs/components/Tabs.md), [MDS/TabPanel](docs/components/TabPanel.md), [MDS/ActivityItem](docs/components/ActivityItem.md), [MDS/Timeline](docs/components/Timeline.md), [MDS/AttachmentItem](docs/components/AttachmentItem.md), [MDS/PhotoTile](docs/components/PhotoTile.md), [MDS/ChecklistItem](docs/components/ChecklistItem.md), [MDS/TaskProgress](docs/components/TaskProgress.md), [MDS/Checklist](docs/components/Checklist.md), [MDS/ClientSummary](docs/components/ClientSummary.md), [MDS/EquipmentCard](docs/components/EquipmentCard.md), [MDS/ServiceOrderCard](docs/components/ServiceOrderCard.md), [MDS/TableRow](docs/components/TableRow.md), [MDS/SortableHeader](docs/components/SortableHeader.md), [MDS/DataTable](docs/components/DataTable.md), [MDS/Dialog](docs/components/Dialog.md) e [MDS/DrawerSheet](docs/components/DrawerSheet.md), com tema configurável. As demonstrações executáveis ficam apenas locais.

Os testes específicos do Button, do StatusBadge, do AlertIcon, do TextField, do FormField, do Checkbox, do Radio, do RadioGroup, do Switch, do CheckboxGroup, do ProgressBar, do LoadingIndicator, do Textarea, do Alert, do Card, do ContentPanel, do FormGroup, do PageButton, do Pagination, do Tab, do Tabs, do TabPanel, do ActivityItem, do Timeline, do AttachmentItem, do PhotoTile, do ChecklistItem, do TaskProgress, do Checklist, do ClientSummary, do EquipmentCard, do ServiceOrderCard, do TableRow, do SortableHeader, do DataTable, do Dialog, do DrawerSheet e do tema executam-se apenas localmente, por decisão do utilizador:

```bash
npm run test:components
```

`npm test` também os inclui. O `test:ci` conserva a descoberta dos restantes testes e exclui apenas as suites locais indicadas na configuração através de `jest.ci.config.cjs`.

Também implementados: [MDS/Select](docs/components/Select.md), [MDS/DatePicker](docs/components/DatePicker.md), [MDS/DateRangePicker](docs/components/DateRangePicker.md), [MDS/TimePicker](docs/components/TimePicker.md), [MDS/Form](docs/components/Form.md). Os respetivos testes de componentes executam-se apenas localmente com `npm run test:components`.

Também implementados: [MDS/TeamSelector](docs/components/TeamSelector.md), [MDS/UserSelector](docs/components/UserSelector.md), [MDS/AssignmentPanel](docs/components/AssignmentPanel.md). Os respetivos testes de componentes executam-se apenas localmente com `npm run test:components`.

Também implementados: [MDS/NavItem](docs/components/NavItem.md), [MDS/AppHeader](docs/components/AppHeader.md), [MDS/PageLayout](docs/components/PageLayout.md), [MDS/AppShell](docs/components/AppShell.md). Os respetivos testes de componentes executam-se apenas localmente com `npm run test:components`.

Também implementados: [MDS/FileUpload](docs/components/FileUpload.md), [MDS/ImagePicker](docs/components/ImagePicker.md), [MDS/FilterBar](docs/components/FilterBar.md), [MDS/ToastSnackbar](docs/components/ToastSnackbar.md). Os respetivos testes de componentes executam-se apenas localmente com `npm run test:components`.
