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

---
