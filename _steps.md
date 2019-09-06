Inicializamos o Git:

```
git init
git remote add origin https://github.com/cafecomlucas/rocketseat_02_node_gobarber.git
```

Inicializamos o Yarn:

```
yarn init -y
```

Instalamos a dependência `express`:

```
yarn add express
```

Criamos a estrutura do servidor, separando cada arquivo.

- Configuração do servidor definida no `src/server.js`
- Estrutura da aplicação (registro dos middlewares e rotas) definida no `src/app.js`
- Configuração de cada rota definida no `src/routes.js`

---

Instalamos a dependência de desenvolvimento `nodemon`, que monitora as alterações nos arquivos e reinicia o servidor automaticamente. Configuramos a propriedade "script" no `package.json` para iniciar o arquivo `server.js` pelo nodemon através do comando `yarn dev` no terminal.

```json
// package.json
{
  // ...
  "scripts": {
    "dev": "nodemon src/server.js"
  }
  // ...
}
```

Instalamos a dependência de desenvolvimento `sucrase`, que permite utilizarmos no ambiente Node a nova sintaxe do EcmaScript em importações e exportações de arquivos JavaScript (ao invés da sintaxe antiga do CommonJS). Optamos por essa dependência, mas também poderia ser o Babel ou alguma outra.

Após instalação, no terminal, para iniciar o servidor, ao invés do comando:

```
node src/server.js
```

Utilizamos:

```
yarn sucrase-node src/server.js
```

Configuramos o nodemon no arquivo `nodemon.json` para utilizar a sintaxe do sucrase (`sucrase-node [nome-do-arquivo]`) ao invés da sintaxe padrão `node [nome-do-arquivo]`, assim, podemos continuar utilizando o comando `yarn dev` para iniciar o servidor. Dessa forma o servidor continua reiniciando automaticamente a cada alteração e também aceita a nova sintaxe de importação/exportação.

Fizemos as alterações em todos os arquivos JavaScript para a nova sintaxe de importação e exportação.

---

## Docker

O Docker é uma ferramenta para controlar os serviços externos da nossa aplicação (envio de e-mail, base de dados, etc). Ele cria ambientes isolados para a utilização desses serviços. Esses ambientes são conhecidos como containers. Os containers funcionam como sub-sistemas para que os serviços não alterem arquivos ou configurações do nosso sistema primário. Para se comunicar, os containers expõem portas de comunicação (mongodb costuma usar a porta `:27017` e postgres a porta `:5432`).

Conceitos do Docker:

- Imagem: são os serviços disponíveis para utilização (postgres, mysql, redis)
- Docker Registry (Docker Hub): Onde encontramos as imagens do Docker
- Container: é a instância de uma imagem (podemos ter uma mesma imagem que roda em containers diferentes)
- Docker file: Define a receita para criamos nossas próprias imagens do zero em um novo ambiente para nossas próprias aplicações

Buscamos por Docker CE (Community Edition) e vimos como instalá-lo no nosso sistema. Apenas o Windows 10 aceita a versão mais recente do Docker, do contrário, temos que instalar a versão legacy (Docker Toolbox).

Para iniciar o docker no terminal atual, utilizamos os comandos:

```
docker-machine start
docker-machine env
```

Confirmamos que funcionou verificando a versão com o comando:

```
docker -v
```

ou

```
docker help
```

Buscamos por Docker postgres no Google e acessamos o site do Docker Hub para verificar como instalar esse serviço. Instalamos através do comando no terminal:

```
docker run --name dtbase -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres
```

E verificamos que o serviço dessa base de dados está ativo através do comando:

```
docker ps
```

Instalamos e executamos a ferramenta `Postbird` para acessar a conexão com o banco de dados utilizando as seguintes informações:

- Host: 192.168.99.100 (no Windows esse é o IP que utilizamos, localhost não funciona)
- Port: 5432
- Pass: docker

Após acessar o banco de dados no Postbird, criamos a base de dados chamada `gobarber` com o encoding `UTF8 (Client encoding)`. As demais operações serão feitas através da aplicação Node.

Comandos úteis:

Para de executar o container:

```
docker stop dtbase
```

Executa o container:

```
docker start dtbase
```

Mostra todos os serviços/containers, ativos ou inativos:

```
docker ps -a
```

Mostra o log do Docker (caso ocorra algum problema):

```
docker logs
```

O container que criamos pode ser utilizado por qualquer aplicação (e não por apenas uma aplicação específica).

---

Configuramos as ferramentas para manter um mesmo padrão de escrita de código (entre desenvolvedores diferentes).

O módulo do Node ESLint faz o linting do código, ou seja, verifica se o código está seguindo alguns padrões.

Instalamos a dependência de desenvolvimento ESLint:

```
yarn add eslint -D
```

Após instalação, criamos o arquivo de configuração (`.eslintrc.js`):

```
yarn eslint --init
```

Nas respostas das perguntas de configuração, selecionamos:

- **How would you like to use ESLint?**  
  To check syntax, find problems, and enforce code style

- **What type of modules your project use?**  
  JavaScript modules (import/export)

- **Which framework does your project use?**  
  None of these

- **Where does your code run?**  
  Node

- **How would you like to define a style for your project?**  
  Use a popular style guide

- **Which sytle guide do you to follow?**  
  Airbnb

- **What format do you want your config file to be in?**  
  JavaScript

- **Would you like to install them now with npm?**  
  Yes

As instalações das dependências foram feitas pelo `npm` e o arquivo `package-lock.json` (cache do npm) foi criado. Como estamos utilizando o `yarn` deletamos esse arquivo e fizemos o mapeamento das novas dependências instaladas no `yarn.lock` através do comando:

