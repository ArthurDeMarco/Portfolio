app.controller('MainController', function ($scope, $http, CalendarService, StorageService) {

    $scope.meses = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    $scope.emojiMap = { 1: '😢', 2: '😐', 3: '🙂', 4: '😄' };
    $scope.labelMap = { 1: 'Muito triste', 2: 'Neutro', 3: 'Feliz', 4: 'Muito feliz' };

    $scope.habitosPadrao = [
        { nome: 'Beber água', concluido: false },
        { nome: 'Exercício', concluido: false },
        { nome: 'Estudo', concluido: false },
        { nome: 'Leitura', concluido: false },
        { nome: 'Dormir cedo', concluido: false }
    ];

    var dataHoje = new Date();
    $scope.mesAtual = dataHoje.getMonth();
    $scope.anoAtual = dataHoje.getFullYear();

    $scope.mostrarHistorico = false;
    $scope.filtrosVisiveis = false;
    $scope.mostrarConfig = false;
    $scope.filtroHumor = '';
    $scope.filtroDataObj = null;
    $scope.filtroDataIso = '';

    $scope.listaRegistros = [];
    $scope.registrosFiltrados = [];
    $scope.statsSemanais = { diasRegistrados: 0, humorMedio: '—', habitosMaisFeito: '—' };

    $scope.toastVisivel = false;
    $scope.toastMsg = '';
    $scope.toastIcon = 'check_circle';

    aplicarMetaNaTela(StorageService.getMeta());
    $scope.nomeTemp = '';
    $scope.modoVisao = $scope.entrou ? 'calendario' : 'welcome';

    function aplicarMetaNaTela(meta) {
        meta = meta || {};
        $scope.nomeUsuario = meta.nomeUsuario || '';
        $scope.entrou = !!meta.entrou;
        $scope.bgImagem = meta.bgImagem || '';
        $scope.bgOverlayOpacity = Number(meta.bgOverlayOpacity || 40);
        $scope.mostrarFrases = meta.mostrarFrases !== false;
    }

    function salvarMeta(patch) {
        var meta = StorageService.setMeta(patch || {});
        aplicarMetaNaTela(meta);
    }

    function criarRegistroNovo() {
        return {
            humor: 2,
            obs: '',
            habitos: angular.copy($scope.habitosPadrao)
        };
    }

    function montarIsoLocal(ano, mes, dia) {
        return ano + '-' + String(mes).padStart(2, '0') + '-' + String(dia).padStart(2, '0');
    }

    function converterDateParaIso(dateValue) {
        return StorageService.normalizeDateIso(dateValue);
    }

    function normalizarHumorFiltro(valor) {
        return StorageService.normalizeHumor(valor);
    }

    $scope.entrarApp = function () {
        var patch = { entrou: true };

        if ($scope.nomeTemp && $scope.nomeTemp.trim()) {
            patch.nomeUsuario = $scope.nomeTemp.trim();
            $scope.nomeTemp = '';
        }

        salvarMeta(patch);
        $scope.modoVisao = 'calendario';
    };

    $scope.salvarNome = function () {
        salvarMeta({ nomeUsuario: $scope.nomeUsuario || '' });
    };

    $scope.saudacaoHorario = function () {
        var h = new Date().getHours();
        if (h < 12) return '☀️ Bom dia!';
        if (h < 18) return '🌤️ Boa tarde!';
        return '🌙 Boa noite!';
    };

    $scope.bgCustomStyle = function () {
        if (!$scope.bgImagem) return {};
        var opacidade = Number($scope.bgOverlayOpacity) / 100;
        return {
            'background-image': 'linear-gradient(rgba(30,20,60,' + opacidade + '), rgba(30,20,60,' + opacidade + ')), url(' + $scope.bgImagem + ')',
            'background-size': 'cover',
            'background-position': 'center',
            'background-attachment': 'fixed'
        };
    };

    $scope.onBgFileSelected = function (file) {
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            $scope.mostrarToast('Imagem muito grande (máx 5MB)', 'error');
            if (!$scope.$$phase) $scope.$applyAsync();
            return;
        }

        var reader = new FileReader();
        reader.onload = function (e) {
            $scope.$applyAsync(function () {
                salvarMeta({ bgImagem: e.target.result });
                $scope.mostrarToast('Background atualizado!', 'check_circle');
            });
        };
        reader.readAsDataURL(file);
    };

    $scope.removerBackground = function () {
        salvarMeta({ bgImagem: '' });
        $scope.mostrarToast('Background removido', 'check_circle');
    };

    $scope.salvarConfiguracao = function () {
        salvarMeta({ bgOverlayOpacity: Number($scope.bgOverlayOpacity || 40) });
    };

    $scope.abrirConfiguracoes = function () {
        $scope.mostrarConfig = true;
    };

    $scope.fecharConfiguracoes = function () {
        $scope.salvarNome();
        $scope.salvarConfiguracao();
        $scope.mostrarConfig = false;
        $scope.mostrarToast('Configurações salvas!', 'check_circle');
    };

    $scope.voltarParaInicio = function () {
        $scope.modoVisao = 'welcome';
    };

    $scope.confirmarLimparDados = function () {
        if (confirm('Tem certeza? Isso vai apagar TODOS os registros de humor e hábitos. Esta ação não pode ser desfeita.')) {
            StorageService.clearRecords();
            $scope.carregarTodosRegistros();
            $scope.renderizarCalendario();
            $scope.mostrarToast('Todos os registros foram removidos', 'delete');
        }
    };

    $scope.renderizarCalendario = function () {
        $scope.dias = CalendarService.getDaysInMonth($scope.mesAtual, $scope.anoAtual);
        $scope.calcularStats();
    };

    $scope.changeMonth = function (dir) {
        $scope.mesAtual += dir;
        if ($scope.mesAtual < 0 || $scope.mesAtual > 11) {
            var novaData = new Date($scope.anoAtual, $scope.mesAtual, 1);
            $scope.mesAtual = novaData.getMonth();
            $scope.anoAtual = novaData.getFullYear();
        }
        $scope.renderizarCalendario();
    };

    $scope.openDay = function (dia) {
        if (!dia || !dia.isReal) return;

        $scope.diaSelecionado = dia;
        $scope.registroAtual = StorageService.getRecord(dia.dateIso) || criarRegistroNovo();
        $scope.modoVisao = 'zoom';
    };

    $scope.calcularProgresso = function () {
        if (!$scope.registroAtual || !$scope.registroAtual.habitos || !$scope.registroAtual.habitos.length) return 0;

        var total = $scope.registroAtual.habitos.length;
        var concluidos = $scope.registroAtual.habitos.filter(function (h) {
            return h.concluido;
        }).length;

        return Math.round((concluidos / total) * 100);
    };

    $scope.salvarEFechar = function () {
        if (!$scope.diaSelecionado || !$scope.diaSelecionado.dateIso) return;

        StorageService.setRecord($scope.diaSelecionado.dateIso, $scope.registroAtual);
        $scope.carregarTodosRegistros();
        $scope.modoVisao = 'calendario';
        $scope.renderizarCalendario();
        $scope.mostrarToast('Registro salvo com sucesso!', 'check_circle');
    };

    $scope.fecharSemSalvar = function () {
        $scope.modoVisao = 'calendario';
        $scope.registroAtual = null;
    };

    $scope.carregarTodosRegistros = function () {
        $scope.listaRegistros = StorageService.getAllRecords();
        $scope.aplicarFiltro();
    };

    function obterFiltroDataIso() {
        if ($scope.filtroDataIso) return $scope.filtroDataIso;

        var dataConvertida = converterDateParaIso($scope.filtroDataObj);
        if (dataConvertida) return dataConvertida;

        var input = document.getElementById('filtroDataHistorico');
        if (input && input.value) return converterDateParaIso(input.value);

        return '';
    }

    function obterFiltroHumor() {
        var humorConvertido = normalizarHumorFiltro($scope.filtroHumor);
        if (humorConvertido) return humorConvertido;

        var select = document.getElementById('filtroHumorHistorico');
        if (select && select.value) return normalizarHumorFiltro(select.value);

        return '';
    }

    $scope.onFiltroDataInput = function (valor) {
        $scope.filtroDataIso = converterDateParaIso(valor || '');

        if (!$scope.$$phase) {
            $scope.$applyAsync(function () {
                $scope.aplicarFiltro();
            });
            return;
        }

        $scope.aplicarFiltro();
    };

    $scope.onFiltroHumorInput = function (valor) {
        $scope.filtroHumor = normalizarHumorFiltro(valor);

        if (!$scope.$$phase) {
            $scope.$applyAsync(function () {
                $scope.aplicarFiltro();
            });
            return;
        }

        $scope.aplicarFiltro();
    };

    $scope.aplicarFiltro = function () {
        var filtroDataIso = obterFiltroDataIso();
        var filtroHumor = obterFiltroHumor();

        $scope.registrosFiltrados = StorageService.getFilteredRecords({
            data: filtroDataIso,
            humor: filtroHumor
        });
    };

    $scope.limparFiltros = function () {
        $scope.filtroDataObj = null;
        $scope.filtroDataIso = '';
        $scope.filtroHumor = '';

        var input = document.getElementById('filtroDataHistorico');
        if (input) input.value = '';

        var select = document.getElementById('filtroHumorHistorico');
        if (select) select.value = '';

        $scope.aplicarFiltro();
    };

    $scope.temFiltroAtivo = function () {
        return !!obterFiltroDataIso() || !!obterFiltroHumor();
    };

    $scope.toggleHistorico = function () {
        $scope.mostrarHistorico = !$scope.mostrarHistorico;
        if ($scope.mostrarHistorico) {
            $scope.carregarTodosRegistros();
        }
    };

    $scope.toggleFiltrosInternos = function () {
        $scope.filtrosVisiveis = !$scope.filtrosVisiveis;
    };

    $scope.nenhumHabitoConcluido = function (reg) {
        if (!reg || !reg.habitos) return true;
        return !reg.habitos.some(function (h) {
            return h.concluido;
        });
    };

    $scope.formatarData = function (isoStr) {
        if (!isoStr) return '';
        var partes = isoStr.split('-');
        return partes[2] + '/' + partes[1] + '/' + partes[0];
    };

    $scope.calcularStats = function () {
        var registrosDoMes = [];

        ($scope.dias || []).forEach(function (dia) {
            if (!dia.isReal || !dia.temRegistro || !dia.dateIso) return;
            var reg = StorageService.getRecord(dia.dateIso);
            if (reg) registrosDoMes.push(reg);
        });

        $scope.statsSemanais.diasRegistrados = registrosDoMes.length;

        if (!registrosDoMes.length) {
            $scope.statsSemanais.humorMedio = '—';
            $scope.statsSemanais.habitosMaisFeito = '—';
            return;
        }

        var somaHumor = registrosDoMes.reduce(function (soma, registro) {
            return soma + Number(registro.humor || 0);
        }, 0);

        var media = somaHumor / registrosDoMes.length;
        $scope.statsSemanais.humorMedio = $scope.emojiMap[Math.round(media)] || '—';

        var contagem = {};
        registrosDoMes.forEach(function (registro) {
            (registro.habitos || []).forEach(function (habito) {
                if (!habito.concluido) return;
                contagem[habito.nome] = (contagem[habito.nome] || 0) + 1;
            });
        });

        var habitoTop = '—';
        var maiorContagem = 0;
        Object.keys(contagem).forEach(function (nome) {
            if (contagem[nome] > maiorContagem) {
                maiorContagem = contagem[nome];
                habitoTop = nome;
            }
        });

        $scope.statsSemanais.habitosMaisFeito = habitoTop;
    };

    $scope.fraseExibida = null;

    $scope.toggleFrases = function () {
        salvarMeta({ mostrarFrases: !$scope.mostrarFrases });
    };

    $scope.carregarFrases = function () {
        $http.get('frases.json').then(function (response) {
            $scope.todasAsFrases = response.data;
            $scope.selecionarFraseDoDia();
        }).catch(function () {
            $scope.fraseExibida = {
                frase: 'Cada dia é uma nova oportunidade para ser melhor.',
                autor: 'MoodTrack'
            };
        });
    };

    $scope.selecionarFraseDoDia = function () {
        if (!$scope.todasAsFrases || !$scope.todasAsFrases.length) return;

        var hoje = new Date();
        var inicio = new Date(hoje.getFullYear(), 0, 0);
        var diff = hoje - inicio;
        var umDia = 1000 * 60 * 60 * 24;
        var diaDoAno = Math.floor(diff / umDia);
        $scope.fraseExibida = $scope.todasAsFrases[diaDoAno % $scope.todasAsFrases.length];
    };

    var toastTimeout = null;
    $scope.mostrarToast = function (msg, icon) {
        $scope.toastMsg = msg;
        $scope.toastIcon = icon || 'check_circle';
        $scope.toastVisivel = true;

        if (toastTimeout) clearTimeout(toastTimeout);
        toastTimeout = setTimeout(function () {
            $scope.$applyAsync(function () {
                $scope.toastVisivel = false;
            });
        }, 2500);
    };

    $scope.$watchGroup(['filtroDataObj', 'filtroHumor'], function () {
        $scope.aplicarFiltro();
    });

    $scope.carregarFrases();
    $scope.carregarTodosRegistros();
    $scope.renderizarCalendario();
});
