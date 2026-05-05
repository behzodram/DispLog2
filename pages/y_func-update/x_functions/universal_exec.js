/* ════════════════════════════════════════════════════════════════════════════════
   UNIVERSAL FUNCTION EXECUTOR SYSTEM
   Support: INSERT, UPDATE, DELETE, SELECT - barcha query type uchun
   
   Hozircha: INSERT_USER_PRFTV funksiyasi uchun configured
════════════════════════════════════════════════════════════════════════════════ */

/**
 * FUNCTION SIGNATURES MAP
 * Har bir funksiya uchun meta-ma'lumot: args va sources
 */
app.Script("pages/y_func-update/x_functions/func_sign.js", true);
// functionSignatures global object that contains 
// metadata for each function

/**
 * UNIVERSAL EXECUTOR
 * Har qanday funksiyani universal ishlata oladi
 */
function executeUniversalFunction(functionName) {
    var sig = functionSignatures[functionName];
    if (!sig) {
        app.ShowPopup("❌ Funksiya topilmadi: " + functionName);
        return;
    }
    
    // 1. PASTE PRESETS dan ma'lumot to'pla
    var collectedData = {
        contact: [],
        role: [],
        location: [],
        car: [],
        name: [],

        matni: [],
        weight: [],
        tuman: [],
        type17: [],
        load_cash: [],
        closed: [],
        time: []
    };
    
    // Hozirda pastePresets bo'lmasa, xato
    if (!pastePresets || pastePresets.length === 0) {
        app.ShowPopup("❌ Paste presets bo'sh!\n\nAvval paste paneldan ma'lumot qo'shing");
        return;
    }
    
    for (var i = 0; i < pastePresets.length; i++) {
        var preset = pastePresets[i];
        var source = preset.sources[0];  // Har presetda 1 ta source
        var value = preset.values[source];
        
        if (value && collectedData[source]) {
            collectedData[source].push(value);
        }
    }
    
    // 2. VALIDATION
    if (sig.validator && !sig.validator(collectedData)) {
        app.ShowPopup("❌ Elementlar iconlar soniga mos emas");
        return;
    }
    
    // 3. ARGUMENTS NI MAPI
    var args = [];
    var locationIndex = 0;
    var contactIndex = 0;
    var roleIndex = 0;
    var carIndex = 0;
    var nameIndex = 0;
    var matniIndex = 0;
    var weightIndex = 0;
    var tumanIndex = 0;
    var type17Index = 0;
    var loadCashIndex = 0;
    var closedIndex = 0;
    var timeIndex = 0;
    for (var j = 0; j < sig.sources.length; j++) {
        var sourceType = sig.sources[j];
        var value = "";
        
        if (sourceType === 'contact') {
            value = collectedData.contact[contactIndex] || "";
            contactIndex++;
        } else if (sourceType === 'role') {
            value = collectedData.role[roleIndex] || "";
            roleIndex++;
        } else if (sourceType === 'location') {
            value = collectedData.location[locationIndex] || "";
            locationIndex++;
        } else if (sourceType === 'car') {
            value = collectedData.car[carIndex] || "";
            carIndex++;
        } else if (sourceType === 'name') {
            value = collectedData.name[nameIndex] || "";
            nameIndex++;
        } else if (sourceType === 'matni') {
            value = collectedData.matni[matniIndex] || "";
            matniIndex++;
        } else if (sourceType === 'weight') {
            value = collectedData.weight[weightIndex] || "";
            weightIndex++;
        } else if (sourceType === 'tuman') {
            value = collectedData.tuman[tumanIndex] || "";
            tumanIndex++;
        } else if (sourceType === 'type17') {
            value = collectedData.type17[type17Index] || "";
            type17Index++;
        } else if (sourceType === 'load_cash') {
            value = collectedData.load_cash[loadCashIndex] || "";
            loadCashIndex++;
        } else if (sourceType === 'closed') {
            value = collectedData.closed[closedIndex] || "";
            closedIndex++;
        } else if (sourceType === 'time') {
            value = collectedData.time[timeIndex] || "";
            timeIndex++;
        } else if (sourceType === null) {
            // User qo'lda kiritadi
            value = prompt("Qiymatni kiriting: " + sig.args[j]);
            if (value === null) {
                app.ShowPopup("Bekor qilindi");
                return;
            }
        }
        
        args.push(value);
    }
    
    // 4. CONFIRMATION DIALOG
    var confirmMsg = "✓ " + sig.type + " - " + sig.description + "\n\n";
    for (var k = 0; k < sig.args.length; k++) {
        confirmMsg += sig.args[k] + " = " + args[k] + "\n";
    }
    confirmMsg += "\nTasdiqlash?";
    
    if (!confirm(confirmMsg)) {
        app.ShowPopup("Bekor qilindi");
        return;
    }
    
    // 5. FUNKSIYANI CHAQIR
    try {
        window[functionName](...args);
        app.ShowPopup("✅ " + functionName + " muvaffaqiyatli bajarildi!");
        
        // Paste presets ni tozala (optional)
        // pastePresets = [];
        
    } catch(e) {
        app.ShowPopup("❌ Xato: " + e.message);
    }
}

/**
 * DEBUG: Hozirda active bo'lgan presets ni ko'rsatish
 */
function debugShowPresets() {
    if (!pastePresets || pastePresets.length === 0) {
        app.ShowPopup("Paste presets bo'sh");
        return;
    }
    
    var msg = "📋 Paste Presets (" + pastePresets.length + " ta):\n\n";
    for (var i = 0; i < pastePresets.length; i++) {
        var p = pastePresets[i];
        var source = p.sources[0];
        var value = p.values[source];
        msg += (i+1) + ". " + source.toUpperCase() + " = '" + value + "'\n";
    }
    app.ShowPopup(msg);
}