```
yarn
```

Para o linting funcionar também é necessário instalar a extensão ESLint no editor VSCode. Após a instalação, ao abrir um arquivo `.js` o editor já indica alguns erros.

Para que os erros detectados pelo ESLint sejam corrigidos automaticamente ao salvar o arquivo, nas configurações do editor (`settings.json`), setamos as variáveis `eslint.autoFixOnSave` e `eslint.validate` (com `autoFix: true`).

Setamos algumas regras adicionais na propriedade `rules` do arquivo `.eslintrc.js` para que o ESLint não mostre erros em alguns casos.

Ao abrir o arquivo `src/app.js` e salvar, alguns erros já foram corrigidos (como trocar aspas duplas por aspas simples e adicionar ponto e vírgula no final das linhas).

---

O módulo do Node Prettier faz a verificação de regras de código adicionais, como a formatação do código em uma ou mais linhas e o tipo de final de linha (lf ou crlf). É feito para deixar o código mais "bonito".

Instalamos o Prettier e módulos complementares para poder integra-lo ao ESLInt:

```
yarn add prettier eslint-config-prettier eslint-plugin-prettier -D
```

Modificamos o arquivo `.eslintrc.js`, adicionando o `prettier` nas propriedes `extends`, `plugins` e `rules`.

Para o prettier funcionar também é necessário instalar a extensão Prettier no editor VSCode.

Ao acessar o arquivo `app.js` e salvar, o arquivo foi formatado com aspas duplas pois a regra do prettier sobrescreveu a regra do ESLint. Para corrigir criamos o arquivo de configuração do prettier (`.prettierrc`), nele indicamos a regra de aspas simples e a regra de ter vírgulas no último item de arrays/objetos.

Corrigimos todos os arquivos através do comando:

```
yarn eslint --fix src --ext .js
```

---

A extensão EditorConfig do VSCode permite que o arquivo `.editorconfig` seja gerado ao clicar com o botão direito na pasta de um projeto. Nesse arquivo são definidas regras adicionais (como espaçamento, indentação, charset, etc) para que desenvolvedores com diferentes editores de código tenham o mesmo tipo de formatação.

(Essa é apenas uma extensão pro editor, não é necessário instalar nenhum módulo do Node)

---

## Object relational mapping

ORM (Object relational mapping) é uma forma de abstrairmos o banco de dados. Na arquitetura MVC (Model, View, Controller), por exemplo, uma tabela do banco chamada `users` vira um Model chamado `User.js`. Os dados são manipulados através de código JavaScript na maioria das vezes (ao invés de código SQL). Dessa maneira, conseguimos até mesmo utilizar um mesmo código JavaScript para diferentes bancos de dados (um SQL, outro Postgress por exemplo).

O Sequelize é um ORM para lidar com banco de dados relacionais (como SQL, Postgress, SQLite).

No Sequelize utilizamos a Migration, que é um controle de versão para a base de dados. Ela mantem a base de dados atualizada entre os desenvolvedores, tanto no ambiente de desenvolvimento quanto no ambiente de produção.

Cada arquivo de Migration contém instruções para criação, alteração ou remoção de tabelas ou colunas. A ordenação de cada arquivo de migration ocorre por data. Cada migration serve para apenas uma tabela.

Enquanto a migration está somente no ambiente local de um desenvolvedor, ela pode ser alterada e re-utilizada, porém, quando essa migration é compartilhada com outros desenvolvedores ou enviada para o ambiente de produção qualquer alteração não pode ser feita através dessa mesma migration, nesse caso, é necessário criar outra migration para fazer outras alterações.

No Sequelize também podemos utilizar Seeds, que é uma maneira de popular a base de dados com informações fake pra visualizar o sistema funcionando ou para realizar testes automatizados. Os Seeds são executáveis apenas por código. Eles não são utilizados em produção, para esses casos, é melhor utilizar a Migration.

---

Utilizaremos a arquitetura MVC, que é uma maneira de estruturamos o nosso projeto e separarmos as responsabilidades de cada tipo de arquivo.

**M - Model**  
Armazena a abstração do banco de dados

**C - Controller**  
Ponto de entrada das requisições e definição de grande parte das regras de negócio. Pode ou não utilizar os Models.

**V - View**  
Retorno ao cliente, podendo ser HTML, ou, no caso de uma API REST, um objeto JSON

---

Instalamos a dependência `sequelize`.

Instalamos a dependência de desenvolvimento `sequelize-cli`, que utilizaremos para criar migrations, executar migrations, criar Models, etc.

Configuramos a estrutura da aplicação para poder utilizar o `sequelize`.

```
├── .sequelizerc
│
└─┬ src/
  ├─┬ config/
  │ └── database.js
  │
  ├─┬ database/
  │ └── migrations/
  │
  └─┬ app/
    ├── controllers/
    └── models/
```

Em todos os arquivos utilizados para configurar o `sequelize` (`.sequelizerc` e `src/config/database.js`), utilizamos a sintaxe antiga de importação e exportação (`require`/`module.exports`) pois a nova forma de importação (`import`/`export`) não é suportada pelo `sequelize`.

No arquivo `.sequelizerc` definimos os caminhos dos arquivos e pastas criadas.

Antes de configurar as credenciais para acessar o banco de dados, para utilizar o dialeto `PostgreSQL`, de acordo com a documentação do `sequelize` é necessário adicionar algumas dependências:

```
yarn add pg pg-hstore
```

No arquivo `src/config/database.js`, definimos as credenciais para acessar o banco de dados (dialect, host, username, password, database, timestamps, underscore).

