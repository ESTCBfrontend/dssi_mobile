# Instruções para agentes de IA

Lê este ficheiro, [README.md](README.md), [CONTRIBUTING.md](CONTRIBUTING.md) e [docs/architecture.md](docs/architecture.md) antes de alterar o projeto. Instruções explícitas do utilizador têm prioridade.

Para criar, alterar ou reutilizar componentes da interface, consulta também [docs/COMPONENTS_MOBILE_REACT_NATIVE.md](docs/COMPONENTS_MOBILE_REACT_NATIVE.md), incluindo a ficha `MDS/<Nome>` e as dependências relevantes. O guia descreve comportamento, composição, utilização e validação; as propostas técnicas e os exemplos não substituem as decisões aprovadas do projeto nem alargam o âmbito da tarefa.

## Projeto e colaboração

- React Native, Expo, TypeScript e npm, com `package-lock.json`.
- Tarefas partem de `develop` e seguem por PR para `develop`; entregas seguem por PR para `main`.
- Repositório público: não adicionar credenciais, tokens, ficheiros `.env` ou dados sensíveis. Não introduzir serviços pagos sem pedido explícito.
- Inspeciona o contexto e preserva alterações existentes. Mantém cada alteração focada na tarefa.
- Não faças push direto para `develop` ou `main`, não contornes a CI nem enfraqueças as proteções.
- Antes de criar PRs, confirma branch, destino, diferenças e verificações. Não faças merge, publiques ou alteres configurações externas sem instrução apropriada.

## Qualidade, arquitetura e orientação a objetos

- Prioriza correção, clareza, manutenção e testabilidade. Mantém responsabilidades pequenas, explícitas e coesas.
- Aplica princípios de orientação a objetos no domínio e nos serviços: encapsulamento, responsabilidades definidas e dependências controladas. Usa classes e contratos onde representem necessidades reais.
- Na apresentação, usa componentes funcionais e hooks de React. Transformações simples podem ser funções puras.
- Prefere composição a hierarquias profundas de herança. Não cries interfaces, classes base, camadas ou mecanismos de injeção de dependências sem benefício concreto.
- Separa apresentação, regras de negócio e integrações. O domínio deve ser independente de React Native, Expo, HTTP e armazenamento.
- Organiza funcionalidades segundo [docs/architecture.md](docs/architecture.md). Cria apenas as pastas e abstrações necessárias à tarefa; não imponhas uma estrutura completa a funcionalidades triviais.
- Reutiliza código que represente a mesma responsabilidade ou regra de negócio. Não generalizes apenas por semelhança visual ou por necessidades hipotéticas.
- Antes de acrescentar uma abstração ou dependência transversal, procura soluções existentes no projeto e explica a necessidade e o impacto.

## Testes proporcionais ao risco

- Adiciona ou atualiza testes significativos para os comportamentos alterados. Prioriza regras de negócio, interações essenciais, erros e limites relevantes.
- Para correções, acrescenta um teste de regressão quando viável. A profundidade dos testes deve acompanhar o risco da alteração.
- Evita testes que apenas repetem detalhes de implementação, snapshots extensos sem objetivo e combinações sem valor demonstrável. Não imponhas um número fixo de testes nem cobertura de 100%.
- Usa as verificações do README: `npm run lint`, `npm run typecheck`, `npm run test:ci` e `npm run bundle:android`. No PowerShell pode ser necessário usar `npm.cmd`.
- Para alterações apenas documentais, verifica diferenças, ligações e coerência; não acrescentes testes de código sem necessidade.
- Não desatives testes nem reduzas verificações para obter CI verde. Explica as verificações efetuadas e as limitações.
- A exportação do bundle Android e os testes JavaScript não validam compilação nativa, execução em dispositivo ou iOS. Alterações dependentes de plataforma podem exigir validação adicional.

## Evolução das instruções com aprovação

Durante cada tarefa, avalia se está a surgir uma decisão duradoura ainda não documentada. Pergunta: outra pessoa ou agente poderá implementar trabalho futuro de forma incompatível se desconhecer esta decisão?

São exemplos relevantes: limites arquiteturais, organização de pastas, contratos entre módulos, autenticação, tratamento de erros, armazenamento, dependências transversais, testes, CI, ambientes e publicação. Não transformes detalhes locais ou soluções temporárias em convenções globais.

Quando identificares uma decisão deste tipo:

1. Verifica as instruções existentes e distingue uma decisão nova de uma regra já aprovada.
2. Explica brevemente a decisão, a razão, o alcance e o impacto futuro; apresenta o texto exato proposto e o ficheiro de destino.
3. Pergunta ao utilizador se quer guardar essa orientação. Agrupa propostas relacionadas para evitar interrupções repetidas.
4. Aguarda aprovação explícita antes de acrescentar uma nova regra permanente. A aprovação de uma implementação isolada não implica aprovação de uma convenção global.
5. Continua trabalho independente enquanto aguardas resposta. Se a implementação depender de uma decisão estrutural ainda não aprovada, esclarece-a antes de avançar nessa parte.
6. Após aprovação, atualiza a documentação na branch da tarefa e inclui a alteração no PR. Não voltes a pedir aprovação para a mesma regra já explicitamente autorizada.

Correções de escrita, ligações e atualização factual de comandos já aprovados não precisam de nova aprovação da política. Se a alteração mudar o significado ou o processo, apresenta uma proposta.

Se uma regra estiver desatualizada, contraditória ou incompatível com o pedido atual, assinala o conflito e propõe uma revisão. Não alargues uma exceção local a todo o projeto.

## Onde registar

- `AGENTS.md`: regras operacionais atuais para agentes, com referências aos detalhes.
- `CONTRIBUTING.md`: processo da equipa e revisão dos PRs.
- `docs/architecture.md`: responsabilidades, estrutura e dependências permitidas.
- `docs/decisions/`: justificação de decisões significativas, criada apenas quando necessária.

Mantém as regras concisas, verificáveis e coerentes com o código. Distingue o estado implementado, decisões aprovadas por implementar e propostas pendentes. Uma proposta ainda não aprovada não deve aparecer como instrução vigente.

Atualiza ou substitui regras antigas quando uma decisão aprovada as alterar. Usa o histórico do Git para consultar versões anteriores, evitando acumular regras contraditórias no ficheiro.

Estas instruções não são executadas automaticamente pela CI: a sua aplicação depende dos agentes e da revisão humana. Não alteres outros repositórios para sincronizar regras sem incluir essa ação no âmbito autorizado.
