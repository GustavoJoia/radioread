export const Temp = {
    template: `<h1>Tela de temperatura</h1>`,

    methods:{
        requestTemp(){
            let server = window.location.origin;
            fetch(`${server}/api/sensor/listar`)
            .then(response=>response.json())
            .then(response=>
                console.log(response)
            )
        },
    },
    mounted(){
        this.requestTemp();
    }
}