import AppDataSource from "../data-source";
import { Request, Response } from 'express';
import { Colaborador, Turno } from '../entities';
import { Perfil } from '../entities';
import { generateToken } from "../middlewares";

class ColaboradorController {

  public async login(req: Request, res: Response): Promise<Response> {
    const { matricula, senha } = req.body;
    // como a propriedade senha não está disponível para select {select: false},
    // então precisamos usar esta conulta para forçar incluir a propriedade 
    const colaborador: any = await AppDataSource
      .getRepository(Colaborador)
      .createQueryBuilder("colaborador")
      .select()
      .addSelect('colaborador.senha')
      .where("colaborador.matricula=:matricula", { matricula })
      .getOne();

    if (colaborador && colaborador.idcolaborador) {
      const r = await colaborador.compare(senha);
      if (r) {
        const token = await generateToken({ id: colaborador.idcolaborador, perfil: colaborador.perfil })
        return res.json({
          nome: colaborador.nome,
          perfil: colaborador.perfil,
          token
        })
      }
      return res.json({ error: "Dados de login não conferem" });
    }
    else {
      return res.json({ error: "Usuário não localizado" });
    }
  }

  public async create(req: Request, res: Response): Promise<Response> {
    let { nome, matricula, idturno, idgestor, perfil, senha } = req.body;
    if (!nome || nome.trim().length == 0) {
      return res.json({ error: "Forneça o nome do colaborador" });
    }
    if (!matricula || matricula.trim().length == 0) {
      return res.json({ error: "Forneça a matrícula do colaborador" });
    }
    if (!senha || senha.trim().length == 0) {
      return res.json({ error: "Forneça a senha do colaborador" });
    }
    const object = new Colaborador();
    object.nome = nome.trim();
    object.matricula = matricula.trim();
    object.senha = senha.trim();
    object.perfil = !perfil ? "colaborador" : perfil;
    if( idturno ){
      const turno = await AppDataSource.manager.findOneBy(Turno, { idturno });
      if( !turno || !turno.idturno ){
        return res.json({ error: "Turno inválido" });
      }
      object.turno = turno;
    }
    if( idgestor ){
      const gestor = await AppDataSource.manager.findOneBy(Colaborador, { idcolaborador:idgestor });
      if( !gestor || !gestor.idcolaborador ){
        return res.json({ error: "Gestor não localizado" });
      }
      if( gestor.perfil !== "gestor"){
        return res.json({ error: "O colaborador fornecido não possui perfil de gestor" });
      }
      object.gestor = gestor;
    }
    const response: any = await AppDataSource.manager.save(Colaborador, object).catch((e) => {
      // testa se a matrícula é repetida
      if (/(matricula)[\s\S]+(already exists)/.test(e.detail)) {
        return { error: 'Esta matrícula já existe no cadastro' }
      }
      return { error: e.message }
    })

    return res.json(response);
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    const { idcolaborador } = req.body;
    if( !idcolaborador || idcolaborador.trim() === "" ){
      return res.json({error:"Forneça o identificador do colaborador"});
    }
    const object: any = await AppDataSource.manager.findOneBy(Colaborador, { idcolaborador });
    if (object && object.idcolaborador) {
      const r = await AppDataSource.manager.remove(Colaborador, object).catch((e) => e.message)
      return res.json(r)
    }
    else {
      return res.json({ error: "Colaborador não localizado" })
    }
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const { idcolaborador, nome, matricula, idturno, idgestor, perfil} = req.body
    if( !idcolaborador || idcolaborador.trim() === "" ){
      return res.json({error:"Forneça o identificador do colaborador"});
    }
    const object: any = await AppDataSource.manager.findOneBy(Colaborador, { idcolaborador });
    if (object && object.idcolaborador) {
      object.nome = !nome || nome.trim() === '' ? object.nome : nome.trim();
      object.matricula = !matricula || matricula.trim() === '' ? object.matricula : matricula.trim();
      object.perfil = !perfil || perfil.trim() === '' ? object.perfil : perfil.trim();
      if( idturno ){
        const turno = await AppDataSource.manager.findOneBy(Turno, { idturno });
        if( !turno || !turno.idturno ){
          return res.json({ error: "Turno inválido" });
        }
        object.turno = turno;
      }
      if( idgestor == idcolaborador){
        return res.json({error:"O colaborador não pode ser gestor de si mesmo"});
      }
      if( idgestor ){
        const gestor = await AppDataSource.manager.findOneBy(Colaborador, { idcolaborador:idgestor });
        if( !gestor || !gestor.idcolaborador ){
          return res.json({ error: "Gestor não localizado" });
        }
        if( gestor.perfil !== "gestor"){
          return res.json({ error: "O colaborador fornecido não possui perfil de gestor" });
        }
        object.gestor = gestor;
      }

      const colaborador = await AppDataSource.manager.save(Colaborador, object).catch((e) => {
        // testa se a matrícula é repetida
        if (/(matricula)[\s\S]+(already exists)/.test(e.detail)) {
          return { error: 'Esta matrícula já existe no cadastro' }
        }
        return e.message;
      })
      return res.json(colaborador);
    }
    else {
      return res.json({ error: "Colaborador não localizado" })
    }
  }

  public async updatePassword(req: Request, res: Response): Promise<Response> {
    const { senha } = req.body;
    const { id } = res.locals;
    if (!senha || senha.trim().length == 0) {
      return res.json({ error: "Forneça a nova senha" });
    }
    const object: any = await AppDataSource.manager.findOneBy(Colaborador, { idcolaborador:id });
    if (object && object.idcolaborador) {
      object.senha = senha.trim();
      const colaborador = await AppDataSource.manager.save(Colaborador, object);
      return res.json(colaborador);
    }
    else {
      return res.json({ error: "Colaborador não localizado" })
    }
  }

  public async list(req: Request, res: Response): Promise<Response> {
    const {perfil} = req.params;
    const _perfil = perfil as Perfil;
    const object: any = await AppDataSource.getRepository(Colaborador).find({
      where: {
        perfil: _perfil
      },
      relations: {
        projetos: true
      },
      order: {
        nome: 'asc'
      }
    });
    return res.json(object);
  }

}

export default new ColaboradorController();