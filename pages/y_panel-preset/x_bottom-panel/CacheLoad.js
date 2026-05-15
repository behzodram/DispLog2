// ─── BOTTOM PANEL SEQUENTIAL TOGGLE ───────────────────────────────────────────────────
var _currentActiveRow = 3;  // Start at 3 so first click opens role (0)
var _rowConfig = [
    { id: 'role3', icon: 'role3-icon', btns: 'role3-btns', type: 'role' },
    { id: 'contact3', icon: 'contact3-icon', btns: 'contact3-btns', type: 'contact' },
    { id: 'location3', icon: 'location3-icon', btns: 'loc3-btns', type: 'location' },
    { id: 'car3', icon: 'car3-icon', btns: 'car3-btns', type: 'car' }
];

// ─── INPUT ROWS REGISTRY ──────────────────────────────────────────────────────
// Har bir "input" tipidagi row shu yerda ro'yxatga olinadi.
// Yangi input icon qo'shilganda faqat shu arrayga entry qo'shish yetarli.
// closeAllInputRows() barcha shunday rowlarni avtomatik yopadi va input qiymatini tozalaydi.
var _inputRowConfig = [
    {
        btnsId:  'name-btns',
        iconId:  'name-icon',
        clearFn: function() {
            var inp = document.getElementById('name-input');
            if (inp) inp.value = '';
        }
    },
    {
        btnsId:  'matni-btns',
        iconId:  'matni-icon',
        clearFn: function() {
            var inp = document.getElementById('matni-input');
            if (inp) inp.value = '';
        }
    },
    {
        btnsId:  'weight-btns',
        iconId:  'weight-icon',
        clearFn: function() {
            var inp = document.getElementById('weight-input');
            if (inp) inp.value = '';
        }
    },
    {
        btnsId:  'tuman-btns',
        iconId:  'tuman-icon',
        clearFn: function() {
            var inp = document.getElementById('tuman-input');
            if (inp) inp.value = '';
        }
    },
    {
        btnsId:  'type17-btns',
        iconId:  'type17-icon',
        clearFn: function() {
            var inp = document.getElementById('type17-input');
            if (inp) inp.value = '';
        }
    },
    {
        btnsId:  'load-cash-btns',
        iconId:  'load-cash-icon',
        clearFn: function() {
            var inp = document.getElementById('load-cash-input');
            if (inp) inp.value = '';
            var tonna = document.getElementById('load-cash-tonna');
            if (tonna) tonna.value = '';
        }
    },
    {
        btnsId:  'time-btns',
        iconId:  'time-icon',
        clearFn: function() {
            var inp = document.getElementById('time-input');
            if (inp) inp.value = '';
        }
    }
    // Keyingi input icon: { btnsId: 'xxx-btns', iconId: 'xxx-icon', clearFn: function() { ... } }
];
//////////////////////////
var phone3 = [];
var fixlen_num  = 9;
var max_numbers = 3;
var lastAppendTime = 0;
var txt_file = "";

// ─── Drawer Dialogs ──────────────────────────────────────
var VIL_DIALOG;
var CAR_DIALOG;

function ShowViloyat(name) {
    var data = "";
    if      (name === "FABJ")  data = "FAR,AND,BUX,JIZ";
    else if (name === "XoQoN") data = "XOR,QASH,NAM,QORA,NAV";
    else if (name === "SuT")   data = "SAM,SUR,TOSH,SIRD";

    VIL_DIALOG = app.CreateListDialog(name, data);
    VIL_DIALOG.SetOnTouch(Viloyat_OnTouch);
    VIL_DIALOG.Show();
}

function Viloyat_OnTouch(item) {
    // Preset-ga qo'shish (clipboard o'rniga)
    if (typeof addPresetFromPanel === 'function') {
        addPresetFromPanel('location', item);
    } else {
        navigator.clipboard.writeText(item);
        app.ShowPopup(item + " nusxa olindi");
    }
    return item;
}

function ShowCarType(name) {
    var data = "";
    if      (name === "FURA")   data = "FURA TENT,FURA REF";
    else if (name === "ISUZU")  data = "ISUZU KATTA,ISUZU KICHIK,ISUZU KATTA REF,ISUZU KICHIK REF";
    else if (name === "BOSHQA") data = "CHAKMAN,PLASHATKA,KAMAZ,TANAR,SHALANDA";

    CAR_DIALOG = app.CreateListDialog(name, data);
    CAR_DIALOG.SetOnTouch(CarType_OnTouch);
    CAR_DIALOG.Show();
}

function CarType_OnTouch(item) {
    // Preset-ga qo'shish (clipboard o'rniga)
    if (typeof addPresetFromPanel === 'function') {
        addPresetFromPanel('car', item);
    } else {
        navigator.clipboard.writeText(item);
        app.ShowPopup(item + " nusxa olindi");
    }
    return item;
}

