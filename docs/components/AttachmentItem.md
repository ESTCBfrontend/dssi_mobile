# AttachmentItem

Apresenta um anexo em formato empilhado mobile, com nome, detalhes e estado `ready`, `uploading` ou `error`. A pré-visualização de fotografias usa `uri` quando fornecida. O consumidor fornece os dados e gere abertura, remoção, nova tentativa e transferência; os callbacks não alteram o estado por si.

`file` contém `id`, `name`, `details`, `kind` (`document` ou `photo`) e `uri` opcional. Durante `uploading`, `progress` é obrigatório e deve estar entre 0 e 100. `onOpen`, `onRemove` e `onRetry` são opcionais; a remoção fica indisponível durante o envio. Os textos podem ser substituídos por `labels` e `uploadingDetails`.

Usa `StatusBadge`, `ProgressBar` e `Button`, com tokens `media` no tema. As medidas e cores claras seguem as variantes empilhadas do Figma `156:2397`, `156:2413`, `156:2435` e `156:2452`. O ícone de remoção e o marcador de fotografia são recursos originais do Figma. A validação de tipo, tamanho, URI e permissões pertence à integração que recebe o ficheiro.
