"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
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
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
        <button class="favorite-button" type="button"><small> add to favorite <small></button>
      </li>
    `);
}

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

async function createStory(evt){
  console.debug("createStory",evt);
  evt.preventDefault();

  $newStoryDisplay.empty();//empty the ul before displaying new story

  const title = $("#new-story-title").val();
  const author = $("#new-story-author").val();
  const url = $("#new-story-url").val();

  const newStory = await storyList.addStory(currentUser,{title,author,url});

  const $story = generateStoryMarkup(newStory);
  $allStoriesList.prepend($story);

  $newStoryDisplay.append($story); // add new Story to html
  hidePageComponents();
  $newStoryDisplay.show();  //show new Story in UI
  $newStoryForm.hide();
  $newStoryForm.trigger("reset");
}

$newStoryForm.on('submit',createStory);

 async function addFavoriteStory(evt){
  console.debug("addFavorite",evt);
  evt.preventDefault();

  const $li = evt.target.closest('li');
  $favoritesList.append($li);
  $('li button small').text("remove favorite");
  
  const storyId = $li.id;
  console.log(storyId);
  const story = await GetAStory(storyId);
  currentUser.addAFavorite(story);
}

$allStoriesList.on("click","button",addFavoriteStory); // why cant "submit" ?

async function GetAStory(storyId){
  const response = await axios.get(`https://hack-or-snooze-v3.herokuapp.com/stories/${storyId}`)
  console.log(response);
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
$favoritesList.on("click","button",removeFavoriteStory);