function init_Cache() {
    anorLoadScript("pretty_norm.js", true);
    // NormalizePhone va FormatPhonePretty FUNCTIONS
    // that functions used inside Service.js fayle and here
    
    // Input phone number:  -> +998 99-111-22-33 
    // NormalizePhone       -> 991112233
    // FormatPhonePretty    -> 99-111-22-33 

    AndroidPath = app.GetPath();
    db = app.OpenDatabase(AndroidPath + "/MyData.db");

    if (!app.FileExists(AndroidPath + "/phone3.txt"))
        app.WriteFile(AndroidPath + "/phone3.txt", "");

    txt_file = AndroidPath + "/phone3.txt";
    return db;
}

// ─── AppendNumber ────────────────────────────────────────────────────────────
function AppendNumber(num_new) {
    num_new = NormalizePhone( num_new );
    num_new = num_new.toString().padStart(fixlen_num, "0");

    if (num_new.length !== fixlen_num) {
        app.ShowPopup("Raqam uzunligi " + fixlen_num + " bo'lishi kerak");
        return;
    }

    var existing = app.FileExists(txt_file) ? app.ReadFile(txt_file) : "";

    if (existing.includes(num_new)) return;

    var now = Date.now();
    if (now - lastAppendTime < 3000) {
        console.log("Cooldown: 3s ichida boshqa raqam qabul qilinmaydi");
        return;
    }

    existing = num_new + existing;
    var max_len = fixlen_num * max_numbers;
    if (existing.length > max_len) existing = existing.substring(0, max_len);

    app.WriteFile(txt_file, existing);
    lastAppendTime = now;
}

// ─── ReadNumbers ─────────────────────────────────────────────────────────────
function ReadNumbers() {
    if (!app.FileExists(txt_file)) return [];
    var data = app.ReadFile(txt_file);
    var nums = [];
    for (var i = 0; i < data.length; i += fixlen_num)
        nums.push( FormatPhonePretty( data.substr(i, fixlen_num) ) );
    return nums;
}

// ─── LoadNumber_3  (OnStart dan chaqiriladi) ─────────────────────────────────
function LoadNumber_3() {
    var nums = ReadNumbers();
    phone3[0] = nums[0] || "";
    phone3[1] = nums[1] || "";
    phone3[2] = nums[2] || "";
}

function _setC3Label(i, num) {
    var btn = document.getElementById("c3-btn-" + i);
    if (!btn) return;
    btn.textContent = (num && num.length >= 5) ? num.slice(-5) : (num || "----");
}

/**
 * Barcha input-type rowlarni yopadi va inputlarni tozalaydi.
 * Yangi icon bosilganda avval shu chaqiriladi.
 */
function closeAllInputRows() {
    for (var i = 0; i < _inputRowConfig.length; i++) {
        var cfg = _inputRowConfig[i];
        var btns = document.getElementById(cfg.btnsId);
        var icon = document.getElementById(cfg.iconId);
        if (btns) btns.classList.remove('active');
        if (icon) icon.classList.remove('active');
        if (typeof cfg.clearFn === 'function') cfg.clearFn();
    }
}

/**
 * Show overlay to dim other content (70% transparent)
 */
function showPanelOverlay() {
    var overlay = document.getElementById("panel-overlay");
    if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = "panel-overlay";
        overlay.className = "panel-overlay";
        document.body.insertBefore(overlay, document.body.firstChild);
    }
    overlay.style.display = "block";
}

/**
 * Hide overlay
 */
function hidePanelOverlay() {
    var overlay = document.getElementById("panel-overlay");
    if (overlay) {
        overlay.style.display = "none";
    }
}

/**
 * Hide preset panel
 */
function _hidePresetPanel() {
    if (typeof hidePresetPanel === 'function') {
        hidePresetPanel();
    }
}

/**
 * Toggle bottom panel visibility (hide/show entire panel)
 */
function togglePanelVisibility() {
    var bottomPanel = document.getElementById("bottom-panel");
    var showBtn = document.getElementById("panel-show-btn");
    var toggleBtn = document.getElementById("panel-toggle-btn");
    
    if (!bottomPanel || !showBtn) return;
    
    // Check if panel is hidden
    var isHidden = bottomPanel.classList.contains("panel-hidden");
    
    if (isHidden) {
        // SHOW the panel
        bottomPanel.classList.remove("panel-hidden");
        showBtn.style.display = "none";
        if (toggleBtn) {
            toggleBtn.textContent = "⬇️";
            toggleBtn.title = "Panelni yashirish";
        }
    } else {
        // HIDE the panel
        bottomPanel.classList.add("panel-hidden");
        showBtn.style.display = "block";
        if (toggleBtn) {
            toggleBtn.textContent = "⬆️";
            toggleBtn.title = "Panelni ko'rsatish";
        }
    }
}

/**
 * Toggle BOTH: Sequential bottom row + Preset panel with filtered source
 */
