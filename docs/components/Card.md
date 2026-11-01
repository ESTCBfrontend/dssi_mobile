# MDS/Card

Contentor reutilizável para conteúdo fornecido pela aplicação, sem regras de negócio, navegação ou ações automáticas. Implementação: [Card.tsx](../../src/shared/ui/Card/Card.tsx). Referência: [Figma, nó 92:1026](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ?node-id=92-1026).

Importa `Card` de `src/shared/ui/Card` e usa-o dentro de `ThemeProvider`. Os slots recebem componentes reais; a aplicação decide o conteúdo e a ação.

| Propriedade | Comportamento |
| --- | --- |
| `title`, `subtitle` | Texto opcional, não vazio quando fornecido; o título é identificado como cabeçalho. |
| `status` | Elemento opcional, por exemplo [StatusBadge](StatusBadge.md). |
| `children` | Conteúdo principal em componentes React Native. |
| `footer`, `actions` | Conteúdo opcional depois do separador; ações são apresentadas por último e podem quebrar para outra linha. |
| `density` | `compact` (omissão) ou `comfortable`. |
| `variant` | `outlined` (omissão) ou `elevated`. |
| `style`, `testID`, `nativeID`, `onLayout` | Personalização e integração nativa do contentor. |

A largura segue o contentor e a altura cresce com o conteúdo; título, subtítulo e ações não têm altura fixa. O cabeçalho pode distribuir o estado para outra linha quando necessário. O cartão não agrupa os filhos num único elemento acessível, preservando a leitura e interação de cada controlo. Os componentes colocados nos slots são responsáveis pelo seu próprio conteúdo e acessibilidade.

## Tema e Figma

`AppTheme.card` configura cores, tipografia, espaçamentos e sombra. O Figma usa fundo `#ffffff`, contorno e separador `#dee3eb`, raio 14, título `#1f2938` em Inter SemiBold e subtítulo `#667385` em Inter Regular 14/21. Compact usa padding 16, intervalo 12 e título 15; comfortable usa padding 24, intervalo 16 e título 18/26. A variante elevada usa sombra com desvio vertical 4 e opacidade 9%; a apresentação efetiva depende da plataforma. Uma paleta alternativa pode ser fornecida pelo consumidor.

As demonstrações executáveis ficam apenas locais. Os [testes locais](../../src/shared/ui/Card/Card.test.tsx) executam-se com `npm run test:components` e ficam fora de `test:ci`, conforme a preferência do utilizador. Testes JavaScript e exportação Android não substituem validação em dispositivo e leitores de ecrã.
