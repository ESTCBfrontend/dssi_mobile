# MDS/Checklist

Lista mobile virtualizada de pontos de verificação, composta por [ChecklistItem](ChecklistItem.md), [TaskProgress](TaskProgress.md) e ações opcionais. Implementação: [Checklist.tsx](../../src/shared/ui/Checklist/Checklist.tsx). Referências Figma mobile: [em curso](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ?node-id=170-3002) e [concluída](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ?node-id=170-3110).

## Utilização e contrato

Importa `Checklist` e `ChecklistProps` de `src/shared/ui/Checklist`; `ChecklistEntry` e `ChecklistResult` são exportados por `src/shared/ui/ChecklistItem`. Usa-os dentro de `ThemeProvider`. A aplicação fornece a lista, a regra de conclusão e o comportamento das ações.

| Propriedade | Comportamento |
| --- | --- |
| `title`, `description` | Título obrigatório e não vazio e descrição opcional. |
| `items` | Lista de `ChecklistEntry` com `id` não vazio e único, `title`, `result` e, opcionalmente, `description` e `note`. O componente numera os pontos pela ordem recebida. |
| `isCompleted` | Função obrigatória que recebe um ponto e devolve se conta como concluído. O consumidor define a regra de negócio. |
| `onItemChange` | Opcional. Recebe `(id, result)`; a aplicação atualiza a lista e volta a fornecê-la. Sem callback, os botões de edição dos pontos não aparecem. |
| `renderEvidence`, `onAddEvidence` | O primeiro recebe um ponto e fornece conteúdo React; o segundo recebe o ponto cuja ação de adição foi solicitada. Ambos são opcionais. |
| `onSave`, `onSubmit` | Opcionais. Mostram, respetivamente, os botões de guardar e submeter e chamam os callbacks sem argumentos. |
| `actions`, `actionsDescription` | Conteúdo React adicional e texto opcional na área inferior; o consumidor gere as ações que introduzir. |
| `progressDescription` | Descrição opcional apresentada no resumo de progresso. |
| `disabled` | Desativa os controlos de edição, adição de evidência, guardar e submeter criados pela checklist. Não desativa automaticamente `actions` ou `renderEvidence`. |
| `labels`, `itemLabels`, `progressLabels` | Personalizam os textos da lista, de cada ponto e do resumo de progresso, respetivamente. |
| `style`, `testID` | Personalização e identificação da `FlatList`. |

O total e os concluídos são calculados a partir da mesma lista recebida e de `isCompleted`. Uma lista vazia mostra «Sem pontos de verificação» e não é considerada concluída. A aplicação decide os requisitos de notas e evidências, a elegibilidade para submissão, o armazenamento, eventuais rascunhos offline e os pedidos de rede; os callbacks não executam essas operações automaticamente.

## Acessibilidade, tema e Figma

A lista usa `FlatList`: fornece espaço vertical definido e evita aninhá-la numa `ScrollView` vertical. Título e nome da secção usam semântica de cabeçalho; os pontos e o progresso reutilizam a acessibilidade dos componentes compostos. Os conteúdos fornecidos nos slots são responsabilidade do consumidor. O texto usa ampliação nativa; a validação em dispositivo continua necessária.

`AppTheme.checklist` configura cores, fontes e parte dos espaçamentos; os componentes compostos usam os seus próprios tokens. No Figma mobile, o contentor tem raio 20 e padding 16; os cartões de pontos têm um intervalo de 10.

## Verificação

Os [testes locais](../../src/shared/ui/Checklist/Checklist.test.tsx) cobrem progresso a partir da lista e da regra fornecida, encaminhamento de ações, lista vazia e identificadores duplicados. Executam-se com `npm run test:components`, fora de `test:ci` por decisão do utilizador. As demonstrações executáveis ficam apenas locais. A exportação e os testes JavaScript não validam execução nativa ou leitores de ecrã.
