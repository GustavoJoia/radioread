export const Umi = {
    template: `
        <canvas id="linha_umi"></canvas>
    `,

    data(){
        return{
            documents:[],
            datas:[],
            umidades:[],
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
                this.umidades.push(leitura['umidade_canal1'])
                this.datas.push(leitura['data_hora'])
            });

            const ctx = document.getElementById('linha_umi').getContext('2d')
            const labels = this.datas
            const datasets = [
                {label:'Umidade', data: this.umidades, borderColor:'blue'},
            ]

            if(this.chart){
                this.chart.destroy()
            }
            this.chart = this.createLineChart(ctx,labels,datasets,'Leituras de Umidade')
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
                    },
                    scales: {
                        x: {
                            ticks: {
                                callback: function(value) {
                                    const rawLabel = this.getLabelForValue(value);
                                    const date = new Date(rawLabel);
                                    return `${date.toLocaleDateString('pt-BR')} ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
                                }
                            }
                        }
                    }
                }
            });
        },
    },
    mounted(){
        this.requestTemp();
    }
}