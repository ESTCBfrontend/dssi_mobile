# MDS/Dialog

Diálogo modal mobile com conteúdo e ações fornecidos pela aplicação. Implementação: [Dialog.tsx](../../src/shared/ui/Dialog/Dialog.tsx). Referências Figma: [compacto neutro](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ?node-id=139-2039), [compacto de perigo](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ?node-id=139-2067), [largo neutro](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ?node-id=139-2093) e [largo de perigo](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ?node-id=139-2117).

## Utilização e contrato

Importa `Dialog`, `DialogProps` e, quando necessário, `OverlayCloseReason`, `OverlayFocusRefs` e `OverlayInsets` de `src/shared/ui/Dialog`. Usa o componente dentro de `ThemeProvider` e mantém `open` na composição que gere a operação.

| Propriedade | Comportamento |
| --- | --- |
| `open` | Controla a visibilidade. A alteração só ocorre quando a aplicação atualiza esta prop. |
| `onCloseRequest` | Obrigatório. Recebe `closeButton`, `system` ou `backdrop` quando é pedido o fecho; a aplicação decide se fecha ou confirma alterações pendentes. |
| `title`, `description`, `message` | Título obrigatório; descrição e mensagem opcionais. Os textos fornecidos não podem ser vazios. `message` usa a cor de perigo quando `intent` é `danger`. |
| `children`, `actions` | Conteúdo e ações React opcionais. A aplicação fornece os controlos e callbacks reais; não são criados botões de confirmação automaticamente. |
| `size`, `intent` | `size`: `compact` (omissão) ou `wide`; `intent`: `neutral` (omissão) ou `danger`. A largura máxima adapta-se ao espaço disponível. |
| `dismissible`, `showClose`, `closeLabel` | Por omissão permitem e mostram «Fechar». `dismissible={false}` bloqueia pedidos por botão, sistema e fundo; o consumidor continua a controlar `open`. |
| `dismissOnBackdrop` | `false` por omissão; quando verdadeiro, um toque fora solicita o fecho se `dismissible`. |
| `initialFocusRef`, `returnFocusRef` | Referências opcionais a elementos nativos acessíveis. Ao abrir tenta focar o primeiro ou o título; após `open` passar a falso, tenta devolver foco ao segundo. Mantém o diálogo montado durante a transição de `open` para permitir essa tentativa. |
| `safeAreaInsets` | Margens opcionais `{ top, right, bottom, left }`, finitas e não negativas; por omissão são zero. A composição deve fornecer as margens adequadas à janela modal quando necessárias. |
| `style`, `testID` | Personalização e identificação da superfície. Com `testID`, o modal nativo, o fundo e o scroll recebem os sufixos `-native`, `-backdrop` e `-scroll`. |

O botão de voltar do Android encaminha `system` através de `onRequestClose`; a ação de acessibilidade de escape também pede `system`. Os pedidos não alteram `open`, não executam nem confirmam operações. Ao ocultar o botão de fecho ou desativar pedidos, o consumidor deve fornecer uma forma acessível de concluir ou abandonar a operação. Ações destrutivas exigem confirmação e tratamento de dados pela funcionalidade consumidora.

## Acessibilidade, tema e Figma

O título usa semântica de cabeçalho e a superfície é marcada como modal para acessibilidade. O conteúdo e as ações são percorríveis; o corpo usa `ScrollView` e `KeyboardAvoidingView` no iOS. No Android, o ajuste ao teclado depende da janela e da configuração nativa. Referências de foco têm de apontar para elementos nativos acessíveis e devem ser verificadas em dispositivo. Os conteúdos fornecidos pelo consumidor mantêm a sua própria acessibilidade.

`AppTheme.overlay` configura cores e medidas. O Figma define superfície branca, contorno `#dee3eb`, raio 20, padding 24 no compacto e 28 no largo, e botão de fecho de 44 pontos. O fundo escurecido e a margem de viewport são adaptações configuráveis, não valores definidos na superfície Figma. O ícone de fecho reutiliza o SVG já existente em `Alert`.

## Verificação

Os [testes locais](../../src/shared/ui/Dialog/Dialog.test.tsx) verificam o contrato controlado, pedidos de fecho, bloqueio, conteúdo e margens. Executam-se com `npm run test:components`, fora de `test:ci` por decisão do utilizador. As demonstrações executáveis ficam apenas locais. Áreas seguras, teclado, foco, leitores de ecrã e tamanhos/ampliação de texto requerem validação nativa Android e iOS.