No arquivo `src/app.js` criei o método `database` para realizar um teste de conexão e exibir uma mensagem de sucesso ou fracasso no console.

---

## Criação da Migration de usuários

Utilizamos o `sequelize-cli` para criar a tabela de usuários:

```
yarn sequelize migration:create --name=create-users
```

O arquivo `...-create-users.js` foi criado automaticamente na pasta `src/database/migrations` com o método `up`, para quando a Migration é executada e o método `down`, para quando precisamos reverter alterações (rollback).

Modificamos o arquivo gerado, incluindo dentro do método `up` todos os campos do usuário, sendo que os campos `created_at`, `updated_at`, `id` e `provider` serão preenchidos automaticamente.

(**Importante:** erros no preenchimento das propriedades desse arquivo podem causar o erro `Dialect needs to be explicitly supplied as of v4.0.0` ao executar a Migration.)

Executamos a Migration (método `up`):

```
yarn sequelize db:migrate
```

Pela ferramenta Postbird verificamos que a tabela `users` foi criada com sucesso. Existe também uma tabela padrão chamada `SequelizeMeta` que armazena todas as migrations que o banco de dados já recebeu, assim o `sequelize` sabe quais migrations já foram executadas ou não.

Antes de enviarmos a última Migration para produção ou compartilha-la com outros devs, ainda conseguimos reverter as últimas alterações nela através do comando:

```
yarn sequelize db:migrate:undo
```

Ao executar esse comando, a tabela `users` e a informação gravada na tabela `SequelizeMeta` desapareceram da base de dados. Foi apenas um teste, então executamos a Migrate novamente para que a tabela `users` exista.

Caso necessário, também conseguimos reverter todas as Migrations executadas:

```
yarn sequelize db:migrate:undo:all
```

---

## Criação do Model de usuário

Criamos o arquivo `src/app/models/User.js`, que é reponsável por manipular os dados da tabela `users` do banco de dados (criar, alterar ou excluir). Dentro do arquivo definimos a classe `User`, que extende a classe `Model` do `sequelize`. Nessa classe indicamos as colunas que recebem informações do usuário do sistema e o tipo de dado de cada coluna.

---

Movemos a conexão com o banco de dados do `src/app.js` para um arquivo separado `src/database/index.js` e importamos esse novo arquivo para dentro do `src/app.js`.

---

## Criando loader de models

Após fazer a conexão com o banco de dados no arquivo `src/database/index.js`, importamos e inicializamos todos os Models para que eles possam ser utilizados pela aplicação.

Para testar, no arquivo `src/routes.js`, importamos o Model `User` e utilizamos ele para cadastrar um novo `user` no banco de dados quando a rota `/` é acessada.

Ao acessar a rota `/`, no console foi retornada a Query executada, no navegador foi retornado o arquivo JSON com os dados de `user` e pelo Postbird também verificamos que os dados apareceram na tabela.

---

## Definindo rota para criação de usuário. (Create/store)

Criamos o arquivo `src/app/controllers/UserController.js`, onde definimos a classe `store`, responsável por criar um usuário com base nos dados recebidos no corpo da requisição via objeto JSON e por retornar o usuário criado.

No arquivo de rotas (`src/routes.js`), removemos a rota de teste (`/`) e criamos uma nova rota de acesso via post para o cadastro de um novo usuário. Importamos o `UserController` e associamos a essa nova rota.

Realizamos o teste através do Insomnia e cadastramos um novo usuário.

---

Ao tentar cadastrar um novo usuário com o mesmo e-mail, o servidor trava (pois é um campo único), por isso adicionamos no `UserController` um filtro para verificar se o email já existe antes de tentar realizar a criação de um novo usuário.

Muitas informações são retornadas após a criação de um usuário, por isso também modificamos o `UserController` para retornar apenas as informações relevantes.

---

## Gerando hash da senha do Usuário

Para fazer a encriptação da senha, instalamos o módulo do Node chamado `bcrypt`:

```
yarn add bcrypt
```

No arquivo `UserController` importamos esse módulo, adicionamos um campo virtual chamado `password` (modificamos o envio no Insomnia também). Esse campo recebe a senha caso o usuário tenha preenchido. Antes de salvar no banco de dados, conseguimos alterar essa informação através dos `hooks`, que são funcionalidades do `sequelize` para executar trechos de código automaticamente com base em ações que acontecem no Model, como por exemplo: conseguimos utilizar o hook `beforeSave` para modificar a informação antes da ação de salvar. Dessa forma, caso o usuário preencha a senha, geramos o hash a partir desse dado e armazenamos na coluna `password_hash` do banco de dados.

---

## Conceito de JWT (Jason Web Token)

JWT é uma forma de realizarmos autenticação em APIs RESTfull utilizando objetos JSON ao invés de Cookies de sessão (utilizados em aplicações MVC tradicionais com HTML nas Views).

Por exemplo, após fazer a requisição para uma rota `POST` chamada `/sessions` para criar uma sessão, verificamos se os dados de `email` e `password` estão corretos (fazendo uma consulta ao banco de dados), e, se os dados estiverem corretos, geramos um Token JWT através do módulo `jwt`.

O Token JWT é um conjunto de informações criptografadas divididas em 3 partes:

- **Headers**: Tipo de token, qual o algoritimo de criptografia (usamos `JWT`, mas existem vários tipos)
- **Payload**: Qualquer dado adicional (não sensíveis) que vamos precisar utilizar posteriormente (como o `id` do usuário, para saber qual usuário se autenticou)
- **Assinatura**: Informação que garante que o token não foi modificado antes de ser enviado de volta pro servidor.

Após a criação de uma sessão e a geração desse Token JWT, a string do token é retornada pro usuário para que ele possa utiliza-la nas requisições de rotas restritas da aplicação, onde é necessário estar autenticado/logado.

