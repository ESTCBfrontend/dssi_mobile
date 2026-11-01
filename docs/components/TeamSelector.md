# MDS/TeamSelector

Seletor controlado de uma equipa de entre as opções fornecidas pela aplicação. Implementação: [TeamSelector.tsx](../../src/shared/ui/TeamSelector/TeamSelector.tsx). Referências Figma: [fechado mobile](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ?node-id=181-3403) e [aberto mobile](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ?node-id=181-3408).

## Utilização

Importa `TeamSelector`, `TeamSelectorProps` e `TeamOption` de `src/shared/ui/TeamSelector`. Usa o componente dentro de `ThemeProvider`; a etiqueta, a mensagem e o painel de escolha já estão incluídos através de [FormField](FormField.md) e [Select](Select.md).

```tsx
<TeamSelector teams={equipas} value={equipaId} onChange={setEquipaId}
  label="Equipa" loading={aCarregar} error={erro} clearable />
```

As opções e o estado do exemplo pertencem à funcionalidade. Cada equipa tem `id` e `name`, e pode incluir `description`, `statusLabel`, `initials` e `disabled`. Os identificadores devem ser únicos e não vazios. Os textos de estado e a decisão de desativar são fornecidos pela aplicação.

## Propriedades

| Propriedade | Contrato |
| --- | --- |
| `teams`, `value`, `onChange` | Lista, identificador controlado `string \| null` e callback de seleção ou limpeza. O componente não altera o valor por si só. |
| `label`, `placeholder`, `searchLabel` | Textos configuráveis; por omissão «Equipa», «Selecionar equipa» e «Pesquisar equipa». |
| `selectedLabel` | Nome alternativo quando o valor selecionado não está na lista recebida; sem alternativa, o Select apresenta o próprio identificador. |
| `required`, `disabled`, `error`, `helperText` | Indicação visual e acessível de obrigatório, bloqueio e mensagens. `required` não valida a atribuição. |
| `loading`, `loadError`, `onRetry` | Estado de carregamento, mensagem de erro e ação de repetição opcional. A aplicação controla a operação. |
| `clearable` | Permite emitir `null` através da ação de limpar. |
| `safeAreaInsets`, `style`, `testID` | Margens seguras explícitas para o painel, personalização e identificação do controlo. |

## Interação e acessibilidade

O painel permite pesquisar localmente por nome, descrição ou estado nas opções já fornecidas. A pesquisa não inicia pedidos remotos e é limpa ao fechar. As opções usam papel de escolha exclusiva e anunciam a descrição e o estado como ajuda; `disabled` impede a seleção. O avatar usa as iniciais fornecidas ou derivadas do nome e é decorativo. Quando o valor não está nas opções, é preservado; não se deduz a sua validade a partir da lista carregada.

O componente não consulta disponibilidade, permissões ou serviços e não interpreta `statusLabel` como regra de negócio. A funcionalidade deve verificar os dados atuais antes de confirmar uma atribuição; o servidor continua responsável pela validação definitiva.

## Tema e validação

`AppTheme.assignment` configura a apresentação das opções: avatar de 38 pontos, cores, fontes e fundo selecionado. O campo reutiliza o tema de `Select` e tem altura mínima de 48 pontos. O Figma apresenta uma lista junto ao campo; em mobile é usado o painel acessível existente, com pesquisa real.

Os [testes locais](../../src/shared/ui/TeamSelector/TeamSelector.test.tsx) cobrem pesquisa, estado desativado, seleção e repetição após erro. Executam-se com `npm run test:components` e não entram no CI por decisão do utilizador. Confirma em Android e iOS o painel, áreas seguras, teclado, ampliação e leitores de ecrã.
