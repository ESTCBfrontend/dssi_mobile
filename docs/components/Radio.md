# MDS/Radio

Opção individual para uma escolha exclusiva controlada pelo consumidor. Implementação: [Radio.tsx](../../src/shared/ui/Radio/Radio.tsx). Referência: [Figma, nó 76:767](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ?node-id=76-767).

Importa `Radio` de `src/shared/ui/Radio` e usa-o dentro de `ThemeProvider`. A composição mantém um único valor selecionado, compara-o com o `value` de cada opção e atualiza-o no callback. O `RadioGroup` do catálogo ainda não está implementado; o Radio isolado não gere automaticamente exclusividade, rótulo de grupo nem navegação por setas entre opções.

| Propriedade | Comportamento |
| --- | --- |
| `value` | Identificador da opção, devolvido ao consumidor quando é selecionada. |
| `selected` | Estado controlado; não se altera internamente. |
| `onChange` | Recebe o `value` quando se ativa uma opção ainda não selecionada. Ativar a opção selecionada não comunica uma alteração. |
| `label` | Etiqueta visível não vazia e nome acessível por omissão. |
| `description` | Texto complementar visível e ajuda acessível. |
| `disabled` | Bloqueia interação e comunica o estado. |
| `size` | `compact` ou `comfortable` (omissão); ambos mantêm altura tátil mínima de 44 pontos. |
| `accessibilityLabel`, `accessibilityHint` | Nome e ajuda opcionais; a descrição é acrescentada à ajuda. |
| `onFocus`, `onBlur`, `ref`, `testID`, `nativeID`, `onLayout`, `style` | Integração nativa e personalização local do contentor. |

O componente expõe o papel nativo `radio` e os estados de seleção e desativação. O foco acompanha os eventos nativos. A etiqueta e a descrição quebram linha e respeitam a ampliação da fonte. A composição é responsável pela seleção exclusiva e deve identificar o grupo de opções.

As demonstrações executáveis são exclusivamente locais e não entram no Git.

## Tema e Figma

`AppTheme.radio` configura a tipografia, as cores de texto e os recursos dos estados. As cores claras do Figma incluem texto primário `#1f2938`, texto secundário/desativado `#667385`, seleção e foco `#2159b8` e contorno desativado `#dee3eb`. A etiqueta usa Inter Medium 14/20 e a descrição Inter Regular 12/18, com intervalo horizontal 8.

Os doze recursos SVG locais de 28×28 correspondem às combinações originais de tamanho, foco/desativação e seleção. São apresentados por `expo-image`, dependência já aprovada no Checkbox. Para alterar as cores dos círculos num tema personalizado, fornece recursos locais equivalentes em `radio.images`; as imagens originais têm as cores do Figma e não são automaticamente recoloridas ao mudar apenas as cores de texto. Cada recurso deve preservar a área e proporção de 28×28. O Figma indica altura de 36 para compact e 44 para comfortable; ambas são adaptadas a pelo menos 44 pontos táteis em mobile.

## Verificação

Os [testes locais](../../src/shared/ui/Radio/Radio.test.tsx) cobrem seleção controlada, exclusividade numa composição, seleção repetida, desativação, nome e ajuda acessíveis, foco, tema e textos longos. Executam-se com `npm run test:components` e ficam fora do `test:ci`, por preferência do utilizador. Navegação de grupo, leitores de ecrã e execução em iOS exigem validação própria.
