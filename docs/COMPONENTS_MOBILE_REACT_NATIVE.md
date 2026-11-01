# MDS — Especificação de Componentes para Agentes de Código

> **Plataforma:** React Native Mobile\
> **Linguagem:** TypeScript / TSX\
> **Papel:** contrato de implementação e validação destinado a um agente de programação (Codex, Claude Code, Cursor, Cline ou equivalente).\
> **Projeto:** Mestrado em Engenharia Informática — Metodologias de Desenvolvimento de Software, 2026/2027.\
> **Última revisão documental:** 31/10/2026.\
> **Figma de referência:** [MDS — Wireframes da Aplicação](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ/MDS-%E2%80%94-Wireframes-da-Aplica%C3%A7%C3%A3o), página `00 — Design System`.

## 0. Como usar este guia no projeto

Este documento foi incorporado a partir de `COMPONENTS_MOBILE_REACT_NATIVE.md`, fornecido pelo utilizador. É uma referência partilhada para colaboradores e agentes ao criar, alterar ou reutilizar componentes React Native Mobile. A sua inclusão não implementa componentes nem aprova automaticamente todas as propostas técnicas que contém.

- **Ler em conjunto:** [AGENTS.md](../AGENTS.md), [README.md](../README.md), [CONTRIBUTING.md](../CONTRIBUTING.md) e [architecture.md](architecture.md). As instruções explícitas do utilizador e as decisões aprovadas do projeto prevalecem sobre exemplos ou sugestões deste guia. Novas decisões transversais seguem o processo de proposta e aprovação do projeto.
- **Estado atual:** nesta inclusão, a aplicação é uma base React Native, Expo e TypeScript; o catálogo não é um inventário de componentes já disponíveis em código. Inspeciona sempre a implementação existente antes de reutilizar ou criar uma API.
- **Âmbito:** consulta a ficha `MDS/<Nome>` da secção 9, os componentes de que depende e as secções transversais aplicáveis. Implementa apenas o âmbito da tarefa. Este guia não autoriza alterações ao repositório Web.
- **Propostas:** props, tipos de domínio, organização de pastas, `ThemeProvider`, modos de tema, adaptadores e dependências são referências a avaliar no contexto da tarefa, não escolhas globais aprovadas pela importação. Os caminhos dos exemplos devem seguir a arquitetura aprovada; não criam uma estrutura paralela.
- **Fontes:** as afirmações de consulta ao Figma e aos PDFs pertencem ao documento fornecido. Não foram revalidadas nesta inclusão. Os PDFs não estão incluídos no repositório; os seus nomes e códigos de backlog servem como referências de origem, não como requisitos de negócio já aprovados.
- **Validação proporcional:** aplica os critérios de comportamento, acessibilidade e testes relevantes para o componente e para o risco da alteração. Os snippets são ilustrativos, não implementações prontas a copiar. Testes JavaScript e a exportação Android não substituem validação nativa, em dispositivo ou em iOS.

**Exemplos executáveis:** as demonstrações de componentes são apenas locais e não entram nos commits ou PRs. A documentação versionada mantém os contratos e as instruções de utilização.

**Implementações disponíveis:** [MDS/Button](components/Button.md), [MDS/StatusBadge](components/StatusBadge.md), [MDS/AlertIcon](components/AlertIcon.md), [MDS/TextField](components/TextField.md), [MDS/FormField](components/FormField.md), [MDS/Checkbox](components/Checkbox.md), [MDS/Radio](components/Radio.md), [MDS/RadioGroup](components/RadioGroup.md), [MDS/Switch](components/Switch.md), [MDS/CheckboxGroup](components/CheckboxGroup.md), [MDS/ProgressBar](components/ProgressBar.md), [MDS/LoadingIndicator](components/LoadingIndicator.md), [MDS/Textarea](components/Textarea.md), [MDS/Alert](components/Alert.md), [MDS/Card](components/Card.md) e [MDS/ContentPanel](components/ContentPanel.md). As fichas de utilização documentam os contratos efetivos; as restantes famílias do catálogo continuam como referência para implementação incremental.

Percurso de leitura: contexto e responsabilidades (secções 1–3), tema e contratos (4–7), execução e catálogo (8–9), integração e conclusão (10–13), fontes (14).

## 1. Missão e instruções para tarefas de componentes

**Constrói uma biblioteca de componentes realmente utilizáveis, tipados, compostos e personalizáveis.** Não transformes as imagens do Figma em componentes de tamanho fixo; o Figma é a **referência visual e estrutural**, enquanto este documento descreve o **comportamento a implementar em código**.

**Antes de escrever código:**

1. Inspeciona o projeto (`package.json`, estrutura, roteamento, tema, testes, lint, versão do React e dependências instaladas). **Não substituas** uma infraestrutura existente sem razão validada.
2. Identifica o componente solicitado pelo nome exato `MDS/<Nome>` da secção 9, consulta a finalidade, propriedades, variantes, composição e critérios de teste.
3. Examina as variantes relevantes na página Figma, quando tiveres acesso. Se não tiveres, utiliza os contratos deste ficheiro e assinala o que requer comparação visual posterior; **não inventes** coordenadas ou valores de tokens.
4. Reutiliza átomos e componentes existentes. Evita duplicar `Button`, `Card`, `StatusBadge`, `FormField`, `ProgressBar`, etc.
5. Implementa os estados reais (valor, alteração, loading, erro, vazio, disabled), não apenas o aspeto. Usa dados de exemplo **somente** em stories, fixtures e testes.
6. Cria ou atualiza documentação de utilização, testes e exemplos de composição. Confirma alinhamento, responsividade e acessibilidade antes de marcar a tarefa como concluída.
7. Se um requisito de negócio não estiver validado, deixa-o configurável; identifica a hipótese em vez de inventares uma regra ou um endpoint.

**Regras que não podem ser quebradas:**

- Um componente base **não** conhece um cliente, técnico, ordem ou equipamento específico. Recebe os dados por propriedades tipadas.
- **Não** impor larguras/alturas rígidas em contentores de conteúdo: estes crescem e aceitam filhos; exceções só para controlos e elementos gráficos de dimensões deliberadas.
- **Não** usar cores HEX fixas dentro dos componentes. Usa tokens semânticos e disponibiliza overrides controlados.
- **Não** misturar responsabilidades visuais com API, armazenamento, permissões e regras de negócio; usa callbacks, modelos e adaptadores.
- **Não** assumir APIs PHC, permissões, preços, dados reais, conectividade ou funcionalidades não aprovadas.
- **Não** substituir elementos interativos por `div`/`View` passivos sem comportamento acessível.
- **Não** criar dependências externas apenas para reproduzir uma ilustração Figma; primeiro reutiliza o que está instalado.
- **Não** refazer as 53 famílias de uma vez se a tarefa pedir apenas uma; trabalha por etapas, sempre compiláveis e testáveis.

## 2. Origem e âmbito: o que é requisito vs. proposta

**Enunciado:** `MDS_Projeto_Pratico_2026-2027_REV06.pdf`. Pede uma solução empresarial integrada, desenvolvida por duas equipas coordenadas através de Scrum, considerando cenários móveis, qualidade gráfica, integração e testes. A escolha de tecnologias deve ser proposta e fundamentada.

**Necessidades iniciais do PO:** `MDS_Draft_Product_Backlog_ENTREGA_01_CONCRETA_V03.pdf`, 80 necessidades em 16 áreas. **É um draft de necessidades, não um conjunto de requisitos técnicos aprovados.** O PO/docente decide prioridades e o âmbito com as equipas. Protótipos devem usar dados fictícios; ligação ao ERP PHC é exploratória e não deve ser simulada como integração real.

**Fluxo de referência:** proposta aceite → preparação/agendamento → logística → execução no terreno e registo → revisão pelo escritório → tratamento administrativo. Esta biblioteca tem de servir **um único produto integrado**, com modelos coerentes entre Web e Mobile, mas implementações e UX próprias de cada plataforma.

**Fonte Figma:** inventário verificado da página de design: **53 famílias** de `MDS/*`, listadas integralmente na secção 9. A correspondência de nomes/variantes foi consultada no Figma; **as props TypeScript propostas neste guia são contratos de implementação sugeridos, não propriedades já existentes em código**.

## 3. Arquitetura mínima e reutilização

