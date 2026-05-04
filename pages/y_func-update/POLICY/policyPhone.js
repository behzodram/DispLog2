function policyPhone(phone) {
    defaultBool = false;
    phone = FormatPhonePretty(phone);
    if (phone.length !== 12) {
        app.ShowPopup("Noto'g'ri telefon formati ❌");
        return defaultBool;
    }
    return true;
}