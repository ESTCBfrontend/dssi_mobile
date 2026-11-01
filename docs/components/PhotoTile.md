# MDS/PhotoTile

Miniatura mobile de uma fotografia, com nome, estado e ações controlados pela aplicação. Implementação: [PhotoTile.tsx](../../src/shared/ui/PhotoTile/PhotoTile.tsx). Referências Figma: [pronta](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ?node-id=159-2578), [em envio](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ?node-id=159-2588) e [erro](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ?node-id=159-2600).

## Utilização e contrato

Importa `PhotoTile`, `PhotoTilePhoto` e `PhotoTileProps` de `src/shared/ui/PhotoTile`; `AttachmentState` é exportado por `src/shared/ui/AttachmentItem`. Usa-os dentro de `ThemeProvider`. A aplicação conserva os dados, estado e seleção e volta a fornecê-los quando mudam.

| Propriedade | Comportamento |
| --- | --- |
| `photo.id`, `photo.name` | Identificador e nome obrigatórios e não vazios. |
| `photo.uri`, `photo.alt` | URI e descrição opcionais. Sem descrição, o nome identifica a fotografia para acessibilidade. |
| `state` | Obrigatório: `ready`, `uploading` ou `error`. É fornecido pela aplicação. |
| `progress` | Percentagem finita entre 0 e 100, obrigatória durante `uploading`; o valor acessível é arredondado. |
| `selected` | Seleção visual controlada, `false` por omissão. Quando existe `onOpen`, o botão da miniatura expõe também o estado selecionado. |
| `onOpen` | Opcional. Torna a miniatura um botão e recebe o objeto `photo`. |
| `onRemove` | Opcional. Mostra remoção em `ready` e `error`, mas não durante `uploading`; recebe `photo`. |
| `onRetry` | Opcional. Mostra repetição apenas em `error` e recebe `photo`. |
| `labels` | Personaliza textos de estado, ações e nome acessível do progresso. |
| `style`, `testID` | Personalização e identificação do contentor; com `testID`, a imagem com URI também recebe o sufixo `-image` enquanto estiver apresentada. |

Uma URI usa imagem com recorte `cover`. Sem URI ou quando o carregamento falha, é apresentado o marcador ilustrativo do Figma; não representa uma fotografia real. A mesma URI marcada como falhada não é automaticamente recarregada; uma URI diferente ou remontagem permite nova tentativa. Nenhum callback altera dados, seleção ou estado por si; a aplicação gere permissões, captura, transferência e persistência.

## Acessibilidade, tema e Figma

Com `onOpen`, o nome acessível da ação combina o texto de abertura com `alt` ou `name`; sem ação, a imagem ou o marcador recebe essa descrição. A remoção tem alvo de 44 pontos e o progresso expõe percentagem acessível. A seleção é comunicada como estado do botão quando este existe; sem `onOpen`, a implementação apenas altera o contorno visual.

`AppTheme.media` configura cores, fontes e parte das medidas; o badge e o botão usam os respetivos tokens. O Figma usa largura de referência 154, padding 9, raio 14 e pré-visualização de altura 102. A largura pode ser ajustada por `style`; o texto e as ações podem aumentar a altura. O marcador ilustrativo usa SVGs locais exportados do Figma.

## Verificação

Os [testes locais](../../src/shared/ui/PhotoTile/PhotoTile.test.tsx) cobrem ações, seleção acessível com `onOpen`, progresso, erro, tema e marcador após falha da imagem. Executam-se com `npm run test:components` e ficam fora de `test:ci` por decisão do utilizador. As demonstrações executáveis ficam apenas locais. A validação visual, ampliação de texto e leitores de ecrã em dispositivo não são substituídos pelos testes JavaScript.
