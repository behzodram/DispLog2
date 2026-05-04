class AnorScript extends HTMLElement {

    static scriptMap = null;
    static isReady = false;

    connectedCallback() {
        let fileName = this.getAttribute("src");

        if (!fileName) return;

        let map = this.getScriptMap();
        let results = map[fileName] || [];

        if (results.length === 0) {
            console.warn("Script not found:", fileName);
            return;
        }

        if (results.length > 1) {
            app.ShowPopup("Duplicate script: " + fileName);
            console.warn(results);
        }

        let fullPath = results[0];

        // 🔥 SEN AYTGAN ASOSIY QISM
        app.Script(fullPath, true);
    }

    // 🔥 CACHE SYSTEM (1 TIME SCAN)
    getScriptMap() {

        if (AnorScript.isReady && AnorScript.scriptMap) {
            return AnorScript.scriptMap;
        }

        let cacheFile = "cache/anor_script_cache.json";
        let map = {};
        let needScan = true;

        try {
            if (app.FileExists(cacheFile)) {
                let data = JSON.parse(app.ReadFile(cacheFile));

                if (data && data.map) {
                    map = data.map;
                    needScan = true; // 1 marta update scan
                }
            }
        } catch (e) {
            needScan = true;
        }

        if (needScan) {
            map = {};
            this.scanFolder("", map);

            app.WriteFile(cacheFile, JSON.stringify({
                scanned: true,
                map: map
            }, null, 4));
        }

        AnorScript.scriptMap = map;
        AnorScript.isReady = true;

        return map;
    }

    // 🔍 SCAN (faqat .js filelar)
    scanFolder(path, map) {
        try {
            let list = app.ListFolder(path);

            list.forEach(item => {

                let fullPath = path ? path + "/" + item : item;

                if (app.IsFolder(fullPath)) {
                    this.scanFolder(fullPath, map);
                } else {

                    if (!item.endsWith(".js")) return;

                    if (!map[item]) {
                        map[item] = [];
                    }

                    map[item].push(fullPath);
                }
            });

        } catch (e) {}
    }
}

// 🔒 REGISTER
if (!customElements.get("anor-script")) {
    customElements.define("anor-script", AnorScript);
}

// 🌍 GLOBAL SCRIPT LOADER
window.ANOR_BOOT_QUEUE = window.ANOR_BOOT_QUEUE || [];
window.ANOR_READY = false;

window.anorLoadScript = function(fileName) {

    // ❗ agar hali init bo‘lmasa → queue ga qo‘shamiz
    if (!window.ANOR_READY) {
        window.ANOR_BOOT_QUEUE.push(fileName);
        return;
    }

    _anorRunScript(fileName);
};

function _anorRunScript(fileName) {

    let map = AnorScript.prototype.getScriptMap();

    let results = map[fileName]
        ? [...new Set(map[fileName])]
        : [];

    if (results.length === 0) {
        console.warn("Script not found:", fileName);
        return;
    }

    let fullPath = results[0];

    window.ANOR_LOADED = window.ANOR_LOADED || new Set();

    if (ANOR_LOADED.has(fullPath)) return;

    ANOR_LOADED.add(fullPath);

    app.Script(fullPath, true);
}

window.ANOR_READY = true;

// 🔥 queue ni flush qilish
if (window.ANOR_BOOT_QUEUE && window.ANOR_BOOT_QUEUE.length) {

    window.ANOR_BOOT_QUEUE.forEach(file => {
        _anorRunScript(file);
    });

    window.ANOR_BOOT_QUEUE = [];
}