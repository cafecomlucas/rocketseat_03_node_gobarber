import bcrypt from 'bcrypt';
import User from '../models/User';

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
      return res.status(400).json('User does not found.');
    }
    // Caso o usuário exista, guarda o id e o nome
    const { id, name } = user;

    // Confere a senha
    if (await user.checkPassword(password)) {
      // Caso a senha esteja correta, retorna os dados desse usuário
      return res.json({
        user: { id, name, email },
      });
    }
    // Caso a senha esteja incorreta, retorna um erro
    return res.status(400).json('Incorrect password');
  }
}

export default new SessionController();
