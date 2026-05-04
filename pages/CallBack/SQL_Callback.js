
// ---------- CALLBACK FUNKSIYALARI ----------

// Success callback
function onUpdateSuccess(res) {
    if (res.rowsAffected === 0) {
        app.ShowPopup("❌ SQL row Affected: 0");
    } else {
        app.ShowPopup("Updated ✅");
    }
}

// Error callback
function onUpdateError(err) {
    app.ShowPopup("Error ❌: " + err);
    console.log(err);
}