import { Injectable } from '@nestjs/common';
import { QuestionDto } from './app.dto';
import { messages, openai } from './main';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HistoryDto } from './history/history.dto';
import { HistoryEntity } from './history/history.entity';

@Injectable()
export class AppService {

  constructor(@InjectRepository(HistoryEntity) private readonly historyRepository: Repository<HistoryEntity>) { }

  async sendQuestion(questions: QuestionDto) {
    try {
      console.log(messages)
      messages.push({ 'role': 'user', 'content': questions.question })
      const resp = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: messages
      })
      messages.push({ 'role': 'assistant', 'content': resp.choices[0].message.content })
      console.log(messages)
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

  async save_history(history: HistoryDto) {
    try {
      this.clearDatabase().then(async ()=>{
        await this.historyRepository.save(history.chats)
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
  

}
