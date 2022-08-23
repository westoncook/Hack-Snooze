"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  await putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

async function generateStoryMarkup(story) {
  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        ${ currentUser ? await favStory(story) ? '<button class="remove-favorite">Remove from Favs</button>' : '<button class="favorite">Add to Favs</button>' : '<span></span>'}
        ${ currentUser ? myStory(story) : '<span></span>' }
        <small class="story-user">posted by ${story.username}</small>
        <hr>
      </li>
    `);
}

/** Return hmtl for delete button if currentUser  */

function myStory(story){
  return story.username === currentUser.username ? '<button class="delete">Delete</button>' : '<span></span>';
}

/** Check whether story is in favorites list */

async function favStory(story){
  if (currentUser){
    const response = await axios({
      url: `${BASE_URL}/users/${localStorage.username}`,
      method: "GET",
      params: { token: localStorage.token },
    })
    const favs = response.data.user.favorites;
    const result = favs.some(fav => (fav.storyId === story.storyId));
    return result;
  }
  return false;
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

async function putStoriesOnPage() {

  $allStoriesList.empty();
  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    
    const $story = await generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

/** collect story info from story-form, add story to list */

async function submitNewStory(e){
  e.preventDefault();
  const storyObj = { title: $('#story-title').val(), author: $('#story-author').val(), url: $('#story-url').val()};
  const story = await StoryList.addStory(currentUser, storyObj);
  $storyForm.trigger('reset');
  hidePageComponents();
  getAndShowStoriesOnStart();
}

$storyForm.on('submit', submitNewStory);

async function favoriteClick(e){
  const storyId = e.target.parentElement.id;
  e.target.innerText = 'Remove From Favs';
  e.target.className = 'remove-favorite';
  await User.addFavorite(storyId);
}

$allStoriesList.on('click', '.favorite', favoriteClick)

async function removeFavoriteClick(e){
  const storyId = e.target.parentElement.id;
  e.target.innerText = 'Add to Favs';
  e.target.className = 'favorite';
  await User.removeFavorite(storyId);
}

$allStoriesList.on('click', '.remove-favorite', removeFavoriteClick)

async function showFavorites(){
  hidePageComponents();
  const response = await axios({
    url: `${BASE_URL}/users/${localStorage.username}`,
    method: "GET",
    params: { token: localStorage.token },
  })
  const stories = response.data.user.favorites.map(story => new Story(story));
  storyList = new StoryList(stories);
  await putStoriesOnPage();
}

$('#nav-favorites').on('click', showFavorites);

async function showMyStories(){
  hidePageComponents();
  const response = await axios({
    url: `${BASE_URL}/users/${localStorage.username}`,
    method: "GET",
    params: { token: localStorage.token },
  })
  const stories = response.data.user.stories.map(story => new Story(story));
  storyList = new StoryList(stories);
  await putStoriesOnPage();
}

$('#nav-stories').on('click', showMyStories);

async function deleteStory(e){
  const id = e.target.parentElement.id
  e.target.parentElement.remove();
  await axios.delete(`${BASE_URL}/stories/${id}`, {params: { token : currentUser.loginToken}})
}

$($allStoriesList).on('click', '.delete', deleteStory);
