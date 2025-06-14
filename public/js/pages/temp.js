export const Temp = {
    template: `<h1>Tela de temperatura</h1>
        <canvas id="linha_temp"></canvas>
    `,

    data(){
        return{
            documents:[],
            datas:[],
            temperaturas_1:[],
            temperaturas_2:[],
            temperaturas_3:[],
            temperaturas_4:[],
            temperaturas_5:[],
            chart: null,
        }
    },

    methods:{
        requestTemp(){
            Swal.showLoading();
            let server = window.location.origin;
            fetch(`${server}/api/sensor/listar`)
            .then(response=>response.json())
            .then(response=>{
                this.documents = response
                this.renderer()
            })
        },
        renderer(){
            console.log(this.documents)
            this.documents.forEach(leitura => {
                this.temperaturas_1.push(leitura['temperatura_canal1'])
                this.temperaturas_2.push(leitura['temperatura_canal2'])
                this.temperaturas_3.push(leitura['temperatura_canal3'])
                this.temperaturas_4.push(leitura['temperatura_canal4'])
                this.temperaturas_5.push(leitura['temperatura_canal5'])
                this.datas.push(leitura['data_hora'])
            });

            const ctx = document.getElementById('linha_temp').getContext('2d')
            const labels = this.datas
            const datasets = [
                {label:'Temperatura - Canal 1', data: this.temperaturas_1, borderColor:'red'},
                {label:'Temperatura - Canal 2', data: this.temperaturas_2, borderColor:'green'},
                {label:'Temperatura - Canal 3', data: this.temperaturas_3, borderColor:'blue'},
                {label:'Temperatura - Canal 4', data: this.temperaturas_4, borderColor:'orange'},
                {label:'Temperatura - Canal 5', data: this.temperaturas_5, borderColor:'purple'},
            ]

            if(this.chart){
                this.chart.destroy()
            }
            this.chart = this.createLineChart(ctx,labels,datasets,'Leituras de Temperatura')
            Swal.close();
        },
        createLineChart(ctx, labels, datasets, title) {
            return new Chart(ctx, {
                type: 'line',
                data: {
                    labels,
                    datasets: datasets.map(ds => ({
                        ...ds,
                        fill: false,
                        tension: 0.1
                    }))
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: { display: true, position: 'bottom' },
                        title: { display: true, text: title }
                    }
                }
            });
        },
    },
    mounted(){
        this.requestTemp();
    }
}