## Sobre esse projeto

Essa aplicação web faz parte do produto final de um trabalho de Iniciação Científica dentro da Fatec Itaquera, com objetivo de desenvolver uma interface web amigável para exibição de dados solarimétricos coletados por um radiômetro feito com LEDs e Arduino. Este projeto conta com:

- Endpoint RESTfull para obtenção e registro dos dados.
- Frontend desenvolvido em Vue.js que implementa a API charts.js para exibição otimizada desses dados
- Utilização de framework PHP Laravel 

## Documentação de endpoints

ROTA:
```sh
/api/teste/banco
```
RETORNO ESPERADO:
```sh
{
    "message": "Conexão estabelecida com banco de dados",
    "dados": 20
}
```

- Verifica o acesso do sistema ao banco de dados.
#
ROTA:
```sh
/api/teste/radiometro
```
RETORNO ESPERADO:
```sh
{
    "message": "Sucesso na requisição"
}
```

- Verifica o acesso do sistema endpoint do radiômetro.
#
ROTA:
```sh
/api/teste/sensor
```
RETORNO ESPERADO:
```sh
{
    "message": "Sucesso na requisição"
}
```

- Verifica o acesso do sistema endpoint do sensor geral.