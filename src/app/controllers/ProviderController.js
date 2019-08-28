import User from '../models/User';
import File from '../models/File';

class ProviderController {
  async index(req, res) {
    // busca todos os providers (provider:true)
    const providers = await User.findAll({
      where: { provider: true },
      attributes: ['id', 'name', 'email', 'avatar_id'],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });
    // retorna os providers pro cliente
    res.json(providers);
  }
}

export default new ProviderController();
