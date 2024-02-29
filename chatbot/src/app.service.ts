import { Injectable } from '@nestjs/common';
import { QuestionDto } from './app.dto';
import { messages, openai } from './main';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HistoryEntity, ListaMensagens, Mensagem } from './history/history.entity';
import { HistoryDto, ListaMensagensDto, MensagemDto } from './history/history.dto';

@Injectable()
export class AppService {

  constructor(@InjectRepository(HistoryEntity) private readonly historyRepository: Repository<HistoryEntity>) { }

  async sendQuestion(questions: QuestionDto) {
    try {
      messages.push({ 'role': 'user', 'content': questions.question })
      const resp = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-16k",
        messages: messages
      })
      messages.push({ 'role': 'assistant', 'content': resp.choices[0].message.content })
      return resp.choices[0].message.content
    }
    catch (exception) {
      throw exception
    }
  }

  async getMessages() {
    try {
      return messages
    }
    catch (exception) {
      throw exception
    }
  }

  async save_history(lista: ListaMensagensDto[]) {
    let novaLista;
    try {
      await this.clearDatabase().then(async ()=>{
          for (const listaInterna of lista['chats']) {
            novaLista = new ListaMensagensDto();
            novaLista.mensagens =listaInterna['mensagens'];
          console.log(novaLista)
          await this.historyRepository.save(novaLista);
        }
      })
    }
    catch (exception) {
      throw exception
    }
  }

  async load_history() {
    try {
      var list = await this.historyRepository.find()
      return list
    }
    catch (exception) {
      throw exception
    }
  }

  async clearDatabase() {
    const repository = await this.historyRepository; // Obtém o repositório da sua entidade
    await repository.clear(); // Limpa todos os registros da tabela associada à entidade
  }

  async deletaitem(id: number) {
    try {
      await this.historyRepository.delete({"id": id })
      return;
    } catch (exception) {
      throw exception
    }
  }

}
