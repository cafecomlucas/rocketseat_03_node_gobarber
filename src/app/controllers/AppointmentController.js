import * as Yup from 'yup';
import Appointment from '../models/Appointment';
import User from '../models/User';

// Classe que manipula os dados de Agendamentos
class AppointmentController {
  async store(req, res) {
    // faz a validação inicial dos campos
    const schema = Yup.object().shape({
      date: Yup.date().required(),
      provider_id: Yup.number().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    // guarda o dado 'provider_id' e o dado 'date'
    const { provider_id, date } = req.body;

    // Verifica se o usuário informado é mesmo um prestador de serviços
    const isProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });
    if (!isProvider) {
      return res
        .status(401)
        .json({ error: 'You can only create appointments with providers' });
    }

    // caso passe por todas as validações
    // cria um agendamento
    const appointment = await Appointment.create({
      date,
      provider_id,
      user_id: req.userId,
    });

    // retorna o objeto do agendamento criado pro cliente
    return res.json(appointment);
  }
}

export default new AppointmentController();
