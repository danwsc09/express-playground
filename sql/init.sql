DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS likes;

CREATE TABLE users (
    id INT NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(127) NOT NULL,
    created_on TIMESTAMP NOT NULL,
    last_login TIMESTAMPTZ,
    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

CREATE TABLE posts (
    id serial PRIMARY KEY,
    author_id INT NOT NULL,
    create_date TIMESTAMPTZ NOT NULL,
    update_date TIMESTAMPTZ,
    content TEXT,
    title VARCHAR(255),
    FOREIGN KEY (author_id) REFERENCES users (id)
);

CREATE TABLE comments (
    id serial PRIMARY KEY,
    content TEXT,
    user_id INT,
    post_id INT,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (post_id) REFERENCES posts (id)
);
