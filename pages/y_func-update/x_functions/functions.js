/* ════════════════════════════════════════════════════════════════════════════════
   FUNCTION SELECTOR — functions.html uchun
   selectFunction(funcName) chaqirilganda:
     1. Panel icons-row → func.sources tartibida (duplicate ham) qayta quriladi
     2. Preset paste-sources → xuddi shu tartibda qayta quriladi
     3. Oxirida panel-ga start.png qo'shiladi → runActiveFunction() chaqiradi
════════════════════════════════════════════════════════════════════════════════ */

var _activeFunctionName = null;

var _sourceIconMap = {
    role:      { src: './images/pp_Role3.png',     id: 'role3-icon',      toggleFn: 'toggleRole3'     },
    contact:   { src: './images/pp_contact3.png',  id: 'contact3-icon',   toggleFn: 'toggleContact3'  },
    location:  { src: './images/pp_location3.png', id: 'location3-icon',  toggleFn: 'toggleLocation3' },
    car:       { src: './images/pp_CarType3.png',  id: 'car3-icon',       toggleFn: 'toggleCar3'      },
    name:      { src: './images/pp_name.png',      id: 'name-icon',       toggleFn: 'toggleName'      },
    matni:     { src: './images/pp_matni.png',     id: 'matni-icon',      toggleFn: 'toggleMatni'     },
    weight:    { src: './images/pp_weight.png',    id: 'weight-icon',     toggleFn: 'toggleWeight'    },
    tuman:     { src: './images/pp_tuman-loc.png', id: 'tuman-icon',      toggleFn: 'toggleTumanLoc'  },
    type17:    { src: './images/pp_type17.png',    id: 'type17-icon',     toggleFn: 'toggleType17'    },
    load_cash: { src: './images/pp_load-cash.png', id: 'load-cash-icon',  toggleFn: 'toggleLoadCash'  },
    closed:    { src: './images/pp_closed.png',    id: 'closed-toggle',   toggleFn: 'toggleClosed'    },
    time:      { src: './images/pp_time.png',      id: 'time-icon',       toggleFn: 'toggleTime'      }
};

/**
 * Funksiyani tanlash: panel va presetni sources bo'yicha qayta quradi
 */
function selectFunction(funcName) {
    var sig = (typeof functionSignatures !== 'undefined') && functionSignatures[funcName];
    if (!sig) { app.ShowPopup('Funksiya topilmadi: ' + funcName); return; }

    _activeFunctionName = funcName;

    _rebuildPanelIcons(sig.sources);
    _rebuildPresetIcons(sig.sources);

    // Panelni ko'rsatish
    var panel = document.getElementById('bottom-panel');
    if (panel) panel.classList.remove('panel-hidden');

    // Preset panelni ko'rsatish
    if (typeof showPresetPanelTemporary === 'function') showPresetPanelTemporary();
}

/**
 * Panel icons-row ni sources bo'yicha qayta quradi.
 * sources tartibiga qat'iy rioya qilinadi, duplicate ham qo'shiladi.
 * Har type ning BIRINCHI iconiga original ID beriladi (CacheLoad ID lookup uchun).
 * Oxirida start.png icon qo'shiladi.
 */
function _rebuildPanelIcons(sources) {
    var row = document.getElementById('icons-row');
    if (!row) return;

    // Barcha aktiv rowlarni yopish
    if (typeof _rowConfig !== 'undefined' && typeof closeRow === 'function') {
        for (var i = 0; i < _rowConfig.length; i++) closeRow(i);
    }
    var nameBtns = document.getElementById('name-btns');
    var nameIcon = document.getElementById('name-icon');
    if (nameBtns) nameBtns.classList.remove('active');
    if (nameIcon) nameIcon.classList.remove('active');

    row.innerHTML = '';

    var seenIds = {};

    for (var i = 0; i < sources.length; i++) {
        var sourceType = sources[i];
        var cfg = _sourceIconMap[sourceType];
        if (!cfg) continue;

        var img = document.createElement('img');
        img.src = cfg.src;
        img.className = 'row-icon';
        img.setAttribute('data-source', sourceType);

        // Birinchi occurrence uchun original ID beriladi
        if (!seenIds[sourceType]) {
            img.id = cfg.id;
            seenIds[sourceType] = true;
        }

        (function(type) {
            img.onclick = function() {
                var fn = _sourceIconMap[type] && _sourceIconMap[type].toggleFn;
                if (fn && typeof window[fn] === 'function') window[fn]();
            };
        })(sourceType);

        row.appendChild(img);
    }

    // start.png — o'ngga surilgan
    var startImg = document.createElement('img');
    startImg.src = './images/start.png';
    startImg.className = 'row-icon start-icon-dim';
    startImg.id = 'start-icon';
    startImg.title = 'Execute';
    startImg.style.marginLeft = 'auto';
    startImg.onclick = runActiveFunction;
    row.appendChild(startImg);
}

