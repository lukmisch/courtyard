CREATE TABLE posts (
    id INT NOT NULL auto_increment,
    content TEXT NOT NULL,
    user TEXT NOT NULL,
    likes INT DEFAULT 0,
    time TIMESTAMP DEFAULT current_timestamp,
    primary key(id)
);

INSERT INTO posts (content, user, likes)
VALUES ("this is a dummy post", "lukmisch", 69);

CREATE TABLE likes (
    id INT NOT NULL,
    user TEXT NOT NULL
);

CREATE TABLE users (
    id INT NOT NULL auto_increment,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    primary key(id)
);

INSERT INTO likes (id, user)
VALUES (1, "lukmisch");

SELECT *
FROM likes
WHERE id = ? AND user = ?;