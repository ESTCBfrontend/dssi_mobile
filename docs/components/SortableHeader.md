# MDS/SortableHeader

Controlo mobile para pedir ordenação por um campo. Implementação: [SortableHeader.tsx](../../src/shared/ui/SortableHeader/SortableHeader.tsx). Referência: [Figma, variantes](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ?node-id=121-1697). No mobile é um botão independente; não representa um cabeçalho HTML de tabela.

Importa `SortableHeader` e `SortDirection` de `src/shared/ui/SortableHeader` e usa-o dentro de `ThemeProvider`.

| Propriedade | Comportamento |
| --- | --- |
| `label` | Nome não vazio do campo a ordenar. |
| `direction` | Estado controlado: `none`, `ascending` ou `descending`. |
| `onSort` | Recebe o próximo estado: nenhuma → ascendente → descendente → nenhuma. A aplicação aplica a ordenação e atualiza `direction`. |
| `disabled` | Bloqueia pedidos de ordenação. |
| `labels` | Personaliza o nome acessível, a descrição de cada direção e a indicação da próxima ação. |
| `style`, `testID` | Personalização e identificação do botão. |

O botão anuncia a direção atual e a próxima ação; as setas são decorativas. O foco é visível e o alvo tem altura mínima de 44 pontos. A direção não altera uma lista por si só: o consumidor deve fornecer os dados já ordenados, localmente ou pelo servidor. `AppTheme.dataList` configura cores, foco, tipografia e raio. As setas são caracteres do Figma suportados pela Inter SemiBold local.

As demonstrações executáveis ficam apenas locais. Os [testes locais](../../src/shared/ui/SortableHeader/SortableHeader.test.tsx) ficam fora de `test:ci`; a validação nativa e com leitores de ecrã continua necessária.
