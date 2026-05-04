
/* ════════════════════════════════════════════════════════════════════════════════
   PASTE PANEL — Preset argument combinations management
   ════════════════════════════════════════════════════════════════════════════════ */

// Global storage for paste presets
var pastePresets = [];
var _pastePanelVisible = false;
var _pasteCurrentSources = []; // Track current sources being added
var _pasteClipboardValues = {}; // Store clipboard values for each source: {contact: '99-111-22-33', role: 'DRIVER', ...}
var _pasteTempCloseTimer = null;
var _presetTempCloseTimer = null; // Timer for preset panel auto-hide
var _activePresetSource = null;  // Currently active source type for preset filtering

/**
 * Toggle paste panel open/closed
 */
function togglePastePanel() {
    var panel = document.getElementById("paste-panel");
    if (!panel) return;
    
    _pastePanelVisible = !_pastePanelVisible;
    
    if (_pastePanelVisible) {
        panel.classList.remove("paste-panel-collapsed");
        panel.classList.add("paste-panel-expanded");
    } else {
        panel.classList.remove("paste-panel-expanded");
        panel.classList.add("paste-panel-collapsed");
        _pasteCurrentSources = []; // Clear sources on close
    }
}

function showPastePanelTemporary(duration) {
    var panel = document.getElementById("paste-panel");
    if (!panel) return;
    
    clearTimeout(_pasteTempCloseTimer);
    panel.classList.remove("paste-panel-collapsed");
    panel.classList.add("paste-panel-expanded");
    _pastePanelVisible = true;

    _pasteTempCloseTimer = setTimeout(function() {
        panel.classList.remove("paste-panel-expanded");
        panel.classList.add("paste-panel-collapsed");
        _pastePanelVisible = false;
        _pasteCurrentSources = []; // clear selection after temporary close
    }, duration || 30000);
}

function hidePastePanel() {
    var panel = document.getElementById("paste-panel");
    if (!panel) return;
    clearTimeout(_pasteTempCloseTimer);
    panel.classList.remove("paste-panel-expanded");
    panel.classList.add("paste-panel-collapsed");
    _pastePanelVisible = false;
    _pasteCurrentSources = [];
}

/**
 * Add preset from bottom panel button click
 * Called when user selects item from car/contact/location/role buttons
 * Adds item to preset and copies to clipboard
 * @param {String} sourceType - 'car', 'contact', 'location', 'role'
 * @param {String} value - The value to add
 */
function addPresetFromPanel(sourceType, value, meta) {
    if (!sourceType || !value) {
        app.ShowPopup("Xato: source yoki value yo'q");
        return;
    }
    
    // Copy to clipboard first
    try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(value).catch(function() {
                _fallbackCopyFromPreset(value);
            });
        } else {
            _fallbackCopyFromPreset(value);
        }
    } catch(e) {
        _fallbackCopyFromPreset(value);
    }
    
    // Create preset with this single value
    var presetId = "paste-preset-" + Date.now();
    var preset = {
        id: presetId,
        sources: [sourceType],
        values: {},
        meta: meta || {}
    };
    preset.values[sourceType] = value;
    
    pastePresets.push(preset);
    renderPastePresets();
    if (typeof _updateStartIcon === 'function') _updateStartIcon();
    
    // Show preset panel with item (30 sec or until close button pressed)
    showPresetPanelTemporary();
}

/**
 * Fallback copy to clipboard for preset panel
 */
function _fallbackCopyFromPreset(text) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.style.cssText = "position:fixed;top:0;left:0;opacity:0;font-size:12px";
    document.body.appendChild(ta);
    ta.focus(); ta.select();
    try { document.execCommand("copy"); } catch(e) {}
    document.body.removeChild(ta);
}

/**
 * Add a source (contact, role, location, car) to current selection
 * Captures clipboard value for that source type
 */
