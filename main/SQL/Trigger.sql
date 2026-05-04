-- ALL_TRIGGERS:
SELECT name FROM sqlite_master 
WHERE type = 'trigger';

-- ALL_TRIGGERS_WITH_SQL:
SELECT name, sql 
FROM sqlite_master 
WHERE type = 'trigger';

-- UPD_USERS_UPDATED_AT_TRG:
CREATE TRIGGER IF NOT EXISTS trg_users_updated_at
AFTER UPDATE ON users
FOR EACH ROW
WHEN NEW.updated_at = OLD.updated_at OR OLD.updated_at IS NULL
BEGIN   -- bu trigger hozircha shu sql kod holatida
        -- trigger keyinchalik server sync uchun
        -- is_synced hisobga olingan holda
        -- qayta kodlanishi mumkin
    UPDATE users
    SET updated_at = CURRENT_TIMESTAMP
    WHERE rowid = NEW.rowid;
END;

-- UPD_LOADS_UPDATED_AT_TRG:
CREATE TRIGGER IF NOT EXISTS trg_loads_updated_at
AFTER UPDATE ON loads
FOR EACH ROW
WHEN NEW.updated_at = OLD.updated_at OR OLD.updated_at IS NULL
BEGIN   -- bu trigger hozircha shu sql kod holatida
        -- trigger keyinchalik server sync uchun
        -- is_synced hisobga olingan holda
        -- qayta kodlanishi mumkin
    UPDATE loads
    SET updated_at = CURRENT_TIMESTAMP
    WHERE rowid = NEW.rowid;
END;

-- INSERT_Load_MTTY_TRG_CHECK:
CREATE TRIGGER IF NOT EXISTS trg_loads_shipper_check
    BEFORE INSERT ON loads
    FOR EACH ROW
    BEGIN

        -- user mavjud
        SELECT RAISE(ABORT, 'User topilmadi')
        WHERE NOT EXISTS (
            SELECT 1 FROM users WHERE phone = NEW.yukchi_phone
        );

        -- role check
        SELECT RAISE(ABORT, 'SHIPPER emas')
        WHERE EXISTS (
            SELECT 1 FROM users 
            WHERE phone = NEW.yukchi_phone 
            AND role != 'SHIPPER'
        );

        -- activity check (timezone independent)
        SELECT RAISE(ABORT, 'User bugun faollashmagan')
        WHERE EXISTS (
            SELECT 1 FROM users
            WHERE phone = NEW.yukchi_phone
            AND julianday('now') - julianday(updated_at) > 1
        );
    
        -- duplicat check
        SELECT RAISE(ABORT, 'Bugun bu yukchi raqamida yuk kiritilgan')
        WHERE EXISTS (
            SELECT 1
            FROM loads
            WHERE yukchi_phone = NEW.yukchi_phone
            AND julianday('now') - julianday(created_at) <= 1
        );

    END;