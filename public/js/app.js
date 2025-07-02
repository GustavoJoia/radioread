// Importações, como telas, variaveis globais e componentes personalizados, aqui.
import { Home } from "./pages/home.js";
import { Plan } from "./pages/plan.js";
import { Sensor } from "./pages/sensor.js";
import { Leds } from "./pages/leds.js";
import { Upload } from "./pages/upload.js";

import { Sidebar } from "./components/sidebar.js";

// Telas, de acordo com o padrão do gerenciador de rotas do Vue.js
const routes = [
    { path:'/', component: Home, meta: {title: 'Início'} },
    { path: '/plan', component: Plan, meta: {title: 'LEDs - Planilha'} },
    { path: '/leds', component: Leds, meta: {title:'LEDs - Radiômetro'}},
    { path: '/sensor', component: Sensor, meta: {title: 'Sensor - Temperatura, Pressão, Umidade'}},
    { path: '/upload', component: Upload, meta: {title: 'Sensor - Upload de dados via .txt'}}
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