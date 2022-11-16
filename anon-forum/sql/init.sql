DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS comments CASCADE;

DROP SEQUENCE IF EXISTS users_id_seq CASCADE;
DROP SEQUENCE IF EXISTS posts_id_seq CASCADE;
DROP SEQUENCE IF EXISTS comments_id_seq CASCADE;

CREATE SEQUENCE users_id_seq;
CREATE SEQUENCE posts_id_seq;
CREATE SEQUENCE comments_id_seq;

CREATE TABLE users (
    id INT NOT NULL DEFAULT nextval('users_id_seq'),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(127) NOT NULL,
    created_on TIMESTAMP NOT NULL,
    last_login TIMESTAMPTZ,
    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

ALTER SEQUENCE users_id_seq
    OWNED BY users.id;

CREATE TABLE posts (
    id INT NOT NULL DEFAULT nextval('posts_id_seq'),
    author_id INT NOT NULL,
    create_date TIMESTAMPTZ NOT NULL,
    update_date TIMESTAMPTZ,
    content TEXT,
    title VARCHAR(255),
    CONSTRAINT "posts_pkey" PRIMARY KEY ("id"),
    FOREIGN KEY (author_id) REFERENCES users (id)
);

ALTER SEQUENCE posts_id_seq
    OWNED BY posts.id;

CREATE TABLE comments (
    id INT NOT NULL DEFAULT nextval('comments_id_seq'),
    content TEXT,
    user_id INT,
    post_id INT,
    create_date TIMESTAMPTZ NOT NULL,
    update_date TIMESTAMPTZ,
    CONSTRAINT "comments_pkey" PRIMARY KEY ("id"),
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (post_id) REFERENCES posts (id)
);

ALTER SEQUENCE comments_id_seq
    OWNED by comments.id;

INSERT INTO users(email, password, created_on) 
values('pew@pew.com', '$2b$10$m9EbuRJ1imAa/NQ1IIXs3./cHBnNx.WVe1DWjrfN1wwl10EHTJHd.', '2022-11-04T14:36:09.828Z');

INSERT INTO users(email, password, created_on) 
VALUES('secret@gmail.com', '$2a$10$1/sSxsV/ImrYqMSNQ3xX7./v1gJqaWUJ/dQEGTrv3qLUxve.farFW', '2022-11-13T14:36:09.828Z');

INSERT INTO posts(author_id, create_date, content, title)
VALUES(1, '2022-11-11T14:26:09.828Z', 'rust is the most blazingly fastest in the planeto', 'rust of the day');

INSERT INTO posts(author_id, create_date, content, title)
VALUES(1, '2022-11-11T18:22:09.828Z', 'iphone flip wins','iphone vs samsung');

INSERT INTO comments(user_id, post_id, content, create_date)
VALUES(2, 1, 'i agree rust is faster than a cheetah on steroids', '2022-11-12T09:22:09.828Z');
