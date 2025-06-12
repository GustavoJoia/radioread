<!DOCTYPE html>
<html lang="pt_BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="{{asset('setup/vue.global.js')}}"></script>
    <script src="{{asset('setup/vue-router.global.js')}}"></script>
    <script src="{{asset('setup/bootstrap.bundle.min.js')}}" defer></script>
    <link rel="stylesheet" href="{{asset('style/bootstrap.min.css')}}">
    <link rel="stylesheet" href="{{asset('style/nouislider.min.css')}}">
    <link rel="stylesheet/less" type="text/css" href="{{asset('style/style.less')}}" />
    <script src="{{asset('setup/less.js')}}" type="text/javascript"></script>
    <script src="{{asset('setup/sweetalert.js')}}"></script>
    <script src="{{asset('setup/chart.js')}}"></script>
    <script src="{{asset('setup/xlsx.full.min.js')}}"></script>
    <script src="{{asset('setup/nouislider.min.js')}}"></script>
    <title>Leituras do Radiômetro</title>
</head>
<body>
    <!--Carregando todos os componentes dinamicamente no corpo através do identificador ID-->
    <div id="app"></div>

    <!--Importando o script que contém a aplicação do VueJs em prioritário-->
    <script type="module" src="{{asset('js/app.js')}}" defer></script>
</body>
</html>