USE [master]
GO

IF (EXISTS (SELECT name FROM master.dbo.sysdatabases WHERE ('[' + name + ']' = N'LearnMoreDB'OR name = N'LearnMoreDB')))
DROP DATABASE LearnMoreDB

--creating database

CREATE DATABASE LearnMoreDB
GO

USE LearnMoreDB
GO

--checking for tables existence
IF OBJECT_ID('Courses')  IS NOT NULL
DROP TABLE Courses
GO


IF OBJECT_ID('Categories')  IS NOT NULL
DROP TABLE Categories
GO


IF OBJECT_ID('Users')  IS NOT NULL
DROP TABLE Users
GO

IF OBJECT_ID('Instructors')  IS NOT NULL
DROP TABLE Instructors
GO

IF OBJECT_ID('Admins')  IS NOT NULL
DROP TABLE Admins
GO

IF OBJECT_ID('AuthUsers')  IS NOT NULL
DROP TABLE AuthUsers
GO


IF OBJECT_ID('MyLearnings')  IS NOT NULL
DROP TABLE MyLearnings
GO

--checking for stored procedure existence

IF OBJECT_ID('usp_RegisterUser')  IS NOT NULL
DROP PROC usp_RegisterUser
GO



IF OBJECT_ID('usp_InstructorRegistration')  IS NOT NULL
DROP PROC usp_InstructorRegistration
GO


IF OBJECT_ID('usp_AddCourse')  IS NOT NULL
DROP PROC usp_AddCourse
GO

--checking for TVF existence

IF OBJECT_ID('ufn_ViewAllCourses')  IS NOT NULL
DROP FUNCTION ufn_ViewAllCourses
GO

IF OBJECT_ID('ufn_ViewMyLearnings')  IS NOT NULL
DROP FUNCTION ufn_ViewMyLearnings
GO

--checking for scalar valued function existence

IF OBJECT_ID('ufn_ValidateLoginCredentials')  IS NOT NULL
DROP FUNCTION ufn_ValidateLoginCredentials
GO




---Creating a table

CREATE TABLE Users
(
[UserId] TINYINT  CONSTRAINT pk_UserId PRIMARY KEY IDENTITY,
[EmailId] VARCHAR(50) CONSTRAINT uqe_EmailId UNIQUE,
[Password] VARCHAR(15) NOT NULL,
[MobileNumber] VARCHAR(10) NOT NULL,
[Gender] CHAR CONSTRAINT chk_Gender CHECK(Gender='F' OR Gender='M') NOT NULL,
[DateOfBirth] DATE CONSTRAINT chk_DateOfBirth CHECK(DateOfBirth<GETDATE()) NOT NULL,
[Address] VARCHAR(200) NOT NULL,
[Profession] VARCHAR(100) NOT NULL,
[RoleId] INT DEFAULT 3
)
GO


CREATE TABLE Instructors
(
[InstructorId] TINYINT  CONSTRAINT pk_InstructorId PRIMARY KEY IDENTITY,
[UserName] VARCHAR(50) NOT NULL,
[EmailId] VARCHAR(100) NOT NULL CONSTRAINT uqe_Email UNIQUE,
[Password] VARCHAR(50) NOT NULL,
[Gender] VARCHAR(10) CONSTRAINT chk_Gen CHECK(Gender='F' OR Gender='M') NOT NULL,
[Institution] VARCHAR(100) NOT NULL,
[Department] VARCHAR(100) NOT NULL,
[Experience] INT NOT NULL,
[Degree] VARCHAR(100) NOT NULL,
[MobileNumber] VARCHAR(10) NOT NULL,
[RoleId] INT DEFAULT 2
)
GO

CREATE TABLE Admins
(
[AdminId] TINYINT  CONSTRAINT pk_AdminId PRIMARY KEY IDENTITY,
[EmailId] VARCHAR(100) NOT NULL CONSTRAINT uqe_AdminEmail UNIQUE,
[Password] VARCHAR(50) NOT NULL,
[RoleId] INT DEFAULT 1
)
GO

CREATE TABLE AuthUsers
(
[EmailId] VARCHAR(100) NOT NULL CONSTRAINT uqe_AuthEmail UNIQUE,
[Password] VARCHAR(50) NOT NULL,
[RoleId] INT NOT NULL
)
GO 

CREATE TABLE Categories
(
  [CategoryId] TINYINT CONSTRAINT pk_CategoryId PRIMARY KEY IDENTITY,
  [CategoryName] VARCHAR(40) CONSTRAINT uqe_CategoryName UNIQUE NOT NULL
)
GO

