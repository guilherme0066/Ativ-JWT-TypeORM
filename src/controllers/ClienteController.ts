import AppDataSource from "../data-source";
import { Request, Response } from 'express';
import { Cliente, Status } from '../entities';

class ClienteController {

  public async create(req: Request, res: Response): Promise<Response> {
    let { nome, cnpj } = req.body;
    if (!nome || nome.trim().length == 0) {
      return res.json({ error: "Forneça o nome do cliente" });
    }
    if (!cnpj || cnpj.trim().length == 0) {
      return res.json({ error: "Forneça o CNPJ do cliente" });
    }
    const object = new Cliente();
    object.nome = nome.trim();
    object.cnpj = cnpj.trim();
    const response: any = await AppDataSource.manager.save(Cliente, object).catch((e) => {
      // testa se o CNPJ é repetido
      if (/(cnpj)[\s\S]+(already exists)/.test(e.detail)) {
        return { error: 'Este CNPJ já existe no cadastro' }
      }
      return { error: e.message }
    })

    return res.json(response);
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    const { idcliente } = req.body;
    if( !idcliente || idcliente.trim() === "" ){
      return res.json({error:"Forneça o identificador do cliente"});
    }
    const object: any = await AppDataSource.manager.findOneBy(Cliente, { idcliente });
    if (object && object.idcliente) {
      const r = await AppDataSource.manager.remove(Cliente, object).catch((e) => e.message)
      return res.json(r)
    }
    else {
      return res.json({ error: "Cliente não localizado" })
    }
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const { idcliente, nome, cnpj, status } = req.body
    if( !idcliente || idcliente.trim() === "" ){
      return res.json({error:"Forneça o identificador do cliente"});
    }
    const object: any = await AppDataSource.manager.findOneBy(Cliente, { idcliente });
    if (object && object.idcliente) {
      object.nome = !nome || nome.trim() === '' ? object.nome : nome.trim();
      object.cnpj = !cnpj || cnpj.trim() === '' ? object.cnpj : cnpj.trim();
      object.status = !status || status.trim() === '' ? object.status : status.trim();

      const cliente = await AppDataSource.manager.save(Cliente, object).catch((e) => {
        // testa se o CNPJ é repetido
        if (/(cnpj)[\s\S]+(already exists)/.test(e.detail)) {
          return { error: 'Este CNPJ já existe no cadastro' }
        }
        return e.message;
      })
      return res.json(cliente);
    }
    else {
      return res.json({ error: "Cliente não localizado" })
    }
  }

  public async list(req: Request, res: Response): Promise<Response> {
    const {status} = req.params;
    const _status = status as Status;
    const object: any = await AppDataSource.getRepository(Cliente).find({
      where: {
        status: _status
      },
      order: {
        nome: 'asc'
      }
    });
    return res.json(object);
  }

}

export default new ClienteController();