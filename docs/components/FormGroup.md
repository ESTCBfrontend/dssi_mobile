# MDS/FormGroup

Contentor reutilizável para organizar campos relacionados. Não gere valores, submissão ou validação de negócio. Implementação: [FormGroup.tsx](../../src/shared/ui/FormGroup/FormGroup.tsx). Referência: [Figma, nó 42:204](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ?node-id=42-204).

Importa `FormGroup` de `src/shared/ui/FormGroup` e usa-o dentro de `ThemeProvider`. Compõe os espaços com [FormField](FormField.md), [TextField](TextField.md) e outros controlos reais da aplicação.

| Propriedade | Comportamento |
| --- | --- |
| `title`, `description` | Texto opcional, não vazio quando fornecido; o título é identificado como cabeçalho. |
| `children` | Primeiro bloco de campos, fornecidos como componentes React Native. |
| `secondary` | Segundo bloco opcional de campos. |
| `actions` | Controlos opcionais apresentados após os campos; o consumidor define o comportamento. |
| `layout` | `stacked` (omissão) empilha os blocos. `twoColumns` apresenta-os lado a lado a partir de 640 pontos de largura do grupo; abaixo disso empilha-os. O limiar é configurável no tema. |
| `style`, `testID`, `nativeID`, `onLayout` | Personalização e integração nativa do contentor. |

Os blocos mantêm as mesmas instâncias quando a largura muda, preservando o estado dos campos. O grupo cresce com o conteúdo, não agrupa todos os controlos num único elemento acessível e não cria campos de exemplo. A aplicação é responsável pela deslocação da página e pelo teclado.

## Tema e Figma

`AppTheme.formGroup` configura cores, tipografia, espaçamentos e limiar de colunas. O Figma usa fundo `#ffffff`, contorno `#dee3eb`, raio 14, título `#1f2938` em Inter SemiBold 18/26 e descrição `#667385` em Inter Regular 13. Stacked usa padding 20 e intervalo 12 entre campos; duas colunas usam padding 24 e intervalos 18. Uma paleta alternativa pode ser fornecida pelo consumidor.

As demonstrações executáveis ficam apenas locais. Os [testes locais](../../src/shared/ui/FormGroup/FormGroup.test.tsx) executam-se com `npm run test:components` e ficam fora de `test:ci`, conforme a preferência do utilizador. Testes JavaScript e exportação Android não substituem validação em dispositivo e leitores de ecrã.