As responsabilidades abaixo seguem [architecture.md](architecture.md). Cria apenas as pastas necessárias à tarefa:

- `shared/ui`: elementos visuais realmente partilhados, primitivos ou compostos (`Button`, `TextField`, `Card`, `DataTable`, etc.). Tokens e tema partilhados podem ficar junto desta apresentação; a solução concreta depende da tarefa.
- `features/<funcionalidade>/presentation`: ecrãs, componentes e hooks específicos (`ServiceOrderCard`, `Checklist`, `AssignmentPanel`, etc.), sem copiar a implementação visual do `Card`.
- `features/<funcionalidade>/domain` e `application`: regras de negócio e coordenação dos casos de uso, quando necessárias, independentes de React Native e Expo. Os contratos ficam junto de quem define a necessidade.
- `features/<funcionalidade>/infrastructure`: integrações concretas e adaptadores nativos; `shared/infrastructure` apenas para mecanismos técnicos com utilização transversal demonstrada. `app` faz a composição e ligação das dependências. Não criar estas camadas quando não houver responsabilidades que as justifiquem.

Modelo de propriedade: **dados → visualização → eventos → camada de aplicação**. Os componentes não importam clientes HTTP nem fazem chamadas à rede diretamente, salvo adaptadores especializados explicitamente documentados.

**Controlled por omissão quando há dados externos:** `value`/`onChange`, `open`/`onOpenChange`, `selectedId`/`onSelect`, `items`/`onItemChange`. Suporta `defaultValue` e estado interno apenas quando necessário e quando o contrato distingue claramente os dois modos. Nunca alternes silenciosamente entre controlado e não controlado durante a vida da instância.

### 3.1 Contratos de domínio partilháveis

```ts
export type ID = string;
export type ISODate = string; // yyyy-MM-dd (não data formatada)
export type HHmm = string; // HH:mm, formato de 24 horas
export type FeedbackTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';
export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';
export type ChecklistResult = 'pending' | 'pass' | 'fail' | 'notTested';
export type ServiceOrderStatus = 'planned' | 'active' | 'pending' | 'completed' | 'cancelled';

export interface SelectOption<T extends string = string> {
  value: T;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface FileAttachment {
  id: ID;
  name: string;
  mimeType: string;
  sizeBytes: number;
  uri?: string; // URI local ou remota; não é um identificador de autorização
  status: 'ready' | 'uploading' | 'error';
  progress?: number; // 0..100
}

export interface ChecklistEntry {
  id: ID;
  title: string;
  description?: string;
  required?: boolean;
  result: ChecklistResult;
  note?: string;
  attachments?: FileAttachment[];
}

export interface ActivityEvent {
  id: ID;
  serviceOrderId: ID;
  authorId?: ID;
  authorLabel: string;
  occurredAt: string; // timestamp ISO-8601 com timezone
  type: 'status' | 'assignment' | 'comment' | 'completion';
  title: string;
  description?: string;
}

export interface ServiceOrderSummary {
  id: ID;
  reference: string;
  clientId: ID;
  siteId: ID;
  status: ServiceOrderStatus;
  scheduledAt?: string; // instante ISO-8601 com timezone
  assignedTeamId?: ID;
  assignedTechnicianId?: ID;
}
```

Estes são tipos **propostos para integração**, não um modelo de base de dados imposto pelo enunciado. Mantém as versões partilhadas entre os dois projetos e estabelece uma estratégia de evolução coordenada; evita dois enums diferentes para o mesmo estado.

## 4. Tokens, tema e personalização

### 4.1 Hierarquia de precedência

1. **Tokens semânticos do tema ativo** (padrão).
2. **`variant`/`tone`/`size`/`density`** para o aspeto pretendido.
3. **Overrides explícitos e tipados** para um caso local (`backgroundColor`, `textColor`, `borderRadius`, `style`/`className` conforme a plataforma).
4. **Slots/filhos** para alterar a composição sem criar uma nova versão rígida do componente.

Cria aliases semânticos em vez de valores por componente:

| Categoria | Exemplos de tokens lógicos |
|---|---|
| Fundo | `bg.page`, `bg.surface`, `bg.subtle`, `bg.brand`, `bg.inputDisabled` |
| Texto | `text.primary`, `text.secondary`, `text.disabled`, `text.onBrand`, `text.danger` |
| Bordas | `border.default`, `border.strong`, `border.focus`, `border.error` |
| Estados | `status.info`, `status.success`, `status.warning`, `status.danger` |
| Geometria | `space.1..8`, `radius.sm/md/lg/xl`, `controlHeight.sm/md/lg` |
| Tipografia | `font.body`, `font.label`, `font.title`, `font.caption`, `font.weight.*` |
| Elevação | `shadow.surface`, `shadow.overlay` |

A correspondência com variáveis de cor do Figma deve ser feita **por mapeamento explícito** (e não por copiar valores HEX a partir de screenshots). Caso o projeto já tenha nomes/tokens, mantém-nos; documenta equivalências em vez de criar coleções paralelas.

### 4.2 Requisitos de tema

- Suportar `light`, `dark` e um modo `system`, se aplicável à plataforma.
- Variantes de cor, fontes, raios, densidade e espaçamento alteram a apresentação sem alterar a lógica.
- Estados com cor semântica têm também texto/ícone; respeitar contraste.
- O componente deve aceitar tema **do contexto** e overrides locais, sem precisar de um novo ficheiro CSS/StyleSheet por caso.
- Um `children`/slot personalizado não perde o espaçamento do contentor nem fica cortado por alterações de conteúdo.

### 4.3 Variáveis do Figma confirmadas (nomes reais)

O inventário da página `00 — Design System` contém variáveis com estes nomes; **não** confundir estes nomes reais com os tokens lógicos exemplificativos apresentados na tabela anterior:

- **Fundo e ações:** `color/bg/page`, `color/bg/surface`, `color/bg/subtle`, `color/bg/brand`, `color/bg/brand-hover`, `color/bg/input-disabled`, `color/bg/action-secondary`, `color/bg/action-danger`.
- **Texto:** `color/text/primary`, `color/text/secondary`, `color/text/on-brand`, `color/text/brand`, `color/text/placeholder`, `color/text/disabled`, `color/text/danger`, `color/text/success`, `color/text/warning`.
- **Bordas e ícones:** `color/border/default`, `color/border/strong`, `color/border/focus`, `color/border/error`, `color/icon/default`, `color/icon/brand`.
- **Estados sólidos:** `color/bg/status-neutral-solid`, `color/bg/status-info-solid`, `color/bg/status-success-solid`, `color/bg/status-warning-solid`, `color/bg/status-danger-solid`.
- **Espaçamento e raios:** `spacing/0`, `spacing/1`, `spacing/2`, `spacing/3`, `spacing/4`, `spacing/5`, `spacing/6`, `spacing/8`, `spacing/10`, `spacing/12`; `radius/none`, `radius/sm`, `radius/md`, `radius/lg`, `radius/xl`, `radius/full`.

O agente deve **consultar os valores atuais no Figma**, respeitando os modos da coleção e aliases, antes de converter tokens para CSS ou TypeScript; as cores demonstrativas dos exemplos de código não prevalecem sobre esses valores.

## 5. Contrato mínimo para QUALQUER componente

Regista e implementa, no mínimo:

1. **Finalidade** e casos de utilização; nível (`primitivo`, `composto`, `domínio`).
2. **Props** tipadas, defaults seguros, valores opcionais e event handlers.
3. **Variantes** visuais coerentes com o Figma, estados reais e comportamento em erro/sem dados.
4. **Composição** (`children`, `header`, `footer`, `actions`, `leading`, `trailing`, `renderItem` ou slots equivalentes), apenas quando aplicável.
5. **Personalização** por tema + `size`, `variant`, `tone` e override de estilos.
6. **Layout** fluido e teste com textos longos, 0/1/N elementos, visualização pequena/grande e conteúdo de terceiros.
7. **Acessibilidade** e operações de teclado/toque para a plataforma.
8. **Testes** e exemplo de utilização; documentação do contrato, estados e dependências.

Um componente não é considerado pronto porque corresponde visualmente a uma única variante no Figma. Tem de funcionar com **valores novos e conteúdo novo**.

## 6. Regras específicas — React Native para Mobile

### 6.1 Tecnologias e decisões de implementação

