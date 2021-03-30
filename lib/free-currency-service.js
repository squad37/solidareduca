/**
 * Created by brenokx on 26/03/2021.
 */
require('dotenv').config();
const axios = require('axios');

const api = axios.create({
    baseURL: 'http://127.0.0.1:3333',
    timeout: process.env.TIMEOUT || 5000,
});

module.exports = {
    convertCurrency: async (from, to) => {
        const response = await api.get(`/convert?q=${from}_${to}&compact=ultra`);
        const key = Object.keys(response.data);
        const val = response.data[key];
        return { rate: val };
    },
    cadastrarAluno: async ( nome, email, cpf, cep, uf, endereco, nome_responsavel, id_escola) => {
        const response = await api.get(`/alunos?nome=${nome}&email=${email}&cpf=${cpf}&uf=${uf}&cep=${cep}&endereco=${endereco}&nome_responsavel=${nome_responsavel}&id_escola=${id_escola}`);
        const key = Object.keys(response.data);
        const val = response.data[key];
        return { rate: val };
    },
};