# TaskProgress

Apresenta o progresso de verificações a partir de `completed` e `total`, contagens inteiras não negativas com `completed <= total`. Não decide quais os resultados que contam como concluídos; essa regra é fornecida pela funcionalidade consumidora.

Uma lista vazia apresenta zero e o estado «Sem verificações». Apenas `total > 0` e `completed === total` mostra «Concluída». Quando uma percentagem arredondada atingiria 100 antes de todos os pontos estarem concluídos, apresenta 99 para evitar transmitir uma conclusão antecipada. `title`, `description` e `labels` permitem adaptar os textos.

Compõe `StatusBadge` e `ProgressBar`, com tokens `checklist` configuráveis e correspondência às variantes mobile `169:2801` e `169:2819` do Figma.
