# MDS/PageLayout

Estrutura de conteúdo de página independente de navegação, com título, descrição, ações e conteúdo fornecido pela aplicação. Implementação: [PageLayout.tsx](../../src/shared/ui/PageLayout/PageLayout.tsx). Referências: [empilhado](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ?node-id=99-1107) e [largo](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ?node-id=99-1147).

## Utilização

Importa `PageLayout`, `PageLayoutProps` e, se necessário, `LayoutInsets` de `src/shared/ui/PageLayout`, dentro de `ThemeProvider`. É possível usá-lo sozinho ou como conteúdo de [AppShell](AppShell.md).

```tsx
<PageLayout title="Ordens" description="Acompanha as intervenções."
  actions={acoes} layout="wide">
  {conteudo}
</PageLayout>
```

Os slots pertencem à funcionalidade; não são criados botões, dados ou painéis de exemplo. Quando o AppShell já aplica as margens seguras, não as apliques novamente ao PageLayout.

## Propriedades

| Propriedade | Contrato |
| --- | --- |
| `title`, `description` | Título obrigatório e descrição opcional; não vazios quando fornecidos. O título é um cabeçalho. |
| `breadcrumbs` | Texto ou elemento React Native opcional. Um elemento interativo deve fornecer ações e acessibilidade próprias. |
| `actions`, `children`, `footer` | Slots opcionais para controlos, conteúdo e rodapé. A composição controla os dados e callbacks. |
| `layout` | `stacked` por omissão; `wide` coloca ações ao lado do título quando a largura atinge o limiar do tema. Abaixo desse limiar usa apresentação empilhada. |
| `scrollable` | `true` por omissão: usa `ScrollView` e mantém toques nos controlos com teclado aberto. Usa `false` quando um contentor exterior gere a deslocação. Mantém a opção estável para não desmontar os filhos ao trocar de contentor. |
| `safeAreaInsets` | Margens opcionais `{ top, right, bottom, left }`, finitas e não negativas; omissas são zero. A composição fornece os valores apropriados quando necessários. |
| `style`, `testID` | Estilo e identificador do contentor; o conteúdo recebe o sufixo `-content`. |

## Comportamento, tema e validação

O componente preserva os filhos quando a largura muda e não escolhe rotas, permissões ou regras de negócio. O ajuste ao teclado e a posição de ações dependem também da janela e dos elementos colocados nos slots. Evita aninhar uma lista virtualizada vertical dentro do `ScrollView` padrão.

`AppTheme.navigation` configura fundo, cores, fontes e limiar largo (640 pontos por omissão). O Figma usa padding 18 no empilhado, 28 no largo, título 22/30 e intervalos de 18/22. Os tamanhos são adaptados ao espaço disponível.

Os [testes locais](../../src/shared/ui/PageLayout/PageLayout.test.tsx) verificam margens e preservação dos filhos numa mudança de largura. Executam-se com `npm run test:components`, fora do CI por decisão do utilizador. Validar scroll, teclado, áreas seguras, tamanhos de ecrã e leitores de ecrã em Android e iOS.
