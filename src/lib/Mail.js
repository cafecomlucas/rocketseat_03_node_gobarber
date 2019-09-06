import nodemailer from 'nodemailer';
import { resolve } from 'path';
import exphbs from 'express-handlebars';
import nodemailerhbs from 'nodemailer-express-handlebars';
import mailConfig from '../config/mail';

// Classe para envio de e-mail
class Mail {
  // Inicializa o nodemailer
  constructor() {
    const { host, port, auth, secure } = mailConfig;

    // conecta com o serviço externo para envio de e-mails
    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      // só utiliza o auth nos tipos de serviço
      // que precisam dele, então só seta o valor caso ele exista
      auth: auth.user ? auth : null,
    });

    // configura os templates de e-mail
    this.configureTemplates();
  }

  // configuração dos templates de e-mail
  configureTemplates() {
    // diretório raiz das views dos e-mails
    const viewPath = resolve(__dirname, '..', 'app', 'views', 'emails');

    // adiciona uma configuração adicional ao 'transporter'
    // definimos como o método 'compile' do nodemailer irá funcionar
    // o método 'compile' define como a mensagem será compilada / formatada
    this.transporter.use(
      'compile',
      nodemailerhbs({
        // configura qual será a view engine para pro módulo
        // nodemailer-express-handlebars utilizar (que é a express-handlebars)
        viewEngine: exphbs.create({
          // define as configurações da view engine express-handlebars
          layoutsDir: resolve(viewPath, 'layouts'),
          partialsDir: resolve(viewPath, 'partials'),
          defaultLayout: 'default',
          extname: '.hbs',
        }),
        // configura qual é o diretório raiz pro nodemailer-express-handlebars
        viewPath,
        // configura qual é a extensão de arquivos pro nodemailer-express-handlebars
        extName: '.hbs',
      })
    );
  }

  // método para disparar uma mensagem
  sendMail(message) {
    return this.transporter.sendMail({
      ...mailConfig.default,
      ...message,
    });
  }
}

export default new Mail();
