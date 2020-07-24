USE [master]

IF db_id('Journly') IS NULl
  CREATE DATABASE [Journly]
GO

USE [Journly]
GO

DROP TABLE IF EXISTS [post];
DROP TABLE IF EXISTS [flaggedWords];
DROP TABLE IF EXISTS [userRelationship];
DROP TABLE IF EXISTS [therapist];
DROP TABLE IF EXISTS [user];
DROP TABLE IF EXISTS [userType];
DROP TABLE IF EXISTS [moodType];
GO

CREATE TABLE [user] (
  [id] int PRIMARY KEY NOT NULL IDENTITY(1, 1),
  [firebaseUserId] varchar(50) NOT NULL,
  [firstName] varchar(50) NOT NULL,
  [lastName] varchar(50) NOT NULL,
  [nickName] varchar(50) NOT NULL,
  [birthday] datetime NOT NULL,
  [email] varchar(255) NOT NULL,
  [avatar] varchar(255),
  [createDate] datetime NOT NULL,
  [userType] int NOT NULL
)
GO

CREATE TABLE [therapist] (
  [id] int PRIMARY KEY NOT NULL IDENTITY(1, 1),
  [userId] int NOT NULL,
  [verified] bit NOT NULL,
  [company] varchar(255) NOT NULL,
  [code] varchar(50) NOT NULL
)
GO

CREATE TABLE [userType] (
  [id] int PRIMARY KEY NOT NULL IDENTITY(1, 1),
  [name] varchar(50) NOT NULL
)
GO

CREATE TABLE [userRelationship] (
  [id] int PRIMARY KEY NOT NULL IDENTITY(1, 1),
  [therapistId] int NOT NULL,
  [clientId] int NOT NULL,
  [startDate] datetime NOT NULL,
  [endDate] datetime NULL
)
GO

CREATE TABLE [post] (
  [id] int PRIMARY KEY NOT NULL IDENTITY(1, 1),
  [userId] int NOT NULL,
  [createDate] datetime NOT NULL,
  [mood] int NOT NULL,
  [content] text,
  [editTime] datetime,
  [flagged] bit NOT NULL,
  [therapistId] int,
  [viewTime] datetime,
  [comment] text,
  [deleted] bit NOT NULL
)
GO

CREATE TABLE [moodType] (
  [id] int PRIMARY KEY IDENTITY(1, 1),
  [name] varchar(50) NOT NULL,
  [image] varchar(255) NOT NULL
)
GO

CREATE TABLE [flaggedWords] (
  [id] int PRIMARY KEY IDENTITY(1, 1),
  [word] varchar(50) NOT NULL
)
GO

ALTER TABLE [userRelationship] ADD FOREIGN KEY ([therapistId]) REFERENCES [user] ([id])
GO

ALTER TABLE [userRelationship] ADD FOREIGN KEY ([clientId]) REFERENCES [user] ([id])
GO

ALTER TABLE [user] ADD FOREIGN KEY ([userType]) REFERENCES [userType] ([id])
GO

ALTER TABLE [therapist] ADD FOREIGN KEY ([userId]) REFERENCES [user] ([id])
GO

ALTER TABLE [post] ADD FOREIGN KEY ([userId]) REFERENCES [user] ([id])
GO

ALTER TABLE [post] ADD FOREIGN KEY ([therapistId]) REFERENCES [user] ([id])
GO

ALTER TABLE [post] ADD FOREIGN KEY ([mood]) REFERENCES [moodType] ([id])
GO

ALTER TABLE [user] ADD CONSTRAINT df_userType DEFAULT 0 FOR userType
GO
