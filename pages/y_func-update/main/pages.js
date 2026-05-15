var AndroidPath;
var queries = {};
var db;

function OnStart() {
    AndroidPath = app.GetPath();
    // androidpth bu /storage/emulated/0/Android/data/<package_name>/files

    InitDB();
    // INSERT_Load_RAW_FROM_TO_VEHICLE_OWNPhone_EXP_ 
    // INSERT_Deal_LoadID_DRWPhone_ShipPhone_STATUS_
    // toggleBottomPanel toggleContact3 toggleLocation3 toggleTime3 USED FUNCTIONS
    anorLoadScript("pretty_norm.js");
    // NormalizePhone FormatPhonePretty USED FUNCTIONS
    anorLoadScript("policyPhone.js");
    // policyPhone USED FUNCTION
    anorLoadScript("CacheLoad.js");
    // init_Cache LoadNumber_3 UpdateUI USED FUNCTIONS
    init_Cache();

    LoadNumber_3();

    anorLoadScript("SQL_Callback.js");
    // onUpdateSuccess onUpdateError USED FUNCTIONS
    // that functions used inside UPDATE_USER_NAME_BY_PHONE function
    anorLoadScript("universal_exec.js");
    // functionSignatures executeUniversalFunction USED FUNCTIONS
    anorLoadScript("testINSERT.js");
    // CallTest function is used to start the interval for testing INSERT function
    // CallTest(5000);
}

///////////////////////////////////////////
function InitDB() {
    
    // ── SQL yuklash ────────────────────
    anorLoadScript("LoadSQL.js");
    // LoadSQLFile_v1_7_2 vs
    // LoadSQLFile_v1_7_3 USED FUNCTION

    // var queries = {}; GLOBAL USAGE
    // tepadagi var ga LoadSQLFile_v1_7_3
    // funsiyasi key kirityapti 
    LoadSQLFile_v1_7_3( "main/SQL/Queries.sql" );
    LoadSQLFile_v1_7_3( "main/SQL/Trigger.sql" );
    LoadSQLFile_v1_7_3( "main/SQL/Call.sql" );
    LoadSQLFile_v1_7_3( "main/SQL/Joins.sql" );
    LoadSQLFile_v1_7_3( "main/SQL/main.sql" );
    LoadSQLFile_v1_7_3( "main/SQL/then.sql" );

    AndroidPath = app.GetPath();
    // androidpth bu /storage/emulated/0/Android/data
    db = app.OpenDatabase( AndroidPath + "/MyData.db" );
    db.ExecuteSql(queries["CRT_USERS"]);
    db.ExecuteSql(queries["CRT_LOADS"]);
    db.ExecuteSql(queries["CRT_DEALS"]);
    db.ExecuteSql(queries["CRT_CHATS"]);
    db.ExecuteSql(queries["CRT_CONFERENCE"]);
    db.ExecuteSql(queries["CRT_DRIVER_INTERESTED"]);

    // Triggers
    // db.ExecuteSql(queries["TEST_TRIGGER"]);
    // INSERT_Load_MTTY_TRG triggerini yaratish;
    db.ExecuteSql(queries["INSERT_Load_MTTY_TRG_CHECK"]);
    db.ExecuteSql(queries["UPD_USERS_UPDATED_AT_TRG"]);
    db.ExecuteSql(queries["UPD_LOADS_UPDATED_AT_TRG"]);
    // TRIGGERNI DROP QILISH KERAK BOLADI
    // YUQORI DEBUG TEST SPK UCHUN
    // db.ExecuteSql("DROP TRIGGER IF EXISTS trg_loads_shipper_check;");

    // anorLoadScript("then.js");
}

// v 1.0.1
// INSERT_USER_PRFTV:
// INSERT INTO users (phone, role, qayerdan, qayerga, transport) VALUES ( ?, ?, ?, ?, ? );
// role is only "shipper", "driver"
function INSERT_USER_PRFTV(role, phone, qayerdan, qayerga, transport) {
    phone = FormatPhonePretty(phone);
    if ( policyPhone(phone) === false ) return;
    db.ExecuteSql(
        queries["INSERT_USER_PRFTV"],
        [phone, role, qayerdan, qayerga, transport],  onUpdateSuccess, onUpdateError
    );
    /** Agar role shipper bo'lsa,
     *  INSERT_LOAD funksiyasini chaqirish kerak bo'ladi,
     *  chunki shipper yuk qo'shadi, driver emas.
     */
}

function INSERT_Load_MTTY(yukchi_phone, weight, turi) {
    yukchi_phone = FormatPhonePretty(yukchi_phone);
    if ( policyPhone(yukchi_phone) === false ) return;
    db.ExecuteSql(
        queries["INSERT_Load_MTTY"],
        [weight, turi, yukchi_phone], onUpdateSuccess, onUpdateError
         
    );

    db.ExecuteSql(
        queries["UPD_LOADS_FROM_USERS"], 
        [yukchi_phone], null, null);
}

function UPDATE_CASH_CLOSED(phone, cash, closed) {
    phone = FormatPhonePretty(phone);
    if ( policyPhone(phone) === false ) return;
    db.ExecuteSql(
        queries["UPDATE_CASH_CLOSED"],
        [cash, closed, phone], onUpdateSuccess, onUpdateError
    );
}

function UPDATE_TONNA_TURI(phone, tonna, turi) {
    phone = FormatPhonePretty(phone);
    if ( policyPhone(phone) === false ) return;

    db.ExecuteSql(
        queries["UPDATE_TONNA_TURI"],
        [tonna, turi, phone], onUpdateSuccess, onUpdateError
    );
}

function UPDATE_TUMAN_TUMAN(phone, tumandan, tumanga) {
    phone = FormatPhonePretty(phone);
    if ( policyPhone(phone) === false ) return;

    db.ExecuteSql(
        queries["UPDATE_TUMAN_TUMAN"],
        [tumandan, tumanga, phone], onUpdateSuccess, onUpdateError
    );
}

function UPDATE_USER_NAME_BY_PHONE(phone, name) {
    phone = FormatPhonePretty(phone);
    if ( policyPhone(phone) === false ) return;
    db.ExecuteSql(
        queries["UPDATE_USER_NAME_BY_PHONE"],
        [name, phone], onUpdateSuccess, onUpdateError
    );
    if (db.GetChangedRows() == 0) {
        throw "Yuk bugun faollashmagan";
        app.ShowPopup("Yuk bugun faollashmagan");
        return;
    }
}

function UPDATE_USER_ROLE_BY_PHONE(phone, role) {
    phone = FormatPhonePretty(phone);
    if ( policyPhone(phone) === false ) return;
    db.ExecuteSql(
        queries["UPDATE_USER_ROLE_BY_PHONE"],
        [role, phone], onUpdateSuccess, onUpdateError
    );
}

function UPDATE_USER_VEHICLE_BY_PHONE(phone, transport) {
    phone = FormatPhonePretty(phone);
    if ( policyPhone(phone) === false ) return;
    db.ExecuteSql(
        queries["UPDATE_USER_VEHICLE_BY_PHONE"],
        [transport, phone], onUpdateSuccess, onUpdateError
    );
}