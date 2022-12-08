import * as express from "express";
import* as cors from "cors";
import * as dotenv from "dotenv";


dotenv.config();    //precisa ser chamado no início do arquivo
const PORT = process.env.PORT || 3000;      //lê a variável PORT do arquivo .env
const app = express();      // cria o servidor
app.use(express.json());       // suporta parâmetros JSON nobody da requisição
app.use(cors());      // suporta requisições de qualquer domínio

// inicializao servidor na porta especificada
app.listen(PORT, () => console.log(`Rodando na porta ${PORT}`));