import { Router } from 'express';
// importa o Model de User
import User from './app/models/User';

/**
 * Configuração do Roteamento que será utilizado pela aplicação
 */

const routes = new Router();

// ao acessar a rota '/'
routes.get('/', async (req, res) => {
  // utilizando o Model User, cadastra
  // um usuário na base de dados (processo assíncrono)
  const user = await User.create({
    name: 'Lucas Soares',
    email: 'cafecomlucas2@gmail.com',
    password_hash: '123456',
  });

  // retorna o usuário cadastrado
  res.json(user);
});

export default routes;
