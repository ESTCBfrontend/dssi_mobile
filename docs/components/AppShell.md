# MDS/AppShell

Estrutura mobile para compor cabeçalho, conteúdo, rodapé e navegação inferior sem depender de uma biblioteca de rotas. Implementação: [AppShell.tsx](../../src/shared/ui/AppShell/AppShell.tsx). Referência: [Figma mobile](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ?node-id=102-1205).

## Utilização

Importa `AppShell`, `AppShellProps` e `LayoutInsets` de `src/shared/ui/AppShell`, dentro de `ThemeProvider`. A aplicação fornece elementos reais para os slots e escolhe o navegador e as margens seguras.

```tsx
<AppShell header={cabecalho} navigation={navegacao}
  safeAreaInsets={margensSeguras}>
  <PageLayout title="Ordens">{conteudo}</PageLayout>
</AppShell>
```

Por exemplo, `navegacao` pode ser uma `View` horizontal com [NavItem](NavItem.md); `cabecalho` pode ser [AppHeader](AppHeader.md). O conteúdo deve gerir a sua própria deslocação, como faz o PageLayout por omissão.

## Propriedades

| Propriedade | Contrato |
| --- | --- |
| `header` | Elemento opcional colocado antes do conteúdo. |
| `children` | Conteúdo fornecido pela composição; ocupa o espaço disponível entre cabeçalho e navegação. O AppShell não cria um ecrã nem gere scroll. |
| `footer`, `navigation` | Elementos opcionais após o conteúdo; a navegação inferior recebe semântica de grupo de separadores. A disposição e os destinos pertencem ao consumidor. |
| `safeAreaInsets` | Margens opcionais `{ top, right, bottom, left }`, finitas e não negativas, zero por omissão. São aplicadas ao cabeçalho/conteúdo e à navegação/rodapé conforme os slots existentes. A aplicação tem de fornecer os valores corretos. |
| `style`, `testID` | Personalização e identificação da estrutura; conteúdo e navegação recebem `-main` e `-navigation`. |

## Comportamento e acessibilidade

O AppShell não altera rotas, não gere histórico, não cria um navegador nem escolhe a aba ativa. O consumidor mantém a navegação e o estado dos ecrãs. A estrutura mantém espaços separados e não sobrepõe a barra inferior ao conteúdo; o conteúdo precisa de uma altura disponível no elemento pai. O tratamento de teclado e a integração com o navegador real devem ser definidos e validados na composição da aplicação.

Não existe cálculo automático de áreas seguras nem uma biblioteca de navegação escolhida neste componente. Evita aplicar as mesmas margens também ao PageLayout, e confirma as barras do sistema e dispositivos edge-to-edge.

## Tema e validação

`AppTheme.navigation` configura os fundos e contornos; o Figma apresenta cabeçalho claro, fundo de página e navegação inferior clara. Os slots crescem com o conteúdo e não dependem de dimensões fixas do protótipo.

Os [testes locais](../../src/shared/ui/AppShell/AppShell.test.tsx) verificam composição, estado selecionado e margens, incluindo rejeição de valores inválidos. Executam-se com `npm run test:components`, fora do CI por decisão do utilizador. Validar barras de sistema, teclado, navegação real, foco, scroll e leitores de ecrã em Android e iOS.
