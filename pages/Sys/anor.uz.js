class AnorUz extends HTMLElement {

    static fileMap = null;     // memory cache
    static isReady = false;    // 1-time scan guard

    connectedCallback() {
        let fileName = this.getAttribute("src");

        if (!fileName) {
            this.innerHTML = "Fayl ko‘rsatilmagan";
            return;
        }

        let map = this.getFileMap();
        let results = map[fileName] || [];

        if (results.length === 0) {
            this.innerHTML = "Fayl topilmadi: " + fileName;
            return;
        }

        if (results.length > 1) {
            app.ShowPopup("Duplicate file: " + fileName);
        }

        let html = app.ReadFile(results[0]);

        let wrapper = document.createElement("div");
        wrapper.innerHTML = html;

        this.appendChild(wrapper);
        this.runScripts(wrapper);
    }

    // 🔥 MAIN CACHE CONTROLLER
    getFileMap() {

        // ⚡ agar allaqachon memoryda bo‘lsa
        if (AnorUz.isReady && AnorUz.fileMap) {
            return AnorUz.fileMap;
        }

        let cacheFile = "cache/anor_cache.json";
        let map = {};

        let needFullScan = true;

        // 🔍 cache bor-yo‘qligini tekshiramiz
        try {
            if (app.FileExists(cacheFile)) {
                let data = JSON.parse(app.ReadFile(cacheFile));

                if (data && data.map) {
                    map = data.map;
                    needFullScan = true; // ⚠️ update scan baribir qilamiz (sen so‘ragan)
                }
            }
        } catch (e) {
            needFullScan = true;
        }

        // 🔥 FAQAT 1 MARTA SCAN
        if (needFullScan) {
            map = {};
            this.scanFolder("", map);

            app.WriteFile(cacheFile, JSON.stringify({
                scanned: true,
                map: map
            }, null, 4));
        }

        // 🧠 memoryga saqlab qo‘yamiz
        AnorUz.fileMap = map;
        AnorUz.isReady = true;

        return map;
    }

    // 🔍 FULL SCAN
    scanFolder(path, map) {
        try {
            let list = app.ListFolder(path);

            list.forEach(item => {
                let fullPath = path ? path + "/" + item : item;

                if (app.IsFolder(fullPath)) {
                    this.scanFolder(fullPath, map);
                } else {

                    if (!map[item]) {
                        map[item] = [];
                    }

                    map[item].push(fullPath);
                }
            });

        } catch (e) {}
    }

    runScripts(scope) {
        let scripts = scope.querySelectorAll("script");

        scripts.forEach(s => {
            let n = document.createElement("script");

            if (s.src) n.src = s.src;
            else n.text = s.textContent;

            document.body.appendChild(n);
        });
    }
}

if (!customElements.get("anor-uz")) {
    customElements.define("anor-uz", AnorUz);
}
