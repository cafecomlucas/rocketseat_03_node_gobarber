import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Appointment from '../models/Appointment';
import User from '../models/User';
import File from '../models/File';
import Notification from '../schemas/Notification';

// Classe que manipula os dados de Agendamentos (do Usuário Comum)
class AppointmentController {
  // Lista todos os agendamentos (não cancelados) de um usuário específico
  async index(req, res) {
    // guarda o valor da página (valor padrão 1)
    const { page = 1 } = req.query;

    // busca pelos agendamentos
    const appointments = await Appointment.findAll({
      where: {
        user_id: req.userId,
        canceled_at: null,
      },
      order: ['date'],
      // limita para 20 agendamentos por página
      limit: 20,
      // offset indica de qual registro começar
      // então a conta abaixo pula registros anteriores
      // dependendo da página informada
      offset: (page - 1) * 20,
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

    /**
     *  VERIFICA SE O USUÁRIO INFORMADO É MESMO UM PRESTADOR DE SERVIÇOS
     * */

    const provider = await User.findOne({
      where: { id: provider_id, provider: true },
    });
    if (!provider) {
      return res
        .status(401)
        .json({ error: 'You can only create appointments with providers' });
    }

    /**
     *  VERIFICA SE O USUÁRIO INFORMADO IGUAL AO USUÁRIO LOGADO
     * */

    if (provider.id === req.userId) {
      return res.status(401).json({
        error: 'You can only create appointments with others providers',
      });
    }

    /**
     * VERIFICA SE NÃO É UMA DATA ANTIGA
     */

    // `parseISO` converte a string da data pro formato de Date do JavaScript
    // `startOfHour` retorna apenas a hora, ignorando os minutos
    const hourStart = startOfHour(parseISO(date));
    // se a hora informada for antes do momento atual
    if (isBefore(hourStart, new Date())) {
      // retorna um erro
      return res.status(400).json({ error: 'Past dates are not permitted' });
    }

    /**
     * VERIFICA DISPONIBILIDADE
     */
    // Verifica se a data/hora já está registrada para esse Prestador
    // busca por um Agendamento não cancelado
    // (pois se estiver, o agendamento poderá ser feito)
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

    /**
     * CRIA AGENDAMENTO
     */
    // (caso passe por todas as validações)
    const appointment = await Appointment.create({
      date: hourStart, // registra apenas a hora no BD (desconsidera os min/seg)
      provider_id,
      user_id: req.userId,
    });

    /**
     * REGISTRA A NOTIFICAÇÃO PRO USUÁRIO PRESTADOR DE SERVIÇOS
     */
    // busca o usuário logado (para obter o nome)
    const user = await User.findOne({ where: { id: req.userId } });
    // formata a data registrada
    const formattedDate = format(
      hourStart,
      "'dia' dd 'de' MMMM', às' HH:mm'h'",
      { locale: pt }
    );
    // Registra uma nova notificação com o conteúdo da mensagem
    // e a identificação do Usuário Prestador que receberá a notificação
    // ('read' é preenchido automaticamente como false)
    await Notification.create({
      content: `Novo agendamento de "${user.name}" para ${formattedDate}`,
      user: provider_id,
    });

    // retorna o objeto do agendamento criado pro cliente
    return res.json(appointment);
  }

  // Cancela um agendamento
  async delete(req, res) {
    // busca o Agendamento
    const appointment = await Appointment.findOne({
      where: {
        id: req.params.id,
      },
    });

    // Verifica se é o Usuário logado é o mesmo do Agendamento
    if (req.userId !== appointment.user_id) {
      return res.status(401).json({
        error: "You don't have permission to cancel this appointment.",
      });
    }

    // Subtraí duas horas da data registrada no banco
    // (como a data do banco já vem no formato data, não é necessário converter)
    const dateWithSub = subHours(appointment.date, 2);
    // se a data subtraída for mais antiga que a data atual
    if (isBefore(dateWithSub, new Date())) {
      return res
        .status(401)
        .json({ error: 'You can only cancel appointments 2 hours in advance' });
    }

    // Define a data de cancelamento
    appointment.canceled_at = new Date();
    await appointment.save();

    // Retorna o registro do Agendamento cancelado
    return res.json(appointment);
  }
}

export default new AppointmentController();
