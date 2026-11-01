# MDS/PageButton

Botão numérico reutilizável para compor paginação. Não gere página atual, carregamento, limites ou navegação. Implementação: [PageButton.tsx](../../src/shared/ui/PageButton/PageButton.tsx). Referência: [Figma, nó 123:1726](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ?node-id=123-1726).

Importa `PageButton` de `src/shared/ui/PageButton` e usa-o dentro de `ThemeProvider`. A composição decide a página atual e reage a `onSelect`.

| Propriedade | Comportamento |
| --- | --- |
| `page` | Número inteiro seguro positivo apresentado no botão. |
| `onSelect` | Recebe o número ao ativar o botão; não altera a página por si só. |
| `current` | Indica a página atual visualmente e através de `accessibilityState.selected`. A ativação continua disponível; a composição decide o que fazer. |
| `disabled` | Impede a interação e é comunicado à acessibilidade; tem prioridade visual sobre `current`. |
| `size` | `compact` ou `comfortable` (omissão). |
| `accessibilityLabel` | Nome alternativo não vazio; por omissão `Página` seguido do número. Pode ser localizado. |
| `accessibilityHint`, `style`, `testID`, `nativeID`, `onLayout`, `onFocus`, `onBlur`, `ref` | Integração e personalização nativa. |

O botão expõe o papel de botão, estado selecionado e desativado. O foco tem indicação visual. O número respeita a ampliação nativa e a dimensão pode crescer para texto ou números maiores. A versão compacta mantém desenho mínimo de 40 pontos dentro de uma área tátil mínima de 44; comfortable usa 44. O consumidor deve evitar sobreposição de áreas táteis entre botões.

## Tema e Figma

`AppTheme.pageButton` configura cores, medidas e tipografia. O Figma usa contorno `#dee3eb`, fundo normal `#ffffff`, atual `#2159b8`, desativado `#f5f7fa`, texto normal `#1f2938`, atual `#ffffff`, desativado `#667385`, raio 10 e Inter SemiBold 13. O tema pode ser substituído pelo consumidor.

As demonstrações executáveis ficam apenas locais. Os [testes locais](../../src/shared/ui/PageButton/PageButton.test.tsx) executam-se com `npm run test:components` e ficam fora de `test:ci`, conforme a preferência do utilizador. Testes JavaScript e exportação Android não substituem validação em dispositivo e leitores de ecrã.
