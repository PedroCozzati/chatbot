// import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

// @Entity()
// export class HistoryEntity {
    
//     @PrimaryGeneratedColumn()
//     id: number;

//     @Column('json', { nullable: true })
//     mensagens: any[]

// }


// @Entity()
// export class ListaMensagens {
//     @PrimaryGeneratedColumn()
//     id: number;

//     @OneToMany(() => Mensagem, mensagem => mensagem.lista)
//     mensagens: Mensagem[];
// }

// @Entity()
// export class Mensagem {
//     @PrimaryGeneratedColumn()
//     id: number;

//     @Column({ type: 'text' })
//     role: string;

//     @Column({ type: 'text' })
//     content: string;

//     @ManyToOne(() => ListaMensagens, lista => lista.mensagens)
//     lista: ListaMensagens;
// }