CREATE TABLE COURSES
(
  [CourseId] TINYINT CONSTRAINT pk_CourseId PRIMARY KEY IDENTITY,
  [CourseName] VARCHAR(40) CONSTRAINT uqe_CourseName UNIQUE NOT NULL,
  [CourseCategoryId] TINYINT CONSTRAINT fk_CategoryId REFERENCES Categories(CategoryId), 
  [CourseDuration] VARCHAR(50) NOT NULL,
  [SkillsToBeGained] VARCHAR(150)
)
  GO


CREATE TABLE MyLearnings(
[MyLearningId] INT IDENTITY CONSTRAINT pk_MyLearningId PRIMARY KEY,
[InstructorId] TINYINT NOT NULL CONSTRAINT fk_UserId FOREIGN KEY (InstructorId) REFERENCES Instructors(InstructorId),
[CourseId] TINYINT NOT NULL CONSTRAINT fk_CourseId FOREIGN KEY (CourseId) REFERENCES Courses(CourseId),
[EnrolledDate] DATE NOT NULL DEFAULT GETDATE(),
CONSTRAINT UQ_User_Course UNIQUE (InstructorId, CourseId)
)
GO

--Creating a TVF 

CREATE FUNCTION ufn_ViewAllCourses()
RETURNS TABLE 
AS 
RETURN 
(
SELECT CourseId,CourseName,CourseCategoryId,SkillsToBeGained,CourseDuration FROM Courses
)
GO

CREATE FUNCTION ufn_ViewInstructorLearnings(@InstructorId INT)
RETURNS TABLE
AS
RETURN 
(
SELECT CourseId,EnrolledDate FROM MyLearnings WHERE InstructorId=@InstructorId
)
GO

--creating TVF for GetCategories

CREATE FUNCTION ufn_GetCategories()
RETURNS TABLE 
AS
RETURN
(
SELECT CategoryId,CategoryName FROM Categories
)
GO

--creating a scalar valued function

CREATE FUNCTION ufn_ValidateLoginCredentials
(
	@EmailId VARCHAR(50),
    @Password VARCHAR(15)
)
RETURNS INT
AS
BEGIN
	DECLARE @RoleId INT
	SELECT @RoleId=RoleId FROM AuthUsers WHERE EmailId=@EmailId AND Password=@Password
	RETURN @RoleId
END
GO



--creating a stored procedure

CREATE PROCEDURE usp_RegisterUser
(  
    @EmailId VARCHAR(50),
	@Password VARCHAR(15),
	@MobileNumber VARCHAR(10),
	@Gender CHAR,
	@DateOfBirth DATE,
	@Address VARCHAR(200),
	@Profession VARCHAR(100),
	@RoleId INT =3
)
AS
BEGIN
	BEGIN TRY
		IF (@EmailId IS NULL)
			RETURN -1
		IF (@Password IS NULL)
			RETURN -2
		IF (@Gender IS NULL)
			RETURN -3		
		IF (@DateOfBirth IS NULL)
			RETURN -4
		IF (@Address IS NULL)
			RETURN -6
		
		INSERT INTO Users VALUES 
		(@EmailId,@Password,@MobileNumber, @Gender, @DateOfBirth, @Address,@Profession,@RoleId)
		INSERT INTO AuthUsers VALUES 
		(@EmailId,@Password,@RoleId)
		RETURN 1
	END TRY
	BEGIN CATCH
		RETURN -99
	END CATCH
END
GO

--STORED PROCEDURE FOR INSTRUCTOR REGISTRATION
CREATE PROCEDURE usp_InstructorRegistration
(
@UserName VARCHAR(50),
@EmailId VARCHAR(100),
@Password VARCHAR(50),
@Gender VARCHAR(10),
@Institution VARCHAR(100),
@Department VARCHAR(100),
@Experience INT ,
@Degree VARCHAR(100),
@MobileNumber VARCHAR(10),
@Message VARCHAR(200) OUTPUT
)
AS
BEGIN
	
	
	begin try
		if @UserName IS NULL OR @EmailId IS NULL OR @Password IS NULL OR @Gender IS NULL OR @Institution IS NULL OR @Department IS NULL OR @Experience IS NULL OR @Degree IS NULL OR @MobileNumber IS NULL 
		BEGIN
			RETURN -1
		END

		IF EXISTS (SELECT 1 FROM dbo.Instructors WHERE EmailId=@EmailId)
		BEGIN
			RETURN -2
		END
		INSERT INTO Instructors
		(
			[UserName],[EmailId],[Password],[Gender],[Institution],[Department],[Experience],[Degree], [MobileNumber],[RoleId]
		)
	VALUES
		(
		@UserName, @EmailId, @Password, @Gender, @Institution, @Department, @Experience, @Degree, @MobileNumber ,2
		)
		INSERT INTO AuthUsers 
		(EmailId,[Password],RoleId) VALUES (@EmailId,@Password,2);
		RETURN 1
	END TRY
	BEGIN CATCH
		RETURN -999
	END CATCH