- **React Native + TypeScript**. Confirmar **antes de começar** se o projeto usa Expo ou React Native CLI, qual a versão, router e dependências instaladas.
- Estilos com **`StyleSheet.create` e tokens TypeScript**; aceitar `StyleProp<ViewStyle>` e `StyleProp<TextStyle>` em áreas apropriadas. Nunca assumir que classes CSS ou elementos HTML existem no React Native.
- Reutilizar `Pressable`, `TextInput`, `ScrollView`, `FlatList`, `Modal`, `ActivityIndicator`, `Switch`, `Image` quando adequados. Para navegação, camera, ficheiros, date/time picker, safe-area, sheets ou animação, usar preferencialmente adapters sobre **bibliotecas já existentes**; se faltar uma dependência, propõe e justifica antes de instalar.
- Distinguir **componentes de UI** de **adapters nativos**: `CameraAdapter`, `DocumentPickerAdapter`, `DateTimePickerAdapter`, `NavigationAdapter`, `LocalDraftStore`. Não chamar APIs de dispositivo dentro de um `Card` ou `Button` genérico.
- Ter atenção à gestão de teclado, plataformas iOS/Android, barras de sistema, orientação, tamanhos de fonte e falhas de rede.

Exemplo de localização segundo [architecture.md](architecture.md); os nomes de funcionalidades são ilustrativos e não representam pastas existentes. As restantes camadas seguem a arquitetura geral e só são criadas quando necessárias:

```text
src/
  app/                    # Composição e ligação das dependências
  features/
    service-orders/presentation/{components,screens}/
    technicians/presentation/{components,screens}/
    checklist/presentation/{components,screens}/
    equipment/presentation/{components,screens}/
    attachments/
      presentation/components/
      infrastructure/     # Adaptadores concretos de ficheiros/câmara, se necessários
    planning/presentation/{components,screens}/
  shared/
    ui/
      theme/              # Tokens/tema, se necessários e partilhados
      Button/
      Card/
      FormField/
    infrastructure/       # Mecanismos técnicos realmente transversais
```

### 6.2 Tokens dinâmicos e temas

```ts
// Valores ILUSTRATIVOS; mapear a paleta real do Figma antes da entrega final.
export const palette = {
  light: {
    bg: { page: '#F7F9FC', surface: '#FFFFFF', subtle: '#EEF2F7' },
    text: { primary: '#172337', secondary: '#576577', onBrand: '#FFFFFF' },
    brand: '#2463AE', border: '#D9E1EA', danger: '#B42318',
  },
  dark: {
    bg: { page: '#111722', surface: '#1B2635', subtle: '#263346' },
    text: { primary: '#F4F7FC', secondary: '#C4D0DF', onBrand: '#FFFFFF' },
    brand: '#77AEF2', border: '#45566B', danger: '#FF9991',
  },
} as const;

export type AppTheme = {
  colors: typeof palette.light | typeof palette.dark;
  spacing: { xs: number; sm: number; md: number; lg: number; xl: number };
  radius: { sm: number; md: number; lg: number };
  controlHeight: { sm: number; md: number; lg: number };
};
```

O `ThemeProvider` resolve `useColorScheme()` e preferência explícita de utilizador (`system|light|dark`). Não criar um objeto de tema diferente por ecrã. Overrides locais recebem `theme`/`style` sem quebrar modo escuro ou tipografia.

Exemplo funcional **de arquitetura** de um botão (não substitui testes/acessibilidade do projeto):

```tsx
import React from 'react';
import { Pressable, Text, StyleSheet, type StyleProp, type ViewStyle, type TextStyle } from 'react-native';

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

export function Button({
  title, onPress, variant = 'primary', size = 'medium',
  disabled = false, loading = false, fullWidth = false,
  containerStyle, textStyle,
}: ButtonProps) {
  const { colors } = useTheme(); // hook de tema a definir/importar; localização exemplificativa: src/shared/ui/theme
  const locked = disabled || loading;
  const backgroundColor = variant === 'primary' ? colors.brand : colors.bg.surface;
  const foreground = variant === 'primary' ? colors.text.onBrand : colors.text.primary;

  return (
    <Pressable
      onPress={onPress}
      disabled={locked}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: locked, busy: loading }}
      hitSlop={4}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor, opacity: locked ? 0.48 : pressed ? 0.82 : 1 },
        { minHeight: size === 'large' ? 52 : 44 },
        fullWidth && styles.fullWidth,
        containerStyle,
      ]}
    >
      <Text style={[styles.label, { color: foreground }, textStyle]}>
        {loading ? 'A processar…' : title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { minHeight: 44, paddingHorizontal: 16, borderRadius: 10,
          alignItems: 'center', justifyContent: 'center' },
  label: { fontSize: 15, fontWeight: '600', textAlign: 'center' },
  fullWidth: { alignSelf: 'stretch' },
});
```

**Dependência assumida no exemplo:** `useTheme` é o hook que o agente terá de criar/importar na base do projeto. Para `outline`, `secondary` e `danger`, implementar **tokens próprios de fundo/borda/texto**; o snippet demonstra a separação de responsabilidades e não é a implementação completa das quatro variantes.

### 6.3 Composição e contentores dinâmicos

```tsx
import React from 'react';
import { View, Text, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

type CardProps = {
  title?: string;
  subtitle?: string;
  status?: React.ReactNode;
  actions?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function Card({ title, subtitle, status, actions, footer, children, style }: CardProps) {
  const { colors } = useTheme(); // contexto do projeto
  return (
    <View style={[styles.card, { backgroundColor: colors.bg.surface }, style]}>
      {(title || subtitle || status) && (
        <View style={styles.header}>
          <View style={styles.heading}>
            {title ? <Text style={styles.title}>{title}</Text> : null}
            {subtitle ? <Text>{subtitle}</Text> : null}
          </View>
          {status}
        </View>
      )}
      <View style={styles.content}>{children}</View>
      {(actions || footer) && <View style={styles.footer}>{actions}{footer}</View>}
    </View>
  );
}
const styles = StyleSheet.create({
  card: { padding: 16, borderRadius: 14, gap: 12 },
  header: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  heading: { flex: 1, minWidth: 0 },
  title: { fontSize: 16, fontWeight: '600' },
  content: { gap: 10 }, footer: { gap: 8 },
});
```

Notas: o `Card` em código final deve aplicar tokens também à cor dos textos; evitar `Text` com cor implícita que pode ficar ilegível no tema escuro. A personalização é feita com `children`, `status`, `actions`, `footer`, `style` e tokens, não com forks por cliente.

### 6.4 Boas práticas de ergonomia e acessibilidade

- Alvos interativos de **pelo menos 44 × 44 pontos lógicos** como política da biblioteca; `hitSlop` quando o ícone visível é menor.
- `Pressable` recebe `accessibilityRole`, `accessibilityLabel`, `accessibilityHint` e `accessibilityState` apenas quando apropriados; não inventar semântica de botão em texto informativo.
- Respeitar Dynamic Type / font scaling: evitar `allowFontScaling={false}` salvo exceções fundamentadas, testar texto 1,3–2x.
- `useWindowDimensions` para cálculos de layout ocasionais e breakpoints locais; preferir `flex`, `flexWrap`, `minWidth: 0` e layout orientado a conteúdo.
- A aplicação tem de lidar com **safe-area**, notch, barras do sistema, teclado aberto, orientação e scroll; não posicionar `Guardar` por coordenadas absolutas sobre o teclado.
- `FlatList`/`SectionList` para listagens e timelines longas, com `keyExtractor` estável e `renderItem` isolado.
- Testar VoiceOver (iOS), TalkBack (Android), modo claro/escuro e tamanhos de ecrã pequenos.
- Modais, bottom sheets e DatePicker nativo devem fechar previsivelmente, preservar dados e devolver foco quando aplicável.

### 6.5 Comportamento de integração do trabalho no terreno

