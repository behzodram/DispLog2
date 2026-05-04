function SEL_USERS_COLUMNS() {
    db.ExecuteSql(
        queries["SEL_USERS_COLUMNS"],
        [], onResultColumns, onUpdateError
    );
}
function onResultColumns(results) {
    var s = "";
    var len = results.rows.length;
    for (var i = 0; i < len; i++) {
        var item = results.rows.item(i)
        s += item.updated_at.slice(-8) + "||\t" + item.user_id + "||\t" + item.phone + "\n";
    }

    createTableFromString(s);
}
// Dynamic table yaratish funksiyasi
function createTableFromString(dataStr) {
    var container = document.getElementById("tableContainer");

    // Agar table allaqachon mavjud bo'lsa, olib tashlaymiz
    var existingTable = container.querySelector("table");
    if (existingTable) {
        container.removeChild(existingTable);
        return; // hide qilindi, toggle tugadi
    }

    var table = document.createElement("table");
    var header = table.insertRow();
    ["Time", "User ID", "Phone"].forEach(function (h) {
        var th = document.createElement("th");
        th.textContent = h;
        header.appendChild(th);
    });

    var rows = dataStr.trim().split("\n");
    rows.forEach(function (r) {
        var tr = table.insertRow();
        var cols = r.split("||");
        cols.forEach(function (c) {
            var td = tr.insertCell();
            td.textContent = c.trim();
        });
    });

    container.appendChild(table);
}

