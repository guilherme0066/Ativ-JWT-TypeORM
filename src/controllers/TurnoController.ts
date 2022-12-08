import AppDataSource from "../data-source";
import { Request, Response } from 'express';
import { Turno } from '../entities';

class TurnoController {

    public async create(req: Request, res: Response): Promise<Response> {
        let { nome, inicio, fim } = req.body;
        if (!nome || nome.trim().length == 0) {
            return res.json({ error: "Forneça o nome do turno" });
        }
        if (!inicio || inicio.trim().length == 0) {
            return res.json({ error: "Forneça o horário de início" });
        }
        if (!fim || fim.trim().length == 0) {
            return res.json({ error: "Forneça o horário de fim" });
        }
        const object = new Turno();
        object.nome = nome.trim();
        object.inicio = inicio.trim();
        object.fim = fim.trim();
        const turno: any = await AppDataSource.manager.save(Turno, object).catch((e) => {
            // testa se o nome é repetido
            if (/(nome)[\s\S]+(already exists)/.test(e.detail)) {
                return { error: 'Já existe um turno com este nome' }
            }
            return e.message;
        })
        return res.json(turno);
    }

    public async delete(req: Request, res: Response): Promise<Response> {
      const { idturno } = req.body;
      if( !idturno || idturno.trim() === "" ){
        return res.json({error:"Forneça o identificador do turno"});
      }
      const object: any = await AppDataSource.manager.findOneBy(Turno, { idturno });
      if (object && object.idturno) {
        const r = await AppDataSource.manager.remove(Turno, object).catch((e) => e.message);
        return res.json(r);
      }
      else {
        return res.json({ error: "Turno não localizado" })
      }
    }
  
    public async update(req: Request, res: Response): Promise<Response> {
      const { idturno, nome, inicio, fim } = req.body
      if( !idturno || idturno.trim() === "" ){
        return res.json({error:"Forneça o identificador do turno"});
      }
      const object: any = await AppDataSource.manager.findOneBy(Turno, { idturno });
      if (object && object.idturno) {
        object.nome = !nome || nome.trim() === '' ? object.nome : nome.trim();
        object.inicio = !inicio || inicio.trim() === '' ? object.inicio : inicio.trim();
        object.fim = !fim || fim.trim() === '' ? object.fim : fim.trim();
  
        const turno = await AppDataSource.manager.save(Turno, object).catch((e) => {
          // testa se o nome é repetido
          if (/(nome)[\s\S]+(already exists)/.test(e.detail)) {
            return { error: 'Já existe um turno com este nome' }
          }
          return e.message;
        })
        return res.json(turno);
      }
      else {
        return res.json({ error: "Turno não localizado" })
      }
    }

    public async list(req: Request, res: Response): Promise<Response> {
        const object: any = await AppDataSource.getRepository(Turno).find({
            order: {
                nome: 'asc'
            }
        });
        return res.json(object);
    }

}

export default new TurnoController();