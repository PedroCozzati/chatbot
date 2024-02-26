import { Component, HostListener, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {


  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHandler(event: Event) {
    console.log('A aba está prestes a ser fechada.');
    this.save_history_on_db()
  }

  constructor(
    private http: HttpClient,
  ){}

  ngOnInit(): void {
    this.history.chats
    // this.get_msg()
    this.get_history_db()
  }

  presentation_array:any=[]
  question= ''
  answer = ''
  is_question:any
  history:any=[{'chats':[]}]
  selectedIndex: number = -1;

  title = 'chatbot_front';

  selectItem(index: number) {
    this.selectedIndex = index;
  }
  send_question(question: string){
    this.is_question=true
    this.presentation_array.push({'content':question})
    this.question=''
    this.get_answer(question)
  }

  async get_msg(){
    await this.http.get<any>('http://localhost:3000/chat', { headers: { "Content-Type": 'application/json' }})
    .subscribe(response=> {
      this.presentation_array = response
      this.history=[{'chats':[this.presentation_array]}]

    })
  }

  async get_answer(question:string){
    await this.http.post('http://localhost:3000/chat', { 
      question: question
    })
    .subscribe(response => {
      console.log(response)
      this.presentation_array.push({'content':response})
    })
  }

  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && event.shiftKey) {
      this.adicionarQuebraDeLinha(event);
      event.preventDefault(); // Impede a quebra de linha padrão
    }
  }

  adicionarQuebraDeLinha(event: KeyboardEvent): void {
    const textarea = event.target as HTMLTextAreaElement;
    const textoAtual = textarea.value;
    const cursorPos = textarea.selectionStart || 0; // Captura a posição do cursor no texto

    // Dividir o texto em duas partes: antes do cursor e depois do cursor
    const parte1 = textoAtual.substring(0, cursorPos);
    const parte2 = textoAtual.substring(cursorPos, textoAtual.length);

    // Atualizar o valor do textarea com a quebra de linha inserida entre as duas partes
    textarea.value = parte1 + '\n' + parte2;

    // Posicionar o cursor após a quebra de linha inserida
    textarea.setSelectionRange(cursorPos + 1, cursorPos + 1);
  }

  substituirQuebrasDeLinha(text:string): string {
    return text.replace(/\n/g, '<br>');
  }


  save_chat(){
    this.selectedIndex = -1
    // let hist = this.get_history_db()
   try{
    if ((!this.history.chats.includes(this.presentation_array) && this.presentation_array.length>=4)) {
      this.history['chats'].push(this.presentation_array)
    }
  }catch{
    this.history['chats'].push(this.presentation_array)
  }
 
    console.log(this.history)
    this.presentation_array=[{},{'role':'assistant','content':'Olá! 👋 Como posso te ajudar hoje na montagem de computadores e assistência técnica? Estou à disposição para responder suas perguntas e auxiliar no que precisar. 🖥️💬'}]
    // this.save_history_on_db()
  }

  load_history(index:number){
    this.selectItem(index)
    this.presentation_array = this.history.chats[index]
  }

  async save_history_on_db(){
    console.log(this.history)
    await this.http.post('http://localhost:3000/history', { 
      chats: this.history
    })
    .subscribe(response => {
      console.log(this.history)
      // alert(response)
      // this.presentation_array.push({'content':response})
    })
  }

  async get_history_db(){
    await this.http.get<any>('http://localhost:3000/history', { headers: { "Content-Type": 'application/json' }})
    .subscribe(response=> {
      console.log(response)
      this.history = response[0]
      this.presentation_array=[{},{'role':'assistant','content':'Olá! 👋 Como posso te ajudar hoje na montagem de computadores e assistência técnica? Estou à disposição para responder suas perguntas e auxiliar no que precisar. 🖥️💬'}]
      
      if (response.length===0){
        this.get_msg()
      }
      // console.log(this.presentation_array)

    })
  }

}
