import AppDataSource from "../data-source";
import { Request, Response } from 'express';
import { Projeto, Cliente, Status, Colaborador } from '../entities';

class ProjetoController {

  public async create(req: Request, res: Response): Promise<Response> {
    let { nome, idcliente, status, colaboradores } = req.body;
    if (!nome || nome.trim().length == 0) {
      return res.json({ error: "Forneça o nome do projeto" });
    }
    if (!idcliente || idcliente.trim().length == 0) {
      return res.json({ error: "Forneça o cliente" });
    }
    const cliente = await AppDataSource.manager.findOneBy(Cliente, { idcliente });
    if (!cliente || !cliente.idcliente) {
      return res.json({ error: "Cliente inválido" });
    }
    if (!idcliente || idcliente.trim().length == 0) {
      return res.json({ error: "Forneça o cliente" });
    }

    const object = new Projeto();
    object.nome = nome.trim();
    object.cliente = cliente;
    if (status) {
      object.status = status.trim();
    }
    if (colaboradores && colaboradores.trim().split(",").length > 0) {
      const lista = colaboradores.trim().split(",");
      const objectColaboradores = [];
      for (let i = 0, colaborador: any; i < lista.length; i++) {
        colaborador = await AppDataSource.manager.findOneBy(Colaborador, { idcolaborador: lista[i] });
        if (colaborador && colaborador.idcolaborador) {
          objectColaboradores.push(colaborador);
        }
      }
      object.colaboradores = objectColaboradores;
    }

    const turno: any = await AppDataSource.manager.save(Projeto, object).catch((e) => {
      // testa se o nome é repetido
      if (/(nome)[\s\S]+(already exists)/.test(e.detail)) {
        return { error: 'Já existe um projeto com este nome' }
      }
      return e.message;
    })
    return res.json(turno);
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    const { idprojeto } = req.body;
    if (!idprojeto || idprojeto.trim() === "") {
      return res.json({ error: "Forneça o identificador do projeto" });
    }
    const object: any = await AppDataSource.manager.findOneBy(Projeto, { idprojeto });
    if (object && object.idprojeto) {
      const r = await AppDataSource.manager.remove(Projeto, object).catch((e) => e.message);
      return res.json(r);
    }
    else {
      return res.json({ error: "Projeto não localizado" })
    }
  }

  public async update(req: Request, res: Response): Promise<Response> {
    let { idprojeto, nome, idcliente, status, colaboradores } = req.body;
    if (!idprojeto || idprojeto.trim() === "") {
      return res.json({ error: "Forneça o identificador do projeto" });
    }
    const object: any = await AppDataSource.manager.findOneBy(Projeto, { idprojeto });
    if (object && object.idprojeto) {
      object.nome = !nome || nome.trim() === '' ? object.nome : nome.trim();
      object.status = !status || status.trim() === '' ? object.status : status.trim();
      if (idcliente) {
        const cliente = await AppDataSource.manager.findOneBy(Cliente, { idcliente });
        if (cliente && cliente.idcliente) {
          object.cliente = cliente;
        }
      }
      if (colaboradores && colaboradores.trim().split(",").length > 0) {
        const lista = colaboradores.trim().split(",");
        const objectColaboradores = [];
        for (let i = 0, colaborador: any; i < lista.length; i++) {
          colaborador = await AppDataSource.manager.findOneBy(Colaborador, { idcolaborador: lista[i] });
          if (colaborador && colaborador.idcolaborador) {
            objectColaboradores.push(colaborador);
          }
        }
        object.colaboradores = objectColaboradores;
      }

      const projeto = await AppDataSource.manager.save(Projeto, object).catch((e) => {
        // testa se o nome é repetido
        if (/(nome)[\s\S]+(already exists)/.test(e.detail)) {
          return { error: 'Já existe um projeto com este nome' };
        }
        return e.message;
      })
      return res.json(projeto);
    }
    else {
      return res.json({ error: "Projeto não localizado" });
    }
  }

  public async list(req: Request, res: Response): Promise<Response> {
    const { status } = req.params;
    const _status = status as Status;
    const object: any = await AppDataSource.getRepository(Projeto).find({
      where: {
        status: _status
      },
      relations: {
        colaboradores: true
      },
      order: {
        nome: 'asc'
      }
    });
    return res.json(object);
  }

}

export default new ProjetoController();