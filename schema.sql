DROP DATABASE IF EXISTS dbproject;
CREATE DATABASE dbproject;
USE dbproject;
CREATE TABLE users (
  id int NOT NULL AUTO_INCREMENT,
  email varchar(50) NOT NULL,
  password varchar(50) NOT NULL,
  photo varchar(50) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE claims (
  id varchar(50) NOT NULL,
  insuranceId varchar(50) NOT NULL,
  Date varchar(50) NOT NULL,
  Location varchar(50) NOT NULL,
  Amount varchar(50) NOT NULL,
  userid int NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE insurances (
  id varchar(50) NOT NULL,
  firstName varchar(10) NOT NULL,
  lastName varchar(10) NOT NULL,
  gender varchar(10) NOT NULL,
  age int NOT NULL,
  vtype varchar(50) NOT NULL,
  vprice varchar(30) NOT NULL,
  liscenceN varchar(30) NOT NULL,
  district varchar(20) NOT NULL,
  collision boolean NOT NULL,
  userid int NOT NULL,
  PRIMARY KEY (id)
);