- **Offline (MOB-07):** componentes apresentam estado do rascunho e sincronização, mas não criam fila/repositório por si. Essa responsabilidade pertence ao serviço `SyncQueue`/`StorageAdapter` quando o sprint aprovar a funcionalidade.
- **Fotografias (MOB-06):** `ImagePicker` obtém um resultado `PhotoAsset` através de adapter tipado; `PhotoTile` mostra estado, `AttachmentItem` identifica ficheiro, `FileUpload` gere seleção e callbacks.
- **Checklists (RST-02/03):** escolha `pass|fail|notTested|pending`; quando há falha ou teste não realizado, preservar motivo e anexos localmente até eventual sincronização.
- **QR (EQP-03):** a leitura pode propor um `equipmentId`, mas só a API autorizada decide o que o utilizador pode consultar.
- **Datas (PLN-01/02):** data ISO na lógica; hora local e timezone explícitos nos eventos, inclusive alterações de agenda.

### 6.6 Exemplo de utilização — mesma base visual, tarefas diferentes

```tsx
function OrderCard({ order, onOpen }: {
  order: ServiceOrderSummary;
  onOpen: (orderId: string) => void;
}) {
  return (
    <Card title={`OS ${order.reference}`}
          status={<StatusBadge label={order.status} tone="info" />}
          actions={<Button title="Abrir serviço" onPress={() => onOpen(order.id)} />}>
      <Text>Cliente: {order.clientId}</Text>
      <Text>Local: {order.siteId}</Text>
    </Card>
  );
}

function EquipmentCardExample({ id, name, onOpen }: {
  id: string; name: string; onOpen: (id: string) => void;
}) {
  return (
    <Card title={name}
          actions={<Button title="Ver equipamento" onPress={() => onOpen(id)} />}>
      <Text>Identificador: {id}</Text>
    </Card>
  );
}
```

**Dependências do snippet:** importar `Text` de `react-native`, `Card`, `Button`, `StatusBadge` do projeto; os seus contratos devem seguir este guia. Este exemplo ilustra composição, não é um ficheiro TSX autónomo.

### 6.7 Testes Mobile obrigatórios

- Testes de componente com a biblioteca já instalada (React Native Testing Library, se existir); fluxos críticos com E2E quando disponível.
- Android e iOS: **tamanho de texto maior, teclado aberto, dark/light, ecrã compacto, safe-area e TalkBack/VoiceOver**.
- Testar `Pressable` desativado/loading, `TextInput` longo, radio/checkbox, lista com 100+ registos, `Dialog`, `DrawerSheet`, `ImagePicker` e seleção de datas.
- Testar estados `offline`, `pendingSync`, `syncing`, `error`, `conflict` **apenas se existirem nas stories aprovadas**; nunca afirmar que um upload foi concluído só porque um Toast foi apresentado.
- Testar plataformas reais/emuladores que existam no projeto; documentar o que não foi possível executar.

## 7. Convenções de API, layout e gestão de estado

### 7.1 Props transversais propostas

```ts
import type { StyleProp, ViewStyle, TextStyle } from 'react-native';

export interface VisualProps {
  size?: 'small' | 'medium' | 'large';
  tone?: FeedbackTone;
  density?: 'compact' | 'comfortable';
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  testID?: string;
}

export interface AsyncActionState {
  pending?: boolean;
  error?: string | null;
  successMessage?: string;
}

export interface DateRangeValue {
  start: ISODate | null;
  end: ISODate | null;
}
```

**Não** herdar `VisualProps` indiscriminadamente: ícones podem precisar de `size` numérico; elementos de texto podem precisar de `StyleProp<TextStyle>`; componentes de seleção usam `value/onChange`; overlays usam `open/onClose`.

### 7.2 Preferências de implementação

- `onPress` para gestos de ação; `onChangeText` é próprio do `TextInput`, mas `TextField` pode oferecer `onChange(value: string)` como contrato de domínio.
- `children` recebe `React.ReactNode`; slots nomeados usam `header`, `actions`, `footer`, `emptyState` e `renderItem` quando necessário.
- `StyleProp<ViewStyle>`/`StyleProp<TextStyle>` separam overrides de contentor e texto. **Não** usar CSS `className` sem infraestrutura explicitamente instalada.
- `useMemo` não substitui medição real: primeiro construir de forma simples, otimizar quando houver listas grandes e evidência de problema.
- Listas usam ID estável; não usar o índice como chave de dados persistentes.
- `AppShell`/navegador são donos da navegação, não os cartões; `Button` e `Card` apenas disparam callbacks.
- Elementos com rede (sync/upload) recebem status e progress do serviço externo ao componente, inclusive quando offline.

## 8. Guia de execução por tarefa para o agente

```text
INPUT: componente MDS/NOME + User Story/AC (se existe) + contexto da screen.

1. Ler este ficheiro, MDS/NOME e dependências.
2. Inspecionar o projeto Expo/RN CLI, router, tema, UI kit, Figma e adapters.
3. Definir props tipadas, estados, eventos, slots e dados.
4. Criar componente RN usando View/Text/Pressable/TextInput/etc. e tokens.
5. Integrar adapter nativo existente quando há data/câmara/ficheiros/navegação.
6. Criar duas utilizações reais (ecrãs/contextos) sem copiar JSX do componente.
7. Testar iOS/Android quando possível; teclado, fonte, safe-area, tema, acessibilidade.
8. Executar lint, typecheck, testes e reportar o que realmente correu.

OUTPUT: alterações incrementais, verificáveis e sem supostas permissões ou APIs.
```

## 9. Catálogo de implementação — 53 famílias do Figma

Os nomes `MDS/*` e as famílias abaixo foram confirmados no Figma. As variantes descritas são as **combinações visuais relevantes**; o agente deve expor props adequadas ao runtime e **não** criar uma cópia de código por variante.

Cada ficha indica: (i) variantes de referência, (ii) contrato runtime sugerido, (iii) composição, (iv) regras da plataforma, (v) teste específico e (vi) necessidades do PO que justificam o caso de uso, ainda sujeitas a refinamento.

### 9.1 — Átomos (3 famílias)

#### `MDS/AlertIcon`
- **Figma / variantes:** tone: info|success|warning|danger.
- **API dinâmica a definir em TypeScript:** `tone, size?, colorOverride?, decorative?`.
- **Composição e reutilização:** Tokens de cor e ícones.
- **Específico Mobile:** Ícone vetorial/asset adequado à plataforma, accessibilityElementsHidden se decorativo.
- **Teste de aceitação mínimo:** Significado não depende apenas da cor.
- **Referências ao draft do PO:** CORE-05.

#### `MDS/Button`
- **Figma / variantes:** size: small|medium|large; style: primary|secondary|outline|danger; state: default|disabled.
- **API dinâmica a definir em TypeScript:** `children/label, iconStart?, iconEnd?, disabled?, loading?, onPress, fullWidth?`.
- **Composição e reutilização:** Tokens + LoadingIndicator.
- **Específico Mobile:** Pressable com minHeight 44, onPress, hitSlop, feedback pressed e loading.
- **Teste de aceitação mínimo:** Nenhum clique quando disabled/loading; teclado/leitor de ecrã.
- **Referências ao draft do PO:** CORE-05.

#### `MDS/StatusBadge`
- **Figma / variantes:** tone: neutral|info|success|warning|danger; style: soft|solid; size: small|medium.
- **API dinâmica a definir em TypeScript:** `label, tone?, variant?, showDot?, icon?`.
- **Composição e reutilização:** Tokens.
- **Específico Mobile:** View/Text acessível, não truncar estados essenciais.
- **Teste de aceitação mínimo:** Categorias semânticas e contraste para claro/escuro.
- **Referências ao draft do PO:** OS-05; RST-05.

### 9.2 — Formulários (14 famílias)

#### `MDS/Checkbox`
- **Figma / variantes:** size: compact|comfortable; state: default|focused|disabled; selection: unchecked|checked|mixed.
- **API dinâmica a definir em TypeScript:** `checked, indeterminate?, onChange, label, description?, disabled?`.
- **Composição e reutilização:** FormField.
- **Específico Mobile:** Pressable com accessibilityRole="checkbox", accessibilityState checked/mixed.
- **Teste de aceitação mínimo:** Não confundir com ChecklistItem, que tem quatro resultados.
- **Referências ao draft do PO:** RST-02; CORE-05.

#### `MDS/CheckboxGroup`
- **Figma / variantes:** layout: stacked|twoColumns; state: default|error.
- **API dinâmica a definir em TypeScript:** `options[], values[], onChange, label?, error?, disabled?`.
- **Composição e reutilização:** Checkbox + FormField.
- **Específico Mobile:** Grupo de checkboxes empilhado ou grelha em ecrã largo, error por texto.
- **Teste de aceitação mínimo:** Múltiplas escolhas funcionais e validadas.
- **Referências ao draft do PO:** CORE-05.

