# MDS/ToastSnackbar

Mensagem temporária não modal e fila local para feedback. Implementação: [ToastSnackbar.tsx](../../src/shared/ui/ToastSnackbar/ToastSnackbar.tsx). Referências: [compacto de sucesso](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ?node-id=147-2321) e [detalhado de informação](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ?node-id=147-2305).

## Utilização

Importa `ToastProvider`, `useToast`, `ToastSnackbar` e `ToastMessage` de `src/shared/ui/ToastSnackbar`, dentro de `ThemeProvider`. Coloca o provider num contentor com altura disponível.

```tsx
<ToastProvider safeAreaInsets={margensSeguras}>{conteudo}</ToastProvider>
```

Um descendente pode chamar `useToast().show({ id: 'guardado', message: 'Guardado', tone: 'success' })`. O identificador deve ser estável enquanto a mensagem está na fila.

## Contrato

| Propriedade ou operação | Comportamento |
| --- | --- |
| `ToastMessage.id`, `message` | Identificador e mensagem não vazios. Mensagens com id já presente na fila são ignoradas. |
| `title`, `tone` | Título opcional não vazio e tom `info`, `success`, `warning` ou `danger`; omissão `info`. Com título, apresenta detalhe. |
| `durationMs` | Duração positiva em milissegundos, ou `null` para persistir. Por omissão, mensagens sem ação duram 5 segundos; mensagens com ação e erros `danger` persistem. |
| `action` | Objeto opcional com `label` não vazia e `onPress`. Ao acionar no provider, chama o callback e remove a notificação. |
| `dismissible` | `false` oculta a ação manual de fechar; o consumidor pode removê-la por id. |
| `show(toast)`, `dismiss(id)`, `clear()` | Acrescentam à fila, removem por id ou limpam todas. Uma mensagem é apresentada de cada vez e o temporizador é limpo ao mudar ou desmontar. |
| `ToastProvider.safeAreaInsets` | Margens opcionais `bottom`, `left`, `right`, finitas e não negativas; zero por omissão. A aplicação fornece os valores para a janela em causa. |
| `ToastSnackbar` | Pode ser usado isoladamente com `toast`, `onDismiss`, `style` e `testID`; nesse caso a fila e a temporização são da responsabilidade do consumidor. |

## Acessibilidade e responsabilidade

A mensagem é exposta como alerta e usa região dinâmica; no iOS o provider solicita anúncio acessível quando a mensagem ativa muda. Ações e fecho são botões acessíveis. Não uses uma notificação temporária como única forma de apresentar um erro que precisa de ser resolvido; define persistência adequada e valida o comportamento com leitores de ecrã. O provider não é um serviço global nem persiste notificações.

## Tema e validação

Reutiliza `AlertIcon`, `Button` e as cores e fontes de `AppTheme.media`. O Figma usa superfície branca, contorno, raio 14, padding 16 e intervalo 12; a largura acompanha o espaço disponível.

Os [testes locais](../../src/shared/ui/ToastSnackbar/ToastSnackbar.test.tsx) verificam fila, deduplicação, fecho e expiração. Executam-se com `npm run test:components`, fora do CI por decisão do utilizador. Validar temporização, foco, ações, margens seguras e TalkBack/VoiceOver em Android e iOS.
