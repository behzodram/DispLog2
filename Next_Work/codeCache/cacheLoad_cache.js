//////////////////////////////////////////////////////////////////////////
////////////////////////  TIMEPICKER 3  BEGIN ////////////////////////////

var time3 = ["", "", ""];
var _time3Visible = true;
var _timeIndex = 0; // qaysi button uchun tanlanyapti

// cfg.Dark
// cfg.MUI

function OnPicker() {

    color = MUI.colors.teal
    app.InitializeUIKit(color.teal)
    layPicktime = MUI.CreateLayout("Linear", "FillXY,VCenter")

        btn = MUI.CreateButtonRaised("SHOW PICKER")
        btn.SetOnTouch(ShowPicker)
        layPicktime.AddChild(btn)

    app.AddLayout(layPicktime)
    tmp = MUI.CreateTimePicker(null, null, MUI.colors.deepOrange.deepOrange)
    tmp.SetOnSelect(OnSelect)
}

function ShowPicker() {
    tmp.Show()
}

function pickTime(index) {
    _timeIndex = index;
    OnPicker();
}

function toggleTime3() {
    var icon = document.getElementById("timepicker-icon");
    var btns = document.getElementById("time3-btns").querySelectorAll("button");

    _time3Visible = !_time3Visible;

    if (_time3Visible) {
        icon.classList.remove("panel-collapsed");
        _animateShow(btns);
    } else {
        icon.classList.add("panel-collapsed");
        _animateHide(btns);
    }
}

function UpdateUITime3() {
    for (var i = 0; i < 3; i++) {
        var btn = document.getElementById("t3-btn-" + i);
        if (!btn) continue;

        btn.textContent = time3[i] || "--:--";
    }
}

function copyTime(i) {
    var t = time3[i];
    if (!t) {
        app.ShowPopup("Vaqt yo'q");
        pickTime(i);
        return;
    }

    try {
        let diff = oldingi_TimeDiff(t.split(":")[0], t.split(":")[1]);
        navigator.clipboard.writeText(diff);
    } catch(e) {}

    app.ShowPopup("Nusxa: " + t);
}

function OnSelect(time, hh, mm, pos) {
    if (pos === "PM") hh = parseInt(hh) + 12;

    var t = hh + ":" + mm;

    let diff = oldingi_TimeDiff(hh, mm);

    if (diff < 0) {
        app.DestroyLayout(layPicktime);
        return app.ShowPopup("Tanlangan vaqt hozirgi vaqtdan oldin bo'lishi kerak");
    }

    time3[_timeIndex] = t;

    UpdateUITime3();

    app.DestroyLayout(layPicktime);

    // clipboard
    try {
        navigator.clipboard.writeText(diff);
    } catch(e) {}

    app.ShowPopup("Tanlandi: " + t);
}

function oldingi_TimeDiff(hh, mm) {
    // Hozirgi vaqtni olish
    let now = new Date();
    let nowMinutes = now.getHours() * 60 + now.getMinutes();
    // Maqsad vaqtni minutlarga o‘tkazish
    let targetMinutes = parseInt(hh) * 60 + parseInt(mm);
    // Farqni hisoblash (target hozirgidan oldinda necha minut)
    return nowMinutes - targetMinutes;
}
////////////////////////  TIMEPICKER 3  END   ////////////////////////////
//////////////////////////////////////////////////////////////////////////
