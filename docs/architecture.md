# Arquitetura e qualidade

Este documento contém princípios aprovados para orientar o crescimento do projeto mobile. Deve ser lido em conjunto com [AGENTS.md](../AGENTS.md) e [CONTRIBUTING.md](../CONTRIBUTING.md).

## Estado atual e evolução

A aplicação é uma base Expo, com entrada em `expo-router/entry` e ecrã inicial em `App.tsx`. `src/features` contém a listagem de ordens e os modelos e serviços mock provisórios de ordens e intervenções; a integração com a API ainda não existe.

A direção acordada é organizar o código por funcionalidade e separar responsabilidades conforme a complexidade real. A estrutura abaixo é uma referência e não exige criar todas as camadas de uma vez.

```text
src/
  app/                    # Rotas e layouts Expo Router
  composition/            # Composição, configuração e ligação das dependências
  features/
    <funcionalidade>/
      domain/             # Conceitos e regras de negócio
      application/        # Operações e coordenação dos casos de uso
      infrastructure/     # Implementações de API, armazenamento e serviços externos
      presentation/       # Ecrãs, componentes e hooks
  shared/
    ui/                   # Elementos visuais realmente partilhados
    infrastructure/       # Mecanismos técnicos transversais
```

Uma funcionalidade pequena pode precisar apenas de parte desta estrutura. Acrescenta separações quando houver responsabilidades que as justifiquem; evita pastas vazias e camadas que apenas encaminham chamadas.

## Responsabilidades e dependências

- `domain` define comportamento e conceitos de negócio sem importar React Native, Expo, clientes HTTP ou armazenamento.
- `application` coordena operações usando o domínio e contratos necessários, sem depender de componentes visuais ou detalhes concretos da infraestrutura.
- `infrastructure` implementa os contratos de integração e adapta os formatos externos às necessidades da aplicação.
- `presentation` trata da interface e interação. Encaminha regras de negócio e operações relevantes para módulos próprios, evitando espalhá-las pelos ecrãs.
- A composição da aplicação liga implementações concretas às operações e à apresentação, usando a solução mais simples que preserve os limites.
- Mantém pontos de entrada explícitos entre funcionalidades e evita dependências cíclicas ou acesso arbitrário a detalhes internos.
- `shared` deve conter responsabilidades identificáveis com utilização transversal demonstrada; não deve tornar-se um depósito genérico de utilitários.

Os contratos devem ficar junto de quem define a necessidade. Não é obrigatório criar uma interface para cada classe nem adicionar uma biblioteca de injeção de dependências.

## Tema dos componentes partilhados

Os componentes visuais partilhados obtêm tokens semânticos através de `ThemeProvider` e `useTheme`, em `src/shared/ui/theme`. O provider permite selecionar o tema ou acompanhar o sistema; a composição da aplicação escolhe o modo, sem persistência implícita. Os tokens são acrescentados apenas à medida das necessidades dos componentes e têm correspondência documentada com o Figma.

