import jwt from 'jsonwebtoken';
import User from '../models/User';
import authConfig from '../../config/auth';

// Classe que manipula dos dados da Sessão de User
class SessionController {
  async store(req, res) {
    // Guarda as informações email e senha do corpo da requisição
    const { email, password } = req.body;

    // Procura o e-mail na base de dados
    const user = await User.findOne({
      where: {
        email,
      },
    });

    // Se nenhum usuário com o email informado for encontrado
    if (!user) {
      // Retorna um erro
      return res.status(401).json({ error: 'User does not found.' });
    }

    // Confere a senha
    if (!(await user.checkPassword(password))) {
      // Caso a senha esteja incorreta, retorna um erro
      return res.status(401).json({ error: 'Password does not match' });
    }

    // Caso o usuário exista e a senha esteja correta

    // Guarda o id e o nome do usuário
    const { id, name } = user;

    // Retorna os dados do usuário
    return res.json({
      user: { id, name, email },

      // Cria um novo Token JWT
      // jwt.sign([Payload], [Chave única no mundo inteiro], [Validade do token])
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expires,
      }),
    });
  }
}

export default new SessionController();
