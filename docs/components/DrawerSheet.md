# MDS/DrawerSheet

Painel modal mobile apresentado na parte inferior ou em ecrã inteiro, com conteúdo e ações fornecidos pela aplicação. Implementação: [DrawerSheet.tsx](../../src/shared/ui/DrawerSheet/DrawerSheet.tsx). Referências Figma: [inferior](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ?node-id=141-2094) e [ecrã inteiro](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ?node-id=141-2121). A variante lateral do Figma é de desktop e não faz parte deste contrato mobile.

## Utilização e contrato

Importa `DrawerSheet`, `DrawerSheetProps`, `DrawerSheetPlacement` e, quando necessário, `OverlayCloseReason`, `OverlayFocusRefs` e `OverlayInsets` de `src/shared/ui/DrawerSheet`. Usa-o dentro de `ThemeProvider` e controla `open` na composição.

| Propriedade | Comportamento |
| --- | --- |
| `open` | Controla a visibilidade; o painel não se fecha internamente. |
| `onCloseRequest` | Obrigatório. Recebe `closeButton`, `system`, `backdrop` ou `swipe`. O consumidor decide se fecha, por exemplo após confirmar alterações pendentes. |
| `title`, `description`, `message` | Título obrigatório; descrição e mensagem opcionais. Os textos fornecidos não podem ser vazios. |
| `children`, `actions` | Conteúdo e ações React opcionais. A composição fornece os controlos e respetivas operações. |
| `placement` | `bottom` por omissão ou `fullscreen`. O painel inferior limita a largura máxima e o de ecrã inteiro ocupa o espaço da janela. |
| `showHandle` | Mostra a pega no painel inferior por omissão. Um gesto descendente a partir da pega que ultrapasse o limiar pede `swipe`; não aparece em `fullscreen`. |
| `dismissible`, `showClose`, `closeLabel` | Por omissão permitem e mostram «Fechar». Com `dismissible={false}`, botão, gesto, sistema e fundo não pedem fecho. |
| `dismissOnBackdrop` | `false` por omissão; quando verdadeiro, um toque fora solicita o fecho se `dismissible`. |
| `initialFocusRef`, `returnFocusRef` | Referências opcionais a elementos nativos acessíveis: tenta focar o primeiro ou o título na abertura e devolver foco ao segundo quando `open` passa a falso. Mantém o painel montado durante essa transição. |
| `safeAreaInsets` | Margens opcionais `{ top, right, bottom, left }`, finitas e não negativas; por omissão zero. A composição fornece os valores adequados à janela modal quando necessários. |
| `style`, `testID` | Personalização e identificação da superfície; os sufixos `-native`, `-backdrop`, `-scroll` e `-handle` identificam elementos internos quando presentes. |

O gesto, o botão e o voltar do sistema apenas chamam `onCloseRequest`; nenhum deles descarta dados. O consumidor deve preservar ou confirmar alterações e fornecer uma saída acessível, sobretudo quando o botão de fecho está oculto ou `dismissible` está desativado. `showHandle` não é um controlo acessível independente: o botão de fecho e as ações da composição devem permitir a mesma saída.

## Acessibilidade, tema e Figma

O título é cabeçalho e a superfície é marcada como modal. O conteúdo e as ações podem ser percorridos; o scroll permite interagir com controlos enquanto o teclado está aberto e usa `KeyboardAvoidingView` no iOS. O ajuste no Android depende da janela e da configuração nativa. O consumidor deve fornecer margens seguras adequadas e confirmar teclado, barras de sistema e foco na janela modal, incluindo dispositivos edge-to-edge.

`AppTheme.overlay` configura cores, fontes, dimensões e `swipeThreshold` (60 pontos por omissão). O Figma usa padding 18 e raio 20 no painel inferior; em ecrã inteiro, padding 20 e raio 14. A pega visual tem 42 × 5 pontos. O fundo escurecido e o limite de largura do painel inferior são adaptações configuráveis. O ícone de fecho reutiliza o SVG existente em `Alert`.

## Verificação

Os [testes locais](../../src/shared/ui/DrawerSheet/DrawerSheet.test.tsx) verificam ações controladas, apresentação, margens e o pedido de fecho associado ao gesto simulado. Executam-se com `npm run test:components`, fora de `test:ci` por decisão do utilizador. As demonstrações executáveis ficam apenas locais. Gesto real, teclado, áreas seguras, foco, leitores de ecrã e ampliação de texto requerem validação nativa Android e iOS.
