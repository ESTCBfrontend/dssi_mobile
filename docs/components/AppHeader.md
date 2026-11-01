# MDS/AppHeader

Cabeçalho mobile reutilizável com título, contexto e espaços para marca e ações. Implementação: [AppHeader.tsx](../../src/shared/ui/AppHeader/AppHeader.tsx). Referência: [Figma mobile](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ?node-id=101-1130).

## Utilização

Importa `AppHeader` e `AppHeaderProps` de `src/shared/ui/AppHeader` e usa dentro de `ThemeProvider`. Pode ser passado ao slot `header` de [AppShell](AppShell.md).

```tsx
<AppHeader title="Serviços" subtitle="Área técnica"
  avatarText={iniciais} onProfilePress={abrirPerfil} />
```

O consumidor fornece a identidade e as ações. A marca, botões de voltar ou outras ações são elementos reais fornecidos nos slots; o componente não cria uma aplicação, conta ou destino fictício.

## Propriedades

| Propriedade | Contrato |
| --- | --- |
| `title`, `subtitle` | Título obrigatório e subtítulo opcional, não vazios quando fornecidos. O título é um cabeçalho acessível. |
| `mark`, `leading`, `trailing` | Elementos React Native opcionais para marca e ações antes ou depois do título. O consumidor fornece a acessibilidade e callbacks desses elementos. |
| `avatarText` | Texto opcional do avatar. Sem texto não é apresentada a área de perfil. |
| `onProfilePress`, `profileLabel` | Com `avatarText` e callback, apresenta um botão com nome acessível, «Perfil» por omissão. Sem callback, o avatar é apenas decorativo. |
| `style`, `testID` | Personalização e identificação do contentor. |

## Comportamento, tema e acessibilidade

O título e o subtítulo podem crescer; não se fixa a altura do cabeçalho. O botão de perfil tem área tátil mínima de 44 pontos. A composição é responsável por fornecer controlos acessíveis para voltar, ações adicionais e eventuais imagens de marca. As margens seguras exteriores são aplicadas pelo AppShell ou pela composição, não automaticamente pelo cabeçalho.

`AppTheme.navigation` configura superfície, contorno, cores, fontes e padding. O Figma usa altura 60, padding horizontal 16, título Inter SemiBold 15 e avatar de 32 pontos; a altura é mínima para suportar texto ampliado.

Os [testes locais](../../src/shared/ui/AppHeader/AppHeader.test.tsx) verificam título e ação de perfil, incluindo a ausência de uma ação fictícia. Executam-se com `npm run test:components`, fora do CI por decisão do utilizador. Validar texto ampliado, dispositivos estreitos, áreas seguras e leitores de ecrã em Android e iOS.
