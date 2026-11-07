# Referência provisória de ordens de serviço

Esta referência apoia o [SCRUM-43](https://est2026.atlassian.net/browse/SCRUM-43) e a integração entre Frontend e Backend. Resume o que existe nos modelos e serviços locais do Mobile e da Web e os pontos por esclarecer. **Não é um contrato HTTP acordado nem prova que exista uma API implementada.** Precisa de validação conjunta antes da integração; o cartão permanece em progresso.

Fontes: [respostas do Product Owner](https://est2026.atlassian.net/wiki/spaces/SD/pages/2490370/Respostas+do+Product+Owner+1.+Ronda+04+11+2026), [modelo Mobile](../src/features/work-orders/domain/workOrder.ts), [serviço Mobile](../src/features/work-orders/application/workOrderService.ts), [modelo Web v0.3.0](https://github.com/ESTCBfrontend/dssi_web/blob/v0.3.0/src/features/work-orders/domain/workOrder.ts) e [serviço Web v0.3.0](https://github.com/ESTCBfrontend/dssi_web/blob/v0.3.0/src/features/work-orders/application/workOrderService.ts). A secção de operações identifica também uma evolução posterior na branch `develop` da Web, consultada no commit `6b9f90b`; confirma alterações posteriores antes de integrar.

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

Ambos os contratos são interfaces TypeScript locais e têm âmbitos diferentes. A implementação API Mobile comunica atualmente indisponibilidade em ambas as operações; a Web também indica que a integração de ordens está indisponível. Não há pedidos HTTP reais de ordens ligados a estes ecrãs.

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

## Acordos necessários com o Backend

Os endpoints listados pelo PO, incluindo `GET /work-orders`, `GET /work-orders/{id}`, `POST /work-orders` e `GET /me/work-orders`, são **ilustrativos**. Confirmar pelo menos:

- Endpoints, métodos, parâmetros, exemplos reais de pedidos/respostas e respetiva documentação; incluindo como representar a edição.
- Formato e geração de `id` e `code`; relação entre cliente, local e ordem; objetos aninhados ou referências e respetivos campos obrigatórios, opcionais ou nulos.
- Prioridades, datas, horas e fusos horários; diferenças entre `null`, ausência e texto vazio.
- Atribuições diretas e por equipa, múltiplas atribuições, identidade autenticada e autorização aplicada pelo Backend à lista e ao detalhe.
- Erros e estados HTTP, incluindo ordem inexistente, acesso recusado e indisponibilidade, sem expor informação não autorizada.
- Paginação, ordenação e filtros necessários, incluindo como obter o total e como lidar com listas vazias.
- Regras de criação, edição e transições de estado; concorrência, histórico e relação com intervenções.

Até existir acordo, os exemplos versionados e interfaces locais permitem desenvolver os ecrãs, mas não devem ser tratados como DTOs, endpoints ou políticas de acesso finais. A [arquitetura Mobile](architecture.md#serviços-integrações-e-mocks) descreve como ligar um adaptador quando esse contrato estiver definido.
