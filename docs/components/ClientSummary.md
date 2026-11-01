# MDS/ClientSummary

Resumo mobile de um cliente, composto a partir de [Card](Card.md), [StatusBadge](StatusBadge.md) e [Button](Button.md). Implementação: [ClientSummary.tsx](../../src/shared/ui/ClientSummary/ClientSummary.tsx). Referências Figma: [ativo](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ?node-id=184-3934) e [por validar](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ?node-id=184-3990).

Importa `ClientSummary` e `ClientSummaryData` de `src/shared/ui/ClientSummary` e usa o componente dentro de `ThemeProvider`. A aplicação fornece os dados, escolhe a variante de apresentação e decide o que acontece nas ações.

| Propriedade | Comportamento |
| --- | --- |
| `client.id`, `client.name` | Identificador e nome obrigatórios e não vazios. O nome é o título; o identificador é encaminhado no objeto da ação. |
| `client.subtitle` | Descrição opcional apresentada abaixo do nome. |
| `client.contact`, `responsible` | Textos opcionais de contacto e responsável; são omitidos quando não existem ou estão vazios. |
| `client.sites`, `activeOrders`, `pending` | Textos opcionais já preparados pela aplicação, como uma contagem formatada ou uma pendência. |
| `state` | `active` apresenta por omissão «Ativo»; `review`, «Por validar». São variantes visuais do Figma, não regras de domínio. |
| `onOpen` | Opcional. Recebe o objeto `client`; o botão só aparece quando este callback existe. |
| `status` | Substitui o badge por `{ label, tone }`; o tom é um dos suportados pelo `StatusBadge`. |
| `labels` | Permite substituir textos dos estados, das linhas e das ações. |
| `extraFields` | Acrescenta linhas `{ label, value }`; valores ausentes ou vazios são omitidos. A etiqueta de uma linha apresentada deve ser não vazia. |
| `actions` | Elementos React Native adicionais, sob responsabilidade do consumidor. |
| `style`, `testID` | Personalização e identificação do contentor `Card`. |

O componente não obtém dados, calcula contagens, navega nem verifica permissões. Os campos fornecidos são apresentados independentemente da variante; o consumidor decide quais disponibilizar. O título e a ação têm semântica nativa; cada linha associa o rótulo ao valor para leitores de ecrã. O texto respeita a ampliação nativa e as linhas podem quebrar quando falta espaço.

`AppTheme.card`, `statusBadge` e `businessCard` controlam a apresentação. Os tipos comuns `SummaryDetail` e `SummaryStatus` podem ser importados de `src/shared/ui/BusinessCard`. As demonstrações executáveis ficam apenas locais. Os [testes locais](../../src/shared/ui/ClientSummary/ClientSummary.test.tsx) ficam fora de `test:ci`; não substituem verificação nativa, leitores de ecrã, tamanhos de ecrã ou ampliação de fonte.

No tema claro, as linhas usam texto de 12 pontos, intervalo de 10 e etiqueta com largura de referência de 120, conforme o Figma. A largura preferencial de 100 para o valor e a quebra das linhas são adaptações para diferentes ecrãs; estas medidas podem ser alteradas em `businessCard`.