A configuração contém os tokens claros necessários ao Button, ao StatusBadge, ao AlertIcon, ao TextField, ao FormField, ao Checkbox, ao Radio, ao RadioGroup, ao Switch, ao CheckboxGroup, ao ProgressBar, ao LoadingIndicator, ao Textarea, ao Alert, ao Card, ao ContentPanel, ao FormGroup, ao PageButton, ao Pagination, ao Tab, ao Tabs, ao TabPanel, ao ActivityItem, ao Timeline, ao AttachmentItem, ao PhotoTile, ao ChecklistItem, ao TaskProgress, ao Checklist, ao ClientSummary, ao EquipmentCard, ao ServiceOrderCard, ao TableRow, ao SortableHeader, ao DataTable, ao Dialog e ao DrawerSheet. O Figma consultado não define uma paleta escura; esta pode ser fornecida posteriormente pelo consumidor. Os contratos e a correspondência de tokens estão em [components/Button.md](components/Button.md), [components/StatusBadge.md](components/StatusBadge.md), [components/AlertIcon.md](components/AlertIcon.md), [components/TextField.md](components/TextField.md), [components/FormField.md](components/FormField.md), [components/Checkbox.md](components/Checkbox.md), [components/Radio.md](components/Radio.md), [components/RadioGroup.md](components/RadioGroup.md), [components/Switch.md](components/Switch.md), [components/CheckboxGroup.md](components/CheckboxGroup.md), [components/ProgressBar.md](components/ProgressBar.md), [components/LoadingIndicator.md](components/LoadingIndicator.md), [components/Textarea.md](components/Textarea.md), [components/Alert.md](components/Alert.md), [components/Card.md](components/Card.md), [components/ContentPanel.md](components/ContentPanel.md), [components/FormGroup.md](components/FormGroup.md), [components/PageButton.md](components/PageButton.md), [components/Pagination.md](components/Pagination.md), [components/Tab.md](components/Tab.md), [components/Tabs.md](components/Tabs.md), [components/TabPanel.md](components/TabPanel.md), [components/ActivityItem.md](components/ActivityItem.md), [components/Timeline.md](components/Timeline.md), [components/AttachmentItem.md](components/AttachmentItem.md), [components/PhotoTile.md](components/PhotoTile.md), [components/ChecklistItem.md](components/ChecklistItem.md), [components/TaskProgress.md](components/TaskProgress.md), [components/Checklist.md](components/Checklist.md), [components/ClientSummary.md](components/ClientSummary.md), [components/EquipmentCard.md](components/EquipmentCard.md), [components/ServiceOrderCard.md](components/ServiceOrderCard.md), [components/TableRow.md](components/TableRow.md), [components/SortableHeader.md](components/SortableHeader.md), [components/DataTable.md](components/DataTable.md), [components/Dialog.md](components/Dialog.md) e [components/DrawerSheet.md](components/DrawerSheet.md).

Os tokens e contratos implementados para os novos componentes de formulário estão documentados em [components/Select.md](components/Select.md), [components/DatePicker.md](components/DatePicker.md), [components/DateRangePicker.md](components/DateRangePicker.md), [components/TimePicker.md](components/TimePicker.md), [components/Form.md](components/Form.md).

Os contratos e tokens dos componentes de atribuição estão documentados em [components/TeamSelector.md](components/TeamSelector.md), [components/UserSelector.md](components/UserSelector.md), [components/AssignmentPanel.md](components/AssignmentPanel.md).

Os contratos e tokens dos componentes de navegação visual estão documentados em [components/NavItem.md](components/NavItem.md), [components/AppHeader.md](components/AppHeader.md), [components/PageLayout.md](components/PageLayout.md), [components/AppShell.md](components/AppShell.md).

Os contratos dos componentes de ficheiros, filtros e notificações estão documentados em [components/FileUpload.md](components/FileUpload.md), [components/ImagePicker.md](components/ImagePicker.md), [components/FilterBar.md](components/FilterBar.md), [components/ToastSnackbar.md](components/ToastSnackbar.md).

## Diagnóstico e origem de dados

A origem de dados é configurada independentemente das ferramentas de desenvolvimento e usa API por defeito; a seleção temporária de mock só está disponível em desenvolvimento com a Debug Layer ativa. A Debug Layer é controlada por uma flag e não fica acessível em builds de produção. O logging técnico é independente da Debug Layer, regista eventos sem credenciais ou dados pessoais e usa a consola local: info apenas em desenvolvimento, avisos e erros também em produção. Mocks mantêm-se separados da API real e são definidos por funcionalidade.

Em desenvolvimento, o logging pode apresentar o JSON completo de exemplos fictícios versionados, desde que provenham exclusivamente dos ficheiros mock do projeto. Respostas reais da API só podem apresentar campos explicitamente autorizados por operação e filtrados, sem credenciais nem dados pessoais; por defeito nenhum campo é apresentado. Em produção não são registados corpos JSON.

