# MDS/DataTable

Listagem mobile virtualizada de cartões, com estados de carregamento, erro e vazio, e composição opcional de filtros, ordenação e paginação. Implementação: [DataTable.tsx](../../src/shared/ui/DataTable/DataTable.tsx). Referências Figma: [com registos](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ?node-id=110-1540) e [vazia](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ?node-id=110-1646).

Importa `DataTable` de `src/shared/ui/DataTable` e usa-o dentro de `ThemeProvider`. A aplicação fornece os resultados reais, gere os filtros e pedidos e mantém as props atualizadas.

| Propriedade | Comportamento |
| --- | --- |
| `title`, `description` | Título obrigatório e descrição opcional. |
| `rows` | Lista de `TableRowData` com `id` não vazio e único. Por omissão cada elemento usa [TableRow](TableRow.md); fornece uma nova lista ao alterar os dados. |
| `total` | Total conhecido opcional, inteiro seguro não inferior a `rows.length`; por omissão usa o total da paginação ou o número de registos recebidos. |
| `onOpen` | Opcional; encaminha o registo do botão de cada `TableRow` padrão. |
| `renderRow` | Substitui a apresentação padrão de cada registo por um elemento React, recebendo registo e índice. O consumidor assegura ações e acessibilidade desse conteúdo. |
| `filters` | Slot para controlos reais fornecidos pela aplicação; a listagem não cria nem aplica critérios automaticamente. |
| `sorting` | Props de [SortableHeader](SortableHeader.md). O callback pede uma direção; a aplicação aplica-a e volta a fornecer os registos ordenados. |
| `pagination` | Props de [Pagination](Pagination.md). O consumidor mantém página, tamanho, total e dados da página coerentes. Se `total` também for fornecido, os totais têm de coincidir. |
| `isLoading` | Mostra carregamento e bloqueia ordenação, paginação e novas tentativas. Registos previamente recebidos permanecem visíveis. |
| `error`, `onRetry` | Mensagem opcional e ação opcional de repetição; o consumidor gere a recuperação. Um erro não é apresentado como lista vazia. |
| `labels` | Personaliza contagem, vazio, carregamento, erro, ação e indicação de seleção. |
| `style`, `testID` | Personalização e identificação da `FlatList`. |

Ordenar, filtrar, navegar e obter páginas não acontecem automaticamente: os callbacks comunicam a intenção e a aplicação atualiza os dados. O texto vazio só sugere alterar filtros quando o slot de filtros é fornecido; pode ser substituído em `labels`. A `FlatList` precisa de espaço vertical definido e não deve ser aninhada numa `ScrollView` vertical. O slot de filtros permite integração enquanto `FilterBar`, `Select` e seletores de data ainda não estiverem implementados.

Os componentes `TableRow`, `SortableHeader`, `Pagination`, `Alert` e `LoadingIndicator` são reutilizados. `AppTheme.dataList` define os tokens de estrutura; o Figma mobile usa padding 16, raio 14 e intervalos de 16 entre secções e 8 entre cartões. As demonstrações executáveis ficam apenas locais. Os [testes locais](../../src/shared/ui/DataTable/DataTable.test.tsx) ficam fora de `test:ci`; testes JavaScript e exportação não substituem validação nativa, leitores de ecrã ou texto ampliado.
