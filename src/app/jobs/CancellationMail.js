import { parseISO, format } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class CancellationMail {
  // disponibiliza a variável 'key' (sem utilizar um constructor)
  get key() {
    // retorna uma chave única para este tipo de job
    return 'CancellationMail';
  }

  // método que guarda o código a ser executado
  // quando este job for processado
  async handle({ data }) {
    // utiliza a desestruturação para utilizar apenas os dados
    // do Agendamento passados via parâmetro na chamada deste método
    const { appointment } = data;

    // Envia o e-mail de cancelamento pro Usuário Prestador de serviços
    await Mail.sendMail({
      to: `${appointment.provider.name} <${appointment.provider.email}>`,
      subject: 'Agendamento cancelado',
      template: 'cancelation',
      context: {
        // preenche as variáveis para serem utilizadas pela template engine
        provider: appointment.provider.name,
        user: appointment.user.name,
        date: format(
          // necessário adicionar aqui (dentro do job) o parseISO
          // para transformar o formato de String para Data
          parseISO(appointment.date),
          "'dia' dd 'de' MMMM', às' HH:mm'h'",
          {
            locale: pt,
          }
        ),
      },
    });
  }
}

export default new CancellationMail();
