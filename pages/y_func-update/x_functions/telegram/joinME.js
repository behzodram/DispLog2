function YUKCHI_LOAD(phone, callback) {
    db.ExecuteSql(
        queries['YUKCHI_JOIN_LOW'], [phone],
        function (res) {

            let result = [];

            for (let i = 0; i < res.rows.length; i++) {
                let row = res.rows.item(i);

                result.push({
                    driver_ismi: row.driver_ismi,
                    driver_phone: row.phone,
                    qayerdan: row.qayerdan,
                    qayerga: row.qayerga,
                    transport: row.transport
                });
            }

            if (callback) callback(result);
            else renderResults(result, { emptyMsg: '∅ Mos haydovchi topilmadi', groupBy: 'driver_ismi', groupPhoneKey: 'driver_phone', cardSchema: DRIVER_CARD_SCHEMA, cardOpts: {} });
        },
        function (err) {
            console.log("SQL Error:", err);
            if (callback) callback([]);
            else renderResults([], { emptyMsg: '∅ Mos haydovchi topilmadi', groupBy: 'driver_ismi', groupPhoneKey: 'driver_phone', cardSchema: DRIVER_CARD_SCHEMA, cardOpts: {} });
        }
    );
}

// ─── Schemas ──────────────────────────────────────────────────────────────────
var USER_CARD_SCHEMA = [
    { icon: '👤', label: 'Ismi:',     key: 'ismi' },
    { icon: '🏷',  label: 'Role:',     key: 'role' },
    { icon: '📍', label: "Yo'nalish:", format: function(v, d) { return _region(d.qayerdan) + ' → ' + _region(d.qayerga); } },
    { icon: '🚚', label: 'Transport:', key: 'transport' },
    { icon: '📞', label: 'Telefon:',   key: 'phone' }
];

function SHOW_USER(phone, callback) {
    db.ExecuteSql(
        queries['SHOW_USER'], [phone],
        function (res) {
            var result = [];
            for (var i = 0; i < res.rows.length; i++) {
                var row = res.rows.item(i);
                result.push({
                    ismi:      row.ismi,
                    phone:     row.phone,
                    role:      row.role,
                    qayerdan:  row.qayerdan,
                    qayerga:   row.qayerga,
                    transport: row.transport
                });
            }
            if (callback) callback(result);
            else renderResults(result, { emptyMsg: '∅ Foydalanuvchi topilmadi', groupBy: 'ismi', groupPhoneKey: 'phone', cardSchema: USER_CARD_SCHEMA, cardOpts: {} });
        },
        function (err) {
            console.log('SQL Error:', err);
            if (callback) callback([]);
            else renderResults([], { emptyMsg: '∅ Foydalanuvchi topilmadi', cardSchema: USER_CARD_SCHEMA, cardOpts: {} });
        }
    );
}

function SHOW_ALL_USERS(role, timeOffset, callback) {
    if (typeof timeOffset === 'function') { callback = timeOffset; timeOffset = '30 days'; }
    db.ExecuteSql(
        queries['SHOW_ALL_USERS'], [role, timeOffset || '30 days'],
        function (res) {
            var result = [];
            for (var i = 0; i < res.rows.length; i++) {
                var row = res.rows.item(i);
                result.push({
                    ismi:      row.ismi,
                    phone:     row.phone,
                    role:      row.role,
                    qayerdan:  row.qayerdan,
                    qayerga:   row.qayerga,
                    transport: row.transport
                });
            }
            if (callback) callback(result);
            else renderResults(result, { emptyMsg: '∅ Foydalanuvchilar topilmadi', groupBy: 'ismi', groupPhoneKey: 'phone', cardSchema: USER_CARD_SCHEMA, cardOpts: {} });
        },
        function (err) {
            console.log('SQL Error:', err);
            if (callback) callback([]);
            else renderResults([], { emptyMsg: '∅ Foydalanuvchilar topilmadi', groupBy: 'ismi', groupPhoneKey: 'phone', cardSchema: USER_CARD_SCHEMA, cardOpts: {} });
        }
    );
}

