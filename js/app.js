// Importações, como telas, variaveis globais e componentes personalizados, aqui.
import { Home } from "./pages/home.js";

// Telas, de acordo com o padrão do gerenciador de rotas do Vue.js
const routes = [
    { path:'/', component: Home, meta: {title: 'Início'} }
];

//roteador

const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes
});

// títulos personalizados
router.afterEach((to)=>{
    const defaultTitle = 'Radiômetro de LED';
    document.title = to.meta.title ? `${to.meta.title} - ${defaultTitle}` : defaultTitle;
});

// aplicação
const App = {

    //valores para usar nas funções, no componente etc.
    data(){
        return{

        }
    },

    //funções para usar no componente
    methods:{
        exemplo(){
            console.log('Está funcionando!');
        }
    },

    //componentes em si
    template: `
        <div class="d-flex justify-content-start flex-row h-100">
            <router-view></router-view>
        </div>
    `,
}

//Finalização da criação do app

const app = Vue.createApp(App);
app.use(router);
app.mount('#app');