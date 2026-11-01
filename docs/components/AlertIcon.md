# MDS/AlertIcon

Símbolo informativo circular para compor mensagens de informação, sucesso, atenção e erro. Não interpreta estados de negócio nem executa ações. Implementação: [AlertIcon.tsx](../../src/shared/ui/AlertIcon/AlertIcon.tsx). Referência: [Figma, nó 89:901](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ?node-id=89-901).

## Utilização e contrato

Importa `AlertIcon` de `src/shared/ui/AlertIcon`, ajustando o caminho ao consumidor, e utiliza-o dentro do `ThemeProvider` existente.

| Propriedade | Comportamento |
| --- | --- |
| `tone` | `info` (omissão), `success`, `warning` ou `danger`; escolhe símbolo e paleta. |
| `size` | Diâmetro em pontos, finito e maior que zero. Por omissão usa o tema: 30. O símbolo acompanha proporcionalmente o círculo. |
| `colorOverride` | Cor do fundo apenas nesta utilização; mantém o símbolo definido pelo tema. Cabe ao consumidor preservar o contraste. |
| `decorative` | `true` por omissão: oculto dos leitores de ecrã em Android e iOS. Usa junto de título e mensagem que comuniquem o significado. |
| `accessibilityLabel` | Obrigatória e não vazia quando `decorative={false}`; descreve o significado no contexto. Nesse modo existe um único elemento acessível com papel de imagem. |
| `style` | Estilo do contentor, útil para margens e alinhamento; prefere `size` e o tema para geometria e cores. |
| Integração nativa | `onLayout`, `nativeID` e `testID`. |

O contrato TypeScript exige o nome acessível no modo informativo, e a implementação rejeita nomes vazios em execução. O estado distingue-se também pela forma: `i`, visto, exclamação ou cruz. O componente não recebe ações nem captura toques e não necessita de uma área tátil mínima de botão.

O ícone é um recurso gráfico, não texto de leitura: a ampliação da fonte do sistema não altera o seu diâmetro. O texto adjacente deve continuar a crescer e a quebrar linhas; a composição deve reservar espaço para esse conteúdo. O consumidor pode aumentar o ícone com `size` ou através do tema.

As demonstrações executáveis são exclusivamente locais e não entram no Git.

## Tema e correspondência com Figma

`AppTheme.alertIcon` configura o diâmetro e as cores de fundo e símbolo por tom, independentemente do StatusBadge. Valores consultados em 31/10/2026:

| Tom | Fundo: `color/bg/status-*-solid` | Símbolo: `color/text/on-brand` | Nó do símbolo |
| --- | --- | --- | --- |
| info | `#175cd3` | `#ffffff` | `89:894` |
| success | `#166534` | `#ffffff` | `89:896` |
| warning | `#92400e` | `#ffffff` | `89:898` |
| danger | `#b42318` | `#ffffff` | `89:900` |

O círculo tem 30 pontos. Os símbolos originais usam Inter Semi Bold a 16; foram exportados do Figma como PNG transparente a 4× para preservar o desenho sem acrescentar uma biblioteca de ícones ou uma segunda fonte. As caixas originais medem 5×19, 15×19, 5×19 e 11×19 pontos, respetivamente. Os recursos em `src/shared/ui/AlertIcon/assets` são locais, sem pedidos de rede. O fundo é um círculo nativo e o `Image` aplica a cor semântica ao símbolo.

A resolução de exportação cobre o tamanho de referência até densidade 4×; ampliações muito superiores podem perder nitidez. O Figma consultado só publica a paleta clara; uma paleta escura é fornecida pela composição através do provider.

## Verificação

Os [testes locais](../../src/shared/ui/AlertIcon/AlertIcon.test.tsx) verificam decoração, nome acessível, erro de nome vazio, alteração dinâmica de estado, tema, personalização isolada e tamanhos inválidos. Executam-se com `npm run test:components` e ficam excluídos do `test:ci`, conforme a preferência do utilizador.

Os testes JavaScript não substituem a inspeção nativa nem a utilização com TalkBack ou VoiceOver. Os resultados de Android e as limitações de iOS são registados no PR.
