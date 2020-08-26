USE [master]

IF db_id('Journly') IS NULl
  CREATE DATABASE [Journly]
GO

USE [Journly]
GO

DROP TABLE IF EXISTS [Post];
DROP TABLE IF EXISTS [Note];
DROP TABLE IF EXISTS [FlaggedWord];
DROP TABLE IF EXISTS [UserRelationship];
DROP TABLE IF EXISTS [Therapist];
DROP TABLE IF EXISTS [User];
DROP TABLE IF EXISTS [UserType];
DROP TABLE IF EXISTS [MoodType];
DROP TABLE IF EXISTS [Avatar];
GO

CREATE TABLE [User] (
  [Id] int PRIMARY KEY NOT NULL IDENTITY,
  [FirebaseUserId] varchar(50) NOT NULL,
  [FirstName] varchar(50) NOT NULL,
  [LastName] varchar(50) NOT NULL,
  [NickName] varchar(50) NOT NULL,
  [Birthday] datetime NOT NULL,
  [Email] varchar(255) NOT NULL,
  [AvatarId] int NOT NULL,
  [FavColor] char(6),
  [CreateDate] datetime NOT NULL,
  [UserTypeId] int NOT NULL
)
GO

CREATE TABLE [Therapist] (
  [Id] int PRIMARY KEY NOT NULL IDENTITY,
  [UserId] int NOT NULL,
  [Verified] bit NOT NULL,
  [Company] varchar(255) NOT NULL,
  [Code] varchar(50) NOT NULL
)
GO

CREATE TABLE [UserType] (
  [Id] int PRIMARY KEY NOT NULL IDENTITY,
  [Name] varchar(50) NOT NULL
)
GO

CREATE TABLE [UserRelationship] (
  [Id] int PRIMARY KEY NOT NULL IDENTITY,
  [TherapistId] int NOT NULL,
  [UserId] int NOT NULL,
  [StartDate] datetime NOT NULL,
  [EndDate] datetime NULL
)
GO

CREATE TABLE [Post] (
  [Id] int PRIMARY KEY NOT NULL IDENTITY,
  [UserId] int NOT NULL,
  [CreateDate] datetime NOT NULL,
  [MoodId] int NOT NULL,
  [Content] text,
  [EditTime] datetime,
  [Flagged] bit NOT NULL,
  [TherapistId] int,
  [ViewTime] datetime,
  [Comment] text,
  [Deleted] bit NOT NULL
)
GO

CREATE TABLE [Note] (
  [Id] int PRIMARY KEY NOT NULL IDENTITY,
  [TherapistId] int NOT NULL,
  [ClientId] int NOT NULL,
  [CreateDate] datetime NOT NULL,
  [Content] text NOT NULL,
  [Deleted] bit NOT NULL
)
GO

CREATE TABLE [MoodType] (
  [Id] int PRIMARY KEY IDENTITY,
  [Name] varchar(50) NOT NULL,
  [Image] varchar(255) NOT NULL
)
GO

CREATE TABLE [Avatar] (
  [Id] int PRIMARY KEY IDENTITY,
  [Image] varchar(50) NOT NULL,
  [Name] varchar(100) NOT NULL
)
GO

CREATE TABLE [FlaggedWord] (
  [Id] int PRIMARY KEY IDENTITY,
  [Word] varchar(50) NOT NULL
)
GO

ALTER TABLE [UserRelationship] ADD FOREIGN KEY ([TherapistId]) REFERENCES [User] ([Id])
GO

ALTER TABLE [UserRelationship] ADD FOREIGN KEY ([UserId]) REFERENCES [User] ([Id])
GO

ALTER TABLE [User] ADD FOREIGN KEY ([UserTypeId]) REFERENCES [UserType] ([Id])
GO

ALTER TABLE [User] ADD FOREIGN KEY ([AvatarId]) REFERENCES [Avatar] ([Id])
GO

ALTER TABLE [Therapist] ADD FOREIGN KEY ([UserId]) REFERENCES [User] ([Id])
GO

ALTER TABLE [Post] ADD FOREIGN KEY ([UserId]) REFERENCES [User] ([Id])
GO

ALTER TABLE [Post] ADD FOREIGN KEY ([TherapistId]) REFERENCES [User] ([Id])
GO

ALTER TABLE [Post] ADD FOREIGN KEY ([MoodId]) REFERENCES [MoodType] ([Id])
GO

ALTER TABLE [Note] ADD FOREIGN KEY ([TherapistId]) REFERENCES [User] ([Id])
GO

ALTER TABLE [Note] ADD FOREIGN KEY ([ClientId]) REFERENCES [User] ([Id])
GO

ALTER TABLE [User] ADD CONSTRAINT df_userType DEFAULT 0 FOR UserTypeId
GO

ALTER TABLE [User] ADD CONSTRAINT df_avatarId DEFAULT 1 FOR AvatarId
GO

ALTER TABLE [Therapist] ADD UNIQUE (Code);
GO
