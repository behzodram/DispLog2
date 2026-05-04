function OnStart() {
	
    var lay = app.CreateLayout("Linear", "FillXY");

    var web = app.CreateWebView(1, 1);

    // 🔥 APK uchun to‘g‘ri path
    web.LoadUrl("pages/index.html");

    lay.AddChild(web);
    app.AddLayout(lay);

	DCIM_Access();
}

/////////////////////////////////////////////////////
///////////// DCIM PERMISSION.JS /////////////////////

// Write a file to Internal storage.  
function DCIM_Access() {
    var fldr = "/Internal/DCIM";
    var perm = "internal";

    if (!app.CheckPermission(fldr)) {
        app.ShowPopup(fldr + " ga yozish uchun ruxsat kerak");
        app.GetPermission(perm, OnPermission);
        return;
    }
}

// Handle result of permission request.
function OnPermission(path, uri) {
    if (!path)
        app.ShowPopup("Permission not granted!");
    else
        DCIM_Access();
}
/////////////////////////////////////////////////////