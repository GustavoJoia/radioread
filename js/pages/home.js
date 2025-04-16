export const Home = {
    template:`
        <button @click="exemplo">Clica aqui</button>
    `,

    methods:{
        exemplo(){
            Swal.fire({
                title: 'Perfeito!',
                text: 'A configuração do ambiente Vue.js está funcionando!',
                icon: 'success'
            });
        }
    },
}