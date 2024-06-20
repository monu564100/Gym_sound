// main js page

// saved settings
var savedSettings;

// global workout variables
var workoutType;
var workoutInt;

// Workout Intensity Repetitions/Sets
var repsEasy = "15 Repetitions, 3 Sets Each"
var repsMed = "25 Repetitions, 4 sets Each"
var repsHard = "As many as you can!"

// array to store workout indexes
var workoutArray = [];

// define genre array
var genreArray = ["pop", "workout", "kpop", "hiphop", "rock"];

// spotify ajax calls
function checkSpot() {
    $.ajax({
        // call the token url
        url: "https://accounts.spotify.com/api/token",
        // set the authorization headers
        beforeSend: function (xhr) { xhr.setRequestHeader(`Authorization`, `Basic ZjU1ZmYzZTRhODZlNDVhM2I0ZWRmNmM0Yjc0YzNkMzI6YTY4M2NjMzZiZTZmNDNmODk0Njg0ZDcyN2RkMTkyOTc=`); },
        // set the data to client_credentials as per the spotify api instructions
        processData: false,
        data: "grant_type=client_credentials",
        json: true,
        type: "POST",
        success: function (data) {
            // parse the token from the first ajax call
            var token = `${data.token_type} ${data.access_token}`;
            // grab a stored or random genre from the array
            var randomGenre = getGenre();
            // get a random playlist in the selected genre
            $.ajax({
                url: `https://api.spotify.com/v1/browse/categories/${genreArray[randomGenre]}/playlists`,
                // set the authorization headers with the token
                beforeSend: function (xhr) { xhr.setRequestHeader(`Authorization`, `${token}`); },
                json: true,
                type: "GET",
                success: function (data) {
                    // set the returned data
                    playlistInfo = data.playlists;
                    // pick a random playlist
                    var randomPlaylist = Math.floor(Math.random() * playlistInfo.items.length);
                    // grab the uri for the selected playlist
                    var uri = playlistInfo.items[randomPlaylist].uri.substring(17);
                    // populate the music playlist on the page
                    musicPlaylist(uri);
                    return;
                },
                error: function () {
                    console.log("cannot get playlist");
                    return;
                }
            });

        },
        error: function () {
            console.log("Cannot get data");
            return;
        }
    });
}

// get a stored or random genre index
function getGenre(){
    //Math.floor(Math.random() * genreArray.length);
    // if the local storage has something in it
    var genreStr = "";
    if (JSON.parse(localStorage.getItem("genre"))) {
        // if the stored data isn't empty
        if ((JSON.parse(localStorage.getItem("genre")).length !== 0)) {
            // set the genre value to the page change type
            genreStr = (JSON.parse(localStorage.getItem("genre")));
        }
    }
    // if there wasn't a stored genre, get a random one
    if(genreStr === "")
    {
        // return a random index
        return (Math.floor(Math.random() * genreArray.length));
    }
    // return the index of the stored genre
    var genreNumber = genreArray.indexOf(genreStr);
    return (genreNumber);
}

// create music playlist
function musicPlaylist(link) {
    // empty the current music playlist
    $("#song-playlist").empty();
    var newFrame = $("<iframe>");
    // set the src to the embed code with the playlist id
    newFrame.attr("src", `https://open.spotify.com/embed/playlist/${link}`);
    // set the rest of the iframe attributes
    newFrame.attr("width", "98%");
    newFrame.attr("height", "380");
    newFrame.attr("frameborder", "0");
    newFrame.attr("allowtransparency", "true");
    newFrame.attr("allow", "encrypted-media");
    // put the embed on the page
    $("#song-playlist").append(newFrame);
    // end the function
    return;
}

// generate the workout playlist, taking in the url
function workoutPlaylist(queryUrl){

    $.ajax({
        url: queryUrl,
        method: "GET"
    }).then(function (response) {
        var workouts = response.results;
        // clear current workout playlist to avoid issues
        $(`tbody`).empty();
        // for each workout index, populate a new row in the playlist
        for(var i = 0; i < workoutArray.length; i++){
            // create the row and 3 data points
            var newRow = $(`<tr>`);
            var newData1 = $(`<td>`);
            var newData2 = $(`<td>`);
            var newData3 = $(`<td>`);
            // populate the name data point
            newData1.html(workouts[workoutArray[i]].name);
            // populate the description data point
            newData2.html(workouts[workoutArray[i]].description);
            // populate the intensity data point based on saved results
            if (workoutInt === 'easy') {
                newData3.html(repsEasy);
            } else if (workoutInt === 'medium') {
                newData3.html(repsMed);
            } else if (workoutInt === 'hard') {
                newData3.html(repsHard);
            }
            // add the data points to the row
            newRow.append(newData1);
            newRow.append(newData2);
            newRow.append(newData3);
            // add the row to the page in the tbody tag
            $(`tbody`).append(newRow);
        }
    });
}