#### `MDS/DatePicker`
- **Figma / variantes:** viewport: web|mobile; state: closed|open|error.
- **API dinâmica a definir em TypeScript:** `label, value:ISODate|null, onChange, minDate?, maxDate?, disabledDates?, error?`.
- **Composição e reutilização:** FormField + calendário/seletor.
- **Específico Mobile:** Seletor nativo iOS/Android via dependência instalada/adaptador; não replicar calendário web.
- **Teste de aceitação mínimo:** Bloqueio de datas e valor normalizado YYYY-MM-DD.
- **Referências ao draft do PO:** PLN-01; OS-06; MT-02.

#### `MDS/DateRangePicker`
- **Figma / variantes:** viewport: web|mobile; state: empty|selected|error.
- **API dinâmica a definir em TypeScript:** `value:{start:ISODate|null,end:ISODate|null}, onChange, minDate?, maxDate?, error?`.
- **Composição e reutilização:** DatePicker × 2.
- **Específico Mobile:** Dois controlos empilhados ou fluxo passo a passo.
- **Teste de aceitação mínimo:** end >= start; limites; limpar intervalo.
- **Referências ao draft do PO:** OS-06; MT-02; PLN-01.

#### `MDS/Form`
- **Figma / variantes:** layout: stacked|wide.
- **API dinâmica a definir em TypeScript:** `initialValues?/values, onSubmit, onReset?, children, pending?, error?`.
- **Composição e reutilização:** FormGroup + Button + slots.
- **Específico Mobile:** KeyboardAvoidingView/ScrollView com submissão acessível.
- **Teste de aceitação mínimo:** Erros de campo e servidor; sem perder inputs no loading.
- **Referências ao draft do PO:** CORE-05.

#### `MDS/FormField`
- **Figma / variantes:** size: small|medium|large; state: default|focused|error|disabled.
- **API dinâmica a definir em TypeScript:** `label, required?, helperText?, error?, children, htmlFor/nativeId?`.
- **Composição e reutilização:** TextField / Select / Textarea / Switch.
- **Específico Mobile:** TextInput com accessibilityLabel e texto de erro adjacente.
- **Teste de aceitação mínimo:** Erro não depende só da cor.
- **Referências ao draft do PO:** CORE-05.

#### `MDS/FormGroup`
- **Figma / variantes:** layout: stacked|twoColumns.
- **API dinâmica a definir em TypeScript:** `title?, description?, children, columns?, actions?`.
- **Composição e reutilização:** FormField + ContentPanel.
- **Específico Mobile:** View em pilha e colunas apenas se espaço suficiente.
- **Teste de aceitação mínimo:** Conteúdo cresce sem overflow.
- **Referências ao draft do PO:** CORE-05.

#### `MDS/Radio`
- **Figma / variantes:** size: compact|comfortable; state: default|focused|disabled; selection: selected|unselected.
- **API dinâmica a definir em TypeScript:** `value, selected?, onChange, label, disabled?`.
- **Composição e reutilização:** FormField.
- **Específico Mobile:** Pressable radio com accessibilityState checked.
- **Teste de aceitação mínimo:** Escolha exclusiva e tecla de navegação apropriada.
- **Referências ao draft do PO:** RST-03.

#### `MDS/RadioGroup`
- **Figma / variantes:** layout: stacked|twoColumns; state: default|error.
- **API dinâmica a definir em TypeScript:** `options, value, onChange, label?, error?`.
- **Composição e reutilização:** Radio + FormField.
- **Específico Mobile:** Grupo de opções exclusivo, acessível com feedback tátil.
- **Teste de aceitação mínimo:** Valor ausente e mensagens de erro suportados.
- **Referências ao draft do PO:** RST-03.

#### `MDS/Select`
- **Figma / variantes:** size: small|medium|large; state: default|focused|error|disabled.
- **API dinâmica a definir em TypeScript:** `options, value, onChange, placeholder?, isLoading?, disabled?, searchable?`.
- **Composição e reutilização:** FormField.
- **Específico Mobile:** Picker/sheet acessível conforme biblioteca já instalada.
- **Teste de aceitação mínimo:** Não inventar opções; opções remotas indicam loading/empty/error.
- **Referências ao draft do PO:** PLN-01; CORE-05.

#### `MDS/Switch`
- **Figma / variantes:** size: compact|comfortable; state: default|focused|disabled; value: on|off.
- **API dinâmica a definir em TypeScript:** `value:boolean, onValueChange, label?, disabled?`.
- **Composição e reutilização:** FormField.
- **Específico Mobile:** Switch nativo ou Pressable com accessibilityRole=switch.
- **Teste de aceitação mínimo:** A alteração aplica-se imediatamente ou inclui botão explícito se requisito exigir.
- **Referências ao draft do PO:** CORE-05.

#### `MDS/TextField`
- **Figma / variantes:** size: small|medium|large; state: default|focused|error|disabled.
- **API dinâmica a definir em TypeScript:** `value, onChange, placeholder?, type?, iconStart?, disabled?`.
- **Composição e reutilização:** FormField.
- **Específico Mobile:** TextInput com keyboardType/autocapitalize coerentes e onChangeText.
- **Teste de aceitação mínimo:** Não perde foco ao atualizar valor.
- **Referências ao draft do PO:** CORE-05.

#### `MDS/Textarea`
- **Figma / variantes:** height: compact|comfortable; content: placeholder|value; state: default|focused|error|disabled.
- **API dinâmica a definir em TypeScript:** `value, onChange, placeholder?, maxLength?, showCounter?, rows?/minHeight?`.
- **Composição e reutilização:** FormField.
- **Específico Mobile:** TextInput multiline com scroll e keyboard avoidance.
- **Teste de aceitação mínimo:** Texto longo cresce ou desloca sem ser cortado.
- **Referências ao draft do PO:** MOB-04; RST-04.

#### `MDS/TimePicker`
- **Figma / variantes:** viewport: web|mobile; state: closed|open|error.
- **API dinâmica a definir em TypeScript:** `label, value:HHmm|null, onChange, minTime?, maxTime?, availableSlots?, error?`.
- **Composição e reutilização:** FormField.
- **Específico Mobile:** Seletor horário nativo/adaptador com apresentação iOS/Android.
- **Teste de aceitação mínimo:** Validação de conflito de equipa/recurso ocorre no backend.
- **Referências ao draft do PO:** PLN-01; PLN-02.

### 9.3 — Composição (2 famílias)

#### `MDS/Card`
- **Figma / variantes:** density: compact|comfortable; style: outlined|elevated.
- **API dinâmica a definir em TypeScript:** `title?, subtitle?, status?, children, actions?, footer?, styleOverride?`.
- **Composição e reutilização:** StatusBadge + ContentPanel + slots.
- **Específico Mobile:** View com slots por props, margens e altura pelo conteúdo.
- **Teste de aceitação mínimo:** Cresce com três linhas extras; botão não sai da borda.
- **Referências ao draft do PO:** CORE-05.

#### `MDS/ContentPanel`
- **Figma / variantes:** layout: stacked|wide; surface: surface|muted.
- **API dinâmica a definir em TypeScript:** `title?, description?, children, actions?, footer?, collapsed?`.
- **Composição e reutilização:** Card + slots.
- **Específico Mobile:** Contentor View com elementos alinhados e capacidade de crescer.
- **Teste de aceitação mínimo:** Slots são conteúdos reais, não placeholders de Figma.
- **Referências ao draft do PO:** CORE-05.

### 9.4 — Navegação/layout (7 famílias)

#### `MDS/AppHeader`
- **Figma / variantes:** viewport: web|mobile.
- **API dinâmica a definir em TypeScript:** `title, subtitle?, avatar?, leading?, trailing?, onProfilePress?`.
- **Composição e reutilização:** NavItem + Button + slots.
- **Específico Mobile:** Safe area, título adaptado, back button se necessário; ações táteis.
- **Teste de aceitação mínimo:** Não sobrepõe navegação/conteúdo.
- **Referências ao draft do PO:** CORE-02; MOB-01.

