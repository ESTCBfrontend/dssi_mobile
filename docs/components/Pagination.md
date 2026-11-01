# MDS/Pagination

Controlo mobile reutilizável de navegação por páginas. Não carrega dados, altera listas ou gere o estado da página. Implementação: [Pagination.tsx](../../src/shared/ui/Pagination/Pagination.tsx). Referência: [Figma, nó 124:1823](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ?node-id=124-1823).

Importa `Pagination` de `src/shared/ui/Pagination` e usa-o dentro de `ThemeProvider`. A composição fornece os dados e atualiza a página em resposta a `onPageChange`.

| Propriedade | Comportamento |
| --- | --- |
| `page` | Página controlada, inteira segura e começada em 1. Deve estar no intervalo disponível; quando `total` é zero deve ser 1. |
| `pageSize` | Número inteiro seguro positivo de registos por página. |
| `total` | Número inteiro seguro não negativo de registos. |
| `onPageChange` | Recebe a página pedida; a composição atualiza os dados e a prop `page`. |
| `disabled` | Desativa ambos os botões, por exemplo durante uma operação controlada pelo consumidor. |
| `labels` | Personaliza `previous`, `next`, `empty` e as funções `total`, `range`, `page` para localização. |
| `style`, `testID`, `nativeID`, `onLayout` | Personalização e integração nativa. |

O intervalo visível é calculado com `page`, `pageSize` e `total`; os botões anterior e seguinte são desativados nos limites. Com zero registos, mostra `0–0 de 0` e `Sem páginas`, sem permitir navegação. Se o total mudar, o consumidor deve manter a página válida. Abaixo de 300 pontos de largura do componente, a página é apresentada acima dos botões; o limiar é configurável no tema. O conteúdo e os controlos podem quebrar linha e respeitam a ampliação nativa. O componente não anuncia atualizações automaticamente.

## Tema e Figma

`AppTheme.pagination` configura cores, tipografia e espaçamentos; os botões reutilizam [Button](Button.md) e o respetivo tema. O Figma mobile define fundo `#ffffff`, contorno `#dee3eb`, texto secundário `#667385`, texto principal `#1f2938`, raio 12, padding 12 e espaço 10. Inter Medium, Regular e SemiBold são usados nos rótulos de 12 pontos. A paleta pode ser substituída pelo consumidor.

As demonstrações executáveis ficam apenas locais. Os [testes locais](../../src/shared/ui/Pagination/Pagination.test.tsx) executam-se com `npm run test:components` e ficam fora de `test:ci`, conforme a preferência do utilizador. Testes JavaScript e exportação Android não substituem validação em dispositivo e leitores de ecrã.
