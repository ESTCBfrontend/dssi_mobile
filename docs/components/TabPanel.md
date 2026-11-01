# MDS/TabPanel

Contentor para o conteúdo de um separador, com título, descrição e ações opcionais; compõe [ContentPanel](ContentPanel.md). Implementação: [TabPanel.tsx](../../src/shared/ui/TabPanel/TabPanel.tsx); referência: [Figma, nó 132:1939](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ?node-id=132-1939).

Importa `TabPanel` de `src/shared/ui/TabPanel` e usa-o dentro de `ThemeProvider`, ou deixa [Tabs](Tabs.md) criar os painéis a partir dos seus itens.

| Propriedade | Comportamento |
| --- | --- |
| `id`, `labelledBy` | Identificador nativo obrigatório e identificador opcional do separador; `labelledBy` é encaminhado por `accessibilityLabelledBy` no Android. |
| `title`, `description` | Texto opcional não vazio; o título é um cabeçalho acessível. |
| `children`, `actions` | Conteúdo e controlos fornecidos pela aplicação; não são criados exemplos automaticamente. |
| `active`, `keepMounted` | Inativo é desmontado por omissão; com `keepMounted`, permanece montado, oculto e não interativo. |
| `surface` | `surface` (omissão) ou `muted`. |
| `style`, `testID`, `onLayout` | Personalização e integração nativa. |

O painel cresce com o conteúdo e coloca ações abaixo do cabeçalho em espaços menores. Não agrupa os controlos filhos num único elemento acessível. O papel `tabpanel` e a associação nativa dependem da plataforma e requerem validação com leitores de ecrã.

`AppTheme.tabPanel` configura tipografia, espaçamento e limiar de largura; `AppTheme.contentPanel` configura a superfície. O Figma define título 18 em Inter SemiBold, descrição 12 em Inter Regular, padding 24 para superfície branca e 20 para subtil e intervalo 16. As demonstrações executáveis ficam apenas locais. Os [testes locais](../../src/shared/ui/TabPanel/TabPanel.test.tsx) ficam fora de `test:ci`, conforme a preferência do utilizador.
