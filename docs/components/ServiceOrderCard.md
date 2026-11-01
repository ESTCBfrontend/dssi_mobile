# MDS/ServiceOrderCard

Resumo mobile de uma ordem de serviço, composto a partir de [Card](Card.md), [StatusBadge](StatusBadge.md) e [Button](Button.md). Implementação: [ServiceOrderCard.tsx](../../src/shared/ui/ServiceOrderCard/ServiceOrderCard.tsx). Referências Figma: [planeada](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ?node-id=184-3468) e [em execução](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ?node-id=184-3530).

Importa `ServiceOrderCard` e `ServiceOrderCardData` de `src/shared/ui/ServiceOrderCard` e usa o componente dentro de `ThemeProvider`. A aplicação fornece os dados e escolhe a variante de apresentação.

| Propriedade | Comportamento |
| --- | --- |
| `order.id`, `reference` | Identificador e referência obrigatórios e não vazios. A referência é o título; o identificador acompanha o objeto da ação. |
| `order.subtitle` | Descrição opcional apresentada abaixo da referência. |
| `order.clientName`, `location` | Textos opcionais de cliente e local. |
| `order.scheduledAt`, `team`, `responsible` | Textos opcionais de agendamento, equipa e responsável; são omitidos quando não existem ou estão vazios. A data é fornecida já formatada. |
| `state` | `planned` apresenta por omissão «Planeada»; `active`, «Em execução». São variantes visuais, não transições de estado. |
| `onOpen` | Opcional. Recebe o objeto `order`; o botão só aparece quando o callback existe. |
| `status` | Substitui o badge por `{ label, tone }`, usando um tom suportado pelo `StatusBadge`. |
| `labels` | Personaliza estados, nomes das linhas e ações. |
| `extraFields` | Acrescenta pares `{ label, value }`; valores ausentes ou vazios são omitidos. A etiqueta de uma linha apresentada deve ser não vazia. |
| `actions` | Elementos React Native adicionais, sob responsabilidade do consumidor. |
| `style`, `testID` | Personalização e identificação do contentor `Card`. |

O componente não obtém dados, interpreta datas ou fusos horários, navega nem decide permissões. A aplicação deve fornecer a data no formato e fuso apropriados. Os campos fornecidos são apresentados independentemente da variante; o consumidor decide quais disponibilizar. Título, badge e ação têm semântica nativa; cada linha associa rótulo e valor para leitores de ecrã. O texto pode crescer e quebrar.

`AppTheme.card`, `statusBadge` e `businessCard` configuram a apresentação; `SummaryDetail` e `SummaryStatus` estão disponíveis em `src/shared/ui/BusinessCard`. As demonstrações executáveis ficam apenas locais. Os [testes locais](../../src/shared/ui/ServiceOrderCard/ServiceOrderCard.test.tsx) ficam fora de `test:ci`; não substituem verificação nativa, leitores de ecrã, dimensões reduzidas ou ampliação de fonte.

No tema claro, as linhas usam texto de 12 pontos, intervalo de 10 e etiqueta com largura de referência de 120, conforme o Figma. A largura preferencial de 100 para o valor e a quebra das linhas são adaptações para diferentes ecrãs; estas medidas podem ser alteradas em `businessCard`.
