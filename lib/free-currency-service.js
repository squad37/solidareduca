/**
 * Created by brenokx on 26/03/2021.
 */
require('dotenv').config();
const axios = require('axios');

const api = axios.create({
    baseURL: 'https://free.currconv.com/api/v7',
    params: {
        apiKey: process.env.API_KEY_CURR,
    },
    timeout: process.env.TIMEOUT || 5000,
});

module.exports = {
    convertCurrency: async (from, to) => {
        const response = await api.get(`/convert?q=${from}_${to}&compact=ultra`);
        const key = Object.keys(response.data);
        const val = response.data[key];
        return { rate: val };
    },
};