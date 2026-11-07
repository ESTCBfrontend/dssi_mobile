# Referência provisória de ordens de serviço

Esta referência apoia o [SCRUM-43](https://est2026.atlassian.net/browse/SCRUM-43) e a integração entre Frontend e Backend. Resume os modelos e serviços locais do Mobile e da Web, compara-os com a especificação publicada pelo Backend e identifica pontos por esclarecer. A especificação apresenta-se como contrato comum; a partilha do Swagger não confirma, por si só, que os detalhes foram validados por todas as equipas ou que as operações foram testadas. O cartão permanece em progresso.

Fontes: [Swagger do Backend](https://alarmeon-backend-962ded164ecf.herokuapp.com/swagger-ui/index.html) e [especificação OpenAPI](https://alarmeon-backend-962ded164ecf.herokuapp.com/v3/api-docs), consultados a 7 de novembro de 2026; [respostas do Product Owner](https://est2026.atlassian.net/wiki/spaces/SD/pages/2490370/Respostas+do+Product+Owner+1.+Ronda+04+11+2026); [modelo Mobile](../src/features/work-orders/domain/workOrder.ts) e [serviço Mobile](../src/features/work-orders/application/workOrderService.ts); [modelo Web v0.3.0](https://github.com/ESTCBfrontend/dssi_web/blob/v0.3.0/src/features/work-orders/domain/workOrder.ts) e [serviço Web v0.3.0](https://github.com/ESTCBfrontend/dssi_web/blob/v0.3.0/src/features/work-orders/application/workOrderService.ts). A secção de operações identifica também uma evolução posterior na branch `develop` da Web, consultada no commit `6b9f90b`; as fontes publicadas podem evoluir.

## Modelo usado pelo Frontend

Os tipos `WorkOrder`, `CreateWorkOrder` e `UpdateWorkOrder` coincidem nas fontes Mobile e Web consultadas. A tabela descreve o objeto interno `WorkOrder`, não uma resposta HTTP. «Opcional» refere-se à propriedade poder estar ausente; `null` é um valor explícito.

| Campo | Tipo interno | Uso atual |
| --- | --- | --- |
| `id` | `string` | Identificador interno da ordem. |
| `code` | `string` | Referência visível da ordem. |
| `client` | `{ id: string; name: string }` | Cliente associado. |
| `site` | `{ id: string; name: string; address?: string }` | Local; a morada pode estar ausente. |
| `serviceType` | `string` | Tipo de serviço. |
| `description` | `string` | Descrição dos trabalhos. |
| `status` | `WorkOrderStatus` | Estado global da ordem. |
| `priority` | `string` | Prioridade; a apresentação reconhece `BAIXA`, `NORMAL` e `ALTA`. |
| `scheduledDate` | `string \| null` | Data prevista ou `null` quando não agendada. |
| `assignedTechnician` | `{ id: string; name: string } \| null` | Técnico diretamente associado ou `null` quando não atribuído. |
| `instructions` | `string \| null` | Instruções adicionais ou `null`. |

Os valores de `WorkOrderStatus` nos modelos atuais são `NOVA`, `ATRIBUIDA`, `EM_EXECUCAO`, `CONCLUIDA_TECNICAMENTE`, `VALIDADA`, `PENDENTE` e `CANCELADA`. Correspondem aos estados de referência descritos pelo PO, sem definir por si só quem pode executar uma transição. O estado de uma intervenção é distinto do estado da ordem.

O PO indicou prioridade Normal por defeito e que data, técnico/equipa e instruções podem não estar definidos inicialmente. Na criação fictícia Web, uma ordem começa em `NOVA`, usa `NORMAL` se não for fornecida prioridade e pode não ter data nem técnico. O tipo de prioridade continua a ser `string`; os valores aceites na integração real ainda precisam de acordo.

Os exemplos usam datas como `2026-11-06`. O parser dos mocks Mobile aceita uma string ou `null` para `scheduledDate`; isso não valida um formato de transporte, fuso horário ou data de calendário. O modelo atual tem um único `assignedTechnician` e não representa atribuição a equipas, anexos, histórico ou permissões.

## Operações locais disponíveis

| Operação | Mobile | Web v0.3.0 |
| --- | --- | --- |
| `list(): Promise<WorkOrder[]>` | Consulta os exemplos da origem selecionada. | Consulta as ordens da origem selecionada. |
| `getById(id): Promise<WorkOrder \| null>` | Devolve uma ordem disponível no contexto ou `null`. | Devolve uma ordem existente ou `null`. |
| `create(input): Promise<WorkOrder>` | Não faz parte do serviço de consulta Mobile. | Disponível no serviço mock, com `CreateWorkOrder`. |
| `update(id, input): Promise<WorkOrder \| null>` | Não faz parte do serviço de consulta Mobile. | Disponível no serviço mock, com `UpdateWorkOrder`; devolve `null` se inexistente. |

No Mobile, o contexto fictício de técnico restringe `list` e `getById` a atribuições diretas. Começa em «Todas as ordens» e é controlado pelo Debug Menu em desenvolvimento; não representa sessão nem altera autorizações da API. Na Web, `create` e `update` são operações mock em memória; as permissões reais continuam por implementar. Os controlos de desenvolvimento para gerir exemplos são separados destas operações.

Ambos os contratos são interfaces TypeScript locais e têm âmbitos diferentes. A implementação API Mobile comunica atualmente indisponibilidade em ambas as operações; a Web consultada também indica que a integração de ordens está indisponível. Não há pedidos HTTP reais de ordens ligados a estes ecrãs.

Após a release Web v0.3.0, o [contrato em desenvolvimento](https://github.com/ESTCBfrontend/dssi_web/blob/6b9f90b2e346596e26b8f2f32a180414bbce4db4/src/features/work-orders/application/workOrderService.ts) acrescentou `listTechnicians(): Promise<WorkOrderTechnician[]>` e `assignTechnician(id, technicianId): Promise<WorkOrder | null>`. Na [implementação mock Web consultada](https://github.com/ESTCBfrontend/dssi_web/blob/6b9f90b2e346596e26b8f2f32a180414bbce4db4/src/features/work-orders/infrastructure/mock/services/MockWorkOrderService.ts), a primeira atribuição de uma ordem `NOVA` sem técnico passa-a a `ATRIBUIDA`; ordem inexistente devolve `null`, e técnico inexistente, outros estados ou reatribuição são rejeitados. Estas restrições são provisórias, específicas da simulação e ainda precisam de validação. Não constituem uma regra de autorização ou de transição acordada para o produto.

No Mobile, a seleção de técnico no Debug Menu escolhe um contexto de consulta e não atribui técnicos a ordens. Os dados fictícios Web e Mobile vivem em memórias independentes: uma atribuição simulada na Web não atualiza a app Mobile. A partilha entre interfaces depende de uma integração acordada e implementada.

## Exemplos fictícios

O [exemplo de ordem atribuída](../src/mocks/work-orders/json_mock_workorder_atribuida.json) ilustra um objeto `WorkOrder` usado localmente: `mock-os-2` tem o código `OS-EXEMPLO-002`, prioridade `NORMAL`, data prevista e o técnico fictício `mock-tech-1`. O [exemplo Web correspondente](https://github.com/ESTCBfrontend/dssi_web/blob/v0.3.0/src/mocks/work-orders/json_mock_workorder_atribuida.json) tem os mesmos dados. Os sete ficheiros de ordens Mobile coincidem em conteúdo JSON com a cópia Web consultada; são ficheiros separados e podem evoluir independentemente.

O argumento abaixo ilustra `CreateWorkOrder` usado pela criação **mock Web**, sem ser um pedido HTTP:

```ts
const exemplo: CreateWorkOrder = {
  code: 'OS-EXEMPLO-008',
  client: { id: 'CLI-1001', name: 'Horizonte Azul, Lda.' },
  site: { id: 'LOC-1001', name: 'Armazém da Zona Industrial' },
  serviceType: 'Manutenção',
  description: 'Verificar os equipamentos da instalação.',
};
```

`priority`, `scheduledDate` e `instructions` são opcionais nesse tipo de entrada. O mock Web gera um ID local, inicializa o estado e devolve um `WorkOrder`; isso não decide quem gera identificadores ou o formato de uma resposta do Backend. `UpdateWorkOrder` contém `serviceType`, `description`, `priority`, `scheduledDate` e `instructions`; os cinco campos fazem parte do argumento local atual.

Na consulta, uma lista vazia é `[]` e um detalhe não encontrado é `null` no contrato local. Os mocks podem lançar um erro simulado; a origem API Mobile lança `WorkOrderServiceUnavailableError` enquanto não existir integração. Estes resultados não definem códigos HTTP, corpo de erro nem distinção de permissões na API real.

## Swagger publicado pelo Backend

O Swagger consultado identifica-se como **AlarmeON API v1**, em OpenAPI 3.1.0. A especificação anuncia autenticação HTTP Bearer com JWT por defeito; `POST /api/v1/auth/login` declara não exigir esse esquema. A descrição indica erros em formato ProblemDetail/RFC 7807, mas as operações consultadas descrevem apenas respostas de sucesso. Não foram efetuados pedidos de negócio ou testes com credenciais nesta análise.

| Operação documentada | Finalidade declarada | Resposta de sucesso documentada |
| --- | --- | --- |
| `POST /api/v1/auth/login` | Autenticar por email e palavra-passe. | `200`: token, tipo, validade e utilizador. |
| `GET /api/v1/auth/me` | Consultar utilizador autenticado e perfis. | `200`: `UserResponse`. |
| `GET /api/v1/me/work-orders` | Consultar as OS atribuídas ao técnico autenticado no Mobile. | `200`: página de `WorkOrderResponse`. |
| `GET /api/v1/work-orders` | Listar ordens com filtros e paginação. | `200`: página de `WorkOrderResponse`. |
| `GET /api/v1/work-orders/{id}` | Consultar detalhe de uma ordem. | `200`: `WorkOrderResponse`. |
| `POST /api/v1/work-orders` | Criar uma ordem. | `201`: `WorkOrderResponse`. |
| `POST /api/v1/work-orders/{id}/assignments` | Atribuir um técnico. | `201`: `WorkOrderResponse`. |
| `POST /api/v1/work-orders/{id}/status-changes` | Alterar o estado. | `200`: `WorkOrderResponse`. |
| `GET /api/v1/work-orders/summary` | Obter contagens para a listagem. | `200`: `WorkOrderSummaryResponse`. |
| `GET /api/v1/technicians` | Listar técnicos ativos. | `200`: lista de `TechnicianResponse`. |
| `GET /api/v1/clients` e `GET /api/v1/clients/{id}/sites` | Listar clientes e locais de um cliente. | `200`: listas de `ClientResponse` e `SiteResponse`. |

Os endpoints antes indicados pelo PO eram exemplos ilustrativos. Os caminhos acima são os publicados na especificação consultada, com o prefixo `/api/v1`; a sua presença no Swagger não comprova que estejam operacionais, que os dados estejam disponíveis ou que as regras de acesso estejam concluídas.

### Diferenças a tratar na integração

| Aspeto | Swagger consultado | Frontend atual e implicação |
| --- | --- | --- |
| Lista | `PageResponseWorkOrderResponse` descreve `items`, `page`, `size`, `totalItems` e `totalPages`; `page` começa em 0 e `size` tem valor predefinido 20. | `list()` devolve um array. É necessário definir como a paginação e as contagens chegam ao ecrã; não assumir que a primeira página contém todas as ordens. |
| Identificadores | IDs da OS e das referências são `string` com formato `uuid`. | Os modelos usam `string` e os exemplos mock têm IDs como `mock-os-2`; não são identificadores válidos para assumir como dados reais. |
| Tipo de serviço | Enum `INSTALACAO`, `ASSISTENCIA_TECNICA`, `MANUTENCAO`, `OUTRO`. | Os exemplos Mobile usam textos como «Manutenção» e «Assistência técnica» diretamente na apresentação; é necessário acordar a adaptação e os rótulos. |
| Prioridade | Enum `BAIXA`, `NORMAL`, `ALTA`, `URGENTE`. | O Mobile formata os três primeiros e conserva outros valores como texto recebido; ainda não tem um rótulo específico para `URGENTE`. |
| Criação | `CreateWorkOrderRequest` exige `clientId`, `siteId`, `serviceType` e `description`; inclui prioridade, data e instruções opcionais. Não lista `code` no pedido. | `CreateWorkOrder` local recebe `code` e objetos de cliente/local. Confirmar geração da referência e conversão dos campos antes de ligar a Web. |
| Detalhe e campos adicionais | `WorkOrderResponse` inclui `statusReason`, `createdAt` e `updatedAt` além dos campos comuns. | O modelo local ainda não representa esses campos. Confirmar necessidade e semântica antes de os acrescentar. |
| Campos de resposta | O schema publicado de `WorkOrderResponse` não enumera campos `required` nem explicita nulabilidade nas propriedades. | O modelo local espera propriedades como `scheduledDate`, `assignedTechnician` e `instructions`, que podem conter `null`. São necessários exemplos e validação da representação real de ausência e `null`. |
| Edição | A especificação consultada lista criação, atribuição e mudança de estado; não lista uma operação para editar os campos gerais da ordem. | A Web tem `update` mock. Confirmar o âmbito e contrato da edição no Backend. |

As listagens documentam filtros como pesquisa, estado, prioridade, data, cliente e técnico, além de página, tamanho e ordenação. A descrição de `StatusChangeRequest.reason` indica justificação para `PENDENTE` e `CANCELADA`, enquanto a lista `required` do schema contém apenas `status`; a validação efetiva deve ser confirmada. O Swagger expõe `expiresIn` no login, mas a unidade e a política de renovação de sessão não estão explícitas no schema consultado.

## Pontos a confirmar com o Backend

A especificação publicada reduz as dúvidas sobre caminhos e estruturas, mas continua a ser necessário alinhar e testar, entre outros pontos:

- Exemplos reais de pedidos e respostas, comportamento dos endpoints publicados e representação da edição de campos gerais.
- Geração de `id` e `code`; relação entre cliente, local e ordem; campos obrigatórios, opcionais ou nulos nas respostas.
- Tratamento de `URGENTE`, tipo de serviço, datas, horas e fusos horários; diferenças entre `null`, ausência e texto vazio.
- Atribuições diretas e por equipa, múltiplas atribuições, identidade autenticada e autorização aplicada pelo Backend à lista e ao detalhe.
- Erros e estados HTTP, incluindo ordem inexistente, acesso recusado e indisponibilidade, sem expor informação não autorizada.
- Aplicação dos filtros e ordenação; limites de tamanho de página e comportamento para listas vazias ou páginas fora do intervalo.
- Regras de criação, edição e transições de estado; concorrência, histórico e relação com intervenções.

Os exemplos versionados e interfaces locais permitem desenvolver os ecrãs, mas não são os DTOs HTTP nem implementam as políticas de acesso do Backend. A [arquitetura Mobile](architecture.md#serviços-integrações-e-mocks) descreve a fronteira para um futuro adaptador; a integração e as decisões de autenticação e paginação continuam por implementar.
