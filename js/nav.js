"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  hidePageComponents();
  getAndShowStoriesOnStart();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $('#nav-user').show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

function navSubmitClick(){
  hidePageComponents();
  $storyForm.show();
}

$navSubmit.on('click', navSubmitClick);




/** StoryList.addStory(currentUser, {title: 'Jump', author: 'Van Halen', url:'https://www.youtube.com/watch?v=SwYN7mTi6HM'}) */
