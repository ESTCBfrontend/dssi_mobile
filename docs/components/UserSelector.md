# MDS/UserSelector

Seletor controlado de uma pessoa ou técnico, com filtro opcional por equipa. Implementação: [UserSelector.tsx](../../src/shared/ui/UserSelector/UserSelector.tsx). Referências Figma: [fechado mobile](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ?node-id=181-3331) e [aberto mobile](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ?node-id=181-3336).

## Utilização

Importa `UserSelector`, `UserSelectorProps` e `UserOption` de `src/shared/ui/UserSelector`, dentro de `ThemeProvider`. A etiqueta e as mensagens já estão incluídas.

```tsx
<UserSelector users={tecnicos} teamId={equipaId}
  value={tecnicoId} onChange={setTecnicoId} clearable />
```

Cada opção tem `id`, `name` e os campos opcionais `description`, `statusLabel`, `initials`, `disabled` e `teamIds`. A aplicação fornece a lista e mantém os identificadores únicos. As iniciais são fornecidas ou derivadas do nome; o avatar não é um elemento interativo.

## Propriedades

| Propriedade | Contrato |
| --- | --- |
| `users`, `value`, `onChange` | Pessoas disponíveis para apresentação, valor controlado `string \| null` e callback de seleção ou limpeza. |
| `teamId` | Quando fornecido, apresenta apenas pessoas cujo `teamIds` contém esse identificador. `null` ou omissão não aplica filtro; uma pessoa sem `teamIds` não aparece no filtro. |
| `label`, `placeholder`, `searchLabel` | Textos configuráveis; por omissão «Técnico», «Selecionar técnico» e «Pesquisar profissional». |
| `selectedLabel` | Nome alternativo para valor não presente nos dados. Por omissão usa o nome da lista completa, mesmo quando o filtro o exclui; se não houver nome, apresenta o identificador. |
| `required`, `disabled`, `error`, `helperText` | Indicação de obrigatório, bloqueio e mensagens. O consumidor define a validação. |
| `loading`, `loadError`, `onRetry`, `clearable` | Carregamento, erro e repetição opcionais, e ação de limpar. Nenhum pedido é iniciado pelo componente. |
| `safeAreaInsets`, `style`, `testID` | Margens seguras explícitas para o painel, estilo e identificador. |

## Interação e acessibilidade

A pesquisa é local, sobre nome, descrição e estado das opções filtradas. O estado e a descrição também são comunicados como ajuda acessível; as opções são escolhas exclusivas e as desativadas não emitem seleção. O painel usa [Select](Select.md) e [DrawerSheet](DrawerSheet.md).

Alterar `teamId` não elimina automaticamente `value`: a seleção pode ficar fora dos resultados, mantendo a sua etiqueta. A aplicação deve decidir se a limpa ou apresenta erro e, sobretudo, validar associação, disponibilidade e conflitos antes da submissão. `statusLabel` é informativo e não impõe uma política.

## Tema e validação

`AppTheme.assignment` configura a linha, avatar de 38 pontos e tipografia; o campo usa o tema de `Select` e altura mínima de 48 pontos. O painel mobile é uma adaptação funcional da lista aberta do Figma.

Os [testes locais](../../src/shared/ui/UserSelector/UserSelector.test.tsx) verificam filtro por equipa, preservação da etiqueta e seleção. Executam-se com `npm run test:components`, fora do CI por decisão do utilizador. Validar em Android e iOS a pesquisa, margens seguras, teclado, fonte ampliada e leitores de ecrã.