---

## Autenticação de Usuário utilizando JWT

Para criar essa nova característica (feature) da aplicação, pensamos com qual tipo de entidade estamos lidando, e, como vamos criar uma nova sessão (e não um novo usuário), criamos o arquivo para lidar com essa nova entidade.

Também lembramos que cada para cada entidade é necessário um Controller diferente e cada Controller é limitado a ter no máximo 5 métodos (index, show, store, update, delete).

Portanto, como o método `store` do `UserController` já está sendo utilizado para criar um novo usuário, faz sentido criarmos um `SessionController` com o método `store` para criar uma sessão. Ou seja, apesar de utilizarmos o usuário para validar a autenticação e criar uma sessão, o que está sendo criado é uma sessão e não um usuário.

Criamos o arquivo `src/app/SessionController.js`, e nele definimos o método `store`, que retorna os dados do usuário (id, name, email) caso o e-mail informado exista na base de dados e caso a senha esteja correta.

Criamos a rota `/sessions` do tipo `POST` e associamos a ela o método `store` do Controller `SessionController`.

No Insomnia, criamos uma nova requisição para essa nova rota e testamos.

Movemos a verificação de senha para dentro do Model `User` pois não se trata de uma regra de negócio.

Adicionamos o módulo `jwt` e utilizamos ele no `SessionController` para gerar um token, para isso informamos ao método `sign` o `Payload` (para uso posterior), a chave secreta (que deve ser única no mundo inteiro para essa aplicação) e em quanto tempo o token expira.

