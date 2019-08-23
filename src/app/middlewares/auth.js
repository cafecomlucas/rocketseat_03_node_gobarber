import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import authConfig from '../../config/auth';

export default async (req, res, next) => {
  // guarda a string do header de autorização enviada pelo cliente
  const authHeader = req.headers.authorization;
  // exibe "Bearer ...token..."
  console.log(authHeader);

  // Caso o cliente não envie o header
  if (!authHeader) {
    // retorna um erro pro cliente
    return res.status(401).json({ error: 'Token not provided' });
  }

  // Caso o header exista, utiliza desestruturação para
  // guardar apenas o token (remove o trecho "Bearer ")
  const [, token] = authHeader.split(' ');

  try {
    // usa a função assíncrona 'verify' do jwt pra conferir o token
    // o jwt utiliza o padrão antigo de função assíncrona (por callbacks)
    // o promisify converte o padrão antigo para o novo padrão (async/await)
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);
    // guarda as informações do usuário para que o próximo middleware utilize
    req.userId = decoded.id;
    // executa o próximo middleware
    return next();
  } catch (err) {
    // se o token for inválido, retorna um erro
    return res.status(401).json({ error: 'Invalid Token' });
  }
};
