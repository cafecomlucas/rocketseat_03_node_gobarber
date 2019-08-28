import File from '../models/File';

// Classe que manipula os dados de Arquivos
class FileController {
  async store(req, res) {
    const { originalname: name, filename: path } = req.file;

    const file = await File.create({ name, path });

    return res.json(file);
    // retorna os dados preenchidos pelo middleware com o método do Multer
    // return res.json(req.file);
  }
}

export default new FileController();
