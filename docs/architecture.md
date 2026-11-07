# Arquitetura e qualidade

Este documento define as responsabilidades e a direção arquitetural do projeto mobile. Deve ser lido em conjunto com [AGENTS.md](../AGENTS.md), [CONTRIBUTING.md](../CONTRIBUTING.md) e o [guia de implementação incremental](implementation-guide.md). As regras operacionais ficam em AGENTS.md; o guia explica como aplicar esta arquitetura numa tarefa.

## Estado atual e evolução

A aplicação usa React Native, Expo, TypeScript, Expo Router e TanStack Query. A entrada é `expo-router/entry`; a rota inicial encaminha para `App.tsx`. Estão implementadas a lista e a consulta do detalhe de ordens fictícias e as ferramentas de desenvolvimento. Existem modelos e serviços mock provisórios de ordens e intervenções; ainda não há integração HTTP, sessão, persistência ou sincronização.

**Direção aprovada, de adoção gradual:** organização por funcionalidade, com camadas leves e composição explícita. Novas funcionalidades seguem estes limites. No código existente, a adaptação acompanha tarefas com âmbito próprio; encontrar uma diferença não autoriza refatorações gerais nem a criação de pastas vazias. A estrutura abaixo é um destino de organização, não um inventário de diretórios já existentes.

```text
src/
  app/                    # Rotas e layouts Expo Router
  composition/            # Montagem da aplicação e ligação das dependências
    providers/            # Providers da aplicação, quando a extração for útil
    services/             # Seleção e construção das implementações
    navigation/           # Composição visual comum da navegação
    debug/                # Ferramentas de desenvolvimento
  features/
    <funcionalidade>/
      domain/             # Conceitos e regras de negócio
      application/        # Operações e coordenação dos casos de uso
      infrastructure/     # Implementações de API, armazenamento e serviços externos
      presentation/
        screens/          # Ecrãs da funcionalidade
        components/       # Componentes específicos da funcionalidade
        hooks/            # Consultas e comportamento de apresentação
  shared/
    ui/                   # Elementos visuais realmente partilhados
    infrastructure/       # Mecanismos técnicos transversais
  mocks/                  # Exemplos JSON fictícios versionados por funcionalidade
```

Uma funcionalidade pequena pode precisar apenas de parte desta estrutura, com poucos ficheiros diretamente em `presentation`. Acrescenta subdivisões quando ajudarem a localizar responsabilidades. Não é obrigatório mover os ficheiros atuais para reproduzir a árvore.

### Transição a acompanhar

Esta tabela descreve diferenças presentes no código, incluindo alterações ainda por entregar. Não significa que todas estejam numa versão publicada. Ao adaptar um destes pontos, atualiza ou remove a linha na mesma tarefa.

| Estado no código | Direção de evolução |
| --- | --- |
| O cabeçalho é repetido na lista e no detalhe. | Reutilizar a estrutura visual e os tokens necessários quando essa adaptação fizer parte da tarefa. |
| O foco da aplicação está integrado com as consultas; conectividade, sessão e armazenamento ainda não estão. | Tratar esses pontos nas tarefas correspondentes antes de depender deles em fluxos reais. |

## Responsabilidades e dependências

- `app` contém rotas e layouts Expo Router: lê parâmetros, liga os destinos e monta a estrutura da navegação. A inicialização comum pertence ao layout raiz ou aos providers que este monta.
- `domain` define conceitos, invariantes e regras de negócio sem importar React, React Native, Expo, HTTP, armazenamento ou ferramentas de debug. Tipos e funções puras são suficientes para modelos simples; classes servem necessidades reais de comportamento e encapsulamento.
- `application` define os contratos de que a funcionalidade precisa e coordena operações quando existe trabalho a coordenar. Depende do domínio, sem importar componentes visuais ou implementações concretas de infraestrutura.
- `infrastructure` implementa esses contratos, valida os formatos externos e converte-os para os modelos internos. Regras de negócio reutilizáveis continuam no domínio/aplicação.
- `presentation` contém ecrãs, hooks e componentes da funcionalidade. Pode usar React, React Native, os contratos da aplicação e a UI partilhada. Recebe as dependências necessárias por props ou por um provider específico, quando justificado; não escolhe implementações API/mock nem importa a montagem global de `composition`.
- `composition` constrói e seleciona implementações, fornece dependências e liga notificações de desenvolvimento às consultas. Pode conhecer as implementações concretas; as funcionalidades não precisam de conhecer essa montagem.
- Entre funcionalidades, usa um ponto de entrada explícito e pequeno, como um contrato ou módulo público. Integrações podem ser ligadas na composição; evita acesso direto à infraestrutura privada de outra funcionalidade e dependências cíclicas. Não é necessário criar um `index.ts` em cada pasta.
- `shared` deve conter responsabilidades identificáveis com utilização transversal demonstrada; não deve tornar-se um depósito genérico de utilitários.

