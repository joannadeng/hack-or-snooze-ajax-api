"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
  $userProfile.append(`<p class="name"> Name:${currentUser.name} </p>`);
  $userProfile.append(`<p class="username"> Username:${currentUser.username} </p>`);
  const time = currentUser.createdAt.substring(0,10);
  $userProfile.append(`<p class="name"> Account Createdat: ${time} </p>`);
  console.log("did i add the info?")
}
// 

function navSubmitClick(evt) {
  console.debug("navSubmitClick",evt);
  hidePageComponents();
  $newStoryForm.show();
}
$navSubmit.on("click",navSubmitClick);


function showFavoritesList(evt){
  console.debug("showFavoritesList",evt);
  hidePageComponents();
  $favoritesList.show();

}
$navFavorites.on("click",showFavoritesList);

function showUserProfile(evt){
  console.debug("showUserProfile",evt);
  hidePageComponents();
  $userProfile.show();
}
$navUserProfile.on('click',showUserProfile);


