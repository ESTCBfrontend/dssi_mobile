import { parseMockWorkOrders } from './parseMockWorkOrders';

// Metro exige referências estáticas para os ficheiros incluídos no bundle.
const examples: unknown[] = [
  require('../../../../mocks/work-orders/json_mock_workorder_nova.json'),
  require('../../../../mocks/work-orders/json_mock_workorder_atribuida.json'),
  require('../../../../mocks/work-orders/json_mock_workorder_em_execucao.json'),
  require('../../../../mocks/work-orders/json_mock_workorder_pendente.json'),
  require('../../../../mocks/work-orders/json_mock_workorder_concluida_tecnicamente.json'),
  require('../../../../mocks/work-orders/json_mock_workorder_validada.json'),
  require('../../../../mocks/work-orders/json_mock_workorder_cancelada.json'),
];

export function loadMockWorkOrders() {
  return parseMockWorkOrders(JSON.stringify(examples));
}
