# MDS/FileUpload

Seleção de documentos no dispositivo e apresentação de anexos controlados. Implementação: [FileUpload.tsx](../../src/shared/ui/FileUpload/FileUpload.tsx). Referências Figma mobile: [vazio](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ?node-id=157-2579), [selecionado](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ?node-id=157-2600), [envio](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ?node-id=157-2638) e [erro](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ?node-id=157-2680).

## Utilização

Importa `FileUpload`, `FileUploadProps` e `UploadEntry` de `src/shared/ui/FileUpload`, dentro de `ThemeProvider`. A aplicação mantém os anexos, atribui identificadores estáveis e executa o envio.

```tsx
<FileUpload title="Anexos" files={ficheiros} onAdd={adicionar}
  onRemove={remover} onRetry={repetir} accept={['application/pdf']}
  allowedExtensions={['pdf']} maxFiles={5} maxSizeBytes={10000000} />
```

Cada entrada contém `file` com o contrato de [AttachmentItem](AttachmentItem.md), `state` (`ready`, `uploading` ou `error`) e `progress` obrigatório entre 0 e 100 durante o envio. `onAdd` recebe os resultados originais do seletor Expo; não são criados identificadores nem enviados ficheiros automaticamente.

## Propriedades

| Propriedade | Contrato |
| --- | --- |
| `title`, `description` | Título obrigatório e descrição opcional não vazia. |
| `files`, `onAdd` | Entradas controladas e callback com `DocumentPickerAsset[]` apenas após seleção válida. Cancelar não chama o callback. |
| `onRemove`, `onOpen`, `onRetry` | Ações opcionais para cada anexo. Remoção e repetição são omitidas enquanto o componente está desativado ou a selecionar; o AttachmentItem também impede remover um envio em curso. |
| `accept` | Tipos MIME permitidos, incluindo padrões como `image/*`; os mesmos tipos são passados ao seletor do sistema. Se configurado, metadados MIME ausentes são rejeitados. |
| `allowedExtensions` | Extensões opcionais, com ou sem ponto, verificadas sem distinguir maiúsculas. Quando configurada juntamente com `accept`, ambas as condições têm de ser satisfeitas. |
| `maxFiles`, `maxSizeBytes` | Inteiros positivos opcionais. Uma seleção que exceda o número ou contenha um ficheiro acima do tamanho é rejeitada por completo; tamanho desconhecido também é rejeitado quando há limite. |
| `formatsHint`, `disabled`, `error` | Ajuda textual, bloqueio e erro externo opcional. Os erros de seleção são apresentados pelo componente. |
| `style`, `testID` | Estilo e identificação do contentor. |

## Interação e responsabilidades

O botão abre o seletor nativo através de [Expo DocumentPicker](https://docs.expo.dev/versions/v58.0.0/sdk/document-picker/), com seleção múltipla e cópia para a cache. A seleção, o cancelamento e os erros não fazem upload nem apagam dados. URIs de cache podem ser temporários; a aplicação decide como guardar e tratar os ficheiros. MIME e extensão são metadados fornecidos pelo sistema, não prova do conteúdo: o servidor deve voltar a validar formato, tamanho e autorização.

O componente usa o estado controlado mais recente ao receber uma seleção assíncrona. O consumidor gere operações concorrentes, a lista e os erros de rede. O controlo comunica erro em texto e expõe ações acessíveis; os itens são compostos com AttachmentItem.

## Tema e validação

`AppTheme.media` fornece cores, bordas e fontes. O Figma usa superfície com padding 16, raio 14, zona de seleção com raio 12 e ícone `Plus` original de 24 pontos. O conteúdo cresce com texto e largura disponíveis.

Os [testes locais](../../src/shared/ui/FileUpload/FileUpload.test.tsx) verificam cancelamento, formato e seleção válida com limite; usam um seletor simulado e executam-se fora do CI através de `npm run test:components`. Validar seletor, ficheiros de fornecedores externos, URIs, teclado, áreas seguras e leitores de ecrã em Android e iOS.
