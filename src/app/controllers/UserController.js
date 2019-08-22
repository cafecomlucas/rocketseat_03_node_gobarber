import User from '../models/User';

// Classe que controla a manipulação dos Models
class UserController {
  async store(req, res) {
    // Cria um novo usuário com os dados informados via JSON
    const user = await User.create(req.body);
    // Retorna o usuário criado
    res.json(user);
  }
}

export default new UserController();
