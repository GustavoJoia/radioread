export const Sensor = {
    template: `
        <h1>Coleta do sensor de temperatura, umidade e pressão</h1>
        <div class="mb-4">
            <label for="seletor" class="form-label">Selecione o dado a ser apresentado:</label>
            <select id="seletor" class="form-select" v-model="chart">
                <option value="a">Temperatura (C)</option>
                <option value="b">Umidade do ar (%)</option>
                <option value="c">Pressão atmosférica (Pa)</option>
                <option value="d">Altitude (m)</option>
            </select>
        </div>
        <canvas v-show="chart == 'a'" id="linha_temp"></canvas>
        <canvas v-show="chart == 'b'" id="linha_umi"></canvas>
        <canvas v-show="chart == 'c'" id="linha_press"></canvas>
        <canvas v-show="chart == 'd'" id="linha-alti"></canvas>
    `,

    data(){
        return{
            chart:'',
            documents:[],
            datas:[],
            temperaturas_1:[],
            temperaturas_2:[],
            temperaturas_3:[],
            temperaturas_4:[],
            pressoes: [],
            umidades:[],
            altitudes:[],
            charts: {
                temp:null,
                press:null,
                umi:null,
                alti:null
            },
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
            this.documents.forEach(leitura => {
                this.temperaturas_1.push(leitura['temperatura_canal1'])
                this.temperaturas_2.push(leitura['temperatura_canal2'])
                this.temperaturas_3.push(leitura['temperatura_canal3'])
                this.temperaturas_4.push(leitura['temperatura_canal4'])
                this.pressoes.push(leitura['pressao_canal1'])
                this.umidades.push(leitura['umidade_canal1'])
                this.altitudes.push(leitura['altitude_canal1'])
                this.datas.push(leitura['data_hora'])
            });

            const ctx_temp = document.querySelector('#linha_temp').getContext('2d')
            const ctx_press = document.querySelector('#linha_press').getContext('2d')
            const ctx_umi = document.querySelector('#linha_umi').getContext('2d')
            const ctx_alti = document.querySelector('#linha-alti').getContext('2d')
            const labels = this.datas
            const datasets_temp = [
                {label:'Temperatura - Canal 1', data: this.temperaturas_1, borderColor:'red'},
                {label:'Temperatura - Canal 2', data: this.temperaturas_2, borderColor:'green'},
                {label:'Temperatura - Canal 3', data: this.temperaturas_3, borderColor:'blue'},
                {label:'Temperatura - Canal 4', data: this.temperaturas_4, borderColor:'orange'},
            ]
            const datasets_umi = [
                {label:'Umidade - Canal 1', data: this.umidades, borderColor:'cyan'},
            ]
            const datasets_press = [
                {label:'Pressão Atmosférica - Canal 1', data: this.pressoes, borderColor:'blue'},
            ]
            const datasets_alti = [
                {label:'Altitude - Canal 1', data: this.altitudes, borderColor:'gray'},
            ]

            if(this.charts.temp){
                this.charts.temp.destroy()
            }
            this.charts.temp = this.createLineChart(ctx_temp,labels,datasets_temp,'Leituras de Temperatura (C)')
            
            if(this.charts.umi){
                this.charts.umi.destroy()
            }
            this.charts.umi = this.createLineChart(ctx_umi,labels,datasets_umi,'Leituras de Umidade do Ar (%)')
            
            if(this.charts.press){
                this.charts.press.destroy()
            }
            this.charts.press = this.createLineChart(ctx_press,labels,datasets_press,'Leituras de Pressão Atmosférica (Pa)')
            
            if(this.charts.alti){
                this.charts.alti.destroy()
            }
            this.charts.alti = this.createLineChart(ctx_alti,labels,datasets_alti,'Leitura de Altitude (m)')

            this.chart = 'a'
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