
# Chatbot

Chatbot implementando a API do chatgpt.
O tema do chatbot é "Montagem e assistência técnica de computadores, então é possível pedir dicas e ajuda para resolver problemas de software,
além de dicas para montar um pc como melhores configurações, entre outras...

## Como funciona?

É utilizado engenharia de prompt para direcionar o chatgpt, especificamente com o persona pattern - mais informações: https://arxiv.org/abs/2302.11382


## Documentação da API

#### Retorna uma mensagem de bem-vindo do chatgpt

```http
  GET /chat
```

#### Envia uma mensagem e retorna a resposta do chatgpt

```http
  POST /chat
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `question`      | `string` | **Obrigatório**. A mensagem que você quer enviar |



## Autores

- [@PedroCozzati](https://www.github.com/PedroCozzati)


## Deploy

Link do projeto na WEB

```bash
  https://main--chatbot-ia-angular.netlify.app/
```


## Observações:
Atualmente, existem 2 branchs principais:
- main
- main-no-db

Como o próprio nome diz, a main-no-db é possível rodar sem ter o MYSQL instalado na máquina, pois não é salva nenhuma informações em banco de dados

Já a main, possui um sistema de histórico, onde é possível salvar chats (Precisa do MYSQL)


## Rodando localmente

Clone o projeto

```bash
  git clone https://link-para-o-projeto
```

Entre no diretório do projeto back-end ou front-end

```bash
  cd chatbot
  cd chatbot_front
```

Instale as dependências

```bash
  npm install (nas duas pastas)
```

Inicie os servidores

```bash
  no back-end: nest start
  no front-end: ng serve --open
```


## Stack utilizada

**Front-end:** Angular

**Back-end:** Node, NestJS, MYSQL


## Screenshots 

![image](https://github.com/PedroCozzati/chatbot/assets/80106385/d21a98cf-74fd-4ea8-a038-eb71342482bb)

![image](https://github.com/PedroCozzati/chatbot/assets/80106385/4571b769-2dec-44b2-82c3-145ee08a3c61)

https://github.com/PedroCozzati/chatbot/assets/80106385/77b4b4cd-16fb-46b3-a6d9-452878c66f39