END

GO

--Creating a stored procedure for Add New Course
CREATE PROCEDURE [dbo].[usp_AddCourse]
(
    @CourseName VARCHAR(40),
    @CourseCategoryId TINYINT,
	@CourseDuration VARCHAR(50),
	@SkillsToBeGained VARCHAR(150)
)
AS
BEGIN
    DECLARE @ReturnValue INT
	BEGIN TRY
		IF (@CourseName IS NULL)
		BEGIN
			SET @ReturnValue = -1
			RETURN @ReturnValue
		END
		IF EXISTS(SELECT CourseName FROM COURSES WHERE CourseName=@CourseName)
		BEGIN
			SET @ReturnValue = -2
			RETURN @ReturnValue
		END
		IF (@CourseCategoryId IS NULL)
		BEGIN
			SET @ReturnValue = -3
			RETURN @ReturnValue
		END
		IF (@CourseDuration IS NULL)
		BEGIN
			SET @ReturnValue = -4
			RETURN @ReturnValue
		END
		IF (@SkillsToBeGained IS NULL)
		BEGIN
			SET @ReturnValue = -5
			RETURN @ReturnValue
		END
		INSERT INTO COURSES VALUES (@CourseName, @CourseCategoryId,@CourseDuration,@SkillsToBeGained)
		SET @ReturnValue = 1
		RETURN @ReturnValue
	END TRY
	BEGIN CATCH
		SET @ReturnValue = -99
		RETURN @ReturnValue
	END CATCH
END
GO


GO




INSERT INTO Admins (EmailId, [Password]) VALUES

('shreyas.rai@google.com', 'Admin@123'),

('ananya.verma@google.com', 'Secure@456'),

('rohan.mehra@google.com', 'Root@789'),

('kavya.sharma@google.com', 'Pass@101'),

('arjun.patel@google.com', 'Admin@202'),

('mehul.jain@google.com', 'Key@303'),

('sneha.malhotra@google.com', 'Lock@404'),

('aditya.singh@google.com', 'Shield@505'),

('pooja.kulkarni@google.com', 'Guard@606'),

('vikram.nair@google.com', 'Safe@707');
GO



INSERT INTO Users

(EmailId, [Password], MobileNumber, Gender, DateOfBirth, [Address], Profession)

VALUES

('rahul.kapoor@google.com', 'User@123', '9876500011', 'M', '1999-05-12', 'Bangalore', 'Student'),

('priya.iyer@google.com', 'User@234', '9876500012', 'F', '1998-03-22', 'Chennai', 'UI Designer'),

('aman.chopra@google.com', 'User@345', '9876500013', 'M', '2000-10-11', 'Delhi', 'Graduate'),

('neha.bansal@google.com', 'User@456', '9876500014', 'F', '1997-08-19', 'Gurgaon', 'HR Executive'),

('rohit.mishra@google.com', 'User@567', '9876500015', 'M', '1996-02-09', 'Prayagraj', 'Software Tester'),

('sneha.patil@google.com', 'User@678', '9876500016', 'F', '1999-12-01', 'Pune', 'Content Writer'),

('vikas.aggarwal@google.com', 'User@789', '9876500017', 'M', '1998-05-25', 'Noida', 'Business Analyst'),

('anita.desai@google.com', 'User@890', '9876500018', 'F', '2001-07-30', 'Ahmedabad', 'Student'),

('arjun.reddy@google.com', 'User@901', '9876500019', 'M', '1995-09-14', 'Hyderabad', 'Marketing Exec'),

('pooja.saxena@google.com', 'User@012', '9876500020', 'F', '1997-04-05', 'Indore', 'MBA Student');
GO


INSERT INTO Instructors

(UserName, EmailId, [Password], Gender, Institution, Department, Experience, Degree, MobileNumber)

VALUES

('Sandeep Kulkarni', 'sandeep.kulkarni@google.com', 'Teach@123', 'M', 'IIT Bombay', 'Computer Science', 11, 'M.Tech', '9123400011'),

('Anjali Deshpande', 'anjali.deshpande@google.com', 'Teach@234', 'F', 'NIT Trichy', 'Information Tech', 8, 'M.Tech', '9123400012'),

('Rakesh Shetty', 'rakesh.shetty@google.com', 'Teach@345', 'M', 'VTU Belgaum', 'Electronics', 12, 'PhD', '9123400013'),

('Neha Kulshrestha', 'neha.kulshrestha@google.com', 'Teach@456', 'F', 'Anna University', 'Software Engg', 7, 'M.E', '9123400014'),

