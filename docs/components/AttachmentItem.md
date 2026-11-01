# MDS/AttachmentItem

Apresenta um anexo em formato empilhado mobile, com estado e ações fornecidos pela aplicação. Implementação: [AttachmentItem.tsx](../../src/shared/ui/AttachmentItem/AttachmentItem.tsx). Referências Figma: [documento pronto](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ?node-id=156-2397), [em envio](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ?node-id=156-2413), [erro](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ?node-id=156-2435) e [fotografia](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ?node-id=156-2452).

## Utilização e contrato

Importa `AttachmentItem`, `AttachmentFile` e `AttachmentState` de `src/shared/ui/AttachmentItem` e usa-os dentro de `ThemeProvider`. A aplicação fornece o ficheiro, o estado e o progresso e atualiza-os após as ações.

| Propriedade | Comportamento |
| --- | --- |
| `file.id`, `file.name`, `file.details` | Identificador, nome e texto de detalhes obrigatórios e não vazios. `details` é preparado pela aplicação, por exemplo tipo e tamanho formatados. |
| `file.kind`, `file.uri` | `kind` é `document` ou `photo`. `uri` é opcional e é usada para a miniatura de uma fotografia; documentos usam o marcador de documento. |
| `state` | Obrigatório: `ready`, `uploading` ou `error`. É controlado pelo consumidor. |
| `progress` | Percentagem numérica finita de 0 a 100, obrigatória durante `uploading`. A barra apresenta o valor arredondado. |
| `onOpen` | Opcional. Torna a área principal um botão que recebe o objeto `file`, em qualquer estado. |
| `onRemove` | Opcional. Mostra a ação de remoção em `ready` e `error`; durante `uploading` não é apresentada. Recebe `file`. |
| `onRetry` | Opcional. Mostra a ação de repetição apenas em `error` e recebe `file`. |
| `labels`, `uploadingDetails` | `labels` personaliza os textos de estado e ações; `uploadingDetails(progress)` substitui o texto de progresso visível. |
| `style`, `testID` | Personalização e identificação do contentor. |

Sem URI de fotografia, ou se a imagem falhar, é usado o marcador do Figma. Após falha, a mesma URI não é recarregada automaticamente enquanto continuar marcada como falhada; uma URI diferente ou a remontagem permite nova tentativa. Os callbacks não abrem, removem, enviam nem repetem operações por si. A aplicação valida origem, tipo, tamanho, acesso e permissões e gere a transferência e persistência.

## Acessibilidade, tema e Figma

A área principal só é um botão quando existe `onOpen` e inclui o nome do ficheiro no nome acessível. A ação de remoção tem alvo de 44 pontos; o progresso usa [ProgressBar](ProgressBar.md), enquanto o estado e a repetição reutilizam [StatusBadge](StatusBadge.md) e [Button](Button.md). Os textos respeitam a ampliação nativa; o comportamento real em cada plataforma exige validação.

`AppTheme.media` configura cores, fontes e parte das medidas; os componentes compostos usam os respetivos tokens. O Figma mobile usa padding 14, intervalo 10, raio 14 e miniatura de 52 pontos. O marcador de fotografia e o ícone de remoção usam SVGs locais do Figma; o marcador de documento é construído com formas nativas.

## Verificação

Os [testes locais](../../src/shared/ui/AttachmentItem/AttachmentItem.test.tsx) verificam encaminhamento de ações, progresso e limites, e repetição no estado de erro. Executam-se com `npm run test:components` e ficam fora de `test:ci`, por decisão do utilizador. As demonstrações executáveis ficam apenas locais. Testes JavaScript e exportação Android não substituem execução nativa ou leitores de ecrã.
