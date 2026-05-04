
// usage BEGIN
/*****************************************************
function OnStart()
{
    lay = app.CreateLayout( "linear", "VCenter,FillXY" );
    lst = app.CreateList( "", 1, 1 );
    lay.AddChild( lst );
    app.AddLayout( lay );
    
    end4 = "252-";
    let rows = savedContact_4( end4 );
    
    var list = [];
    for(var i in rows) {
        list.push( (i) + "=> " +  rows[i].display_name + ":" + rows[i].data1 + ": " );
    }
    
    lst.SetList( list );
}
***********************************************************/
// usage END 


function savedContact_4( end4, silent=true ) {
    
    function isAccept(ch) { return ch >= '0' && ch <= '9' || ch == '-'; }
    
    function isDigit(ch) {  return ch >= '0' && ch <= '9'; }
    
    let __contain__ = false;
    
    if (typeof end4 == "number"){
        if (!silent) 
        app.ShowPopup("end4 type ❌"); 
        return
    }
    if ( end4.length !== 4 ){
        if (!silent) 
        app.ShowPopup("end4 length ❌"); 
        return
    }
    
    for(let i=0; i<4; i++) {
        if( !isAccept(end4[i]) ){
            if (!silent) 
            app.ShowPopup("end4 digit or - ❌"); 
            return
        }
    }
    for(let i=0; i<4; i++) {
        if( end4[i] == '-' ){
            if (!silent) 
            app.ShowPopup("end4 - ✅"); 
            __contain__ = true;
        }
    }
    
    let LL = end4[0] + end4[1];
    let RR = end4[2] + end4[3];
    
    let uri = "content://com.android.contacts/data";
    let columns = "display_name,data1";
    
    // ikkita shartni birlashtiramiz
    let select = "mimetype='vnd.android.cursor.item/phone_v2' AND (data1 LIKE ? OR data1 LIKE ?)";
    
    let args   = [`%${LL}${RR}`, `%${LL} ${RR}`];
    
    if ( __contain__ )
        args = ["%", "%"];
        
    let rows = app.QueryContent(uri, "display_name,data1", select, args, "display_name");
    
    if (rows.length == 0) {
        if (!silent) 
        app.ShowPopup( end4 + " Kontaktga Saqlanmagan ❌" )
        return;
    }
    
    if (rows.length > 1) {
        if (!silent) 
        app.ShowPopup( end4 + " Kontakt List ❌" )
        return rows;
    }
    if (rows.length == 1) {
        if (!silent) 
        app.ShowPopup( end4 + " Kontaktdan Topildi ✅" )
        return rows;
    }
}
