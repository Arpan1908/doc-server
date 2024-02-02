CREATE TABLE users(
    id SERIAL PRIMARY KEY  NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR NOT NULL);

INSERT INTO users (email, username, password) VALUES ($1,$2,$3);