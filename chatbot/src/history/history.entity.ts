import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class HistoryEntity {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column('json', { nullable: true })
    chats: any[]

}