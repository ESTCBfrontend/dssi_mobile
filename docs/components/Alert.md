# MDS/Alert

Mensagem de feedback reutilizável, sem lógica de negócio ou gestão de visibilidade. Implementação: [Alert.tsx](../../src/shared/ui/Alert/Alert.tsx); referência: [Figma, nó 89:1030](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ?node-id=89-1030).

Importa `Alert` de `src/shared/ui/Alert` e usa-o dentro de `ThemeProvider`. O consumidor escolhe o conteúdo, a importância, quando mostrar ou ocultar e o comportamento das ações.

| Propriedade | Comportamento |
| --- | --- |
| `tone` | `info` (omissão), `success`, `warning` ou `danger`. |
| `layout` | `compact` (omissão) apresenta o título; `detailed` apresenta título e mensagem. |
| `title`, `message` | Título obrigatório e não vazio; mensagem obrigatória e não vazia em `detailed`. `compact` rejeita uma mensagem para não a ocultar acidentalmente. |
| `action` | Opcional: objeto `{ label, onPress }`; utiliza o Button existente. |
| `onDismiss` | Opcional; apresenta botão de fecho e chama o consumidor, que decide se oculta o alerta. |
| `dismissLabel` | Nome acessível do fecho, por omissão `Fechar alerta`. |
| `toneLabel` | Nome acessível do tipo; por omissão `Informação`, `Sucesso`, `Aviso` ou `Erro`, podendo ser localizado. |
| `accessibilityLiveRegion` | `none` por omissão; `polite` ou `assertive` pode ser escolhido conforme contexto e criticidade. O comportamento dos anúncios depende da plataforma e leitor. |
| `style`, `testID`, `nativeID`, `onLayout` | Personalização e integração nativa. |

O texto respeita a ampliação e pode quebrar linhas. A região textual é um alerta acessível que inclui o tipo, título e mensagem; ação e fecho são botões independentes. O ícone decorativo diferencia os tipos também pela forma. O fecho tem área tátil de 44 pontos. A composição deve escolher texto e anúncios adequados, evitando notificações desnecessárias.

## Tema e Figma

`AppTheme.alert` configura cores e medidas; `AppTheme.alertIcon` e os tokens do botão continuam configuráveis separadamente. O Figma usa fundos `#eff8ff`, `#def2e5`, `#fff1d6`, `#fee4e2`, contorno `#dee3eb`, texto `#1f2938`, raio 14, padding 16 e intervalo 12. O título usa Inter SemiBold 14 e a mensagem Inter Regular 13. O ícone de fecho SVG é o recurso original do Figma (18 pontos). A paleta pode ser substituída pelo consumidor.

As demonstrações executáveis ficam apenas locais. Os [testes locais](../../src/shared/ui/Alert/Alert.test.tsx) executam-se com `npm run test:components` e ficam fora de `test:ci`, conforme a preferência do utilizador. Testes JavaScript e exportação Android não substituem validação em dispositivo e leitores de ecrã.
