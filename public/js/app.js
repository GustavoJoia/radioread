// Importações, como telas, variaveis globais e componentes personalizados, aqui.
import { Home } from "./pages/home.js";
import { Led } from "./pages/led.js";
import { Temp } from "./pages/temp.js";
import { Umi } from "./pages/umi.js";
import { Press } from "./pages/press.js";

import { Sidebar } from "./components/sidebar.js";

// Telas, de acordo com o padrão do gerenciador de rotas do Vue.js
const routes = [
    { path:'/', component: Home, meta: {title: 'Início'} },
    { path: '/leds', component: Led, meta: {title: 'LEDs'} },
    { path: '/temps', component: Temp, meta: {title: 'Temperatura'}},
    { path: '/umi', component: Umi, meta: {title: 'Umidade'}},
    { path: '/press', component: Press, meta: {title: 'Pressão'}}
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

    components:{
        Sidebar
    },

    //componentes em si
    template: `
        <div class="d-flex justify-content-start flex-row h-100">
            <Sidebar></Sidebar>
            <div class="flex-grow-1 p-4">
                <router-view class="flex-grow-1 p-4"></router-view>
            </div>
        </div>
    `,
}

//Finalização da criação do app

const app = Vue.createApp(App);
app.use(router);
app.mount('#app');