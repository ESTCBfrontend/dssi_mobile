# MDS/ActivityItem

Apresenta um acontecimento fornecido pela aplicação, sem carregar dados, determinar permissões ou interpretar estados de negócio. Implementação: [ActivityItem.tsx](../../src/shared/ui/ActivityItem/ActivityItem.tsx). Referência: [Figma, nó 179:3317](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ?node-id=179-3317).

Importa `ActivityItem` e `ActivityEvent` de `src/shared/ui/ActivityItem` e usa-os dentro de `ThemeProvider`. O evento é um modelo de apresentação: a funcionalidade adapta os dados reais antes de os fornecer.

| Propriedade | Comportamento |
| --- | --- |
| `event` | Objeto com `id`, `type` (`status`, `assignment`, `comment`, `completion`), `title`, `author`, `timestamp`, `when` e `reference`. `description` é opcional. Os textos obrigatórios não podem ser vazios. |
| `timestamp` / `when` | Instante numérico finito, em milissegundos desde a época Unix, usado para ordenar; `when` é o texto de data/hora já formatado pela aplicação. |
| `onOpenRelated` | Opcional; torna o cartão um botão e recebe o evento fornecido. Sem callback, o cartão é informativo. |
| `accessibilityHint` | Ajuda opcional para a ação. |
| `style`, `testID`, `nativeID`, `onLayout` | Personalização e integração nativa. |

Com ação, título, descrição, autor, data e referência compõem o nome acessível do botão. Sem ação, os textos são lidos individualmente. O símbolo é decorativo; o título deve comunicar o acontecimento. O texto cresce e pode quebrar linha.

`AppTheme.activityItem` configura cores, símbolos, tipografia e medidas. A referência mobile usa fundo `#ffffff`, contorno `#dee3eb`, símbolos em superfícies `#eff8ff` ou `#def2e5`, raio 12 e ícone de 44 pontos. A apresentação dos glifos depende do suporte da fonte e da plataforma e deve ser verificada em dispositivo. As demonstrações executáveis são apenas locais. Os [testes locais](../../src/shared/ui/ActivityItem/ActivityItem.test.tsx) ficam fora de `test:ci`, conforme a preferência do utilizador.