function toggleBothPanels() {
    var panel = document.getElementById("bottom-panel");
    if (!panel) return;
    
    // Har click-da keyingi row-ga o't (panel har vaqt OCHIQ)
    _currentActiveRow = (_currentActiveRow + 1) % _rowConfig.length;
    
    // Barcha row-larni close qil
    for (var i = 0; i < _rowConfig.length; i++) {
        closeRow(i);
    }
    
    // Aktif row-ni open qil
    if (_currentActiveRow >= 0 && _currentActiveRow < _rowConfig.length) {
        openRow(_currentActiveRow);
    }
    
    // Panel OCHIQ qol (hech qachon yopilmasin)
    panel.classList.remove("panel-collapsed");
    
    // Preset panel: aktif row-ga mos source type-ni aç va filter qil
    if (typeof openPresetForRow === 'function') {
        var activeType = _rowConfig[_currentActiveRow].type;
        openPresetForRow(activeType);
    }
}

/**
 * Open a specific row with animation and show overlay/preset
 */
function openRow(rowIndex) {
    if (rowIndex < 0 || rowIndex >= _rowConfig.length) return;
    
    var config = _rowConfig[rowIndex];
    var icon = document.getElementById(config.icon);
    var btnsContainer = document.getElementById(config.btns);
    
    if (!icon || !btnsContainer) return;
    
    // Mark icon as active (for styling)
    if (icon) {
        icon.classList.add("active");
    }
    
    // Show row content with grid display
    btnsContainer.classList.add("active");
    
    // Show overlay (70% transparent background)
    showPanelOverlay();
    
    var btns = btnsContainer.querySelectorAll("button");
    _animateShow(btns);
}

/**
 * Close a specific row with animation
 */
function closeRow(rowIndex) {
    if (rowIndex < 0 || rowIndex >= _rowConfig.length) return;
    
    var config = _rowConfig[rowIndex];
    var icon = document.getElementById(config.icon);
    var btnsContainer = document.getElementById(config.btns);
    
    if (!icon || !btnsContainer) return;
    
    // Unmark icon as active
    if (icon) {
        icon.classList.remove("active");
    }
    
    // Hide row content
    btnsContainer.classList.remove("active");
    
    var btns = btnsContainer.querySelectorAll("button");
    _animateHide(btns);
}

function toggleBottomPanel() {
    toggleBothPanels();
}

// ─── copyPhone ───────────────────────────────────────────────────────────────
function copyPhone(i) {
    var num = (window.phone3 && window.phone3[i]) || "";
    if (!num) { app.ShowPopup("Raqam yo'q"); return; }

    // Preset-ga qo'shish (clipboard o'rniga)
    if (typeof addPresetFromPanel === 'function') {
        addPresetFromPanel('contact', num);
        // app.ShowPopup("Presetga qo'shildi: ..." + num.slice(-5));
    } else {
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(num).catch(function() { _fallbackCopy(num); });
            } else {
                _fallbackCopy(num);
            }
        } catch(e) { _fallbackCopy(num); }
        app.ShowPopup("Nusxa olindi: ..." + num.slice(-5));
    }
}

function _fallbackCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.style.cssText = "position:fixed;top:0;left:0;opacity:0;font-size:12px";
    document.body.appendChild(ta);
    ta.focus(); ta.select();
    try { document.execCommand("copy"); } catch(e) {}
    document.body.removeChild(ta);
}

// ─── Panel toggle state ──────────────────────────────────────────────────────
var _loc3Visible     = false;
var _contact3Visible = false;
var _car3Visible     = true;
var _role3Visible    = false;

// ─── toggleLocation3 ─────────────────────────────────────────────────────────
// Icon click: Faqat location row ochiladi (boshqalar yopiladi)
function toggleLocation3() {
    _currentActiveRow = 2;  // location = index 2 (new order)

    // Input rowlarni avval yopamiz (name va kelajakdagi input iconlar)
    closeAllInputRows();

    // FAQAT BOSHQA row-larni close qil (location-ni yopma!)
    for (var i = 0; i < _rowConfig.length; i++) {
        if (i !== _currentActiveRow) {
            closeRow(i);
        }
    }
    
    // Aktif row-ni open qil
    openRow(_currentActiveRow);
    
    // Panel ochiq
    var panel = document.getElementById("bottom-panel");
    if (panel) panel.classList.remove("panel-collapsed");
    
    // Preset filter
    if (typeof openPresetForRow === 'function') {
        openPresetForRow(_rowConfig[_currentActiveRow].type);
    }
}