function SHOW_ALL_LOADS(timeOffset, callback) {
    if (typeof timeOffset === 'function') { callback = timeOffset; timeOffset = '7 days'; }
    db.ExecuteSql(
        queries['SHOW_ALL_LOADS'], [timeOffset || '7 days'],
        function (res) {
            var result = [];
            for (var i = 0; i < res.rows.length; i++) {
                var row = res.rows.item(i);
                result.push({
                    yukchi_ismi:  row.yukchi_ismi,
                    yukchi_phone: row.yukchi_phone,
                    qayerdan:     row.qayerdan,
                    qayerga:      row.qayerga,
                    transport:    row.transport,
                    tonna:        row.tonna,
                    turi:         row.turi,
                    tumandan:     row.tumandan,
                    tumanga:      row.tumanga,
                    matni:        row.matni,
                    narx:         row.narx,
                    yopilgan:     row.yopilgan,
                    updated_at:   row.updated_at
                });
            }
            _lastAllLoads = result;
            if (callback) callback(result);
            else renderResults(result, { emptyMsg: '∅ Yuklar topilmadi', groupBy: 'yukchi_ismi', groupPhoneKey: 'yukchi_phone', cardSchema: LOAD_CARD_SCHEMA, cardOpts: { statusKey: 'yopilgan', copyIcon: true } });
        },
        function (err) {
            console.log('SQL Error:', err);
            _lastAllLoads = [];
            if (callback) callback([]);
            else renderResults([], { emptyMsg: '∅ Yuklar topilmadi', groupBy: 'yukchi_ismi', groupPhoneKey: 'yukchi_phone', cardSchema: LOAD_CARD_SCHEMA, cardOpts: { statusKey: 'yopilgan', copyIcon: true } });
        }
    );
}

// ─── Region helper ───────────────────────────────────────────────────────────
function _region(code) {
    if (!code) return '?';
    return (typeof regionsMap !== 'undefined' && regionsMap[code]) ? regionsMap[code] : code;
}

// ─── SHOW_ALL_LOADS bulk copy ──────────────────────────────────────────────────
var _lastAllLoads = [];

function _buildLoadCopyText(d) {
    var lines = [];
    lines.push("📍 " + _region(d.qayerdan) + ' → ' + _region(d.qayerga));
    if (d.tumandan || d.tumanga) lines.push('🏘 ' + (d.tumandan || '?') + ' → ' + (d.tumanga || '?'));
    if (d.transport) lines.push('🚚 ' + d.transport);
    if (d.tonna)     lines.push('⚖ ' + d.tonna + ' T');
    if (d.turi)      lines.push('📦 ' + d.turi);
    if (d.yopilgan)  lines.push('⏰ ' + d.yopilgan);
    return lines.join('\n');
}

function _copyAllLoads() {
    if (!_lastAllLoads || !_lastAllLoads.length) {
        app.ShowPopup('Hech qanday yuk yuklanmagan');
        return;
    }
    var texts = _lastAllLoads.map(function(d) { return _buildLoadCopyText(d); });
    var full = texts.join('\n\n\n\n');
    app.SetClipboardText(full);
    app.ShowPopup(_lastAllLoads.length + ' ta yuk nusxalandi');
}

var DRIVER_CARD_SCHEMA = [
    { icon: '👤', label: 'Haydovchi:', key: 'driver_ismi' },
    { icon: '📍', label: "Yo'nalish:", format: function(v, d) { return _region(d.qayerdan) + ' → ' + _region(d.qayerga); } },
    { icon: '🚚', label: 'Transport:', key: 'transport' },
    { icon: '📞', label: 'Telefon:',   key: 'driver_phone' }
];

