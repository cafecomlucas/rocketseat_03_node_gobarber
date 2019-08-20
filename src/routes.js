const { Router } = require("express");

/**
 * Configuração do Roteamento que será utilizado pela aplicação
 */

const routes = new Router();

routes.get("/", (req, res) => res.json({ message: "Hello world" }));

module.exports = routes;
