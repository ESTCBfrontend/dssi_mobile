# MDS/ImagePicker

Escolha de fotografias da galeria ou câmara, com grelha controlada de [PhotoTile](PhotoTile.md). Implementação: [ImagePicker.tsx](../../src/shared/ui/ImagePicker/ImagePicker.tsx). Referências: [vazio mobile](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ?node-id=160-2658) e [selecionado mobile](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ?node-id=160-2684).

## Utilização

Importa `ImagePicker`, `ImagePickerProps` e `ImageEntry` de `src/shared/ui/ImagePicker`, dentro de `ThemeProvider`.

```tsx
<ImagePicker title="Fotografias" photos={fotografias}
  onAdd={adicionarFotografias} onRemove={removerFotografia}
  allowCamera maxFiles={8} />
```

A aplicação mantém a lista e atribui identificadores. Cada entrada contém `photo`, `state` (`ready`, `uploading` ou `error`), `progress` obrigatório entre 0 e 100 durante envio e `selected` opcional.

## Propriedades

| Propriedade | Contrato |
| --- | --- |
| `title`, `description` | Título obrigatório e descrição opcional não vazia. |
| `photos`, `onAdd` | Lista controlada e callback com `ImagePickerAsset[]` e origem `gallery` ou `camera`; cancelar não chama o callback. |
| `onRemove`, `onOpen`, `onRetry` | Ações opcionais sobre fotografias. O PhotoTile não permite remoção durante envio; remoção e repetição são omitidas enquanto o seletor está bloqueado. |
| `allowCamera` | Mostra a ação de fotografar; por omissão `false`. A permissão é pedida apenas quando o utilizador aciona a câmara. |
| `maxFiles` | Número máximo positivo opcional. Seleções que ultrapassem o limite são rejeitadas por completo. |
| `disabled`, `error`, `formatsHint` | Bloqueio, erro externo e ajuda opcional; erros do seletor ou recusa de permissão são apresentados em texto. |
| `style`, `testID` | Personalização e identificação do contentor. |

## Permissões e responsabilidades

Usa [Expo ImagePicker](https://docs.expo.dev/versions/v58.0.0/sdk/imagepicker/): galeria com seleção múltipla de imagens e câmara opcional. As permissões nativas de fotografia e câmara são configuradas no projeto; o plugin bloqueia a permissão de microfone. A câmara exige permissão concedida e dispositivo apropriado. O componente não grava, envia, comprime nem valida o conteúdo no servidor; a funcionalidade trata URIs temporários, autorização e regras adicionais.

Em Android o sistema pode destruir a atividade durante a seleção. A aplicação deve tratar a recuperação através de `getPendingResultAsync` do Expo quando integrar o fluxo; este componente não recupera automaticamente o resultado. A grelha quebra linha e os dados são controlados pelo consumidor.

## Tema e validação

`AppTheme.media` define cores e fontes; o Figma usa padding 16, intervalo 14 e miniaturas compostas por PhotoTile. O estado vazio usa o ícone original `Plus` de 24 pontos.

Os [testes locais](../../src/shared/ui/ImagePicker/ImagePicker.test.tsx) simulam a recusa de permissão e a seleção da galeria. Executam-se fora do CI com `npm run test:components`. Validar em dispositivos Android e iOS a galeria, câmara física, permissões, recuperação após destruição da atividade, ficheiros e leitores de ecrã.
