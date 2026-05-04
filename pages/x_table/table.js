// Tables Master Management
// v1.0

// ---------- CORE TABLES LIST ----------
var CORE_TABLES = ["users", "loads", "deals", "chats", "conference", "driver_interested"];

// Table state object - stores which tables are created/dropped
var tablesState = {};

// Storage key for persisting table state
const TABLES_STATE_STORAGE_KEY = "displog_tables_state";

// Save table state to localStorage
function saveTablesState() {
    try {
        localStorage.setItem(TABLES_STATE_STORAGE_KEY, JSON.stringify(tablesState));
        console.log("Table state saved to localStorage");
    } catch (error) {
        console.log("Error saving table state: " + error);
    }
}

// Load table state from localStorage
function loadTablesState() {
    try {
        var saved = localStorage.getItem(TABLES_STATE_STORAGE_KEY);
        if (saved) {
            tablesState = JSON.parse(saved);
            console.log("Table state loaded from localStorage");
            return true;
        }
    } catch (error) {
        console.log("Error loading table state: " + error);
    }
    return false;
}

function initTablesMaster() {
    // Try to load saved state
    var stateLoaded = loadTablesState();
    
    // If no saved state, initialize all as created
    if (!stateLoaded) {
        CORE_TABLES.forEach(function(table) {
            tablesState[table] = { status: "created", canCreate: false };
        });
    } else {
        // Ensure all tables exist in state (in case new tables were added)
        CORE_TABLES.forEach(function(table) {
            if (!tablesState[table]) {
                tablesState[table] = { status: "created", canCreate: false };
            }
        });
    }
    
    renderTablesMasterList();
}

