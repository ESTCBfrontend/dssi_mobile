import { parseMockInterventions } from './parseMockInterventions';

const examples: unknown[] = [
  require('../../../../mocks/interventions/json_mock_intervention_concluida_os_em_execucao.json'),
  require('../../../../mocks/interventions/json_mock_intervention_cancelada_os_em_execucao.json'),
  require('../../../../mocks/interventions/json_mock_intervention_pendente_material.json'),
];

export function loadMockInterventions() {
  return parseMockInterventions(JSON.stringify(examples));
}
