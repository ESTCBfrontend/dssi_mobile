# Ambiente de desenvolvimento Android no Windows

Este guia prepara o computador para desenvolver o DSSI Mobile com um emulador Android visível. Ao iniciar uma sessão de desenvolvimento, abre o IDE, o emulador e a aplicação para poderes acompanhar as alterações. O procedimento usa Android Studio e Expo Go; não exige instalar um IDE específico para editar o projeto.

## 1. Pré-requisitos

- Windows compatível, com espaço disponível e virtualização ativada. Consulta os [requisitos do Android Studio](https://developer.android.com/studio/install#system-requirements); se o emulador não arrancar ou for muito lento, segue o [guia de aceleração](https://developer.android.com/studio/run/emulator-acceleration) e as instruções para Windows Hypervisor Platform. Alterações à BIOS ou às funcionalidades do Windows podem exigir acesso de administrador e reinício.
- Instala o [Git para Windows](https://git-scm.com/download/win).
- Se usares o VS Code, instala a extensão [Expo Tools](https://marketplace.visualstudio.com/items?itemName=expo.vscode-expo-tools): abre **Extensions** com **Ctrl+Shift+X**, procura `Expo Tools` e seleciona **Install**. A extensão permite ligar o depurador do IDE à aplicação; os passos para o fazer estão na [secção de desenvolvimento](#5-trabalhar-e-ver-alterações). A app também pode ser executada noutro IDE, usando o terminal e o React Native DevTools.
- Instala a versão **Node.js 24** indicada pelo projeto, com npm, a partir da [página oficial](https://nodejs.org/en/download). Seleciona a versão 24 e o instalador adequado ao computador. Depois, abre um terminal novo e confirma:

  ```powershell
  git --version
  node --version
  npm.cmd --version
  ```

  `node --version` deve começar por `v24`. Em PowerShell usa-se `npm.cmd` para evitar possíveis restrições do script `npm.ps1`; também funciona no Git Bash.

## 2. Instalar o Android Studio e o SDK

1. Descarrega o [Android Studio](https://developer.android.com/studio) e executa o instalador Windows. Inclui o Android Virtual Device quando for oferecido. No primeiro arranque, segue o assistente de instalação, aceita as licenças e deixa-o descarregar os componentes necessários.
2. Abre **More Actions → SDK Manager** no ecrã inicial ou **Settings → Languages & Frameworks → Android SDK** com um projeto aberto. Os nomes podem variar entre versões.
3. Em **SDK Platforms**, instala uma plataforma Android; a documentação Expo atual indica **Android 16 / API 36** para compilação nativa. Em **SDK Tools**, confirma **Android SDK Platform-Tools**, **Android Emulator** e pelo menos uma versão de **Android SDK Build-Tools**. Aplica as alterações e aceita as licenças pedidas.
4. Copia o valor de **Android SDK Location**. É frequentemente `%LOCALAPPDATA%\Android\Sdk`, mas usa o valor apresentado na tua instalação.
5. Nas variáveis de ambiente do utilizador do Windows, cria `ANDROID_HOME` com o caminho do SDK e acrescenta `%ANDROID_HOME%\platform-tools` ao `Path`. Fecha e abre novamente o IDE e os terminais para receberem as alterações. Em PowerShell confirma:

  ```powershell
  $env:ANDROID_HOME
  adb --version
  ```

  O primeiro comando deve mostrar o caminho do SDK e o segundo a versão do Android Debug Bridge. Se `adb` não for encontrado, confirma o `Path` e reinicia o terminal. Mais detalhes: [configuração Android para Expo](https://docs.expo.dev/workflow/android-studio-emulator/).

## 3. Criar e arrancar o emulador

1. No ecrã inicial do Android Studio abre **More Actions → Virtual Device Manager**; dentro do IDE abre **Tools → Device Manager**.
2. Escolhe **Create device**, seleciona um telefone, por exemplo um Pixel, e avança. Escolhe uma imagem Android adequada à arquitetura do computador, descarrega-a se necessário e conclui o assistente. Uma imagem API 36 é uma opção para este projeto; a API da imagem virtual não tem de ser igual à plataforma SDK instalada para compilar.
3. No Device Manager, carrega em **Play** junto ao dispositivo e espera até aparecer o ecrã inicial do Android. A primeira inicialização pode demorar.
4. Confirma a ligação:

  ```powershell
  adb devices
  ```

  Deverá surgir uma linha semelhante a `emulator-5554    device`. Se não aparecer, espera pelo arranque e verifica a instalação de Platform-Tools e o estado do emulador. Consulta a [gestão de dispositivos virtuais](https://developer.android.com/studio/run/managing-avds) para criar outros tamanhos ou resolver problemas.

## 4. Instalar o projeto e abrir a aplicação

1. Clona o repositório, caso ainda não o tenhas, e abre a pasta no teu IDE:

  ```powershell
  git clone https://github.com/ESTCBfrontend/dssi_mobile.git
  cd dssi_mobile
  npm.cmd ci
  ```

  Se já existir uma cópia, abre essa pasta e executa `npm.cmd ci` quando precisares de instalar as dependências do lockfile. Este comando substitui `node_modules`; guarda primeiro quaisquer alterações locais que tenhas feito dentro dessa pasta.
2. Com o emulador aberto e reconhecido, inicia o servidor no terminal do projeto:

  ```powershell
  npm.cmd start
  ```

3. Quando o Expo estiver pronto, carrega em **a** no terminal para abrir a app no Android. Na primeira utilização, o Expo pode descarregar e instalar uma versão compatível do Expo Go; aceita os pedidos apresentados. Mantém o terminal e o emulador abertos. Em alternativa, `npm.cmd run android` inicia o Expo e tenta abrir o Android.
4. Deverás ver o ecrã **Os meus serviços**. A API ainda está indisponível; em desenvolvimento, abre o botão com o inseto e seleciona **Origem de dados → Mock** para apresentar os exemplos fictícios. A engrenagem do Expo é um menu separado.

O projeto usa atualmente Expo SDK 58; se surgir uma mensagem de versão incompatível, consulta [como instalar a versão correta do Expo Go](https://docs.expo.dev/troubleshooting/expo-go-version-mismatch/) e verifica a dependência `expo` em `package.json`. Uma atualização sugerida no terminal não é uma instrução para alterar automaticamente as dependências do projeto.

## 5. Trabalhar e ver alterações

- Abre o IDE e inicia o emulador e o servidor Expo no começo da sessão. Ao guardar alterações JavaScript ou TypeScript, o **Fast Refresh** atualiza normalmente a aplicação em execução. Experimenta, por exemplo, editar temporariamente o texto de `src/features/work-orders/presentation/WorkOrdersScreen.tsx` e guardá-lo; repõe a alteração depois.
- No terminal Expo, **r** recarrega a aplicação e **m** abre o menu de desenvolvimento do Expo. Se as alterações não aparecerem, confirma que o Fast Refresh está ativo nesse menu e que o servidor continua a correr. Consulta a [documentação Expo](https://docs.expo.dev/get-started/start-developing/).
- Os logs JavaScript aparecem no terminal Expo em desenvolvimento; procura `[DSSI]` para os eventos técnicos da app. Carrega em **j** no terminal Expo para abrir o React Native DevTools e consultar a respetiva consola. A Debug Console do IDE exige uma sessão de depuração compatível ligada à app. Em produção, os logs não são encaminhados para o terminal Expo; consulta o log nativo quando necessário. Fecha o servidor com **Ctrl+C** quando terminares.
- Para ligar a Debug Console no VS Code, instala a extensão [Expo Tools](https://marketplace.visualstudio.com/items?itemName=expo.vscode-expo-tools), inicia o Expo e abre a app no emulador. No VS Code usa **Ctrl+Shift+P** e executa **Expo: Debug ...**, seguindo a seleção apresentada para ligar à app. Consulta a [documentação Expo](https://docs.expo.dev/debugging/tools/#debugging-with-vs-code): esta integração está em alpha; se falhar, usa o terminal Expo ou o React Native DevTools. A ligação à Debug Console depende do IDE e da extensão e não é ativada automaticamente por abrir o painel.
- No painel **Run and Debug**, as configurações de `.vscode/launch.json` identificam a app e o destino. **DSSI Mobile — Android: Expo Tools (experimental)** usa a extensão Expo Tools e a porta Metro 8081; se o servidor usar outra, ajusta `bundlerPort`. **DSSI Mobile — Android: depurar app (Hermes, teste)** usa a extensão React Native Tools e destina-se a uma app Hermes já aberta. Ambas tentam ligar-se ao processo existente e não iniciam o servidor ou o emulador.
- A configuração Hermes está em teste com uma build local da extensão React Native Tools, baseada no código da Microsoft após a [correção da ligação](https://github.com/microsoft/vscode-react-native/pull/2995) e com uma alteração adicional local para usar a página anunciada pelo Metro. Esta build modificada não é distribuída com o projeto nem equivale à extensão oficial publicada, mesmo que apresente o mesmo número de versão. Num teste no Antigravity IDE, um breakpoint parou na app Android, mas os logs da app não apareceram na Debug Console. Os logs continuam disponíveis no terminal; usa **j** para abrir o React Native DevTools.
- Se o terminal indicar `Connection from DevTools failed ... origin 'undefined'` ao ligar a Expo Tools, a ligação do depurador foi recusada pelo Metro. Este comportamento foi observado com Expo Tools 1.6.3 e não significa, por si só, que a app deixou de funcionar. Interrompe a sessão de depuração que está a tentar ligar; usa os logs no terminal Expo ou experimenta **j** para abrir o React Native DevTools. Verifica se existem atualizações da extensão e do IDE antes de voltares a tentar. A ligação ao VS Code e a alternativa devem ser verificadas no ambiente em uso; não alteres a verificação de origem do Metro para contornar o erro.
- Alterações de configuração ou código nativo podem exigir reiniciar o servidor e, dependendo da alteração, uma nova build de desenvolvimento. O Expo Go não suporta todos os módulos nativos; usa uma [development build](https://docs.expo.dev/develop/development-builds/introduction/) quando a funcionalidade o exigir. Não é necessário criá-la para o fluxo inicial aqui descrito.
- Se o emulador estiver ativo mas a aplicação não abrir, verifica `adb devices`, volta a carregar em **a** no terminal e consulta os erros apresentados. Se necessário, reinicia o servidor e o Expo Go. Confirma também que não estás a usar outro servidor Metro para um projeto diferente.

## 6. Validação e agentes de código

Agentes devem consultar este guia, verificar se já há um emulador e um servidor Expo disponíveis e reutilizá-los quando apropriado, sem interromper o trabalho do utilizador. Para alterações visuais ou dependentes de plataforma, usa o emulador para observar o resultado quando estiver disponível e relata o que foi ou não validado. Não afirmes que uma interação foi validada apenas por ter sido compilada.

Executa também as verificações locais indicadas no [README](../README.md#verificações-locais). O emulador Android e o Expo Go não substituem testes em dispositivos físicos, acessibilidade, uma build nativa ou validação iOS. No Windows não existe simulador iOS local; a validação iOS exige um ambiente compatível.