Site para gerar chaves secretas com base em uma string:  
[https://www.md5online.org/](https://www.md5online.org/)

No Insomnia, testamos novamente e agora, além dos dados do usuário, também recebemos a string do Token JWT.

Movemos os configurações da geração de Token JWT para um arquivo externo (`src/config/auth`).

---

## Definição do middleware de autenticação.

Algumas rotas são restritas apenas para usuários que estejam logados na aplicação, como por exemplo a rota de atualização de um usuário (ou seja, não deve ser possível atualizar um usuário sem estar autenticado). Por isso, temos que verificar se um usuário está logado em algumas rotas específicas, para isso utilizamos um `middleware`.

No arquivo `src/routes.js` criamos a rota `/users` do tipo `PUT` e associamos ela ao método `UserController.update`. Essa rota será responsável por realizar a atualização de um usuário específico. Também criamos essa rota no Insomnia para testar se está funcionando.

Criamos o arquivo `src/app/middlewares/auth.js` para verificar o token informado pelo cliente e só deixar o fluxo prosseguir normalmente se o token for válido. Se o token for inválido ou se não for informado é retornado um erro.

Quando o token é válido e decodificado com sucesso, os dados retornados em um objeto são:

- `id`: o valor do id que definimos quando o token foi criado
- `iat`: issued at, quando o token foi criado
- `exp`: expiration, timestamp de quando o token irá expirar

Editamos o arquivo `src/routes.js`, adicionando o middleware de autenticação (`authMiddleware`).

Editamos o `UserController` para retornar pro usuário o `id` que esta na variável `req.userId` (preenchido pelo middleware `authMiddleware` após a decodificação do token).

No Insomnia, editamos o método `PUT`, informando o token que geramos anteriormente. O Token pode ser informado tanto na segunda aba (de autenticação), selecionando a opção 'Bearer Token' e preenchendo o campo 'TOKEN' somente com a string do token (sem o `Bearer`), quanto na aba `Header`, preenchendo o campo `Header` com o texto `Authorization` e o campo `value` com a string `Bearer ...token...`. O `Bearer` é um padrão utilizado nesse tipo de autenticação (`JWT`).

Enviamos a requisição `PUT` e recebemos o retorno do `id` do usuário.

---

Modificamos a função assíncrona `jwt.verify` para utilizar o padrão `async`/`await`, ao invés de padrão antigo de `callback`. Fizemos isso através da função `promisify` do módulo `util` do node.

---

Modificamos o `UserController` para, no caso de atualização de senha, realizar uma verificação antes de qualquer busca de dados no banco. Caso o `password` seja preenchido, verificamos se o `oldPassword` está preenchido (os dois dados são necessários) e, em caso negativo, paramos o fluxo e retornamos um erro de senha obrigatória.

Após essa primeira checagem, modificamos o `UserController` para buscar o `user` no banco de dados com base no `id` decodificado do token. Utilizamos essas informações para:

- No caso de atualização de e-mail, conferir se o e-mail digitado é diferente do e-mail cadastrado e, se for, também conferir se não existe outro usuário cadastrado com esse e-mail através do método `findOne`

- No caso de atualização de senha, conferimos se a senha anterior é igual a senha do banco de dados através do método `checkPassword`

Caso o fluxo passe por todas as condições, o usuário é atualizado através do método `update` e as informações são retornadas para o cliente.

---

Instalamos o módulo Yup, que faz um Schema validation - uma maneira de validar os campos recebidos no corpo da requisição.

Alteramos o `SessionController`, importando o `Yup` e adicionando a validação dos campos `email` e `senha`. Caso a validação funcione, retornamos um erro pro cliente.

Testamos as alterações no Insomnia.

---

Alteramos o `UserController.store`, importando o `Yup`.

Adicionamos a validação dos campos `name`, `email` e `password` via Yup. Caso a validação do Yup não funcione, retornamos um erro pro cliente.

Alteramos o `UserController.update`.

Adicionamos a validação dos campos `name`, `email`, `oldPassword`, `password` e `confirmPassword` via Yup. Validação do campo `oldPassword` feita anteriormente via `if` foi removida (campo obrigatório, quando `password` for preenchido). No trecho que checa a senha no banco de dados, também incluímos no `if` a verificação da variável `password`, pois, se o cliente preencher somente a variável `oldPassword` (e não preencher a `password`), não é necessário fazer essa verificação já que a senha não será modificada (já que o campo `password` estará vazio nesse caso).

Caso a validação do Yup não funcione, retornamos um erro pro cliente.

Testamos as alterações no Insomnia.

---

## Início da Parte 02

Servidor da aplicação iniciado:
```
yarn dev
```

Servidor do banco de dados iniciado (através do Docker):
```
docker-machine start && docker-machine env && docker start dtbase
```
---

## Implementando o upload de arquivos

Na nossa aplicação os provedores de serviço poderão ter uma foto de avatar, por isso será necessário implementar o upload de arquivos.

Podemos fazer o upload das seguintes formas (optamos pela segunda):

- Junto com as informações do usuário, ao cadastrá-lo no banco de dados.
- Separado das informações do usuário, de maneira isolada. O upload é feito ao selecionar uma nova imagem, um `id` com a referência dessa imagem é gerado e esse `id` pode ser enviado junto com as outras informações no formato JSON (já que objetos JSON não suportam uploads de arquivo).

Para implementar essa funcionalidade, instalamos o módulo `multer`, que é responsável por receber arquivos com o tipo de corpo `Multipart Form Data` para envio de arquivos físicos (ao invés do tipo de corpo de um objeto `JSON`):

```
yarn add multer
```

Na raiz da aplicação, criamos as pastas `tmp/uploads`, que é onde ficarão os arquivos enviados pelo cliente.

Criamos o arquivo de configuração do Multer em `src/config/multer.js`.

No arquivo de configuração, precisamos definir o tipo de armazenamento na propriedade `storage`, que pode ser:

- Em um CDN (Content Delivery Network): servidores feitos para armazenamento de arquivos físicos, como por exemplo o "Amazon S3" ou o "Digital Ocean Spaces".
- Em disco, junto com a aplicação.

Para essa aplicação, optamos pela segunda opção.

Na propriedade `storage` definimos o tipo de armazenamento como em disco através do método `diskStorage`. Nesse método, enviamos um objeto com:

- `destination`: o local onde cada imagem será salva (`tmp/uploads`);
- `filename`: função para alterar o nome do arquivo antes de salvá-lo.

Após realizar essa primeira configuração, alteramos o arquivo `src/routes.js` para importar o `multer`, as configurações do `multer` e também para definir a rota de upload dos arquivos (por enquanto, para esse teste, não criamos o arquivo de Controller).

Na rota criada, antes de retornar uma resposta pro cliente, definimos o middleware `single('file')` do objeto `multer` que receberá o upload de um único arquivo no campo `file`.

No Insomnia, criamos uma nova requisição do tipo `POST` apontando para a rota `/files`. No tipo de dado enviado selecionamos `Multiparm Form`, definimos o nome do campo como `file` e selecionamos um arquivo para upload. Na aba "Auth", inserimos o `token` do usuário, pois será necessário estar logado para definir uma foto pro avatar. Enviamos a requisição, recebemos a resposta e o arquivo de imagem foi criado na pasta `tmp/uploads`.

---

Para que os uploads tenham utilidade, é preciso associar o arquivo criado ao usuário que fez o upload do arquivo. Para isso, é necessário existir uma tabela `files` para registrar cada arquivo criado, e também, é necessário um campo `avatar_id` (chave estrangeira) na tabela `users` que guarda um `id` específico da tabela `files` para fazer a associação/relacionamento.

## Registro de um Arquivo (Avatar) no BD 

Criamos a migration de arquivos:
```
yarn sequelize migration:create --name=create-files
```

Modificamos a migration (usando o arquivo `create-users` como exemplo) e os campos definidos foram `id`, `name` (nome original do arquivo), `path` (nome do arquivo salvo na pasta `tmp/uploads`).

Com os campos definidos, executamos a migration para criar a tabela no banco de dados:
```
yarn sequelize db:migrate
```

Vimos a tabela `files` criada no Postbird (sem nenhum conteúdo por enquanto).

Com a tabela `files` criada, definimos o Model dessa tabela no arquivo `src/app/models/File.js` com os campos `name` e `path`.

Alteramos o arquivo `src/database/index.js` para importar o novo Model de Arquivo (`File`).

Criamos o Controller `FileController`, importamos o model `File`, criamos o método `store`, e nele, utilizando as informações que são preenchidas pelo middleware `upload.single` após o upload de um arquivo, criamos um novo registro na tabala `file` com o nome original do arquivo (`name`) e o nome do arquivo salvo (`path`) e retornamos esses dados pro cliente.

Modificamos o arquivo `src/routes.js` para utilizar o método `FileController.store`.

No Insomnia, criamos um novo arquivo através da rota `/files` (POST), e vimos o registro desse arquivo no Postbird, o `id` desse registro poderá ser utilizado na atualização de um usuário. 

---

## Relacionamento entre tabelas de Usuário e Arquivo (Avatar)

Para associar os registros da tabela `files` a um usuário específico, é necessário criar uma nova coluna na tabela `users` para armazenar a chave estrangeira. Poderíamos editar a migration `users`, mas como cronologicamente a tabela `files` foi criada depois da tabela `users` e o novo campo vai precisar ter a referência da tabela `files`, não faz sentido desfazer todas as Migrations agora. A melhor abordagem nesse caso é definir uma nova Migration apenas para a criação dessa nova coluna.

```
yarn sequelize migration:create --name=add-avatar-field-to-users
```

Alteramos essa Migration para adicionar a coluna `avatar_id` dentro da tabela `users` utilizando como referência o campo `id` da tabela `files`. O campo também é alterado automaticamente quando alteramos o registro da tabela `files` (`CASCADE`) e definido como nulo se o registro da tabela `files` for deletado.

Após definição das regras da nova coluna, executamos a Migration:
```
yarn sequelize db:migrate
```
Ao acessar a tabela via Postbird, vimos que todos os registros de `users` agora possuem um campo `avatar_id` definido como nulo.

Com a nova coluna criada na tabela `users`, também alteramos o Model `User` para que essa associação seja feita: para isso criamos um método chamado `associate`, e nele chamamos o método `belongsTo` do Model `User` para associar o campo `avatar_id` do Model `User` ao Model `File` como uma chave estrangeira.

Alteramos o arquivo `src/database/index.js` para executar o método `associate` quando ele existir.

Modifiquei o `UserController.update` para também retornar o `avatar_id` pro cliente após a atualização dos dados.

No Insomnia, modificamos um usuário através da rota `/users` (PUT) informando o `id` do arquivo no novo campo `avatar_id` e vimos no Postbird que o registro foi alterado.

---

## Definição da rota estática para entrega das imagens (avatares) dos usuários

No arquivo `src/app.js` definimos uma rota estática `/files` para que o cliente possa acessar as imagens da pasta `tmp/uploads` via URL.

---

## Definição da rota que busca todos os Usuários Provedores 

Sabendo que o `Provider` é um tipo de entidade (que é um tipo `User` específico), criamos o arquivo `ProviderController`, responsável por lidar apenas com esse tipo de entidade.

No arquivo criado, criamos o método `index`, onde buscamos apenas por usuários que possuem o atributo `provider: true` e editamos o resultado para retornar apenas o `id`, `name`, `e-mail` e `avatar_id` de cada Provedor.

Em `src/routes` definimos a nova rota `/providers` do tipo `GET` e associamos ao método `index` do `ProviderController`.

No Insomnia, criamos uma nova requisição para `/providers` do tipo `GET`, definimos o `token` na aba `Auth` (é necessário estar logado) e testamos. O retorno foi um Array com objetos de cada Usuário que é um Provedor.

---

## Modificando rota que retorna todos os provedores para também informar os dados do Arquivo relacionado

No Model `File`, adicionamos um campo virtual que retorna a informação da URL completa para uso no Front-End.

No `ProviderController`, editamos o método `index`, incluindo o Model `File` e os campos a serem retornados.

No Model `User`, definimos o alias `avatar`, para o retorno vir dentro de uma propriedade com o nome `avatar` ao invés do nome `File`.

Em `ProviderController` também definimos o alias `avatar`.

Testamos as modificações no Insomnia e as informações do Arquivo relacionado ao Provedor também foi retornada, incluindo o `name`, o `path` e a `url`.

---

## Criação da tabela de agendamentos no BD (appointments)

Criamos a Migration de agendamentos:

```
yarn sequelize migration:create --name=create-appointments
```

Após criação, alteramos o arquivo para definir os campos:
- `date`: Data do agendamento;
- `user_id`: Id do usuário que tem o agendamento marcado com outro Usuário prestador de serviços;
- `provider_id`: Id do usuário que prestará o serviço;
- `canceled_at`: Data do cancelamento (caso ocorra); 

Com os campos definidos, executamos a Migration para criar a tabela:

```
yarn sequelize db:migrate
```

Conferimos que a tabela foi criada no Postbird.


## Criação do Model de agendamentos (Appointment)

Criamos o arquivo `src/app/models/Appointment.js`, onde definimos os campos `date`, `canceled_at` e o relacionamento entre o Model `Appointment` e o Model `User`.

Modificamos o arquivo `src/database/index.js` para importar o Model `Appointment` (e executar a função `associate`).

---

## Criação da rota para criação de agendamentos

Criamos o arquivo `src/app/controllers/AppointmentController.js` e o método `store`.

Modificamos o arquivo `src/routes.js`, criando uma nova rota `/appointments` do tipo `POST` e associando essa rota ao método `store` do `AppointmentController`.

No Insomnia, criamos uma nova pasta chamada `Appointments` e nela criamos uma nova requisição chamada `Create` do tipo `POST` que aponta para `/appointments`. Teste indica que a rota está funcionando.

---

## Criação de agendamento

Editamos o `AppointmentController` e incluímos o Model `Appointment` para fazer o cadastro no banco de dados com as informações recebidas via objeto JSON no corpo da requisição. Recebemos o campo `provider_id`, o campo `date` no corpo da requisição e obtemos o `user_id` na variável `req.userId` (preenchida pelo middleware de autenticação). Efetuamos o cadastro utilizando esses dados e retornamos o objeto do Agendamento criado na resposta pro cliente.

No Insomnia, logamos com o `token` de um usuário comum (que não é prestador de serviços). No objeto JSON informamos no campo `provider_id` o `id` de um usuário que é prestador de serviços e no campo `date`, colocamos uma data no formato `2019-08-29T15:00:00-03:00` (29/08/2019 15hrs com -3GMT do fuso horário/timezone). O agendamento foi criado no banco de dados.

---

## Validação inicial na criação de agendamento

No `AppointmentController`, importamos o módulo `Yup` para fazer a validação inicial dos campos. Também foi adicionada uma verificação que confere se o usuário recebido (`provider_id`) é realmente um prestador de serviços antes de realizar o cadastro no banco de dados.

---

## Validação na criação de agendamento de acordo com as regras de negócio

Será necessário verificar se a data/hora informada pelo Usuário já passou e se a já existe algum agendamento nessa data/hora. Para lidar com datas, instalamos o módulo date-fns em sua última versão:

```
yarn add date-fns@next
```

No `AppointmentController` importamos alguns métodos do módulo `date-fns`, utilizados para formatar e verificar datas.

Verificamos se a data selecionada pro agendamento não é uma data passada (deve ser uma data futura).

Também verificamos se a data selecionada pro agendamento com o prestador de serviço indicado já não está sendo utilizada.

Testes realizados pelo Insomnia.

---

## Definição da rota para listagem de agendamentos (do Usuário Comum)

No `AppointmentController` criamos o método `index`, responsável por listar todos os agendamentos de um usuário específico. Em cada item da listagem é retornado a data do Agendamento, o Prestador e qual o avatar (Arquivo) desse Prestador.

Em `routes` criamos a rota `/appointments` do tipo `GET` e associamos ao método `index` do `AppointmentController`.

No Insomnia foi criada a rota `/appointments` do tipo `GET` para realização dos testes.

---

## Listagem de agendamentos com base no número da página

No `AppointmentController` editamos o método `index` para guardar o dado `page` que vem através dos `Query params` via URL. Utilizamos esse dado como filtro do que será retornado para o cliente. 

No `Insomnia`, dentro da aba `Query` definimos o parâmetro `page` e testamos com diferentes números.

---

## Definição da rota para listagem de agendamentos (do Usuário Prestador)

Criamos o `ScheduleController` com o método `index`, responsável por listar todos os agendamentos do prestador logado. Em cada item da listagem é retornado o `id` e a data do Agendamento.

Em `routes` criamos a rota `/schedule` do tipo `GET` e associamos ao método `index` do `ScheduleController`.

Como essa rota é de uso exclusivo de um Usuário Prestador, modifiquei as variáveis do Insomnia, definindo uma variável chamada `token_user` para as rotas do usuário comum (como a rota `/appointments`) e a variável chamada `token_provider` para as rotas do usuário prestador (como a rota `/schedule`).

No Insomnia foi criada a rota `/schedule` do tipo `GET` e configurado o `token_provider` para realização dos testes.

---

## Filtrando pelo dia informado na requisição

No `ScheduleController`, importamos alguns métodos do `date-fns` e o objeto `Op` do `sequelize` para adicionar um filtro na busca por agendamentos do Prestador.

Utilizamos a variável `date` do `Query Params` da requisição, convertemos a data utilizando os métodos do `date-fns` e utilizamos o objeto `Op` para filtrar entre (`between`) o início e o final do dia informado.

No Insomnia, adicionamos o `Query Param` `date` para realização dos testes.

---

## Validação de Usuário Prestador na listagem dos agendamentos

No `ScheduleController`, adicionamos uma checagem que verifica se o usuário logado é mesmo um prestador de serviços.

Testes realizados no Insomnia utilizando a sessão (token) de um Usuário comum (`token_user`) e de um Usuário Prestador (`token_provider`).

---

## Configurando acesso ao banco de dados não relacional MongoDB

Para trabalharmos com dados não relacionais e que precisam ser obtidos de forma performatica, optamos por utilizar o banco de dados MongoDB. Baixamos e inicializamos esse serviço através do Docker:

```
$ docker run --name mongobarber -p 27017:27017 -d -t mongo
```

Após inicialização, acessamos o endereço http://192.168.99.100:27017/ e recebemos a mensagem "It looks like you are trying to access MongoDB over HTTP on the native driver port.", indicando que funcionou.

Com o servidor do MongoDB iniciado, instalamos o módulo de ORM via Node chamado `mongoose` responsável por lidar com a conexão e a manipulação dos dados:

```
yarn add mongoose
```

Após a instalação, configuramos a conexão com o MongoDB no arquivo `src/database/index.js` através do método `mongoose.connect`. No primeiro parâmetro informamos a string com a URL de conexão e o nome da base de dados (no caso do MongoDB, a base de dados será criada automaticamente). No segundo parâmetro definimos as opções adicionais (configurando para aceitar a conexão via URL e para aceitar a busca e atualização de dados).

Testamos reiniciando o servidor, a ausência de erros indica que a conexão ocorreu normalmente.

---

## Guardando registros de Notificações a cada novo agendamento criado

O MongoDB utiliza um tipo de tabela mais flexivel e performática chamado "schema". Os schemas não precisam ter relacionamentos entre eles. A criação ou remoção de schemas ou campos de cada schema é facilitada e não necessita de `migrations` para esse tipo de operação. Cada registro pode ter campos diferentes. Também não é necessário inicializar cada um dos schemas (como é feito com cada Model no caso do PostgresSQL). Contudo, por conta dessa flexibilidade, é necessário manter a atenção com qualquer tipo de alteração na estrutura dos schemas.

Criamos o schema `Notification` e definimos os campos principais: `content` (mensagem), `user` (Prestador) e `read` (se foi lida ou não) para cada registro de Notificação.

Importamos o schema `Notifications` no `AppointmentController`, para criamos uma Notificação pro Prestador de serviço assim que o Usuário Comum realizar um agendamento.

No `AppointmentController` buscamos pelo Usuário logado para obter o nome dele. Também formatamos a data registrada no Agendamento utilizando a função `format` do `date-fns`, além de definir a localização como `pt` para que o mês exibido apareça em português. Utilizamos essas informações para criar o conteúdo da mensagem de Notificação. 

__Observação:__ Como não existe relacionamento, essa mensagem continuará com esses dados mesmo que o usuário modifique o nome dele, por exemplo. Isso também acontece em aplicações como o Discord, quando o usuário altera o nickname, as mensagens antigas continuam com o nickname antigo, pois o estado da aplicação era assim naquele momento. Isso é pra funcionar dessa maneira nesse tipo de contexto. Perdemos mesmo esse link, porém, ganhamos performance.

O único relacionamento necessário é com o `id` do Usuário Prestador, pois precisamos saber pra quem será enviada a Notificação.

Para visualizar os registros das Notificações criadas (assim como visualizamos as tabelas/registros do PostgresSQL via Postbird), instalamos o GUI criado pela própria empresa do MongoDB, chamado "MongoDB Compass Community". Através dele, fizemos a conexão com o MongoDB.

Ao criar um novo Agendamento, a base de dados `gobarber` e a collection (tabela) `notifications` foram criadas automaticamente. Dentro da collection `notifications` um registro/Document foi incluído .

Neste ponto temos a aplicação com um banco SQL para dados estruturados e relacionamentos (através do PostgresSQL com o ORM `sequelize`), e um banco No-SQL para dados não estruturados e performance (através do MongoDB com o ORM `mongoose`).

---

## Definição de rota para listar todas as Notificações (Index/GET)

Criamos o `NotificationController` com o método `index`, que tem a responsabilidade de validar se o Usuário logado é um Prestador, para depois buscar todas as notificações deste Usuário e retornar um objeto JSON com o limite de 20 registros (depois faremos a paginação) e ordenado em forma decrescente (modo pilha e não modo fila, ou seja, o mais recente é o primeiro da lista).

No ORM do MongoDB, os métodos são diferentes e para filtrar/formatar as informações recebidas, ao invés de definirmos isso no(s) argumento(s) do método,utilizamos a programação funcional (encadeamento de funções / chainning).

Em `routes.js` associamos o método `index` a rota `/notifications` do tipo `GET`.

No Insomnia configuramos a rota e testamos.

---

## Definição da rota de atualização da Notificação (marcar como lida) | (Update/PUT)

No `NotificationController` criamos o método `update` para atualizar o campo `read` da Notificação e marca-la como lida (alterando o valor para `true`).

Em `routes.js` criamos a nova rota do tipo `put` e associamos ao método `update`.

No Insomnia configuramos a rota e testamos.

---

## Definição da rota para cancelar um Agendamento (Delete/delete)

Definimos uma nova rota para deletar um agendamento, criando o método `delete` no `AppointmentController` e associando ele a rota definida em `routes.js`.

Antes de realizar o cancelamento, conferimos se o Usuário logado é o mesmo que está no registro do Agendamento e se o horário do agendamento está a mais de 2 horas de acontecer (regra de negócio). Caso passe nas validações, o campo `canceled_at` é atualizado com a data atual e os dados do registro atualizado é retornado pro cliente.

Rota configurada e testada via Insomnia.

---

## Utilização do módulo Nodemailer para envio de e-mails

Instalamos o módulo `nodemailer`:
```
yarn add nodemailer
```

Definimos as configurações de inicialização do `nodemailer` no arquivo `src/lib/mail.js` e as configurações do serviço de e-mail em si foram definidas no arquivo `src/lib/Mail.js`. Normalmente, serviços desses tipo (externos) são definidos dentro na pasta `lib` (e não nos Controllers, pois eles apenas utilizam o serviço).

Os dados utilizados na configuração do e-mail são da ferramenta Mailtrap, ela oferece uma caixa de entrada gratuíta para testes em ambiente de desenvolvimento. Quando a aplicação for ao ar, não é recomendado utilizar serviços de uso comum, como o Gmail ou Hotmail, pois existe um limite e podemos ser bloqueados, ao invés disso, podemos escolher alguma opção de serviço feito para disparar muitos e-mails:

* Amazon SES (utilizado pela Rocketseat);
* Mailgun;
* Sparkpost;
* Mandril (pra quem usa Mailchimp).

Com o `nodemailer` configurado, importamos e utilizamos ele no `AppointmentController` assim que um cancelamento é feito.

Ao realizar testes pelo Insomnia, recebemos a mensagem na ferramenta Mailtrap. 

---

## Definição do template de e-mail

Para os e-mails no formato HTML é interessante utilizarmos alguma template engine, que são módulos que permitem trabalharmos com modelos de arquivos HTML e com as variáveis do node, dentre outras funcionalidades.

A template engine escolhida foi a Handlebars. Para integrar essa template engine ao `express` e ao `nodemailer`, instamos os módulos:

```
yarn add express-handlebars nodemailer-express-handlebars
```

Criamos a estrutura de pastas e arquivos que serão utilizados pela template engine:
```
│
└─┬ app/
  │
  └┬ views/
   │   
   └──┬ emails/
      │
      ├─┬ layouts/
      │ │
      │ └─ default.hbs
      │
      ├─┬ partials/
      │ │
      │ └─ footer.hbs
      │
      └── cancelation.hbs
```

No arquivo `src/lib/Mail.js`, importamos os módulos instalados e definimos as configurações e os diretórios dos templates no método `configureTemplates`.

Com a estrutura de template configurada, definimos o layout padrão no arquivo `layouts/default.hbs` e, para o rodapé, que será repetido em todos os e-mails, importamos o partial `footer.hbs`.

Com o layout padrão configurado, definimos qual será e mensagem do e-mail HTML no arquivo `cancelation.hbs` utilizando as variáveis que serão definidas antes do envio.

Com o template definido, alteramos o `AppointmentController`, definindo as variáveis utilizadas pelo template e modificando o modo de envio (de `text` para `template`[com o `context`]).

No Insomnia, cancelamos um agendamento para testar e recebemos a mensagem na ferramenta Mailtrap.

---