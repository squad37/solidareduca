/**
 * Created by brenokx on 26/03/2021.
 */
window.addEventListener('load', () => {
    const el = $('#app');

    // Compile Handlebar Templates
    const errorTemplate = Handlebars.compile($('#error-template').html());
    const rankingTemplate = Handlebars.compile($('#ranking-template').html());
    const cadastroTemplate = Handlebars.compile($('#cadastro-template').html());
    const sobreTemplate = Handlebars.compile($('#sobre-template').html());

    // Router Declaration
    const router = new Router({
        mode: 'history',
        page404: (path) => {
            const html = errorTemplate({
                color: 'yellow',
                title: 'Error 404 - Page NOT Found!',
                message: `The path '/${path}' does not exist on this site`,
            });
            el.html(html);
        },
    });

    // Instantiate api handler
    const api = axios.create({
        baseURL: 'http://solidareduca.com:3000/api',
        timeout: 5000,
    });

    
    // Instantiate api handler
    const api_solidareduca = axios.create({
        baseURL: 'http://solidareduca.com:3333',
        timeout: 5000,
    });

    // Display Error Banner
    const showError = (error) => {
        const { title, message } = error.response.data;
        const html = errorTemplate({ color: 'red', title, message });
        el.html(html);
    };

    // Display Latest Currency Rates
    router.add('/', async () => {
        // Display loader first
        let html = rankingTemplate();
        el.html(html);
        try {
            // Load Currency Rates
            const response = await api.get('/escolas');
            const escolas  = response.data;
            console.log("escolas");
            console.log(escolas);
            // Display Rates Table
            html = rankingTemplate({ escolas });
            el.html(html);
        } catch (error) {
            showError(error);
        } finally {
            // Remove loader status
            $('.loading').removeClass('loading');
        }
    });

    router.add('/cadastro', async () => {
        let html = cadastroTemplate();
        el.html(html);
        try {
            // Load Currency Rates
            const response = await api.get('/escolas');
            const escolas  = response.data;
            console.log("escolas");
            console.log(escolas);
            // Display Rates Table
            html = cadastroTemplate({ escolas });
            el.html(html);
        } catch (error) {
            showError(error);
        } finally {
            // Remove loader status
            $('.loading').removeClass('loading');
        }
        try {
          
            $('.loading').removeClass('loading');
            // Validate Form Inputs
            $('.ui.form').form({
              fields: {
                nome: 'empty',
                email: 'empty',
                cpf: 'empty', 
                uf: 'empty',
                cep: 'empty',
                endereco: 'empty', 
                nome_responsavel: 'empty', 
                id_escola: 'empty',
              },
            });
            // Specify Submit Handler
            $('.submit').click(cadastrarAlunoRatesHandler);
          } catch (error) {
            showError(error);
          }
    });
/*
    router.add('/cadastro', async () => {
        let html = cadastroTemplate();
        el.html(html);
        try {
            // Load Currency Rates
            const response = await api.get('/escolas');
            const escolas  = response.data;
            console.log("escolas");
            console.log(escolas);
            // Display Rates Table
            html = cadastroTemplate({ escolas });
            el.html(html);
        } catch (error) {
            showError(error);
        } finally {
            // Remove loader status
            $('.loading').removeClass('loading');
        }
    });*/

    router.add('/sobre', () => {
        let html = sobreTemplate();
        el.html(html);
    });

// Navigate app to current url
    router.navigateTo(window.location.pathname);

    // Highlight Active Menu on Refresh/Page Reload
    const link = $(`a[href$='${window.location.pathname}']`);
    link.addClass('active');

    $('a').on('click', (event) => {
        // Block browser page load
        event.preventDefault();

        // Highlight Active Menu on Click
        const target = $(event.target);
        $('.item').removeClass('active');
        target.addClass('active');

        // Navigate to clicked url
        const href = target.attr('href');
        const path = href.substr(href.lastIndexOf('/'));
        router.navigateTo(path);
    });
    

    // Requisição POST, cadastrar aluno
    const getCadastrarAlunoResults = async () => {
        // Extract form data
        const nome = $('#nome').val();
        const email = $('#email').val(); 
        const cpf = $('#cpf').val(); 
        const uf = $('#uf').val(); 
        const cep  = $('#cep').val();
        const endereco  = $('#endereco').val(); 
        const nome_responsavel = $('#nome_responsavel').val();
        const id_escola  = $('#id_escola').val();

        const aluno = {
            "nome": `${nome}`,
            "email": `${email}`,
            "cpf": `${cpf}`,
            "uf": `${uf}`,
            "cep": `${cep}`,
            "endereco": `${endereco}`,
            "nome_responsavel": `${nome_responsavel}`,
            "id_escola": `${id_escola}`
        };

        const headers = new Headers({
            "Content-Type":  "application/json",
            "Accept": "application/json",
            "id_escola": `${id_escola}`
          });

        const httpOptions = {
            headers: headers
          };
        
        
        // Send post data to Express(proxy) server
        try {
          const response = await api_solidareduca.post(`/alunos`, 
          aluno, httpOptions)
          .then((res) => {
            console.log("RESPONSE RECEIVED: ", res);
            /*Comentando informação para aparecer no campo resultCadastro em index.html
            //Mensagem de confirmação de cadastro
            $('#resultCadastro').html(`CADASTRO REALIZDO COM SUCESSO`);
            */
           alert(`CADASTRO REALIZDO COM SUCESSO`);
            router.navigateTo(window.location.pathname);
          })
          .catch((err) => {
            console.log("AXIOS ERROR: ", err);
            /*Comentando informação para aparecer no campo resultCadastro em index.html
            //Mensagem de erro de cadastro
            $('#resultCadastro').html(`CADASTRO NÃO REALIZDO, TENTE NOVAMENTE`);
            */
            alert(`CADASTRO NÃO REALIZDO, TENTE NOVAMENTE`);
          });
          


        } catch (error) {
          //showError(error);
        } finally {
          $('#result-segment').removeClass('loading');
        }
      };
      
      // Handle Convert Button Click Event
      const cadastrarAlunoRatesHandler = () => {
        if ($('.ui.form').form('is valid')) {
          // hide error message
          $('.ui.error.message').hide();
          // Post to Express server
          $('#result-segment').addClass('loading');
          getCadastrarAlunoResults();
          // Prevent page from submitting to server
          return false;
        }
        return true;
      };
      
      
      
});


