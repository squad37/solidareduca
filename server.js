const { getEscolas, getAlunos, cadastrarAluno, getAlunosDaEscola } = require('./lib/api-solidareduca');

require('dotenv').config(); // read .env files
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Set public folder as root
app.use(express.static('public'));

// Allow front-end access to node_modules folder
app.use('/scripts', express.static(`${__dirname}/node_modules/`));

const cors = require('cors');
app.use(cors()); // Use this after the variable declaration

/** Place this code right before the error handler function **/

// Parse POST data as URL encoded data
app.use(bodyParser.urlencoded({
    extended: true,
  }));
  
  // Parse POST data as JSON
  app.use(bodyParser.json());

// Express Error handler
const errorHandler = (err, req, res) => {
    if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        res.status(403).send({ title: 'Server responded with an error', message: err.message });
    } else if (err.request) {
        // The request was made but no response was received
        res.status(503).send({ title: 'Unable to communicate with server', message: err.message });
    } else {
        // Something happened in setting up the request that triggered an Error
        res.status(500).send({ title: 'An unexpected error occurred', message: err.message });
    }
};

//Fetch Escolas
app.get('/api/escolas',async (req, res) => {
   try{
       const data = await getEscolas();
       res.setHeader('Content-Type', 'application/json');
       res.send(data);
   } catch (error) {
       errorHandler(error, req, res);
   }
});

//Fetch Alunos
app.get('/api/alunos',async (req, res) => {
    try{
        const data = await getAlunos();
        res.setHeader('Content-Type', 'application/json');
        res.send(data);
    } catch (error) {
        errorHandler(error, req, res);
    }
 });

 //Procurar por alunos de uma única escola
app.get('/api/alunosDaescola/:id_escola', async (req,res) => {
    try{
        const  id_escola  = req.params.id_escola;
        const data = await getAlunosDaEscola(id_escola);
        res.setHeader('Content-Type', 'application/json');
        res.send(data);
    } catch (error) {
        console.log("errochamadalocal");
        console.log(error);
        errorHandler(error, req, res);
    }
 });

// Cadastro de Aluno
app.post('alunos', async (req, res) => {
     try {
         const { nome, email, cpf, cep, uf, endereco, nome_responsavel, id_escola } = req.body;
         const data = await cadastrarAluno(nome, email, cpf, cep, uf, endereco, nome_responsavel, id_escola);
         res.setHeader('Content-Type', 'application/json');
         res.setHeader('id_escola', id_escola);
         console.log(data);
         res.send(data);
     } catch (error) {
         errorHandler(error, req, res);
     }
 });

// Redirect all traffic to index.html
app.use((req, res) => res.sendFile(`${__dirname}/public/index.html`));

// Listen for HTTP requests on port 3000
app.listen(port, () => {
    console.log('listening on %d', port);
});


// Test Escolas Endpoint
// const test = async() => {
//     const data = await getEscolas();
//     console.log(data);
// }

// Test Escolas Endpoint
// const test = async() => {
//     const data = await getAlunos(`df177b49-d371-423b-b81d-082d92fd1c48`);
//     console.log(data);
// };

// test();
