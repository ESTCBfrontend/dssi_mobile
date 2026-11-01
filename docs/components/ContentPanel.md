# MDS/ContentPanel

Contentor reutilizável para secções, sem lógica de negócio, navegação ou conteúdo automático. Implementação: [ContentPanel.tsx](../../src/shared/ui/ContentPanel/ContentPanel.tsx). Referência: [Figma, nó 94:1081](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ?node-id=94-1081).

Importa `ContentPanel` de `src/shared/ui/ContentPanel` e usa-o dentro de `ThemeProvider`. Os espaços recebem componentes reais da aplicação, por exemplo [Button](Button.md) e [Card](Card.md).

| Propriedade | Comportamento |
| --- | --- |
| `title`, `description` | Texto opcional, não vazio quando fornecido; o título é identificado como cabeçalho. |
| `actions` | Controlos opcionais no cabeçalho; o consumidor define o respetivo comportamento. |
| `children` | Conteúdo principal em componentes React Native. |
| `footer` | Conteúdo opcional após um separador. |
| `layout` | `stacked` (omissão) apresenta as ações abaixo do texto; `wide` coloca-as ao lado a partir de 480 pontos de largura do painel e abaixo em espaços menores. O limiar pode ser configurado no tema. |
| `surface` | `surface` (omissão), com contorno e fundo branco, ou `muted`, com fundo subtil e sem contorno. |
| `style`, `testID`, `nativeID`, `onLayout` | Personalização e integração nativa do contentor. |

O painel adapta-se à largura e cresce em altura; os espaços não têm conteúdo de exemplo nem altura fixa. Os separadores surgem apenas entre regiões presentes. Os controlos mantêm a sua própria acessibilidade e o painel não agrupa todos os filhos num único elemento. A aplicação controla a visibilidade do conteúdo quando necessário.

## Tema e Figma

`AppTheme.contentPanel` configura cores, tipografia e espaçamentos. O Figma usa fundo `#ffffff` ou `#fafbfd`, contorno e separadores `#dee3eb`, raio 14, título `#1f2938` em Inter SemiBold 18/26 e descrição `#667385` em Inter Regular 14/21. Stacked usa padding 16 e intervalo 14; wide usa padding 24 e intervalo 18. Uma paleta alternativa pode ser fornecida pelo consumidor.

As demonstrações executáveis ficam apenas locais. Os [testes locais](../../src/shared/ui/ContentPanel/ContentPanel.test.tsx) executam-se com `npm run test:components` e ficam fora de `test:ci`, conforme a preferência do utilizador. Testes JavaScript e exportação Android não substituem validação em dispositivo e leitores de ecrã.
