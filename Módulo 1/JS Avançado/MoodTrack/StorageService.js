app.service('StorageService', function () {
    var ROOT_KEY = 'moodtrack_data';
    var LEGACY_META_KEYS = [
        'mood_user_name',
        'mood_entered',
        'mood_bg_image',
        'mood_bg_opacity',
        'user_show_frases'
    ];

    var DEFAULT_DATA = {
        meta: {
            nomeUsuario: '',
            entrou: false,
            bgImagem: '',
            bgOverlayOpacity: 40,
            mostrarFrases: true
        },
        records: {}
    };

    function clone(value) {
        return JSON.parse(JSON.stringify(value));
    }

    function isRecordKey(key) {
        return /^\d{4}-\d{2}-\d{2}$/.test(key || '');
    }

    function createEmptyData() {
        return clone(DEFAULT_DATA);
    }

    function montarIsoLocal(ano, mes, dia) {
        return ano + '-' + String(mes).padStart(2, '0') + '-' + String(dia).padStart(2, '0');
    }

    function normalizeDateIso(dateValue) {
        if (!dateValue) return '';

        if (dateValue instanceof Date && !isNaN(dateValue.getTime())) {
            return montarIsoLocal(
                dateValue.getFullYear(),
                dateValue.getMonth() + 1,
                dateValue.getDate()
            );
        }

        if (typeof dateValue === 'string') {
            var valor = dateValue.trim();
            if (!valor) return '';

            if (/^\d{4}-\d{2}-\d{2}$/.test(valor)) {
                return valor;
            }

            if (/^\d{4}-\d{2}-\d{2}T/.test(valor)) {
                return valor.slice(0, 10);
            }

            if (/^\d{2}\/\d{2}\/\d{4}$/.test(valor)) {
                var partesBr = valor.split('/');
                return partesBr[2] + '-' + partesBr[1] + '-' + partesBr[0];
            }

            var dataConvertida = new Date(valor);
            if (!isNaN(dataConvertida.getTime())) {
                return montarIsoLocal(
                    dataConvertida.getFullYear(),
                    dataConvertida.getMonth() + 1,
                    dataConvertida.getDate()
                );
            }
        }

        return '';
    }

    function normalizeHumor(value) {
        if (value === null || value === undefined) return '';

        var valorTexto = String(value).trim();
        if (!valorTexto) return '';

        var numero = Number(valorTexto);
        if (isNaN(numero)) return '';
        if (numero < 1 || numero > 4) return '';

        return String(numero);
    }

    function readRoot() {
        try {
            var raw = localStorage.getItem(ROOT_KEY);
            if (!raw) return createEmptyData();

            var parsed = JSON.parse(raw);
            if (!parsed || typeof parsed !== 'object') return createEmptyData();

            if (!parsed.meta || typeof parsed.meta !== 'object') parsed.meta = {};
            if (!parsed.records || typeof parsed.records !== 'object') parsed.records = {};

            parsed.meta.nomeUsuario = parsed.meta.nomeUsuario || '';
            parsed.meta.entrou = !!parsed.meta.entrou;
            parsed.meta.bgImagem = parsed.meta.bgImagem || '';
            parsed.meta.bgOverlayOpacity = Number(parsed.meta.bgOverlayOpacity || 40);
            parsed.meta.mostrarFrases = parsed.meta.mostrarFrases !== false;

            return parsed;
        } catch (e) {
            return createEmptyData();
        }
    }

    function writeRoot(data) {
        localStorage.setItem(ROOT_KEY, JSON.stringify(data));
    }

    function normalizeRecord(record) {
        var normalized = record && typeof record === 'object' ? clone(record) : {};

        normalized.humor = Number(normalized.humor || 2);
        if (normalized.humor < 1 || normalized.humor > 4 || isNaN(normalized.humor)) {
            normalized.humor = 2;
        }

        normalized.obs = normalized.obs || '';
        normalized.habitos = Array.isArray(normalized.habitos) ? normalized.habitos : [];
        normalized.habitos = normalized.habitos.map(function (habito) {
            return {
                nome: habito && habito.nome ? habito.nome : 'Hábito',
                concluido: !!(habito && habito.concluido)
            };
        });

        return normalized;
    }

    function migrateLegacyData() {
        var data = readRoot();
        var changed = false;

        LEGACY_META_KEYS.forEach(function (key) {
            var value = localStorage.getItem(key);
            if (value === null) return;

            changed = true;
            if (key === 'mood_user_name') data.meta.nomeUsuario = value || '';
            if (key === 'mood_entered') data.meta.entrou = value === 'true';
            if (key === 'mood_bg_image') data.meta.bgImagem = value || '';
            if (key === 'mood_bg_opacity') data.meta.bgOverlayOpacity = Number(value || 40);
            if (key === 'user_show_frases') data.meta.mostrarFrases = value !== 'false';
        });

        for (var i = 0; i < localStorage.length; i++) {
            var key = localStorage.key(i);
            if (!isRecordKey(key)) continue;

            try {
                var legacyRecord = JSON.parse(localStorage.getItem(key));
                data.records[key] = normalizeRecord(legacyRecord);
                changed = true;
            } catch (e) {
                // ignora registro legado corrompido
            }
        }

        if (changed) {
            writeRoot(data);

            LEGACY_META_KEYS.forEach(function (key) {
                localStorage.removeItem(key);
            });

            var recordKeys = Object.keys(data.records);
            recordKeys.forEach(function (key) {
                localStorage.removeItem(key);
            });
        }
    }

    migrateLegacyData();

    this.getMeta = function () {
        return clone(readRoot().meta);
    };

    this.setMeta = function (patch) {
        var data = readRoot();
        patch = patch || {};
        Object.keys(patch).forEach(function (key) {
            data.meta[key] = patch[key];
        });
        writeRoot(data);
        return clone(data.meta);
    };

    this.getRecord = function (dateIso) {
        var data = readRoot();
        if (!data.records[dateIso]) return null;
        return clone(data.records[dateIso]);
    };

    this.setRecord = function (dateIso, record) {
        var data = readRoot();
        data.records[dateIso] = normalizeRecord(record);
        writeRoot(data);
        return clone(data.records[dateIso]);
    };

    this.hasRecord = function (dateIso) {
        var data = readRoot();
        return !!data.records[dateIso];
    };

    this.getAllRecords = function () {
        var data = readRoot();
        return Object.keys(data.records)
            .sort()
            .map(function (dateIso) {
                var record = clone(data.records[dateIso]);
                record.dataExibicao = dateIso;
                return record;
            });
    };

    this.getFilteredRecords = function (filters) {
        filters = filters || {};

        var filtroDataIso = normalizeDateIso(filters.data);
        var filtroHumor = normalizeHumor(filters.humor);

        return this.getAllRecords().filter(function (record) {
            var dataRegistroIso = normalizeDateIso(record.dataExibicao);
            var humorRegistro = normalizeHumor(record.humor);

            var dataOk = !filtroDataIso || dataRegistroIso === filtroDataIso;
            var humorOk = !filtroHumor || humorRegistro === filtroHumor;

            return dataOk && humorOk;
        });
    };

    this.normalizeDateIso = normalizeDateIso;
    this.normalizeHumor = normalizeHumor;

    this.clearRecords = function () {
        var data = readRoot();
        data.records = {};
        writeRoot(data);
    };
});
