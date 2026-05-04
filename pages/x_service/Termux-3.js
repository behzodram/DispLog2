let CMD_12 = app.ReadFile("pages/x_service/main.sh");
let CMD_6  = app.ReadFile("pages/x_service/scan-run.sh");

function python_clip_2() {
    app.SetClipboardText( CMD_12 ); 
    app.ShowPopup( "Xotira / Kutubxona / File -> Buferda Tayyor 📜" ); 
}

function run_clip_6() {
    app.SetClipboardText( CMD_6 ); 
    app.ShowPopup( "Skaner -> Buferda Tayyor 📜" ); 
}
