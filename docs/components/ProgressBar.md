# MDS/ProgressBar

Indicador de progresso determinado, sem lógica de carregamento ou de negócio. Implementação: [ProgressBar.tsx](../../src/shared/ui/ProgressBar/ProgressBar.tsx). Referência: [Figma, nó 148:2379](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ?node-id=148-2379).

Importa `ProgressBar` de `src/shared/ui/ProgressBar` e utiliza-o dentro de `ThemeProvider`. O consumidor fornece o progresso real e o estado da operação. Para progresso desconhecido deve ser usado um indicador indeterminado adequado; este componente não simula valores.

| Propriedade | Comportamento |
| --- | --- |
| `value`, `min`, `max` | Valor e limites numéricos finitos; limites por omissão 0 e 100, com `max > min`. Valores fora do intervalo são limitados para apresentação. |
| `label` | Texto visível e nome acessível por omissão. Quando omitido, `accessibilityLabel` é obrigatório e não vazio. |
| `accessibilityLabel` | Nome acessível alternativo. |
| `size` | `compact` ou `regular` (omissão). |
| `status` | `active` (omissão), `complete` ou `error`. O consumidor escolhe o estado; `complete` exige valor no máximo após limitação. |
| `statusText` | Texto de estado para `complete` ou `error`; por omissão `Concluído` ou `Erro`, podendo ser localizado. Se fornecido, não pode ser vazio. |
| `showValue` | Mostra a percentagem por omissão; pode ser ocultada sem a retirar da acessibilidade. |
| `showStatusText` | Mostra o estado no texto visível por omissão; quando falso, mantém-no no nome acessível. |
| `accessibilityLiveRegion` | `none` por omissão; a composição pode optar por anúncios conforme o contexto. |
| `accessibilityHint`, `style`, `testID`, `nativeID`, `onLayout` | Integração nativa e personalização do contentor. |

A percentagem é calculada a partir do valor limitado e do intervalo, arredondada ao inteiro mais próximo. Texto, largura e valor acessível usam essa mesma percentagem. Por omissão, estados de erro e conclusão acrescentam texto ao rótulo, além da cor; `showStatusText={false}` permite omitir esse texto visual quando o estado já é apresentado na composição. Os conteúdos podem quebrar linha e respeitam a ampliação nativa de texto; o indicador não captura toques nem emite ações.

As demonstrações executáveis são exclusivamente locais e não entram no Git.

## Tema e Figma

`AppTheme.progressBar` configura a tipografia, os tamanhos e as cores. O Figma define fundo `#ffffff`, contorno `#dee3eb`, trilho `#e9edf3`, progresso ativo `#2159b8`, concluído `#166534` e erro `#b42318`. O texto ativo usa `#1f2938` e a percentagem ativa `#194a9d`; erro usa `#b42318`. A etiqueta usa Inter Medium e a percentagem Inter Semi Bold.

Compact usa padding 16, texto 12 e trilho com altura 6; regular usa padding 20, texto 13 e trilho com altura 9. O raio do contentor é 14 e o espaçamento vertical 13. A largura adapta-se ao contentor. Uma paleta escura pode ser fornecida pela composição.

## Verificação

Os [testes locais](../../src/shared/ui/ProgressBar/ProgressBar.test.tsx) cobrem consistência entre percentagem, largura e acessibilidade, limites, erro, ausência de texto visível, intervalos inválidos, tema e texto longo. Executam-se com `npm run test:components` e ficam fora do `test:ci`, conforme preferência do utilizador. A exportação Android e os testes JavaScript não substituem a validação nativa, leitores de ecrã ou iOS.