// ─── toggleContact3 ──────────────────────────────────────────────────────────
// Icon click: Faqat contact row ochiladi (boshqalar yopiladi)
function toggleContact3() {
    _currentActiveRow = 1;  // contact = index 1 (new order)

    // Input rowlarni avval yopamiz (name va kelajakdagi input iconlar)
    closeAllInputRows();

    // FAQAT BOSHQA row-larni close qil (contact-ni yopma!)
    for (var i = 0; i < _rowConfig.length; i++) {
        if (i !== _currentActiveRow) {
            closeRow(i);
        }
    }
    
    // Aktif row-ni open qil
    openRow(_currentActiveRow);
    
    // Panel ochiq
    var panel = document.getElementById("bottom-panel");
    if (panel) panel.classList.remove("panel-collapsed");
    
    // Raqamlarni qayta yuklash
    var fresh = ReadNumbers();
    phone3[0] = fresh[0] || "";
    phone3[1] = fresh[1] || "";
    phone3[2] = fresh[2] || "";
    
    _setC3Label(0, phone3[0] );
    _setC3Label(1, phone3[1] );
    _setC3Label(2, phone3[2] );

    // Yashil buttondagi raqamni input areaga ham yozish
    var c3Input = document.getElementById('contact3-input');
    if (c3Input) c3Input.value = phone3[0] || '';
    
    // Preset filter
    if (typeof openPresetForRow === 'function') {
        openPresetForRow(_rowConfig[_currentActiveRow].type);
    }
}

// ─── submitContact3Phone ──────────────────────────────────────────────────────
// Call_SQL.png bosilganda: input qiymatini CALL_USER SQL ga yuboradi.
// Bazada topilsa — item.phone ishlatiladi.
// Topilmasa — inputdagi qiymat FormatPhonePretty + policyPhone orqali
// tekshiriladi va mos kelsa presetga tushadi.
function submitContact3Phone() {
    var input = document.getElementById('contact3-input');
    if (!input) return;
    var val = input.value.trim();
    if (!val) { app.ShowPopup('Raqam bo\'sh'); return; }

    function _closeContact3Row() {
        input.value = '';
        var btnsEl = document.getElementById('contact3-btns');
        var iconEl = document.getElementById('contact3-icon');
        if (btnsEl) btnsEl.classList.remove('active');
        if (iconEl) iconEl.classList.remove('active');
        hidePanelOverlay();
    }

    function _addToPreset(phone) {
        _closeContact3Row();
        if (typeof addPresetFromPanel === 'function') {
            addPresetFromPanel('contact', phone);
        }
    }

    db.ExecuteSql(queries['CALL_USER'], ['%' + val], function(results) {
        var item = results.rows.length > 0 ? results.rows.item(0) : null;
        if (item && item.phone) {
            // Bazada topildi — item.phone dan foydalaniladi
            _closeContact3Row();
            if (typeof addPresetFromPanel === 'function') {
                addPresetFromPanel('contact', item.phone, { fromDB: true });
            }
            return;
        }

        // Bazada topilmadi — inputdagi qiymatni format + policy orqali o'tkaz
        var phone = FormatPhonePretty(val);
        if (policyPhone(phone) === false) return;
        _addToPreset(phone);
    });
}

// ─── toggleCar3 ──────────────────────────────────────────────────────────────
// Icon click: Faqat car row ochiladi (boshqalar yopiladi)
function toggleCar3() {
    _currentActiveRow = 3;  // car = index 3 (new order)

    // Input rowlarni avval yopamiz (name va kelajakdagi input iconlar)
    closeAllInputRows();

    // FAQAT BOSHQA row-larni close qil (car-ni yopma!)
    for (var i = 0; i < _rowConfig.length; i++) {
        if (i !== _currentActiveRow) {
            closeRow(i);
        }
    }
    
    // Aktif row-ni open qil
    openRow(_currentActiveRow);
    
    // Panel ochiq
    var panel = document.getElementById("bottom-panel");
    if (panel) panel.classList.remove("panel-collapsed");
    
    // Preset filter
    if (typeof openPresetForRow === 'function') {
        openPresetForRow(_rowConfig[_currentActiveRow].type);
    }
}

// ─── toggleName ───────────────────────────────────────────────────────────────
// Icon click: Faqat name row ochiladi (boshqalar yopiladi).
// Model: boshqa input icon qo'shilganda xuddi shu pattern ishlatiladi.
function toggleName() {
    var icon = document.getElementById("name-icon");
    var btns = document.getElementById("name-btns");

    if (!icon || !btns) return;

    // Ochiq yoki yopiqligini toggledan OLDIN saqlab olamiz
    var wasActive = btns.classList.contains("active");

    // Barcha button rowlarni yopamiz
    for (var i = 0; i < _rowConfig.length; i++) {
        closeRow(i);
    }
    // Barcha input rowlarni yopamiz va inputlarni tozalaymiz (o'zini ham)
    closeAllInputRows();

    if (!wasActive) {
        // Agar yopiq bo'lsa — ochamiz
        btns.classList.add("active");
        icon.classList.add("active");

        // Show overlay
        showPanelOverlay();

        // Focus on input
        var input = document.getElementById("name-input");
        if (input) {
            setTimeout(function() {
                input.focus();
                input.select();
            }, 100);
        }
    }
    // wasActive === true holati: closeAllInputRows() allaqachon yopdi — qo'shimcha ish yo'q

    // Panel ochiq
    var panel = document.getElementById("bottom-panel");
    if (panel) panel.classList.remove("panel-collapsed");

    if (!wasActive && typeof openPresetForRow === 'function') {
        openPresetForRow('name');
    }
}

