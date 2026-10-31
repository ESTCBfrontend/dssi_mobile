# MDS/Textarea

Campo de texto multilinha controlado pelo consumidor; não valida regras de negócio nem envia dados. Implementação: [Textarea.tsx](../../src/shared/ui/Textarea/Textarea.tsx). Referência: [Figma, nó 59:519](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ?node-id=59-519).

Importa `Textarea` de `src/shared/ui/Textarea` e usa-o em `ThemeProvider`. Para compor etiqueta visível, ajuda e erro usa [FormField](FormField.md), encaminhando as propriedades fornecidas pela composição.

| Propriedade | Comportamento |
| --- | --- |
| `value`, `onChange` | Valor controlado e callback com a nova string. |
| `accessibilityLabel` | Obrigatória e não vazia; independente do placeholder. |
| `height` | `compact` (omissão) ou `comfortable`; altura mínima de 112 ou 156 pontos. |
| `disabled` | Impede edição e comunica o estado. |
| `error` | Mensagem não vazia; ativa o estado visual e é incluída na ajuda acessível. Deve também ser apresentada em texto. |
| `maxLength` | Limite nativo de introdução, inteiro não negativo. O consumidor continua responsável pelo valor controlado fornecido. |
| `showCounter` | Apresenta o comprimento atual e, quando definido, o limite. A contagem usa unidades UTF-16 (`value.length`), pelo que emojis podem ocupar mais de uma unidade. O contador é incluído na ajuda acessível. |
| `style`, `inputStyle` | Ajustes do contentor e da entrada. |
| Props nativas | Inclui `placeholder`, `keyboardType`, `onFocus`, `onBlur`, `onContentSizeChange`, `accessibilityHint`, `testID` e `ref` do TextInput. |

O estado segue o foco nativo, com prioridade visual desativado, erro, foco e normal. A largura acompanha o contentor e a altura cresce com o conteúdo medido; a composição deve assegurar que o campo e o teclado cabem na área deslocável do ecrã. O texto respeita a ampliação nativa.

## Tema e Figma

`AppTheme.textarea` configura alturas, espaçamentos, tipografia e contador. Os estados visuais e a família de fonte são partilhados com `AppTheme.textField`: branco, desativado `#f5f7fa`, contorno `#dee3eb`, foco `#2159b8`, erro `#b42318` e texto secundário `#667385`. O Figma define Inter Regular 14 com altura de linha 21, padding horizontal 16 e vertical 14, raio 10 e contador 11. A paleta pode ser substituída pelo consumidor.

As demonstrações executáveis ficam apenas locais. Os [testes locais](../../src/shared/ui/Textarea/Textarea.test.tsx) executam-se com `npm run test:components`, fora de `test:ci`, por preferência do utilizador. Testes JavaScript e exportação Android não substituem validação em dispositivo, leitores de ecrã ou iOS.
