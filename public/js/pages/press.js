export const Press = {
    template: `<h1>Tela de pressão barométrica</h1>
        <canvas id="linha_press"></canvas>
    `,

    data(){
        return{
            documents:[],
            datas:[],
            pressoes:[],
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
                this.pressoes.push(leitura['pressao_canal1'])
                this.datas.push(leitura['data_hora'])
            });

            const ctx = document.getElementById('linha_press').getContext('2d')
            const labels = this.datas
            const datasets = [
                {label:'Pressão', data: this.pressoes, borderColor:'cyan'},
            ]

            if(this.chart){
                this.chart.destroy()
            }
            this.chart = this.createLineChart(ctx,labels,datasets,'Leituras de Pressão Barométrica')
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