Estão implementados a configuração inicial em `src/composition/data-source/appDataSource.ts`, a seleção reativa, a Debug Layer em `src/composition/debug` e o logger em `src/shared/infrastructure/logging`. A flag `ENABLE_DEBUG_LAYER` está em `src/composition/debug/debugConfig.ts`. O menu permite alterar a origem em desenvolvimento; a escolha permanece em memória e regressa à configuração inicial ao recarregar. O acesso à camada está protegido por `__DEV__` e pela flag; a seleção também é verificada independentemente.

O serviço provisório em `src/features/work-orders/infrastructure/mock` lista ordens fictícias em memória e usa os exemplos JSON de `src/mocks/work-orders`, adaptados da Web e carregados por referências estáticas compatíveis com Metro. A composição em `src/composition/work-orders` partilha a instância entre o menu e a listagem. O ecrã apresenta todas as ordens quando Mock está selecionado, identifica-as como fictícias e inclui filtros por data local e ausência de agendamento. Sem autenticação, não filtra por técnico. A API ainda não está implementada e a sua seleção apresenta indisponibilidade sem carregar mocks. Os modelos, estados e campos são provisórios e devem ser confirmados com o PO e o Backend; os restantes destinos e o detalhe não estão disponíveis.

O Debug Menu agrupa a origem e os mocks em níveis; tocar fora, usar «Voltar» ou o voltar do sistema regressa ao nível anterior e fecha o painel no menu principal. Disponibiliza os cenários normal, vazio, erro e lento (1,2 segundos), além de adicionar exemplos de ordens individualmente ou em conjunto, limpar e repor o cenário. Repetir a adição não duplica IDs; mudar de cenário repõe os dados e alternar para API preserva os mocks em memória até ao recarregamento. Adicionar uma ordem individualmente não altera intervenções já existentes. A seleção API não aciona o serviço mock. O serviço de ordens ainda não implementa criação ou edição.

O serviço em `src/features/interventions/infrastructure/mock` usa exemplos provisórios em `src/mocks/interventions`, adaptados da Web. Permite adicionar exemplos individualmente ou em conjunto, rejeita duplicados e exige que a ordem fictícia associada exista. A composição em `src/composition/work-orders` liga a verificação da ordem e limpa as intervenções quando as ordens são limpas, repostas ou mudam de cenário; adicionar ordens não as limpa. O serviço permite consultar intervenções por ordem e devolve cópias. Dados, estados e contratos são exemplos ainda sujeitos a confirmação com o PO e o Backend; não há persistência nem partilha de estado com a Web.

O menu apresenta ajuda e resultados de ações numa única notificação temporária sobre a janela modal ou a aplicação quando o menu está fechado: uma nova mensagem substitui imediatamente a anterior e reinicia o prazo de três segundos, inclusive ao repetir a mesma ação. Fechar ou reabrir o menu não reinicia o prazo. Estas notificações são feedback de interface e não substituem os logs técnicos.

O logger escreve os eventos técnicos com `console.log` e inclui o nível no texto para consulta no terminal ou consola de depuração, sem criar notificações LogBox para esses eventos. A seleção de níveis mantém-se: `info` em desenvolvimento, `warn` e `error` também em produção; nessa saída todos aparecem tecnicamente como `console.log`, pelo que a filtragem deve usar os marcadores `[INFO]`, `[WARN]` e `[ERROR]`. Erros reais continuam a ser propagados para os consumidores responsáveis pelo tratamento.

Na implementação atual das ordens fictícias, a mudança de cenário regista o cenário escolhido e a adição em conjunto regista quantos exemplos foram adicionados ou já existiam. As chamadas de listagem registam início e fim com um número de correlação e, no fim, duração em milissegundos e resultado; chamadas concorrentes recebem números distintos. O cenário e as contagens são metadados, sem corpos ou identificadores das ordens. O início é informativo e, portanto, não aparece em produção; um erro continua a ser registado.

