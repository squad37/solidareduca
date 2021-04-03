/**
 * Created by brenokx on 26/03/2021.
 */
require('dotenv').config();
const axios = require('axios');

// Axios Client declaration
const api = axios.create({
    baseURL: process.env.URL_API || 'http://127.0.0.1:3333',
    timeout: process.env.TIMEOUT || 5000,
});

// Generic GET request function
const get = async (url) => {
    const response = await api.get(url);
    const  data  = response.data;
    if (data) {
        return data;
    }
    throw new Error(data.error.type);
};

// Generic POST request function
const post = async (url,{nome, email, cpf, cep, uf, endereco, nome_responsavel, id_escola}) => {
    const response = await api.post(url,{nome, email, cpf, cep, uf, endereco, nome_responsavel, id_escola});
    const  data  = response.data;
    if (data) {
        return data;
    }
    throw new Error(data.error.type);
};

module.exports = {
    getEscolas: () => get(`/escolas`),
    getAlunos: () => get(`/alunos`),
    getAlunosDaEscola: async (id_escola) => {
        try{
           const response = await get(`/alunos/${id_escola}`);
           const val = response;
           return val;
        } catch (error) {
            console.log("errochamadaapi");
            console.log(error);
            errorHandler(error, req, res);
        }
    },
    getMateriais: () => get(`/materiais`),
    getPedidosDoAluno: async (id_aluno) => {
        try{
           const response = await get(`/pedidos/${id_aluno}`);
           const val = response;
           return val;
        } catch (error) {
            console.log("errochamadaapi");
            console.log(error);
            errorHandler(error, req, res);
        }
    },
    getPedidosDoAlunoDaEscola: async (id_aluno) => {
        try{
           const response = await get(`/pedidos/${id_aluno}/aguardando-doador`);
           const val = response;
           return val;
        } catch (error) {
            console.log("errochamadaapi");
            console.log(error);
            errorHandler(error, req, res);
        }
    },
    cadastrarAluno: async ( nome, email, cpf, cep, uf, endereco, nome_responsavel, id_escola) => {
        const response = await api.get(`/alunos?nome=${nome}&email=${email}&cpf=${cpf}&uf=${uf}&cep=${cep}&endereco=${endereco}&nome_responsavel=${nome_responsavel}&id_escola=${id_escola}`);
        const key = Object.keys(response.data);
        const val = response.data[key];
        return { rate: val };
    },
    postAluno: (nome, email, cpf, cep, uf, endereco, nome_responsavel, id_escola) => post('/alunos',{nome, email, cpf, cep, uf, endereco, nome_responsavel, id_escola}),
};