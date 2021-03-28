/**
 * Created by brenokx on 26/03/2021.
 */
require('dotenv').config();
const axios = require('axios');

const symbols = process.env.SYMBOLS || 'EUR,USD,GBP';

// Axios Client declaration
const api = axios.create({
    baseURL: 'http://127.0.0.1:3333',
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

module.exports = {
    getEscolas: () => get(`/escolas`),
    getAlunos: () => get(`/alunos`),
    // getRates: () => get(`/latest&symbols=${symbols}&base=EUR`),
    // getSymbols: () => get('/symbols'),
};