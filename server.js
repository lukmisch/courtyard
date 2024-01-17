//mysql -u C4131F23U141 C4131F23U141 -p -h cse-mysql-classes-01.cse.umn.edu

const express = require('express');
const app = express();
const port = 4131;
const path = require('path');
const basicAuth = require('express-basic-auth');
const data = require('./data.js');

app.use(express.urlencoded({ extended: true }))
app.use(express.static('resources'));

app.use('/css', express.static('resources/css'));
app.use('/js', express.static('resources/js'));
app.use('/images', express.static('resources/images'));
app.use(express.json());

app.set('views', path.join(__dirname, 'templates'));
app.set('view engine', 'pug');

//Global variables.
let loggedIn = "false";
let username = "";
let filter = "new";

const adminAuth = basicAuth({
    users: { 'admin': 'password' },
    challenge: true,
    unauthorizedResponse: 'Unauthorized'
});



// GET routes.
app.get(['/', '/main'], async (req, res) => {
    if (filter === "new") {
        const posts = await data.getPosts(true);
        res.render(('mainpage.pug'), { posts, loggedIn, username, filter });
    } else {
        const posts = await data.getHotPosts(true);
        res.render(('mainpage.pug'), { posts, loggedIn, username, filter });
    }
});

app.get('/archive', async (req, res) => {
    if (filter === "new") {
        const posts = await data.getPosts(false);
        res.render(('archive.pug'), { posts, loggedIn, username, filter });
    } else {
        const posts = await data.getHotPosts(false);
        res.render(('archive.pug'), { posts, loggedIn, username, filter });
    }
});

app.get('/loginpage', async (req, res) => {
    res.render(('login.pug'));
});

app.get('/api/logout', async (req, res) => {
    loggedIn = "false";
    username = null;
    if (filter === "new") {
        const posts = await data.getPosts(true);
        res.render(('mainpage.pug'), { posts, loggedIn, username, filter });
    } else {
        const posts = await data.getHotPosts(true);
        res.render(('mainpage.pug'), { posts, loggedIn, username, filter });
    }
});

app.get('/signuppage', async (req, res) => {
    res.render(('signup.pug'));
});

app.get('/api/posts', async (req, res) => {
    const posts = await data.getPosts(false);
    res.status(200).json(posts);
});

app.get('/api/likes', async (req, res) => {
    const likes = await data.getLikes(req.body.id, req.body.username);
    res.status(200).json(likes);
});

app.get('/images/liked', async (req, res) => {
    res.sendFile(path.join(__dirname, 'resources/images/liked.png'));
});

app.get('/images/unliked', async (req, res) => {
    res.sendFile(path.join(__dirname, 'resources/images/unliked.png'));
});

app.get('/images/background', async (req, res) => {
    res.sendFile(path.join(__dirname, 'resources/images/background.jpg'));
});



// POST routes.
app.post(['/', '/main'], async (req, res) => {
    if (req.body.filter === "new") {
        filter = "new";
    } else {
        filter = "hot";
    }

    if (filter === "new") {
        const posts = await data.getPosts(true);
        res.render(('mainpage.pug'), { posts, loggedIn, username, filter });
    } else {
        const posts = await data.getHotPosts(true);
        res.render(('mainpage.pug'), { posts, loggedIn, username, filter });
    }
});

app.post('/api/archive', async (req, res) => {
    if (req.body.filter === "new") {
        filter = "new";
    } else {
        filter = "hot";
    }

    if (filter === "new") {
        const posts = await data.getPosts(false);
        res.render(('archive.pug'), { posts, loggedIn, username, filter });
    } else {
        const posts = await data.getHotPosts(false);
        res.render(('archive.pug'), { posts, loggedIn, username, filter });
    }
});

app.post('/api/posts', async (req, res) => {
    const result = await data.editPost(req.body.id, req.body.content);
    if (result) {
        res.status(200).send("Successfully updated post.");
    } else {
        res.status(400).send("Error: Couldn't update post.");
    }
}); 

app.post('/api/addpost', async (req, res) => {
    const result = await data.addPost(req.body.postContent, username);
    if (result) {
        if (filter === "new") {
            const posts = await data.getPosts(true);
            res.render(('mainpage.pug'), { posts, loggedIn, username, filter });
        } else {
            const posts = await data.getHotPosts(true);
            res.render(('mainpage.pug'), { posts, loggedIn, username, filter });
        }
    } else {
        res.status(400).send("Error: Couldn't create post.");
    }
}); 

app.post('/api/likes', async (req, res) => {
    const result = await data.addLike(req.body.id, req.body.username);
    if (result) {
        res.status(200).send("Successfully liked.");
    } else {
        res.status(400).send("Error: Couldn't like.");
    }
});

app.post('/api/login', async (req, res) => {
    // Validating login credentials.
    const result = await data.getAccount(req.body.username, req.body.password);
    if (result.length > 0) {
        loggedIn = "true";
        username = req.body.username;
        let error = false;
        if (filter === "new") {
            const posts = await data.getPosts(true);
            res.render(('mainpage.pug'), { posts, loggedIn, username, filter });
        } else {
            const posts = await data.getHotPosts(true);
            res.render(('mainpage.pug'), { posts, loggedIn, username, filter });
        }
    } else {
        let error = true;
        res.render(('login.pug'), { error });
    }
});

app.post('/api/createaccount', async (req, res) => {
    // Checking if username already exists.
    if (req.body.password1 != req.body.password2) {
        let error = true;
        let errMsg = "Your passwords did not match. Please try again.";
        return res.render(('signup.pug'), { error, errMsg });
    }
    if (req.body.password1 === "" || req.body.password1 === null) {
        let error = true;
        let errMsg = "Invalid password. Please try again.";
        return res.render(('signup.pug'), { error, errMsg });
    }
    const result1 = await data.getAccount(req.body.username, req.body.password1);
    if (result1.length > 0) {
        let error = true;
        let errMsg = "An account with this username already exists. Please try another.";
        return res.render(('signup.pug'), { error, errMsg });
    }
    
    // Adding account to our database.
    const result2 = await data.createAccount(req.body.username, req.body.password1);
    if (result2 == false) {
        let error = true;
        let errMsg = "SQL error.";
        return res.render(('signup.pug'), { error, errMsg });
    }
    
    // Setting up variables to render mainpage.
    loggedIn = "true";
    username = req.body.username;
    const posts = await data.getPosts(true);
    let error = false;
    return res.render(('mainpage.pug'), { posts, loggedIn, username, filter });
});



// DELETE routes.
app.delete('/api/likes', async (req, res) => {
    const result = await data.removeLike(req.body.id, req.body.username);
    if (result) {
        res.status(200).send("Successfully unliked.");
    } else {
        res.status(400).send("Error: Couldn't remove like.");
    }
});

app.delete('/api/posts', async (req, res) => {
    const result = await data.deletePost(req.body.id);
    if (result) {
        res.status(200).send("Successfully deleted post.");
    } else {
        res.status(400).send("Error: Couldn't delete post.");
    }
});



// 404.
app.use((req, res) => {
    res.status(404).render('404.pug');
});



// Start the server.
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}/`);
});