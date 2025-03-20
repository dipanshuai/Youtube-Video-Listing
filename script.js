//All Elmements
let searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-button');
const clearBtn = document.getElementById('clear-search')
const videoCardsContainer = document.getElementById('video-cards-container')
const url = 'https://api.freeapi.app/api/v1/public/youtube/videos';
const options = { method: 'GET', headers: { accept: 'application/json' } };
//data needed for a video card
let videosData = "";
let thumbnailurl = "";
let channelName = "";
let views = "";
let videoId = "";
let title = "";
let tags = "";

//function to filter/search video cards
function filterVideoCards() {
    //trim and conver all input value to lowercase
    const searchTerm = searchInput.value.trim().toLowerCase();
    //at least 3 character is required
    if (searchTerm.length < 3) {
        alert("Please enter at least 3 characters");
        return;
    }

    // Query BOTH visible and invisible cards to ensure we find all cards
    const videoCards = document.querySelectorAll('.video-card-single, .invisible');
    let matchFound = false;

    videoCards.forEach(card => {
        const cardTags = card.getAttribute("tags");
        // Get title for matching - selecting the element with class "video-title"
        const titleElement = card.querySelector(".video-title");
        const cardTitle = titleElement ? titleElement.textContent.toLowerCase() : "";
        
        // Check if either tags or title contain the search term
        const tagsMatch = cardTags && cardTags.toLowerCase().includes(searchTerm);
        const titleMatch = cardTitle && cardTitle.includes(searchTerm);
        
        // Show card if either tags or title match the search term
        if (tagsMatch || titleMatch) {
            card.className = "video-card-single";
            matchFound = true;
        } else {
            card.className = "invisible";
        }
    });

    // Show a notification if no matches found
    if (!matchFound) {
        alert("No matches found. Please try a different search term.");
        // Make clear button visible even when no matches found
        clearBtn.classList.remove('invisible');
    } else {
        // Make clear button visible when matches are found
        clearBtn.classList.remove('invisible');
    }
}

//function to reset search filter if searched

function resetSearchFilter() {
    //clear the input field
    searchInput.value = "";

    // Query both visible and invisible cards
    const videoCards = document.querySelectorAll('.video-card-single, .invisible');
    //make all cards visible again
    videoCards.forEach(card => {
        card.className = "video-card-single";
    });
}

//function to create video card

function createVideoCard(thumbnailurl, title, channelName, views, videoId, tags) {

    //create a div, set the design class and insert innerhtml with dynamic value
    let videoCard = document.createElement('div');
    videoCard.className = 'video-card-single'
    videoCard.setAttribute('tags', tags)
    videoCard.innerHTML = `
    <div class="video-content">
        <a href='https://youtube.com/watch?v=${videoId}'><img src="${thumbnailurl}"></a>
        <div class="h2-container">
         <a href='https://youtube.com/watch?v=${videoId}'><h2 class="video-title">${title}</h2></a>
        </div>
    </div>
    <div class="other-details">
         <p class="channel-title">${channelName}</p>
         <p class="views">${views} views</p>
    </div>

    `
    //add the videocard to videocardcontainer in the body
    videoCardsContainer.appendChild(videoCard);

}

//call the api and get the data
async function callApi(url, options) {
    try {
        const response = await fetch(url, options);
        const data = await response.json();

        //grab the data array
        videosData = data.data.data;


        //go to each index of array and get the values required for each video card
        videosData.forEach(object => {
            thumbnailurl = object.items.snippet.thumbnails.high.url;
            title = object.items.snippet.localized.title;
            channelName = object.items.snippet.channelTitle;
            views = object.items.statistics.viewCount;
            videoId = object.items.id;

            //add videotags as attribute to each div for search functionality
            let tagarray = object.items.snippet.tags;
        
            if (tagarray) {
                //form the api, tags are in a array, so join the array to a string with comma and space
                tags = tagarray.join(", ")

                console.log(tags);
            } else {
                tags = ""
            }

            //call the createvideocard function and give all he arguments to create the card
            createVideoCard(thumbnailurl, title, channelName, views, videoId, tags);
        });
    } catch (error) {
        console.error(error);
    }
}
//call the api when window loads
document.addEventListener('DOMContentLoaded', () => {
    callApi(url, options)
});
//filter videos when clicked on search button
searchBtn.addEventListener('click', () => {
    filterVideoCards();
});
//if enter is pressed inside searchInput, then filter videos as well
searchInput.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        filterVideoCards();
    }
});

//clear the filter and hide the filter btn when clicked on filter button. 

clearBtn.addEventListener('click', () => {
    resetSearchFilter();
    clearBtn.className = 'invisible';
});
