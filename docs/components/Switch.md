# MDS/Switch

Controlo binário para ativar ou desativar uma opção, com valor controlado pelo consumidor. Implementação: [Switch.tsx](../../src/shared/ui/Switch/Switch.tsx). Referência: [Figma, nó 82:955](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ?node-id=82-955).

Importa `Switch` de `src/shared/ui/Switch` e utiliza-o dentro de `ThemeProvider`. O consumidor fornece o valor e atualiza-o em `onValueChange`; a ação no controlo solicita imediatamente o valor oposto. Persistência, confirmação e regras de negócio pertencem ao consumidor.

| Propriedade | Comportamento |
| --- | --- |
| `value`, `onValueChange` | Booleano controlado e callback com o próximo valor. A apresentação muda quando o consumidor atualiza `value`. |
| `label` | Texto visível e nome acessível por omissão. Quando omitido, `accessibilityLabel` é obrigatório. |
| `accessibilityLabel` | Nome alternativo não vazio, também permite uso sem etiqueta visível. |
| `description`, `accessibilityHint` | Informação complementar visível e ajuda acessível; a descrição é incluída na ajuda. |
| `disabled` | Impede a interação e comunica o estado. |
| `size` | `compact` ou `comfortable` (omissão); mantêm pelo menos 44 pontos de área tátil. |
| `onFocus`, `onBlur`, `ref`, `testID`, `nativeID`, `onLayout`, `style` | Integração nativa e personalização local do contentor. |

O componente expõe o papel `switch` e os estados acessíveis de valor e desativação. A etiqueta e a descrição podem quebrar linhas e respeitam a ampliação da fonte. A ativação é por toque ou ação de acessibilidade; esta implementação não fornece gesto de arrastar. Ao compor com `FormField`, evita duplicar etiquetas e descrições.

As demonstrações executáveis são exclusivamente locais e não entram no Git.

## Tema e Figma

`AppTheme.switch` configura tipografia, cores de texto, foco, dimensões e recursos por tamanho, valor e estado desativado. O Figma usa texto primário `#1f2938`, texto secundário/desativado `#667385`, foco `#2159b8`, fundo desligado `#dee3eb`, ligado `#2159b8` e ligado desativado `#a9c7fb`. Etiqueta usa Inter Medium 14/20 e descrição Inter Regular 12/18.

Os oito SVGs originais locais correspondem aos estados `off/on` normais e desativados dos dois tamanhos. São apresentados por `expo-image`, dependência aprovada anteriormente. Os recursos compact têm 36×20 pontos e os comfortable 44×24; o anel de foco é uma primitiva nativa em torno do recurso. Para alterar as cores dos controlos, fornece SVGs locais equivalentes em `switch.images`: mudar apenas as cores de texto não recolore os recursos originais. Um tema alternativo deve preservar as dimensões dos SVGs correspondentes.

## Verificação

Os [testes locais](../../src/shared/ui/Switch/Switch.test.tsx) cobrem alternância controlada, desativação, nome e ajuda acessíveis, foco, tema e texto longo. Executam-se com `npm run test:components` e ficam fora do `test:ci`, por preferência do utilizador. A validação em dispositivo, com leitores de ecrã e em iOS deve ser registada no PR.
