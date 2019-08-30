import { startOfDay, endOfDay, parseISO } from 'date-fns';
import { Op } from 'sequelize';
import User from '../models/User';
import Appointment from '../models/Appointment';

// Classe que manipula dados de Agendamentos (do Usuário Prestador)
class ScheduleController {
  async index(req, res) {
    // Verifica se o usuário logado é realmente um Prestador de serviços
    const checkUserProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });
    if (!checkUserProvider) {
      return res.status(401).json({ error: 'User is not a provider' });
    }

    // obtem a data informada pelo cliente
    const { date } = req.query;
    // converte pra data no formato JavaScript
    const parsedDate = parseISO(date);

    // obtem agendamentos do dia informado pro Usuário (prestador) logado
    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.userId,
        canceled_at: null,
        // filtro para encontrar apenas horários do dia informado
        date: {
          [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)],
        },
      },
      order: ['date'],
      attributes: ['id', 'date'],
    });

    // retorna os agendamentos pro cliente
    return res.json(appointments);
  }
}

export default new ScheduleController();