('Amit Chatterjee', 'amit.chatterjee@google.com', 'Teach@567', 'M', 'IIT Kharagpur', 'AI & ML', 9, 'PhD', '9123400015'),

('Pooja Gawande', 'pooja.gawande@google.com', 'Teach@678', 'F', 'VIT Vellore', 'Data Science', 6, 'M.Tech', '9123400016'),

('Karthik Subramanian', 'karthik.subramanian@google.com', 'Teach@789', 'M', 'IISc Bangalore', 'Cloud Computing', 11, 'PhD', '9123400017'),

('Swati Joshi', 'swati.joshi@google.com', 'Teach@890', 'F', 'COEP Pune', 'Cyber Security', 8, 'M.Tech', '9123400018'),

('Manoj Thakur', 'manoj.thakur@google.com', 'Teach@901', 'M', 'SPIT Mumbai', 'Web Technologies', 5, 'MCA', '9123400019'),

('Ritu Saxena', 'ritu.saxena@google.com', 'Teach@012', 'F', 'Delhi University', 'Computer Applications', 7, 'MCA', '9123400020');
GO

INSERT INTO AuthUsers (EmailId, [Password], RoleId)
SELECT EmailId AS EmailId,[Password],RoleId FROM Users
UNION ALL
SELECT EmailId AS EmailId,[Password], RoleId FROM Admins
UNION ALL
SELECT EmailId AS EmailId,[Password],RoleId FROM Instructors;
GO

--insertion scripts for Categories Table
INSERT INTO Categories VALUES('Computer science')
INSERT INTO Categories VALUES('Data science') 
INSERT INTO Categories VALUES('Information Technology')
INSERT INTO Categories VALUES('Math and Logic')
INSERT INTO Categories VALUES('Personal Developement')
GO

--insertion scripts for Courses Table
INSERT INTO Courses VALUES ('Machine Learning',1,'48 Hours','Decision Tree, Artificial Neural Network')
INSERT INTO Courses VALUES ('Programming Using Java',1,'2 Months','Java Programming, OOPS Using Java')
INSERT INTO Courses VALUES ('Introduction to Power BI',2,'1 Month','Business Analysis, Data Analysis')
INSERT INTO Courses VALUES ('Data Science with Python',2,'2 Months','Pandas Using Python, Machine Learning')
INSERT INTO Courses VALUES ('Web Technologies',3,'1 Month','HTML & CSS, Java Script')
INSERT INTO Courses VALUES ('Discrete Mathematics',4,'1 Month','Set Theory, Graphs')
INSERT INTO Courses VALUES ('Communication Skills',5,'60 Hours','Speaking, Presentation')
GO 

INSERT INTO MyLearnings VALUES(1,1,'2024-01-05')
INSERT INTO MyLearnings VALUES(1,2,'2024-01-10')
INSERT INTO MyLearnings VALUES(2,3,'2024-01-20')
INSERT INTO MyLearnings VALUES(2,4,'2024-01-21')
INSERT INTO MyLearnings VALUES(3,1,'2024-02-01')
INSERT INTO MyLearnings VALUES(4,3,'2025-01-05')
INSERT INTO MyLearnings VALUES(5,4,'2025-08-05')
INSERT INTO MyLearnings VALUES(5,5,'2026-01-05')
INSERT INTO MyLearnings VALUES(6,2,'2025-08-15')
GO

--creating stored Procedure for Enroll course

CREATE PROCEDURE sp_EnrollCourse(
    @InstructorId INT,
    @CourseId INT
	)
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (
        SELECT 1 FROM MyLearnings 
        WHERE InstructorId = @InstructorId 
        AND CourseId = @CourseId
    )
    BEGIN
        RETURN -1;  
    END
    INSERT INTO MyLearnings (InstructorId, CourseId, EnrolledDate)
    VALUES (@InstructorId, @CourseId, GETDATE());

    RETURN 1;   
END

GO

--creating Stored Procedure for Delete course

CREATE PROCEDURE sp_DeleteCourse
    @CourseId INT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        DELETE FROM MyLearnings WHERE CourseId = @CourseId;
        DELETE FROM Courses WHERE CourseId = @CourseId;

        RETURN 1; 
    END TRY
    BEGIN CATCH
        RETURN -1;
    END CATCH
END

Go



--Creating Scaler Valued Function for CanEnroll

CREATE FUNCTION fn_CanEnroll
(
    @InstructorId INT,
    @CourseId INT
)
RETURNS INT
AS
BEGIN
    DECLARE @result INT;

    IF EXISTS (
        SELECT 1 FROM MyLearnings
        WHERE InstructorId = @InstructorId
        AND CourseId = @CourseId
    )
        SET @result = 0;
    ELSE
        SET @result = 1;

    RETURN @result;
END