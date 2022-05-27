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
    PRIMARY KEY(id)
);

CREATE TABLE lockAccount (
    id int(10) NOT NULL AUTO_INCREMENT,
    username varchar(64) NOT NULL,
    wrongPassword int(5),
    loginAbnormality int(5),
    lockIndefinitely int(5),
    lockTime varchar(25),
    PRIMARY KEY(id)
);

INSERT INTO register VALUES 
(1, 'admin', '$2a$08$2atY3gZJNtmW9jQKXjaDGeJTrg7qXTt48L0KJ58bWVdBwwHmaZN3m', 'admin', 'ad@gmail.com', '0123456789', 
'123456789', '01/01/2000', 'Hà Nội', '', '', 'chờ xác minh', 1, 1);

INSERT INTO lockAccount VALUES 
('1', 'admin', 0, 0, 0, '');

ALTER TABLE register
    MODIFY id int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

ALTER TABLE lockAccount
    MODIFY id int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;