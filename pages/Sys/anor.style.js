class AnorStyle extends HTMLElement {

    static styleMap = null;
    static isReady = false;

    connectedCallback() {
        let fileName = this.getAttribute("src");

        if (!fileName) return;

        let map = this.getStyleMap();
        let results = map[fileName] || [];

        if (results.length === 0) {
            console.warn("Style not found:", fileName);
            return;
        }

        if (results.length > 1) {
            app.ShowPopup("Duplicate style file: " + fileName);
            console.warn(results);
        }

        let css = app.ReadFile(results[0]);

        this.injectStyle(css);
    }

    // 🔥 CACHE MANAGER (1 TIME SCAN)
    getStyleMap() {

        if (AnorStyle.isReady && AnorStyle.styleMap) {
            return AnorStyle.styleMap;
        }

        let cacheFile = "cache/anor_style_cache.json";
        let map = {};
        let needScan = true;

        try {
            if (app.FileExists(cacheFile)) {
                let data = JSON.parse(app.ReadFile(cacheFile));

                if (data && data.map) {
                    map = data.map;
                    needScan = true; // sen xohlagan: update scan har safar 1 marta
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

        AnorStyle.styleMap = map;
        AnorStyle.isReady = true;

        return map;
    }

    // 🔍 SCAN ALL FOLDERS
    scanFolder(path, map) {
        try {
            let list = app.ListFolder(path);

            list.forEach(item => {

                let fullPath = path ? path + "/" + item : item;

                if (app.IsFolder(fullPath)) {
                    this.scanFolder(fullPath, map);
                } else {

                    // faqat css filelar
                    if (!item.endsWith(".css")) return;

                    if (!map[item]) {
                        map[item] = [];
                    }

                    map[item].push(fullPath);
                }
            });

        } catch (e) {}
    }

    // 🔥 STYLE INJECTOR
    injectStyle(css) {
        let style = document.createElement("style");
        style.textContent = css;
        document.head.appendChild(style);
    }
}

// 🔒 REGISTER
if (!customElements.get("anor-style")) {
    customElements.define("anor-style", AnorStyle);
}