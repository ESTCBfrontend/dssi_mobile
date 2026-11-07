# Guia de implementação incremental

Guia de trabalho para colaboradores e agentes de código. Aplica a [arquitetura](architecture.md) a funcionalidades e correções, mantendo alterações pequenas e responsabilidades explícitas. Não aprova novos requisitos, bibliotecas ou refatorações fora do âmbito da tarefa.

## 1. Reunir o contexto antes de escolher a solução

1. Lê [AGENTS.md](../AGENTS.md), [README.md](../README.md), [CONTRIBUTING.md](../CONTRIBUTING.md) e [architecture.md](architecture.md). Verifica a branch, as alterações locais e o código já existente.
2. Identifica o cartão/tarefa, os critérios de aceitação, as dependências e as respostas relevantes do Product Owner. Confirma o âmbito antes de escolher o próximo ecrã. A ordem dos frames do Figma não define a sequência de implementação.
3. Consulta o Figma como referência de interface e as fichas dos [componentes existentes](COMPONENTS_MOBILE_REACT_NATIVE.md). Se um requisito, wireframe ou exemplo divergir de uma decisão explícita do utilizador, assinala a diferença e esclarece o que afeta a tarefa; não inventes regras ou campos para preencher o desenho.
4. Quando o trabalho exigir alinhamento com a Web, consulta a implementação e a documentação relevantes nesse repositório. Reutiliza conceitos e contratos adequados ao mobile, preservando as diferenças de plataforma. Essa consulta não autoriza editar o outro repositório.
5. Usa a tabela de [transição arquitetural](architecture.md#transição-a-acompanhar) para distinguir limites pretendidos de organização ainda presente no código.

Se uma fonte não estiver acessível, indica o que não foi confirmado e continua apenas o trabalho independente dessa informação. Não marques critérios de um cartão como satisfeitos apenas por existir um ecrã ou por os testes passarem.

## 2. Definir o incremento

Descreve o comportamento observável que a tarefa vai entregar e os dados de que depende. Por exemplo: abrir o detalhe de uma ordem, mostrar os campos disponíveis e tratar ordem inexistente. Define os limites da tarefa e os estados relevantes: carga inicial, conteúdo, atualização, ausência de dados, erro e nova tentativa quando aplicável.

Escolhe as responsabilidades necessárias antes das pastas. Uma consulta simples pode usar ecrã, hook, contrato e adaptador. Só acrescenta coordenação em `application` quando houver trabalho real entre operações ou regras; não cries um caso de uso que apenas encaminhe a mesma chamada.

As regras de negócio pertencem à funcionalidade, não ao botão ou ao Debug Menu. Uma regra conhecida, como a diferença entre concluir uma intervenção e concluir uma ordem, deve orientar o modelo; uma transição ainda não acordada não deve ser deduzida do nome de um estado mock.

## 3. Colocar cada responsabilidade no local certo

| Preciso de... | Local e critério |
| --- | --- |
| Ler o ID de uma rota ou montar um layout | `src/app`; manter a rota pequena e encaminhar parâmetros para a funcionalidade. |
| Construir um adaptador, selecionar a origem ou fornecer dependências | `src/composition`; a funcionalidade recebe o contrato necessário. |
| Representar conceitos ou validar uma regra de negócio | `features/<nome>/domain`, sem React ou integrações. |
| Definir uma operação ou coordenar passos de negócio | `features/<nome>/application`; contrato junto de quem dele precisa. |
| Interpretar JSON, chamar API ou aceder a armazenamento | `features/<nome>/infrastructure`; validar e adaptar dados externos. |
| Consultar dados com TanStack Query ou gerir interação | `features/<nome>/presentation`, junto do ecrã/funcionalidade. |
| Construir uma parte visual usada apenas nessa funcionalidade | Componentes da própria funcionalidade. |
| Reutilizar uma responsabilidade visual já partilhada | `shared/ui`, seguindo o catálogo e a ficha do componente. |
| Reutilizar um mecanismo técnico entre funcionalidades | `shared/infrastructure`, apenas quando a reutilização estiver demonstrada. |
| Adicionar exemplos fictícios | `src/mocks/<funcionalidade>` e carregador da funcionalidade, sem dados reais. |

Evita criar pastas globais genéricas como destino automático de qualquer `hook`, `service` ou função auxiliar. Não movas código para `shared` apenas porque duas interfaces se parecem. Testes podem ficar junto dos módulos que protegem; os testes de montagem e navegação já têm espaço em `__tests__`.

## 4. Percurso de uma consulta

O exemplo abaixo descreve a direção pretendida; não é um snippet a copiar nem afirma que todas as separações já existem:

1. A rota lê o identificador e liga a ação de regresso.
2. A composição fornece a implementação do contrato de consulta.
3. O hook da funcionalidade chama `getById` e gere a consulta e os seus estados.
4. O serviço API ou mock devolve um modelo interno, `null` para ordem inexistente ou um erro tratável.
5. O ecrã apresenta o resultado usando os componentes existentes.

O contrato atual está em [workOrderService.ts](../src/features/work-orders/application/workOrderService.ts). Os adaptadores ficam na [infraestrutura de ordens](../src/features/work-orders/infrastructure). A construção está em [appWorkOrderServices.ts](../src/composition/work-orders/appWorkOrderServices.ts), e o [WorkOrderSourceProvider](../src/composition/work-orders/WorkOrderSourceProvider.tsx) liga a seleção e as notificações de desenvolvimento. Na funcionalidade, o [WorkOrderServiceProvider](../src/features/work-orders/presentation/hooks/WorkOrderServiceProvider.tsx) recebe o serviço selecionado, e os [hooks de consulta](../src/features/work-orders/presentation/hooks/useWorkOrders.ts) usam apenas o contrato de aplicação. Atualiza estes caminhos quando os módulos mudarem de local.

Prefere resultados tipados por operação. Um hook de detalhe não precisa de devolver uma união de lista e objeto nem de inspecionar arrays para descobrir que operação executou. Partilha chaves, configuração ou transformação quando representarem a mesma responsabilidade.

Props e providers específicos são formas possíveis de fornecer contratos. Escolhe a mais simples para o uso real; não espalhes singletons concretos pelos ecrãs nem acrescentes um contentor de injeção sem necessidade. A notificação dos controlos mock pode ser ligada na composição sem entrar no contrato de leitura.

## 5. Dados, cache e erros

- Mantém filtros, texto introduzido e estado visual no local de utilização. Deriva contagens e valores calculáveis; evita copiar a mesma lista para outro estado global.
- Define chaves de consulta que representem a operação e os critérios existentes. Valida a invalidação depois de alterações, a troca de origem e o regresso ao ecrã quando relevante.
- Para a simulação de técnico já aprovada, usa o serviço contextual do snapshot mock fornecido pela composição. Não filtres apenas os cartões nem voltes a consultar o serviço de gestão no detalhe: as duas consultas têm de respeitar o mesmo técnico. O contexto faz parte da chave de cache e não representa autenticação; ver [orientação e implementação](architecture.md#serviços-integrações-e-mocks).
- Distingue carregar pela primeira vez de atualizar informação existente. Define se um erro permite conservar informação anterior e como comunicar essa condição ao utilizador.
- Na API, valida e converte respostas na fronteira da infraestrutura. Não deixes o ecrã interpretar payloads, códigos HTTP ou mensagens externas. Os parsers existentes podem orientar a solução; não é obrigatória uma biblioteca adicional.
- Distingue indisponibilidade da integração, falha de consulta e resultado inexistente. Mensagens apresentadas e diagnóstico técnico têm objetivos diferentes; respeita os limites de [logging](architecture.md#diagnóstico-e-origem-de-dados).
- Não confundas cache, persistência local e confirmação do servidor. Ao implementar um fluxo offline, definir as operações pendentes, repetição, prevenção de duplicados e conflitos antes de depender desse comportamento.

Mocks e API usam os mesmos contratos necessários à funcionalidade. Os exemplos não aprovam formatos HTTP, endpoints, permissões ou regras de negócio. Ao integrar o Backend, regista diferenças entre o modelo interno e o contrato externo e testa essa adaptação.

## 6. Interface e comportamento nativo

Reutiliza primeiro os componentes e tokens existentes. Extrai cabeçalhos ou estrutura comum quando houver uma responsabilidade visual partilhada; a navegação comum não deve ficar dentro de um ecrã importado por outro. Mantém providers comuns no layout apropriado, usando overrides locais de tema apenas quando necessários.

Na consulta atual, [o layout raiz](../src/app/_layout.tsx) fornece o tema e monta a barra de [ServicesNavigation](../src/composition/navigation/ServicesNavigation.tsx) fora da pilha. A lista comunica a abertura através de `onOpenOrder`, ligado à rota por [App.tsx](../App.tsx). O detalhe recebe `onBack` da [rota de serviço](../src/app/services/[id].tsx). Mantém as margens seguras de acordo com esta montagem: inferior no layout e superior nos ecrãs, sem as duplicar.

Em cada fluxo relevante, verifica voltar do sistema, navegação de regresso, teclado, área segura, fonte ampliada, acessibilidade e permissões utilizadas. Diferenças pequenas podem ser locais; diferenças substanciais de plataforma podem ter implementações `.android` e `.ios`. Não acrescentes variações de plataforma antes de existir necessidade.

Para dados remotos, revê o comportamento de foco e rede na [arquitetura mobile](architecture.md#comportamento-mobile-e-evolução). Para validar visualmente, segue o [guia Android](desenvolvimento-android.md), reutilizando o emulador e o servidor existentes. Indica as limitações quando não conseguires observar o dispositivo. Mede desempenho antes de generalizar memoização ou substituir a estratégia de listas.

## 7. Adaptar código existente por etapas

Preserva alterações locais e identifica os consumidores do módulo antes de o mover ou alterar. Define uma mudança verificável: por exemplo, mover um hook e corrigir os seus imports mantendo a consulta funcional. Evita combinar essa mudança com um redesenho de ecrãs ou novas regras de negócio sem necessidade da tarefa.

O código atual pode atravessar fronteiras que a direção aprovada pretende corrigir. Não copies essa dependência como padrão para uma nova funcionalidade. Também não refatores todas as ocorrências só para concluir uma tarefa pequena: adapta a parte autorizada, regista o que permanece e atualiza a tabela de transição quando aplicável.

Antes de extrair uma abstração, verifica se ela reduz conhecimento entre módulos, preserva tipos claros e evita duplicar uma regra. Se apenas acrescentar passagens de dados ou opções genéricas, mantém a solução direta.

## 8. Validar e atualizar a documentação na mesma tarefa

Usa as [verificações do README](../README.md#verificações-locais) e os testes proporcionais ao risco definidos em AGENTS.md. Para serviços, cobre contratos, erros e limites; para ecrãs, interações essenciais; para navegação, o percurso entre destinos. As suites de componentes que já são locais mantêm esse processo. Avalia testes em dispositivo para fluxos essenciais sem alterar o pipeline sem o âmbito apropriado.

| O que mudou | Documento a atualizar |
| --- | --- |
| Como começar ou que funcionalidade está disponível | [README.md](../README.md). |
| Responsabilidade, contrato entre módulos, dependência ou estado da transição | [architecture.md](architecture.md). |
| Como aplicar a arquitetura numa tarefa | Este guia, com referências aos caminhos reais. |
| Comportamento ou contrato de um componente reutilizável | Ficha em `docs/components` e catálogo quando necessário. |
| Instalação, execução ou diagnóstico do ambiente | [desenvolvimento-android.md](desenvolvimento-android.md). |
| Processo de equipa e revisão | [CONTRIBUTING.md](../CONTRIBUTING.md). |
| Instrução operacional para agentes | [AGENTS.md](../AGENTS.md), com referências para o detalhe. |
| Justificação de uma decisão significativa | `docs/decisions/`, apenas quando necessário. |
| Impacto relevante para utilizadores ou colaboradores | «Por lançar» no [CHANGELOG.md](../CHANGELOG.md). |

Descreve separadamente o comportamento implementado, a direção aprovada ainda por aplicar e as propostas pendentes. A aprovação de novas regras permanentes segue AGENTS.md. Os guias externos e os exemplos de código não aprovam decisões para este projeto.

Na revisão, confirma: âmbito e critérios identificados, dependências compreensíveis, componentes existentes considerados, comportamento validado, diferenças Android/iOS indicadas e documentação coerente com o resultado. O PR usa o [modelo existente](../.github/pull_request_template.md); uma CI verde não substitui esta revisão.

## Referências de fundamentação

Estas fontes ajudam a compreender as escolhas; prevalecem as decisões aprovadas e a compatibilidade com as versões do projeto:

- [Expo Router — conceitos](https://docs.expo.dev/router/basics/core-concepts/): separação entre rotas, layouts e restantes módulos.
- [React — estrutura de estado](https://react.dev/learn/choosing-the-state-structure): estado mínimo e redução de informação duplicada.
- [TanStack Query — React Native](https://tanstack.com/query/latest/docs/framework/react/react-native): integração de foco e conectividade.
- [React Native — testes](https://reactnative.dev/docs/testing-overview): comportamentos observáveis e limites dos testes JavaScript.
- [React Native — código por plataforma](https://reactnative.dev/docs/platform-specific-code): diferenças Android/iOS.
- [Bluesky — guia do projeto](https://github.com/bluesky-social/social-app/blob/main/AGENTS.md), [Obytes — organização](https://github.com/obytes/react-native-template-obytes/blob/master/claude.md) e [Ignite — guia](https://github.com/infinitered/ignite/blob/master/docs/Guide.md): referências de equipas e projetos; não implicam adoção das respetivas dependências ou regras locais.