// based on workout, set url, set the workout indexes, call the playlist generator
function getWorkout(index){
    // arms
    if (index === "8") {
        workoutUrl = "https://wger.de/api/v2/exerciseinfo/?language=2&equipment=3&category=8";
        workoutArray = [0, 3, 12, 14, 16, 19];
        workoutPlaylist(workoutUrl);

    } 
    // legs
    else if (index === "9") {
        workoutUrl = "https://wger.de/api/v2/exerciseinfo/?language=2&category=9&limit=30&offset=50";
        workoutArray = [2, 8, 10, 13, 14, 21];
        workoutPlaylist(workoutUrl);
    } 
    // abs
    else if (index === "10") {
        workoutUrl = "https://wger.de/api/v2/exerciseinfo/?language=2&category=10&limit=20&offset=30";
        workoutArray = [0, 1, 2, 7, 13, 19];
        workoutPlaylist(workoutUrl);
    } 
    // chest
    else if (index === "11") {
        workoutUrl = "https://wger.de/api/v2/exerciseinfo/?language=2&category=11&limit=30";
        workoutArray = [0, 5 , 7, 12, 23];
        workoutPlaylist(workoutUrl);
    } 
    // back
    else if (index === "12") {
        workoutUrl = "https://wger.de/api/v2/exerciseinfo/?language=2&category=12&equipment=3";
        workoutArray = [0, 3, 5, 6, 8];
        workoutPlaylist(workoutUrl);
    } 
    // shoulder
    else if (index === "13") {
        workoutUrl = "https://wger.de/api/v2/exerciseinfo/?language=2&category=13&limit=35";
        workoutArray = [2, 3, 10, 31, 34];
        workoutPlaylist(workoutUrl);
    }
}

//selects a random workout intensity level and a random workout type
function randomWorkout() {
    var intensity = ["easy", "medium","hard"];
    var workout = ["8", "9", "10", "11", "12", "13"];
    // set a random intensity
    workoutInt = intensity[Math.floor(Math.random() * intensity.length)];
    // call a random workout
    workoutType = workout[Math.floor(Math.random() * workout.length)]
    getWorkout(workoutType);

}
// on page load, check the page
function checkPage() {
    // grab the current url
    getLocalStorage();
    var str = $(location).attr("href");
    // parse the url down to the last section
    str = str.substring(str.lastIndexOf('/') + 1);
    // if the last section is the workout.html
    if (str === "workout.html") {
        // create a new variable to get the page change button
        var pageVal = "";
        // if the local storage has something in it
        if (JSON.parse(localStorage.getItem("pageChange"))) {
            // if the stored data isn't empty
            if ((JSON.parse(localStorage.getItem("pageChange")).length !== 0)) {
                // set the page value to the page change type
                pageVal = (JSON.parse(localStorage.getItem("pageChange")));
                // if the user pressed the workout button
                if (pageVal === "select") {
                    // call the workout based on the user input
                    getWorkout(workoutType);
                    // populate the music playlist
                    if (localStorage.getItem("playlist")) {
                        musicPlaylist(localStorage.getItem("playlist"));
                    } else if (pageVal === "select") {
                        checkSpot();
                    }
                    
                    // end the function
                    return;
                }
                // if the user pressed the random button
                if (pageVal === "random") {
                    if (localStorage.getItem("type")) {
                        getWorkout(workoutType);
                    } else {
                        randomWorkout();
                    }
                    if (localStorage.getItem("playlist")) {
                        musicPlaylist(localStorage.getItem("playlist"));
                    } else {
                        // populate the music playlist
                        checkSpot();
                    }
                    // end the function
                    return;
                }
            }

        }
    } else if (str === "index.html") {
        clearLocal();
        if (savedSettings) {
            for (var index = 0; index < savedSettings.length; index++) {
                $("#saved-" + savedSettings[index].type + "s").append($("<option>").val(savedSettings[index].name).text(savedSettings[index].name));
            }
        }
    }
    // if the user navigated to the workout page or cleared their local storage
    randomWorkout();
    checkSpot();
}

