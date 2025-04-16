export const Home = {
    template:`
        <button @click="exemplo">Clica aqui</button>
    `,

    methods:{
        exemplo(){
            console.log('Está funcionando!');
        }
    },
}