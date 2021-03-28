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
        baseURL: 'http://localhost:3000/api',
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

    router.add('/cadastro', () => {
        let html = cadastroTemplate();
        el.html(html);
        $('.loading').removeClass('loading');
    });

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
});
