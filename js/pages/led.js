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

    <div v-show="selected === 'a'">
        <canvas id="linha_mv"></canvas>
    </div>
    <div v-show="selected === 'a'" class="mb-3">
        <div id="range_mv"></div>
        <p>De {{ range_mv[0] }} até {{ range_mv[1] }}</p>
    </div>

    <div v-show="selected === 'b'">
        <canvas id="linha_ua"></canvas>
    </div>
    <div v-show="selected === 'c'">
        <canvas id="linha_total"></canvas>
    </div>

    `,
    data(){
        return{
            selected:'',
            data: [],
            range_mv: [],
            range_ua: [],
            range_total: [],
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
            // const response = await fetch('https://gustavojoia.github.io/radioread/data/medicoes.xlsx');
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

            this.range_mv = [this.timestamps[0],this.timestamps[this.timestamps.length-1]];
            this.tensionIntensity;
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

        },

        tensionIntensity(){

            const slider = document.querySelector('#range_mv');
            noUiSlider.create(slider, {
              start: this.range_mv,
              connect: true,
              range: {
                min: 0,
                max: 100
              }
            });
          
            slider.noUiSlider.on('update', (values) => {
              this.range_mv = values.map(val => Math.round(val));
            });

        }
        
    },

    mounted() {
        this.lerXlsx();
    },
}