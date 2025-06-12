export const Led = {
    template: `
    <h1>Resultados da coleta do radiômetro</h1>
    <div class="mb-4">
        <label for="seletor" class="form-label">Selecione o dado a ser apresentado:</label>
        <select id="seletor" class="form-select" v-model="selected">
            <option value="a">Tensão (mV)</option>
            <option value="b">Corrente (uA)</option>
            <option value="c">Potência Total (uW)</option>
        </select>
    </div>

    <!-- Gráfico de Tensão -->
    <div v-show="selected === 'a'">
        <canvas id="linha_mv"></canvas>
        <div id="range_mv" class="my-3"></div>
        <p>De {{ timestamps[range_mv[0]] }} até {{ timestamps[range_mv[1]] }}</p>
    </div>

    <!-- Gráfico de Corrente -->
    <div v-show="selected === 'b'">
        <canvas id="linha_ua"></canvas>
        <div id="range_ua" class="my-3"></div>
        <p>De {{ timestamps[range_ua[0]] }} até {{ timestamps[range_ua[1]] }}</p>
    </div>

    <!-- Gráfico de Potência -->
    <div v-show="selected === 'c'">
        <canvas id="linha_total"></canvas>
        <div id="range_total" class="my-3"></div>
        <p>De {{ timestamps[range_total[0]] }} até {{ timestamps[range_total[1]] }}</p>
    </div>
    `,
    data() {
        return {
            selected: '',
            data: [],
            range_mv: [0, 1],
            range_ua: [0, 1],
            range_total: [0, 1],
            timestamps: [],
            vm_mv: [],
            vm_ua: [],
            vd_mv: [],
            vd_ua: [],
            az_mv: [],
            az_ua: [],
            am_mv: [],
            am_ua: [],
            chart_mv: null,
            chart_ua: null,
            chart_total: null
        }
    },

    methods: {
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

        handleData() {
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

            const max = this.timestamps.length - 1;
            this.range_mv = [0, max];
            this.range_ua = [0, max];
            this.range_total = [0, max];

            this.initSliders();
            this.updateTensionGraph();
            this.updateCurrentGraph();
            this.updatePowerGraph();
        },

        // Tensão
        updateTensionGraph() {
            const [start, end] = this.range_mv;
            const ctx = document.getElementById('linha_mv').getContext('2d');
            const labels = this.timestamps.slice(start, end + 1);
            const datasets = [
                { label: 'Vermelho', data: this.vm_mv.slice(start, end + 1), borderColor: 'red' },
                { label: 'Verde', data: this.vd_mv.slice(start, end + 1), borderColor: 'green' },
                { label: 'Azul', data: this.az_mv.slice(start, end + 1), borderColor: 'blue' },
                { label: 'Amarelo', data: this.am_mv.slice(start, end + 1), borderColor: 'yellow' }
            ];
            if (this.chart_mv) this.chart_mv.destroy();
            this.chart_mv = this.createLineChart(ctx, labels, datasets, 'Gráfico de Tensão (mV)');
        },

        // Corrente
        updateCurrentGraph() {
            const [start, end] = this.range_ua;
            const ctx = document.getElementById('linha_ua').getContext('2d');
            const labels = this.timestamps.slice(start, end + 1);
            const datasets = [
                { label: 'Vermelho', data: this.vm_ua.slice(start, end + 1), borderColor: 'red' },
                { label: 'Verde', data: this.vd_ua.slice(start, end + 1), borderColor: 'green' },
                { label: 'Azul', data: this.az_ua.slice(start, end + 1), borderColor: 'blue' },
                { label: 'Amarelo', data: this.am_ua.slice(start, end + 1), borderColor: 'yellow' }
            ];
            if (this.chart_ua) this.chart_ua.destroy();
            this.chart_ua = this.createLineChart(ctx, labels, datasets, 'Gráfico de Corrente (uA)');
        },

        // Potência
        updatePowerGraph() {
            const [start, end] = this.range_total;
            const ctx = document.getElementById('linha_total').getContext('2d');
            const labels = this.timestamps.slice(start, end + 1);

            const calcPower = (v, i) => v.map((val, idx) => (val * i[idx]) / 1000);

            const datasets = [
                { label: 'Vermelho', data: calcPower(this.vm_mv, this.vm_ua).slice(start, end + 1), borderColor: 'red' },
                { label: 'Verde', data: calcPower(this.vd_mv, this.vd_ua).slice(start, end + 1), borderColor: 'green' },
                { label: 'Azul', data: calcPower(this.az_mv, this.az_ua).slice(start, end + 1), borderColor: 'blue' },
                { label: 'Amarelo', data: calcPower(this.am_mv, this.am_ua).slice(start, end + 1), borderColor: 'yellow' }
            ];
            if (this.chart_total) this.chart_total.destroy();
            this.chart_total = this.createLineChart(ctx, labels, datasets, 'Gráfico de Potência Total (uW)');
        },

        // Utilitário genérico de gráfico
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

        // Sliders
        initSliders() {
            const createSlider = (id, rangeProp, updateFn) => {
                const slider = document.getElementById(id);
                noUiSlider.create(slider, {
                    start: this[rangeProp],
                    connect: true,
                    range: { min: 0, max: this.timestamps.length - 1 },
                    step: 1,
                    tooltips: true,
                    format: {
                        to: val => Math.round(val),
                        from: val => Number(val)
                    }
                });
                slider.noUiSlider.on('update', values => {
                    this[rangeProp] = values.map(v => parseInt(v));
                    updateFn();
                });
            };

            createSlider('range_mv', 'range_mv', this.updateTensionGraph);
            createSlider('range_ua', 'range_ua', this.updateCurrentGraph);
            createSlider('range_total', 'range_total', this.updatePowerGraph);
        }
    },

    mounted() {
        this.lerXlsx();
    }
};
