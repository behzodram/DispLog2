-- HAYDOVCHI_JOIN_LOW:
SELECT s.ismi AS yukchi_ismi, l.yukchi_phone, l.qayerdan, l.qayerga, l.transport,
    l.tonna, l.turi, l.tumandan, l.tumanga, l.matni, l.narx, l.yopilgan
    FROM users u
    JOIN loads l 
        ON l.qayerdan = u.qayerdan
        -- AND l.qayerga = u.qayerga
        -- AND l.yopilgan = 'OPEN'
    LEFT JOIN users s 
        ON s.phone = l.yukchi_phone
    WHERE u.phone = ?
    AND u.role = 'DRIVER'
    AND l.created_at >= datetime('now', '-1 day');

-- YUKCHI_JOIN_LOW:
SELECT DISTINCT
    d.ismi AS driver_ismi,
    d.phone,
    d.qayerdan,
    d.qayerga,
    d.transport
FROM users u
JOIN loads l 
    ON l.yukchi_phone = u.phone
    AND l.yopilgan = 'OPEN'
JOIN users d 
    ON d.qayerdan = l.qayerdan
    -- AND d.qayerga = l.qayerga
    AND d.role = 'DRIVER'
WHERE u.phone = ?
    AND u.role = 'SHIPPER'
    AND l.created_at >= datetime('now', '-1 day');

-- SHOW_ALL_USERS:
SELECT ismi, phone, role, qayerdan, qayerga, transport
    FROM users
    WHERE role = ?
    AND updated_at >= DATETIME('now', '-' || ?)
    ORDER BY updated_at DESC;

-- SHOW_ALL_LOADS:
SELECT l.yukchi_phone, s.ismi AS yukchi_ismi,
    l.qayerdan, l.qayerga, l.transport,
    l.tonna, l.turi, l.tumandan, l.tumanga,
    l.matni, l.narx, l.yopilgan, l.updated_at
    FROM loads l
    LEFT JOIN users s ON s.phone = l.yukchi_phone
    WHERE l.updated_at >= DATETIME('now', '-' || ?)
    ORDER BY l.updated_at DESC;

-- SHOW_USER:
SELECT ismi, phone, role, qayerdan, qayerga, transport
    FROM users
    WHERE phone = ?;