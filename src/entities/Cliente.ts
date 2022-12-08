import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { Status } from "./Types";

@Entity({ name: "clientes" })
export default class Cliente {
    @PrimaryGeneratedColumn()
    idcliente: number;

    @Column({ length: 70, nullable: false })
    nome: string;

    @Column({ length: 18, nullable: false, unique: true })
    cnpj: string;

    @Column({type:'enum', enum:['ativo','inativo'], default:'ativo', nullable:false})
    status: Status;
}