function addSourceToPaste(sourceType) {
    if (_pasteCurrentSources.length >= 6) {
        app.ShowPopup("Maksimum 6ta manba qabul qilish mumkin");
        return;
    }
    
    // Avoid duplicates
    if (_pasteCurrentSources.includes(sourceType)) {
        app.ShowPopup(sourceType + " allaqachon qo'shilgan");
        return;
    }
    
    // Capture clipboard value for this source type
    var clipValue = app.GetClipboardText() || "";
    if (!clipValue) {
        app.ShowPopup("Clipboard bo'sh. Avval qiymat copy qiling!");
        return;
    }
    
    _pasteClipboardValues[sourceType] = clipValue;
    _pasteCurrentSources.push(sourceType);
    
    // app.ShowPopup(sourceType + ": '" + clipValue + "' qabul qilindi");
    
    createPastePresetButton(_pasteCurrentSources.slice(), JSON.parse(JSON.stringify(_pasteClipboardValues)));
}

/**
 * Create a new preset button with selected sources
 * @param {Array} sources - Array of source types: ['contact', 'role', 'location', 'car']
 * @param {Object} clipboardValues - Clipboard values for each source type
 */
function createPastePresetButton(sources, clipboardValues) {
    var presetId = "paste-preset-" + Date.now();
    var preset = {
        id: presetId,
        sources: sources,
        values: clipboardValues || {} // Store captured clipboard values
    };
    
    pastePresets.push(preset);
    renderPastePresets();
}

/**
 * Render all paste preset buttons
 */
function renderPastePresets() {
    var presetsContainer = document.getElementById("paste-presets");
    if (!presetsContainer) return;
    
    presetsContainer.innerHTML = "";
    
    for (var i = 0; i < pastePresets.length; i++) {
        var preset = pastePresets[i];
        var btn = document.createElement("div");
        btn.className = "paste-preset-btn";
        
        // Build content: icons and label with values
        var content = document.createElement("div");
        content.className = "paste-preset-content";
        
        // Add source icons
        for (var j = 0; j < preset.sources.length; j++) {
            var source = preset.sources[j];
            var icon = document.createElement("img");
            icon.className = "paste-preset-icon";
            
            if (source === 'name') icon.src = "./images/pp_name.png";
            else if (source === 'load_cash') icon.src = "./images/pp_load-cash.png";
            else if (source === 'contact') icon.src = "./images/pp_contact3.png";
            else if (source === 'role') icon.src = "./images/pp_Role3.png";
            else if (source === 'location') icon.src = "./images/pp_location3.png";
            else if (source === 'car') icon.src = "./images/pp_CarType3.png";
            else if (source === 'matni') icon.src = "./images/pp_matni.png";
            else if (source === 'weight') icon.src = "./images/pp_weight.png";
            else if (source === 'tuman') icon.src = "./images/pp_tuman-loc.png";
            else if (source === 'type17') icon.src = "./images/pp_type17.png";
            else if (source === 'load_cash') icon.src = "./images/pp_load-cash.png";
            else if (source === 'closed')    icon.src = "./images/pp_closed.png";
            
            content.appendChild(icon);
        }
        
        // Add label with clipboard values
        var label = document.createElement("span");
        label.className = "paste-preset-label";
        
        // Build value string: show clipboard values for each source
        var valueStrings = [];
        for (var j = 0; j < preset.sources.length; j++) {
            var source = preset.sources[j];
            var value = preset.values[source] || "--";
            valueStrings.push(value);
        }
        label.textContent = valueStrings.join(" + ");
        label.title = valueStrings.join(" + "); // Tooltip with full values
        
        content.appendChild(label);
        
        btn.appendChild(content);
        
        // Add click handler to paste values
        (function(presetId) {
            btn.onclick = function() { executePastePreset(presetId); };
        })(preset.id);
        
        // Add Call_SQL icon for contact presets that came from DB
        if (preset.sources.indexOf('contact') !== -1 && preset.meta && preset.meta.fromDB) {
            var dbIcon = document.createElement('img');
            dbIcon.src = './images/Call_SQL.png';
            dbIcon.className = 'paste-preset-db-icon';
            dbIcon.title = 'Bazadan olindi';
            dbIcon.onclick = function(e) { e.stopPropagation(); };
            btn.appendChild(dbIcon);
        }

        // Add remove button
        var removeBtn = document.createElement("button");
        removeBtn.className = "paste-preset-remove";
        removeBtn.textContent = "×";
        (function(presetId) {
            removeBtn.onclick = function(e) { 
                e.stopPropagation();
                removePastePreset(presetId);
            };
        })(preset.id);
        btn.appendChild(removeBtn);
        
        presetsContainer.appendChild(btn);
    }
    
    _pasteCurrentSources = []; // Clear after rendering
}

