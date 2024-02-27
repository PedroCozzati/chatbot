import { Component, HostListener, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';

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
  ) { }

  ngOnInit(): void {
    this.presentation_array = [{}, { 'role': 'assistant', 'content': 'Olá! 👋 Como posso te ajudar hoje na montagem de computadores e assistência técnica? Estou à disposição para responder suas perguntas e auxiliar no que precisar. 🖥️💬' }]
    // this.get_msg()
    this.get_history_db()
  }

  presentation_array: any = []
  question = ''
  answer = ''
  is_question: any
  history: any
  canSave = false
  selectedIndex: number = -1;
  loading: boolean = false

  title = 'chatbot_front';

  selectItem(index: number) {
    this.selectedIndex = index;
  }
  send_question(question: string) {
    this.is_question = true
    this.presentation_array.push({ 'content': question })
    this.question = ''
    this.get_answer(question)
  }

  async get_msg() {
    await this.http.get<any>('http://localhost:3000/chat', { headers: { "Content-Type": 'application/json' } })
      .subscribe(response => {
        this.presentation_array = response
        // this.history.push({'mensagens':this.presentation_array})

      })
  }

  async get_answer(question: string) {
    this.loading = true
    await this.http.post('http://localhost:3000/chat', {
      question: question
    })
      .subscribe(

        (response) => {
          console.log(response)
          this.presentation_array.push({ 'role': 'assistant', 'content': response })
          this.loading = false
        },
        (error) => {
          this.presentation_array.push({
            'role': 'assistant', 'content': 'Parece que ocorreu um erro na API, tente novamente mais tarde'
          })
          this.loading = false

        },
        () =>
          this.loading = false

      )
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

  substituirQuebrasDeLinha(text: string): string {
    const regex = /```(.*?)```/g;

    // Replace ''' with a container HTML element
    const keywordRegex = /\b(if|else|for|while|def|class|and|or|not)\b/g;

    // Regex para strings
    const stringRegex = /'[^'\\]*(?:\\.[^'\\]*)*'|"[^"\\]*(?:\\.[^"\\]*)*"/g;

    // Regex para números (inteiros ou decimais)
    const numberRegex = /\b-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?\b/g;


    text = text.replace(/\n/g, '<br>');
    text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    text = text.replace(regex, '<div class="isolatedtext">$1</div>');

    // if (regex.test(text)) {
    // text= text.replace(keywordRegex,'<div class="keywordlang">$?</div>')
    // text=text.replace(stringRegex,'<div class="stringlang">$?</div>')
    // text= text.replace(numberRegex,'<div class="numberlang">$?</div>')

    // }
    return text
  }


  save_chat() {
    this.selectedIndex = -1
    // let hist = this.get_history_db()

    if (!this.history || !this.history.mensagens) {
      // Certifique-se de inicializar this.history se ainda não estiver definido
      if (!this.history) {
        this.history = { mensagens: [] };
      }
    }

    let canPush = true

    for (const item of this.history) {
      if (item.mensagens === this.presentation_array) {
        canPush = false;
        break; // Se "itemDesejado" for encontrado em algum item da lista, pare a iteração
      }
    }


    if (this.presentation_array.length >= 4 && canPush) {
      this.canSave = true
      this.history.unshift({ 'mensagens': this.presentation_array })
    }

    console.log(this.history)
    this.canSave = false
    // this.save_history_on_db()
  }

  new_chat() {
    this.selectedIndex = -1
    if (!this.history || !this.history.mensagens) {
      // Certifique-se de inicializar this.history se ainda não estiver definido
      if (!this.history) {
        this.history = { mensagens: [] };
      }
    }

    let canPush = true

    for (const item of this.history) {
      if (item.mensagens === this.presentation_array) {
        canPush = false;
        break; // Se "itemDesejado" for encontrado em algum item da lista, pare a iteração
      }
    }


    if (this.presentation_array.length >= 4 && canPush) {
      this.canSave = true
      this.history.unshift({ 'id': this.history.length + 1, 'mensagens': this.presentation_array })
    }
    this.presentation_array = [{}, { 'role': 'assistant', 'content': 'Olá! 👋 Como posso te ajudar hoje na montagem de computadores e assistência técnica? Estou à disposição para responder suas perguntas e auxiliar no que precisar. 🖥️💬' }]

    this.canSave = false

  }

  load_history(index: number) {
    this.selectItem(index)
    console.log(this.history[index].mensagens)
    this.presentation_array = this.history[index].mensagens
  }

  async save_history_on_db() {
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

  async get_history_db() {
    await this.http.get<any>('http://localhost:3000/history', { headers: { "Content-Type": 'application/json' } })
      .subscribe(response => {
        console.log(response)
        this.history = response.sort((a: { id: number; }, b: { id: number; }) => a.id - b.id);
        // this.presentation_array=[{},{'role':'assistant','content':'Olá! 👋 Como posso te ajudar hoje na montagem de computadores e assistência técnica? Estou à disposição para responder suas perguntas e auxiliar no que precisar. 🖥️💬'}]
        console.log(this.history[0])
        // if (response.length === 0) {
        //   this.get_msg()
        // }
        // console.log(this.presentation_array)

      })
  }

  async exportaItem() {
    this.convetToPDF()
  }

  async deletaItem(id: number) {
    this.convetToPDF()
    await this.http.delete<any>(`http://localhost:3000/history/${id}`, { headers: { "Content-Type": 'application/json' } })
      .subscribe((response) => {
        this.history.re
        let indexToRemove = this.history.findIndex((item: { id: number; }) => item.id === id);

        if (indexToRemove !== -1) {
          this.history.splice(indexToRemove, 1);
          console.log("Item removido com sucesso!");
        } else {
          console.log("Item com o id especificado não encontrado na lista.");
        }

        if (response.length === 0) {
          this.get_msg()
        }
        this.presentation_array = [{}, { 'role': 'assistant', 'content': 'Olá! 👋 Como posso te ajudar hoje na montagem de computadores e assistência técnica? Estou à disposição para responder suas perguntas e auxiliar no que precisar. 🖥️💬' }]
        // console.log(this.presentation_array)

      }, () => {
        this.save_history_on_db()
        this.presentation_array = [{}, { 'role': 'assistant', 'content': 'Olá! 👋 Como posso te ajudar hoje na montagem de computadores e assistência técnica? Estou à disposição para responder suas perguntas e auxiliar no que precisar. 🖥️💬' }]

      }
      )
  }

  public convetToPDF() {
    const pdf = new jspdf.jsPDF({
      orientation: 'landscape', // Define a orientação como retrato
      unit: 'mm', // Define as unidades como milímetros
      format: 'a5' // Define o formato como A4
    });
    const data = document.getElementById('main');
    data!.style.backgroundColor = '#120D31';

    const totalHeight = data!.scrollHeight;

    const captureHeight = 297; // Altura de uma página A4 em milímetros
    const scrollIncrement = 620; // Você pode ajustar isso conforme necessário
    const pageHeight = 842; // Altura de uma página A4 em pixels

    data!.scrollTop = 0;
    const captureAndAddImage = async () => {
      let canvas = await html2canvas(data!, { scrollX: 0, scrollY: -window.scrollY, windowHeight: captureHeight });

      const imgWidth = 210; // Largura de uma página A4 em milímetros
      const scaleFactor = imgWidth / canvas.width; // Fator de escala baseado na largura da página A4
      const imgHeight = canvas.height * scaleFactor; // Calcula a altura proporcional

      // Adiciona a imagem ao PDF
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, imgWidth, imgHeight);

      if (data!.scrollTop + pageHeight < totalHeight) {
        data!.scrollTop += scrollIncrement; // Rola para baixo por um incremento definido
        pdf.addPage()
        setTimeout(captureAndAddImage, 500);
      } else {
        pdf.save('new-file.pdf');
        data!.style.backgroundColor = '';
      }
    };
    captureAndAddImage();
  }
}


