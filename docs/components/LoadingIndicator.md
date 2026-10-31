# MDS/LoadingIndicator

Indicador de carregamento indeterminado, sem iniciar nem controlar operações. Implementação: [LoadingIndicator.tsx](../../src/shared/ui/LoadingIndicator/LoadingIndicator.tsx). Referência: [Figma, nó 149:2367](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ?node-id=149-2367).

Importa `LoadingIndicator` de `src/shared/ui/LoadingIndicator` e utiliza-o dentro de `ThemeProvider`. Para progresso conhecido, usa [ProgressBar](ProgressBar.md).

| Propriedade | Comportamento |
| --- | --- |
| `type` | `spinner` (omissão), `inline` com texto, ou `skeleton`. |
| `size` | `compact` ou `comfortable` (omissão). |
| `label` | Nome acessível e texto visível em `inline`; por omissão `A processar…`. Não pode ser vazio em `inline`. |
| `accessibilityLabel` | Nome acessível alternativo não vazio. |
| `active` | Mostra o indicador quando verdadeiro (omissão); quando falso não apresenta conteúdo. |
| `reducedMotion` | Quando verdadeiro impede animação; nunca substitui a preferência de movimento reduzido do sistema. |
| `skeletonLines` | Número inteiro entre 1 e 20; por omissão 3. |
| `accessibilityLiveRegion` | `none` por omissão; a composição pode optar por anúncios apropriados ao contexto. |
| `accessibilityHint`, `style`, `testID`, `nativeID`, `onLayout` | Integração nativa e personalização do contentor. |

O componente expõe um único `progressbar` com estado ocupado e não inventa percentagens. O texto pode quebrar linha e acompanha a ampliação nativa. O esqueleto é estático. A rotação respeita alterações de movimento reduzido no dispositivo; até a preferência ser conhecida, ou se a consulta falhar, mantém-se estática. A animação não gera anúncios por fotograma.

## Tema e Figma

`AppTheme.loadingIndicator` permite configurar medidas, cores, tipografia, duração e recursos. O tema claro usa fundo `#ffffff`, contorno `#dee3eb`, texto `#667385` em Inter Medium e linhas `#e9edf3`. Os dois SVGs circulares são os recursos originais do Figma: para alterar as suas cores, substitui os recursos através do tema. Não existe paleta escura publicada.

As demonstrações executáveis ficam apenas locais. Os [testes locais](../../src/shared/ui/LoadingIndicator/LoadingIndicator.test.tsx) executam-se com `npm run test:components`, fora de `test:ci`, conforme a preferência do utilizador. Testes JavaScript e exportação Android não substituem a validação em dispositivo e leitores de ecrã.
