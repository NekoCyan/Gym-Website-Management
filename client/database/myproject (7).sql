-- phpMyAdmin SQL Dump
-- version 5.1.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 02, 2021 at 03:09 PM
-- Server version: 10.4.18-MariaDB
-- PHP Version: 7.3.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `myproject`
--

-- --------------------------------------------------------

--
-- Table structure for table `attendance_master`
--

CREATE TABLE `attendance_master` (
  `Attendance_Id` int(5) NOT NULL,
  `User_Id` int(5) NOT NULL,
  `A_Date` date NOT NULL,
  `Time_in` time NOT NULL,
  `Time_out` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `attendance_master`
--

INSERT INTO `attendance_master` (`Attendance_Id`, `User_Id`, `A_Date`, `Time_in`, `Time_out`) VALUES
(4001, 1, '2021-02-02', '04:00:00', '05:30:45'),
(4002, 7, '2021-02-02', '04:17:12', '06:44:12'),
(4003, 15, '2021-02-02', '06:01:22', '08:30:55'),
(4004, 13, '2021-03-03', '09:37:03', '10:37:03'),
(4006, 6, '2021-01-05', '05:08:11', '07:00:10'),
(4007, 11, '2021-03-16', '04:03:22', '06:15:33'),
(4008, 2, '2021-03-04', '08:12:10', '10:11:20'),
(4009, 5, '2021-03-14', '11:01:22', '01:30:22'),
(4010, 8, '2021-01-21', '09:11:00', '11:00:00'),
(4011, 4, '2021-03-03', '12:00:12', '01:02:00'),
(4012, 9, '2021-03-10', '06:12:30', '08:45:33'),
(4013, 10, '2021-03-12', '06:30:00', '04:45:33'),
(4014, 11, '2021-03-05', '04:56:00', '11:00:07'),
(4015, 12, '2021-03-08', '07:05:06', '09:00:12'),
(4016, 13, '2021-02-11', '04:45:06', '06:50:11'),
(4017, 14, '2021-02-28', '05:15:33', '08:33:12'),
(4018, 14, '2021-02-13', '04:05:12', '07:11:33'),
(4019, 6, '2021-03-04', '02:12:12', '04:00:00'),
(4020, 5, '2021-03-08', '07:10:11', '09:12:38');

-- --------------------------------------------------------

--
-- Stand-in structure for view `attendance_report`
-- (See below for the actual view)
--
CREATE TABLE `attendance_report` (
`User_Id` int(5)
,`User_Type` varchar(7)
,`User_Name` varchar(25)
,`Gender` varchar(1)
,`A_Date` date
,`Time_in` time
,`Time_out` time
);

-- --------------------------------------------------------

--
-- Table structure for table `feedback_master`
--

CREATE TABLE `feedback_master` (
  `Feedback_Id` int(5) NOT NULL,
  `User_Id` int(5) NOT NULL,
  `Details` text NOT NULL,
  `Ratings` int(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `feedback_master`
--

INSERT INTO `feedback_master` (`Feedback_Id`, `User_Id`, `Details`, `Ratings`) VALUES
(101, 1, 'Dynamo Fitness has been awesome to me. Their trainers are exceptional, the overall vibe is great and I have had nothing but good experiences. I definitely recommend them to my friends and family.', 9),
(102, 5, ' My experience with Dynamo Fitness has been and continues to be perfect. Convenience at its finest. A special shout out to one of the trainers Sanjana singh she’s always been very welcoming, kind and generous.', 8),
(103, 12, 'First time joining a training facility like Dynamo Fitness and I have to say, what an experience it has been! From the work outs, to the amazing trainers! Always have been a shy person when it comes to working out with other people but the vibes from Dynamo Fitness east village are just something else! Thank you.', 8),
(104, 11, 'Dynamo fitness is hands-down my favorite gym. The workouts are always new and engaging and the instructors care about not only getting you to sweat, but also making sure you are staying safe.', 10),
(105, 2, 'Results are amazing. Community feels really good. Classes and platforms are creative and constantly changing and evolving. The coaches really care about being there for us.', 7),
(106, 7, 'YOU HAVE EVERYTHING ONE COULD WANT IN A GYM AS WELL AS A GREAT LOCATION, GREAT STAFF, GREAT OWNER!”', 9),
(107, 9, '“GREAT SELECTION OF EQUIPMENT FRIENDLY STAFF PARKING!”\r\n\r\n', 7),
(108, 8, '“HIGH QUALITY, DIVERSE GROUP CLASSES; EQUIPMENTS IN GOOD CONDITION; PEOPLE ARE NICE TO ONE ANOTHER LIKE IN A FRIENDLY COMMUNITY ”', 8),
(109, 13, ' Excellent personal training. Trainers who really care and go above and beyond to help you achieve your goals. Highly recommended!', 10),
(110, 15, ' The workouts are fun, the fellow members are inspiring, the workouts are led by personal trainers who give hands on instant feedback and adjustments during the workouts and just the right amount of encouragement. The music is blaring and the atmosphere is awesome. You will not do the same workout twice and if you go you will see the results no question. It’s a life changing gym experience and I recommend it highly to all my fiends and family.', 9);

-- --------------------------------------------------------

--
-- Stand-in structure for view `feedback_report`
-- (See below for the actual view)
--
CREATE TABLE `feedback_report` (
`User_Id` int(5)
,`User_Name` varchar(25)
,`Gender` varchar(1)
,`Email` varchar(30)
,`Mobile` bigint(10)
,`Details` text
,`Ratings` int(2)
);

-- --------------------------------------------------------

--
-- Table structure for table `membership_master`
--

CREATE TABLE `membership_master` (
  `Membership_Id` int(5) NOT NULL,
  `User_Id` int(5) NOT NULL,
  `Plan_Id` int(5) NOT NULL,
  `Start_Date` date NOT NULL,
  `End_Date` date NOT NULL,
  `Amount` int(5) NOT NULL,
  `Details` text NOT NULL,
  `Membership_Status` enum('Approved','Not Approved') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `membership_master`
--

INSERT INTO `membership_master` (`Membership_Id`, `User_Id`, `Plan_Id`, `Start_Date`, `End_Date`, `Amount`, `Details`, `Membership_Status`) VALUES
(1001, 1, 1, '2021-03-20', '2021-04-20', 1200, 'Free Hand\r\nGym Fitness\r\nWeight Loss\r\nPersonal Trainer', 'Approved'),
(1002, 2, 2, '2021-03-15', '2021-09-15', 6000, 'Free Hand\r\nGym Fitness\r\nWeight Loss\r\nPersonal Trainer', 'Approved'),
(1003, 5, 1, '2021-03-17', '2021-04-17', 1200, 'Free Hand\r\nGym Fitness\r\nWeight Loss\r\nPersonal Trainer', 'Approved'),
(1004, 7, 3, '2021-03-25', '2022-03-25', 10000, 'Free Hand\r\nGym Fitness\r\nWeight Loss\r\nPersonal Trainer', 'Approved'),
(1005, 8, 2, '2021-03-30', '2021-09-30', 6000, 'Free Hand\r\nGym Fitness\r\nWeight Loss\r\nPersonal Trainer', 'Not Approved'),
(1006, 9, 3, '2021-02-24', '2022-02-24', 10000, 'Free Hand\r\nGym Fitness\r\nWeight Loss\r\nPersonal Trainer', 'Approved'),
(1007, 11, 2, '2021-03-01', '2021-09-01', 6000, 'Free Hand\r\nGym Fitness\r\nWeight Loss\r\nPersonal Trainer', 'Not Approved'),
(1008, 12, 1, '2021-03-05', '2021-04-05', 1200, 'Free Hand\r\nGym Fitness\r\nWeight Loss\r\nPersonal Trainer', 'Approved'),
(1009, 13, 1, '2021-04-01', '2021-05-01', 1200, 'Free Hand\r\nGym Fitness\r\nWeight Loss\r\nPersonal Trainer', 'Approved'),
(1010, 15, 3, '2021-04-10', '2022-04-10', 10000, 'Free Hand\r\nGym Fitness\r\nWeight Loss\r\nPersonal Trainer', 'Approved');

-- --------------------------------------------------------

--
-- Table structure for table `order_details`
--

CREATE TABLE `order_details` (
  `Details_Id` int(5) NOT NULL,
  `Order_Id` int(5) NOT NULL,
  `Product_Id` int(5) NOT NULL,
  `Qty` int(2) NOT NULL,
  `Price` int(5) NOT NULL,
  `Tot_amt` int(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `order_details`
--

INSERT INTO `order_details` (`Details_Id`, `Order_Id`, `Product_Id`, `Qty`, `Price`, `Tot_amt`) VALUES
(101, 1111, 1, 1, 150, 150),
(102, 1111, 5, 1, 450, 450),
(103, 1112, 8, 2, 250, 500),
(104, 1114, 7, 3, 300, 900),
(105, 1116, 1, 2, 150, 300),
(106, 1119, 9, 1, 1000, 1000),
(107, 1117, 3, 2, 500, 1000),
(108, 1113, 5, 1, 450, 450),
(109, 1115, 2, 1, 900, 900),
(110, 1118, 7, 2, 300, 600),
(111, 1120, 6, 3, 150, 450),
(112, 1120, 10, 3, 400, 1200);

-- --------------------------------------------------------

--
-- Table structure for table `order_master`
--

CREATE TABLE `order_master` (
  `Order_Id` int(5) NOT NULL,
  `User_Id` int(5) NOT NULL,
  `Ord_Date` date NOT NULL,
  `Delivery_Date` date NOT NULL,
  `Delivery_Status` enum('Ordered','Shipped','Delivered') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `order_master`
--

INSERT INTO `order_master` (`Order_Id`, `User_Id`, `Ord_Date`, `Delivery_Date`, `Delivery_Status`) VALUES
(1111, 1, '2021-03-26', '2021-03-29', 'Ordered'),
(1112, 2, '2021-03-20', '2021-03-22', 'Shipped'),
(1113, 5, '2021-03-24', '2021-03-26', 'Delivered'),
(1114, 11, '2021-03-26', '2021-03-28', 'Ordered'),
(1115, 7, '2021-03-23', '2021-03-25', 'Delivered'),
(1116, 8, '2021-03-20', '2021-03-22', 'Shipped'),
(1117, 12, '2021-03-26', '2021-03-28', 'Ordered'),
(1118, 13, '2021-03-20', '2021-03-22', 'Delivered'),
(1119, 15, '2021-03-25', '2021-03-27', 'Delivered'),
(1120, 9, '2021-03-28', '2021-03-30', 'Ordered');

-- --------------------------------------------------------

--
-- Table structure for table `payment_master`
--

CREATE TABLE `payment_master` (
  `Payment_Id` int(5) NOT NULL,
  `Membership_Id` int(5) NOT NULL,
  `Amount` int(5) NOT NULL,
  `Method` varchar(15) NOT NULL,
  `Transaction_no` varchar(40) NOT NULL,
  `Payment_status` enum('Approved','Not Approved') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `payment_master`
--

INSERT INTO `payment_master` (`Payment_Id`, `Membership_Id`, `Amount`, `Method`, `Transaction_no`, `Payment_status`) VALUES
(111, 1001, 1200, 'Google Pay', 'j6787dfs67f7u8', 'Approved'),
(112, 1002, 6000, 'Paytm', '567sd786788v', 'Approved'),
(113, 1003, 1200, 'Cash', '78979fdsf576', 'Not Approved'),
(114, 1004, 10000, 'Google Pay', 'jdsfjl67867sf86', 'Approved'),
(115, 1005, 6000, 'Phonpe', 'bdjcbj7ds86f786', 'Not Approved'),
(116, 1006, 10000, 'Cash', 'dsjkfbk687ds6f', 'Approved'),
(117, 1007, 6000, 'Paytm', '678678d68769', 'Not Approved'),
(118, 1008, 1200, 'Google Pay', '97884397894g', 'Approved'),
(119, 1009, 1200, 'Phonepe', 'jciods68ds7f68', 'Not Approved'),
(120, 1010, 10000, 'Google Pay', 'nkdsnv677v8ds6', 'Approved');

-- --------------------------------------------------------

--
-- Table structure for table `plan_master`
--

CREATE TABLE `plan_master` (
  `Plan_Id` int(5) NOT NULL,
  `Title` varchar(15) NOT NULL,
  `Details` text NOT NULL,
  `Price` int(5) NOT NULL,
  `Duration` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `plan_master`
--

INSERT INTO `plan_master` (`Plan_Id`, `Title`, `Details`, `Price`, `Duration`) VALUES
(1, 'Basic Plan', 'For 1 Month ₹ 1200\r\n\r\nFree Hand\r\nGym Fitness\r\nWeight Loss\r\nPersonal Trainer', 1200, '1 Month'),
(2, 'Standard Plan', 'For 6 Month ₹ 60000\r\n\r\nFree Hand\r\nGym Fitness\r\nWeight Loss\r\nPersonal Trainer', 6000, '6 Months'),
(3, 'Ultimate Plan', 'For 1 Year  ₹ 10000\r\n\r\nFree Hand\r\nGym Fitness\r\nWeight Loss\r\nPersonal Trainer', 10000, '12 Months');

-- --------------------------------------------------------

--
-- Stand-in structure for view `plan_report`
-- (See below for the actual view)
--
CREATE TABLE `plan_report` (
`User_Name` varchar(25)
,`User_Id` int(5)
,`Membership_Id` int(5)
,`Start_Date` date
,`End_Date` date
,`Amount` int(5)
,`Title` varchar(15)
,`Gender` varchar(1)
);

-- --------------------------------------------------------

--
-- Table structure for table `product_master`
--

CREATE TABLE `product_master` (
  `Product_Id` int(5) NOT NULL,
  `Product_Name` varchar(25) NOT NULL,
  `Qty` int(2) NOT NULL,
  `Details` text NOT NULL,
  `Price` int(5) NOT NULL,
  `Product_Image` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `product_master`
--

INSERT INTO `product_master` (`Product_Id`, `Product_Name`, `Qty`, `Details`, `Price`, `Product_Image`) VALUES
(1, 'Dumbells', 15, 'Aurion M1 pvc Dumbell (1kg x 2)', 150, 'dumbell.jpg'),
(2, 'Protein', 20, 'MuscleBlaze Biozyme 500Kg', 900, 'protein.jpg'),
(3, 'T-shirt', 25, 'ADDIZ Solid Regular Fit Quick Dry Gym T-Shirt', 500, 'T-shirt.jpg'),
(4, 'Protein', 10, 'Oziva Organic Plant Protein- 500gm', 750, 'Protein2.jpg'),
(5, 'Men\'s Tracksuit', 15, 'Nike Solid Men Tracksuit- M size', 450, 'MenTracksuit.jpg'),
(6, 'Waist Belt', 30, 'Aurion Genuine Leather Weight Lifting Belt\r\nSize- M - 71cm-81cm', 150, 'Waist_belt_M.jpg'),
(7, 'Push Up Stands', 15, 'Boldfit Push Up Bar Stand For Gym and Home exercise ', 300, 'Push_up_bar'),
(8, 'Hand Grip Strengthener', 20, 'Strauss Adjustable Hand Grip', 250, 'Hand_Grip.jpg'),
(9, 'Dumbbell-6kg', 5, 'AmazonBasics Quality Solid Cast-Iron Construction Dumbbell- 6 Kg(15-pound)', 1000, 'Dumbbell.jpg'),
(10, 'Yoga Mat', 15, 'Fitness Mantra Yoga Mat With 6mm thickness', 400, 'Yogamat.jpg');

-- --------------------------------------------------------

--
-- Stand-in structure for view `product_order_report`
-- (See below for the actual view)
--
CREATE TABLE `product_order_report` (
`Order_Id` int(5)
,`User_Id` int(5)
,`Product_Name` varchar(25)
,`Qty` int(2)
,`Delivery_Status` enum('Ordered','Shipped','Delivered')
);

-- --------------------------------------------------------

--
-- Table structure for table `trainer_details`
--

CREATE TABLE `trainer_details` (
  `Trainer_Id` int(5) NOT NULL,
  `User_Id` int(5) NOT NULL,
  `Salary` int(5) NOT NULL,
  `Details` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `trainer_details`
--

INSERT INTO `trainer_details` (`Trainer_Id`, `User_Id`, `Salary`, `Details`) VALUES
(101, 4, 20000, 'Specialization in Cardio Training \r\n3 Years Experience\r\n '),
(102, 3, 15000, 'Yoga Instructor\r\n5 Years Experience'),
(103, 6, 20000, 'Specialization in Gymnastics, Parkour and Free Running.\r\n6 Years Experience.\r\n '),
(104, 10, 10000, 'Diet and Nutrition Expert. Yoga Instructor. \r\n3 years Experience'),
(105, 14, 20000, 'Expertise in Aerobic Exercises, stretching and muscle conditioning.\r\n5 Years Experience');

-- --------------------------------------------------------

--
-- Table structure for table `user_master`
--

CREATE TABLE `user_master` (
  `User_Id` int(5) NOT NULL,
  `Type_Id` int(5) NOT NULL,
  `User_Name` varchar(25) NOT NULL,
  `Gender` varchar(1) NOT NULL,
  `Email` varchar(30) NOT NULL,
  `Password` varchar(16) NOT NULL,
  `Address` varchar(150) NOT NULL,
  `Mobile` bigint(10) NOT NULL,
  `Photo` varchar(100) NOT NULL,
  `ID_Proof` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user_master`
--

INSERT INTO `user_master` (`User_Id`, `Type_Id`, `User_Name`, `Gender`, `Email`, `Password`, `Address`, `Mobile`, `Photo`, `ID_Proof`) VALUES
(1, 1, 'Harsh Trivedi', 'M', 'Htrivedi@gmail.com', 'Harsh@123', 'B-2, Jivisha Apartment, Navrangpura, Ahmedabad', 9856743201, 'Harsh.jpg', 'id.pdf'),
(2, 1, 'Prajay Trivedi', 'M', 'trivedi.prajay@gmail.com', 'Prajay', 'C-5, Gokul Galaxy, Naranpura, Ahmedabad', 7554566554, 'prajay.jpg', 'pid.pdf'),
(3, 2, 'Rahul Sharma', 'M', 'RahulS@gmail.com', 'Rs@2345', 'D-18, Anand Mangal, Bopal, Ahmedabad', 8909666546, 'rahul.jpg', 'rid.pdf'),
(4, 2, 'Rohit Kumar', 'M', 'Rkumar123@gmail.com', 'rkumar@123', 'A12, Floral Apartment, Paldi, Ahmedabad', 9765456789, 'Rkumar.jpg', 'Rkid.pdf'),
(5, 1, 'Priyanka Mehta', 'F', 'Priyanka.mehta@gmail.com', 'mehtap@321', 'Biden Villa, Vastrapur, Ahmedabad', 8246783902, 'prmeh.jpg', 'prid.pdf'),
(6, 2, 'Mahendra Rajput', 'M', 'rajputmahendra212@gmail.com', 'Rajput@1', '45/250, mangalam complex, odhav, Ahmedabad', 7896646160, 'myimage.jpg', 'proof_id.pdf'),
(7, 1, 'Akshay Jain', 'M', 'akjain114@gmail.com', 'dui@aj12', '12/24, Godrej city, Ahmedabad', 8974563214, 'akshay.jpg', 'proof.pdf'),
(8, 1, 'Ritika shah', 'F', 'shahritika@gmail.com', 'shahrits1114', '23, jamanadas street, new cloth market, Ahmedabad', 7899456626, 'mypic.jpg', 'id.pdf'),
(9, 1, 'Chetan seth', 'M', 'chtnseth@gmail.com', 'c@1234seth', '333, kothari Haveli, Mahalaxmi Chowk, Ahmedabad', 6458795422, 'charvi.jpg', 'seth.pdf'),
(10, 2, 'Sanjana Singh', 'F', 'singhsanjana11@gmail.com', 'sanju@singh44', '44, anjani appartments, Bodakdev, Ahmedabad', 7893444461, 'sanju.jpg', 'ss.pdf'),
(11, 1, 'Mohit Yadav', 'M', 'Mohity12@gmail.com', 'mohit@3453', 'D-12, Gokuldham Society, Maninagar, Ahmedabad ', 8794532671, 'Mohit.jpg', 'mid.pdf'),
(12, 1, 'Saumya Kothari', 'F', 'Saumya18@gmail.com', 'Saumya@18', 'D-4, Laxmi Vihar, Memnagar, Ahmedabad', 8945672340, 'Saumya.jpg', 'sid.pdf'),
(13, 1, 'Khushi Sharma', 'F', 'Khushisharma12gmail.com', 'sharma@124', 'Golden Villa, Science City, Ahmedabad', 9413657898, 'Khushi.jpg', 'kid.pdf'),
(14, 2, 'Mukesh Jain', 'M', 'Mukeshj13@gmail.com', 'Mukesh@13', 'B-15, Meera Apartment, Thaltej, Ahmedabad', 7845649207, 'Mukesh.jpg', 'Mukesh.pdf'),
(15, 1, 'Parth Solanki', 'M', 'Parths45@gmail.com', 'Parth@1234', 'A-1, Five Star Society, C.G. Road, Navrangpura, Ahmedabad', 9603417689, 'Parth.jpg', 'Parth.Pdf'),
(16, 3, 'Dynamo Fitness', 'M', 'kaushikj467@gmail.com', 'kaushik', '10th floor, Galaxy Appartments, Navrangpura, Ahmedabad', 9998110921, 'Admin.jpg', 'Admin.pdf'),
(19, 1, 'Divya', 'F', 'd@gmail.com', '123456', 'Banswara', 9425687932, 'score_card.png', 'Sem5 Result.pdf');

-- --------------------------------------------------------

--
-- Stand-in structure for view `user_reports`
-- (See below for the actual view)
--
CREATE TABLE `user_reports` (
`User_Id` int(5)
,`User_Type` varchar(7)
,`User_Name` varchar(25)
,`Gender` varchar(1)
,`Email` varchar(30)
,`Address` varchar(150)
,`Mobile` bigint(10)
);

-- --------------------------------------------------------

--
-- Table structure for table `user_type`
--

CREATE TABLE `user_type` (
  `Type_Id` int(5) NOT NULL,
  `User_Type` varchar(7) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user_type`
--

INSERT INTO `user_type` (`Type_Id`, `User_Type`) VALUES
(1, 'Member'),
(2, 'Trainer'),
(3, 'Admin');

-- --------------------------------------------------------

--
-- Table structure for table `workout_master`
--

CREATE TABLE `workout_master` (
  `Workout_Id` int(5) NOT NULL,
  `User_Id` int(5) NOT NULL,
  `Diet_Chart` varchar(100) NOT NULL,
  `Workout_Schedule` varchar(100) NOT NULL,
  `Videos` varchar(100) NOT NULL,
  `Rewards` int(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `workout_master`
--

INSERT INTO `workout_master` (`Workout_Id`, `User_Id`, `Diet_Chart`, `Workout_Schedule`, `Videos`, `Rewards`) VALUES
(1101, 1, 'Harsh_Diet_chart.pdf', 'Harsh_Workout_Schedule.pdf', 'Harsh_Video.mp4', 10),
(1102, 2, 'Prajay_Diet_Chart.pdf', 'Prajay_Workout_Schedule.pdf', 'Prajay_Video.mp4', 20),
(1103, 5, 'Priyanka_Diet_Chart.pdf', 'Priyanka_Workout_Schedule.pdf', 'Priyanka_video.mp4', 5),
(1104, 7, 'Akshay_Diet_Chart.pdf', 'Akshay_Workout_Schedule.pdf', 'Akshay_video.mp4', 15),
(1105, 8, 'Ritika_Diet_Chart.pdf', 'Ritika_Workout_Schedule.pdf', 'Ritika_Video.mp4', 25),
(1106, 9, 'Chetan_Diet_Chart.pdf', 'Chetan_Workout_Schedule.pdf', 'Chetan_video.mp4', 10),
(1107, 11, 'Mohit_Diet_Chart.pdf', 'Mohit_Schedule.pdf', 'Mohit_Videos.mp4', 15),
(1108, 12, 'Saumya_Diet_Chart.pdf', 'Saumya_Workout_Schedule.pdf', 'Saumya_Video.mp4', 20),
(1109, 13, 'Khushi_Diet_Chart.pdf', 'Khushi_Workout_Schedule.pdf', 'Khushi_Video.mp4', 5),
(1110, 15, 'Parth_Diet_Chart.pdf', 'Parth_Workout_Schedule.pdf', 'Parth_Video.mp4', 10);

-- --------------------------------------------------------

--
-- Structure for view `attendance_report`
--
DROP TABLE IF EXISTS `attendance_report`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `attendance_report`  AS SELECT `user_master`.`User_Id` AS `User_Id`, `user_type`.`User_Type` AS `User_Type`, `user_master`.`User_Name` AS `User_Name`, `user_master`.`Gender` AS `Gender`, `attendance_master`.`A_Date` AS `A_Date`, `attendance_master`.`Time_in` AS `Time_in`, `attendance_master`.`Time_out` AS `Time_out` FROM ((`attendance_master` join `user_master` on(`attendance_master`.`User_Id` = `user_master`.`User_Id`)) join `user_type` on(`user_master`.`Type_Id` = `user_type`.`Type_Id`)) ;

-- --------------------------------------------------------

--
-- Structure for view `feedback_report`
--
DROP TABLE IF EXISTS `feedback_report`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `feedback_report`  AS SELECT `user_master`.`User_Id` AS `User_Id`, `user_master`.`User_Name` AS `User_Name`, `user_master`.`Gender` AS `Gender`, `user_master`.`Email` AS `Email`, `user_master`.`Mobile` AS `Mobile`, `feedback_master`.`Details` AS `Details`, `feedback_master`.`Ratings` AS `Ratings` FROM (`feedback_master` join `user_master` on(`feedback_master`.`User_Id` = `user_master`.`User_Id`)) ;

-- --------------------------------------------------------

--
-- Structure for view `plan_report`
--
DROP TABLE IF EXISTS `plan_report`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `plan_report`  AS SELECT `user_master`.`User_Name` AS `User_Name`, `user_master`.`User_Id` AS `User_Id`, `membership_master`.`Membership_Id` AS `Membership_Id`, `membership_master`.`Start_Date` AS `Start_Date`, `membership_master`.`End_Date` AS `End_Date`, `membership_master`.`Amount` AS `Amount`, `plan_master`.`Title` AS `Title`, `user_master`.`Gender` AS `Gender` FROM ((`membership_master` join `plan_master` on(`plan_master`.`Plan_Id` = `membership_master`.`Plan_Id`)) join `user_master` on(`user_master`.`User_Id` = `membership_master`.`User_Id`)) ;

-- --------------------------------------------------------

--
-- Structure for view `product_order_report`
--
DROP TABLE IF EXISTS `product_order_report`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `product_order_report`  AS SELECT `order_master`.`Order_Id` AS `Order_Id`, `order_master`.`User_Id` AS `User_Id`, `product_master`.`Product_Name` AS `Product_Name`, `order_details`.`Qty` AS `Qty`, `order_master`.`Delivery_Status` AS `Delivery_Status` FROM ((`product_master` join `order_details` on(`product_master`.`Product_Id` = `order_details`.`Product_Id`)) join `order_master` on(`order_master`.`Order_Id` = `order_details`.`Order_Id`)) ;

-- --------------------------------------------------------

--
-- Structure for view `user_reports`
--
DROP TABLE IF EXISTS `user_reports`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `user_reports`  AS SELECT `user_master`.`User_Id` AS `User_Id`, `user_type`.`User_Type` AS `User_Type`, `user_master`.`User_Name` AS `User_Name`, `user_master`.`Gender` AS `Gender`, `user_master`.`Email` AS `Email`, `user_master`.`Address` AS `Address`, `user_master`.`Mobile` AS `Mobile` FROM (`user_master` join `user_type` on(`user_type`.`Type_Id` = `user_master`.`Type_Id`)) ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `attendance_master`
--
ALTER TABLE `attendance_master`
  ADD PRIMARY KEY (`Attendance_Id`),
  ADD KEY `User_Id` (`User_Id`);

--
-- Indexes for table `feedback_master`
--
ALTER TABLE `feedback_master`
  ADD PRIMARY KEY (`Feedback_Id`),
  ADD KEY `User_Id` (`User_Id`);

--
-- Indexes for table `membership_master`
--
ALTER TABLE `membership_master`
  ADD PRIMARY KEY (`Membership_Id`),
  ADD KEY `User_Id` (`User_Id`),
  ADD KEY `Plan_Id` (`Plan_Id`);

--
-- Indexes for table `order_details`
--
ALTER TABLE `order_details`
  ADD PRIMARY KEY (`Details_Id`),
  ADD KEY `Order_Id` (`Order_Id`),
  ADD KEY `Product_Id` (`Product_Id`);

--
-- Indexes for table `order_master`
--
ALTER TABLE `order_master`
  ADD PRIMARY KEY (`Order_Id`),
  ADD KEY `User_Id` (`User_Id`);

--
-- Indexes for table `payment_master`
--
ALTER TABLE `payment_master`
  ADD PRIMARY KEY (`Payment_Id`),
  ADD KEY `Membership_Id` (`Membership_Id`);

--
-- Indexes for table `plan_master`
--
ALTER TABLE `plan_master`
  ADD PRIMARY KEY (`Plan_Id`);

--
-- Indexes for table `product_master`
--
ALTER TABLE `product_master`
  ADD PRIMARY KEY (`Product_Id`);

--
-- Indexes for table `trainer_details`
--
ALTER TABLE `trainer_details`
  ADD PRIMARY KEY (`Trainer_Id`),
  ADD KEY `User_Id` (`User_Id`);

--
-- Indexes for table `user_master`
--
ALTER TABLE `user_master`
  ADD PRIMARY KEY (`User_Id`) USING BTREE,
  ADD UNIQUE KEY `Email` (`Email`),
  ADD UNIQUE KEY `Password` (`Password`),
  ADD KEY `Type_Id` (`Type_Id`);

--
-- Indexes for table `user_type`
--
ALTER TABLE `user_type`
  ADD PRIMARY KEY (`Type_Id`);

--
-- Indexes for table `workout_master`
--
ALTER TABLE `workout_master`
  ADD PRIMARY KEY (`Workout_Id`),
  ADD KEY `User_Id` (`User_Id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `attendance_master`
--
ALTER TABLE `attendance_master`
  MODIFY `Attendance_Id` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4021;

--
-- AUTO_INCREMENT for table `feedback_master`
--
ALTER TABLE `feedback_master`
  MODIFY `Feedback_Id` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=111;

--
-- AUTO_INCREMENT for table `membership_master`
--
ALTER TABLE `membership_master`
  MODIFY `Membership_Id` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1012;

--
-- AUTO_INCREMENT for table `order_details`
--
ALTER TABLE `order_details`
  MODIFY `Details_Id` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=118;

--
-- AUTO_INCREMENT for table `order_master`
--
ALTER TABLE `order_master`
  MODIFY `Order_Id` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1121;

--
-- AUTO_INCREMENT for table `payment_master`
--
ALTER TABLE `payment_master`
  MODIFY `Payment_Id` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=121;

--
-- AUTO_INCREMENT for table `plan_master`
--
ALTER TABLE `plan_master`
  MODIFY `Plan_Id` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `product_master`
--
ALTER TABLE `product_master`
  MODIFY `Product_Id` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `trainer_details`
--
ALTER TABLE `trainer_details`
  MODIFY `Trainer_Id` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=106;

--
-- AUTO_INCREMENT for table `user_master`
--
ALTER TABLE `user_master`
  MODIFY `User_Id` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `user_type`
--
ALTER TABLE `user_type`
  MODIFY `Type_Id` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `workout_master`
--
ALTER TABLE `workout_master`
  MODIFY `Workout_Id` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1111;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `attendance_master`
--
ALTER TABLE `attendance_master`
  ADD CONSTRAINT `attendance_master_ibfk_1` FOREIGN KEY (`User_Id`) REFERENCES `user_master` (`User_Id`);

--
-- Constraints for table `feedback_master`
--
ALTER TABLE `feedback_master`
  ADD CONSTRAINT `feedback_master_ibfk_1` FOREIGN KEY (`User_Id`) REFERENCES `user_master` (`User_Id`);

--
-- Constraints for table `membership_master`
--
ALTER TABLE `membership_master`
  ADD CONSTRAINT `membership_master_ibfk_1` FOREIGN KEY (`User_Id`) REFERENCES `user_master` (`User_Id`),
  ADD CONSTRAINT `membership_master_ibfk_2` FOREIGN KEY (`Plan_Id`) REFERENCES `plan_master` (`Plan_Id`);

--
-- Constraints for table `order_details`
--
ALTER TABLE `order_details`
  ADD CONSTRAINT `order_details_ibfk_1` FOREIGN KEY (`Order_Id`) REFERENCES `order_master` (`Order_Id`),
  ADD CONSTRAINT `order_details_ibfk_2` FOREIGN KEY (`Product_Id`) REFERENCES `product_master` (`Product_Id`);

--
-- Constraints for table `order_master`
--
ALTER TABLE `order_master`
  ADD CONSTRAINT `order_master_ibfk_1` FOREIGN KEY (`User_Id`) REFERENCES `user_master` (`User_Id`);

--
-- Constraints for table `payment_master`
--
ALTER TABLE `payment_master`
  ADD CONSTRAINT `payment_master_ibfk_1` FOREIGN KEY (`Membership_Id`) REFERENCES `membership_master` (`Membership_Id`);

--
-- Constraints for table `trainer_details`
--
ALTER TABLE `trainer_details`
  ADD CONSTRAINT `trainer_details_ibfk_1` FOREIGN KEY (`User_Id`) REFERENCES `user_master` (`User_Id`);

--
-- Constraints for table `user_master`
--
ALTER TABLE `user_master`
  ADD CONSTRAINT `user_master_ibfk_1` FOREIGN KEY (`Type_Id`) REFERENCES `user_type` (`Type_Id`);

--
-- Constraints for table `workout_master`
--
ALTER TABLE `workout_master`
  ADD CONSTRAINT `workout_master_ibfk_1` FOREIGN KEY (`User_Id`) REFERENCES `user_master` (`User_Id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
