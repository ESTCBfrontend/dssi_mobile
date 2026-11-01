# PhotoTile

Apresenta uma miniatura com nome e estado `ready`, `uploading` ou `error`. `photo` contém `id`, `name`, `uri` e `alt` opcionais; sem URI ou quando a imagem falha apresenta o marcador ilustrativo do Figma. `onOpen`, `onRemove` e `onRetry` são opcionais e recebem a fotografia. A seleção é controlada através de `selected`; nenhuma ação modifica dados internamente.

Durante `uploading`, `progress` é obrigatório e deve estar entre 0 e 100; a remoção fica indisponível. Os textos podem ser adaptados por `labels`. A imagem fornecida usa `cover`; com leitor de ecrã, o botão de abertura é identificado por `alt` ou pelo nome. A integração gere permissões, captura, carregamento e persistência.

Usa `StatusBadge` e `Button` com os tokens `media` configuráveis. O aspeto claro e as ilustrações seguem `159:2578`, `159:2588` e `159:2600` no Figma. A largura padrão é 154 pontos, podendo ser ajustada com `style`; a altura cresce com texto e ações.