var LOAD_CARD_SCHEMA = [
    { icon: '📍', label: "Yo'nalish:", format: function(v, d) { return _region(d.qayerdan) + ' → ' + _region(d.qayerga); } },
    { icon: '🏘', label: 'Tuman:',     format: function(v, d) { return (d.tumandan || d.tumanga) ? (d.tumandan || '?') + ' → ' + (d.tumanga || '?') : null; } },
    { icon: '🚚', label: 'Transport:', key: 'transport' },
    { icon: '⚖',  label: 'Tonna:',    format: function(v, d) { return d.tonna ? d.tonna + ' T' : null; } },
    { icon: '📦', label: 'Turi:',      key: 'turi' },
    { icon: '⏰', label: 'Holati:',   key: 'yopilgan' },
    { icon: '💰', label: "Narx:",      format: function(v, d) { return d.narx ? Number(d.narx).toLocaleString() + " so'm" : null; } },
    { icon: '👤', label: 'Yukchi:',    key: 'yukchi_phone' }
];

// ─── Universal card builder ────────────────────────────────────────────────────
// schema: [{ icon, label, key? | format?(val, data) }]
// opts:   { clipboard?, statusKey? }
function _buildCard(data, schema, opts) {
    opts = opts || {};
    var card = document.createElement('div');
    card.className = 'tg-load-card';
    var clipLines = [];

    for (var i = 0; i < schema.length; i++) {
        var s   = schema[i];
        var val = s.format ? s.format(null, data)
                : (s.key !== undefined) ? data[s.key]
                : null;
        if (val === null || val === undefined || val === '') continue;

        var div  = document.createElement('div');
        div.className = 'tg-load-row';
        var sp1 = document.createElement('span');
        sp1.className = 'tg-load-icon';
        sp1.textContent = s.icon;
        var sp2 = document.createElement('span');
        sp2.className = 'tg-load-val';
        var b = document.createElement('b');
        b.textContent = s.label + ' ';
        sp2.appendChild(b);
        sp2.appendChild(document.createTextNode(val));
        div.appendChild(sp1);
        div.appendChild(sp2);
        card.appendChild(div);

        if (opts.clipboard) clipLines.push(s.icon + ' ' + s.label + ' ' + val);
    }

    if (opts.clipboard && clipLines.length) {
        app.SetClipboardText(clipLines.join('\n'));
        app.ShowPopup("Ma'lumotlar clipboardga nusxalandi");
    }

    if (opts.statusKey) {
        var isOpen = String(data[opts.statusKey]).toUpperCase() !== 'CLOSED';
        var badge  = document.createElement('span');
        badge.className = 'tg-status-badge ' + (isOpen ? 'tg-status-open' : 'tg-status-closed');
        badge.textContent = isOpen ? 'OPEN' : 'CLOSED';
        card.appendChild(badge);
    }

    if (opts.copyIcon) {
        var copyBtn = document.createElement('img');
        copyBtn.src = './images/copy.png';
        copyBtn.className = 'tg-card-copy-icon';
        copyBtn.title = 'Nusxalash';
        (function(d) {
            copyBtn.onclick = function(e) {
                e.stopPropagation();
                app.SetClipboardText(_buildLoadCopyText(d));
                app.ShowPopup('Nusxalandi');
            };
        })(data);
        card.appendChild(copyBtn);
    }

    return card;
}

// ─── Universal render ──────────────────────────────────────────────────────────
// opts: { containerId?, emptyMsg?, groupBy?, groupPhoneKey?, cardSchema, cardOpts? }
function renderResults(results, opts) {
    opts = opts || {};
    var container = document.getElementById(opts.containerId || 'TelegramFolderStyle');
    if (!container) return;
    container.innerHTML = '';

    if (!results || results.length === 0) {
        container.innerHTML = '<div class="tg-empty">' + (opts.emptyMsg || '∅ Natija topilmadi') + '</div>';
        return;
    }

    if (!opts.groupBy) {
        for (var i = 0; i < results.length; i++) {
            container.appendChild(_buildCard(results[i], opts.cardSchema, opts.cardOpts));
        }
        return;
    }

    var groups = {}, order = [];
    for (var i = 0; i < results.length; i++) {
        var r   = results[i];
        var key = r[opts.groupBy] || r[opts.groupPhoneKey] || '—';
        if (!groups[key]) {
            groups[key] = { ismi: key, phone: r[opts.groupPhoneKey], loads: [] };
            order.push(key);
        }
        groups[key].loads.push(r);
    }

    for (var f = 0; f < order.length; f++) {
        container.appendChild(_buildFolder(groups[order[f]], f, opts.cardSchema, opts.cardOpts));
    }
}

