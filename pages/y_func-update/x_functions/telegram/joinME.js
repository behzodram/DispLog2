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
            else renderTelegramFolders(result);
        },
        function (err) {
            console.log("SQL Error:", err);
            if (callback) callback([]);
            else renderTelegramFolders([]);
        }
    );
}

// ─── renderTelegramFolders ─────────────────────────────────────────────────────────────
function renderTelegramFolders(results) {
    var container = document.getElementById('TelegramFolderStyle');
    if (!container) return;
    container.innerHTML = '';

    if (!results || results.length === 0) {
        container.innerHTML = '<div class="tg-empty">∅ Mos yuk topilmadi</div>';
        return;
    }

    // yukchi_ismi bo'yicha guruhlash
    var groups = {};
    var order  = [];
    for (var i = 0; i < results.length; i++) {
        var r   = results[i];
        var key = r.yukchi_ismi || r.yukchi_phone || '—';
        if (!groups[key]) {
            groups[key] = { ismi: key, phone: r.yukchi_phone, loads: [] };
            order.push(key);
        }
        groups[key].loads.push(r);
    }

    for (var f = 0; f < order.length; f++) {
        container.appendChild(_buildFolder(groups[order[f]], f));
    }
}

function _folderAvatarColor(str) {
    var palette = ['#5a8fbf','#4a9b6f','#b89c5f','#7a5abf','#bf5a7a','#5abfb0','#9b6f4a'];
    var h = 0;
    for (var i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) & 0xffff;
    return palette[h % palette.length];
}

function _buildFolder(group, idx) {
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
        body.appendChild(_buildLoadCard(group.loads[i]));
    }

    folder.appendChild(header);
    folder.appendChild(body);

    header.onclick = function () { folder.classList.toggle('open'); };
    if (idx === 0) folder.classList.add('open');

    return folder;
}

function _buildLoadCard(load) {
    var card = document.createElement('div');
    card.className = 'tg-load-card';
    
    function getRow(icon, label, val) {
        return icon + ' ' + label + ' ' + (val || '—');
    }

    function addRow(icon, label, val) {
        let got  = getRow(icon, label, val);
        if (val === null || val === undefined || val === '') return;
        var div = document.createElement('div');
        div.className = 'tg-load-row';
        var span1 = document.createElement('span');
        span1.className = 'tg-load-icon';
        span1.textContent = icon;
        var span2 = document.createElement('span');
        span2.className = 'tg-load-val';
        var b = document.createElement('b');
        b.textContent = label + ' ';
        span2.appendChild(b);
        span2.appendChild(document.createTextNode(val));
        div.appendChild(span1);
        div.appendChild(span2);
        card.appendChild(div);
        return got;
    }

    var route    = (load.qayerdan || '?') + ' → ' + (load.qayerga || '?');
    var district = (load.tumandan || load.tumanga)
                    ? (load.tumandan || '?') + ' → ' + (load.tumanga || '?')
                    : null;
    
    let InfoAdd = '';

                      addRow('📍', 'Yo\'nalish:', route);
    InfoAdd += '\n' + getRow('📍', 'Yo\'nalish:', route);
                      addRow('🏘', 'Tuman:',     district);
    InfoAdd += '\n' + getRow('🏘', 'Tuman:',     district);
                      addRow('🚚', 'Transport:', load.transport);
    InfoAdd += '\n' + getRow('🚚', 'Transport:', load.transport);
                      addRow('⚖',  'Tonna:',     load.tonna ? load.tonna + ' T' : null);
    InfoAdd += '\n' + getRow('⚖',  'Tonna:',     load.tonna ? load.tonna + ' T' : null);
                      addRow('📦', 'Turi:',      load.turi);
    InfoAdd += '\n' + getRow('📦', 'Turi:',      load.turi);
                      addRow('⏰', 'Yopilgan:',   load.yopilgan);
    InfoAdd += '\n' + getRow('⏰', 'Yopilgan:',   load.yopilgan);
    // loadInfo += '\n' + addRow('💬', 'Matni:',     load.matni);
    addRow('💰', 'Narx:',      load.narx ? Number(load.narx).toLocaleString() + ' so\'m' : null);
    addRow('👤', 'Yukchi:',    load.yukchi_phone);

    console.log("InfoAdd: ", InfoAdd);
    app.SetClipboardText(InfoAdd.trim());
    app.ShowPopup("Yuk ma'lumotlari clipboardga nusxalandi");

    var isOpen = String(load.yopilgan).toUpperCase() !== 'CLOSED';
    var statusBadge = document.createElement('span');
    statusBadge.className = 'tg-status-badge ' + (isOpen ? 'tg-status-open' : 'tg-status-closed');
    statusBadge.textContent = isOpen ? 'OPEN' : 'CLOSED';
    card.appendChild(statusBadge);

    return card;
}