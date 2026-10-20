# Sistema Integrado de Recepção do IFC

Sistema do IFC — Campus Fraiburgo para registrar visitas, consultar atendimentos e acompanhar avaliações gerais e por setor.

## Por onde começar

- **Vou operar o sistema:** leia o [guia de operação](#guia-de-operação) e as [perguntas frequentes](#perguntas-frequentes).

## Guia de operação

### 1. Acessar sua conta

1. Abra o endereço fornecido pela equipe responsável. No computador que executa o servidor, o endereço padrão é [http://localhost:3000](http://localhost:3000).
2. Digite seu **nome de usuário** e sua senha e clique em **Entrar no Sistema**. Apesar do rótulo “Usuário ou E-mail”, a implementação atual consulta apenas o nome de usuário.
3. Na página inicial, escolha **Recepção**, **Gráfico geral** ou **Gráfico dos Setores**.

Se ainda não tiver conta, clique em **Solicite acesso aqui**, preencha nome e mensagem e use **Solicite acesso via WhatsApp**. Esse fluxo abre uma solicitação; não cria a conta automaticamente. Confira e envie a mensagem no WhatsApp e aguarde o responsável pelo acesso.

### 2. Registrar uma visita

Na tela **Recepção**, preencha o formulário **Novo Registro de Recepção**:

| Campo | Como preencher |
| --- | --- |
| Data | Obrigatória, no formato `DD/MM/AAAA`. |
| Nome Completo | Obrigatório; informe o nome do visitante. |
| CPF | Opcional. Quando preenchido, precisa ser válido. |
| Motivo da Visita | Obrigatório; por exemplo, reunião ou entrega. |
| Setor de Destino | Obrigatório; selecione um setor da lista. |
| Entrada e Saída | Obrigatórias no formulário atual, no formato `HH:MM`, em 24 horas. |
| Avaliação do Atendimento | Opcional: de 1 a 5, ou **Sem avaliação**. |

Em **Campos Opcionais Avançados**, você pode informar telefone, empresa, responsável pelo atendimento, documento, status e observações. O status padrão é **Concluído**; também existe a opção **Ativo (Em andamento)**.

Clique em **Cadastrar Visita** e aguarde a confirmação. O registro deve aparecer na tabela. Antes do próximo cadastro, confira os campos: data, horários, avaliação e status podem manter os valores anteriores.

> O formulário ainda exige a saída mesmo com status **Ativo**. O fluxo de registrar apenas a entrada e preencher a saída depois precisa de ajuste. Não informe um horário fictício para contornar essa limitação.

### 3. Consultar e corrigir registros

- Use a busca para localizar nome, CPF, motivo ou empresa.
- Combine os filtros de setor e avaliação para reduzir a lista.
- Use **Anterior** e **Próximo** para navegar entre as páginas da tabela.
- Nas ações do registro, abra os detalhes ou a edição. Depois de corrigir os campos, clique em **Salvar Alterações**.
- Para excluir, confira o registro e confirme em **Sim, Excluir**. A interface não possui opção de desfazer.

### 4. Exportar e imprimir

Na tela **Recepção**, ajuste a busca e os filtros e clique em:

- **Exportar CSV:** baixa um arquivo para abrir em um aplicativo de planilhas.
- **Imprimir:** abre o relatório para impressão; se disponível no navegador, escolha salvar como PDF.

Ambas as opções usam todos os registros que correspondem aos filtros, incluindo os de outras páginas da tabela. Para exportar a lista completa, limpe a busca e os filtros primeiro.

### 5. Acompanhar os gráficos

| Tela | O que consultar |
| --- | --- |
| Gráfico geral | Indicadores e avaliações, com filtros de ano, mês e setor. |
| Gráfico dos Setores | Comparação entre setores, com filtros de ano e mês e visualizações de proporção de visitas, média de satisfação e volume de visitas. |

Registros sem avaliação entram na contagem de visitas, mas não nas médias das notas. Os gráficos utilizam Google Charts e dependem do carregamento desse serviço pela internet.

### 6. Encerrar o uso

Clique em **Sair** ao terminar, principalmente em computadores compartilhados. Fechar a aba não substitui essa ação: o sistema mantém informações da sessão no navegador.

## Perguntas frequentes

### Esqueci minha senha. Como recupero?

Clique em **Esqueci minha senha** na tela de acesso. Atualmente, a opção orienta entrar em contato com `sisae.fraiburgo@ifc.edu.br`; não existe redefinição automática de senha.

### Preciso instalar algo para usar o sistema?

Para operar, você precisa de um navegador e do endereço informado pela equipe. A instalação abaixo é para quem executa ou desenvolve o servidor. Em outro computador, `localhost` aponta para o próprio computador, não para o servidor do campus.

### Posso deixar o CPF ou a avaliação em branco?

Sim. O CPF é opcional, mas é validado quando preenchido. Para não atribuir uma nota, mantenha **Sem avaliação**.

### Por que a visita não foi salva?

Confira os campos obrigatórios, a data, os horários e o CPF, se informado. Se aparecer erro de conexão, peça à equipe técnica para verificar o servidor e o MySQL. Consulte a tabela antes de tentar novamente para evitar duplicidade.

### Não encontro um registro ou os gráficos estão vazios. O que faço?

Limpe a busca e os filtros, confira o período e atualize a página. Nos gráficos, verifique também a conexão com a internet. Se o problema continuar, informe à equipe a tela, a mensagem de erro e os filtros usados.

### “Lembrar meus dados” funciona?

A opção aparece na tela, mas a lógica de preenchimento automático está desativada no código atual. Use suas credenciais para entrar e clique em **Sair** ao encerrar.

## Configuração local com XAMPP e MySQL

Use Node.js 24.10 ou superior e npm (ambiente conferido: Node.js 24.15.0 e MariaDB 10.4.32 do XAMPP).

1. Inicie o serviço MySQL no painel do XAMPP.
2. No phpMyAdmin, crie um banco vazio com codificação utf8mb4 e selecione-o. Importe [database/schema.sql](database/schema.sql). O arquivo cria apenas as tabelas users e receptions, sem contas, senhas ou visitas. Não o use como migração de um banco já existente.
3. Na raiz do projeto, copie [.env.example](.env.example) para .env e preencha DB_HOST, DB_PORT, DB_USER, DB_PASSWORD e DB_NAME conforme seu ambiente. No PowerShell, use Copy-Item .env.example .env somente se ainda não houver um .env. Senha vazia é permitida quando essa for a configuração local do XAMPP.
4. Execute npm install e depois npm run watch. Acesse http://localhost:3000. Também estão disponíveis npm start e npm run dev, sem reinício automático.
5. Solicite ao responsável o provisionamento de uma conta local na tabela users. Não existe conta padrão nem script de seed. A autenticação existente foi preservada; a criação do banco não cria um usuário de acesso ao sistema.

O backend carrega o .env pelo suporte nativo do Node, sem dotenv. Variáveis já definidas no ambiente têm prioridade. O carregamento também funciona ao executar node src/backend/server.js. Reinicie o processo após alterar o .env. A mensagem de conexão bem-sucedida só aparece após uma consulta de verificação.

O schema mantém os formatos usados pela aplicação (data da visita e horários como texto) e permite avaliação NULL, sem atribuir nota 5 por padrão. Os dados de recepção e usuários ficam no MySQL. A pasta data/ contém arquivos locais/legados e recebe data.json gerado pelo backend; ela é criada automaticamente quando necessário e não deve ser versionada.

### Arquivos locais fora do Git

.env, data/, bancos SQL, dumps e backups são ignorados. Somente .env.example e database/schema.sql devem ser compartilhados como configuração e estrutura. Não use git add -f para incluir arquivos locais. Revise git status e os arquivos preparados antes de cada commit. Essas regras não apagam dados de commits antigos.
