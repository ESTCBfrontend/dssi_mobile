# ChecklistItem

Apresenta um ponto de verificação com `id`, `title`, `result` e, opcionalmente, `description` e `note`. Os resultados são distintos: `pending`, `pass`, `fail` e `notTested`. `step` é a identificação visível do ponto.

Quando recebe `onChange`, o botão Registar/Editar abre um grupo de opções exclusivas acessíveis; a escolha chama `onChange(result)`. O resultado continua controlado pelo consumidor. Sem callback, o componente é apenas informativo. `disabled` impede alterações e adição de evidência. O slot `evidence` aceita composição, por exemplo `PhotoTile` ou `AttachmentItem`; `onAddEvidence` é opcional e não executa captura ou upload.

Os textos podem ser personalizados em `labels`. A apresentação usa `StatusBadge`, `Button`, `RadioGroup` e os tokens configuráveis `checklist`, a partir das variantes mobile `168:2815`, `168:2835`, `168:2855` e `168:2875` do Figma. Requisitos sobre notas, evidências e validação pertencem à funcionalidade que usa o componente.
