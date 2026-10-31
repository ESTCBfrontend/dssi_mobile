# MDS/FormField

Composição reutilizável de uma etiqueta, indicador de obrigatório e ajuda ou mensagem de erro em torno de um controlo fornecido pelo consumidor. Não gere valores nem valida regras de negócio. Implementação: [FormField.tsx](../../src/shared/ui/FormField/FormField.tsx); referência: [Figma, nó 38:144](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ?node-id=38-144).

Usa `FormField` dentro de `ThemeProvider`. `children` é uma função que recebe os dados a encaminhar para o controlo, permitindo reutilizar a composição com TextField e outros controlos futuros. Com `TextField`, passa as propriedades recebidas e fornece também `value` e `onChange`. Para outro controlo, adapta a etiqueta, ajuda, erro e estado desativado ao contrato desse controlo, incluindo uma descrição acessível do erro.

| Propriedade | Comportamento |
| --- | --- |
| `label` | Etiqueta visível e não vazia; também serve de base ao nome acessível do controlo. |
| `required` | Mostra `*` e acrescenta a indicação de obrigatório ao nome acessível. Não valida o valor. |
| `requiredLabel` | Texto anunciado para obrigatório; por omissão `Obrigatório`. Permite localização. |
| `helperText` | Informação complementar visível, também fornecida como ajuda acessível. |
| `error` | Mensagem de erro não vazia. Substitui a ajuda visível e é encaminhada para o controlo; o consumidor decide quando existe erro. |
| `disabled` | Configura a etiqueta e é encaminhado para o controlo. O controlo deve impedir a interação. |
| `children` | Função que recebe `accessibilityLabel`, `accessibilityHint`, `error` e `disabled`. Deve aplicar estes dados ao controlo apropriado. |
| `style` | Ajustes locais do contentor, como margem ou largura. |

Não há tamanho ou estado de foco próprios: esses pertencem ao controlo, por exemplo `size` no TextField e foco nativo. A mensagem de erro é texto visível além da cor. As linhas podem crescer e quebrar em ecrãs estreitos e com fontes ampliadas. A composição não anuncia alterações automaticamente; o consumidor deve escolher uma estratégia de anúncio apropriada ao fluxo.

As demonstrações executáveis são exclusivamente locais e não entram no Git.

## Tema e correspondência com Figma

`AppTheme.formField` configura cores, fontes, tamanhos, alturas de linha e espaçamento. Os valores claros são: etiqueta `#1f2938`, etiqueta desativada e ajuda `#667385`, obrigatório e erro `#b42318`; etiqueta Inter Medium 14/20, mensagem Inter Regular 12/18, espaçamento 8. A largura cresce com o contentor. Os tamanhos e contornos do campo provêm do componente aninhado, que continua configurável pelo seu tema. A paleta escura pode ser fornecida pela aplicação.

## Verificação

Os [testes locais](../../src/shared/ui/FormField/FormField.test.tsx) cobrem composição com TextField, nome e ajuda acessíveis, obrigatório, erro, desativação, tema e conteúdo longo. Executam-se com `npm run test:components` e ficam fora do `test:ci` por preferência do utilizador. A validação em dispositivo e com leitores de ecrã deve ser registada no PR.