Os contratos ficam junto de quem define a necessidade. Não é obrigatório criar uma interface por classe, um caso de uso que apenas encaminhe uma chamada, um serviço base genérico ou uma biblioteca de injeção de dependências. A duplicação só é extraída quando representa a mesma responsabilidade; tipos excessivamente amplos ou muitas opções são sinais para rever a abstração.

## Navegação, apresentação e estado

Expo Router gere a navegação e TanStack Query gere os dados assíncronos dos serviços mock e da futura API. Os componentes reutilizáveis de UI não decidem rotas nem carregam dados de negócio. A navegação entre funcionalidades e a estrutura comum dos ecrãs são ligadas pelos layouts/composição; callbacks podem tornar explícitas as ações de navegação necessárias à apresentação.

O layout raiz monta o tema comum, a pilha de rotas e a barra inferior de `composition/navigation/ServicesNavigation.tsx`. A barra mantém Serviços selecionado e os restantes destinos indisponíveis; a personalização visual do seu tema fica na composição. O layout aplica a margem segura inferior e os ecrãs a superior. A lista recebe `onOpenOrder`; a entrada `App.tsx` liga esse evento à rota do detalhe. O detalhe recebe a ação de regresso da sua rota, com retorno à lista quando não há histórico. Os ecrãs não montam a barra nem dependem um do outro.

| Informação | Responsável |
| --- | --- |
| Filtro, pesquisa, edição em curso ou modal aberto | Componente ou hook mais próximo do uso; React Context quando a partilha estiver justificada. |
| Dados consultados e resultados de operações nos serviços | TanStack Query, sem os copiar para um segundo estado global apenas para os sincronizar. |
| Tema e dependências comuns | Providers com responsabilidades específicas, montados na raiz/layout apropriado. |
| Sessão e utilizador | Futura funcionalidade de autenticação; armazenamento e políticas ainda por decidir. |
| Dados persistidos e operações por sincronizar | Futura integração de armazenamento/sincronização; a cache em memória não substitui essas responsabilidades. |

Deriva contagens e valores calculáveis dos dados existentes. Hooks de consulta permanecem junto da funcionalidade e têm resultados tipados por operação. Distingue carga inicial, atualização em segundo plano, ausência de dados e erro, sem apagar informação válida apenas por estar a atualizar quando o contexto permitir conservá-la.

As chaves de consulta e a invalidação acompanham os dados que identificam: origem, cenário e contexto de técnico fictício nos mocks atuais; utilizador autenticado, filtros ou paginação quando esses conceitos existirem. Ao introduzir sessão, definir também o isolamento e a limpeza dos dados entre utilizadores. Não acrescentar hoje chaves ou estados para conceitos inexistentes.

## Serviços, integrações e mocks

O contrato local `WorkOrderService` disponibiliza `list` e `getById`; uma ordem inexistente devolve `null`. A composição seleciona a implementação conforme a origem. Os controlos de adicionar exemplos, limpar dados e mudar cenários ficam fora do contrato de consulta. O adaptador API atual comunica indisponibilidade, sem pedidos reais. O mock resolve o detalhe a partir dos dados em memória e mantém os cenários de teste.

Na implementação atual, o layout raiz monta `WorkOrderSourceProvider`, que seleciona o serviço e liga as notificações mock à invalidação da cache. O `WorkOrderServiceProvider` da funcionalidade recebe o serviço ativo, a identificação da origem e o âmbito da cache; não constrói adaptadores nem conhece o Debug Menu. Os hooks em `features/work-orders/presentation/hooks` consultam o contrato com resultados tipados de lista e detalhe, preservando dados disponíveis durante uma atualização em segundo plano. A indicação de indisponibilidade pertence ao contrato da aplicação e é traduzida em texto de apresentação pelos hooks.

