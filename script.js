//Options
const CLIENT_ID = '205376638600-eltfqhcq6qhe7up14t9qpbe1avirr42f.apps.googleusercontent.com';
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest']; // get data 
const SCOPES = 'https://www.googleapis.com/auth/youtube.readonly'; // on to read

const authorizeButton = document.getElementById('authorize-button');
const signoutButton = document.getElementById('signout-button');
const content = document.getElementById('content');
const channelForm = document.getElementById('channel-form');
const channelInput = document.getElementById('channel-input');
const videoContainer = document.getElementById('video-container');

const defaultChannel = 'techguyweb';

//Form submit and change channel
channelForm.addEventListener('submit',e =>{
    e.preventDefault();

    const channel = channelInput.value;

    getChannel(channel)
})

//load auth2 library 
function handleClientLoad(){
    gapi.load('client:auth2',initClient);
}

//Init API Client library and set up sign in lietenrs
function initClient(){
    gapi.client.init({
        discoveryDocs:DISCOVERY_DOCS,
        clientId:CLIENT_ID,
        scope:SCOPES
    }).then(() =>{
        //Listeners for sign in state changes
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
         // Handle initial sign in state
      updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
      authorizeButton.onclick = handleAuthClick;
      signoutButton.onclick = handleSignoutClick;
    })
}

//Update UI Sign in state chenges
function updateSigninStatus(isSignedIn){

    if(isSignedIn){
        authorizeButton.style.display = 'none';
        signoutButton.style.display = 'block';
        content.style.display = 'block';
        videoContainer.style.display = 'block';
        getChannel(defaultChannel)
    }else{
        authorizeButton.style.display = 'block';
        signoutButton.style.display = 'none';
        content.style.display = 'none';
        videoContainer.style.display = 'none';
    }
}


// Handle login
function handleAuthClick() {
    gapi.auth2.getAuthInstance().signIn();
  }
  
  // Handle logout
  function handleSignoutClick() {
    gapi.auth2.getAuthInstance().signOut();
  }

    //Display Channel Data
  function showChannelData(data){
      const channelData = document.getElementById('channel-data');
      channelData.innerHTML = data;
  }

  //Get Data from Youtube API 
  function getChannel(channel){
      gapi.client.youtube.channels.list({
          part:'snippet,contentDetails,statistics',
          forUsername:channel
      })
      .then(response =>{
          console.log(response);

          const channel = response.result.items[0];
          const output = `
            <ul class="collection">
                <li class="collection-item">Title : ${channel.snippet.title}</li>
                <li class="collection-item">ID : ${channel.id}</li>
                <li class="collection-item">Subscribes : ${channel.statistics.subscriberCount}</li>
                <li class="collection-item">Views : ${channel.statistics.viewCount}</li>
                <li class="collection-item">Video : ${channel.statistics.videoCount}</li>
            </ul>
            <p>${channel.snippet.description}</p>
            <hr>
            <a href="https://youtube.com/${channel.snippet.customUrl}" target="_blank" class="btn grey darken-2">Visit Channel</a>
          `;

          //Display Chnnael Data
          showChannelData(output);
      })
      .catch(err => alert('No Channel by that Name'));
  }