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
    PRIMARY KEY(id)
);