function renderTablesMasterList() {
    var tablesList = document.getElementById("tablesList");
    tablesList.innerHTML = "";
    
    CORE_TABLES.forEach(function(table, index) {
        var state = tablesState[table];
        var row = document.createElement("tr");
        
        var statusIcon = state.status === "created" ? "✓" : "";
        var buttonConfig = state.status === "created" 
            ? { seeText: "See", dropText: "Drop", seeBtn: true, dropBtn: true }
            : { seeText: "-", dropText: "Create", seeBtn: false, dropBtn: true };
        
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${table} ${statusIcon}</td>
            <td>
                ${buttonConfig.seeBtn 
                    ? `<button class="btn-table-action btn-see" onclick="SEE_TABLE_DATA('${table}')">V</button>`
                    : `<span class="btn-table-action disabled">-</span>`
                }
            </td>
            <td>
                <button class="btn-table-action ${state.status === 'created' ? 'btn-drop' : 'btn-create'}" 
                        onclick="TOGGLE_TABLE_ACTION('${table}')">
                    ${state.status === 'created' ? 'X' : '+'}
                </button>
            </td>
        `;
        
        tablesList.appendChild(row);
    });
    
    // Update table count
    var createdCount = CORE_TABLES.filter(t => tablesState[t].status === "created").length;
    document.getElementById("tableCount").textContent = createdCount + " ta table";
}

function SEE_TABLE_DATA(tableName) {
    if (!queries || !queries.TABLE_DATA) {
        console.log("SQL queries not loaded");
        return;
    }
    
    // Build query: SELECT * FROM tableName
    var sql = "SELECT * FROM " + tableName;
    
    console.log("Fetching data from table: " + tableName);
    
    // Call the database function to fetch and display data
    if (typeof db !== 'undefined' && db.ExecuteSql) {
        db.ExecuteSql(sql, [], function(results) {
            displayTableData(tableName, results);
        }, function(error) {
            ShowToast("Xato: " + error, 3000);
        });
    }
}

function displayTableData(tableName, results) {
    // Display table data in a modal or panel
    console.log("Table " + tableName + " data retrieved");
    
    if (!results || !results.rows) {
        ShowToast("Jadval bo'sh", 2000);
        return;
    }
    
    var rowCount = results.rows.length;
    
    if (rowCount === 0) {
        ShowToast(tableName + " jadvalida ma'lumot yok", 2000);
        return;
    }
    
    // Get column names from first row
    var firstRow = results.rows.item(0);
    var columns = Object.keys(firstRow);
    
    // Create modal HTML
    var html = createTableModal(tableName, columns, results.rows);
    
    // Show modal
    showTableModal(html);
}

function isDateField(columnName) {
    var name = columnName.toLowerCase();
    return name.indexOf("_at") !== -1 || name.indexOf("date") !== -1 || name.indexOf("time") !== -1;
}

function truncateFromStart(text, maxLength) {
    text = String(text);
    
    // Try to extract date components in format: YYYY-MM-DD HH:MM:SS
    var dateMatch = text.match(/(\d{4})-(\d{2})-(\d{2})\s(\d{2}):(\d{2}):(\d{2})/);
    if (dateMatch) {
        // Extract day, hour, minute, second
        var day = dateMatch[3];        // DD
        var hour = dateMatch[4];       // HH
        var minute = dateMatch[5];     // MM
        var second = dateMatch[6];     // SS
        return day + " " + hour + ":" + minute + ":" + second;
    }
    
    // Fallback: truncate from start
    if (text.length <= maxLength) {
        return text;
    }
    return "..." + text.substring(text.length - (maxLength - 3));
}

function createTableModal(tableName, columns, rows) {
    var html = '<div class="table-modal-overlay">';
    html += '<div class="table-modal-content">';
    html += '<div class="table-modal-header">';
    html += '<h3>' + tableName + ' jadval (' + rows.length + ' qator)</h3>';
    html += '<button class="btn-close" onclick="closeTableModal()">✕</button>';
    html += '</div>';
    html += '<div class="table-modal-body">';
    html += '<table class="modal-data-table">';
    
    // Detect which columns are dates
    var dateColumns = {};
    for (var k = 0; k < columns.length; k++) {
        dateColumns[k] = isDateField(columns[k]);
    }
    
    // Headers
    html += '<thead><tr>';
    for (var i = 0; i < columns.length; i++) {
        html += '<th>' + columns[i] + '</th>';
    }
    html += '</tr></thead>';
    
    // Rows
    html += '<tbody>';
    for (var i = 0; i < rows.length; i++) {
        var row = rows.item(i);
        html += '<tr>';
        for (var j = 0; j < columns.length; j++) {
            var cellValue = row[columns[j]];
            var isDate = dateColumns[j];
            var classList = isDate ? 'date-cell' : '';
            
            if (cellValue === null || cellValue === undefined) {
                classList += ' null-cell';
                html += '<td class="' + classList.trim() + '">NULL</td>';
            } else {
                var displayValue;
                if (isDate) {
                    displayValue = truncateFromStart(cellValue, 50);
                } else {
                    displayValue = String(cellValue).substring(0, 50);
                }
                html += '<td class="' + classList.trim() + '">' + displayValue + '</td>';
            }
        }
        html += '</tr>';
    }
    html += '</tbody>';
    
    html += '</table>';
    html += '</div>';
    html += '</div>';
    html += '</div>';
    
    return html;
}

function showTableModal(html) {
    // Remove existing modal if any
    var existing = document.getElementById('tableModal');
    if (existing) existing.remove();
    
    // Create modal container
    var modal = document.createElement('div');
    modal.id = 'tableModal';
    modal.innerHTML = html;
    document.body.appendChild(modal);
}

function closeTableModal() {
    var modal = document.getElementById('tableModal');
    if (modal) modal.remove();
}

function TOGGLE_TABLE_ACTION(tableName) {
    var state = tablesState[tableName];
    
    if (state.status === "created") {
        // Drop table
        DROP_TABLE(tableName);
    } else {
        // Create table
        CREATE_TABLE(tableName);
    }
}

function DROP_TABLE(tableName) {
    if (!queries) {
        console.log("SQL queries not loaded");
        return;
    }
    
    var delKey = "DEL_" + tableName.toUpperCase();
    if (!queries[delKey]) {
        console.log("No DROP query found for: " + tableName);
        return;
    }
    
    console.log("Dropping table: " + tableName);
    
    if (typeof db !== 'undefined' && db.ExecuteSql) {
        db.ExecuteSql(queries[delKey], [], function() {
            tablesState[tableName].status = "dropped";
            saveTablesState();
            renderTablesMasterList();
            ShowToast(tableName + " jadval o'chirildi", 2000);
        }, function(error) {
            ShowToast("Xato: " + error, 2000);
        });
    }
}

function CREATE_TABLE(tableName) {
    if (!queries) {
        console.log("SQL queries not loaded");
        return;
    }
    
    var crtKey = "CRT_" + tableName.toUpperCase();
    if (!queries[crtKey]) {
        console.log("No CREATE query found for: " + tableName);
        return;
    }
    
    console.log("Creating table: " + tableName);
    
    if (typeof db !== 'undefined' && db.ExecuteSql) {
        db.ExecuteSql(queries[crtKey], [], function() {
            tablesState[tableName].status = "created";
            saveTablesState();
            renderTablesMasterList();
            ShowToast(tableName + " jadval yaratildi", 2000);
        }, function(error) {
            ShowToast("Xato: " + error, 2000);
        });
    }
}

// Show toast notification
function ShowToast(message, duration) {
    var toast = document.getElementById("toast");
    if (toast) {
        toast.textContent = message;
        toast.style.display = "block";
        
        setTimeout(function() {
            toast.style.display = "none";
        }, duration || 2000);
    }
}
