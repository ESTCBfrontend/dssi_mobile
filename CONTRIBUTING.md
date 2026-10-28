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
