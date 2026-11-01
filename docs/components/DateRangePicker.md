# MDS/DateRangePicker

Intervalo controlado composto por dois [DatePicker](DatePicker.md), empilhados em mobile. Implementação: [DateRangePicker.tsx](../../src/shared/ui/DateRangePicker/DateRangePicker.tsx). Referências Figma: [vazio](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ?node-id=178-3220), [selecionado](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ?node-id=178-3237) e [erro](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ?node-id=178-3254).

## Utilização

Importa `DateRangePicker` e `DateRange` de `src/shared/ui/DateRangePicker` e usa dentro de `ThemeProvider`. Cada limite é uma data civil `YYYY-MM-DD` ou `null`.

```tsx
<DateRangePicker title="Período" value={periodo} onChange={setPeriodo}
  minDate="2026-01-01" maxDate="2026-12-31" />
```

O consumidor mantém `periodo` com a forma `{ start, end }`. Um intervalo parcialmente preenchido é permitido; cabe à funcionalidade decidir se ambos os limites são obrigatórios.

## Propriedades

| Propriedade | Contrato |
| --- | --- |
| `title`, `value`, `onChange` | Título, intervalo controlado e callback com o intervalo completo atualizado. O título e as datas fornecidas devem ser válidos. |
| `startLabel`, `endLabel` | Etiquetas dos campos; por omissão «Data inicial» e «Data final». |
| `minDate`, `maxDate`, `disabledDates` | Limites inclusivos e datas bloqueadas, encaminhados aos dois campos. Datas específicas são rejeitadas após a escolha, como explicado no DatePicker. |
| `disabled` | Desativa ambos os campos e a ação de limpar. |
| `error` | Mensagem externa visível; tem prioridade sobre o aviso automático para ordem inválida. |
| `safeAreaInsets`, `style`, `testID` | Margens dos painéis, estilo do contentor e identificador; os campos recebem os sufixos `-start` e `-end`. |

## Comportamento

O limite máximo do início acompanha o fim e o mínimo do fim acompanha o início, sem ultrapassar os limites globais. As duas datas podem ser iguais. Se o consumidor fornecer um intervalo invertido, é apresentado um erro sem descartar os valores; os campos continuam disponíveis para corrigir. A ação «Limpar período» emite ambos os valores como `null`. Um dia bloqueado não impede, por si só, um intervalo que o contenha; regras para períodos completos pertencem à funcionalidade.

## Tema e validação

O contentor usa `AppTheme.form`: fundo, contorno, raio e cores semânticas. O Figma usa padding 16, raio 14 e contorno de erro vermelho; os campos reutilizam o tema do DatePicker. Os [testes locais](../../src/shared/ui/DateRangePicker/DateRangePicker.test.tsx) verificam limpeza e apresentação de intervalo invertido; executam-se fora do CI com `npm run test:components`. Os seletores nativos, a ordem, os limites e a acessibilidade devem ser verificados em dispositivo Android e iOS.
