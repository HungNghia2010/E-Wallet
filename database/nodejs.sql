CREATE DATABASE IF NOT EXISTS nodejs DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci;
USE nodejs;

CREATE TABLE register(
    id int(10) NOT NULL AUTO_INCREMENT,
    username varchar(64) NOT NULL,
    pass varchar(255) NOT NULL,
    name varchar(64) COLLATE utf8_unicode_ci NOT NULL,
    email varchar(64) COLLATE utf8_unicode_ci NOT NULL,
    phone_number varchar(15) NOT NULL,
    identity varchar(20) NOT NULL,
    birth varchar(25) NOT NULL,
    address varchar(255) NOT NULL,
    CMND1 varchar(255) COLLATE utf8_unicode_ci ,
    CMND2 varchar(255) COLLATE utf8_unicode_ci ,
    status varchar(50) NOT NULL,
    role int(10) NOT NULL,
    change_pass int(5) NOT NULL,
    time_create_account varchar(255) NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE lockaccount (
    id int(10) NOT NULL AUTO_INCREMENT,
    username varchar(64) NOT NULL,
    wrongPassword int(5),
    loginAbnormality int(5),
    lockTime varchar(25),
    PRIMARY KEY(id)
);

CREATE TABLE otp(
    id int(10) NOT NULL AUTO_INCREMENT,
    otp varchar(10),
    expiry time,
    checkotp varchar(10),
    PRIMARY KEY(id)
);

CREATE TABLE account(
    id int(10) NOT NULL AUTO_INCREMENT,
    money varchar(20),
    PRIMARY KEY(id)
);

CREATE TABLE trading(
    ma_Giao_Dich varchar(10) NOT NULL,
    ma_Khach_Hang int(10) NOT NULL,
    money_trading varchar(20) ,
    day_trading varchar(20),
    time_trading TIME,
    trading_type varchar(20),
    trading_status varchar(20),
    note_trading varchar(100),
    PRIMARY KEY(ma_Giao_Dich)
);

CREATE TABLE transfer_trading(
    ma_Giao_Dich varchar(10) NOT NULL,
    ma_Khach_Hang int(10) NOT NULL,
    ma_Nguoi_Nhan int(10) NOT NULL,
    ten_Nguoi_Nhan varchar(50) NOT NULL,
    sdt_Nguoi_Nhan varchar(15) NOT NULL,
    money_transfer varchar(20) ,
    day_trading varchar(20),
    time_trading TIME,
    trading_type varchar(20),
    trading_status varchar(20),
    note_trading varchar(100),
    PRIMARY KEY(ma_Giao_Dich)
);

CREATE TABLE trading_card(
    ma_Giao_Dich varchar(10) NOT NULL,
    ma_Khach_Hang int(10) NOT NULL,
    card_seri varchar(20),
    ma_The varchar(20) NOT NULL,
    card_type varchar(20) NOT NULL,
    price varchar(20),
    total_price varchar(20),
    PRIMARY KEY(ma_Giao_Dich)
);

INSERT INTO register VALUES
-- tk: admin/ mk: 123456 
(1, 'admin', '$2a$08$2atY3gZJNtmW9jQKXjaDGeJTrg7qXTt48L0KJ58bWVdBwwHmaZN3m', 'admin', 'ad@gmail.com', '0123456789', 
'123456789', '01/01/2000', 'Hà Nội', '', '', 'đã xác minh', 1, 1, '');

INSERT INTO lockaccount VALUES 
('1', 'admin', 0, 0, '');

INSERT INTO transfer_trading VALUES 
('dkfgb', '288881', '1245587', 'Trung Hậu', '02145789555', '1000000', '30-5-2020', '12:00:00', 'Chuyển tiền', 'chờ duyệt', 'Lương FE');

ALTER TABLE register
    MODIFY id int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

ALTER TABLE lockaccount
    MODIFY id int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

ALTER TABLE otp
    MODIFY id int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;