/**
 * Execute a paste preset — populate form with stored clipboard values
 */
function executePastePreset(presetId) {
    var preset = pastePresets.find(function(p) { return p.id === presetId; });
    if (!preset) return;
    
    var values = preset.values;
    var setCount = 0;
    
    // Populate form fields based on sources and their stored values
    for (var i = 0; i < preset.sources.length; i++) {
        var source = preset.sources[i];
        var value = values[source] || "";
        var elem = null;
        
        if (source === 'name') {
            elem = document.getElementById("nameInput");
        } else if (source === 'contact') {
            elem = document.getElementById("phoneInput");
        } else if (source === 'role') {
            elem = document.getElementById("roleInput");
        } else if (source === 'location') {
            elem = document.getElementById("phoneUpdateName");
        } else if (source === 'car') {
            elem = document.getElementById("nameInput");
        }
        
        // Safely set value only if element exists
        if (elem) {
            elem.value = value;
            setCount++;
        }
    }
    
    if (setCount > 0) {
        app.ShowPopup("Qiymatlar qo'shildi: " + Object.values(values).join(" + "));
    } else {
        app.ShowPopup("Elementlar topilmadi. Form bo'sh bo'lishi mumkin.");
    }
}

/**
 * Remove a paste preset button
 */
function removePastePreset(presetId) {
    pastePresets = pastePresets.filter(function(p) { return p.id !== presetId; });
    renderPastePresets();
    if (typeof _updateStartIcon === 'function') _updateStartIcon();
    app.ShowPopup("Preset o'chirildi");
}

/**
 * Clear all paste presets at once
 */
function clearAllPresets() {
    if (pastePresets.length === 0) {
        app.ShowPopup("O'chadigan preset yo'q");
        return;
    }
    
    pastePresets = [];
    _pasteCurrentSources = [];
    _pasteClipboardValues = {};
    renderPastePresets();
    if (typeof _updateStartIcon === 'function') _updateStartIcon();
    app.ShowPopup("Barcha presetlar tozalandi");
}

/**
 * Show preset panel temporarily for 3 seconds (called from copy button)
 */
function showPresetPanelTemporary(duration) {
    var panel = document.getElementById("preset-panel");
    if (!panel) return;
    
    clearTimeout(_presetTempCloseTimer);
    
    // Show panel
    panel.style.display = "block";
    panel.style.opacity = "1";
    panel.style.visibility = "visible";
    
    // Auto-hide after duration
    _presetTempCloseTimer = setTimeout(function() {
        hidePresetPanel();
    }, duration || 30000);
}

/**
 * Hide preset panel immediately
 */
function hidePresetPanel() {
    var panel = document.getElementById("preset-panel");
    if (!panel) return;
    
    clearTimeout(_presetTempCloseTimer);
    panel.style.display = "none";
    panel.style.opacity = "0";
    panel.style.visibility = "hidden";
    
    // Also hide overlay if all rows are closed
    if (typeof hidePanelOverlay === 'function') {
        hidePanelOverlay();
    }
}

