export const Leds = {
    template: `
        <h1>Resultados da coleta do radiômetro</h1>
        <div class="mb-4">
            <label for="seletor" class="form-label">Selecione o dado a ser apresentado:</label>
            <select id="seletor" class="form-select" v-model="chart">
                <option value="a">Tensão (mV)</option>
                <option value="b">Corrente (uA)</option>
                <option value="c">Potência total (uW)</option>
            </select>
        </div>
        <div class="row mb-3">
            <div class="col">
                <label>Ano:</label>
                <select v-model="selectedAno" @change="atualizarMesesDias; rendererFiltrado()" class="form-select">
                    <option v-for="ano in anosDisponiveis" :key="ano">{{ano}}</option>
                </select>
            </div>
            <div class="col">
                <label>Mês:</label>
                <select v-model="selectedMes" @change="atualizarMesesDias; rendererFiltrado()" class="form-select">
                    <option v-for="mes in mesesDisponiveis" :key="mes">{{mes}}</option>
                </select>
            </div>
            <div class="col">
                <label>Dia:</label>
                <select v-model="selectedDia" @change="rendererFiltrado()" class="form-select">
                    <option v-for="dia in diasDisponiveis" :key="dia">{{dia}}</option>
                </select>
            </div>
        </div>

        <div class="row mb-3">
            <div class="col">
                <label>Hora Início:</label>
                <select v-model="selectedHoraInicio" @change="rendererFiltrado()" class="form-select">
                    <option v-for="h in horasDisponiveis" :key="h">{{h}}</option>
                </select>
            </div>
            <div class="col">
                <label>Hora Fim:</label>
                <select v-model="selectedHoraFim" @change="rendererFiltrado()" class="form-select">
                    <option v-for="h in horasDisponiveis" :key="h">{{h}}</option>
                </select>
            </div>
        </div>

        <canvas v-show="chart=='a'" id="tensao"></canvas>
        <canvas v-show="chart=='b'" id="corrente"></canvas>
        <canvas v-show="chart=='c'" id="totais"></canvas>
    `,

    data(){
        return{
            chart: null,
            charts:{
                tensao:null,
                corrente:null,
                totais:null
            },
            resistores:{
                vm:3300,
                vd:80000,
                az:80000,
                am:80000
            },

            selectedAno: null,
            selectedMes: null,
            selectedDia: null,
            selectedHoraInicio: null,
            selectedHoraFim: null,

            anosDisponiveis: [],
            mesesDisponiveis: [],
            diasDisponiveis: [],
            horasDisponiveis: [],

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

        gerarHoras() {
            const horas = [];
            for (let h = 0; h < 24; h++) {
                for (let m = 0; m < 60; m += 15) {
                    const hh = h.toString().padStart(2, '0');
                    const mm = m.toString().padStart(2, '0');
                    horas.push(`${hh}:${mm}`);
                }
            }
            this.horasDisponiveis = horas;
            this.selectedHoraInicio = horas[0];
            this.selectedHoraFim = horas[horas.length-1];
        },
        gerarDatasDisponiveis() {
            const anos = [];
            this.documents.forEach(d => {
                const date = new Date(d.data_hora);

                if(anos[anos.length-1]!=date.getFullYear()){
                    anos.push(date.getFullYear());
                }
            });

            this.anosDisponiveis = anos.sort((a,b)=>a-b);
            this.selectedAno = this.anosDisponiveis[0];

            this.atualizarMesesDias();
        },
        atualizarMesesDias() {

            const meses = [];
            const dias = [];

            this.documents.forEach(d => {
                const date = new Date(d.data_hora);
                if (date.getFullYear() === this.selectedAno && meses[meses.length-1]!=date.getMonth()+1) {
                    meses.push(date.getMonth() + 1); // mês de 1 a 12
                }
            });

            this.mesesDisponiveis = meses.sort((a,b)=>a-b);
            this.selectedMes = this.mesesDisponiveis[this.mesesDisponiveis.length-1];

            this.documents.forEach(d => {
                const date = new Date(d.data_hora);
                if (date.getFullYear() === this.selectedAno && (date.getMonth()+1) === this.selectedMes && dias[dias.length-1]!=date.getDate()) {
                    dias.push(date.getDate());
                }
            });

            this.diasDisponiveis = dias.sort((a,b)=>a-b);
            this.selectedDia = this.diasDisponiveis[this.diasDisponiveis.length-1];
        },
        filtrarPorDataEHora() {
            const dataInicio = new Date(`${this.selectedAno}-${this.selectedMes.toString().padStart(2,'0')}-${this.selectedDia.toString().padStart(2,'0')}T${this.selectedHoraInicio}:00`);
            const dataFim = new Date(`${this.selectedAno}-${this.selectedMes.toString().padStart(2,'0')}-${this.selectedDia.toString().padStart(2,'0')}T${this.selectedHoraFim}:59`);

            const filtrados = this.documents.filter(d => {
                const dt = new Date(d.data_hora);
                return dt >= dataInicio && dt <= dataFim;
            });

            return filtrados;
        },
        rendererFiltrado() {
            const filtrados = this.filtrarPorDataEHora();

            // Limpa arrays
            this.datas = [];
            this.tensao_am = [];
            this.tensao_az = [];
            this.tensao_vd = [];
            this.tensao_vm = [];
            this.total_tensao = [];
            this.corrente_am = [];
            this.corrente_az = [];
            this.corrente_vd = [];
            this.corrente_vm = [];
            this.total_corrente = [];
            this.total_potencia = [];

            filtrados.forEach(leitura => {
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

            // Atualiza o gráfico
            this.renderer();
        },
        requestTemp(){
            Swal.showLoading();
            let server = window.location.origin;
            fetch(`${server}/api/radiometro/listar`)
            .then(response=>response.json())
            .then(response=>{
                this.documents = response
                this.gerarHoras();
                this.gerarDatasDisponiveis();
                this.atualizarMesesDias();
                this.rendererFiltrado()
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

                this.total_potencia.push((this.total_corrente.at(-1))*(this.total_tensao.at(-1)));

            });

            const ctx_tensao = document.getElementById('tensao').getContext('2d')
            const ctx_corrente = document.getElementById('corrente').getContext('2d')
            const ctx_totais = document.getElementById('totais').getContext('2d')
            const labels = this.datas
            const datasets_tensao = [
                {label:'LED Vermelho', data: this.tensao_vm, borderColor:'red'},
                {label:'LED Verde', data: this.tensao_vd, borderColor:'green'},
                {label:'LED Azul', data: this.tensao_az, borderColor:'blue'},
                {label:'LED Amarelo', data: this.tensao_am, borderColor:'yellow'},
                {label:'Tensão Total', data: this.total_tensao, borderColor:'purple'},
            ]
            const datasets_corrente = [
                {label:'LED Vermelho', data: this.corrente_vm, borderColor:'red'},
                {label:'LED Verde', data: this.corrente_vd, borderColor:'green'},
                {label:'LED Azul', data: this.corrente_az, borderColor:'blue'},
                {label:'LED Amarelo', data: this.corrente_am, borderColor:'yellow'},
                {label:'Corrente Total', data: this.total_corrente, borderColor:'pink'},
            ]
            const datasets_totais = [
                {label:'Potência Total', data: this.total_potencia, borderColor:'magenta'}
            ]

            if(this.charts.tensao){
                this.charts.tensao.destroy()
            }
            this.charts.tensao = this.createLineChart(ctx_tensao,labels,datasets_tensao,'Tensão registrada (mV)')
            
            if(this.charts.corrente){
                this.charts.corrente.destroy()
            }
            this.charts.corrente = this.createLineChart(ctx_corrente,labels,datasets_corrente,'Corrente registrada (uA)')
            
            if(this.charts.totais){
                this.charts.totais.destroy()
            }
            this.charts.totais = this.createLineChart(ctx_totais,labels,datasets_totais,'Potência total registrada (uW)')
            
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