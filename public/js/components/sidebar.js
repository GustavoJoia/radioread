export const Sidebar = {
    template: `
        <aside id="side_nav" class="bg-dark">
            <nav>
                <ul>
                    <li><router-link to="/">Início</router-link></li>
                    <li><router-link to="/leds">Radiômetro</router-link></li>
                    <li><router-link to="/sensor">Sensor Múltiplo</router-link></li>
                    <li><router-link to="/upload">Gravar Dados</router-link></li>
                    <li><router-link to="/plan">Leitura da Planilha</router-link></li>
                </ul>
            </nav>
        </aside>
    `,
}