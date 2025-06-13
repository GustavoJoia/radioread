export const Home = {
    template:`
        <h1>Placeholder</h1>
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
    mounted(){
    }
}