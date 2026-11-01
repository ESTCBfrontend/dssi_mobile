# MDS/TimePicker

Campo de hora controlado, com seletor nativo ou uma lista de horários disponibilizada pela aplicação. Implementação: [TimePicker.tsx](../../src/shared/ui/TimePicker/TimePicker.tsx). Referências Figma: [fechado](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ?node-id=177-3206), [aberto](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ?node-id=177-3211) e [erro](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ?node-id=177-3237).

## Utilização

Importa `TimePicker` de `src/shared/ui/TimePicker` dentro de `ThemeProvider`. A etiqueta e a mensagem usam [FormField](FormField.md).

```tsx
<TimePicker label="Hora" value={hora} onChange={setHora}
  availableSlots={horariosDisponiveis} clearable />
```

O valor é `HH:mm` em formato de 24 horas ou `null`. É uma hora local sem data ou fuso associado; o consumidor combina-a com a data e o fuso relevantes. `24:00`, minutos acima de 59 e limites invertidos são inválidos.

## Propriedades

| Propriedade | Contrato |
| --- | --- |
| `label`, `value`, `onChange` | Etiqueta, valor controlado e callback que recebe uma hora ou `null`. |
| `minTime`, `maxTime` | Limites inclusivos `HH:mm` no mesmo dia. Não representam intervalos que atravessem a meia-noite. |
| `availableSlots` | Lista opcional de horas fornecidas pelo consumidor. Quando presente, apresenta apenas os horários dentro dos limites; uma lista vazia indica ausência de horários. |
| `disabled`, `required`, `helperText`, `error` | Estados e mensagens do campo. A validação obrigatória e a disponibilidade real pertencem ao consumidor. |
| `placeholder`, `clearable` | Texto para valor vazio e ação opcional de limpar. |
| `safeAreaInsets`, `style`, `testID` | Margens dos painéis, estilo e identificador; o seletor nativo recebe o sufixo `-native`. |

## Interação e limites

Com `availableSlots`, o painel apresenta uma escolha exclusiva e nunca gera horários fictícios. Sem lista, usa o seletor nativo: no Android abre o diálogo do sistema e no iOS apresenta uma roda com confirmação. Ao cancelar não altera o valor. O seletor Android não suporta impor limites de horário diretamente: a seleção fora de `minTime`/`maxTime` é rejeitada, mantendo o valor anterior e mostrando uma mensagem. O mesmo controlo é aplicado antes de aceitar no iOS.

A disponibilidade e conflitos de equipa ou recurso não são determinados por este componente; devem ser verificados pela funcionalidade e pelo servidor quando aplicável. A apresentação nativa varia por plataforma.

## Tema e validação

Reutiliza `AppTheme.textField`, cores semânticas e o painel. O campo tem altura mínima de 48 pontos; os horários em lista têm área tátil mínima de 44 pontos. O Figma mostra horas exemplificativas, mas só são apresentadas horas fornecidas pelo consumidor.

Os [testes locais](../../src/shared/ui/TimePicker/TimePicker.test.tsx) verificam filtragem por limites, escolha e formato. Executam-se fora do CI com `npm run test:components`. Validar seletor nativo, relógio de 24 horas, limites, VoiceOver/TalkBack e ampliação de texto em Android e iOS.
