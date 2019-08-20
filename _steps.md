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
