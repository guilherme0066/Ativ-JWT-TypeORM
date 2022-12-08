import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, ManyToMany, JoinTable } from "typeorm";
import Cliente from "./Cliente";
import Colaborador from "./Colaborador";
import { Status } from "./Types";

@Entity({ name: "projetos" })
export default class Projeto {
    @PrimaryGeneratedColumn()
    idprojeto: number;

    @Column({ length: 70, unique: true, nullable: false })
    nome: string;

    @Column({ type: 'enum', enum: ['ativo', 'inativo'], default: 'ativo', nullable: false })
    status: Status;

    @ManyToOne(() => Cliente, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({  //Defines which side of the relation contains the join column with a foreign key 
        name: "idcliente",
        referencedColumnName: "idcliente",
        foreignKeyConstraintName: "fk_cliente_id"
    })
    cliente: Cliente;

    /* o relacionamento é bidirecional ao colocar ManyToMany em ambos os lados e (colaborador)=> colaborador.projetos */
    @ManyToMany( () => Colaborador, (colaborador)=> colaborador.projetos, {cascade:true} )
    @JoinTable({
        name:"grupos",
        joinColumn: {
            name: "idprojeto",
            referencedColumnName: "idprojeto"
        },
        inverseJoinColumn: {
            name: "idcolaborador",
            referencedColumnName: "idcolaborador"
        }
    })
    colaboradores: Colaborador[]
}