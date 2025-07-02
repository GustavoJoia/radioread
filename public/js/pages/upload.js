export const Upload = {
    template:`
        <h1>Envio de dados</h1><h5>via arquivo .txt</h5>
        <input v-model="arquivo" @change="lerArquivo" type="file" name="txtdados" id="txtdados" accept=".txt,.csv">
        <button name="submit" id="submit" type="submit" @click="gravar">Gravar</button>

        <h3>Conteúdo do arquivo</h3>
        <p>{{linhas_dados}}</p>
    `,

    data(){
        return{
            arquivo:null,
            linhas_dados: null,
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
                linhas = linhas.slice(0,-1);
                this.linhas_dados = JSON.stringify(linhas);
            }
            this.leitor.readAsText(arquivo);
        },
        quebrarLinhas(){
            let linhas = this.arquivo.split(';');
            this.linhas_dados = JSON.stringify(linhas);
        },
        gravar(){
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
                console.log(response)
            })
        }
    },
}