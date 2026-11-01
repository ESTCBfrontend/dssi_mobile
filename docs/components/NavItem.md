# MDS/NavItem

Destino visual de navegação inferior, controlado pela composição da aplicação. Implementação: [NavItem.tsx](../../src/shared/ui/NavItem/NavItem.tsx). Referências Figma: [normal](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ?node-id=100-1138), [ativo](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ?node-id=100-1141) e [desativado](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ?node-id=100-1144).

## Utilização

Importa `NavItem`, `NavItemProps` e `NavItemIcon` de `src/shared/ui/NavItem`, dentro de `ThemeProvider`. O componente representa um destino; a aplicação determina se está ativo e o que acontece ao pressionar.

```tsx
<NavItem label="Ordens" selected={destino === 'ordens'}
  onPress={() => navegar('ordens')} />
```

Os valores e a função do exemplo pertencem à aplicação. Para uma barra inferior, compõe os itens dentro de um contentor horizontal passado ao [AppShell](AppShell.md).

## Propriedades

| Propriedade | Contrato |
| --- | --- |
| `label`, `selected`, `onPress` | Etiqueta não vazia, estado selecionado controlado e callback. Pressionar não altera a rota nem `selected` internamente. |
| `disabled` | Impede o callback e comunica o bloqueio; por omissão `false`. |
| `icon` | Elemento opcional ou função que recebe `{ color, size }`. Sem ícone fornecido apresenta o indicador do Figma. É decorativo: a etiqueta identifica o destino. |
| `badge` | Texto adicional opcional, incluído no nome acessível quando não existe uma etiqueta acessível explícita. Não gere contagens. |
| `accessibilityLabel`, `accessibilityHint` | Nome e ajuda opcionais; o nome não pode ser vazio. Se substituíres o nome e usares `badge`, inclui nele o contexto necessário. |
| `style`, `testID` | Personalização e identificador do controlo. |

## Acessibilidade e comportamento

O controlo usa papel de separador com `accessibilityState.selected` e `disabled`, área tátil mínima de 44 pontos e foco visível. A etiqueta permite quebrar linha e respeita a ampliação nativa. O consumidor fornece a seleção atual, os destinos e a integração com o navegador escolhido; não há rotas, histórico ou conteúdos de ecrãs embutidos.

## Tema e validação

`AppTheme.navigation` configura cores, fundo, foco e fontes. O Figma usa altura 58, indicador 7 × 7, raio 10 e texto Inter de 11 pontos. A implementação usa altura mínima e os SVGs originais dos três estados; um ícone fornecido pelo consumidor substitui o indicador.

Os [testes locais](../../src/shared/ui/NavItem/NavItem.test.tsx) verificam seleção acessível, callback e bloqueio. Executam-se com `npm run test:components`, fora do CI por decisão do utilizador. Validar destinos, indicadores SVG, foco, TalkBack/VoiceOver e fonte ampliada em Android e iOS.