/**
 * Open preset panel for a specific bottom panel row
 * Filters and shows only matching source icons
 * @param {String} rowType - 'car', 'contact', 'location', or 'role'
 */
function openPresetForRow(rowType) {
    var panel = document.getElementById("preset-panel");
    if (!panel) return;
    
    // Set active source for filtering
    _activePresetSource = rowType;
    
    // Show panel
    panel.style.display = "block";
    panel.style.opacity = "1";
    panel.style.visibility = "visible";
    
    // Filter paste source icons - only show matching type
    var sourceIcons = document.querySelectorAll(".paste-source-icon");
    sourceIcons.forEach(function(icon) {
        var sourceType = null;
        if (icon.src.includes("pp_CarType3.png")) sourceType = 'car';
        else if (icon.src.includes("pp_contact3.png")) sourceType = 'contact';
        else if (icon.src.includes("pp_location3.png")) sourceType = 'location';
        else if (icon.src.includes("pp_Role3.png")) sourceType = 'role';
        else if (icon.src.includes("pp_name.png")) sourceType = 'name';
        else if (icon.src.includes("pp_load-cash.png")) sourceType = 'load_cash';
        else if (icon.src.includes("pp_matni.png")) sourceType = 'matni';
        else if (icon.src.includes("pp_weight.png")) sourceType = 'weight';
        else if (icon.src.includes("pp_tuman-loc.png")) sourceType = 'tuman';
        else if (icon.src.includes("pp_type17.png")) sourceType = 'type17';
        
        if (sourceType === rowType) {
            // SELECTABLE
            icon.style.opacity = "1";
            icon.style.pointerEvents = "auto";
            icon.style.cursor = "pointer";
            icon.title = "Clipboard-dan qiymat olish";
        } else {
            // UNSELECTABLE
            icon.style.opacity = "0.3";
            icon.style.pointerEvents = "none";
            icon.style.cursor = "default";
            icon.title = "";
        }
    });
    
    // Reattach click handlers to source icons (for clipboard pickup)
    setupPresetSourceClickHandlers();
}

/**
 * Setup click handlers for preset source icons
 * Picks value from clipboard for that source type
 */
function setupPresetSourceClickHandlers() {
    var sourceIcons = document.querySelectorAll(".paste-source-icon");
    sourceIcons.forEach(function(icon) {
        // Remove old click handler (if any)
        var newIcon = icon.cloneNode(true);
        icon.parentNode.replaceChild(newIcon, icon);
        
        // Attach new click handler
        newIcon.onclick = function(e) {
            e.stopPropagation();
            
            // Determine source type from image
            var sourceType = null;
            if (newIcon.src.includes("pp_name.png")) sourceType = 'name';
            else if (newIcon.src.includes("pp_load-cash.png")) sourceType = 'load_cash';
            else if (newIcon.src.includes("pp_matni.png")) sourceType = 'matni';
            else if (newIcon.src.includes("pp_weight.png")) sourceType = 'weight';
            else if (newIcon.src.includes("pp_tuman-loc.png")) sourceType = 'tuman';
            else if (newIcon.src.includes("pp_type17.png")) sourceType = 'type17';
            else if (newIcon.src.includes("pp_CarType3.png")) sourceType = 'car';
            else if (newIcon.src.includes("pp_contact3.png")) sourceType = 'contact';
            else if (newIcon.src.includes("pp_location3.png")) sourceType = 'location';
            else if (newIcon.src.includes("pp_Role3.png")) sourceType = 'role';
            
            // Check if this source is currently selectable
            if (sourceType !== _activePresetSource) {
                app.ShowPopup("Bu source hozir selectable emas");
                return;
            }
            
            // Get clipboard value
            var clipValue = app.GetClipboardText() || "";
            if (!clipValue) {
                app.ShowPopup("Clipboard bo'sh. Avval qiymat copy qiling!");
                return;
            }
            
            // Create single-source preset with clipboard value
            var presetId = "paste-preset-" + Date.now();
            var preset = {
                id: presetId,
                sources: [sourceType],
                values: {}
            };
            preset.values[sourceType] = clipValue;
            
            pastePresets.push(preset);
            renderPastePresets();
            
            app.ShowPopup(sourceType + ": '" + clipValue + "' presetga qo'shildi");
        };
    });
}

