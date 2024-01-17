let username = null;
let loggedIn = "false";

async function checkIfLiked(postId, userId) {
    if (loggedIn == "false") {
        return false;
    }
    const response = await fetch('/api/likes', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
    let flag = false;
    if (response.ok) {
        const responseData = await response.json();
        responseData.forEach(result => {
            if (result.id == postId && result.user == userId) {
                flag = true;
            }
        });
    }
    return flag;
};

window.onload = function() {
    // Checking if logged in.
    loggedIn = document.body.getAttribute('data-logged-in');
    // Getting username.
    username = document.body.getAttribute('data-username');

    // Need to update like buttons if our account has already liked a post.
    // Get all like buttons on page.
    var likeButtons = document.querySelectorAll('img.like-button');
    likeButtons.forEach(async function(button) {
        const postId = button.getAttribute('data-post-id');

        if (loggedIn == "true") {
            // Checking if we have liked any posts.
            let check = await checkIfLiked(postId, username);
            if (check) {
                button.setAttribute('data-liked', 'true');
                button.setAttribute('src', '/images/liked');
            }
        }
        
        // Adding event listeners for clicking likes.
        button.addEventListener('click', async function () {
            // Can't like if we're not logged in.
            if (loggedIn == "false") {
                alert("You must be logged in to like this post.");
                return false;
            }

            const likedVal = button.getAttribute('data-liked');
            if (likedVal == "true") {   // If our post is already liked.
                // Unliking post.
                button.setAttribute('data-liked', 'false');
                button.setAttribute('src',"/images/unliked");

                // Deleting like from table.
                const response = await fetch('/api/likes', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        id: postId,
                        username: username})
                });
            } else {    // Our post is not liked yet.
                // Liking post.
                button.setAttribute('data-liked', 'true');
                button.setAttribute('src',"/images/liked");

                // Adding like to our table.
                const response = await fetch('/api/likes', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        id: postId,
                        username: username})
                });
            }

            // Whether we liked or unliked, we will update the like counter on page.
            const response = await fetch(`/api/posts`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (response.ok) {
                var likeCounter = document.querySelector('span.post-likes[data-post-id="' + postId + '"]');;
                const responseData = await response.json();
                responseData.forEach(result => {
                    if (result.id == postId) {
                        likeCounter.textContent = result.likes;
                    }
                });
            }
        });
    });


    // Need to create event listeners for all 'Edit' and 'Delete' buttons.
    // Get all 'Delete' buttons on page.
    var deleteButtons = document.querySelectorAll('.delete-button');
    deleteButtons.forEach(async function(button) {
        button.addEventListener('click', async function () {
            const postId = button.getAttribute('data-post-id');
            // Removing this post from our database.
            const response = await fetch('/api/posts', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({id: postId})
            });

            // Removing from HTML.
            const postElement = document.querySelector(`li.post-item[data-post-id="${postId}"]`);
            postElement.remove();
            
        }
    )});

    // Now creating our 'Edit' Buttons.
    var editButtons = document.querySelectorAll('.edit-button');
    editButtons.forEach(async function(button) {
        button.addEventListener('click', async function() {
            const postId = button.getAttribute('data-post-id');

            // Find the post content element and save its current content.
            const postContentElement = document.querySelector(`div.post[data-post-id="${postId}"] .post-content`);
            const previousContent = document.querySelector(`div.post[data-post-id="${postId}"] .post-content`).textContent;

            // Remove the "Edit" and "Delete" buttons
            const editButton = document.querySelector(`.edit-button[data-post-id="${postId}"]`);
            const deleteButton = document.querySelector(`.delete-button[data-post-id="${postId}"]`);
            if (editButton) editButton.remove();
            if (deleteButton) deleteButton.remove();

            // Replace the post content with a textarea.
            const textarea = document.createElement('textarea');
            textarea.classList.add('post-content');
            textarea.value = previousContent;
            postContentElement.replaceWith(textarea);

            // Add a 'Save' button.
            const saveButton = document.createElement('button');
            saveButton.classList.add('post-button');
            saveButton.textContent = 'Save';

            const buttonDiv = document.querySelector(`div.button-div[data-post-id="${postId}"]`);
            buttonDiv.appendChild(saveButton);

            // Add an event listener to the 'Save' button.
            saveButton.addEventListener('click', async function() {
                const editedContent = textarea.value;

                // Update the post content on the server.
                const response = await fetch('/api/posts', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        },
                    body: JSON.stringify({
                        id: postId,
                        content: editedContent,
                    }),
                });

                // Check if the update was successful.
                if (response.ok) {
                    // Create a new p element with the updated content.
                    const newContentElement = document.createElement('p');
                    newContentElement.classList.add('post-content');
                    newContentElement.textContent = editedContent;

                    // Replace the textarea with the new p element.
                    textarea.replaceWith(newContentElement);
                    saveButton.remove(); // Remove the "Save" button.
                } else {
                    console.error('Failed to update the post content.');
                    // Create a new p element with the \previous content to reflect the server.
                    const newContentElement = document.createElement('p');
                    newContentElement.classList.add('post-content');
                    newContentElement.textContent = previousContent;

                    // Replace the textarea with the new p element.
                    textarea.replaceWith(newContentElement);
                    saveButton.remove(); // Remove the 'Save' button.
                }

                // Add back the "Edit" and "Delete" buttons
                const buttonDiv = document.querySelector(`div.button-div[data-post-id="${postId}"]`);
                // const newEditButton = document.createElement('span');
                // newEditButton.classList.add('edit-button');
                // newEditButton.textContent = 'Edit';
                // newEditButton.setAttribute('data-post-id', postId);
                buttonDiv.appendChild(editButton);

                // const newDeleteButton = document.createElement('span');
                // newDeleteButton.classList.add('delete-button');
                // newDeleteButton.textContent = 'Delete';
                // newDeleteButton.setAttribute('data-post-id', postId);
                buttonDiv.appendChild(deleteButton);
            });
        });
    });
};