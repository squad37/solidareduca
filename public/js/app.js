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
    const pedidosDoAlunoDaEscolaTemplate = Handlebars.compile($('#pedidosDoAlunoDaEscola-template').html());
    const autenticacaoDoadorTemplate = Handlebars.compile($('#autenticacaoDoador-template').html());
    const doarPedidoTemplate = Handlebars.compile($('#doarPedido-template').html());
    
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
            $(".rating").rating({interactive:false});
            // Specify Submit Handler

            $('.alunosEscola').click( function(){
                const id_escola = this.dataset.json;
                getListarAlunosDaEscola(id_escola);
            });

            $('.receberDoacao').click( function(){
              router.navigateTo("autenticacaoAluno");
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
                senha: 'empty',
                telefone: 'empty'
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
                senha: 'empty',
                telefone: 'empty'
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
        $(".rating").rating();
    });

    router.add('/alunosDaescola', async () => {

      $('.pedidosAluno').click( function(){
        const id_aluno = this.dataset.json;
        getListarPedidosDoAlunoDaEscola(id_aluno);
      });
    }); 

    router.add('/pedidosDoAlunoDaEscola', async () => {
      $('.fazerDoacao').click( function(){
         const id_pedido = this.dataset.json;
         // Transformar o objeto em string e salvar em localStorage
         localStorage.setItem('pedido_aSerDoado', JSON.stringify({"id_pedido": `${id_pedido}`}));

        router.navigateTo("autenticacaoDoador");
        
      });
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
      var auxError = false;
      try {
        // Receber a string do LocalStorage
        let alunoString = localStorage.getItem('aluno');
        // transformar em objeto novamente
        let alunoObj = JSON.parse(alunoString);

        // Load Pedidos
        const responsex = await api.get(`/pedidosDoAluno/${alunoObj.id_aluno}`);
        
      }catch (error) {
        
        auxError = true;
        
      }finally {
        // Remove loader status
        $('.loading').removeClass('loading');

        
      }
      try {
        // Load Materiais
        const response = await api.get('/materiais');
        const materiais  = response.data;
        console.log(materiais);

        // Receber a string do LocalStorage
        let alunoString = localStorage.getItem('aluno');
        // transformar em objeto novamente
        let alunoObj = JSON.parse(alunoString);

        if(!auxError){
          // Load Pedidos
          const response2 = await api.get(`/pedidosDoAluno/${alunoObj.id_aluno}`);
          const pedidos  = response2.data;

          
          // Display Escolas select options
          html = cadastrarPedidoTemplate({ materiais, alunoObj, pedidos });
          el.html(html);
        }else{
          // Display Escolas select options
          html = cadastrarPedidoTemplate({ materiais, alunoObj });
          el.html(html);
        }
       
        
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
     
      $('.agradecerPedido').click( function(){
        const id_pedido = this.dataset.json;
        getAgradecerDoacao(id_pedido);
      });
      
    });

    router.add('/autenticacaoDoador', async () => {
      let html = autenticacaoDoadorTemplate();
      el.html(html);
      // Remove loader status
      $('.loading').removeClass('loading');
      getAutenticarDoador();
      
    });
    
    router.add('/doarPedido', async () => {
      // Receber a string do LocalStorage
      let pedido_aSerDoado = localStorage.getItem('pedido_aSerDoado');
      // transformar em objeto novamente
      let pedido_aSerDoadoObj = JSON.parse(pedido_aSerDoado);
      // Receber a string do LocalStorage
      let pedidos_do_aluno = localStorage.getItem('pedidos_do_aluno');
      // transformar em objeto novamente
      let pedidos_do_alunoObj = JSON.parse(pedidos_do_aluno);
       // Receber a string do LocalStorage
      let doador = localStorage.getItem('doador');
      // transformar em objeto novamente
      let doadorObj = JSON.parse(doador);

      let html = doarPedidoTemplate({ pedido_aSerDoadoObj, pedidos_do_alunoObj, doadorObj });
      el.html(html);
      // Remove loader status
      $('.loading').removeClass('loading');
      try {
          // Load Escolas CÒDIGO ÚTIL APENAS PARA NÂO DA ERRO AO ENTRAR NO PRÒXIMO TRY CATCH
          const response = await api.get('/escolas');
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
                doador_anonimo: 'empty',
                local_entrega: 'empty',
                previsao_entrega: 'empty'
              },
            });
            // Specify Submit Handler
            $('.submit').click(doarPedidoHandler);
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

    // Requisição GET, enviar id_aluno para listar pedidos do aluno de uma escola
    const getListarPedidosDoAlunoDaEscola = async (id_aluno) => {

      try {
          console.log(id_aluno);
          // Load Alunos da Escola
          const response = await api.get(`/pedidosDoAlunoDaEscola/${id_aluno}`);
          const pedidos  = response.data;
          console.log(pedidos);

          //Salvar objeto com as informações desse aluno, para pegar os dados de endereço do localStorage para cadastrar doação em doarPedido
          // Transformar o objeto em string e salvar em localStorage
          localStorage.setItem('pedidos_do_aluno', JSON.stringify(pedidos));

          // Display Pedidos do Aluno
          html = pedidosDoAlunoDaEscolaTemplate({ pedidos });
          el.html(html);
          router.navigateTo("/pedidosDoAlunoDaEscola");
          
      } catch (error) {
          //showError(error);
          console.log(error);
      } finally {
          // Remove loader status
          $('.loading').removeClass('loading');
      }
  };

  //===================================================
  // AUTENTICAR DOADOR
  const getAutenticarDoador = async () => {
    let html = autenticacaoDoadorTemplate();
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
      $('.submit').click(logarDoadorHandler);
    } catch (error) {
      showError(error);
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
        const telefone = $('#telefone').val();

        const aluno = {
            "nome": `${nome}`,
            "email": `${email}`,
            "cpf": `${cpf}`,
            "uf": `${uf}`,
            "cep": `${cep}`,
            "endereco": `${endereco}`,
            "nome_responsavel": `${nome_responsavel}`,
            "id_escola": `${id_escola}`,
            "senha": `${senha}`,
            "telefone": `${telefone}`
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
           alert(`CADASTRO REALIZDO COM SUCESSO`);
            router.navigateTo(window.location.pathname);
          })
          .catch((err) => {
            console.log("AXIOS ERROR: ", err);
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

      //==========================================================
    // CADASTRO DO DOADOR
    //=========================================================
    // Requisição POST, cadastrar aluno
    const getCadastrarDoadorResults = async () => {
      // Extract form data
      const nome = $('#nome').val();
      const email = $('#email').val(); 
      const cpf = $('#cpf').val(); 
      const uf = $('#uf').val(); 
      const cep  = $('#cep').val();
      const endereco  = $('#endereco').val(); 
      const senha = $('#senha').val();
      const telefone = $('#telefone').val();

      const doador = {
          "nome": `${nome}`,
          "email": `${email}`,
          "cpf": `${cpf}`,
          "uf": `${uf}`,
          "cep": `${cep}`,
          "endereco": `${endereco}`,
          "senha": `${senha}`,
          "telefone": `${telefone}`
      };

      // Send post data to Express(proxy) server
      try {
        const response = await api_solidareduca.post(`/doadores`, 
        doador)
        .then((res) => {
          console.log("RESPONSE RECEIVED: ", res);
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
      const cadastrarDoadorHandler = () => {
        if ($('.ui.form').form('is valid')) {
          // hide error message
          $('.ui.error.message').hide();
          // Post to Express server
          $('#result-segment').addClass('loading');
          getCadastrarDoadorResults();
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
      
      // Requisição POST, autenticar doador
    const getLogarDoadorResults = async () => {
      // Extract form data
      const email = $('#email').val(); 
      const senha = $('#senha').val();

      const doador = {
          "email": `${email}`,
          "senha": `${senha}`
      };
      
      
      // Send post data to Express(proxy) server
      try {
        const response = await api_solidareduca.post(`/doadores/autenticacao`, 
        doador)
        .then((res) => {
          console.log("RESPONSE RECEIVED: ", res);
          const doador  = res.data;
          console.log(doador);

          // Transformar o objeto em string e salvar em localStorage
          localStorage.setItem('doador', JSON.stringify(doador));

          // Display Alunos da Escola
          html = autenticacaoAlunoTemplate({ doador });
          el.html(html);
          router.navigateTo("/doarPedido");
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

      // Handle Logar Doador Click Event
      const logarDoadorHandler = () => {
        if ($('.ui.form').form('is valid')) {
          // hide error message
          $('.ui.error.message').hide();
          // Post to Express server
          $('#result-segment').addClass('loading');
          getLogarDoadorResults();
          // Prevent page from submitting to server
          return false;
        }
        return true;
      };

       // Requisição POST, autenticar doador
    const getDoarPedidoResults = async () => {
      // Extract form data
      const id_pedido = $('#id_pedido').val(); 
      const id_doador = $('#id_doador').val();
      const doador_anonimo = $('#doador_anonimo').val(); 
      const local_entrega = $('#local_entrega').val();
      const endereco_entrega_aluno = $('#endereco_entrega_aluno').val();
      const endereco_entrega_escola = $('#endereco_entrega_escola').val();  
      const previsao_entrega = $('#previsao_entrega').val();
      var endereco_entrega = "";
      if(local_entrega == "Escola"){
        endereco_entrega = endereco_entrega_escola;
      }else{
        endereco_entrega = endereco_entrega_aluno;
      }
      const pedido = {
          "id_pedido": `${id_pedido}`,
          "id_doador": `${id_doador}`,
          "doador_anonimo": `${doador_anonimo}`,
          "local_entrega": `${local_entrega}`,
          "endereco_entrega": `${endereco_entrega}`,
          "previsao_entrega": `${previsao_entrega}`
      };
      
      
      // Send post data to Express(proxy) server
      try {
        const response = await api_solidareduca.put(`/pedidos/${id_pedido}/doador-encontrado`, 
        pedido)
        .then((res) => {
          console.log("RESPONSE RECEIVED: ", res);
          const pedido  = res.data;
          console.log(pedido);

          alert("DOAÇÃO CONFIRMADA");
          router.navigateTo("/");
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

      // Handle Logar Doador Click Event
      const doarPedidoHandler = () => {
        if ($('.ui.form').form('is valid')) {
          // hide error message
          $('.ui.error.message').hide();
          // Post to Express server
          $('#result-segment').addClass('loading');
          getDoarPedidoResults();
          // Prevent page from submitting to server
          return false;
        }
        return true;
      };

      //AGRADECER DOAÇÃO
      const getAgradecerDoacao = (id_pedido) => {
          //AGRADECER DOAÇÃO
        
            const mensagem_agradecimento = prompt("QUAL A MENSAGEM DE AGRADECIMENTO?");
            if(mensagem_agradecimento == null || mensagem_agradecimento == "" || mensagem_agradecimento === ""){
              getAgradecerDoacao(id_pedido);
            }
            try {
            const response3 =  api_solidareduca.put(`/pedidos/${id_pedido}/doacao-concluida`, 
            {"mensagem_agradecimento": `${mensagem_agradecimento}`})
            .then((res) => {
              console.log("RESPONSE RECEIVED: ", res);
              alert(`AGRADECIMENTO ENVIADO COM SUCESSO`);
              router.navigateTo(window.location.pathname);
            })
            .catch((err) => {
              console.log("AXIOS ERROR: ", err);
              //alert(`CADASTRO NÃO REALIZDO, TENTE NOVAMENTE`);
            });
          } catch (error) {
            showError(error);
          }
          
      };
});


