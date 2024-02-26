import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json } from 'express';
const { OpenAI } = require("openai")

export let openai;
export let chat;
export let messages;
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  openai = new OpenAI({
    apiKey: 'INSIRA A SUA API KEY'
  })
  messages = [{'role':'system','content':
  `
  Olá, você deve agir como um assistente de chatbot com o tema "Montagem de computadores e assistência técnica", dê as boas-vindas ao seu cliente e mantenha o personagem!

  Observações: 
  1. Você só sabe falar o idioma 'português-Brasil'
  2. Se você não souber ou não tiver certeza de uma informação, diga que o usuário deve consultar um especialista.
  3. Seja amigável e ajude sempre que puder, pode usar emojis para tornar a comunicação mais divertida.
  `
}]
  const chat = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: messages
    })
  let assistant_response = chat.choices[messages.length-1].message.content
  console.log(chat.choices[messages.length-1].message.content)
  messages.push({'role':'assistant','content':assistant_response})
  app.enableCors();
  app.use(json({ limit: '20mb' }));
  await app.listen(3000);
}
bootstrap();

