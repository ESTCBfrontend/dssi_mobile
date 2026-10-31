# MDS/Button

Primeiro componente da biblioteca mobile. Apresenta uma ação e emite callbacks; não conhece ordens, equipamentos, navegação, rede ou armazenamento. Implementação: [Button.tsx](../../src/shared/ui/Button/Button.tsx). Referência: [Figma, nó 29:2](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ?node-id=29-2).

## Utilização

A composição envolve os componentes em `ThemeProvider`, que carrega a Inter Medium local com `expo-font`. Enquanto carrega, apresenta `fallback` (por omissão, `null`); uma falha é propagada para o tratamento de erros da composição. Não faz downloads de fontes durante a execução.

Importa `Button` de `src/shared/ui/Button` e `ThemeProvider` de `src/shared/ui/theme`, ajustando o caminho ao módulo consumidor. Envolve a área relevante no provider, fornece `label` e `onPress`, e controla `loading` e `disabled` a partir do consumidor. O provider pode envolver toda a árvore da aplicação.

As demonstrações e os exemplos executáveis usados no desenvolvimento ficam apenas locais, fora do controlo de versões. Esta documentação descreve o contrato do componente e a sua integração.

## Contrato

| Propriedade | Comportamento |
| --- | --- |
| `label: string` | Obrigatória e não vazia; texto visível e nome acessível por omissão. |
| `onPress` | Obrigatório; callback nativo de `Pressable`. |
| `variant` | `primary` (omissão), `secondary`, `outline`, `danger`. |
| `size` | `small`, `medium` (omissão), `large`. |
| `disabled` | Bloqueia interação e aplica os tokens desativados. |
| `loading` | Estado controlado; bloqueia interação e anuncia `busy`. Usa `ActivityIndicator` nativo, sem criar outra família de componentes. |
| `loadingLabel` | Texto opcional durante carregamento; conserva o nome acessível da ação. |
| `iconStart`, `iconEnd` | Conteúdo decorativo ou função `({ color, size }) => ReactNode`; não criam ações próprias. O indicador substitui `iconStart` durante carregamento. |
| `fullWidth` | Ocupa a largura disponibilizada pelo contentor. |
| `style`, `textStyle` | Overrides locais de contentor e rótulo. Evita alturas fixas ou dimensões que eliminem a área tátil. |
| `accessibilityLabel`, `accessibilityHint` | Nome alternativo e indicação contextual, quando necessários. |
| Eventos e integração nativa | `onFocus`, `onBlur`, `onLongPress`, `onPressIn`, `onPressOut`, `onLayout`, `hitSlop`, `delayLongPress`, `testID`, `nativeID` e `ref`. |

O componente não gere promises nem inicia loading automaticamente. O consumidor valida permissões, controla a operação e apresenta erros. `danger` comunica a intenção visual; a confirmação de uma ação irreversível pertence ao fluxo consumidor.

## Tema configurável

O provider recebe `themes`, um conjunto de paletas com o contrato `AppTheme`, e `mode`, que seleciona a paleta ou acompanha o sistema. Para personalizar o tema, cria uma nova configuração a partir de `lightTheme` e substitui apenas os tokens pretendidos, sem alterar o objeto original nem o Button. Providers aninhados limitam a alteração aos seus descendentes. Quando omissos, `mode` e `themes` herdam o contexto exterior; na raiz, o modo é `system`.

`themes` aceita `{ light, dark? }`. A coleção de cores semânticas consultada no Figma tem apenas o modo **Claro**; por isso a configuração inicial contém apenas `light`. O sistema ou `mode="dark"` usa a paleta clara enquanto não for fornecida uma paleta escura. Acrescentar uma paleta não exige alterar o Button. O provider não persiste a preferência nem altera as definições nativas da aplicação.

A tipografia também é configurável. A Inter Medium é fornecida localmente como `Inter-Medium`; outras famílias indicadas num tema devem ser carregadas pela composição antes de serem usadas.

## Correspondência com Figma

Valores consultados em 31/10/2026, nó `29:2` e coleção `MDS · Cores semânticas`.

| Figma | Token em `AppTheme` | Valor inicial |
| --- | --- | --- |
| `color/bg/brand` | `colors.actionPrimary` | `#2159b8` |
| `color/bg/action-secondary` | `colors.actionSecondary` | `#e9edf3` |
| `color/bg/action-danger` | `colors.actionDanger` | `#b42318` |
| `color/bg/action-disabled` | `colors.actionDisabled` | `#e9edf3` |
| `color/bg/surface` | `colors.surface` | `#ffffff` |
| `color/text/primary` | `colors.textPrimary` | `#1f2938` |
| `color/text/on-brand`, `color/text/on-danger` | `colors.textOnPrimary`, `colors.textOnDanger` | `#ffffff` |
| `color/text/brand` | `colors.textBrand` | `#194a9d` |
| `color/text/disabled` | `colors.textDisabled` | `#667385` |
| `color/border/focus` | `colors.borderFocus` | `#2159b8` |
| `color/border/disabled` | `colors.borderDisabled` | `#dee3eb` |
| `spacing/1..5` | `spacing.xs/sm/md/lg/xl` | `4/8/12/16/20` |
| `radius/md` | `radius.control` | `10` |
| Inter Medium, S/M/L | `typography` | `13/14/15`, peso `500` |
| Controlos M/L | `controls.mediumHeight/largeHeight` | `44/52` |

O Small do Figma mede 36 px e está documentado para desktop denso. No mobile mantém tipografia e espaçamento compactos, com área tátil mínima de 44 × 44 pontos. A altura é mínima, cresce com o conteúdo e respeita a ampliação de texto. Não há truncagem nem redução automática da fonte.

Estados de interação adicionais: feedback pressed por opacidade `0.9`; anel de foco com 2 pontos e afastamento de 2 pontos. A opacidade foi ajustada relativamente ao snippet do guia para preservar contraste: na variante primária sobre branco, o texto mantém uma relação aproximada de 5,28:1 durante a pressão. Estes comportamentos não representam novas variáveis extraídas do Figma. O carregamento conserva o estilo da variante e anuncia o estado, em vez de simular um resultado da operação.

## Validação

Os 14 testes em [Button.test.tsx](../../src/shared/ui/Button/Button.test.tsx) e [ThemeProvider.test.tsx](../../src/shared/ui/theme/ThemeProvider.test.tsx) verificam ações, bloqueio, carregamento, nomes acessíveis, foco, composição, personalização, seleção de tema e carregamento/erro da fonte. Por decisão explícita do utilizador, executam-se apenas localmente com `npm run test:components` (ou juntamente com todos os testes através de `npm test`).

O `test:ci` usa [jest.ci.config.cjs](../../jest.ci.config.cjs), que preserva a configuração base e exclui apenas estas duas suites. A descoberta dos restantes testes mantém-se ativa; não foram acrescentados jobs nem alteradas as outras verificações do pipeline.

Testes JavaScript não medem layout nativo, não substituem TalkBack/VoiceOver nem validam iOS. A validação no emulador Android e respetivas limitações são reportadas no PR.
