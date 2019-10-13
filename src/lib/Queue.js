import Bee from 'bee-queue';
import CancellationMail from '../app/jobs/CancellationMail';
import redisConfig from '../config/redis';

const jobs = [CancellationMail];

class Queue {
  constructor() {
    // objeto para armazenar as filas
    // (cada tipo de serviço/background job tem uma fila diferente)
    // (uma fila pra cancelamento de e-mail, uma fila pra recuperação de senha, etc)
    this.queues = {};

    // inicializa a definição das filas
    this.init();
  }

  init() {
    // percorre cada item no Array jobs
    jobs.forEach(({ key, handle }) => {
      // define as configurações de cada fila
      this.queues[key] = {
        bee: new Bee(key, { redis: redisConfig }),
        handle,
      };
    });
  }

  add(queue, job) {
    // console.log('item adicionado na fila');
    // adiciona um job na fila (queue) informada
    return this.queues[queue].bee.createJob(job).save();
  }

  // inicializa o "loop" que fica verificando se existem
  // novos jobs, caso existam, eles são executados com
  // o handle informado
  processQueue() {
    // percorre cada item do array jobs
    jobs.forEach(job => {
      // para cada fila existente (this.queues[key])
      const { bee, handle } = this.queues[job.key];
      // processa cada job armazenada nela
      bee.process(handle);
    });
  }
}

export default new Queue();
