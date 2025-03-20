
let searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-button');
const clearBtn = document.getElementById('clear-search')
const videoCardsContainer = document.getElementById('video-cards-container')
const url = 'https://api.freeapi.app/api/v1/public/youtube/videos';
const options = { method: 'GET', headers: { accept: 'application/json' } };

let videosData = "";
let thumbnailurl = "";
let channelName = "";
let views = "";
let videoId = "";
let title = "";
let tags = "";


function filterVideoCards() {
    const searchTerm = searchInput.value.trim().toLowerCase();

    if (searchTerm.length < 3) {
        alert("Please enter at least 3 characters");
        return;
    }

    // Query BOTH visible and invisible cards to ensure we find all cards
    const videoCards = document.querySelectorAll('.video-card-single, .invisible');
    let matchFound = false;

    videoCards.forEach(card => {
        const cardTags = card.getAttribute("tags");
        // Safely check if cardTags exists and includes the search term
        if (cardTags && cardTags.toLowerCase().includes(searchTerm)) {
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

function resetSearchFilter() {
    searchInput.value = "";

    // Query both visible and invisible cards
    const videoCards = document.querySelectorAll('.video-card-single, .invisible');

    videoCards.forEach(card => {
        card.className = "video-card-single";
    });
}


function createVideoCard(thumbnailurl, title, channelName, views, videoId, tags) {

    console.log("Inside create video card: ", thumbnailurl, title, channelName, views, videoId)
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
    videoCardsContainer.appendChild(videoCard);

}

async function callApi(url, options) {
    try {
        const response = await fetch(url, options);
        const data = await response.json();
        videosData = data.data.data;

        videosData.forEach(object => {
            thumbnailurl = object.items.snippet.thumbnails.default.url;
            title = object.items.snippet.localized.title;
            channelName = object.items.snippet.channelTitle;
            views = object.items.statistics.viewCount;
            videoId = object.items.id;
            let tagarray = object.items.snippet.tags;
            console.log(tagarray)
            if (tagarray) {
                tags = tagarray.join(", ")

                console.log(tags);
            } else {
                tags = ""
            }
            createVideoCard(thumbnailurl, title, channelName, views, videoId, tags);
        });
    } catch (error) {
        console.error(error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    callApi(url, options)
});

searchBtn.addEventListener('click', () => {
    filterVideoCards();
});

searchInput.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        filterVideoCards();
    }
});

clearBtn.addEventListener('click', () => {
    resetSearchFilter();
    clearBtn.className = 'invisible';
});
