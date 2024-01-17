// this package behaves just like the mysql one, but uses async await instead of callbacks.
const mysql = require(`mysql-await`); // npm install mysql-await

// first -- I want a connection pool: https://www.npmjs.com/package/mysql#pooling-connections
// this is used a bit differently, but I think it's just better -- especially if server is doing heavy work.
var connPool = mysql.createPool({
  connectionLimit: 5, // it's a shared resource, let's not go nuts.
  host: "localhost",// this will work
  user: "C4131F23U141",
  database: "C4131F23U141",
  password: "19931", // we really shouldn't be saving this here long-term -- and I probably shouldn't be sharing it with you...
});

// later you can use connPool.awaitQuery(query, data) -- it will return a promise for the query results.

async function getPosts(limit) {
  let query;
  if (limit) {
    query = `
      SELECT *
      FROM posts
      ORDER BY time DESC
      LIMIT 10;
      `;
  } else {
    query = `
      SELECT *
      FROM posts
      ORDER BY time DESC;
      `;
  }

  try {
    const result = await connPool.awaitQuery(query);
    return result;
  } catch (error) {
    console.error("Error getting posts.");
  }
}

async function getHotPosts(limit) {
  let query;
  if (limit) {
  query = `
    SELECT *
    FROM posts
    ORDER BY likes DESC
    LIMIT 10;
    `;
  } else {
    query = `
      SELECT *
      FROM posts
      ORDER BY likes DESC;
      `;
  }

  try {
    const result = await connPool.awaitQuery(query);
    return result;
  } catch (error) {
    console.error("Error getting posts.");
  }
}

async function getLikes() {
  const query = `
    SELECT *
    FROM likes
    `;

  try {
    const result = await connPool.awaitQuery(query);
    return result;
  } catch (error) {
    console.error("Error getting likes.");
  }
}

async function addLike(postId, userId) {
  const query1 = `
    INSERT INTO likes (id, user)
    VALUES (?, ?);
    `;

  const query2 = `
    UPDATE posts
    SET likes = (likes + 1)
    WHERE id = ?;
    `;

  try {
    const result1 = await connPool.awaitQuery(query1, [postId, userId]);
    const result2 = await connPool.awaitQuery(query2, [postId]);
    return true;
  } catch (error) {
    console.error("Error adding like.");
    return false;
  }
}

async function removeLike(postId, userId) {
  const query1 = `
    DELETE FROM likes
    WHERE id = ? AND user = ?;
  `;

  const query2 = `
    UPDATE posts
    SET likes = (likes - 1)
    WHERE id = ?;
    `;

  try {
    const result1 = await connPool.awaitQuery(query1, [postId, userId]);
    const result2 = await connPool.awaitQuery(query2, [postId]);
    return true;
  } catch (error) {
    console.error("Error removing like.");
    return false;
  }
}

async function getAccount(username) {
  const query = `
    SELECT *
    FROM users
    WHERE username = ?;
    `;

  try {
    const result = await connPool.awaitQuery(query, username);
    return result;
  } catch (error) {
    console.error("Error searching for account.");
  }
}

async function createAccount(username, password) {
  const query = `
    INSERT INTO users (username, password)
    VALUES (?, ?);
    `;

  try {
    const result = await connPool.awaitQuery(query, [username, password]);
    return true;
  } catch (error) {
    console.error("Error creating account.");
    return false;
  }
}

async function addPost(content, user) {
  const query = `
    INSERT INTO posts (content, user)
    VALUES (?, ?);
    `;

  try {
    const result = await connPool.awaitQuery(query, [content, user]);
    return true;
  } catch (error) {
    console.error("Error creating post.");
    return false;
  }
}

async function editPost(id, content) {
  const query = `
    UPDATE posts
    SET content = ?
    WHERE id = ?;
    `;

  try {
    const result = await connPool.awaitQuery(query, [content, id]);
    return true;
  } catch (error) {
    console.error("Error creating post.");
    return false;
  }
}

async function deletePost(postId) {
  const query = `
    DELETE FROM posts
    WHERE id = ?;
    `;

  try {
    const result = await connPool.awaitQuery(query, postId);
    return true;
  } catch (error) {
    console.error("Error creating post.");
    return false;
  }
}

async function insertPosts(content, user, timestamp) {
  const query = `
    INSERT INTO posts (content, user, time)
    VALUES (?, ?, ?);
    `;

  const result = await connPool.awaitQuery(query, [content, user, timestamp]);
}

module.exports = {getPosts, getHotPosts, getLikes, addLike, removeLike, getAccount, createAccount, addPost, editPost, deletePost, insertPosts}