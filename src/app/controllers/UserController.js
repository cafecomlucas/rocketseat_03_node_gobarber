// Importamos tudo (*) pois o Yup não tem um export default
import * as Yup from 'yup';

import User from '../models/User';

// Classe que controla a manipulação dos Models de User
class UserController {
  // middleware a ser informado ao express, responsável pela criação de usuário
  async store(req, res) {
    // cria o schema de validação dos campos de um objeto (req.body)
    const schema = Yup.object().shape({
      // campo do tipo string, obrigatório
      name: Yup.string().required(),
      // campo do tipo string, no formato e-mail, obrigatório
      email: Yup.string()
        .email()
        .required(),
      // campo do tipo string, com no mínimo 6 caracteres, obrigatório
      password: Yup.string()
        .required()
        .min(6),
    });
    // valida os campos
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

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

  // middleware responsável pela atualização do usuário
  async update(req, res) {
    const { email, oldPassword, password } = req.body;

    // se o usuário não preencheu o campo oldPassword
    // mas tentou cadastrar uma nova senha
    if (password && !oldPassword) {
      // retorna um erro indicando que a senha é obrigatória
      return res.status(401).json({ error: 'Old password required' });
    }

    // busca o usuário do token decodificado
    const user = await User.findByPk(req.userId);

    // se o usuário informou o e-mail e
    // se o email informado for diferente na base de dados
    if (email && email !== user.email) {
      // verifica se o e-mail já está sendo utilizado por outro usuário
      const emailExists = await User.findOne({
        where: { email },
      });
      // retorna um erro caso o e-mail já exista
      if (emailExists) {
        return res.status(400).json('Email already exists.');
      }
    }

    // se usuário preencheu com a senha antiga corretamente
    // (para atualização com a nova senha [password])
    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      // Caso a senha esteja incorreta, retorna um erro
      return res.status(401).json({ error: 'Password does not match' });
    }

    // caso passe pelas condições acima,
    // atualiza o usuário com as infos recebidas via req.body
    const { id, name, provider } = await user.update(req.body);

    // retorna os dados atualizados
    return res.json({ id, name, email, provider });
  }
}

export default new UserController();
