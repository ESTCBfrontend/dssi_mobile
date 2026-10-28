# Guia de contribuição

Este repositório é público. Usa a tua conta GitHub e não guardes tokens, ficheiros .env nem dados privados no repositório. As proteções só se aplicam depois de configuradas no GitHub.

## Fluxo de trabalho

`develop` integra as tarefas; `main` representa versões estáveis. Cria uma branch por tarefa, por exemplo:

```bash
git switch develop
git pull origin develop
git switch -c feature/12-login
```

Usa `feature/`, `fix/` ou `docs/`, incluindo o número da issue quando existir. Desenvolve a tarefa, acrescenta testes relevantes e executa as verificações do README. Depois:

```bash
git add .
git commit -m "feat: adicionar login"
git push -u origin feature/12-login
```

Abre um Pull Request para `develop`, descreve as alterações e os testes, e associa a issue. Espera pelo sucesso do `mobile-ci`, atualiza a branch quando necessário e pede revisão. Com tudo aprovado, usa Squash and merge e elimina a branch. Não faças push direto para `develop` ou `main`.

Para uma entrega, abre um PR de `develop` para `main`. Um administrador deve configurar ambas as branches para exigir PR, CI verde e branch atualizada, aplicar as regras a administradores e bloquear force pushes e eliminação. Quando houver outro membro capaz de rever, ativa uma aprovação obrigatória e invalida aprovações antigas. Enquanto existir uma só pessoa, exigir aprovação bloquearia os seus próprios PRs.

O CI verifica lint, tipos, testes e exportação do bundle Android. Não substitui testes em dispositivos nem compilações nativas Android e iOS. Uma CI verde não prova que todos os comportamentos foram testados.

## Qualidade e arquitetura

Todos os contribuidores devem seguir os princípios de [docs/architecture.md](docs/architecture.md) e a política de testes proporcionais ao risco de [AGENTS.md](AGENTS.md). Essas orientações aplicam-se ao trabalho da equipa, com ou sem assistência de IA.

## Manter as instruções atualizadas

Durante a tarefa e antes de concluir o PR, considera se foi tomada uma decisão duradoura que poderá afetar funcionalidades ou contribuidores futuros. Exemplos: responsabilidades entre módulos, estrutura de pastas, contratos, autenticação, testes, ambientes, CI e infraestrutura.

Se houver uma regra nova a propor, explica a razão, o alcance e o texto sugerido, seguindo o processo de aprovação de AGENTS.md. Quando um agente de IA fizer a proposta, deve perguntar ao utilizador se quer guardá-la. A revisão geral de um PR não substitui uma aprovação explícita da nova regra.

Após aprovação, inclui a atualização documental na mesma branch e no PR. Verifica se há instruções anteriores a substituir e se os documentos correspondem ao código ou identificam claramente uma direção ainda por implementar. Não registes detalhes locais como convenções globais.

O PR deve indicar se há impacto nas instruções, se a documentação foi atualizada e que decisão foi aprovada. Se não houver impacto, basta indicá-lo. Uma proposta ainda pendente deve ser identificada como tal e não apresentada como regra vigente.

Correções de escrita, ligações e atualizações factuais de comandos já aprovados não exigem nova aprovação da política. Mudanças de significado ou processo devem ser propostas.

No mobile e no web podem existir princípios comuns, mas cada repositório mantém instruções e limitações específicas. A atualização de um deles não autoriza alterações automáticas no outro.
