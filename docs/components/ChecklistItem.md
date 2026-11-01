# MDS/ChecklistItem

Apresenta um ponto de verificação com resultado controlado, observação e um espaço para evidências fornecidas pela aplicação. Implementação: [ChecklistItem.tsx](../../src/shared/ui/ChecklistItem/ChecklistItem.tsx). Referências Figma mobile: [por verificar](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ?node-id=168-2815), [conforme](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ?node-id=168-2835), [não conforme](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ?node-id=168-2855) e [não testado](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ?node-id=168-2875).

## Utilização e contrato

Importa `ChecklistItem` e os tipos `ChecklistEntry`, `ChecklistResult` e `ChecklistItemProps` de `src/shared/ui/ChecklistItem`. Usa o componente dentro de `ThemeProvider`. A aplicação conserva o resultado e volta a fornecer `item` atualizado quando aceita uma alteração.

| Propriedade | Comportamento |
| --- | --- |
| `item.id`, `item.title` | Identificador e título obrigatórios e não vazios. |
| `item.result` | Obrigatório: `pending` (por verificar), `pass` (conforme), `fail` (não conforme) ou `notTested` (não testado). Os quatro resultados são distintos. |
| `item.description`, `item.note` | Descrição e observação opcionais. A observação aparece na área de evidências quando fornecida. |
| `step` | Identificação textual do ponto, obrigatória e não vazia; é apresentada junto ao título. |
| `onChange` | Opcional. Mostra «Registar» ou «Editar», abre as quatro opções exclusivas e recebe o novo `ChecklistResult`. A aplicação tem de atualizar `item.result`; o componente não o altera internamente. |
| `evidence` | Conteúdo React opcional na área de evidências, por exemplo [PhotoTile](PhotoTile.md) ou [AttachmentItem](AttachmentItem.md). O consumidor gere os dados e as ações desse conteúdo. |
| `onAddEvidence` | Opcional. Mostra «Adicionar evidência» e chama o callback sem argumentos; a captura, seleção e persistência pertencem à aplicação. |
| `disabled` | Desativa os botões e opções disponibilizados pelo componente. Não desativa automaticamente os controlos inseridos em `evidence`. |
| `labels` | Personaliza os quatro resultados, `register`, `edit`, `result`, `evidence` e `addEvidence`. |
| `style`, `testID` | Personalização e identificação do contentor. |

O botão de registo/edição só existe com `onChange`; a área de evidências aparece quando existe observação, conteúdo ou ação de adição. A escolha de outro resultado chama `onChange` e fecha as opções. Os componentes inseridos em `evidence` são independentes e podem continuar interativos mesmo sem `onChange`.

## Acessibilidade, tema e Figma

O resultado é apresentado por [StatusBadge](StatusBadge.md), com texto e tom; a edição usa [Button](Button.md) e [RadioGroup](RadioGroup.md), com nome associado ao título do ponto. O conteúdo do slot é responsável pela sua própria acessibilidade. A largura adapta-se ao contentor e o texto usa a ampliação nativa, mas estes comportamentos devem ser confirmados em dispositivo.

`AppTheme.checklist` configura as cores, fontes e parte das medidas; os componentes compostos usam também os respetivos tokens. A referência mobile usa raio 14, padding 14, intervalo 12 e índice visual de 44 pontos. `fail` usa contorno `#b42318`; os outros resultados usam o contorno normal `#dee3eb`.

## Verificação

Os [testes locais](../../src/shared/ui/ChecklistItem/ChecklistItem.test.tsx) verificam a escolha controlada, a distinção de resultados e a composição de observação e evidências. Executam-se com `npm run test:components` e ficam fora de `test:ci`, conforme a decisão do utilizador. As demonstrações executáveis ficam apenas locais. Testes JavaScript não substituem validação nativa, ampliação de texto ou leitores de ecrã.
