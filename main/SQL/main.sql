-- TOGETHER QUERIES begin_tghr
    -- USER_ROW_TGHR:
    SELECT phone, role, qayerdan, qayerga, transport, 
        (julianday('now') - julianday(updated_at)) * 86400 AS sec_before_update
        FROM users WHERE phone = ?;

    -- INSERT_USER_PRFTV:
    INSERT INTO users (phone, role, qayerdan, qayerga, transport)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(phone) DO UPDATE SET
            role = excluded.role,
            qayerdan = excluded.qayerdan,
            qayerga = excluded.qayerga,
            transport = excluded.transport;
-- TOGETHER QUERIES end_tghr
    

-- TOGETHER QUERIES begin_tghr
    -- USER_ROW_UPD_UNBP_TGHR:
    SELECT phone, ismi, (julianday('now') - julianday(updated_at)) * 86400 AS sec_before_update
        FROM users WHERE phone = ?;

    -- UPDATE_USER_NAME_BY_PHONE:
    UPDATE users SET ismi = ? WHERE phone = ?;
-- TOGETHER QUERIES end_tghr



-- TOGETHER QUERIES begin_tghr
    -- USER_ROW_UPD_URBP_TGHR:
    SELECT phone, role, (julianday('now') - julianday(updated_at)) * 86400 AS sec_before_update
        FROM users WHERE phone = ?;
    -- UPDATE_USER_ROLE_BY_PHONE:
    UPDATE users SET role = ? WHERE phone = ?;
-- TOGETHER QUERIES end_tghr


-- TOGETHER QUERIES begin_tghr
    -- LOAD_ROW_TGHR:
    SELECT tonna, turi, tumandan, tumanga, matni, yukchi_phone,
        (julianday('now') - julianday(updated_at)) * 86400 AS sec_before_update
        FROM loads WHERE yukchi_phone = ?
        AND julianday('now') - julianday(created_at) <= 1;

    -- INSERT_Load_MTTY:
    INSERT INTO loads (tonna, turi, yukchi_phone) VALUES (?,?,?);
    -- INSERT INTO loads (matni, turi, tonna, yukchi_phone) VALUES (?,?,?,?);

    -- UPD_LOADS_FROM_USERS:
    UPDATE loads
    SET qayerdan =  (SELECT qayerdan    FROM users WHERE phone = loads.yukchi_phone),
        qayerga =   (SELECT qayerga     FROM users WHERE phone = loads.yukchi_phone),
        transport = (SELECT transport   FROM users WHERE phone = loads.yukchi_phone),
        yopilgan = 'OPEN'
    WHERE yukchi_phone = ?
    AND julianday('now') - julianday(created_at) <= 1;
-- TOGETHER QUERIES end_tghr


-- TOGETHER QUERIES begin_tghr
    -- UPDATE_CASH_CLOSED_TGHR:
    SELECT narx, yopilgan, (julianday('now') - julianday(updated_at)) * 86400 AS sec_before_update
        FROM loads WHERE yukchi_phone = ?
        AND julianday('now') - julianday(created_at) <= 1;

    -- UPDATE_CASH_CLOSED:
    UPDATE loads SET narx = ?, yopilgan = ? 
    WHERE yukchi_phone = ?
    AND julianday('now') - julianday(created_at) <= 1;
-- TOGETHER QUERIES end_tghr


-- TOGETHER QUERIES begin_tghr
    -- UPDATE_TONNA_TURI_TGHR:
    SELECT tonna, turi, (julianday('now') - julianday(updated_at)) * 86400 AS sec_before_update
        FROM loads WHERE yukchi_phone = ?
        AND julianday('now') - julianday(created_at) <= 1;
    
    -- UPDATE_TONNA_TURI:
    UPDATE loads SET tonna = ?, turi = ?
    WHERE yukchi_phone = ?
    AND julianday('now') - julianday(created_at) <= 1;
-- TOGETHER QUERIES end_tghr


-- TOGETHER QUERIES begin_tghr
    -- UPDATE_TUMAN_TUMAN_TGHR:
    SELECT tumandan, tumanga, (julianday('now') - julianday(updated_at)) * 86400 AS sec_before_update
        FROM loads WHERE yukchi_phone = ?
        AND julianday('now') - julianday(created_at) <= 1;
    
    -- UPDATE_TUMAN_TUMAN:
    UPDATE loads SET tumandan = ?, tumanga = ?
    WHERE yukchi_phone = ?
    AND julianday('now') - julianday(created_at) <= 1;
-- TOGETHER QUERIES end_tghr
