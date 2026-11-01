# MDS/TableRow

Registo de listagem apresentado como cartão mobile. Implementação: [TableRow.tsx](../../src/shared/ui/TableRow/TableRow.tsx). Referências Figma: [normal](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ?node-id=108-1349) e [selecionado](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ?node-id=108-1367). Compõe [StatusBadge](StatusBadge.md) e [Button](Button.md).

Importa `TableRow` e `TableRowData` de `src/shared/ui/TableRow` e usa o componente dentro de `ThemeProvider`.

| Propriedade | Comportamento |
| --- | --- |
| `row.id`, `reference`, `title` | Identificador, referência e título obrigatórios e não vazios; os dados são fornecidos pela aplicação. |
| `row.detail` | Texto secundário opcional, por exemplo uma data já formatada. |
| `row.status` | Badge opcional `{ label, tone }`, com tom suportado por `StatusBadge`. |
| `row.selected` | Apresenta a variante selecionada e acrescenta a indicação acessível à referência. O consumidor controla a seleção. |
| `onOpen` | Opcional. Mostra uma ação que recebe o objeto `row`; não navega nem verifica permissões. |
| `actionLabel`, `selectedLabel` | Personalizam a ação e a indicação de seleção. |
| `style`, `testID` | Personalizam e identificam o contentor. |

A largura adapta-se ao contentor, o texto pode crescer e as linhas podem quebrar. A ação mantém o alvo tátil de `Button`. O estado selecionado não transforma o cartão inteiro num botão nem altera a seleção; é apresentado na referência para leitores de ecrã. A decisão de abrir e os dados acessíveis pertencem à aplicação.

`AppTheme.dataList` configura a superfície, contorno, tipografia e seleção. O Figma mobile define padding 16, raio 14, intervalo 12 e superfície selecionada `#eff8ff` com contorno `#2159b8`. As demonstrações executáveis ficam apenas locais. Os [testes locais](../../src/shared/ui/TableRow/TableRow.test.tsx) ficam fora de `test:ci`; não substituem validação em dispositivo, texto ampliado ou leitores de ecrã.