/**
 * Preset paste-sources ni sources bo'yicha qayta quradi.
 * Panel bilan bir xil tartib va miqdor.
 */
function _rebuildPresetIcons(sources) {
    var container = document.getElementById('paste-sources');
    if (!container) return;

    // Presetlarni tozalash
    if (typeof pastePresets !== 'undefined') {
        pastePresets = [];
        if (typeof renderPastePresets === 'function') renderPastePresets();
    }

    container.innerHTML = '';

    for (var i = 0; i < sources.length; i++) {
        var sourceType = sources[i];
        var cfg = _sourceIconMap[sourceType];
        if (!cfg) continue;

        var img = document.createElement('img');
        img.src = cfg.src;
        img.className = 'paste-source-icon';
        img.setAttribute('data-source', sourceType);
        img.setAttribute('data-idx', String(i));

        (function(type) {
            img.onclick = function() {
                if (typeof addSourceToPaste === 'function') addSourceToPaste(type);
            };
        })(sourceType);

        container.appendChild(img);
    }
}

/**
 * Aktiv funksiyani ishga tushiradi (start.png bosilganda)
 */
function runActiveFunction() {
    if (!_activeFunctionName) {
        app.ShowPopup('Avval funksiya tanlang');
        return;
    }

    if (typeof executeUniversalFunction !== 'function') {
        app.ShowPopup('executeUniversalFunction topilmadi');
        return;
    }

    // maxsus holat
    let special = ['INSERT_USER_PRFTV', 'INSERT_Load_MTTY',
                   'UPDATE_USER_ROLE_BY_PHONE',
                   'UPDATE_USER_NAME_BY_PHONE',
                   'UPDATE_USER_VEHICLE_BY_PHONE',
                   'UPDATE_CASH_CLOSED',
                   'UPDATE_TONNA_TURI',
                   'UPDATE_TUMAN_TUMAN'
                ].includes(_activeFunctionName);
    // let special = ['INSERT_USER_PRFTV', 'INSERT_Load_MTTY'].includes(_activeFunctionName);
    // let special = ['UPDATE_USER_ROLE_BY_PHONE_', 'UPDATE_USER_NAME_BY_PHONE_'].includes(_activeFunctionName);
    let mapSpetial = {
        'INSERT_USER_PRFTV': 'USER_ROW_TGHR',
        'INSERT_Load_MTTY': 'LOAD_ROW_TGHR',
        'UPDATE_USER_ROLE_BY_PHONE': 'USER_ROW_UPD_URBP_TGHR',
        'UPDATE_USER_NAME_BY_PHONE': 'USER_ROW_UPD_UNBP_TGHR',
        'UPDATE_CASH_CLOSED': 'UPDATE_CASH_CLOSED_TGHR',
        'UPDATE_TONNA_TURI': 'UPDATE_TONNA_TURI_TGHR',
        'UPDATE_TUMAN_TUMAN': 'UPDATE_TUMAN_TUMAN_TGHR',
        'UPDATE_USER_VEHICLE_BY_PHONE': 'USER_ROW_UPD_VEHICLE_TGHR'
    };

    if ( special ) {
        let contact = pastePresets.find(p => p.sources[0] === 'contact')?.values['contact'] || '';
        if (contact === '') {
            app.Alert("Contact kiritmadingiz"); return;
        }
        for (let universalF in mapSpetial) {
            if ( universalF === _activeFunctionName ) {
                // executeUniversalFunction(mapSpetial[universalF]);
                 try {
                    window[mapSpetial[universalF]](contact);
                    console.log("function.js -> runActiveFunction -> special");
                } catch(e) {
                    app.ShowPopup("❌ Xato: function.js -> runActiveFunction -> special -> " + e.message);
                }
                _hideAfterRun();
                return;
            }
        }
    }

    // default holat
    executeUniversalFunction(_activeFunctionName);

    _hideAfterRun();
}

function _hideAfterRun() {
    // Preset (x) bilan hide
    if (typeof hidePresetPanel === 'function') hidePresetPanel();

    // Panel DW arrow bilan hide
    var bottomPanel = document.getElementById('bottom-panel');
    var showBtn     = document.getElementById('panel-show-btn');
    var toggleBtn   = document.getElementById('panel-toggle-btn');
    if (bottomPanel) bottomPanel.classList.add('panel-hidden');
    if (showBtn)     showBtn.style.display = 'block';
    if (toggleBtn) { toggleBtn.textContent = '⬆️'; toggleBtn.title = "Panelni ko'rsatish"; }
}