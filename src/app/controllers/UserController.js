import User from '../models/User';

// Classe que controla a manipulação dos Models de User
class UserController {
  // middleware a ser informado ao express, responsável pela criação de usuário
  async store(req, res) {
    // verifica se o e-mail já está cadastrado na base de dados
    const emailExists = await User.findOne({
      where: { email: req.body.email },
    });
    // retorna um erro caso o e-mail já exista
    if (emailExists) {
      return res.status(400).json('Email already exists.');
    }

    // Cria um novo usuário com os dados informados via JSON
    const { id, name, email, provider } = await User.create(req.body);

    // Retorna as informações relevantes do usuário criado
    return res.json({ id, name, email, provider });
  }
}

export default new UserController();
