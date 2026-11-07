# Registo de alterações

Este ficheiro resume alterações relevantes para utilizadores e colaboradores. As entradas em «Por lançar» descrevem trabalho ainda não incluído numa versão publicada; as secções de versões registam entregas publicadas. Consulta [CONTRIBUTING.md](CONTRIBUTING.md#registo-de-alterações) para o processo de atualização.

## Por lançar

### Adicionado

- Consulta do detalhe das ordens fictícias a partir da lista, com regresso e tratamento de indisponibilidade ou ordem removida.
- Ecrã mobile de serviços com ordens fictícias, filtros e atualização ao alterar a origem ou os cenários no Debug Menu.
- Configurações identificadas para tentar ligar o depurador do IDE à app Android já aberta, incluindo uma opção de teste para Hermes.
- Base de navegação com Expo Router e gestão de dados assíncronos com TanStack Query, preparada para os próximos ecrãs mobile.

## 0.2.0 — 2026-11-06

### Adicionado

- Preparação de diagnóstico dos pedidos API com correlação, duração e estado, sem dependência de cliente HTTP.
- Preparação do logging de respostas JSON da API, com filtragem explícita e sem corpos em produção.
- Apresentação local do JSON dos exemplos mock de ordens e intervenções adicionados em desenvolvimento.
- Diagnóstico das listagens mock de ordens com duração e correlação, e contagens detalhadas na adição de exemplos.
- Seleção e adição de exemplos individuais de ordens fictícias no Debug Menu.
- Mocks de intervenções associados às ordens fictícias, com controlos individuais e em conjunto no Debug Menu.
- Ajuda e resultados do Debug Menu apresentados em notificações substituíveis que expiram após três segundos.
- Menu de desenvolvimento compacto com ícone de inseto e ajuda contextual; níveis dos logs identificados no terminal.
- Mocks provisórios de ordens em memória, com cenários e controlos de desenvolvimento no Debug Menu.
- Guia de instalação e utilização do ambiente de desenvolvimento Android com emulador e Expo.
- Menu de desenvolvimento para selecionar temporariamente a origem de dados, controlado por flag e inacessível em produção.
- Base de configuração da origem de dados e logging técnico local, preparada para futuras ferramentas de desenvolvimento.
- Registo de alterações e orientações para o manter durante as tarefas e a preparação de versões.

### Limitações conhecidas

- A integração com a API real e os ecrãs de negócio estão por implementar; os exemplos mock são provisórios e mantidos em memória.
- A ligação dos logs à Debug Console do IDE não está validada. Os logs locais estão disponíveis no terminal do Expo.
- Não foram validados iOS, dispositivos físicos ou leitores de ecrã para estas alterações. A exportação do bundle Android não valida uma compilação nativa.

## 0.1.0 — 2026-11-02

Primeira entrega da base mobile e dos componentes reutilizáveis. A aplicação ainda não inclui funcionalidades de negócio completas.

### Adicionado

- Base React Native e Expo, componentes de interface reutilizáveis e tema configurável.
- Componentes para formulários, navegação, listagens, ficheiros, imagens, diálogos e notificações.
- Guia do catálogo, fichas individuais de utilização e documentação de arquitetura e colaboração.

### Limitações conhecidas

- A validação em dispositivos físicos não está completa, incluindo seleção de documentos, galeria, câmara, acessibilidade e apresentação de setas em determinados seletores.
- A exportação Android verifica o bundle JavaScript; não valida compilações nativas nem execução em dispositivos Android ou iOS.

Consulta a [release v0.1.0](https://github.com/ESTCBfrontend/dssi_mobile/releases/tag/v0.1.0) para os detalhes da entrega.
