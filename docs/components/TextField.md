# MDS/TextField

Campo de texto de uma linha, controlado pelo consumidor e reutilizável em formulários. O campo não valida regras de negócio nem envia dados. Implementação: [TextField.tsx](../../src/shared/ui/TextField/TextField.tsx); referência: [Figma, nó 35:19](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ?node-id=35-19).

Importa `TextField` de `src/shared/ui/TextField` e utiliza-o dentro de `ThemeProvider`. A composição fornece uma etiqueta visível e, quando necessário, uma mensagem de erro visível junto do campo. O futuro FormField poderá reunir estes elementos; o TextField não o implementa.

| Propriedade | Comportamento |
| --- | --- |
| `value`, `onChange` | Valor controlado e callback que recebe a nova string. |
| `accessibilityLabel` | Obrigatória e não vazia, identifica o campo mesmo sem placeholder. |
| `size` | `small`, `medium` (omissão) ou `large`. |
| `disabled` | Desativa a edição e comunica o estado; omissão `false`. |
| `error` | Mensagem não vazia fornecida pelo consumidor. Ativa o estado visual de erro e é incluída na ajuda acessível. A composição deve mostrá-la também em texto. |
| `iconStart` | Elemento decorativo ou função que recebe `{ color, size }`. Não captura toques nem cria uma ação acessível. |
| `style`, `inputStyle` | Ajustes locais do contentor e do texto. |
| Props nativas | Aceita, entre outras, `placeholder`, `keyboardType`, `autoCapitalize`, `autoComplete`, `secureTextEntry`, `onFocus`, `onBlur`, `accessibilityHint`, `testID` e `ref` do TextInput. |

O estado focado acompanha o foco nativo; erro tem prioridade visual sobre foco e desativado sobre ambos. O componente usa `onChangeText` internamente, mantém a mesma instância de entrada nas atualizações e não altera a capitalização ou o teclado por conta própria. A largura acompanha o contentor e o texto respeita a ampliação nativa.

As demonstrações executáveis são exclusivamente locais e não entram no Git.

## Tema e Figma

Os tokens configuráveis residem em `AppTheme.textField`. O Figma define fundo branco `#ffffff`, fundo desativado `#f5f7fa`, contorno normal/desativado `#dee3eb`, foco `#2159b8`, erro `#b42318`, placeholder/desativado `#667385`, raio 10, espaçamento 8 e padding horizontal 14. O texto introduzido usa o token existente de texto primário `#1f2938`. Contorno normal de 1 ponto e de foco/erro de 2 pontos.

O Figma indica alturas 36, 44 e 52 pontos e Inter Regular 14, 14 e 16, respetivamente. Em mobile a altura mínima do Small é adaptada para 44 pontos de área tátil; Medium e Large mantêm 44 e 52. As alturas são mínimas para permitir crescimento com fonte ampliada. O provider carrega Inter Regular e Medium locais, com a licença existente. A paleta escura pode ser fornecida pelo consumidor.

O ícone inicial é opcional e fornecido pelo consumidor; a matriz de referência não mostra ícone por omissão. O campo reserva 20 pontos como referência ao passar o tamanho para uma função de ícone.

## Validação

Os [testes locais](../../src/shared/ui/TextField/TextField.test.tsx) executam-se com `npm run test:components` e não integram `test:ci`, conforme a preferência do utilizador. Testes JavaScript e exportação Android não substituem testes nativos, TalkBack ou VoiceOver.
