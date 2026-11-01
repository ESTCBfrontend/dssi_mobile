# MDS/Timeline

Histórico visual com lista virtualizada de [ActivityItem](ActivityItem.md), estado vazio e ação opcional para carregar mais. Implementação: [Timeline.tsx](../../src/shared/ui/Timeline/Timeline.tsx). Referências: [Figma, com eventos](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ?node-id=180-3305) e [vazio](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ?node-id=180-3356).

Importa `Timeline` de `src/shared/ui/Timeline` e usa-o dentro de `ThemeProvider`. A aplicação fornece os eventos reais e gere a obtenção, retenção e atualização dos dados.

| Propriedade | Comportamento |
| --- | --- |
| `events` | Lista de `ActivityEvent` com identificadores únicos; apresentada do timestamp mais recente para o mais antigo, sem alterar o array fornecido. Empates mantêm a ordem recebida. |
| `title`, `subtitle` | Título obrigatório e subtítulo opcional não vazios. |
| `total` | Total opcional conhecido, inteiro seguro não inferior ao número de eventos fornecidos. Sem total, a contagem refere os eventos carregados quando `hasMore` é verdadeiro. |
| `hasMore`, `onLoadMore` | O botão só aparece quando existem mais resultados e um callback. O consumidor obtém e acrescenta os dados; não há pedidos automáticos. |
| `isLoading` | Com lista vazia apresenta carregamento; com eventos e botão de carregar mais bloqueia repetições. |
| `onOpenRelated` | Opcional; torna cada evento um botão que encaminha o evento selecionado. |
| `labels` | Personaliza contagem e textos de vazio, dados por carregar, carregamento e ação. |
| `style`, `testID` | Personalização e integração do contentor `FlatList`. |

Sem eventos e sem mais dados, é apresentado o estado vazio. Quando há resultados conhecidos ou mais dados mas ainda não há itens carregados, a mensagem distingue essa situação e a ação pode iniciar o carregamento. A ordenação aplica-se aos eventos já recebidos; a aplicação deve obter as páginas de forma coerente e nunca substituir o histórico inadvertidamente. `FlatList` precisa de espaço definido pelo layout consumidor; evita aninhá-la numa `ScrollView` vertical com a mesma direção.

`AppTheme.timeline` configura a superfície, tipografia e espaçamentos; `AppTheme.activityItem` configura cada entrada. O símbolo do estado vazio é exportado do Figma em PNG transparente de 22 × 36 pixels e recebe a cor do tema; pode perder nitidez em ecrãs de maior densidade. As demonstrações executáveis são apenas locais. Os [testes locais](../../src/shared/ui/Timeline/Timeline.test.tsx) ficam fora de `test:ci`, conforme a preferência do utilizador. Validação JavaScript e exportação Android não substituem execução nativa ou leitores de ecrã.
