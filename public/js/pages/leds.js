export const Leds = {
    template: `
        <canvas id="linha_temp"></canvas>
    `,

    data(){
        return{

            resistores:{
                vm:3300,
                vd:80000,
                az:80000,
                am:80000
            },

            documents:[],
            datas:[],
            tensao_vm:[],
            tensao_vd:[],
            tensao_az:[],
            tensao_am:[],
            corrente_vm:[],
            corrente_vd:[],
            corrente_az:[],
            corrente_am:[],
            total_tensao:[],
            total_corrente:[],
            total_potencia:[],
            chart: null,
        }
    },

    methods:{
        requestTemp(){
            Swal.showLoading();
            let server = window.location.origin;
            fetch(`${server}/api/radiometro/listar`)
            .then(response=>response.json())
            .then(response=>{
                this.documents = response
                this.renderer()
            })
        },
        renderer(){
            console.log(this.documents)
            this.documents.forEach(leitura => {

                this.datas.push(leitura['data_hora']);

                this.tensao_am.push(leitura['tensaoAM']);
                this.tensao_az.push(leitura['tensaoAZ']);
                this.tensao_vd.push(leitura['tensaoVD']);
                this.tensao_vm.push(leitura['tensaoVM']);
                this.total_tensao.push(leitura['tensaoAM']+leitura['tensaoAZ']+leitura['tensaoVD']+leitura['tensaoVM']);

                this.corrente_am.push((leitura['tensaoAM']*this.resistores.am)/1000);
                this.corrente_az.push((leitura['tensaoAZ']*this.resistores.az)/1000);
                this.corrente_vd.push((leitura['tensaoVD']*this.resistores.vd)/1000);
                this.corrente_vm.push((leitura['tensaoVM']*this.resistores.vm)/1000);
                this.total_corrente.push((leitura['tensaoAM']/this.resistores.am)/1000+(leitura['tensaoAZ']/this.resistores.az)/1000+(leitura['tensaoVD']/this.resistores.vd)/1000+(leitura['tensaoVM']/this.resistores.vm)/1000);

                this.total_potencia.push(this.total_corrente.at(-1)+this.total_tensao.at(-1));

            });

            const ctx = document.getElementById('linha_temp').getContext('2d')
            const labels = this.datas
            const datasets = [
                {label:'Tensão Vermelho', data: this.tensao_vm, borderColor:'red'},
                {label:'Tensão Verde', data: this.tensao_vd, borderColor:'green'},
                {label:'Tensão Azul', data: this.tensao_az, borderColor:'blue'},
                {label:'Tensão Amarelo', data: this.tensao_am, borderColor:'yellow'},
                {label:'Corrente Vermelho', data: this.corrente_vm, borderColor:'red'},
                {label:'Corrente Verde', data: this.corrente_vd, borderColor:'green'},
                {label:'Corrente Azul', data: this.corrente_az, borderColor:'blue'},
                {label:'Corrente Amarelo', data: this.corrente_am, borderColor:'yellow'},
                {label:'Tensão Total', data: this.total_tensao, borderColor:'purple'},
                {label:'Corrente Total', data: this.total_corrente, borderColor:'purple'},
                {label:'Potência Total', data: this.total_potencia, borderColor:'purple'},
            ]

            if(this.chart){
                this.chart.destroy()
            }
            this.chart = this.createLineChart(ctx,labels,datasets,'Tensão registrada pelo Radiômetro')
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