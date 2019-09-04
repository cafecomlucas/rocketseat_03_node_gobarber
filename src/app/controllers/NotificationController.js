import Notification from '../schemas/Notification';
import User from '../models/User';

class NotificationController {
  async index(req, res) {
    // Verifica se o usuário logado é realmente um Prestador de serviços
    const checkUserProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });
    if (!checkUserProvider) {
      return res
        .status(401)
        .json({ error: 'Only providers can load notifications' });
    }

    // Busca as notificações do Prestador logado
    const notifications = await Notification.find({ user: req.userId })
      .sort({ createdAt: 'desc' })
      .limit(20);

    return res.json(notifications);
  }

  async update(req, res) {
    // encontra a notificação do id informado no Route Params
    // atualiza e retorna o registro atualizado
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true } // configura para retornar o registro após a atualização
    );
    // devolve o registro pro cliente
    return res.json(notification);
  }
}

export default new NotificationController();