// ─── submitName ───────────────────────────────────────────────────────────────
function submitName() {
    var input = document.getElementById("name-input");
    if (!input) return;
    
    var name = input.value.trim();
    
    if (!name) {
        app.ShowPopup("Ism bo'sh bo'la olmaydi");
        return;
    }
    
    // Preset-ga qo'shish
    if (typeof addPresetFromPanel === 'function') {
        addPresetFromPanel('name', name);
    } else {
        navigator.clipboard.writeText(name);
        app.ShowPopup(name + " nusxa olindi");
    }
    
    // Clear input
    input.value = "";
    
    // Close name row
    var btns = document.getElementById("name-btns");
    var icon = document.getElementById("name-icon");
    if (btns) {
        btns.classList.remove("active");
    }
    if (icon) {
        icon.classList.remove("active");
    }
}

// ─── toggleMatni ──────────────────────────────────────────────────────────────
// Icon click: Faqat matni row ochiladi (boshqalar yopiladi).
// name model asosida — _inputRowConfig orqali avtomatik boshqariladi.
function toggleMatni() {
    var icon = document.getElementById("matni-icon");
    var btns = document.getElementById("matni-btns");

    if (!icon || !btns) return;

    var wasActive = btns.classList.contains("active");

    // Barcha button rowlarni yopamiz
    for (var i = 0; i < _rowConfig.length; i++) {
        closeRow(i);
    }
    // Barcha input rowlarni yopamiz va inputlarni tozalaymiz (o'zini ham)
    closeAllInputRows();

    if (!wasActive) {
        btns.classList.add("active");
        icon.classList.add("active");

        showPanelOverlay();

        var input = document.getElementById("matni-input");
        if (input) {
            setTimeout(function() {
                input.focus();
                input.select();
            }, 100);
        }
    }

    var panel = document.getElementById("bottom-panel");
    if (panel) panel.classList.remove("panel-collapsed");

    if (!wasActive && typeof openPresetForRow === 'function') {
        openPresetForRow('matni');
    }
}

// ─── submitMatni ──────────────────────────────────────────────────────────────
function submitMatni() {
    var input = document.getElementById("matni-input");
    if (!input) return;

    var matni = input.value.trim();

    if (!matni) {
        app.ShowPopup("Matn bo'sh bo'la olmaydi");
        return;
    }

    if (typeof addPresetFromPanel === 'function') {
        addPresetFromPanel('matni', matni);
    } else {
        navigator.clipboard.writeText(matni);
        app.ShowPopup(matni + " nusxa olindi");
    }

    input.value = "";

    var btns = document.getElementById("matni-btns");
    var icon = document.getElementById("matni-icon");
    if (btns) btns.classList.remove("active");
    if (icon) icon.classList.remove("active");
}

// ─── toggleWeight ────────────────────────────────────────────────────────────
// Icon click: Faqat weight row ochiladi (boshqalar yopiladi).
// matni model asosida — _inputRowConfig orqali avtomatik boshqariladi.
function toggleWeight() {
    var icon = document.getElementById("weight-icon");
    var btns = document.getElementById("weight-btns");

    if (!icon || !btns) return;

    var wasActive = btns.classList.contains("active");

    // Barcha button rowlarni yopamiz
    for (var i = 0; i < _rowConfig.length; i++) {
        closeRow(i);
    }
    // Barcha input rowlarni yopamiz va inputlarni tozalaymiz (o'zini ham)
    closeAllInputRows();

    if (!wasActive) {
        btns.classList.add("active");
        icon.classList.add("active");

        showPanelOverlay();

        var input = document.getElementById("weight-input");
        if (input) {
            setTimeout(function() {
                input.focus();
                input.select();
            }, 100);
        }
    }

    var panel = document.getElementById("bottom-panel");
    if (panel) panel.classList.remove("panel-collapsed");

    if (!wasActive && typeof openPresetForRow === 'function') {
        openPresetForRow('weight');
    }
}

// ─── submitWeight ─────────────────────────────────────────────────────────────
function submitWeight() {
    var input = document.getElementById("weight-input");
    if (!input) return;

    var weight = input.value.trim();

    if (!weight) {
        app.ShowPopup("Vazn bo'sh bo'la olmaydi");
        return;
    }

    if (typeof addPresetFromPanel === 'function') {
        addPresetFromPanel('weight', weight);
    } else {
        navigator.clipboard.writeText(weight);
        app.ShowPopup(weight + " nusxa olindi");
    }

    input.value = "";

    var btns = document.getElementById("weight-btns");
    var icon = document.getElementById("weight-icon");
    if (btns) btns.classList.remove("active");
    if (icon) icon.classList.remove("active");
}

