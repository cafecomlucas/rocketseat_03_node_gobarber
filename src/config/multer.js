import multer from 'multer';
import crypto from 'crypto';
import { resolve, extname } from 'path';

export default {
  // configurações das opções de armazenamento do Multer (em disco)
  storage: multer.diskStorage({
    // diretório onde a imagem será salva
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    // formatação do nome da imagem
    filename: (req, file, callback) => {
      // gera 16 bytes aleatórios
      crypto.randomBytes(16, (err, res) => {
        // caso ocorra um erro, e envia pro método filename
        if (err) return callback(err);

        // caso a geração dos caracteres ocorra com sucesso

        // trnasforma a resposta em caracters hexadecimais
        // e concatena com a extensão do arquivo (desconsidera o nome original)
        const newFileName = res.toString('hex') + extname(file.originalname);

        // envia para o método filename o novo nome de arquivo
        return callback(null, newFileName)
      });

    }
  })
};
