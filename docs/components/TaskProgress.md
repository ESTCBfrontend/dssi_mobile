# MDS/TaskProgress

Resumo visual de verificações com contagem, estado e progresso determinado. Implementação: [TaskProgress.tsx](../../src/shared/ui/TaskProgress/TaskProgress.tsx). Referências Figma mobile: [em curso](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ?node-id=169-2801) e [concluída](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ?node-id=169-2819).

## Utilização e contrato

Importa `TaskProgress`, `TaskProgressProps` e, quando necessário, `TaskProgressLabels` de `src/shared/ui/TaskProgress`; usa-os dentro de `ThemeProvider`. A aplicação fornece as contagens e decide que resultados contam como concluídos. A [Checklist](Checklist.md) pode calculá-las a partir de `items` e `isCompleted`.

| Propriedade | Comportamento |
| --- | --- |
| `completed`, `total` | Contagens obrigatórias, inteiras seguras e não negativas; `completed` não pode ultrapassar `total`. |
| `title` | Título opcional e não vazio; por omissão «Progresso das verificações». |
| `description` | Texto explicativo opcional abaixo do título. |
| `labels` | Personaliza `inProgress`, `complete`, `empty`, `progress` e as funções `count(completed, total)` e `summary(completed, total, percent)`. |
| `style`, `testID` | Personalização e identificação do contentor. |

Com `total = 0`, apresenta «Sem verificações» e progresso zero. O estado «Concluída» só aparece quando `total > 0` e `completed === total`. Nos restantes casos, a percentagem é arredondada e limitada a 99 para evitar apresentar 100% antes da conclusão. Os números não são inferidos a partir de resultados, notas ou evidências.

## Acessibilidade, tema e Figma

Compõe [StatusBadge](StatusBadge.md) e [ProgressBar](ProgressBar.md). O título é um cabeçalho; a barra expõe percentagem e estado acessíveis. Ao personalizar `labels.complete`, esse texto também é usado no estado acessível da barra concluída.

`AppTheme.checklist` configura cores, fontes e parte das medidas; o badge e a barra usam os respetivos tokens. A variante mobile do Figma usa padding 16, intervalo 14, raio 14 e resumo de progresso com intervalo 12. A apresentação responde ao conteúdo e usa ampliação nativa de texto; necessita de validação em dispositivo.

## Verificação

Os [testes locais](../../src/shared/ui/TaskProgress/TaskProgress.test.tsx) verificam contagem e percentagem, vazio, quase conclusão, valores inválidos e localização do estado acessível. Executam-se com `npm run test:components` e ficam fora de `test:ci` por decisão do utilizador. As demonstrações executáveis ficam apenas locais; os testes JavaScript não substituem validação nativa ou leitores de ecrã.