A montagem em `appWorkOrderServices` respeita uma origem inicial Mock mesmo com o menu desativado. Quando a origem inicial é API, só prepara também o mock se a seleção temporária estiver disponível em desenvolvimento. Isto não ativa o Debug Menu nem permite alterações de origem em produção.

Na futura integração API, o adaptador valida e converte os dados recebidos e traduz falhas de transporte para erros tratáveis pela funcionalidade. O ecrã apresenta feedback sem interpretar códigos HTTP ou mensagens externas. Os modelos internos e o formato HTTP podem diferir; URLs, payloads, autenticação e permissões precisam de um contrato comum com o Backend. Um exemplo JSON ou endpoint ilustrativo não fecha esse contrato.

Mocks e API implementam as operações necessárias à funcionalidade; não são obrigados a reproduzir os detalhes internos um do outro. Os mocks não implementam autenticação ou permissões reais. A visualização inicial de todas as ordens fictícias é uma facilidade de desenvolvimento, não uma regra de acesso do produto.

Na consulta mobile com mocks, a visualização inicial mantém todas as ordens fictícias. O Debug Menu pode selecionar temporariamente um técnico fictício; nesse contexto, lista e detalhe disponibilizam apenas ordens atribuídas diretamente ao respetivo ID. Ordens sem técnico ou de outros técnicos ficam fora desse contexto. A seleção só está disponível em desenvolvimento com a Debug Layer ativa, não representa uma sessão autenticada, não altera a origem API e perde-se ao recarregar. A cache distingue os contextos. Atribuições a equipas aguardam definição do contrato.

O mock mantém os dados de gestão separados da consulta contextual: selecionar um técnico não remove ordens nem intervenções. O snapshot fornece um serviço de consulta ligado ao ID escolhido, que mantém o contexto mesmo durante operações lentas. A composição fornece esse contrato à apresentação, identifica o contexto na cache e apresenta a indicação do técnico fictício. Os controlos de gestão continuam a operar sobre todos os exemplos; repor dados ou mudar o cenário conserva a seleção até ser alterada ou a aplicação recarregar.

## Comportamento mobile e evolução

O layout raiz disponibiliza `QueryClientProvider` e comunica mudanças de estado da aplicação ao gestor de foco em Android e iOS. A integração de conectividade ainda não está implementada. Ao ligar a API, definir reconexão, atualização ao regressar ao ecrã, cancelamento e repetição de pedidos segundo a operação. A configuração atual `networkMode: 'always'` suporta dados locais; não é, por si só, uma política de rede para a API real.

Na composição da interface, considerar voltar do sistema, ligações diretas, teclado, áreas seguras, ampliação de fonte, acessibilidade e permissões nativas. Diferenças pequenas podem usar `Platform`; implementações substancialmente diferentes podem usar extensões `.android` e `.ios`. Testar o comportamento nas plataformas relevantes, sem supor equivalência por partilharem código.

O funcionamento offline é um requisito de evolução. Distinguir informação consultada, alterações guardadas localmente, operações pendentes e submissões confirmadas pelo servidor. A persistência, prevenção de duplicados, repetição e conflitos precisam de desenho próprio na tarefa do fluxo que os utiliza. Ainda não foi escolhida base de dados, biblioteca de sincronização ou estratégia de armazenamento de sessão.

Preferir os componentes, tokens e mecanismos existentes. Novas dependências, providers ou mecanismos transversais exigem necessidade concreta e o processo de aprovação documentado. Medir desempenho em dispositivo e build de release antes de generalizar otimizações.

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

O serviço provisório em `src/features/work-orders/infrastructure/mock` usa os exemplos JSON de `src/mocks/work-orders`, adaptados da Web e carregados por referências estáticas compatíveis com Metro. A composição em `src/composition/work-orders` partilha os dados entre o menu, a lista e o detalhe. A consulta usa inicialmente todas as ordens e permite selecionar um técnico fictício no menu, conforme a orientação de contexto acima. Identifica os dados fictícios e o técnico ativo, com filtros por data local e ausência de agendamento. A seleção API apresenta indisponibilidade sem carregar mocks. Os modelos, estados e campos são provisórios e devem ser confirmados com o PO e o Backend; os restantes destinos ainda não estão disponíveis.

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