// ─── toggleTumanLoc ───────────────────────────────────────────────────────────
// Location-like: row YOPILMAYDI accept bosilganda.
// 1-ACCEPT = qayerdan tumani, 2-ACCEPT = qayerga tumani.
function toggleTumanLoc() {
    var icon = document.getElementById("tuman-icon");
    var btns = document.getElementById("tuman-btns");

    if (!icon || !btns) return;

    var wasActive = btns.classList.contains("active");

    for (var i = 0; i < _rowConfig.length; i++) {
        closeRow(i);
    }
    closeAllInputRows();

    if (!wasActive) {
        btns.classList.add("active");
        icon.classList.add("active");

        showPanelOverlay();

        var input = document.getElementById("tuman-input");
        if (input) {
            setTimeout(function() { input.focus(); input.select(); }, 100);
        }
    }

    var panel = document.getElementById("bottom-panel");
    if (panel) panel.classList.remove("panel-collapsed");

    if (!wasActive && typeof openPresetForRow === 'function') {
        openPresetForRow('tuman');
    }
}

// ─── submitTumanLoc ───────────────────────────────────────────────────────────
// Location-like: presetga qo'shadi + inputni tozalaydi + ROW OCHIQ QOLADI.
// Shunday qilib 1-bosish = qayerdan, 2-bosish = qayerga bo'ladi.
function submitTumanLoc() {
    var input = document.getElementById("tuman-input");
    if (!input) return;

    var tumanLoc = input.value.trim();

    if (!tumanLoc) {
        app.ShowPopup("Tuman bo'sh bo'la olmaydi");
        return;
    }

    if (typeof addPresetFromPanel === 'function') {
        addPresetFromPanel('tuman', tumanLoc);
    } else {
        navigator.clipboard.writeText(tumanLoc);
        app.ShowPopup(tumanLoc + " nusxa olindi");
    }

    input.value = "";

    var btns = document.getElementById("tuman-btns");
    var icon = document.getElementById("tuman-icon");
    if (btns) btns.classList.remove("active");
    if (icon) icon.classList.remove("active");
}

// ─── toggleType17 ───────────────────────────────────────────────────────────
function toggleType17() {
    var icon = document.getElementById("type17-icon");
    var btns = document.getElementById("type17-btns");

    if (!icon || !btns) return;

    var wasActive = btns.classList.contains("active");

    for (var i = 0; i < _rowConfig.length; i++) {
        closeRow(i);
    }
    closeAllInputRows();

    if (!wasActive) {
        btns.classList.add("active");
        icon.classList.add("active");

        showPanelOverlay();

        var input = document.getElementById("type17-input");
        if (input) {
            setTimeout(function() { input.focus(); input.select(); }, 100);
        }
    }

    var panel = document.getElementById("bottom-panel");
    if (panel) panel.classList.remove("panel-collapsed");

    if (!wasActive && typeof openPresetForRow === 'function') {
        openPresetForRow('type17');
    }
}

// ─── submitType17 ────────────────────────────────────────────────────────────
function submitType17() {
    var input = document.getElementById("type17-input");
    if (!input) return;

    var val = input.value.trim();

    if (!val) {
        app.ShowPopup("Type17 bo'sh bo'la olmaydi");
        return;
    }

    if (typeof addPresetFromPanel === 'function') {
        addPresetFromPanel('type17', val);
    } else {
        navigator.clipboard.writeText(val);
        app.ShowPopup(val + " nusxa olindi");
    }

    input.value = "";

    var btns = document.getElementById("type17-btns");
    var icon = document.getElementById("type17-icon");
    if (btns) btns.classList.remove("active");
    if (icon) icon.classList.remove("active");
}

// ─── toggleLoadCash ───────────────────────────────────────────────
function toggleLoadCash() {
    var icon = document.getElementById("load-cash-icon");
    var btns = document.getElementById("load-cash-btns");

    if (!icon || !btns) return;

    var wasActive = btns.classList.contains("active");

    for (var i = 0; i < _rowConfig.length; i++) {
        closeRow(i);
    }
    closeAllInputRows();

    if (!wasActive) {
        btns.classList.add("active");
        icon.classList.add("active");

        showPanelOverlay();

        var input = document.getElementById("load-cash-input");
        if (input) {
            setTimeout(function() { input.focus(); input.select(); }, 100);
        }
    }

    var panel = document.getElementById("bottom-panel");
    if (panel) panel.classList.remove("panel-collapsed");

    if (!wasActive && typeof openPresetForRow === 'function') {
        openPresetForRow('load_cash');
    }
}

// ─── formatLoadCash ───────────────────────────────────────────────
// Kirilgan sonni o'ngdan 3ta-3ta guruhlaydi (masalan: 1 234 567)
function formatLoadCash(inp) {
    var raw = inp.value.replace(/\D/g, '');
    inp.value = raw.length > 0 ? raw.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : '';
}

