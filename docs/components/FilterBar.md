# MDS/FilterBar

Composição de pesquisa, seleções e critérios adicionais controlados pela funcionalidade. Implementação: [FilterBar.tsx](../../src/shared/ui/FilterBar/FilterBar.tsx). Referência: [Figma empilhado](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ?node-id=109-1346).

## Utilização

Importa `FilterBar`, `FilterBarProps` e `FilterCriterion` de `src/shared/ui/FilterBar`, dentro de `ThemeProvider`. O componente reutiliza [TextField](TextField.md), [Select](Select.md), [Button](Button.md) e [DrawerSheet](DrawerSheet.md).

```tsx
<FilterBar title="Filtrar" search={{ label: 'Pesquisar', value: pesquisa, onChange: setPesquisa }}
  filters={criterios} onReset={limparFiltros} />
```

Cada critério fornece `id`, `label`, `value`, `options` e `onChange`; os identificadores devem ser únicos e não vazios. A funcionalidade gere valores, pesquisas, carregamento e resultados.

## Propriedades

| Propriedade | Contrato |
| --- | --- |
| `title` | Título opcional não vazio, exposto como cabeçalho. |
| `search` | Objeto opcional com `label`, `value`, `onChange`, `placeholder` e `disabled`; não pesquisa dados automaticamente. |
| `filters` | Critérios controlados com opções de Select; suportam `disabled`, `loading`, `loadError`, `onRetry` e `selectedLabel`. |
| `onReset`, `resetLabel` | Ação opcional para limpar; a aplicação decide que valores repor. |
| `extraFilters`, `extraFiltersTitle`, `activeExtraCount` | Conteúdo opcional num painel e indicação explícita de critérios adicionais ativos. A contagem é fornecida pelo consumidor e tem de ser inteira e não negativa. |
| `actions`, `disabled` | Ações adicionais fornecidas como controlos React Native e bloqueio dos controlos integrados. O consumidor gere o estado das ações e do conteúdo personalizado. |
| `safeAreaInsets`, `style`, `testID` | Margens seguras dos painéis, personalização e identificação. |

## Comportamento e acessibilidade

Pesquisa e filtros emitem alterações sem executar pedidos ou alterar uma listagem. As seleções visíveis mostram o valor atual; o botão de filtros adicionais mostra a contagem fornecida, para não ocultar a existência de critérios ativos. Os conteúdos personalizados devem manter nomes e estados acessíveis. Quando desativada, a barra fecha o painel adicional e bloqueia os controlos que cria.

## Tema e validação

`AppTheme.media` fornece superfície, contorno e tipografia; o Figma mobile usa padding 16, raio 14 e intervalo 12. O ícone de pesquisa original tem 24 pontos; os seletores e botões usam os respetivos temas.

Os [testes locais](../../src/shared/ui/FilterBar/FilterBar.test.tsx) verificam pesquisa, seleção e limpeza. Executam-se com `npm run test:components`, fora do CI por decisão do utilizador. Validar em Android e iOS a pesquisa, painéis, teclado, áreas seguras, fonte ampliada e leitores de ecrã.
