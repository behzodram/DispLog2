
-- TODAYS_UPDATED_USERS:
SELECT * FROM users WHERE DATETIME(updated_at) > DATETIME('now', '-' || ? || ' minutes')

-- SEL_USERS_COLUMNS:
SELECT updated_at, user_id, phone FROM users;

-- INSERT_Deal_LoadID_DRWPhone_ShipPhone_STATUS_:
INSERT INTO deals (driver_phone, shipper_phone, status) VALUES (?,?,?);
