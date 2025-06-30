export const Leds = {
    template: `
        <h1>Resultados da coleta do radiômetro</h1>
        <div class="mb-4">
            <label for="seletor" class="form-label">Selecione o dado a ser apresentado:</label>
            <select id="seletor" class="form-select" v-model="chart">
                <option value="a">Tensão (mV)</option>
                <option value="b">Corrente (uA)</option>
                <option value="c">Valores Totais (uW)</option>
            </select>
        </div>
        <canvas v-show="chart=='a'" id="tensao"></canvas>
        <canvas v-show="chart=='b'" id="corrente"></canvas>
        <canvas v-show="chart=='c'" id="totais"></canvas>
    `,

    data(){
        return{
            chart: '',
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
            this.documents.forEach(leitura => {

                this.datas.push(leitura['data_hora']);

                this.tensao_am.push(leitura['tensaoAM']);
                this.tensao_az.push(leitura['tensaoAZ']);
                this.tensao_vd.push(leitura['tensaoVD']);
                this.tensao_vm.push(leitura['tensaoVM']);
                this.total_tensao.push((this.tensao_am.at(-1))+(this.tensao_az.at(-1))+(this.tensao_vd.at(-1))+(this.tensao_vm.at(-1)));

                this.corrente_am.push((leitura['tensaoAM']*this.resistores.am)/1000);
                this.corrente_az.push((leitura['tensaoAZ']*this.resistores.az)/1000);
                this.corrente_vd.push((leitura['tensaoVD']*this.resistores.vd)/1000);
                this.corrente_vm.push((leitura['tensaoVM']*this.resistores.vm)/1000);
                this.total_corrente.push((this.corrente_am.at(-1))+(this.corrente_az.at(-1))+(this.corrente_vd.at(-1))+(this.corrente_vm.at(-1)));

                this.total_potencia.push((this.total_corrente.at(-1))+(this.total_tensao.at(-1)));

            });

            const ctx_tensao = document.getElementById('tensao').getContext('2d')
            const ctx_corrente = document.getElementById('corrente').getContext('2d')
            const ctx_totais = document.getElementById('totais').getContext('2d')
            const labels = this.datas
            const datasets_tensao = [
                {label:'Tensão Vermelho', data: this.tensao_vm, borderColor:'red'},
                {label:'Tensão Verde', data: this.tensao_vd, borderColor:'green'},
                {label:'Tensão Azul', data: this.tensao_az, borderColor:'blue'},
                {label:'Tensão Amarelo', data: this.tensao_am, borderColor:'yellow'}

                // {label:'Tensão Total', data: this.total_tensao, borderColor:'purple'},
                // {label:'Corrente Total', data: this.total_corrente, borderColor:'pink'},
                // {label:'Potência Total', data: this.total_potencia, borderColor:'magenta'},
            ]
            const datasets_corrente = [
                {label:'Corrente Vermelho', data: this.corrente_vm, borderColor:'red'},
                {label:'Corrente Verde', data: this.corrente_vd, borderColor:'green'},
                {label:'Corrente Azul', data: this.corrente_az, borderColor:'blue'},
                {label:'Corrente Amarelo', data: this.corrente_am, borderColor:'yellow'},
            ]
            const datasets_totais = [
                {label:'Tensão Total', data: this.total_tensao, borderColor:'purple'},
                {label:'Corrente Total', data: this.total_corrente, borderColor:'pink'},
                {label:'Potência Total', data: this.total_potencia, borderColor:'magenta'}
            ]

            if(this.chart){
                this.chart.destroy()
            }
            this.chart_tensao = this.createLineChart(ctx_tensao,labels,datasets_tensao,'Tensão registrada pelo Radiômetro')
            this.chart_corrente = this.createLineChart(ctx_corrente,labels,datasets_corrente,'Corrente registrada pelo Radiômetro')
            this.chart_totais = this.createLineChart(ctx_totais,labels,datasets_totais,'Valores totais registrados pelo Radiômetro')
            this.chart = 'a';
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