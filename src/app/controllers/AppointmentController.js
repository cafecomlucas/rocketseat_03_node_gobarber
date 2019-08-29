// Classe que manipula os dados de Agendamentos
class AppointmentController {
  async store(req, res) {
    res.json({ ok: true });
  }
}

export default new AppointmentController();
