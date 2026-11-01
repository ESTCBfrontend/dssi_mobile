# MDS/DatePicker

Campo de data controlado, com seletor nativo Android/iOS. Implementação: [DatePicker.tsx](../../src/shared/ui/DatePicker/DatePicker.tsx). Referências: [fechado](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ?node-id=176-3298), [aberto](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ?node-id=176-3303) e [erro](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ?node-id=176-3421).

## Utilização

Importa `DatePicker` de `src/shared/ui/DatePicker` dentro de `ThemeProvider`. O componente inclui a etiqueta e a mensagem através de [FormField](FormField.md); não é necessário envolver novamente o campo.

```tsx
<DatePicker label="Data" value={data} onChange={setData}
  minDate="2026-01-01" disabledDates={datasIndisponiveis} clearable />
```

O valor controlado é uma data civil `YYYY-MM-DD` ou `null`, não um instante UTC. A apresentação do campo é `DD/MM/AAAA`; a conversão usa o calendário local do dispositivo sem chamar `toISOString`. Datas impossíveis, como 2023-02-29, e limites invertidos são rejeitados.

## Propriedades

| Propriedade | Contrato |
| --- | --- |
| `label`, `value`, `onChange` | Etiqueta, data controlada ou `null` e callback que recebe a nova data ou `null`. |
| `minDate`, `maxDate` | Limites inclusivos `YYYY-MM-DD`; também são encaminhados ao seletor nativo. |
| `disabledDates` | Datas civis específicas a rejeitar, fornecidas pelo consumidor. A seleção nativa não as desativa visualmente: depois da escolha, uma data bloqueada é recusada e é apresentada uma mensagem. |
| `disabled`, `required`, `helperText`, `error` | Estados do campo e mensagens. `error` é gerido pelo consumidor; a indicação de obrigatório não valida o formulário por si só. |
| `placeholder`, `clearable` | Texto quando vazio e ação opcional de limpar. |
| `safeAreaInsets` | Margens seguras explícitas para o painel usado no iOS. |
| `style`, `testID` | Estilo do contentor e identificador do controlo; o seletor nativo recebe o sufixo `-native`. |

## Interação e limites

No Android abre o seletor do sistema. No iOS apresenta o seletor no painel existente e exige confirmação; cancelar não altera o valor. Um dia bloqueado ou fora dos limites não é enviado em `onChange`, e o valor anterior é preservado. O consumidor continua responsável por verificar disponibilidade e regras de negócio antes de guardar.

O campo usa localidade portuguesa na apresentação e solicita `pt-PT` ao seletor no iOS. O calendário nativo e a sua aparência podem variar consoante sistema, idioma e dispositivo. A dependência [`@react-native-community/datetimepicker`](https://docs.expo.dev/versions/v58.0.0/sdk/date-time-picker/) é incluída no Expo Go; a configuração do projeto declara o respetivo plugin para builds nativas.

## Tema e validação

Reutiliza `AppTheme.textField`, `FormField` e `DrawerSheet`; o controlo tem altura mínima de 48 pontos e cresce com o texto. O Figma usa contorno normal e de erro e apresenta o calendário como representação visual; no mobile é usado o controlo nativo.

Os [testes locais](../../src/shared/ui/DatePicker/DatePicker.test.tsx) cobrem datas civis, dia inválido, rejeição de data bloqueada e limpeza. Executam-se fora do CI com `npm run test:components`. Validar controlo nativo, mudança de fuso, limites, teclado, fonte ampliada, leitor de ecrã e áreas seguras em Android e iOS.
