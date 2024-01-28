"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
  // putFavoriteStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
      <input class="star" type="checkbox" id="switch" /><lable for="switch></lable>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
        
      </li>
    `);
}
//<button class="favorite-button" type="button"><small> add to favorite <small></button>



/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

 function putFavoriteStoriesOnPage() {
  console.debug("putFavoriteStoriesOnPage");

  $favoritesList.empty();

  // loop through all of currentUser's favorite stories and generate HTML for them
  if (!currentUser) {
    return;
  }

  for (let story of currentUser.favorites) {
    const $story = generateStoryMarkup(story);
    // $story[0].childNodes[1].remove();
    $favoritesList.append($story);
  }
}

 function putMyStoriesOnPage() {
 console.debug("putMyStoriesOnPage");

  $myStoryList.empty();

  // loop through all of currentUser's favorite stories and generate HTML for them

  for (let story of currentUser.ownStories) {
    const $story = generateStoryMarkup(story);
    // $story[0].childNodes[1].remove();
    $myStoryList.append($story);
  }
}


async function createStory(evt){
  console.debug("createStory",evt);
  evt.preventDefault();

  $newStoryDisplay.empty();
  const title = $("#new-story-title").val();
  const author = $("#new-story-author").val();
  const url = $("#new-story-url").val();

  const newStory = await storyList.addStory(currentUser,{title,author,url});

  const $story = generateStoryMarkup(newStory);
  $newStoryDisplay.append($story); // add new Story to html  ????? why not appending ????
  $myStoryList.append($story);

  hidePageComponents();
  $newStoryDisplay.show();  //show new Story in UI
  $newStoryForm.trigger("reset");

  // update all stories list asychronously
  storyList.stories.push(newStory);
  storyList = await StoryList.getStories();

  currentUser.ownStories.push(newStory); 
}

$newStoryForm.on('submit',createStory);

 async function addFavoriteStory(evt){
  console.debug("addFavoriteStory",evt);
  evt.preventDefault();

  if(!currentUser){
    return;
  }

  const $li = evt.target.closest('li');
  
  const $storyId = $li.id;
  const result = currentUser.favorites.some(s => s.storyId === $storyId);
  if(result){
    return;
  }else{
    $favoritesList.append($li);
    const story = await GetAStory($storyId);
    currentUser.addAFavorite(story);
  }
  putStoriesOnPage(); 
}


$allStoriesList.on('click','input', addFavoriteStory);


async function GetAStory(storyId){
  const response = await axios.get(`https://hack-or-snooze-v3.herokuapp.com/stories/${storyId}`)
  // console.log(response);
  const story = response.data.story;
  return story;
}

async function removeFavoriteStory(evt){
console.debug('removeFavoriteStory',evt);
evt.preventDefault();

const $li = evt.target.closest('li');
const storyId = $li.id;
const story = await GetAStory(storyId);
currentUser.removeFavorite(story);
$li.remove();
}

$favoritesList.on("click","input",removeFavoriteStory);


// not working
// const $checkbox = $("#all-stories-list input");
// $checkbox.change(function(){
//   if($(this).is(':checked')) {
//     addFavoriteStory();
//   }else{
//     removeFavoriteStory();
//   }
// })

async function deleteOwnStory(evt){
  console.debug('deleteOwnStory',evt);
  evt.preventDefault();

  const $li = evt.target.closest('li');
  const $storyId = $li.id;
  await currentUser.deleteStory(currentUser,$storyId);
  $li.remove();
  storyList.stories = storyList.stories.filter(function(s){
    return s.storyId !== $storyId;
  })
  currentUser.ownStories = currentUser.ownStories.filter(function(s){
    return s.storyId !== $storyId;
  })
}

$myStoryList.on('click','input',deleteOwnStory);



