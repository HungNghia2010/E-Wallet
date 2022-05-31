CREATE DATABASE IF NOT EXISTS nodejs DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci;
USE nodejs;
-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `account`
--

CREATE TABLE `account` (
  `id` int(10) NOT NULL,
  `money` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `account`
--

INSERT INTO `account` (`id`, `money`) VALUES
(1, '0'),
(5, '0'),
(6, '0'),
(7, '196550000'),
(8, '0'),
(9, '0'),
(11, '0'),
(12, '107000000'),
(13, '0'),
(14, '192350000'),
(15, '0'),
(16, '0'),
(17, '0'),
(18, '0'),
(19, '0'),
(20, '0');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `lockaccount`
--

CREATE TABLE `lockaccount` (
  `id` int(10) NOT NULL,
  `username` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `wrongPassword` int(5) DEFAULT NULL,
  `loginAbnormality` int(5) DEFAULT NULL,
  `lockTime` varchar(25) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `lockaccount`
--

INSERT INTO `lockaccount` (`id`, `username`, `wrongPassword`, `loginAbnormality`, `lockTime`) VALUES
(1, 'admin', 0, 0, ''),
(5, '6876293861', 0, 2, ''),
(6, '9113484186', 0, 0, ''),
(7, '4408622655', 0, 0, ''),
(8, '9801348132', 0, 0, ''),
(9, '8700623080', 0, 2, ''),
(10, '9094667110', 0, 0, ''),
(11, '1580997508', 0, 0, ''),
(12, '1613731062', 0, 0, ''),
(13, '3047893655', 0, 0, ''),
(14, '9426483382', 0, 0, ''),
(15, '2216505115', 0, 0, ''),
(16, '6914543578', 0, 2, ''),
(17, '2389086923', 0, 0, ''),
(18, '9298720673', 0, 0, ''),
(19, '1072449746', 0, 0, ''),
(20, '6750066225', 0, 0, ''),
(21, '2735472259', 0, 0, ''),
(22, '5375225247', 0, 0, ''),
(23, '4474511468', 0, 0, '');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `otp`
--

CREATE TABLE `otp` (
  `id` int(10) NOT NULL,
  `otp` varchar(10) COLLATE utf8_unicode_ci DEFAULT NULL,
  `expiry` time DEFAULT NULL,
  `checkotp` varchar(10) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `otp`
--

INSERT INTO `otp` (`id`, `otp`, `expiry`, `checkotp`) VALUES
(7, 'ikMKK4', '20:40:28', NULL),
(12, '5RSUFE', '20:47:29', NULL),
(14, 'e7gM3e', '20:43:30', NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `register`
--

CREATE TABLE `register` (
  `id` int(10) NOT NULL,
  `username` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `pass` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `name` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `email` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `phone_number` varchar(15) COLLATE utf8_unicode_ci NOT NULL,
  `identity` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `birth` varchar(25) COLLATE utf8_unicode_ci NOT NULL,
  `address` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `CMND1` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `CMND2` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `status` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `role` int(10) NOT NULL,
  `change_pass` int(5) NOT NULL,
  `time_create_account` varchar(255) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `register`
--

INSERT INTO `register` (`id`, `username`, `pass`, `name`, `email`, `phone_number`, `identity`, `birth`, `address`, `CMND1`, `CMND2`, `status`, `role`, `change_pass`, `time_create_account`) VALUES
(1, 'admin', '$2a$08$2atY3gZJNtmW9jQKXjaDGeJTrg7qXTt48L0KJ58bWVdBwwHmaZN3m', 'admin', 'ad@gmail.com', '0123456789', '123456789', '01/01/2000', 'Hà Nội', '', '', 'đã xác minh', 1, 1, ''),
(5, '6876293861', '$2a$08$Dx.GsnMz81N.2ztPEKiSkOUj/VfQZ0tngjrxCT6eOOll.xF9zdTu2', 'Mai Văn Ngọc', 'mvngoc.bp01@gmail.com', '0337375401', '285831241', '03/09/2001', 'TP HCM', NULL, NULL, 'đã khóa vô thời hạn', 2, 1, '31-05-2022'),
(6, '9113484186', '$2a$08$QGfmE/D7TA8NkJYaXuWLh.uuuInNxoPtilw1UnKZ/Yt9cbyOnwweC', 'Nguyễn Trung Hậu', 'trunghau@gmail.com', '03542186221', '2165769555', '10/12/2001', 'TP HCM', NULL, NULL, 'chờ xác minh', 2, 1, '31-05-2022'),
(7, '4408622655', '$2a$08$mSZUfi0uK1iA0tHyOsO8HeHi5B2ec0cgqZsSjpa9HWrWa9FL7szaa', 'Phạm Hùng Nghĩa', 'hungnghia@gmail.com', '0441254786', '261453987', '20/12/2001', 'Đồng Xoài', NULL, NULL, 'đã xác minh', 2, 1, '31-05-2022'),
(8, '9801348132', '$2a$08$WLSHRgugvOudA62Pl3fJHO0QBaNoHmSodFmJwBm//l6XWtSGiK.Mq', 'Nguyễn Thanh Sơn', 'thanhson@gmail.com', '0114256984', '214365821', '01/05/2002', 'Đồng Tháp', NULL, NULL, 'chờ xác minh', 2, 1, '31-05-2022'),
(9, '8700623080', '$2a$08$0I4hStmRB33JUFGl6pfGKeCdsflyxntfa0E4lwYW3EpEPipTvSO6K', 'Nguyễn Chánh Đại', 'chanhdai@gmail.com', '0129635249', '234751236', '28/9/2001', 'Hà Nội', NULL, NULL, 'đã khóa vô thời hạn', 2, 1, '31-05-2022'),
(11, '9426483382', '$2a$08$GOrlH8gX.UkoMHP767Y1me0TxyY2J9NsnJT//LpYwHGx9yLvC.nXK', 'Lý Thất Dạ', 'thatda@gmail.com', '0332145289', '0245874521', '25/12/1990', 'TP HCM', NULL, NULL, 'chờ xác minh', 2, 1, '31-05-2022'),
(12, '2216505115', '$2a$08$InS1zFzgct3fz..onztQAubg4P02dvmgZP5lYlMMnTWrONWY5E7kC', 'Võ Hồng Vy', 'hongvy@gmail.com', '0336521489', '213597412', '12/07/1999', 'Đà Nẵng', NULL, NULL, 'đã xác minh', 2, 1, '31-05-2022'),
(13, '6914543578', '$2a$08$B3HQehfPvkf/Go0GgEaWNOTkcfSvNTwR3HUtSGfpwFYD2d5yIRQBq', 'Giang Bích Thoại', 'bichthoai@gmail.com', '0125874123', '215874563', '01/12/2001', 'TP HCM', NULL, NULL, 'đã khóa vô thời hạn', 2, 1, '31-05-2022'),
(14, '2389086923', '$2a$08$6hThARIKzada2luYbv445.tkKzbxISDs7Gc7fBX1ZRPQx//VOgEUa', 'Mã Ngọc Mai', 'ngocmai@gmail.com', '0124582365', '214587523', '28/9/1995', 'Đà Lạt', NULL, NULL, 'đã xác minh', 2, 1, '31-05-2022'),
(15, '9298720673', '$2a$08$.VUNFcN67WinkNF91qoS4uFqu6IrhCG8hRqDJFZSfKyP2wVVVt0Lq', 'Trần Thi Đan', 'thidan@gmail.com', '0214523658', '214236589', '12/04/1996', 'TP HCM', NULL, NULL, 'đã vô hiệu hóa', 2, 1, '31-05-2022'),
(16, '1072449746', '$2a$08$mFpq5ARUxlDAFgBTGUfMXubi1Vl/SyF/EBfVe2jxVl.KI/LBxEAMK', 'Đào Xuân Mai', 'xuanmai@gmail.com', '0124852145', '261423589', '05/01/2001', 'TP HCM', NULL, NULL, 'chờ xác minh', 2, 1, '31-05-2022'),
(17, '6750066225', '$2a$08$ubX1FWgTT7OSRRj4qSGpxuqZrDBNDYeBxr2jl5bl40WfoiMn0Nhqq', 'Đỗ Ngọc Phương Uyên', 'phuonguyen@gmail.com', '0332512456', '215823546', '25/05/1999', 'Bình Phước', NULL, NULL, 'chờ xác minh', 2, 1, '31-05-2022'),
(18, '2735472259', '$2a$08$174E.NyJugnjb6fsIRoVDe4OIyfu/9y1088w5iZburXTjWGzTLxaG', 'Đỗ Ngọc Phương Loan', 'phuongloan@gmail.com', '0223584521', '256842156', '02/09/1995', 'TP HCM', NULL, NULL, 'chờ xác minh', 2, 1, '31-05-2022'),
(19, '5375225247', '$2a$08$CWvSXForfEVSG3W9pq.qgOzHe868Oa0EmHLMEnB87ZqFVd8ihlppS', 'Nguyễn Thị Quỳnh Anh', 'quynhanh@gmail.com', '0331245284', '235142658', '25/03/2001', 'Đồng Nai', NULL, NULL, 'chờ xác minh', 2, 1, '31-05-2022'),
(20, '4474511468', '$2a$08$cuGpnJEHm.jOO2AIlfp7feVL6SSVugrqWD6it/cGIPkATwSnru3FC', 'Phan Tấn Trung', 'tantrung@gmail.com', '0331425684', '215326547', '25/07/1992', 'Cà Mau', NULL, NULL, 'chờ xác minh', 2, 1, '31-05-2022');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `trading`
--

CREATE TABLE `trading` (
  `ma_Giao_Dich` varchar(10) COLLATE utf8_unicode_ci NOT NULL,
  `ma_Khach_Hang` int(10) NOT NULL,
  `money_trading` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `day_trading` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `time_trading` time DEFAULT NULL,
  `trading_type` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `trading_status` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `note_trading` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `trading`
--

INSERT INTO `trading` (`ma_Giao_Dich`, `ma_Khach_Hang`, `money_trading`, `day_trading`, `time_trading`, `trading_type`, `trading_status`, `note_trading`) VALUES
('8Gmqvf', 12, '19000000', '31-05-2022', '20:45:58', 'Rút tiền', 'đang chờ', 'Rút'),
('iEdawa', 7, '100000000', '31-05-2022', '20:38:48', 'Nạp tiền', 'Thành công', NULL),
('kMEyc5', 12, '100000000', '31-05-2022', '20:45:40', 'Nạp tiền', 'Thành công', NULL),
('LQ2dZJ', 7, '100000000', '31-05-2022', '20:38:48', 'Nạp tiền', 'Thành công', NULL),
('wi0hc5', 14, '3150000', '31-05-2022', '20:42:35', 'Rút tiền', 'Thành công', 'Rút tiền'),
('yLu2RK', 14, '5700000', '31-05-2022', '20:42:21', 'Rút tiền', 'đang chờ', 'Rút tiền'),
('ZTlYK1', 14, '200000000', '31-05-2022', '20:41:52', 'Nạp tiền', 'Thành công', NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `trading_card`
--

CREATE TABLE `trading_card` (
  `ma_Giao_Dich` varchar(10) COLLATE utf8_unicode_ci NOT NULL,
  `ma_Khach_Hang` int(10) NOT NULL,
  `card_seri` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `ma_The` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `card_type` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `day_trading` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `time_trading` time DEFAULT NULL,
  `price` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `trading_type` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `trading_status` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `trading_card`
--

INSERT INTO `trading_card` (`ma_Giao_Dich`, `ma_Khach_Hang`, `card_seri`, `ma_The`, `card_type`, `day_trading`, `time_trading`, `price`, `trading_type`, `trading_status`) VALUES
('6qGYY1', 7, '1841735149', '333339631', 'Vinaphone', '31-05-2022', '20:41:01', '50000', 'Thẻ cào', 'Thành công'),
('CQNT6t', 14, '1667376941', '111119717', 'Viettel', '31-05-2022', '20:42:01', '100000', 'Thẻ cào', 'Thành công'),
('DRS0UK', 7, '1228235328', '111118475', 'Viettel', '31-05-2022', '20:40:48', '100000', 'Thẻ cào', 'Thành công'),
('hZwo2e', 14, '1657195294', '111115046', 'Viettel', '31-05-2022', '20:42:01', '100000', 'Thẻ cào', 'Thành công'),
('rCTRO5', 7, '1114444227', '333339710', 'Vinaphone', '31-05-2022', '20:41:01', '50000', 'Thẻ cào', 'Thành công'),
('wQJZQ4', 7, '1072958901', '111115571', 'Viettel', '31-05-2022', '20:40:48', '100000', 'Thẻ cào', 'Thành công'),
('Wy6wZu', 14, '1527723006', '111117998', 'Viettel', '31-05-2022', '20:42:01', '100000', 'Thẻ cào', 'Thành công');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `transfer_trading`
--

CREATE TABLE `transfer_trading` (
  `ma_Giao_Dich` varchar(10) COLLATE utf8_unicode_ci NOT NULL,
  `ma_Khach_Hang` int(10) NOT NULL,
  `ma_Nguoi_Nhan` int(10) NOT NULL,
  `ten_Nguoi_Nhan` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `sdt_Nguoi_Nhan` varchar(15) COLLATE utf8_unicode_ci NOT NULL,
  `money_transfer` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `day_trading` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `time_trading` time DEFAULT NULL,
  `trading_type` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `trading_status` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `note_trading` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `transfer_trading`
--

INSERT INTO `transfer_trading` (`ma_Giao_Dich`, `ma_Khach_Hang`, `ma_Nguoi_Nhan`, `ten_Nguoi_Nhan`, `sdt_Nguoi_Nhan`, `money_transfer`, `day_trading`, `time_trading`, `trading_type`, `trading_status`, `note_trading`) VALUES
('03ORCr', 12, 14, 'Mã Ngọc Mai', '0124582365', '20000000', '31-05-2022', '20:47:38', 'Chuyển tiền', 'Đang chờ', 'Đóng phí'),
('6m398r', 7, 12, 'Võ Hồng Vy', '0336521489', '10000000', '31-05-2022', '20:39:33', 'Chuyển tiền', 'Đang chờ', 'Chuyển tiền '),
('dkfgb', 288881, 1245587, 'Trung Hậu', '02145789555', '1000000', '30-5-2020', '12:00:00', 'Chuyển tiền', 'chờ duyệt', 'Lương FE'),
('lFk8bk', 14, 12, 'Võ Hồng Vy', '0336521489', '4000000', '31-05-2022', '20:43:41', 'Chuyển tiền', 'Thành công', 'Chuyển tiền'),
('Yyjgtu', 7, 12, 'Võ Hồng Vy', '0336521489', '3000000', '31-05-2022', '20:40:39', 'Chuyển tiền', 'Thành công', 'Trả tiền');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `account`
--
ALTER TABLE `account`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `lockaccount`
--
ALTER TABLE `lockaccount`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `otp`
--
ALTER TABLE `otp`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `register`
--
ALTER TABLE `register`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `trading`
--
ALTER TABLE `trading`
  ADD PRIMARY KEY (`ma_Giao_Dich`);

--
-- Chỉ mục cho bảng `trading_card`
--
ALTER TABLE `trading_card`
  ADD PRIMARY KEY (`ma_Giao_Dich`);

--
-- Chỉ mục cho bảng `transfer_trading`
--
ALTER TABLE `transfer_trading`
  ADD PRIMARY KEY (`ma_Giao_Dich`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `account`
--
ALTER TABLE `account`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT cho bảng `lockaccount`
--
ALTER TABLE `lockaccount`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT cho bảng `otp`
--
ALTER TABLE `otp`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT cho bảng `register`
--
ALTER TABLE `register`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;
COMMIT;

