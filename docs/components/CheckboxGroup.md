# MDS/CheckboxGroup

Grupo controlado de seleções independentes, composto pelos [Checkbox](Checkbox.md) existentes. Não valida regras de negócio nem representa os estados específicos de um item de checklist. Implementação: [CheckboxGroup.tsx](../../src/shared/ui/CheckboxGroup/CheckboxGroup.tsx). Referência: [Figma, nó 69:667](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ?node-id=69-667).

Importa `CheckboxGroup` de `src/shared/ui/CheckboxGroup` e usa-o dentro de `ThemeProvider`. O consumidor fornece a lista de valores selecionados e atualiza-a em `onChange`; o grupo apresenta cada Checkbox de acordo com essa lista. A validação e a mensagem de erro pertencem ao consumidor.

| Propriedade | Comportamento |
| --- | --- |
| `label` | Título visível não vazio e identificação do grupo no nome acessível das opções. |
| `description` | Texto complementar opcional junto do título. |
| `helperText` | Informação complementar apresentada depois das opções e incluída na ajuda acessível. |
| `options` | Lista dinâmica de `{ value, label, description?, disabled? }`. Os valores têm de ser únicos; lista vazia é permitida. |
| `values`, `onChange` | Valores controlados e sem duplicados; o callback recebe uma nova lista. Valores que não estejam temporariamente em `options` são preservados. |
| `error` | Mensagem não vazia que substitui a ajuda visível, altera o contorno e é incluída na ajuda acessível das opções. A validação é da responsabilidade do consumidor. |
| `disabled` | Desativa todas as opções; uma opção pode também ser desativada individualmente. |
| `layout` | `stacked` (omissão) ou `twoColumns`. Duas colunas só são usadas quando a largura medida do contentor as comporta. |
| `size` | `compact` ou `comfortable` (omissão), encaminhado para cada Checkbox. |
| `style`, `testID`, `nativeID`, `onLayout` | Personalização e integração nativa do contentor. |

Cada opção continua a expor papel, nome, seleção e desativação acessíveis; o título do grupo integra o nome e o erro ou ajuda é encaminhado como ajuda acessível. O título permanece navegável e as opções são elementos individuais. A composição não dispara anúncios automáticos; o comportamento com leitores de ecrã deve ser confirmado no contexto da plataforma.

O grupo já apresenta título e erro próprios conforme o Figma. Se for composto com `FormField`, evita duplicar etiquetas e mensagens. Textos podem crescer e quebrar linha; as demonstrações executáveis ficam exclusivamente locais.

## Tema e Figma

`AppTheme.checkboxGroup` configura cores e dimensões do contentor e tipografia: fundo `#ffffff`, contorno normal `#dee3eb`, erro `#b42318`, raio 14, padding 18/24 e intervalos 18/8/16. O título usa Inter Semi Bold 18/26, descrição Inter Regular 13 e mensagem Inter Regular 12/18. As opções usam os tokens e recursos do Checkbox. O limite de 180 pontos por coluna é uma adaptação configurável, não uma medida do Figma. Uma paleta escura pode ser fornecida pela composição.

## Verificação

Os [testes locais](../../src/shared/ui/CheckboxGroup/CheckboxGroup.test.tsx) cobrem seleções múltiplas, preservação de valores ausentes, erro, opções desativadas, adaptação de largura, duplicados, lista vazia e tema. Executam-se com `npm run test:components` e ficam fora do `test:ci`, conforme preferência do utilizador. A exportação Android e os testes JavaScript não substituem validação nativa, leitores de ecrã e iOS.
