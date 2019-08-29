import Appointment from '../models/Appointment';

// Classe que manipula os dados de Agendamentos
class AppointmentController {
  async store(req, res) {
    const { provider_id, date } = req.body;

    const appointment = await Appointment.create({
      date,
      provider_id,
      user_id: req.userId,
    });

    res.json(appointment);
  }
}

export default new AppointmentController();
