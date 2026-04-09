app.service('CalendarService', function (StorageService) {

    var emojiMap = { 1: '😢', 2: '😐', 3: '🙂', 4: '😄' };

    this.getDaysInMonth = function (mes, ano) {
        var dias = [];
        var primeiroDiaIndex = new Date(ano, mes, 1).getDay();
        var ultimoDiaMes = new Date(ano, mes + 1, 0).getDate();
        var ultimoDiaMesAnterior = new Date(ano, mes, 0).getDate();

        for (var i = primeiroDiaIndex; i > 0; i--) {
            dias.push({
                number: ultimoDiaMesAnterior - i + 1,
                class: 'inactive',
                isReal: false
            });
        }

        var hoje = new Date();
        for (var d = 1; d <= ultimoDiaMes; d++) {
            var ehHoje = (d === hoje.getDate() && mes === hoje.getMonth() && ano === hoje.getFullYear());
            var dateIso = buildIso(ano, mes, d);
            var registro = StorageService.getRecord(dateIso);

            dias.push({
                number: d,
                class: ehHoje ? 'active' : '',
                dateIso: dateIso,
                isReal: true,
                temRegistro: !!registro,
                emojiRegistro: registro ? (emojiMap[registro.humor] || null) : null
            });
        }

        return dias;
    };

    function buildIso(ano, mes, dia) {
        var m = String(mes + 1).padStart(2, '0');
        var d = String(dia).padStart(2, '0');
        return ano + '-' + m + '-' + d;
    }
});
