/**
 * Created by brenokx on 26/03/2021.
 */
window.addEventListener('load', () => {
    const el = $('#app');

    // Compile Handlebar Templates
    const errorTemplate = Handlebars.compile($('#error-template').html());
    const rankingTemplate = Handlebars.compile($('#ranking-template').html());
    const cadastroTemplate = Handlebars.compile($('#cadastro-template').html());
    const cadastroAlunoTemplate = Handlebars.compile($('#cadastroAluno-template').html());
    const cadastroDoadorTemplate = Handlebars.compile($('#cadastroDoador-template').html());
    const sobreTemplate = Handlebars.compile($('#sobre-template').html());
    const alunosDaEscolaTemplate = Handlebars.compile($('#alunosDaEscola-template').html());
    const autenticacaoAlunoTemplate = Handlebars.compile($('#autenticacaoAluno-template').html());
    const cadastrarPedidoTemplate = Handlebars.compile($('#cadastrarPedido-template').html());

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
        baseURL: 'http://127.0.0.1:3000/api',
        timeout: 5000,
    });

    
    // Instantiate api handler
    const api_solidareduca = axios.create({
        baseURL: 'http://127.0.0.1:3333',
        timeout: 5000,
    });

    // Display Error Banner
    const showError = (error) => {
        console.log(error);
        if (error.hasOwnProperty('data')){
            const { title, message } = error.response.data;
        }

        const html = errorTemplate({ color: 'red', title, message });
        el.html(html);
    };

    // Display Latest Currency Rates
    router.add('/', async () => {
        // Display loader first
        let html = rankingTemplate();
        el.html(html);
        try {
            // Load Escolas Ranking
            //verificar se consegue usar o JSON dentro do template
            // this.JSON = JSON;
            const response = await api.get('/escolas');
            const escolas  = response.data;
            // Display Escolas Ranking Table
            html = rankingTemplate({ escolas });
            el.html(html);
            // Specify Submit Handler

            $('.alunosEscola').click( function(){
                const id_escola = this.dataset.json;
                getListarAlunosDaEscola(id_escola);
            });
        } catch (error) {
            showError(error);
        } finally {
            // Remove loader status
            $('.loading').removeClass('loading');
        }
    });

    //Rota do cadastro
    router.add('/cadastro', () => {
      let html = cadastroTemplate();
      el.html(html);
    });

    //Rota do cadastro do aluno
    router.add('/cadastroAluno', async () => {
        let html = cadastroAlunoTemplate();
        el.html(html);
        try {
            // Load Escolas
            const response = await api.get('/escolas');
            const escolas  = response.data;
            console.log("escolas");
            console.log(escolas);
            // Display Escolas select options
            html = cadastroAlunoTemplate({ escolas });
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
                senha: 'empty'
              },
            });
            // Specify Submit Handler
            $('.submit').click(cadastrarAlunoRatesHandler);
          } catch (error) {
            showError(error);
          }
    });

    //Rota do cadastro do doador
    router.add('/cadastroDoador', async () => {
      let html = cadastroDoadorTemplate();
      el.html(html);
      try {
          // Load Escolas CÒDIGO ÚTIL APENAS PARA NÂO DA ERRO AO ENTRAR NO PRÒXIMO TRY CATCH
          const response = await api.get('/escolas');
          const escolas  = response.data;
          console.log("escolas");
          console.log(escolas);
          // Display Escolas select options
          //html = cadastroDoadorTemplate({ escolas });
          //el.html(html);
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
              },
            });
            // Specify Submit Handler
            $('.submit').click(cadastrarDoadorHandler);
          } catch (error) {
            showError(error);
          }
  });

    router.add('/sobre', () => {
        let html = sobreTemplate();
        el.html(html);
    });

    router.add('/alunosDaescola', async () => {

    });

    router.add('/autenticacaoAluno', async () => {
      let html = autenticacaoAlunoTemplate();
      el.html(html);//código não usado
      try {
        // Load Escolas
        const response = await api.get('/escolas');
        const escolas  = response.data;
        console.log(escolas);
        
    } catch (error) {
        showError(error);
    } finally {
        // Remove loader status
        $('.loading').removeClass('loading');
    }//código usado
    try {
      
        $('.loading').removeClass('loading');
        // Validate Form Inputs
        $('.ui.form').form({
          fields: {
            email: 'empty',
            senha: 'empty'
          },
        });
        // Specify Submit Handler
        $('.submit').click(logarAlunoHandler);
      } catch (error) {
        showError(error);
      }
    });

    router.add('/cadastrarPedido', async () => {
      let html = cadastrarPedidoTemplate();
      el.html(html);
      try {
        // Load Materiais
        const response = await api.get('/materiais');
        const materiais  = response.data;
        console.log(materiais);

        // Receber a string do LocalStorage
        let alunoString = localStorage.getItem('aluno');
        // transformar em objeto novamente
        let alunoObj = JSON.parse(alunoString);

         // Load Pedidos
        const response2 = await api.get(`/pedidosDoAluno/${alunoObj.id_aluno}`);
        const pedidos  = response2.data;
        console.log(pedidos);

        // Display Escolas select options
        html = cadastrarPedidoTemplate({ materiais, alunoObj, pedidos });
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
            id_material: 'empty',
            quantidade: 'empty',
            id_aluno: 'empty'
          },
        });
        // Specify Submit Handler
        $('.submit').click(cadastrarPedidoHandler);
      } catch (error) {
        showError(error);
      }
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
    
    // Requisição GET, enviar id_escola para listar alunos
    const getListarAlunosDaEscola = async (id_escola) => {

        try {
            console.log(id_escola);
            // Load Alunos da Escola
            const response = await api.get(`/alunosDaescola/${id_escola}`);
            const alunos  = response.data;
            console.log(alunos);
            // Display Alunos da Escola
            html = alunosDaEscolaTemplate({ alunos });
            el.html(html);
            router.navigateTo("/alunosDaescola");
        } catch (error) {
            showError(error);
            console.log(error);
        } finally {
            // Remove loader status
            $('.loading').removeClass('loading');
        }
    };
    
    //==========================================================
    // CADASTRO DO ALUNO
    //=========================================================
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
        const senha = $('#senha').val();

        const aluno = {
            "nome": `${nome}`,
            "email": `${email}`,
            "cpf": `${cpf}`,
            "uf": `${uf}`,
            "cep": `${cep}`,
            "endereco": `${endereco}`,
            "nome_responsavel": `${nome_responsavel}`,
            "id_escola": `${id_escola}`,
            "senha": `${senha}`
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
      
      // Requisição POST, autenticar aluno
    const getLogarAlunoResults = async () => {
      // Extract form data
      const email = $('#email').val(); 
      const senha = $('#senha').val();

      const aluno = {
          "email": `${email}`,
          "senha": `${senha}`
      };
      
      
      // Send post data to Express(proxy) server
      try {
        const response = await api_solidareduca.post(`/alunos/autenticacao`, 
        aluno)
        .then((res) => {
          console.log("RESPONSE RECEIVED: ", res);
          const aluno  = res.data;
          console.log(aluno);

          // Transformar o objeto em string e salvar em localStorage
          localStorage.setItem('aluno', JSON.stringify(aluno));

          // Display Alunos da Escola
          html = autenticacaoAlunoTemplate({ aluno });
          el.html(html);
          router.navigateTo("/cadastrarPedido");
        })
        .catch((err) => {
          console.log("AXIOS ERROR: ", err);
          //alert(`Dados não encontrados, tente novamente!`);
        });
        


      } catch (error) {
        //showError(error);
      } finally {
        $('#result-segment').removeClass('loading');
      }
    };

      // Handle Logar Aluno Click Event
      const logarAlunoHandler = () => {
        if ($('.ui.form').form('is valid')) {
          // hide error message
          $('.ui.error.message').hide();
          // Post to Express server
          $('#result-segment').addClass('loading');
          getLogarAlunoResults();
          // Prevent page from submitting to server
          return false;
        }
        return true;
      };

       // Requisição POST, cadastrar pedido
      const getCadastrarPedidoResults = async () => {
      // Extract form data
      const id_material = $('#id_material').val(); 
      const quantidade = $('#quantidade').val();
      const id_aluno = $('#id_aluno').val();

      const pedido = {
          "id_material": `${id_material}`,
          "quantidade": `${quantidade}`,
          "id_aluno": `${id_aluno}`
      };
      
      
      // Send post data to Express(proxy) server
      try {
        const response = await api_solidareduca.post(`/pedidos`, 
        pedido)
        .then((res) => {
          console.log("RESPONSE RECEIVED: ", res);
          const pedido  = res.data;
          console.log(pedido);

          alert("CADASTRO DO PEDIDO REALIZADO COM SUCESSO!");
          router.navigateTo(window.location.pathname);
        })
        .catch((err) => {
          console.log("AXIOS ERROR: ", err);
          //alert(`Dados não encontrados, tente novamente!`);
        });
        


      } catch (error) {
        //showError(error);
      } finally {
        $('#result-segment').removeClass('loading');
      }
    };

      // Handle Cadastrar Pedido Click Event
      const cadastrarPedidoHandler = () => {
        if ($('.ui.form').form('is valid')) {
          // hide error message
          $('.ui.error.message').hide();
          // Post to Express server
          $('#result-segment').addClass('loading');
          getCadastrarPedidoResults();
          // Prevent page from submitting to server
          return false;
        }
        return true;
      };
      
});


