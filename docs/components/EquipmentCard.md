# MDS/EquipmentCard

Resumo mobile de um equipamento, composto a partir de [Card](Card.md), [StatusBadge](StatusBadge.md) e [Button](Button.md). Implementação: [EquipmentCard.tsx](../../src/shared/ui/EquipmentCard/EquipmentCard.tsx). Referências Figma: [operacional](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ?node-id=184-3704) e [requer revisão](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ?node-id=184-3760).

Importa `EquipmentCard` e `EquipmentCardData` de `src/shared/ui/EquipmentCard` e usa o componente dentro de `ThemeProvider`. A aplicação fornece os dados e escolhe a variante visual.

| Propriedade | Comportamento |
| --- | --- |
| `equipment.id`, `reference`, `identifier` | Obrigatórios e não vazios. `reference` é o título; `identifier` é apresentado na linha «Identificação»; `id` acompanha o objeto da ação. |
| `equipment.subtitle` | Descrição opcional abaixo do título. |
| `equipment.location`, `lastInspection`, `nextService`, `issue` | Textos opcionais apresentados quando fornecidos e não vazios. Datas devem ser previamente formatadas pela aplicação. |
| `state` | `operational` apresenta «Operacional»; `needsService`, «Requer revisão». A variante não determina o estado real do equipamento. |
| `onOpen` | Opcional. Recebe o objeto `equipment`; o botão só aparece quando este callback existe. |
| `status` | Substitui o badge por `{ label, tone }`, usando um tom suportado pelo `StatusBadge`. |
| `labels` | Personaliza estados, nomes das linhas e ações. |
| `extraFields` | Acrescenta pares `{ label, value }`; valores ausentes ou vazios são omitidos. Uma linha apresentada exige etiqueta não vazia. |
| `actions` | Elementos React Native adicionais, sob responsabilidade do consumidor. |
| `style`, `testID` | Personalização e identificação do contentor `Card`. |

O componente não obtém dados, interpreta datas, navega ou verifica permissões. Uma eventual ação QR deve ser implementada e autorizada pela funcionalidade consumidora. O título, o badge e a ação têm semântica nativa; cada linha associa rótulo e valor para leitores de ecrã. O texto pode crescer e quebrar, e os campos fornecidos não são descartados por causa da variante escolhida.

`AppTheme.card`, `statusBadge` e `businessCard` configuram a apresentação; `SummaryDetail` e `SummaryStatus` estão disponíveis em `src/shared/ui/BusinessCard`. As demonstrações executáveis ficam apenas locais. Os [testes locais](../../src/shared/ui/EquipmentCard/EquipmentCard.test.tsx) ficam fora de `test:ci`; não substituem validação em dispositivo, leitores de ecrã, dimensões reduzidas ou ampliação de fonte.

No tema claro, as linhas usam texto de 12 pontos, intervalo de 10 e etiqueta com largura de referência de 120, conforme o Figma. A largura preferencial de 100 para o valor e a quebra das linhas são adaptações para diferentes ecrãs; estas medidas podem ser alteradas em `businessCard`.