Ao adicionar efetivamente um exemplo de ordem ou intervenção, os serviços apresentam o JSON formatado do ficheiro fictício em desenvolvimento; exemplos duplicados ou rejeitados não são registados. A origem do JSON é a cópia privada dos ficheiros do projeto, nunca valores alterados pelo consumidor.

O logger prepara a saída de JSON da API através de `apiResponse`: recebe o corpo já interpretado pela futura operação e apenas apresenta campos explicitamente indicados nessa chamada. Por enquanto só aceita valores inteiros não negativos dos campos de metadados `total`, `count`, `page` e `pageSize`; campos não indicados, texto, objetos e listas são omitidos. Sem campos autorizados, apresenta `[omitido]`; em produção não produz qualquer saída de corpo. Ao implementar cada operação, o responsável deve confirmar o significado e a ausência de dados pessoais antes de autorizar campos, e integrar a chamada ao logger. O logger não lê nem altera a resposta HTTP.

`traceApiRequest` prepara a instrumentação de pedidos através de uma função fornecida pelo consumidor, sem escolher cliente HTTP. Regista método, número de correlação, resultado, estado HTTP válido e duração; não recebe nem regista URL, cabeçalhos ou mensagens de erros externos. Devolve a mesma resposta e propaga o mesmo erro recebido. Inícios e sucessos são informativos; falhas HTTP, de rede e tempo limite são erros e cancelamentos são avisos. A API ainda não está implementada e nenhuma operação usa esta instrumentação; a integração real e os respetivos contratos continuam por definir.

## Orientação a objetos e abstração

Usa objetos e classes quando encapsulem comportamento, invariantes ou responsabilidades que beneficiem de um contrato explícito. Prefere composição a herança profunda.

Componentes funcionais e hooks são o padrão da apresentação React. Funções puras são adequadas a transformações simples. A escolha deve preservar clareza e testabilidade.

Extrai código partilhado quando representar a mesma responsabilidade ou regra de negócio. Blocos parecidos podem ter significados diferentes e evoluir separadamente. Evita tanto duplicação de regras de negócio como abstrações prematuras com muitas opções e condições.

## Qualidade e validação

Mantém alterações focadas, nomes claros e tratamento explícito de falhas relevantes. Segue a política de testes proporcionais ao risco em AGENTS.md e executa as verificações do README.

Testa comportamento observável e contratos importantes. As correções devem ter testes de regressão quando viável. Alterações de documentação ou estilos de baixo risco não exigem testes que apenas reproduzam a implementação.

Os testes JavaScript e a exportação Android da CI não substituem validação nativa ou em dispositivo. Identifica no PR as limitações de validação e o impacto em Android e iOS quando aplicável.

## Decisões que alteram a arquitetura

Antes de transformar uma decisão nova numa regra transversal, segue o processo de proposta e aprovação de AGENTS.md. Inclui a documentação aprovada na branch e no PR da tarefa.

Quando uma decisão precisar de justificar alternativas e consequências, cria um registo em `docs/decisions/` com contexto, decisão, alcance e consequências. Essa pasta não precisa de existir antes de haver uma decisão a registar.

**Navegação e estado:** O mobile adota Expo Router para navegação entre ecrãs e TanStack Query para gerir dados assíncronos dos serviços mock e da futura API. A pasta de rotas contém apenas rotas e layouts; os ecrãs, a composição e as ferramentas de desenvolvimento permanecem fora dela. O estado de interface é mantido junto de quem o utiliza e pode ser partilhado através das ferramentas do React quando necessário. Os serviços continuam responsáveis pelo acesso aos dados; as consultas distinguem a origem e são atualizadas quando os dados relevantes mudam. O comportamento de foco e conectividade é definido e validado para mobile. Autenticação, armazenamento, sincronização e funcionamento offline permanecem por decidir.

O layout raiz disponibiliza `QueryClientProvider` e comunica mudanças de estado da aplicação ao gestor de foco em Android e iOS. A listagem distingue origem e cenário na chave de consulta e invalida os dados quando o serviço mock muda. A integração de conectividade ainda não está implementada. A cache em memória não oferece persistência nem sincronização offline.
