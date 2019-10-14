import {
  startOfDay,
  endOfDay,
  setHours,
  setMinutes,
  setSeconds,
  format,
  isAfter,
} from 'date-fns';
import { Op } from 'sequelize';
import Appointment from '../models/Appointment';

// Classe que manipula dados de Agendamentos (do Usuário Prestador)
class AvailableController {
  async index(req, res) {
    // obtem a data informada pelo cliente
    const { date } = req.query;

    // verifica se a data foi informada via query params
    if (!date) {
      return res.status(400).json({ error: 'Invalid date' });
    }

    // garante que a data está no formato numérico
    // (o Front-End enviará no formato Unixtimestamp)
    const searchDate = Number(date);

    // obtem agendamentos do dia informado pro Usuário (prestador) logado
    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.params.providerId, // obtido da URL
        canceled_at: null,
        // filtro para encontrar apenas horários do dia informado
        date: {
          [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)],
        },
      },
      order: ['date'],
      attributes: ['id', 'date'],
    });

    // Lista dos horários disponíveis do dia
    const schedule = [
      '00:00',
      '01:00',
      '10:00',
      '11:00',
      '12:00',
      '13:00',
      '14:00',
      '15:00',
      '16:00',
      '17:00',
      '18:00',
    ];

    // cria um novo Array com as datas formatadas e o status de disponibilidade
    const available = schedule.map(time => {
      // separa as horas e os minutos
      const [hours, minutes] = time.split(':');
      // formata a hora da agenda de acordo com o padrão da aplicação
      // (com o minuto e o segundo zerados)
      const value = setSeconds(
        setMinutes(setHours(searchDate, hours), minutes),
        0
      );

      // retorna um objeto com as informações
      return {
        time,
        value: format(value, "yyyy-MM-dd'T'HH:mm:ssxxxx"),
        // verifica se a data e horário já passou
        // e se já não existe um agendamento para essa data/horário
        // no banco de dados
        available:
          // se o horário for depois do momento atual
          isAfter(value, new Date()) &&
          // se o horário não for encontrado na tabela de appointments
          !appointments.find(a => format(a.date, 'HH:mm') === time),
      };
    });

    // retorna os agendamentos pro cliente
    return res.json(available);
  }
}

export default new AvailableController();