#### `MDS/AppShell`
- **Figma / variantes:** viewport: web|mobile.
- **API dinâmica a definir em TypeScript:** `navigation, header?, children, footer?, sidebarCollapsed?`.
- **Composição e reutilização:** AppHeader + NavItem + PageLayout.
- **Específico Mobile:** Stack + bottom tabs via navegador existente; safe-area; evitar sidebar de desktop.
- **Teste de aceitação mínimo:** Navegação e conteúdo sem duplicar estado ou perder scroll.
- **Referências ao draft do PO:** CORE-01; CORE-05.

#### `MDS/NavItem`
- **Figma / variantes:** place: sidebar|bottom; state: default|active|disabled.
- **API dinâmica a definir em TypeScript:** `label, icon?, href?/screen?, active?, disabled?, badge?`.
- **Composição e reutilização:** Button + ícones.
- **Específico Mobile:** Pressable navegação bottom/stack; accessibilityState selected.
- **Teste de aceitação mínimo:** Ativo identificado visualmente e pelo leitor de ecrã.
- **Referências ao draft do PO:** CORE-05; MOB-01.

#### `MDS/PageLayout`
- **Figma / variantes:** layout: stacked|wide.
- **API dinâmica a definir em TypeScript:** `title, description?, breadcrumbs?, actions?, children, footer?`.
- **Composição e reutilização:** AppShell + PageHeader/ContentPanel.
- **Específico Mobile:** Estrutura scrollável com header e ações; safe-area.
- **Teste de aceitação mínimo:** Sem CSS específico acoplado a página concreta.
- **Referências ao draft do PO:** CORE-05.

#### `MDS/Tab`
- **Figma / variantes:** size: compact|comfortable; state: default|active|focused|disabled.
- **API dinâmica a definir em TypeScript:** `id, label, selected, disabled?, onSelect, badge?`.
- **Composição e reutilização:** Tabs.
- **Específico Mobile:** Pressable com acessibilidade selecionada.
- **Teste de aceitação mínimo:** Foco, estados e relação painel-tab coerentes.
- **Referências ao draft do PO:** OS-03.

#### `MDS/TabPanel`
- **Figma / variantes:** surface: surface|muted.
- **API dinâmica a definir em TypeScript:** `id, labelledBy?, title?, children, actions?`.
- **Composição e reutilização:** Tab + ContentPanel.
- **Específico Mobile:** Conteúdo do separador montado/oculto com custo de estado adequado.
- **Teste de aceitação mínimo:** O conteúdo pode conter outros componentes sem largura fixa.
- **Referências ao draft do PO:** OS-03.

#### `MDS/Tabs`
- **Figma / variantes:** viewport: web|mobile; active: configurable.
- **API dinâmica a definir em TypeScript:** `items[], value, onChange, renderTab?, children?`.
- **Composição e reutilização:** Tab + TabPanel.
- **Específico Mobile:** Scrollable horizontalmente em ecrãs pequenos; evitar rótulos comprimidos.
- **Teste de aceitação mínimo:** Uma aba ativa e painel correspondente.
- **Referências ao draft do PO:** OS-03; EQP-04.

### 9.5 — Dados/listagens (6 famílias)

#### `MDS/DataTable`
- **Figma / variantes:** layout: table|cards; state: populated|empty.
- **API dinâmica a definir em TypeScript:** `rows[], columns[], keyExtractor, sorting?, onSort?, pagination?, loading?, renderCard?`.
- **Composição e reutilização:** TableRow + SortableHeader + FilterBar + Pagination.
- **Específico Mobile:** FlatList/SectionList de cartões em vez de HTML table.
- **Teste de aceitação mínimo:** Ordenação e paginação reais; estado vazio e carregamento.
- **Referências ao draft do PO:** OS-06; PRO-01; CLI-05.

#### `MDS/FilterBar`
- **Figma / variantes:** layout: horizontal|stacked.
- **API dinâmica a definir em TypeScript:** `filters, onChange, onReset?, search?, actions?, extraFilters?`.
- **Composição e reutilização:** TextField + Select + DateRangePicker + slots.
- **Específico Mobile:** Controlo vertical e botão de filtros adicionais via sheet.
- **Teste de aceitação mínimo:** Combina critérios e expõe seleção ativa; não oculta filtros aplicados.
- **Referências ao draft do PO:** OS-06; CLI-05; PRO-01.

#### `MDS/PageButton`
- **Figma / variantes:** size: compact|comfortable; state: default|current|disabled.
- **API dinâmica a definir em TypeScript:** `page, current?, disabled?, onSelect`.
- **Composição e reutilização:** Button.
- **Específico Mobile:** Pressable com índice e estado selecionado.
- **Teste de aceitação mínimo:** Indicadores numéricos não alteram página sem callback.
- **Referências ao draft do PO:** OS-06.

#### `MDS/Pagination`
- **Figma / variantes:** viewport: web|mobile; position: first|middle|last.
- **API dinâmica a definir em TypeScript:** `page, pageSize, total, onPageChange, onPageSizeChange?`.
- **Composição e reutilização:** PageButton + Button + Select.
- **Específico Mobile:** Anterior/Seguinte + contagem; não comprimir dezenas de números.
- **Teste de aceitação mínimo:** Desativar limites, atualização da lista e estado acessível.
- **Referências ao draft do PO:** OS-06.

#### `MDS/SortableHeader`
- **Figma / variantes:** state: none|ascending|descending|focused|disabled.
- **API dinâmica a definir em TypeScript:** `label, direction, onSort, disabled?`.
- **Composição e reutilização:** TableRow.
- **Específico Mobile:** Se usado em listagens, botão de ordenação separado em vez de cabeçalho HTML.
- **Teste de aceitação mínimo:** Uma direção efetiva por coluna e ordenação previsível.
- **Referências ao draft do PO:** OS-06.

#### `MDS/TableRow`
- **Figma / variantes:** layout: table|card; state: header|default|hover|selected.
- **API dinâmica a definir em TypeScript:** `row, columns?, selected?, onOpen?, actions?`.
- **Composição e reutilização:** SortableHeader + StatusBadge + Button.
- **Específico Mobile:** Card de listagem com campos essenciais e ações.
- **Teste de aceitação mínimo:** Chaves estáveis e campos opcionais sem deslocação.
- **Referências ao draft do PO:** OS-06.

### 9.6 — Overlays (2 famílias)

#### `MDS/Dialog`
- **Figma / variantes:** size: compact|wide; intent: neutral|danger.
- **API dinâmica a definir em TypeScript:** `open, onOpenChange, title, description?, children, actions?, initialFocus?`.
- **Composição e reutilização:** Button + slots.
- **Específico Mobile:** Modal com acessibilidade, botão fechar, voltar e gestão de teclado.
- **Teste de aceitação mínimo:** Ações irreversíveis exigem confirmação clara; corpo faz scroll.
- **Referências ao draft do PO:** OS-05; RST-05.

#### `MDS/DrawerSheet`
- **Figma / variantes:** placement: right|bottom|fullscreen.
- **API dinâmica a definir em TypeScript:** `open, onClose, title, children, actions?, showHandle?`.
- **Composição e reutilização:** ContentPanel + Button + slots.
- **Específico Mobile:** Bottom sheet/stack modal com safe-area e gestos consistentes.
- **Teste de aceitação mínimo:** Close não perde dados sem confirmar; formulário não fica tapado pelo teclado.
- **Referências ao draft do PO:** OS-03; MOB-02.

### 9.7 — Feedback (4 famílias)

#### `MDS/Alert`
- **Figma / variantes:** tone: info|success|warning|danger; layout: compact|detailed.
- **API dinâmica a definir em TypeScript:** `title?, message, action?, onDismiss?, dismissible`.
- **Composição e reutilização:** AlertIcon + Button.
- **Específico Mobile:** View com texto escalável; acessibilidade de anúncio conforme criticidade, sem interromper gestos.
- **Teste de aceitação mínimo:** Erro e ação acessíveis; sem corte de texto.
- **Referências ao draft do PO:** CORE-05.

#### `MDS/LoadingIndicator`
- **Figma / variantes:** type: spinner|inline|skeleton; size: compact|comfortable.
- **API dinâmica a definir em TypeScript:** `type, label?, active?, reducedMotion?`.
- **Composição e reutilização:** Tokens + ProgressBar.
- **Específico Mobile:** ActivityIndicator e skeletons; reduzir movimento quando configurado.
- **Teste de aceitação mínimo:** Não anunciar estado a cada frame.
- **Referências ao draft do PO:** CORE-05.

