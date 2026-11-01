# MDS/RadioGroup

Grupo de escolhas mutuamente exclusivas, construído com os componentes [Radio](Radio.md) existentes. O grupo não valida regras de negócio nem altera o valor por si só. Implementação: [RadioGroup.tsx](../../src/shared/ui/RadioGroup/RadioGroup.tsx). Referência: [Figma, nó 77:827](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ?node-id=77-827).

Importa `RadioGroup` de `src/shared/ui/RadioGroup` e utiliza-o dentro de `ThemeProvider`. A composição fornece um único `value` e atualiza-o em `onChange`. O grupo atribui o estado selecionado aos seus `Radio`. A validação, incluindo saber se uma opção é obrigatória, pertence ao consumidor.

| Propriedade | Comportamento |
| --- | --- |
| `label` | Título visível não vazio; também identifica o grupo no nome acessível das opções. |
| `description` | Texto complementar opcional apresentado junto ao título. |
| `options` | Lista dinâmica de `{ value, label, description?, disabled? }`. Os valores devem ser únicos; lista vazia é permitida. |
| `value`, `onChange` | Valor controlado `string` ou `null`; seleção envia o valor escolhido. Se o valor não constar da lista, nenhuma opção é apresentada como selecionada. |
| `error` | Mensagem não vazia que altera o contorno, aparece em texto e é incluída na ajuda acessível das opções. A decisão de a mostrar cabe ao consumidor. |
| `disabled` | Desativa todas as opções; uma opção pode também ser desativada individualmente. |
| `layout` | `stacked` (omissão) ou `twoColumns`. Duas colunas só são usadas quando a largura medida do contentor as comporta; caso contrário, mantém-se uma coluna. |
| `size` | `compact` ou `comfortable` (omissão), encaminhado para cada Radio. |
| `style`, `testID`, `nativeID`, `onLayout` | Personalização e integração nativa do contentor. |

Cada opção continua a expor o papel `radio`, nome, seleção e desativação; o título do grupo é incluído no nome acessível e o erro na ajuda. O título permanece navegável e as opções são elementos individuais. A apresentação e o anúncio de erros em leitores de ecrã devem ser confirmados no contexto da plataforma: a composição não dispara anúncios automáticos. As opções podem receber foco e ativação nativos; a navegação por setas entre opções ainda não está implementada.

O grupo já apresenta o seu título e erro próprios conforme o Figma. Quando usado com `FormField`, evita duplicar rótulos, mensagens e anúncios; o consumidor é responsável por essa composição. Textos podem crescer e quebrar linha, e as demonstrações executáveis ficam exclusivamente locais.

## Tema e Figma

`AppTheme.radioGroup` configura cores e dimensões do contentor e da tipografia: fundo `#ffffff`, contorno normal `#dee3eb` e de erro `#b42318`, raio 14, padding 18/24, intervalos 18/8/16. Título usa Inter Semi Bold 18/26; descrição Inter Regular 13; erro Inter Regular 12/18. As opções usam os tokens e SVGs já fornecidos pelo Radio. O limite de 180 pontos por coluna é uma adaptação configurável para a largura disponível, não uma medida do Figma.

Inter Semi Bold é fornecida localmente pela distribuição oficial Inter 4.1, com a licença já incluída e carregamento pelo `ThemeProvider`. Uma paleta escura pode ser fornecida pela composição.

## Verificação

Os [testes locais](../../src/shared/ui/RadioGroup/RadioGroup.test.tsx) cobrem valor ausente e seleção exclusiva, erro, opções desativadas, adaptação de largura, valores duplicados, lista vazia e tema. Executam-se com `npm run test:components` e ficam fora do `test:ci`, conforme preferência do utilizador. A exportação Android e os testes JavaScript não substituem a validação nativa, leitores de ecrã e iOS.
