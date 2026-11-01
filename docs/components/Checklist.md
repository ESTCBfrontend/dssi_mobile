# Checklist

Lista virtualizada de pontos `ChecklistEntry`, com título, descrição opcional, progresso e ações opcionais. Os identificadores devem ser únicos. O consumidor fornece `isCompleted(item)`, a regra que determina se cada resultado conta para o progresso; o total e os concluídos são calculados a partir da mesma lista apresentada. A lista vazia não é considerada concluída.

`onItemChange(id, result)`, `onAddEvidence(item)`, `onSave` e `onSubmit` encaminham ações sem alterar dados, validar regras de negócio ou comunicar com serviços. `renderEvidence(item)` permite compor fotografias e anexos. `actions` aceita ações adicionais. Os textos são configuráveis através de `labels`, `itemLabels` e `progressLabels`; `disabled` bloqueia as ações fornecidas pelo componente.

Usa `FlatList`, `ChecklistItem`, `TaskProgress` e `Button`, segundo as variantes mobile `170:3002` e `170:3110` do Figma. A lista precisa de espaço vertical definido pelo contentor; evita inseri-la numa `ScrollView` vertical. A funcionalidade responsável decide a regra de conclusão, a validação, a persistência e a elegibilidade para submissão.
