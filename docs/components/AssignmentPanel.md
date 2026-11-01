# MDS/AssignmentPanel

Painel de apresentação e pedido de atribuição, composto por [TeamSelector](TeamSelector.md), [UserSelector](UserSelector.md), [StatusBadge](StatusBadge.md) e [Button](Button.md). Implementação: [AssignmentPanel.tsx](../../src/shared/ui/AssignmentPanel/AssignmentPanel.tsx). Referências Figma: [rascunho mobile](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ?node-id=182-3360) e [atribuído mobile](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ?node-id=182-3389).

## Utilização

Importa `AssignmentPanel`, `AssignmentPanelProps` e `AssignmentValue` de `src/shared/ui/AssignmentPanel`, dentro de `ThemeProvider`. O consumidor controla `{ teamId: string | null, userId: string | null }`, os dados das listas e a autorização para pedir a submissão.

```tsx
<AssignmentPanel title="Atribuição" value={atribuicao}
  onChange={setAtribuicao} teams={equipas} users={tecnicos}
  canSubmit={podeSubmeter} onSubmit={guardarAtribuicao}
  pending={aGuardar} error={erro} />
```

`podeSubmeter` é decidido pela funcionalidade; o callback executa a operação apropriada e apresenta os erros devolvidos. O painel não chama APIs, não altera dados sozinho e não confirma que uma atribuição foi aceite.

## Propriedades

| Propriedade | Contrato |
| --- | --- |
| `title`, `subtitle` | Título obrigatório e subtítulo opcional; não podem ser vazios quando fornecidos. O título é um cabeçalho acessível. |
| `value`, `onChange` | Seleções controladas; cada alteração emite o objeto completo. Alterar equipa preserva `userId`; o consumidor pode limpá-lo ou marcá-lo inválido. |
| `teams`, `users` | Dados apresentados pelos seletores; ver os respetivos contratos. |
| `canSubmit`, `onSubmit` | `canSubmit` obrigatório controla a disponibilidade da ação. Ao pressionar, `onSubmit` recebe o valor atual; a validação de compatibilidade e a operação continuam fora do componente. |
| `state`, `statusLabel`, `statusTone`, `submitLabel` | `draft` ou `assigned` configura a apresentação inicial; etiqueta, tom e ação podem ser personalizados. O estado deve refletir a informação da aplicação. |
| `pending`, `disabled` | Bloqueiam ambos os seletores e a ação; `pending` apresenta carregamento no botão sem apagar as seleções. |
| `error`, `teamError`, `userError` | Mensagens da operação ou de cada campo. São exibidas em texto e o erro geral usa semântica de alerta. |
| `teamsLoading`, `usersLoading`, `teamsError`, `usersError`, `onRetryTeams`, `onRetryUsers` | Estados e repetição das listas controlados pelo consumidor. |
| `filterUsersByTeam` | Quando verdadeiro e existe equipa selecionada, filtra por `teamIds`; sem equipa mostra todas as pessoas fornecidas. Não valida o valor previamente selecionado. |
| `note`, `noteLabel` | Nota opcional como texto ou conteúdo React Native; o consumidor fornece os dados e a acessibilidade do conteúdo personalizado. |
| `safeAreaInsets`, `style`, `testID` | Margens dos painéis, personalização e identificador; os controlos recebem `-team` e `-user`. |

## Responsabilidades e acessibilidade

O painel não infere compatibilidade a partir do texto do estado nem valida se a pessoa pertence à equipa. Antes de ativar `canSubmit`, a funcionalidade deve avaliar os seus requisitos atuais. A operação de atribuição deve também validar permissões, disponibilidade e conflitos no servidor; o componente não garante essas verificações. Se a equipa mudar, uma seleção anterior é mantida para evitar perda silenciosa e a funcionalidade decide como tratá-la.

O conteúdo cresce com o texto e os controlos mantêm as próprias etiquetas e estados acessíveis. O consumidor fornece margens seguras quando necessárias, e garante que erros, dados adicionais e notas personalizadas são compreensíveis.

## Tema e validação

`AppTheme.assignment` configura superfície, texto e nota. O Figma usa contorno `#dee3eb`, raio 16, padding e intervalo 16, nota com padding 12 e botão de 44 pontos. O estado `assigned` usa botão outline e badge de sucesso; `draft` usa ação primária e aviso. O conteúdo real é fornecido pelo consumidor.

Os [testes locais](../../src/shared/ui/AssignmentPanel/AssignmentPanel.test.tsx) cobrem preservação da seleção, autorização, submissão, processamento e erros. Executam-se com `npm run test:components`, fora do CI por decisão do utilizador. Os painéis nativos, toque, acessibilidade, áreas seguras e ampliação devem ser validados em Android e iOS.
