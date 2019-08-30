import Appointment from '../models/Appointment';

// Classe que manipula dados de Agendamentos (do Usuário Prestador)
class ScheduleController {
  async index(req, res) {
    // obtem todos agendamentos do Usuário prestador logado
    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.userId,
        canceled_at: null,
      },
      order: ['date'],
      attributes: ['id', 'date'],
    });

    // retorna os agendamentos pro cliente
    res.json({ appointments });
  }
}

export default new ScheduleController();
