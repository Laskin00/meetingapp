Project setup:
	clone the project
	import maven project in intelij/eclipse
	install https://www.enterprisedb.com/downloads/postgres-postgresql-downloads
		*im using 13.1
	go in pgAdmin4 create database lunchapp
	rightclick the database and open QueryTool
write and execute this:

DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users(
user_uuid VARCHAR(255) NOT NULL PRIMARY KEY UNIQUE,
	first_name VARCHAR(255) NOT NULL, 
	last_name VARCHAR(255) NOT NULL,
	is_admin BOOLEAN NOT NULL,
	session_token VARCHAR(255), 
	email VARCHAR(255) NOT NULL, 
	pwd VARCHAR(255) NOT NULL
);

DROP TABLE IF EXISTS meetings CASCADE;
CREATE TABLE meetings( 
	meeting_uuid VARCHAR(255) NOT NULL PRIMARY KEY UNIQUE, 
	meeting_date DATE DEFAULT CURRENT_DATE, 
	meeting_time TIME DEFAULT CURRENT_TIME, 
	meeting_location VARCHAR(255), 
	description VARCHAR(255), 
	invite_token VARCHAR(255)
);

DROP TABLE IF EXISTS meetinguserconnections CASCADE;
CREATE TABLE meetinguserconnections( 
	connection_id SERIAL NOT NULL UNIQUE, 
	is_owner boolean NOT NULL DEFAULT false, 
	user_uuid VARCHAR(255) NOT NULL REFERENCES users(user_uuid), 
	meeting_uuid VARCHAR(255) NOT NULL REFERENCES meetings(meeting_uuid), 
	CONSTRAINT muc_pk PRIMARY KEY(user_uuid,meeting_uuid)
);
	
DROP TABLE IF EXISTS meetingcomments CASCADE;
CREATE TABLE meetingcomments(
	comment_id SERIAL NOT NULL UNIQUE PRIMARY KEY,
	comment_content VARCHAR(255) NOT NULL,
	user_uuid VARCHAR(255) NOT NULL REFERENCES users(user_uuid),
	meeting_uuid VARCHAR(255) NOT NULL REFERENCES meetings(meeting_uuid)
);

INSERT INTO users(user_uuid,first_name,last_name,is_admin,email,pwd) VALUES('1admin1','Admin','Admin',True,'ad@abv.bg','$2a$10$9NJul0512jUPAG1afkwfw.VHFDKHEBZuIbf8.noen0BACrWcv03u6');



go in application.properties in the project and setup the correct values for your database
