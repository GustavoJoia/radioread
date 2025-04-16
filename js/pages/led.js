export const Led = {
    template:`

    <div class="mb-4">
        <label for="seletor" class="form-label">Escolha uma opção:</label>
        <select id="seletor" class="form-select" v-model="selected" value="selected">
            <option value="">Selecione o gráfico...</option>
            <option value="a">Tensão (mV)</option>
            <option value="b">Corrente (uA)</option>
            <option value="c">Potência Total (uW)</option>
        </select>
    </div>

    <canvas v-show="selected === 'a'" id="linha_mv"></canvas>
    <canvas v-show="selected === 'b'" id="linha_ua"></canvas>
    <canvas v-show="selected === 'c'" id="linha_total"></canvas>

    `,
    data(){
        return{
            selected:'',
            data: [],
            timestamps: [],
            vm_mv: [],
            vm_ua: [],
            vd_mv: [],
            vd_ua: [],
            az_mv: [],
            az_ua: [],
            am_mv: [],
            am_ua: []
        }
    },

    methods:{
        async lerXlsx() {
            const response = await fetch('/data/medicoes.xlsx');
            const arrayBuffer = await response.arrayBuffer();
      
            const workbook = XLSX.read(arrayBuffer, { type: 'array' });
            const primeiraPlanilha = workbook.SheetNames[0];
            const sheet = workbook.Sheets[primeiraPlanilha];
            const json = XLSX.utils.sheet_to_json(sheet);
      
            this.data = json;
            this.handleData();
        },

        handleData(){
            // console.log(this.data);

            this.data.forEach(element => {
                this.timestamps.push(`${element.Data} ${element.Hora}`);
                this.vm_mv.push(element['VM (mV)']);
                this.vm_ua.push(element['VM(uA)']);
                this.vd_mv.push(element['VD (mV)']);
                this.vd_ua.push(element['VD(uA)']);
                this.az_mv.push(element['AZ (mV)']);
                this.az_ua.push(element['AZ(uA)']);
                this.am_mv.push(element['AM (mV)']);
                this.am_ua.push(element['AM(uA)']);
            });

            this.tensionGraph();
            this.currentGraph();
        },

        tensionGraph(){

            const graph_mv = document.querySelector('#linha_mv').getContext('2d');
            
            new Chart(graph_mv, {
                type: 'line',
                data:{
                    labels: this.timestamps,
                    datasets:[
                    {
                        label: 'Vermelho',
                        data: this.vm_mv,
                        fill: false,
                        borderColor: 'red',
                        tension: 0.1
                    },
                    {
                        label: 'Verde',
                        data: this.vd_mv,
                        fill: false,
                        borderColor: 'green',
                        tension: 0.1
                    },
                    {
                        label: 'Azul',
                        data: this.az_mv,
                        fill: false,
                        borderColor: 'blue',
                        tension: 0.1
                    },
                    {
                        label: 'Amarelo',
                        data: this.am_mv,
                        fill: false,
                        borderColor: 'yellow',
                        tension: 0.1
                    }
                    ]
                },
                options:{
                    responsive: true,
                    plugins:{
                        legend: {
                            display: true,
                            position: 'bottom',
                        },
                        title:{
                            display: true,
                            text: 'Gráfico de tensão gerada por faixa de cor de LED'
                        }
                    }
                }
            });

        },

        currentGraph(){

            const graph_ua = document.querySelector('#linha_ua').getContext('2d');
            
            new Chart(graph_ua, {
                type: 'line',
                data:{
                    labels: this.timestamps,
                    datasets:[
                    {
                        label: 'Vermelho',
                        data: this.vm_ua,
                        fill: false,
                        borderColor: 'red',
                        tension: 0.1
                    },
                    {
                        label: 'Verde',
                        data: this.vd_ua,
                        fill: false,
                        borderColor: 'green',
                        tension: 0.1
                    },
                    {
                        label: 'Azul',
                        data: this.az_ua,
                        fill: false,
                        borderColor: 'blue',
                        tension: 0.1
                    },
                    {
                        label: 'Amarelo',
                        data: this.am_ua,
                        fill: false,
                        borderColor: 'yellow',
                        tension: 0.1
                    }
                    ]
                },
                options:{
                    responsive: true,
                    plugins:{
                        legend: {
                            display: true,
                            position: 'bottom',
                        },
                        title:{
                            display: true,
                            text: 'Gráfico de corrente gerada por faixa de cor de LED'
                        }
                    }
                }
            });

        },

        totalGraph(){

            const graph_total = document.querySelector('#linha_total').getContext('2d');
            
            new Chart(graph_total, {
                type: 'line',
                data:{
                    labels: this.timestamps,
                    datasets:[
                    {
                        label: 'Vermelho',
                        data: this.vm_mv,
                        fill: false,
                        borderColor: 'red',
                        tension: 0.1
                    },
                    {
                        label: 'Verde',
                        data: this.vd_mv,
                        fill: false,
                        borderColor: 'green',
                        tension: 0.1
                    },
                    {
                        label: 'Azul',
                        data: this.az_mv,
                        fill: false,
                        borderColor: 'blue',
                        tension: 0.1
                    },
                    {
                        label: 'Amarelo',
                        data: this.am_mv,
                        fill: false,
                        borderColor: 'yellow',
                        tension: 0.1
                    }
                    ]
                },
                options:{
                    responsive: true,
                    plugins:{
                        legend: {
                            display: true,
                            position: 'bottom',
                        },
                        title:{
                            display: true,
                            text: 'Gráfico de tensão gerada por faixa de cor de LED'
                        }
                    }
                }
            });

        }
        
    },

    mounted() {
        this.lerXlsx();
    },
}