// ─── appendThreeZeros ─────────────────────────────────────────────────
// "000" button: mavjud songa 3ta nol qo'shadi
function appendThreeZeros() {
    var inp = document.getElementById('load-cash-input');
    if (!inp) return;
    var raw = inp.value.replace(/\D/g, '') + '000';
    inp.value = raw.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    inp.focus();
}

// ─── clearLoadCashTonna ─────────────────────────────────────────────────
function clearLoadCashTonna() {
    var inp = document.getElementById('load-cash-tonna');
    if (inp) { inp.value = ''; inp.focus(); }
}

// ─── submitLoadCash ─────────────────────────────────────────────────
function submitLoadCash() {
    var input = document.getElementById("load-cash-input");
    if (!input) return;

    var raw = input.value.replace(/\D/g, '');

    if (!raw) {
        app.ShowPopup("Summa bo'sh bo'la olmaydi");
        return;
    }

    // Tonna inputni tekshirish
    var tonnaInp = document.getElementById('load-cash-tonna');
    var tonnaRaw = tonnaInp ? tonnaInp.value.trim().replace(',', '.') : '';
    var tonnaVal = parseFloat(tonnaRaw);

    var finalValue;
    if (tonnaRaw !== '' && !isNaN(tonnaVal) && tonnaVal > 0) {
        // kg/so'm * tonna * 1000 = umumiy so'm
        finalValue = String(Math.round(parseFloat(raw) * tonnaVal * 1000));
    } else {
        finalValue = raw;
    }

    if (typeof addPresetFromPanel === 'function') {
        addPresetFromPanel('load_cash', finalValue);
    } else {
        navigator.clipboard.writeText(finalValue);
        app.ShowPopup(finalValue + " nusxa olindi");
    }

    input.value = "";
    if (tonnaInp) tonnaInp.value = "";

    var btns = document.getElementById("load-cash-btns");
    var icon = document.getElementById("load-cash-icon");
    if (btns) btns.classList.remove("active");
    if (icon) icon.classList.remove("active");
}

// ─── toggleTime ─────────────────────────────────────────────────────────────
// Icon click: Faqat time row ochiladi (boshqalar yopiladi).
function toggleTime() {
    var icon = document.getElementById('time-icon');
    var btns = document.getElementById('time-btns');

    if (!icon || !btns) return;

    var wasActive = btns.classList.contains('active');

    for (var i = 0; i < _rowConfig.length; i++) {
        closeRow(i);
    }
    closeAllInputRows();

    if (!wasActive) {
        btns.classList.add('active');
        icon.classList.add('active');

        showPanelOverlay();

        var input = document.getElementById('time-input');
        if (input) {
            setTimeout(function() { input.focus(); input.select(); }, 100);
        }
    }

    var panel = document.getElementById('bottom-panel');
    if (panel) panel.classList.remove('panel-collapsed');

    if (!wasActive && typeof openPresetForRow === 'function') {
        openPresetForRow('time');
    }
}

// ─── submitTime ──────────────────────────────────────────────────────────────
// 'kun' | 'soat' | 'minut' button bosilganda chaqiriladi.
// n=1: '1 day' / '1 hour' / '1 minut', n>1: 'n days' / 'n hours' / 'n minutes'
function submitTime(type) {
    var input = document.getElementById('time-input');
    if (!input) return;

    var n = parseInt(input.value.trim(), 10);

    if (isNaN(n) || n <= 0) {
        app.ShowPopup('Son kiriting (musbat)');
        return;
    }

    var value;
    if (type === 'kun') {
        value = n === 1 ? '1 day' : n + ' days';
    } else if (type === 'soat') {
        value = n === 1 ? '1 hour' : n + ' hours';
    } else if (type === 'minut') {
        value = n === 1 ? '1 minut' : n + ' minutes';
    } else {
        return;
    }

    if (typeof addPresetFromPanel === 'function') {
        addPresetFromPanel('time', value);
    } else {
        navigator.clipboard.writeText(value);
        app.ShowPopup(value + ' nusxa olindi');
    }

    input.value = '';

    var btnsEl = document.getElementById('time-btns');
    var iconEl = document.getElementById('time-icon');
    if (btnsEl) btnsEl.classList.remove('active');
    if (iconEl) iconEl.classList.remove('active');
}

// ─── toggleClosed ─────────────────────────────────────────────────────────────
var _closedState = 'open'; // 'open' | 'closed'

function toggleClosed() {
    _closedState = _closedState === 'open' ? 'closed' : 'open';

    var el  = document.getElementById('closed-toggle');
    var elP = document.getElementById('closed-toggle-preset');
    if (el)  el.setAttribute('data-state',  _closedState);
    if (elP) elP.setAttribute('data-state', _closedState);

    var value = _closedState === 'open' ? 'OPEN' : 'CLOSED';
    if (typeof addPresetFromPanel === 'function') {
        addPresetFromPanel('closed', value);
    }
}

