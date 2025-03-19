//All elements

let searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-button');
const videoCardsContainer = document.getElementById('video-cards-container')
const url = 'https://api.freeapi.app/api/v1/public/youtube/videos';
const options = {method: 'GET', headers: {accept: 'application/json'}};

let videosData = "";
let thumbnailurl = "";
let channelName = "";
let views = "";
let videoId = "";
let title = "";
let tags = "";



function createVideoCard(thumbnailurl, title, channelName, views, videoId, tags){
   
    console.log("Inside create video card: ",thumbnailurl, title, channelName, views, videoId)
    let videoCard = document.createElement('div');
    videoCard.className = 'video-card-single'
    videoCard.setAttribute('tags', tags)
    videoCard.innerHTML = `
    
    <a href='https://youtube.com/watch?v=${videoId}'><img src="${thumbnailurl}"></a>
     <a href='https://youtube.com/watch?v=${videoId}'><h2 class="video-title">${title}</h2></a>
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
            if (tagarray){
            tags = tagarray.join(", ")

             console.log(tags);
            }else {
                tags = ""
            }
           

            createVideoCard(thumbnailurl, title, channelName, views, videoId, tags);
            


        });
       
        
        
      } catch (error) {
        console.error(error);
      }
}
callApi(url, options)

