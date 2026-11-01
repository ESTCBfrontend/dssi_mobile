# MDS/Checkbox

Controlo de seleção independente, com estado controlado pelo consumidor. Suporta selecionado, não selecionado e misto; não interpreta resultados de uma checklist de negócio. Implementação: [Checkbox.tsx](../../src/shared/ui/Checkbox/Checkbox.tsx). Referência: [Figma, nó 67:641](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ?node-id=67-641).

Importa `Checkbox` de `src/shared/ui/Checkbox` e usa-o dentro de `ThemeProvider`.

| Propriedade | Comportamento |
| --- | --- |
| `label` | Etiqueta visível e não vazia; é também o nome acessível por omissão. |
| `checked`, `onChange` | O consumidor fornece o valor e recebe o próximo booleano; o controlo não altera o valor sozinho. |
| `indeterminate` | Mostra e comunica seleção mista; ao ativar o controlo chama `onChange(true)`. O consumidor deve atualizar tanto `checked` como `indeterminate`. |
| `description` | Texto complementar visível e ajuda acessível; não cria uma segunda ação. |
| `disabled` | Bloqueia a interação e comunica o estado. |
| `size` | `compact` ou `comfortable` (omissão); ambos mantêm pelo menos 44 pontos de altura tátil. |
| `accessibilityLabel`, `accessibilityHint` | Nome e ajuda opcionais; a descrição é acrescentada à ajuda. |
| `onFocus`, `onBlur`, `ref`, `testID`, `nativeID`, `onLayout`, `style` | Integração nativa e personalização local do contentor. |

O componente expõe o papel nativo `checkbox` e os estados `checked`, `mixed` e `disabled`. Foco acompanha os eventos nativos. A etiqueta e a descrição podem crescer e quebrar linhas; não se desativa a ampliação da fonte. A definição das opções, da validação e do estado de negócio pertence ao consumidor.

As demonstrações executáveis são exclusivamente locais e não entram no Git.

## Tema e Figma

`AppTheme.checkbox` configura cores, tipografia, tamanhos e geometria. O Figma define fundo branco `#ffffff`, contorno `#667385`, seleção `#2159b8`, marca `#ffffff`, foco `#2159b8`, fundo desativado `#e9edf3`, contorno desativado `#dee3eb`, marca desativada `#475569` e texto desativado `#667385`. Etiqueta usa Inter Medium 14/20 e descrição Inter Regular 12/18.

O quadrado mede 18 pontos (compact) ou 20 (comfortable), com raio 5/6. O Figma indica altura de 36 para compact e 44 para comfortable; ambas são adaptadas a uma área tátil mínima de 44 pontos em mobile. O visto de 14×14 é o SVG original do Figma, incluindo a variante desativada; a barra do estado misto é uma primitiva nativa de 10×2. `expo-image` carrega os recursos vetoriais locais e aplica a cor do tema. A paleta escura pode ser fornecida pelo consumidor.

## Verificação

Os [testes locais](../../src/shared/ui/Checkbox/Checkbox.test.tsx) cobrem mudanças, estado misto, desativação, nome e ajuda acessíveis, foco, tema e textos longos. Executam-se com `npm run test:components` e ficam fora do `test:ci`, por preferência do utilizador. A execução em dispositivo e com leitores de ecrã deve ser reportada no PR.
