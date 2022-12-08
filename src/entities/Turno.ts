import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";

@Entity({ name: "turnos" })
export default class Turno {
    @PrimaryGeneratedColumn()
    idturno: number;

    @Column({ length: 20, unique: true, nullable: false })
    nome: string;

    @Column({ length: 5, nullable: false })
    inicio: string;

    @Column({ length: 5, nullable: false })
    fim: string;
}