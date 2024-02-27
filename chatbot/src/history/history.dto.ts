export class HistoryDto {
    chats:[]
}

export class ListaMensagensDto {

    mensagens: MensagemDto[];
}

export class MensagemDto {

    role?: string;

    content?: string;

}