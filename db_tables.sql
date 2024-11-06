USE social_media;

CREATE TABLE users (
  user_id BIGINT(255) AUTO_INCREMENT,
	user_firstName VARCHAR(20),
	user_lastName VARCHAR(20),
	user_name VARCHAR(40),
	user_password VARCHAR(30),
	user_avatar VARCHAR(255),
	bioText VARCHAR(150),
	mobilePhone VARCHAR(30),
	registerDate DATE,
	PRIMARY KEY (user_id)
);

CREATE TABLE user_tweets (
  tweet_id BIGINT(255) AUTO_INCREMENT,
	tweet_text VARCHAR(255),
	date_posted DATE,
	user_id BIGINT(255),
	PRIMARY KEY (tweet_id),
  FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE user_likes (
    tweet_id BIGINT(255),
    user_id BIGINT(255),
    original_user_id BIGINT(255),
    FOREIGN KEY(tweet_id) REFERENCES user_tweets(tweet_id),
    FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY(original_user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE user_followers (
    user_follower_id BIGINT(255),
    current_user_id BIGINT(255),
    FOREIGN KEY(user_follower_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY(current_user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE user_followees (
    user_followee_id BIGINT(255),
    current_user_id BIGINT(255),
    FOREIGN KEY(user_followee_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY(current_user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE blocked_users (
    blocked_user_id BIGINT(255) PRIMARY KEY,
    user_id BIGINT(255),
    FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE tweet_urls (
    tweet_url_id BIGINT(255) PRIMARY KEY,
    tweet_id BIGINT(255),
    FOREIGN KEY(tweet_id) REFERENCES user_tweets(tweet_id) ON DELETE CASCADE
);

CREATE TABLE employees (
    employee_id BIGINT(255) AUTO_INCREMENT,
    employee_name VARCHAR(50),
    employee_manager VARCHAR(50),
	  username VARCHAR(50),
	  email VARCHAR(50),
	  currentPassword VARCHAR(50),
    PRIMARY KEY (employee_id)
);

CREATE TABLE employee_department (
    employee_department_id BIGINT(255) AUTO_INCREMENT,
    department_name VARCHAR(50),
    department_manager VARCHAR(50),
    employee_id BIGINT(255),
    FOREIGN KEY(employee_id) REFERENCES employees(employee_id) ON DELETE CASCADE,
    PRIMARY KEY (employee_department_id)
 );

 CREATE TABLE employee_project (
     project_name VARCHAR(50),
     project_manager VARCHAR(50),
     project_duedate DATE,
     employee_id BIGINT(255),
     FOREIGN KEY(employee_id) REFERENCES employees(employee_id) ON DELETE CASCADE
 );

CREATE TABLE employee_assignment (
    assignment_name VARCHAR(50),
    assignment_duedate DATE,
    employee_id BIGINT(255),
    FOREIGN KEY(employee_id) REFERENCES employees(employee_id) ON DELETE CASCADE
);