// if workout settings and/or previous saved settings  are available in local storage, 
// sets the corresponding global variables to values in local storage.
function getLocalStorage() {
    if (localStorage.getItem("type")) {
        workoutType = localStorage.getItem("type");
        workoutInt = localStorage.getItem("intensity");
    }
    // checks to make sure saved-settings is an array
    if (localStorage.getItem("saved-settings")) {
        savedSettings = JSON.parse(localStorage.getItem("saved-settings"));
        return;
    }
    savedSettings = [];
}

function clearLocal() {
    var settings = localStorage.getItem("saved-settings");
    localStorage.clear();
    localStorage.setItem("saved-settings", settings);
}

// if the workout button was clicked, store that info and load the next page
$("#start").click(function () {
    localStorage.setItem("type", $("#type").val());
    localStorage.setItem("intensity", $("#intensity").val());
    localStorage.setItem("genre", $("#genre").val());
    // store the pageChange variable to local storage as a string
    var buttonInput = JSON.stringify("select");
    localStorage.setItem("pageChange", buttonInput);
    // store the selected genre to local storage as a string
    var genreSelected = JSON.stringify($("#genre").val());
    localStorage.setItem("genre", genreSelected);
    // change to the workout page
    $(location).attr("href", "workout.html");
})

    // if the random button was clicked, store that info and load the next page
$("#random").click(function () {
    // store the pageChange variable to local storage as a string
    var buttonInput = JSON.stringify("random");
    localStorage.setItem("pageChange", buttonInput);
    $(location).attr("href", "workout.html");
})

$("#return").click(function () {
    // if "Go Back" on workout page is clicked, clear local storage except for saved settings, 
    // and return to home page
    clearLocal();
    $(location).attr("href", "index.html");
})

$(".reveal .save-button").click(function () {
    var currentSettings = {
        name : $("#name").val()
    }  

    var id = $(this).attr("id")
    currentSettings.type = id.substring(id.indexOf("-") + 1);

    if (currentSettings.type !== "workout") {
        currentSettings.playlist = $("iframe").attr("src").substring($("iframe").attr("src").indexOf("playlist/") + 9);
    }

    if (currentSettings.type !== "playlist") {
        currentSettings.workoutType = workoutType;
        currentSettings.workoutInt = workoutInt;
    }

    savedSettings.unshift(currentSettings);
    localStorage.setItem("saved-settings", JSON.stringify(savedSettings));
    $("#snackbar-" + currentSettings.type).addClass("snackbar-show");
    setTimeout(function () { 
        $("#snackbar-" + currentSettings.type).removeClass("snackbar-show") 
    }, 2000);
    $("#name").val("");
});

$("#load").click(function () {
    var snack;
    if (!$("#saved-combos").prop("disabled")) {
        for (var index = 0; index < savedSettings.length; index++) {
            if (savedSettings[index].name === $("#saved-combos").val()) {
                $("#type").val(savedSettings[index].workoutType);
                $("#intensity").val(savedSettings[index].workoutInt);
                localStorage.setItem("type", savedSettings[index].workoutType);
                localStorage.setItem("intensity", savedSettings[index].workoutInt);
                $("#genre").val("playlist");
                localStorage.setItem("playlist", savedSettings[index].playlist);
                snack = "combo-load";
                break;
            }
        }
    } else {
        if ($("#saved-playlists").val() !== "") {
            for (var index = 0; index < savedSettings.length; index++) {
                if (savedSettings[index].name === $("#saved-playlists").val()) {
                    $("#genre").val("playlist");
                    localStorage.setItem("playlist", savedSettings[index].playlist);
                    snack = "playlist-load";
                    break;
                }
            }
        }
        if ($("#saved-workouts").val() !== "") {
            for (var index = 0; index < savedSettings.length; index++) {
                if (savedSettings[index].name === $("#saved-workouts").val()) {
                    $("#type").val(savedSettings[index].workoutType);
                    $("#intensity").val(savedSettings[index].workoutInt);
                    localStorage.setItem("type", savedSettings[index].workoutType);
                    localStorage.setItem("intensity", savedSettings[index].workoutInt);
                    if (snack === "playlist-load") {
                        snack = "combo-load";
                    } else {
                        snack = "workout-load";
                    }
                    break;
                }
            }
        }  
    }
    if (snack === "combo-load") {
        var buttonInput = JSON.stringify("select");
        localStorage.setItem("pageChange", buttonInput);
        $(location).attr("href", "workout.html");
    } else {
        $("#clear").prop("disabled", false);
        $("#saved-playlists").val("");
        $("#saved-workouts").val("");
        $("#saved-combos").val("");
        $("#saved-playlists").prop("disabled", false);
        $("#saved-workouts").prop("disabled", false);
        $("#saved-combos").prop("disabled", false);
        $("#snackbar-" + snack).addClass("snackbar-show");
        setTimeout(function () {
            $("#snackbar-" + snack).removeClass("snackbar-show") 
        }, 2000);
    }
});

