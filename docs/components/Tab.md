# MDS/Tab

Separador individual reutilizável e controlado pela composição. Não gere o conjunto de separadores, navegação ou conteúdo dos painéis. Implementação: [Tab.tsx](../../src/shared/ui/Tab/Tab.tsx). Referência: [Figma, nó 130:1883](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ?node-id=130-1883).

Importa `Tab` de `src/shared/ui/Tab` e usa-o dentro de `ThemeProvider`. A composição escolhe o separador ativo, trata `onSelect` e apresenta o conteúdo correspondente.

| Propriedade | Comportamento |
| --- | --- |
| `id`, `label` | Identificador e texto não vazios; o identificador é devolvido em `onSelect`. |
| `selected` | Estado controlado, indicado visualmente e através de `accessibilityState.selected`. |
| `onSelect` | Recebe o identificador; não altera a seleção por si só. |
| `disabled` | Impede interação e comunica o estado desativado. |
| `count` | Contador opcional, inteiro seguro não negativo, incluído no nome acessível por omissão. |
| `size` | `compact` ou `comfortable` (omissão), com alturas mínimas de 44 e 48 pontos. |
| `accessibilityLabel` | Nome alternativo não vazio, que substitui a etiqueta e o contador no nome acessível. |
| `accessibilityHint`, `style`, `testID`, `nativeID`, `onLayout`, `onFocus`, `onBlur`, `ref` | Integração e personalização nativa. |

O controlo expõe o papel `tab` e os estados selecionado e desativado. O foco recebe contorno visível; a seleção mantém o indicador inferior. Rótulo e contador podem crescer com a fonte, e a largura adapta-se ao conteúdo. O componente não estabelece por si só uma relação nativa com um painel; essa coordenação pertence à composição futura de `Tabs` e `TabPanel` e deve ser validada com leitores de ecrã.

## Tema e Figma

`AppTheme.tab` configura as cores e medidas. O Figma usa texto normal/desativado `#667385`, selecionado/focado `#194a9d`, indicador `#2159b8`, fundo de foco `#eff8ff`, foco `#2159b8` e Inter Medium 12/13; selecionado usa Inter SemiBold. O contador tem altura mínima 19 e o indicador 3 pontos. O tema pode ser substituído pelo consumidor.

As demonstrações executáveis ficam apenas locais. Os [testes locais](../../src/shared/ui/Tab/Tab.test.tsx) executam-se com `npm run test:components` e ficam fora de `test:ci`, conforme a preferência do utilizador. Testes JavaScript e exportação Android não substituem validação em dispositivo e leitores de ecrã.
