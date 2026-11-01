# MDS/StatusBadge

Etiqueta informativa para apresentar um estado, prioridade ou categoria fornecidos pelo consumidor. Não interpreta estados de negócio, não navega e não emite ações. Implementação: [StatusBadge.tsx](../../src/shared/ui/StatusBadge/StatusBadge.tsx). Referência: [Figma, nó 86:958](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ?node-id=86-958).

## Utilização e contrato

Importa `StatusBadge` de `src/shared/ui/StatusBadge`, ajustando o caminho ao módulo consumidor, e utiliza-o dentro do `ThemeProvider` existente. O consumidor fornece o texto e escolhe a apresentação adequada; não existem associações automáticas entre estados da aplicação e tons visuais.

| Propriedade | Comportamento |
| --- | --- |
| `label: string` | Obrigatória e não vazia; nome acessível e texto visível. |
| `tone` | `neutral` (omissão), `info`, `success`, `warning`, `danger`. |
| `variant` | `soft` (omissão) ou `solid`. |
| `size` | `small` ou `medium` (omissão mobile). |
| `showDot` | Ponto decorativo opcional; desligado por omissão. |
| `icon` | Elemento decorativo ou função `({ color, size }) => ReactNode`; quando produz conteúdo substitui o ponto. |
| `style`, `textStyle` | Personalização local de contentor e texto. Evita alturas rígidas e truncagem de informação essencial. |
| Acessibilidade | `accessibilityLabel`, `accessibilityHint` e `accessibilityLiveRegion` (omissão `none`). O anúncio de mudanças é opt-in, conforme o contexto consumidor. |
| Integração nativa | `onLayout`, `nativeID` e `testID`. |

O badge expõe a semântica de texto, sem comportamento de botão. Ponto e ícone são decorativos e não criam anúncios adicionais. A altura cresce com o conteúdo, a largura respeita o contentor e o texto pode quebrar linha, mantendo a ampliação de fonte nativa.

As demonstrações executáveis são exclusivamente locais e não entram no Git.

## Tema e correspondência com Figma

O componente usa `AppTheme.statusBadge`, acrescentado à base de tema existente. As paletas, a fonte, os tamanhos, o espaçamento e o raio são personalizáveis através do provider; `style` e `textStyle` permitem ajustes de uma utilização. A Inter Medium local é reutilizada, sem dependências adicionais.

Valores consultados em 31/10/2026. `tones` usa tokens semânticos do Figma; não são valores demonstrativos do guia.

| Tom | Fundo soft | Texto soft | Fundo solid | Texto solid |
| --- | --- | --- | --- | --- |
| neutral | `#e9edf3` | `#1f2938` | `#475569` | `#ffffff` |
| info | `#eff8ff` | `#175cd3` | `#175cd3` | `#ffffff` |
| success | `#def2e5` | `#166534` | `#166534` | `#ffffff` |
| warning | `#fff1d6` | `#92400e` | `#92400e` | `#ffffff` |
| danger | `#fee4e2` | `#b42318` | `#b42318` | `#ffffff` |

As origens são `color/bg/status-neutral`, `color/bg/info/success/warning/danger`, `color/text/primary/info/success/warning/danger`, `color/bg/status-*-solid` e `color/text/on-brand`.

Geometria: raio `radius/full = 999`, intervalo de 6 pontos; Small com altura mínima 24, padding horizontal 9, texto 11 e ponto 6; Medium com altura mínima 30, padding horizontal 12, texto 12 e ponto 7. O padding vertical de 4/6 permite crescimento; os ícones personalizados recebem a referência 12/14. Estas referências de ícones e o crescimento vertical adaptam o contrato dinâmico à plataforma.

Não é necessário impor uma área tátil de 44 pontos porque o badge é informativo. O ponto é uma primitiva circular nativa com cor obtida da paleta; não exige uma biblioteca de ícones. Uma paleta escura deve ser fornecida pela composição: o Figma consultado só define o tema claro.

## Verificação

Os [testes locais](../../src/shared/ui/StatusBadge/StatusBadge.test.tsx) verificam conteúdo livre, alteração de estado, semântica informativa, decorações, personalização, erro de rótulo vazio e contraste mínimo de 4,5:1 nas dez paletas iniciais. Executam-se com `npm run test:components`, juntamente com os testes locais anteriores, e ficam excluídos do `test:ci` conforme a preferência do utilizador.

Os testes JavaScript não medem layout nativo nem substituem a validação com leitores de ecrã. A validação Android e as limitações de iOS são reportadas no PR.