#### `MDS/ProgressBar`
- **Figma / variantes:** size: compact|regular; state: active|complete|error.
- **API dinâmica a definir em TypeScript:** `value, min?, max?, label?, status?, showValue?`.
- **Composição e reutilização:** Tokens.
- **Específico Mobile:** Barra View com largura percentual derivada do valor, accessibilityValue.
- **Teste de aceitação mínimo:** Texto e percentagem visual têm sempre a mesma origem numérica.
- **Referências ao draft do PO:** RST-02; MOB-07.

#### `MDS/ToastSnackbar`
- **Figma / variantes:** tone: info|success|warning|danger; layout: compact|detailed.
- **API dinâmica a definir em TypeScript:** `id, tone, title?, message, action?, durationMs?, dismissible?`.
- **Composição e reutilização:** AlertIcon + Button + ToastHost.
- **Específico Mobile:** Host global + acessibilidade de aviso; safe area.
- **Teste de aceitação mínimo:** Fila, limpeza e deduplicação; erros persistentes noutro componente.
- **Referências ao draft do PO:** MOB-07; CORE-05.

### 9.8 — Media/ficheiros (4 famílias)

#### `MDS/AttachmentItem`
- **Figma / variantes:** layout: row|stacked; kind: document|photo; state: ready|uploading|error.
- **API dinâmica a definir em TypeScript:** `file:{id,name,mime,size,uri?}, progress?, onRemove?, onRetry?, onOpen?`.
- **Composição e reutilização:** StatusBadge + ProgressBar + Button.
- **Específico Mobile:** Layout empilhado; abrir documento com handler/plataforma; dados locais URI.
- **Teste de aceitação mínimo:** Erro e progresso coerentes; nenhuma ação muda estado sem callback.
- **Referências ao draft do PO:** OS-04; MOB-06; RST-03.

#### `MDS/FileUpload`
- **Figma / variantes:** viewport: web|mobile; state: empty|selected|uploading|error.
- **API dinâmica a definir em TypeScript:** `files[], accept?, maxFiles?, maxSizeBytes?, onAdd, onRemove, onRetry?, disabled?`.
- **Composição e reutilização:** AttachmentItem + Button.
- **Específico Mobile:** Seletor nativo de documentos; permissões/URI; não pressupor drag/drop.
- **Teste de aceitação mínimo:** Validar MIME/extensão/tamanho no cliente e servidor.
- **Referências ao draft do PO:** OS-04; MOB-06; FIN-04.

#### `MDS/ImagePicker`
- **Figma / variantes:** viewport: web|mobile; state: empty|selected.
- **API dinâmica a definir em TypeScript:** `photos[], onAdd?, onCapture?, onRemove?, renderPreview?, maxFiles?`.
- **Composição e reutilização:** PhotoTile + FileUpload + Button.
- **Específico Mobile:** Escolher da galeria e câmara via adaptadores; permissões e compressão.
- **Teste de aceitação mínimo:** Nova imagem quebra linha sem sobreposições.
- **Referências ao draft do PO:** MOB-06; RST-03.

#### `MDS/PhotoTile`
- **Figma / variantes:** state: ready|uploading|error.
- **API dinâmica a definir em TypeScript:** `photo:{id,uri,name,alt?,state}, progress?, onOpen?, onRemove?, onRetry?`.
- **Composição e reutilização:** StatusBadge + Button + preview slot.
- **Específico Mobile:** Image com resizeMode=cover e onPress; gestos básicos.
- **Teste de aceitação mínimo:** Thumbnail vazia, erro, seleção, carga e remoção.
- **Referências ao draft do PO:** MOB-06; RST-03.

### 9.9 — Negócio (11 famílias)

#### `MDS/ActivityItem`
- **Figma / variantes:** viewport: web|mobile; event: status|assignment|comment|completion.
- **API dinâmica a definir em TypeScript:** `event:ActivityEvent, onOpenRelated?, leading?, trailing?`.
- **Composição e reutilização:** StatusBadge + Tokens de estado.
- **Específico Mobile:** View com autor, hora e referência; ordenação e fonte de dados fora do componente.
- **Teste de aceitação mínimo:** Cada registo identifica ator, acontecimento, data/hora e ordem relacionada.
- **Referências ao draft do PO:** OS-02; CORE-03; PRO-02.

#### `MDS/AssignmentPanel`
- **Figma / variantes:** viewport: web|mobile; state: draft|assigned.
- **API dinâmica a definir em TypeScript:** `value:{teamId,technicianId?}, onChange, onSubmit, note?, pending?, error?`.
- **Composição e reutilização:** TeamSelector + UserSelector + StatusBadge + Button.
- **Específico Mobile:** Selectores empilhados e ação no fim; validar toque.
- **Teste de aceitação mínimo:** Não permite atribuição incompatível sem validação do servidor.
- **Referências ao draft do PO:** OS-01; PLN-01; PLN-02; PLN-03.

#### `MDS/Checklist`
- **Figma / variantes:** viewport: web|mobile; state: inProgress|complete.
- **API dinâmica a definir em TypeScript:** `items:ChecklistEntry[], value:Record<id,result>, onItemChange, onSave?, onSubmit?, actions?`.
- **Composição e reutilização:** ChecklistItem + TaskProgress + PhotoTile.
- **Específico Mobile:** Scroll vertical, autosave opcional, offline drafts; evita bloquear input pela rede.
- **Teste de aceitação mínimo:** Resultado e progresso calculados da mesma lista; N itens e evidências.
- **Referências ao draft do PO:** RST-01; RST-02; RST-03; RST-05; MOB-07.

#### `MDS/ChecklistItem`
- **Figma / variantes:** viewport: web|mobile; result: pending|pass|fail|notTested.
- **API dinâmica a definir em TypeScript:** `item:{id,title,description?,required?}, result, note?, attachments?, onChange, onAddEvidence?`.
- **Composição e reutilização:** StatusBadge + Button + PhotoTile/AttachmentItem.
- **Específico Mobile:** Escolha em sheet ou radio acessível; nota e fotografias por captura.
- **Teste de aceitação mínimo:** fail e notTested não podem ser indistinguíveis de pending.
- **Referências ao draft do PO:** RST-02; RST-03.

#### `MDS/ClientSummary`
- **Figma / variantes:** viewport: web|mobile; state: active|review.
- **API dinâmica a definir em TypeScript:** `client:{id,name,contacts?,sites?,status}, onOpen, actions?, fields?`.
- **Composição e reutilização:** Card + StatusBadge + Button.
- **Específico Mobile:** Card empilhado em 1 coluna com ação inferior.
- **Teste de aceitação mínimo:** Render sem dados opcionais e sem inventar contactos.
- **Referências ao draft do PO:** CLI-01; CLI-02; CLI-03; CLI-05.

#### `MDS/EquipmentCard`
- **Figma / variantes:** viewport: web|mobile; state: operational|needsService.
- **API dinâmica a definir em TypeScript:** `equipment:{id,identifier,model?,site?,status}, onOpen, actions?`.
- **Composição e reutilização:** Card + StatusBadge + Button.
- **Específico Mobile:** Cartão compacto e ação de QR se autorizada.
- **Teste de aceitação mínimo:** Nunca usar QR como substituto da verificação de permissões.
- **Referências ao draft do PO:** EQP-01; EQP-02; EQP-03; EQP-04.

#### `MDS/ServiceOrderCard`
- **Figma / variantes:** viewport: web|mobile; state: planned|active.
- **API dinâmica a definir em TypeScript:** `order:{id,reference,clientId,siteId,status,scheduledAt?}, onOpen, actions?`.
- **Composição e reutilização:** Card + StatusBadge + Button.
- **Específico Mobile:** Card de serviço atribuído com informações necessárias em terreno.
- **Teste de aceitação mínimo:** Sem duplicar dados da ordem; datas e permissões respeitadas.
- **Referências ao draft do PO:** OS-01; OS-03; MOB-01.

#### `MDS/TaskProgress`
- **Figma / variantes:** viewport: web|mobile; state: inProgress|complete.
- **API dinâmica a definir em TypeScript:** `completed, total, pending?, failed?, label?`.
- **Composição e reutilização:** ProgressBar + StatusBadge.
- **Específico Mobile:** Resumo compacto sem recalcular estado em JSX desconectado.
- **Teste de aceitação mínimo:** O que conta como concluído deve ser regra de negócio explícita.
- **Referências ao draft do PO:** RST-02; RST-05.

