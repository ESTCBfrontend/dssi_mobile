# MDS/Tabs

Conjunto de separadores controlado com deslocação horizontal e apresentação do painel selecionado. Implementação: [Tabs.tsx](../../src/shared/ui/Tabs/Tabs.tsx); referência: [Figma, nó 131:1955](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ?node-id=131-1955). Compõe [Tab](Tab.md) e [TabPanel](TabPanel.md), sem fazer navegação nem gerir dados de negócio.

Importa `Tabs` de `src/shared/ui/Tabs` e usa-o dentro de `ThemeProvider`. O consumidor controla `value` e atualiza-o em `onChange`.

| Propriedade | Comportamento |
| --- | --- |
| `items` | Lista não vazia com `id` único, `label` e `content`; opcionalmente `disabled`, `count`, `accessibilityLabel`, `panelTitle`, `panelDescription`, `panelActions` e `panelSurface`. |
| `value`, `onChange` | Identificador ativo e callback com o novo identificador. `value` deve existir em `items`; a seleção não é alterada internamente. |
| `keepMounted` | `false` por omissão: apenas o painel ativo é montado; ao sair perde o estado interno. `true` monta todos e oculta os inativos, preservando estado mas mantendo os seus efeitos e custo de memória. |
| `size` | Tamanho dos separadores `compact` (omissão) ou `comfortable`. |
| `accessibilityLabel` | Nome da lista, por omissão `Separadores`. |
| `style`, `testID`, `onLayout` | Personalização e integração nativa do contentor. |

Cada separador expõe o estado selecionado ou desativado e os painéis inativos não são interativos nem visíveis à acessibilidade. São gerados identificadores distintos para cada conjunto e o identificador do separador é encaminhado ao painel por `accessibilityLabelledBy`. A API nativa documenta esta propriedade apenas em Android: a associação efetiva e a experiência com TalkBack, VoiceOver e teclado físico devem ser validadas em dispositivos; não se garante navegação por setas ou associação equivalente em iOS. O conteúdo de cada painel mantém os seus controlos independentes.

## Tema e verificação

`AppTheme.tabs` configura a linha de base e os intervalos. As cores e medidas dos separadores e painéis são configuradas por `AppTheme.tab`, `AppTheme.tabPanel` e `AppTheme.contentPanel`. As demonstrações executáveis ficam apenas locais. Os [testes locais](../../src/shared/ui/Tabs/Tabs.test.tsx) executam-se com `npm run test:components`, fora de `test:ci`, conforme a preferência do utilizador. Testes JavaScript e exportação Android não substituem validação nativa.
