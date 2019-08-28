import User from '../models/User';

class ProviderController {
  async index(req, res) {
    // busca todos os providers (provider:true)
    const providers = await User.findAll({
      where: { provider: true },
      attributes: ['id', 'name', 'email', 'avatar_id'],
    });
    // retorna os providers pro cliente
    res.json(providers);
  }
}

export default new ProviderController();
