import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, AfterLoad, ManyToOne, JoinColumn, ManyToMany } from "typeorm"
import * as bcrypt from "bcrypt"
import Turno from "./Turno";
import Projeto from "./Projeto";
import { Perfil } from "./Types";

@Entity({ name: "colaboradores" })
export default class Colaborador {
    @PrimaryGeneratedColumn()
    idcolaborador: number;

    @Column({type:'integer', nullable: false, unique: true })
    matricula: number;

    @Column({ length: 50, nullable: false })
    nome: string;

    @Column({ nullable: false, select: false })
    senha: string;

    @Column({type:'enum', enum:["colaborador","gestor","admin","inativo"], default:'colaborador', nullable:false})
    perfil: Perfil;

    @ManyToOne(() => Colaborador, { onDelete: 'CASCADE', onUpdate: 'CASCADE', nullable:true })
    @JoinColumn({  //Defines which side of the relation contains the join column with a foreign key 
        name: "idgestor",
        referencedColumnName: "idcolaborador",
        foreignKeyConstraintName: "fk_gestor_id"
    })
    gestor: Colaborador;

    @ManyToOne(() => Turno, { onDelete: 'NO ACTION', onUpdate: 'CASCADE', nullable:true })
    @JoinColumn({  //Defines which side of the relation contains the join column with a foreign key 
        name: "idturno",
        referencedColumnName: "idturno",
        foreignKeyConstraintName: "fk_turno_id"
    })
    turno: Turno;

    /* o relacionamento é bidirecional ao colocar ManyToMany e (colaborador)=> colaborador.projetos */
    @ManyToMany(()=>Projeto, (projeto)=>projeto.colaboradores)
    projetos: Projeto[];

    @BeforeInsert()
    @BeforeUpdate()
    hashPassword(): void {
        if (this.senha) {
            this.senha = bcrypt.hashSync(this.senha, bcrypt.genSaltSync(10));
        }
    }

    compare(senha: string): Promise<boolean> {
        return bcrypt.compare(senha, this.senha);
    }
}