$("#name").keyup(function () {
    if ($(this).val().trim().length > 0) {
        $("#save-playlist").prop("disabled", false);
        $("#save-workout").prop("disabled", false);
        $("#save-combo").prop("disabled", false);
        $("#error-text").empty();
    }
    for (var index = 0; index < savedSettings.length; index++) {
        if (savedSettings[index].name === $(this).val()) {
            $("#save-playlist").prop("disabled", true);
            $("#save-workout").prop("disabled", true);
            $("#save-combo").prop("disabled", true);
            $("#error-text").text("Setting name already exists");
            return;
        } else if ($(this).val().trim().length > 0) {
            $("#save-playlist").prop("disabled", false);
            $("#save-workout").prop("disabled", false);
            $("#save-combo").prop("disabled", false);
            $("#error-text").empty();
        }
    }
});

$("#genre").change(function () {
    if ($(this).val() !== "playlist") {
        localStorage.removeItem("playlist");
        if (!localStorage.getItem("type")) {
            $("#clear").prop("disabled", true);
        }
    }
})

$(".workout").change(function () {
    var playlist;
    if (localStorage.getItem("type")) {
        if (localStorage.getItem("playlist")) {
            playlist = localStorage.getItem("playlist");
        }
        clearLocal();
    }
    if (playlist) {
        localStorage.setItem("playlist", playlist);
    }
});

$("#load-modal select").change(function () {
    if ($("#saved-playlists").val() !== "" || $("#saved-workouts").val() !== "" || $("#saved-combos").val() !== "") {
        $("#load").prop("disabled", false);
    } else {
        $("#load").prop("disabled", true);
    }
    if ($("#saved-playlists").val() !== "" || $("#saved-workouts").val() !== "") {
        $("#saved-combos").prop("disabled", true);
    } else {
        $("#saved-combos").prop("disabled", false);
    }
    if ($("#saved-combos").val() !== "") {
        $("#saved-playlists").prop("disabled", true);
        $("#saved-workouts").prop("disabled", true);
    } else {
        $("#saved-playlists").prop("disabled", false);
        $("#saved-workouts").prop("disabled", false);
    }
});

$(".delete").click(function () {
    var adj = "saved" + $(this).attr("id").substring($(this).attr("id").indexOf("-")) + "s";
    for (var index = 0; index < savedSettings.length; index++) {
        if (savedSettings[index].name === $("#" + adj).val()) {
            $("option[value='" + $("#" + adj).val() +"'").remove();
            savedSettings.splice(index, 1);
            localStorage.setItem("saved-settings", JSON.stringify(savedSettings));
            var id = $(this).attr("id");
            $("#snackbar-" + id).addClass("snackbar-show");
            setTimeout(function () { 
                $("#snackbar-" + id).removeClass("snackbar-show") 
            }, 2000);
            $("#" + adj).val("");
            if ($("#saved-playlists").val() === "" && $("#saved-workouts").val() === "") {
                $("#saved-combos").prop("disabled", false);
            }
            break;
        }
    }
});

$("#clear").click(function () {
    clearLocal();
    $("#type").prop("selectedIndex", 0);
    $("#intensity").prop("selectedIndex", 0);
    $("#genre").prop("selectedIndex", 0);
    var id = $(this).attr("id");
    $("#snackbar-" + id).addClass("snackbar-show");
    $(this).prop("disabled", true);
    setTimeout(function () { 
        $("#snackbar-" + id).removeClass("snackbar-show") 
    }, 2000);
});
// when the document is loaded check the page
$(document).ready(
    function () { 
        // initialize foundation;
        $(document).foundation();
        checkPage(); 
});

