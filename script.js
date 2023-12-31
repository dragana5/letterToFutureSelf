import { apiKey, letterToFutureSelfSignUpListID } from './secrets.js';

const currentURL = window.location.href;
const klaviyoEmail = getQueryParamValue(currentURL, "klaviyo_email");

document.getElementById("scheduleEmail").addEventListener("click", function () {
    const messageToFutureSelf = document.getElementById("inputField").value;
    const selectedDate = document.getElementById("date-select").value;
    
    // Check if the profileID is actually there and only then proceed to pass data to Klaviyo
    const profileID = getProfileID(klaviyoEmail);
    if (profileID) {
        addDataToProfile(messageToFutureSelf, selectedDate, profileID);
        // addProfileToList(messageToFutureSelf,selectedDate); NO NEED TO ADD PROFILE TO THE LIST
    }

});



// ADD CODE FOR SCHEDULE EMAIL AND GO BACK TO SITE CLICK
document.getElementById("scheduleEmailGoBackToSite").addEventListener("click", function () {
    const messageToFutureSelf = document.getElementById("inputField").value;
    const selectedDate = document.getElementById("date-select").value;
    // Check if the profileID is actually there and only then proceed to pass data to Klaviyo
    const profileID = getProfileID(klaviyoEmail);
    if (profileID) {
        addDataToProfile(messageToFutureSelf, selectedDate, profileID);
        // addProfileToList(messageToFutureSelf,selectedDate); NO NEED TO ADD PROFILE TO THE LIST
        // Redirect the user to 'www.mybrand.com'
        window.location.href = 'https://www.mybrand.com';
    }

    
});

// get the email that the user came from
function getQueryParamValue(url, param) {
    const queryString = url.split("?")[1]; // Get the query string part
    const queryParams = new URLSearchParams(queryString);
    
    if (queryParams.has(param)) {
        return queryParams.get(param);
    } else {
        return null;
    }
}

// get the profile id of the user by using their email
function getProfileID(emailQueryParams) {
    const baseUrl = "https://a.klaviyo.com/api/v2/people/search";
    const url = `${baseUrl}?api_key=${apiKey}&email=${emailQueryParams}`;
    const options = {
        method: 'GET',
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json',
        }
    };
    
    return fetch(url, options)
        .then(response => response.json())
        .then(data => {
            if (data && data.id) {
                return data.id;
            } else {
                return null;
            }
        })
        .catch(err => {
            console.error(err);
            return null;
        });    
}

// Add custom data to the user's profile - message and date
function addDataToProfile(message, date, profileID,klaviyoEmail) {  
    const baseUrl = "https://a.klaviyo.com/api/v1/person/";
    const url = `${baseUrl}${profileID}?emailToSelfDate=${date}&messageToSelf1=${message}&api_key=${apiKey}&email=${klaviyoEmail}`;
    const options = {method: 'PUT', headers: {accept: 'application/json'}};

    fetch(url, options)
        .then(response => response.json())
        .then(response => console.log(response))
        .catch(err => console.error(err));
}

// Add a profile to the list
function addProfileToList(message,date) {
    const baseUrl = 'https://a.klaviyo.com/api/v2/list/';
    const options = {
        method: 'POST',
        headers: {accept: 'application/json', 'content-type': 'application/json'},
        body: JSON.stringify({
          profiles: [
            {email: klaviyoEmail},
            {message: message, date: date}
          ]
        })
      };
      
    fetch(`${baseUrl}${letterToFutureSelfSignUpListID}/subscribe?api_key=${apiKey}`, options)
        .then(response => response.json())
        .then(response => console.log(response))
        .catch(err => console.error(err));
}
