function ALL_TRIGGERS() {
    db.ExecuteSql(queries["ALL_TRIGGERS"], [], ALL_TRIGGERS_Success, onUpdateError);
}
function ALL_TRIGGERS_WITH_SQL() {
    db.ExecuteSql(queries["ALL_TRIGGERS_WITH_SQL"], [], ALL_TRIGGERS_WITH_SQL_Success, onUpdateError);
    toggleTriggersSQL();
}
function toggleTriggersSQL() {
    const container = document.getElementById("AL_TRG_SQL");

    if (!container) return;

    if (container.style.display === "none" || container.style.display === "") {
        container.style.display = "block";
    } else {
        container.style.display = "none";
    }
}

function ALL_TRIGGERS_Success(res) {
    if (!res || res.rows.length === 0) {
        app.ShowPopup("Triggerlar topilmadi");
        return;
    }

    let text = "Triggerlar:\n";

    for (let i = 0; i < res.rows.length; i++) {
        text += "- " + res.rows.item(i).name + "\n";
    }

    app.ShowPopup(text);
}

function ALL_TRIGGERS_WITH_SQL_Success(res) {
    if (!res || !res.rows || res.rows.length === 0) {
        return [];
    }

    let triggers = [];

    for (let i = 0; i < res.rows.length; i++) {
        let row = res.rows.item(i);

        triggers.push({
            name: row.name || "",
            sql: row.sql || ""
        });
    }

    // app.ShowPopup("Triggerlar va SQL:\n" + triggers.map(t => `- ${t.name}: ${t.sql}`).join("\n"));
    renderTriggersSQL(triggers);
    return triggers;
}

function renderTriggersSQL(data) {
    const container = document.getElementById("AL_TRG_SQL");

    if (!container) return;

    if (!data || data.length === 0) {
        container.innerHTML = "<p>Triggerlar topilmadi</p>";
        return;
    }

    let html = "";

    data.forEach((trg) => {

        // SQL ni escape qilmasdan raw ko‘rinishda chiqaramiz
        html += `
                    <div style="margin-bottom:15px; padding:10px; border:1px solid #ccc; border-radius:6px; background:#1e1e1e; color:#fff;">
                        
                        <h4 style="margin:0 0 8px 0; color:#00ff88;">
                            ${trg.name}
                        </h4>

                        <pre style="
                            white-space: pre-wrap;
                            font-family: monospace;
                            background:#000;
                            color:#00ff00;
                            padding:10px;
                            overflow:auto;
                            border-radius:5px;
                        ">${escapeHtml(trg.sql || "SQL yo'q")}</pre>

                    </div>
                `;
    });

    container.innerHTML = html;
}

function escapeHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function DROP_TRIGGER_BY_NAME(triggerName) {
    if (!triggerName) { app.ShowPopup("Trigger name kiritilmadi"); return; }
    const sql = "DROP TRIGGER IF EXISTS " + triggerName + ";";

    db.ExecuteSql( sql, [], onUpdateSuccess, onUpdateError );
}