function DRIVER_LOAD(phone, callback) {
    // phone = FormatPhonePretty(phone);
    // if ( policyPhone(phone) === false ) return;

    db.ExecuteSql(
        queries['HAYDOVCHI_JOIN_LOW'], [phone],
        function (res) {

            let result = [];

            for (let i = 0; i < res.rows.length; i++) {
                let row = res.rows.item(i);

                result.push({
                    yukchi_ismi: row.yukchi_ismi,
                    yukchi_phone: row.yukchi_phone,
                    qayerdan: row.qayerdan,
                    qayerga: row.qayerga,
                    transport: row.transport,
                    tonna: row.tonna,
                    turi: row.turi,
                    tumandan: row.tumandan,
                    tumanga: row.tumanga,
                    matni: row.matni,
                    narx: row.narx,
                    yopilgan: row.yopilgan
                });
            }

            if (callback) callback(result);
            else renderResults(result, { emptyMsg: '∅ Mos yuk topilmadi', groupBy: 'yukchi_ismi', groupPhoneKey: 'yukchi_phone', cardSchema: LOAD_CARD_SCHEMA, cardOpts: { clipboard: true, statusKey: 'yopilgan' } });
        },
        function (err) {
            console.log("SQL Error:", err);
            if (callback) callback([]);
            else renderResults([], { emptyMsg: '∅ Mos yuk topilmadi', groupBy: 'yukchi_ismi', groupPhoneKey: 'yukchi_phone', cardSchema: LOAD_CARD_SCHEMA, cardOpts: { clipboard: true, statusKey: 'yopilgan' } });
        }
    );
}


function _folderAvatarColor(str) {
    var palette = ['#5a8fbf','#4a9b6f','#b89c5f','#7a5abf','#bf5a7a','#5abfb0','#9b6f4a'];
    var h = 0;
    for (var i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) & 0xffff;
    return palette[h % palette.length];
}

function _buildFolder(group, idx, cardSchema, cardOpts) {
    var folder = document.createElement('div');
    folder.className = 'tg-folder';

    // ── Header ──
    var header = document.createElement('div');
    header.className = 'tg-folder-header';

    var avatar = document.createElement('div');
    avatar.className = 'tg-folder-avatar';
    avatar.textContent = group.ismi.charAt(0).toUpperCase();
    avatar.style.background = _folderAvatarColor(group.ismi);

    var info = document.createElement('div');
    info.className = 'tg-folder-info';

    var nameEl = document.createElement('div');
    nameEl.className = 'tg-folder-name';
    nameEl.textContent = group.ismi;

    var sub = document.createElement('div');
    sub.className = 'tg-folder-sub';
    var fl = group.loads[0];
    sub.textContent = (fl.qayerdan || '?') + ' → ' + (fl.qayerga || '?');

    info.appendChild(nameEl);
    info.appendChild(sub);

    var badge = document.createElement('span');
    badge.className = 'tg-folder-badge';
    badge.textContent = group.loads.length;

    var arrow = document.createElement('span');
    arrow.className = 'tg-folder-arrow';
    arrow.textContent = '▼';

    header.appendChild(avatar);
    header.appendChild(info);
    header.appendChild(badge);
    header.appendChild(arrow);

    // ── Body ──
    var body = document.createElement('div');
    body.className = 'tg-folder-body';
    for (var i = 0; i < group.loads.length; i++) {
        body.appendChild(_buildCard(group.loads[i], cardSchema, cardOpts));
    }

    folder.appendChild(header);
    folder.appendChild(body);

    header.onclick = function () { folder.classList.toggle('open'); };
    if (idx === 0) folder.classList.add('open');

    return folder;
}
