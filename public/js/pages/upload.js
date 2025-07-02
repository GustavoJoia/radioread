export const Upload = {
    template:`
        <h1>Envio de dados</h1><h5>via arquivo .txt</h5>
        <div class="input-group mb-3">
            <input v-model="arquivo" @change="lerArquivo" name="txtdados" id="txtdados" accept=".txt" type="file" class="form-control" placeholder="Seu arquivo .txt" aria-label="Seu arquivo .txt" aria-describedby="submit">
            <div class="input-group-append">
                <button class="btn btn-secondary" type="button" id="submit" @click="gravar">Gravar</button>
            </div>
        </div>
        

        <h4 v-show="preview!=null">Dados a serem gravados:</h4>
        <table v-show="preview!=null" class="table">
            <thead class="thead-light">
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Temp 1 (C)</th>
                    <th scope="col">Temp 2 (C)</th>
                    <th scope="col">Temp 3 (C)</th>
                    <th scope="col">Temp 4 (C)</th>
                    <th scope="col">Umid (%)</th>
                    <th scope="col">P.A. (Pa)</th>
                    <th scope="col">Altit (m)</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(linha, index) in preview" :key="index">
                    <th scope="row">{{index+1}}</th>
                    <td>{{linha[0]}}</td>
                    <td>{{linha[1]}}</td>
                    <td>{{linha[2]}}</td>
                    <td>{{linha[3]}}</td>
                    <td>{{linha[4]}}</td>
                    <td>{{linha[5]}}</td>
                    <td>{{linha[6]}}</td>
                </tr>
            </tbody>
        </table>
    `,

    data(){
        return{
            arquivo:null,
            linhas_dados: null,
            preview:null,
            leitor: new FileReader()
        }
    },

    methods:{
        lerArquivo(evento){
            const arquivo = evento.target.files[0];
            this.leitor.onload = (e) =>{
                const conteudo = e.target.result;
                this.arquivo = conteudo;
                let linhas = conteudo.split(';');
                linhas.pop();
                this.preview = [];
                linhas.forEach(linha => {
                    let split = linha.split(',')
                    for (let index = 0; index < split.length; index++) {
                        split[index] = parseFloat(split[index]);
                    }
                    this.preview.push(split);
                });
                console.log(this.preview)
                this.linhas_dados = JSON.stringify(linhas);
            }
            this.leitor.readAsText(arquivo);
        },
        quebrarLinhas(){
            let linhas = this.arquivo.split(';');
            console.log(linhas);
            this.linhas_dados = JSON.stringify(linhas);
        },
        gravar(){
            document.querySelector('#submit').disabled = true;
            let options = {
                method: 'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body: this.linhas_dados
            }
            let server = window.location.origin;
            fetch(`${server}/api/sensor/gravar/arquivo`,options)
            .then(response=>response.json())
            .then(response=>{
                Swal.fire({
                    text:response.message,
                    allowOutsideClick: false,
                    allowEscapeKey: false
                });
                document.querySelector('#submit').disabled = false;
            })
        }
    },
}