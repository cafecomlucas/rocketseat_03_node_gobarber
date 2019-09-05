import nodemailer from 'nodemailer';
import mailConfig from '../config/mail';

// Classe para envio de e-mail
class Mail {
  // Inicializa o nodemailer
  constructor() {
    const { host, port, auth, secure } = mailConfig;

    // conecta com o serviço externo para envio de e-mails
    this.transport = nodemailer.createTransport({
      host,
      port,
      secure,
      // só utiliza o auth nos tipos de serviço
      // que precisam dele, então só seta o valor caso ele exista
      auth: auth.user ? auth : null,
    });
  }

  // método para disparar uma mensagem
  sendMail(message) {
    return this.transport.sendMail({
      ...mailConfig.default,
      ...message,
    });
  }
}

export default new Mail();
