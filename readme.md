The Courtyard - Instructions and Implementations

![Home page](/resources/images/homePage.JPG)
![Home page](/resources/images/archivePage.JPG)

Launching: run 'node server.js' in your console. Then navigate to 'localhost:4131'.
This will start you at the homepage of the website.

The website will start you out logged out of any account. This means you won't have
access to all website functionality, since you must be logged in to post, like, etc.
To create an account, click the 'Create Account' button in the top right. On account
creation you will be returned to the homepage logged in, and can test all website
functionaility.


Important URLs:

'/', '/main': the homepage of the website. Here you will find a limited amount of
posts, nav bars to login/account creation and archives, and the ability to create
your own post (if you are logged in).

'/archive': an archive that shows ALL posts on the website ever.

'/loginpage': page where you can log in to an existing account. Must match existing
account credentials that exist in the 'users' SQL database.

'/signuppage': page where you can create an account to use on the website. Your
username must not be the same as another user.


Implemented Features:

1. Users can (and must) login (top right) with an existing account or create a new
account for additional website functionaility. Login credentials must match an account
that exists in the 'users' SQL table. New accounts cannot have the same username as
another user.

2. Logged in users can like posts by clicking the like button on the bottom right of
a post.

3. Logged in users can create new posts (max 300 chars) from the homepage, and
edit/delete their existing posts.

4. The homepage displays the first 10 posts retrieved from 'posts' SQL table. The
archives page displays all posts ever. The archives page can be accessed from the nav
bar or by clicking the 'See More' button at the bottom of the homepage.

4. On both the homepage and in the archives page, you can filter posts by date posted
or by like count.

5. Likes for each post are actively tracked by the 'likes' SQL table. Liking a post
when you are logged in persists across page reloads and server restarts.

6. If logged in, you can logout (top right).
