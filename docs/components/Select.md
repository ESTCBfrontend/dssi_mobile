# MDS/Select

Escolha individual de uma lista fornecida pela aplicação, apresentada num painel mobile. Implementação: [Select.tsx](../../src/shared/ui/Select/Select.tsx). Referência: [Figma, variantes de Select](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ?node-id=52-595).

## Utilização

Importa `Select` e `SelectOption` de `src/shared/ui/Select` e coloca o componente dentro de `ThemeProvider`. O consumidor controla o valor e fornece as opções; uma opção tem `value`, `label` e, opcionalmente, `description` e `disabled`. Os valores têm de ser únicos e não vazios e as etiquetas não podem estar vazias.

```tsx
<FormField label="Equipa" error={erro}>
  {campo => <Select {...campo} options={equipas} value={equipa} onChange={setEquipa}
    searchable clearable />}
</FormField>
```

Neste exemplo, `equipas`, `equipa`, `setEquipa` e `erro` pertencem à funcionalidade. O `FormField` mostra a etiqueta e a mensagem; `Select` recebe a etiqueta acessível e o estado.

## Propriedades

| Propriedade | Contrato |
| --- | --- |
| `options`, `value`, `onChange` | Lista, valor controlado `string \| null` e callback. Escolher emite o valor; limpar emite `null`. O componente nunca inventa opções nem carrega dados. |
| `accessibilityLabel`, `accessibilityHint` | A etiqueta é obrigatória e não vazia, identifica o controlo independentemente do placeholder; a ajuda acessível é opcional. |
| `placeholder`, `selectedLabel` | Texto para valor vazio e alternativa para valor ainda não presente em `options`. Sem `selectedLabel`, apresenta o próprio valor. |
| `size`, `disabled`, `error` | Tamanhos `small`, `medium` (omissão) e `large`; estado desativado e mensagem de erro. A mensagem deve também ser apresentada junto do controlo, por exemplo através de `FormField`. |
| `searchable`, `searchLabel` | Pesquisa local opcional por etiqueta e descrição; não consulta o servidor. A pesquisa é limpa quando o painel fecha. |
| `clearable` | Mostra a ação de limpar quando existe seleção. |
| `loading`, `loadingLabel`, `loadError`, `onRetry`, `emptyLabel` | Estados de carregamento, erro com repetição opcional e lista sem resultados. O consumidor gere a operação remota. |
| `sheetTitle`, `safeAreaInsets` | Título opcional do painel e margens seguras explícitas para a janela modal. |
| `renderOption` | Personaliza o conteúdo visual de cada opção; recebe a opção e se está selecionada. A responsabilidade pela acessibilidade adicional do conteúdo personalizado pertence ao consumidor. |
| `style`, `testID` | Estilo e identificador do controlo. |

## Comportamento e acessibilidade

O painel usa [DrawerSheet](DrawerSheet.md). As opções são apresentadas como grupo de escolhas exclusivas; a seleção e o estado desativado são comunicados aos leitores de ecrã. Opções desativadas não alteram o valor. Ao desativar o Select, o painel fecha. O valor é controlado: escolher apenas chama `onChange` e o consumidor deve atualizar `value`. O painel apresenta as opções em sequência, sem virtualização; listas muito grandes precisam de uma solução própria.

## Tema e validação

Reutiliza `AppTheme.textField` e as cores semânticas do tema. O Figma define fundo, contorno e raio dos campos, com tamanhos 36/44/52; o tamanho pequeno mantém pelo menos 44 pontos de área tátil. O chevron usa o SVG original de 24 × 24. O painel e a pesquisa são adaptações funcionais para mobile. A aplicação deve fornecer as margens seguras quando necessárias.

Os [testes locais](../../src/shared/ui/Select/Select.test.tsx) verificam pesquisa, seleção, opção desativada, carregamento, erro e limpeza. Executam-se com `npm run test:components`, fora do CI por decisão do utilizador. Validar em Android e iOS, incluindo TalkBack/VoiceOver, fonte ampliada, teclado e margens seguras.
