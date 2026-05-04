/**
 * FUNCTION SIGNATURES MAP
 * Har bir funksiya uchun meta-ma'lumot: args va sources
 */
var functionSignatures = {
    
    /**
     * INSERT_USER_PRFTV(phone, role, qayerdan, qayerga, transport)
     * Paste presets dan: contact, role, location, location, car
     */
    INSERT_USER_PRFTV: {
        name: 'INSERT_USER_PRFTV',
        type: 'INSERT',
        args: ['role', 'phone', 'qayerdan', 'qayerga', 'transport'],
        sources: ['role', 'contact', 'location', 'location', 'car'],
        description: 'Yangi user qo\'shish',
        validator: function(data) {
            // Kamasi: 1ta contact, 1ta role, 2ta location, 1ta car
            return data.contact.length == 1 &&
                   data.role.length == 1 &&
                   data.location.length == 2 &&
                   data.car.length == 1;
        }
    },
    
    INSERT_Load_MTTY: {
        name: 'INSERT_Load_MTTY',
        type: 'INSERT',
        args: ['yukchi_phone', 'tonna', 'turi', 'tumandan', 'tumanga', 'matni'],
        sources: ['contact', 'weight', 'type17', 'tuman', 'tuman', 'matni'],
        description: 'Yangi yuk qo\'shish',
        validator: function(data) {
            // Kamasi: 1ta contact, 1ta weight, 2ta tuman, 1ta type17, 1ta matni
            return data.contact.length == 1 &&
                   data.weight.length == 1 &&
                   data.tuman.length == 2 &&
                   data.type17.length == 1 &&
                   data.matni.length == 1;
        }
    },

    UPDATE_CASH_CLOSED: {
        name: 'UPDATE_CASH_CLOSED',
        type: 'UPDATE',
        args: ['phone', 'narxi', 'holati'],
        sources: ['contact', 'load_cash', 'closed'],
        description: 'Yukning naqd va yopilgan holatini yangilash',
        validator: function(data) {
            // Kamasi: 1ta contact, 1ta load_cash, 1ta closed
            return data.contact.length == 1 &&
                   data.load_cash.length == 1 &&
                   data.closed.length == 1;
        }
    },

    UPDATE_USER_NAME_BY_PHONE: {
        name: 'UPDATE_USER_NAME_BY_PHONE',
        type: 'UPDATE',
        args: ['phone', 'name'],
        sources: ['contact', 'name'],
        description: 'User nomini o\'zgartirish',
        validator: function(data) {
            // Kamasi: 1ta contact, 1ta name
            return data.contact.length == 1 &&
                   data.name.length == 1;
        }
    },
    
    UPDATE_USER_ROLE_BY_PHONE: {
        name: 'UPDATE_USER_ROLE_BY_PHONE',
        type: 'UPDATE',
        args: ['phone', 'role'],
        sources: ['contact', 'role'],
        description: 'User rolini o\'zgartirish',
        validator: function(data) {
            // Kamasi: 1ta contact, 1ta role
            return data.contact.length == 1 &&
                   data.role.length == 1;
        }
    },

    DRIVER_LOAD: {
        name: 'DRIVER_LOAD',
        type: 'SELECT',
        args: ['phone'],
        sources: ['contact'],
        description: 'Haydovchining yuklarini ko\'rish',
        validator: function(data) {
            // Kamasi: 1ta contact
            return data.contact.length == 1;
        }
    },

    YUKCHI_LOAD: {
        name: 'YUKCHI_LOAD',
        type: 'SELECT',
        args: ['phone'],
        sources: ['contact'],
        description: 'Yukchining yuklarini ko\'rish',
        validator: function(data) {
            // Kamasi: 1ta contact
            return data.contact.length == 1;
        }
    }
};