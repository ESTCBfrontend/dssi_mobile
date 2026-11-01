# Arquitetura e qualidade

Este documento contém princípios aprovados para orientar o crescimento do projeto mobile. Deve ser lido em conjunto com [AGENTS.md](../AGENTS.md) e [CONTRIBUTING.md](../CONTRIBUTING.md).

## Estado atual e evolução

A aplicação ainda é uma base Expo, com o ponto de entrada em `index.ts` e o componente inicial em `App.tsx`. Ainda não existem funcionalidades de negócio organizadas em `src/features`.

A direção acordada é organizar o código por funcionalidade e separar responsabilidades conforme a complexidade real. A estrutura abaixo é uma referência para as próximas funcionalidades; não representa pastas já existentes nem exige criar todas as camadas de uma vez.

```text
src/
  app/                    # Composição, configuração e ligação das dependências
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

A configuração contém os tokens claros necessários ao Button, ao StatusBadge, ao AlertIcon, ao TextField, ao FormField, ao Checkbox, ao Radio, ao RadioGroup, ao Switch, ao CheckboxGroup, ao ProgressBar, ao LoadingIndicator, ao Textarea, ao Alert, ao Card, ao ContentPanel, ao FormGroup, ao PageButton, ao Pagination e ao Tab. O Figma consultado não define uma paleta escura; esta pode ser fornecida posteriormente pelo consumidor. Os contratos e a correspondência de tokens estão em [components/Button.md](components/Button.md), [components/StatusBadge.md](components/StatusBadge.md), [components/AlertIcon.md](components/AlertIcon.md), [components/TextField.md](components/TextField.md), [components/FormField.md](components/FormField.md), [components/Checkbox.md](components/Checkbox.md), [components/Radio.md](components/Radio.md), [components/RadioGroup.md](components/RadioGroup.md), [components/Switch.md](components/Switch.md), [components/CheckboxGroup.md](components/CheckboxGroup.md), [components/ProgressBar.md](components/ProgressBar.md), [components/LoadingIndicator.md](components/LoadingIndicator.md), [components/Textarea.md](components/Textarea.md), [components/Alert.md](components/Alert.md), [components/Card.md](components/Card.md), [components/ContentPanel.md](components/ContentPanel.md), [components/FormGroup.md](components/FormGroup.md), [components/PageButton.md](components/PageButton.md), [components/Pagination.md](components/Pagination.md) e [components/Tab.md](components/Tab.md).

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

Não há nesta fase escolha aprovada de biblioteca de navegação, gestão global de estado, cliente HTTP ou armazenamento de sessão. A escolha concreta deve partir de uma necessidade real e do respetivo impacto.
