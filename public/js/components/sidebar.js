export const Sidebar = {
    template: `
        <aside id="side_nav" class="bg-dark">
            <nav>
                <ul>
                    <li><router-link to="/">Início</router-link></li>
                    <li><router-link to="/leds">Leitura de LED</router-link></li>
                    <li><router-link to="/temps">Leitura de Temperatura</router-link></li>
                    <li><router-link to="/">Leitura de Umidade</router-link></li>
                    <li><router-link to="/">Leitura de Pressão Barométrica</router-link></li>
                </ul>
            </nav>
        </aside>
    `,
}