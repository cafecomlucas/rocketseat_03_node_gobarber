import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore } from 'date-fns';
import Appointment from '../models/Appointment';
import User from '../models/User';
import File from '../models/File';

// Classe que manipula os dados de Agendamentos
class AppointmentController {
  // Lista todos os agendamentos (não cancelados) de um usuário específico
  async index(req, res) {
    const appointments = await Appointment.findAll({
      where: {
        user_id: req.userId,
        canceled_at: null,
      },
      order: ['date'],
      attributes: ['id', 'date'],
      // No Agendamento, através do relacionamento,
      // inclui na busca os dados do Prestador (User)
      include: {
        model: User,
        // necessário indicar qual o campo relacionado
        // para buscar os dados na tabela 'users'
        // 'provider' (provider_id) ou 'user' (user_id)
        as: 'provider',
        attributes: ['id', 'name'],
        // No User, através do relacionamento,
        // inclui na busca os dados do File (avatar) do Prestador (User)
        include: {
          model: File,
          as: 'avatar',
          // necessário incluir 'path' pois o campo
          // virtual 'url' depende dessa informação
          attributes: ['path', 'url'],
        },
      },
    });

    return res.json(appointments);
  }

  // Cria um agendamento
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

    // Verifica se não é uma data antiga
    // `parseISO` converte a string da data pro formato de Date do JavaScript
    // `startOfHour` retorna apenas a hora, ignorando os minutos
    const hourStart = startOfHour(parseISO(date));
    // se a hora informada for antes do momento atual
    if (isBefore(hourStart, new Date())) {
      // retorna um erro
      return res.status(400).json({ error: 'Past dates are not permitted' });
    }

    // Verifica a disponibilidade (se a data/hora já está registrada para esse Prestador)
    // busca por um Agendamento não cancelado (pois se estiver, o agendamento poderá ser feito)
    const checkAvailability = await Appointment.findOne({
      where: {
        date: hourStart,
        provider_id,
        canceled_at: null,
      },
    });
    // se encontrou um agendamento
    if (checkAvailability) {
      // retorna um erro
      return res
        .status(400)
        .json({ error: 'Appointment date is not available' });
    }

    // caso passe por todas as validações
    // cria um agendamento
    const appointment = await Appointment.create({
      date: hourStart, // registra apenas a hora no BD (desconsidera os min/seg)
      provider_id,
      user_id: req.userId,
    });

    // retorna o objeto do agendamento criado pro cliente
    return res.json(appointment);
  }
}

export default new AppointmentController();