// ─── toggleRole3 ──────────────────────────────────────────────────────────────
// Icon click: Faqat role row ochiladi (boshqalar yopiladi)
function toggleRole3() {
    _currentActiveRow = 0;  // role = index 0 (new order)

    // Input rowlarni avval yopamiz (name va kelajakdagi input iconlar)
    closeAllInputRows();

    // FAQAT BOSHQA row-larni close qil (role-ni yopma!)
    for (var i = 0; i < _rowConfig.length; i++) {
        if (i !== _currentActiveRow) {
            closeRow(i);
        }
    }
    
    // Aktif row-ni open qil
    openRow(_currentActiveRow);
    
    // Panel ochiq
    var panel = document.getElementById("bottom-panel");
    if (panel) panel.classList.remove("panel-collapsed");
    
    // Preset filter
    if (typeof openPresetForRow === 'function') {
        openPresetForRow(_rowConfig[_currentActiveRow].type);
    }
}

// ─── GetRole ───────────────────────────────────────────────────────────────────
function GetRole(role) {
    // Preset-ga qo'shish (clipboard o'rniga)
    if (typeof addPresetFromPanel === 'function') {
        addPresetFromPanel('role', role);
    } else {
        navigator.clipboard.writeText(role);
        app.ShowPopup(role + " nusxa olindi");
    }
    return role;
}

// ─── Animatsiya: YASHIRISH (o'ngdan chapga, ketma-ket) ───────────────────────
// CSS @keyframes "btnSlideOut" ishlatiladi — faqat "to" qismi bor,
// shuning uchun "from" = elementning hozirgi tabiiy holati (translateX 0, opacity 1).
// animation-fill-mode: both → animatsiya tugagach TO holatida qoladi.
function _animateHide(btns) {
    var DUR     = 220;   // ms, bir buttoning animatsiya davomiyligi
    var STAGGER = 60;    // ms, qo'shni buttonlar orasidagi farq
    var total   = DUR + (btns.length - 1) * STAGGER + 40;

    for (var i = 0; i < btns.length; i++) {
        (function(btn, idx) {
            // O'ng button birinchi ketadi (delay = 0),
            // chap button oxirida ketadi (delay = STAGGER × (n-1))
            var delay = (btns.length - 1 - idx) * STAGGER;
            btn.style.pointerEvents = "none";
            btn.style.animation =
                "btnSlideOut " + DUR + "ms " + delay + "ms ease-in both";
        })(btns[i], i);
    }

    // Animatsiya tamom: visibility:hidden qo'yamiz (joyi saqlanadi, click yo'q)
    //                  animation tozalanadi (hover effekt ishlashi uchun)
    setTimeout(function() {
        for (var i = 0; i < btns.length; i++) {
            btns[i].style.visibility = "hidden";
            btns[i].style.animation  = "";
        }
    }, total);
}

// ─── Animatsiya: KO'RSATISH (chapdan o'ngga, ketma-ket) ─────────────────────
// CSS @keyframes "btnSlideIn" ishlatiladi — faqat "from" qismi bor,
// shuning uchun "to" = elementning tabiiy holati (translateX 0, opacity 1).
// animation-fill-mode: both → animatsiya boshlanishidan oldin FROM holatida turadi
// (ya'ni button hali ham ko'rinmaydi, flash yo'q).
function _animateShow(btns) {
    var DUR     = 260;
    var STAGGER = 60;
    var total   = DUR + (btns.length - 1) * STAGGER + 40;

    for (var i = 0; i < btns.length; i++) {
        (function(btn, idx) {
            // Chap button birinchi keladi (delay = 0),
            // o'ng button oxirida keladi
            var delay = idx * STAGGER;
            btn.style.visibility    = "";           // ko'rsatamiz
            btn.style.pointerEvents = "";
            btn.style.animation =
                "btnSlideIn " + DUR + "ms " + delay + "ms ease-out both";
        })(btns[i], i);
    }

    // Animatsiya tamom: animation tozalanadi (hover effekt ishlashi uchun)
    setTimeout(function() {
        for (var i = 0; i < btns.length; i++) {
            btns[i].style.animation = "";
        }
    }, total);
}

// ─── INITIALIZATION ──────────────────────────────────────────────────────────
// Initialize panel in unselected state (no rows open, overlay hidden, preset hidden)
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        // Hide overlay initially (unselected state)
        hidePanelOverlay();
        
        // Hide preset panel
        _hidePresetPanel();
        
        // Ensure all rows are closed
        for (var i = 0; i < _rowConfig.length; i++) {
            var config = _rowConfig[i];
            var icon = document.getElementById(config.icon);
            var btnsContainer = document.getElementById(config.btns);
            
            if (icon) icon.classList.remove("active");
            if (btnsContainer) btnsContainer.classList.remove("active");
        }
        
        console.log("Panel initialized in unselected state");
    }, 200);
});
