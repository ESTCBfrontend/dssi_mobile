# MDS/Form

Superfície reutilizável para apresentar grupos de campos e ações de um formulário mobile. Implementação: [Form.tsx](../../src/shared/ui/Form/Form.tsx). Referências: [empilhado](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ?node-id=48-198) e [largo](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ?node-id=48-261).

## Utilização

Importa `Form` de `src/shared/ui/Form` dentro de `ThemeProvider` e compõe-o com [FormGroup](FormGroup.md), [FormField](FormField.md) e os controlos necessários. Os campos e valores são da responsabilidade da funcionalidade.

```tsx
<Form title="Dados" submitLabel="Guardar" onSubmit={guardar}
  onReset={limpar} pending={aGuardar} error={erroDoServidor}>
  <FormGroup>{campos}</FormGroup>
</Form>
```

`guardar`, `limpar`, `aGuardar`, `erroDoServidor` e `campos` são fornecidos pela composição. O componente não cria dados de exemplo, não valida nem envia pedidos.

## Propriedades

| Propriedade | Contrato |
| --- | --- |
| `title`, `description` | Título obrigatório, exposto como cabeçalho, e descrição opcional; não podem ser vazios quando fornecidos. |
| `children` | Grupos e campos fornecidos pelo consumidor. Mantêm-se montados durante `pending`. |
| `onSubmit`, `submitLabel` | Ação obrigatória e respetiva etiqueta. O callback não recebe valores automaticamente: lê-os do estado controlado da funcionalidade. |
| `onReset`, `resetLabel` | Ação opcional de limpeza ou cancelamento; o consumidor define o seu efeito. |
| `pending` | Bloqueia os botões e mostra o estado de carregamento no botão de submissão. Não desativa nem elimina os campos automaticamente. |
| `error`, `footerNote` | Mensagem de erro da operação e nota opcional junto das ações. Os erros de campos individuais continuam junto dos respetivos campos. |
| `layout` | `stacked` por omissão; `wide` coloca as ações lado a lado quando a largura do formulário atinge o limiar do tema. A disposição dos campos é controlada pelos grupos filhos. |
| `style`, `testID` | Personalização e identificador do contentor. |

## Acessibilidade, tema e validação

O conteúdo é percorrível, os toques nos controlos são mantidos quando o teclado está aberto e o iOS usa `KeyboardAvoidingView`. O ajuste ao teclado no Android depende da janela e da configuração nativa. O erro geral é exposto como aviso; o consumidor trata foco no primeiro erro e mensagens específicas.

`AppTheme.form` configura cor, tipografia, raio, espaçamento e limiar largo (640 pontos por omissão). O Figma usa raio 14, padding 18 no empilhado, título Inter SemiBold 22/30 e separador antes das ações; a superfície cresce com o conteúdo.

Os [testes locais](../../src/shared/ui/Form/Form.test.tsx) verificam submissão, bloqueio durante processamento, preservação dos campos e erro geral. Executam-se fora do CI com `npm run test:components`. Validar teclado, rotação, conteúdo longo, fonte ampliada e leitores de ecrã em Android e iOS.