/**
 * Initialize preset panel event handlers (called when DOM ready)
 */
function initPresetPanel() {
    // Find and setup copy button handler
    var copyBtn = document.querySelector('img[src="./images/copy.png"]');
    if (copyBtn) {
        copyBtn.onclick = function(e) {
            e.stopPropagation();
            if (typeof toggleBothPanels === 'function') {
                toggleBothPanels();
            } else {
                showPresetPanelTemporary(30000);
            }
        };
    }
    
    // Hide preset panel by default
    var panel = document.getElementById("preset-panel");
    if (panel) {
        panel.style.display = "none";
        panel.style.opacity = "0";
        panel.style.visibility = "hidden";
        panel.style.transition = "opacity 0.3s ease";
    }
}

/**
 * Validator natijasiga qarab start-icon rangini yangilaydi.
 * addPresetFromPanel / removePastePreset / clearAllPresets dan chaqiriladi.
 */
function _updateStartIcon() {
    var icon = document.getElementById('start-icon');
    if (!icon) return;

    var ready = false;

    if (_activeFunctionName && typeof functionSignatures !== 'undefined') {
        var sig = functionSignatures[_activeFunctionName];
        if (sig && sig.validator && typeof pastePresets !== 'undefined') {
            // collectedData ni universal_exec.js dagi kabi quramiz
            var collectedData = { contact: [], role: [], location: [], car: [], name: [], matni: [], weight: [], tuman: [], type17: [], load_cash: [], closed: [] };
            for (var i = 0; i < pastePresets.length; i++) {
                var src = pastePresets[i].sources[0];
                var val = pastePresets[i].values[src];
                if (val && collectedData[src]) collectedData[src].push(val);
            }
            ready = sig.validator(collectedData);
        }
    }

    if (ready) {
        icon.classList.remove('start-icon-dim');
        icon.classList.add('start-icon-ready');
        icon.style.filter = 'drop-shadow(0 0 6px #4adf80) brightness(0.97)';
        icon.style.opacity = '1';
    } else {
        icon.classList.remove('start-icon-ready');
        icon.classList.add('start-icon-dim');
        icon.style.filter = '';
        icon.style.opacity = '0.35';
    }
}

/**
 * EXAMPLE: How to use INSERT_USER with paste presets
 * 
 * // Create a preset with: phone, role, location
 * createPastePresetButton(['contact', 'role', 'location']);
 * 
 * // When user clicks the preset button, executePastePreset() fills forms:
 * // phoneInput = "99-111-22-33"
 * // roleInput = "DRIVER"
 * // phoneUpdateName = "FABJ"
 * 
 * // Then call your function:
 * function INSERT_USER(phone, role, from_loc, to_loc, vehicle) {
 *     phone = FormatPhonePretty(phone);
 *     if (policyPhone(phone) === false) return;
 *     
 *     db.ExecuteSql(
 *         queries["INSERT_USER"],
 *         [phone, role, from_loc, to_loc, vehicle], 
 *         onUpdateSuccess, 
 *         onUpdateError
 *     );
 *     
 *     return [phone, role];
 * }
 * 
 * // Usage: Call with filled form values
 * INSERT_USER(
 *     document.getElementById("phoneInput").value,      // phone
 *     document.getElementById("roleInput").value,       // role
 *     document.getElementById("phoneUpdateName").value, // from_loc
 *     document.getElementById("nameInput").value,       // to_loc (example)
 *     "FURA"                                            // vehicle
 * );
 */
