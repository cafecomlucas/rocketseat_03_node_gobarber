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

ORM (Object-relational mapping) é uma forma de abstrairmos o banco de dados. Na arquitetura MVC (Model, View, Controller), por exemplo, uma tabela do banco chamada `users` vira um Model chamado `User.js`. Os dados são manipulados através de código JavaScript na maioria das vezes (ao invés de código SQL). Dessa maneira, conseguimos até mesmo utilizar um mesmo código JavaScript para diferentes bancos de dados (um SQL, outro Postgress por exemplo).

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

Criação da Migration de usuários.

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

Criação do Model de usuário.

Criamos o arquivo `src/app/models/User.js`, que é reponsável por manipular os dados da tabela `users` do banco de dados (criar, alterar ou excluir). Dentro do arquivo definimos a classe `User`, que extende a classe `Model` do `sequelize`. Nessa classe indicamos as colunas que recebem informações do usuário do sistema e o tipo de dado de cada coluna.

---

Movemos a conexão com o banco de dados do `src/app.js` para um arquivo separado `src/database/index.js` e importamos esse novo arquivo para dentro do `src/app.js`.

---

Criando loader de models.

Após fazer a conexão com o banco de dados no arquivo `src/database/index.js`, importamos e inicializamos todos os Models para que eles possam ser utilizados pela aplicação.

Para testar, no arquivo `src/routes.js`, importamos o Model `User` e utilizamos ele para cadastrar um novo `user` no banco de dados quando a rota `/` é acessada.

Ao acessar a rota `/`, no console foi retornada a Query executada, no navegador foi retornado o arquivo JSON com os dados de `user` e pelo Postbird também verificamos que os dados apareceram na tabela.

---

Definindo rota para criação de usuário. (Create/store)

Criamos o arquivo `src/app/controllers/UserController.js`, onde definimos a classe `store`, responsável por criar um usuário com base nos dados recebidos no corpo da requisição via objeto JSON e por retornar o usuário criado.

No arquivo de rotas (`src/routes.js`), removemos a rota de teste (`/`) e criamos uma nova rota de acesso via post para o cadastro de um novo usuário. Importamos o `UserController` e associamos a essa nova rota.

Realizamos o teste através do Insomnia e cadastramos um novo usuário.

---

Ao tentar cadastrar um novo usuário com o mesmo e-mail, o servidor trava (pois é um campo único), por isso adicionamos no `UserController` um filtro para verificar se o email já existe antes de tentar realizar a criação de um novo usuário.

Muitas informações são retornadas após a criação de um usuário, por isso também modificamos o `UserController` para retornar apenas as informações relevantes.

---

---