#### `MDS/TeamSelector`
- **Figma / variantes:** viewport: web|mobile; state: closed|open.
- **API dinâmica a definir em TypeScript:** `teams[], value, onChange, query?, onQueryChange?, loading?`.
- **Composição e reutilização:** Select + StatusBadge + UserSelector.
- **Específico Mobile:** Searchable sheet/lista nativa de equipas, com metadados.
- **Teste de aceitação mínimo:** Disponibilidade validada na atribuição pelo backend.
- **Referências ao draft do PO:** PLN-01; PLN-02.

#### `MDS/Timeline`
- **Figma / variantes:** viewport: web|mobile; state: populated|empty.
- **API dinâmica a definir em TypeScript:** `events:ActivityEvent[], onLoadMore?, hasMore?, isLoading?`.
- **Composição e reutilização:** ActivityItem + Pagination.
- **Específico Mobile:** FlatList com renderização incremental e ordenação recente primeiro.
- **Teste de aceitação mínimo:** Autor/hora/referência presentes; histórico não sobrescrito.
- **Referências ao draft do PO:** OS-02; CORE-03; PRO-02.

#### `MDS/UserSelector`
- **Figma / variantes:** viewport: web|mobile; state: closed|open.
- **API dinâmica a definir em TypeScript:** `users[], value, onChange, query?, onQueryChange?, loading?, teamId?`.
- **Composição e reutilização:** Select + StatusBadge.
- **Específico Mobile:** Sheet pesquisável com informação do técnico e estado.
- **Teste de aceitação mínimo:** Filtrar por equipa opcional; confirmar disponibilidade no servidor.
- **Referências ao draft do PO:** PLN-01; OS-01.

## 10. Contratos funcionais e casos de integração

**Ordens de serviço:** `ServiceOrderCard` e `ClientSummary` usam identificadores estáveis; `Tabs`/`TabPanel` separam geral, materiais, equipa, relatórios e histórico; `Timeline` mantém `ActivityEvent[]`; `AttachmentItem` referencia a ordem a que pertence. Referências: OS-01..06, CLI-01..05, CORE-01..03.

**Planeamento:** `DatePicker` + `TimePicker` + `DateRangePicker` + `TeamSelector` + `UserSelector` + `AssignmentPanel`. O UI pode mostrar uma disponibilidade, mas a confirmação deve rever conflitos no backend (PLN-01..04).

**Terreno e relatórios:** `Checklist` composta de `ChecklistItem[]`, `TaskProgress`, `ImagePicker`, `FileUpload`, `PhotoTile`. Resultados: `pass`, `fail`, `notTested`, `pending`. `fail`/`notTested` não podem perder observações/evidências (MOB-01..08, RST-01..06).

**Equipamentos:** `EquipmentCard` identifica um registo de equipamento independente da ordem de serviço; leitura de QR não concede permissões por si só (EQP-01..04).

**Mobile offline e plataforma comum:** guardar rascunhos e eventos com IDs estáveis; indicar `pendingSync`, `syncing`, `conflict`, `synced` em componentes apropriados, mas só implementar persistência/reconciliação se aprovado. Fase de desenho não equivale a sincronização funcional (MOB-07; CORE-01; PHC-04).

**ERP PHC e IA:** não adicionar integrações reais nem decisões automáticas irreversíveis a componentes. Necessidades PHC-01..06 e IA-01..05 estão por analisar e validar; interfaces devem aceitar estados/proveniência se este âmbito for aprovado.

### Regras de consistência entre Web e Mobile

- Mesmos **IDs, estados de domínio, formatos de data e eventos**; aparência e padrão de navegação podem diferir.
- Um erro de backend tem a mesma interpretação funcional; a apresentação pode ser `Alert` Web e `Toast`/`Dialog` Mobile conforme gravidade.
- `ServiceOrderStatus` não se confunde com `ChecklistResult`, `UploadStatus` ou estados de faturação.
- Ficheiros e fotografias têm identidade própria e associação clara à ordem/intervenção, não apenas à mensagem onde apareceram.
- Formulários críticos não perdem dados ao trocar de separador, fechar sobreposições por acidente ou passar temporariamente a offline.

## 11. Ordem recomendada para o agente implementar

1. **Tokens, ThemeProvider e infraestrutura de testes**.
2. **Átomos** (`Button`, `StatusBadge`, `AlertIcon`, `TextField`, `Checkbox`, `Radio`, `Switch`, `PageButton`).
3. **Formulários e composição** (`FormField`, `Select`, `Textarea`, `FormGroup`, `Form`, `Card`, `ContentPanel`).
4. **Layout, feedback, navegação, listagens** (`AppShell`, `PageLayout`, `Tabs`, `Dialog`, `DataTable`, `FilterBar`, `ToastSnackbar`, `ProgressBar`, etc.).
5. **Áreas de negócio** por story realmente priorizada: ordens de serviço, agenda/atribuição, equipamento, checklist/evidências, histórico.
6. **Ensaios integrados**, com dados fictícios consistentes, testes de UI e verificações de acessibilidade.

Não implementes todas as 53 famílias se o sprint pedir menos. Usa este catálogo como **contrato de execução incremental**, não como requisito para uma entrega monolítica.

## 12. Definition of Done (DoD) para um componente

- [ ] API pública tipada; sem `any` nas interfaces de uso normal; estados e callback sem ambiguidade.
- [ ] Tema global + pelo menos uma personalização local e uma variante sem alterar a implementação.
- [ ] Componentes aninhados/slots funcionam com zero, um e vários elementos.
- [ ] Estados default, disabled, loading, error, empty, selected/focused testados quando relevantes.
- [ ] Texto longo, fonte ampliada, largura reduzida e conteúdo variável não causam sobreposições/corte.
- [ ] Ação recebe callback e não executa chamadas escondidas à rede; não há botões inertes.
- [ ] Contraste, navegação por teclado/leitor de ecrã, labels e estados adequados à plataforma.
- [ ] Testes de lógica, renderização e interações, incluindo um caso de erro e um caso com dados diferentes do Figma.
- [ ] Exemplos demonstram reutilização em duas páginas/ecrãs e composição com pelo menos outro componente, quando adequado.
- [ ] `npm run typecheck`, lint e testes do projeto executados (ou equivalentes reais identificados). Indicar resultados reais, nunca inventados.
- [ ] Registo da correspondência com Figma e referência da User Story/AC, se existir; alterações de scope autorizadas.

## 13. Formato sugerido de relato para tarefas de componentes

Usa este modelo quando ajudar a explicar a implementação; adapta-o ao pedido e às orientações do projeto. Não se aplica como formato obrigatório a todas as tarefas do repositório.

```md
### Implementado
- Nome e responsabilidade do(s) componente(s)
- Ficheiros adicionados/alterados
- Props públicas, variantes, slots e tokens usados

### Exemplos
- Caso A e caso B (com dados distintos)

### Verificação
- Comandos executados e resultado real
- Estados e acessibilidade verificados
- Comparação com Figma (ou limitação de acesso)

### Pendências / decisões
- Requisitos não validados, dependências ou integrações por decidir
```

## 14. Referências

- **Enunciado local:** `MDS_Projeto_Pratico_2026-2027_REV06.pdf`.
- **Draft do PO:** `MDS_Draft_Product_Backlog_ENTREGA_01_CONCRETA_V03.pdf`.
- **Figma:** [MDS — Wireframes da Aplicação](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ/MDS-%E2%80%94-Wireframes-da-Aplica%C3%A7%C3%A3o), página `00 — Design System`.
- **React — composição e propriedades:** https://react.dev/learn/passing-props-to-a-component
- **React Native — documentação base:** https://reactnative.dev/docs/getting-started
- **Acessibilidade e padrões:** https://www.w3.org/WAI/ARIA/apg/patterns/

> **Nota sobre o Figma:** nomes, famílias e variantes foram consultados; os layouts no Figma são referências visuais e não especificações de API, persistência ou lógica de negócios. Quando houver divergência entre um exemplo Figma e a acessibilidade/funcionamento da aplicação, preservar a identidade visual e implementar o comportamento correto, documentando a decisão.
