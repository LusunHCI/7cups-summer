
document.addEventListener('DOMContentLoaded', function() {
    // var elemsTap = document.querySelector('.tap-target');
    // var instancesTap = M.TapTarget.init(elemsTap, {});
    // instancesTap.open();
    // setTimeout(function() { instancesTap.close(); }, 4000);
    var elemsModal = document.querySelectorAll('.modal');
    var instancesModal = M.Modal.init(elemsModal);
    var elemSelect = document.querySelectorAll('select');
    var options = document.querySelectorAll('option');
    var instanceSelect = M.FormSelect.init(elemSelect,options);

});


//initialization
$(document).ready(function() {



    //drop down menu for close, restart conversation & clear the chats.
    // $('.dropdown-trigger').dropdown();

    //initiate the modal for displaying the charts, if you dont have charts, then you comment the below line
    // $('.modal').modal();

    $('.modal').modal();

    $('select').formSelect();

    //enable this if u have configured the bot to start the conversation. 
    // showBotTyping();
    // $("#userInput").prop('disabled', true);

    //global variables
    action_name = "action_greet_user";
    url = window.location.href;
    arrUrl = url.split("%3F");
    para = arrUrl[1];
    message_count=0;
    intentsDict={"age_inquiry":"age_inquiry: the listener is asking for the user’s age. <br/> Ex: How old are you?", "greeting":"greeting: the listener says hi to start the conversation. <br/> Ex: Hi, welcome to 7cups"};


    //if you want the bot to start the conversation
    // action_trigger();

})

// ========================== restart conversation ========================
function restartConversation() {
    $("#userInput").prop('disabled', true);
    //destroy the existing chart
    $('.collapsible').remove();

    // if (typeof chatChart !== 'undefined') { chatChart.destroy(); }

    // $(".chart-container").remove();
    // if (typeof modalChart !== 'undefined') { modalChart.destroy(); }
    $(".chats").html("");
    $(".usrInput").val("");
    send("/restart");
}

// ========================== let the bot start the conversation ========================
function action_trigger() {

    // send an event to the bot, so that bot can start the conversation by greeting the user
    $.ajax({
        url: `http://localhost:5005/conversations/${para}/execute`,
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({ "name": action_name, "policy": "MappingPolicy", "confidence": "0.98" }),
        success: function(botResponse, status) {
            console.log("Response from Rasa: ", botResponse, "\nStatus: ", status);

            if (botResponse.hasOwnProperty("messages")) {
                setBotResponse(botResponse.messages);
            }
            $("#userInput").prop('disabled', false);
        },
        error: function(xhr, textStatus, errorThrown) {

            // if there is no response from rasa server
            setBotResponse("");
            console.log("Error from bot end: ", textStatus);
            $("#userInput").prop('disabled', false);
        }
    });
}

//===================================== user enter or sends the message =====================
$(".usrInput").on("keyup keypress", function(e) {
    var keyCode = e.keyCode || e.which;

    var text = $(".usrInput").val();
    if (keyCode === 13) {

        if (text == "" || $.trim(text) == "") {
            e.preventDefault();
            return false;
        } else {
            //destroy the existing chart, if yu are not using charts, then comment the below lines
            $('.collapsible').remove();
            if (typeof chatChart !== 'undefined') { chatChart.destroy(); }

            // $(".chart-container").remove();
            // if (typeof modalChart !== 'undefined') { modalChart.destroy(); }



            $("#paginated_cards").remove();
            $(".suggestions").remove();
            $(".quickReplies").remove();
            $(".usrInput").blur();
            setUserResponse(text);
            send(text);
            e.preventDefault();
            return false;
        }
    }
});

$("#sendButton").on("click", function(e) {
    var text = $(".usrInput").val();
    if (text == "" || $.trim(text) == "") {
        e.preventDefault();
        return false;
    } else {
        // destroy the existing chart

        // chatChart.destroy();
        // $(".chart-container").remove();
        // if (typeof modalChart !== 'undefined') { modalChart.destroy(); }

        $(".suggestions").remove();
        $("#paginated_cards").remove();
        $(".quickReplies").remove();
        $(".usrInput").blur();
        setUserResponse(text);
        send(text);
        e.preventDefault();
        return false;
    }
})

//==================================== Set user response =====================================
function setUserResponse(message) {
    var UserResponse = '<img class="userAvatar" src=' + "../static/img/userAvatar.jpg" + '><p class="userMsg">' + message + ' </p><div class="clearfix"></div>';
    $(UserResponse).appendTo(".chats").show("slow");

    $(".usrInput").val("");
    scrollToBottomOfResults();
    showBotTyping();
    $(".suggestions").remove();
}

//=========== Scroll to the bottom of the chats after new message has been added to chat ======
function scrollToBottomOfResults() {

    var terminalResultsDiv = document.getElementById("chats");
    terminalResultsDiv.scrollTop = terminalResultsDiv.scrollHeight;
    var terminalResultsDivC = document.getElementById("feedback");
    terminalResultsDivC.scrollTop = terminalResultsDivC.scrollHeight;
}

//============== send the user message to rasa server =============================================
function send(message) {

    var url = window.location.href;
    var arrUrl = url.split("%3F");
    var para = arrUrl[1];
    console.log("para=", para);

    $.ajax({
        url: "http://localhost:5005/webhooks/rest/webhook",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({ message: message, sender: para }),
        success: function(botResponse, status) {
            console.log("Response from Rasa: ", botResponse, "\nStatus: ", status);

            // if user wants to restart the chat and clear the existing chat contents
            if (message.toLowerCase() == '/restart') {
                $("#userInput").prop('disabled', false);

                //if you want the bot to start the conversation after restart
                // action_trigger();
                return;
            }
            setBotResponse(botResponse);

        },
        error: function(xhr, textStatus, errorThrown) {

            if (message.toLowerCase() == '/restart') {
                // $("#userInput").prop('disabled', false);

                //if you want the bot to start the conversation after the restart action.
                // action_trigger();
                // return;
            }

            // if there is no response from rasa server
            setBotResponse("");
            console.log("Error from bot end: ", textStatus);
        }
    });

    message_count++;
    var message_id=para+message_count.toString();

    $.ajax({
        url: "/userMessage",
        type: "POST",
        contentType: 'application/json;charset=UTF-8',
        data: JSON.stringify({ 'message_id': message_id, 'message': message, 'chatroom_id': para, 'message_type': 0,'sender_id': para}),
        success: function() {
            console.log("message=",message, );
        }
    });

    var intent="";
    $.ajax({
        url:"http://localhost:5005/model/parse",
        type:"POST",
        contentType: "application/json",
        data: JSON.stringify({ text: message}),
        success: function(json) {
            console.log(json);
            intent=json['intent'];
            ranking=json['intent_ranking'];
            appendIntentsAndScores(intent, message,ranking);
        }
    });

}
//===================append Intents and scores to interface ===================================

function appendIntentsAndScores(intent, message,ranking) {
    console.log(ranking);
    var listenerMessage='<div class="lmsg"> <p class="listenerMsg">' + message + '</p> </div> <div class="selectIntents"> <p> The model detected the intention of this message as "' +intent['name']+ '" with the confidence as ' +intent['confidence']+ '/1.0. </p></div>';
    $(listenerMessage).appendTo(".feedback");
    var intentCard='<div class="intentCard"><div class="card"><div class="card-content">'+ intentsDict[intent['name']] +'</div> </div> </div>';
    $(intentCard).appendTo(".feedback");
    var isCorrect="<div class=isCorrect><p> Did this capture your intention?</p></div>";
    $(isCorrect).appendTo(".feedback");
    var choiceButton='<div class="choiceButton"> <input type="text" class="hiddenInput" style="height:1px;display:none;"> <br/> <button class="yesintent btn" id="yesIntent" onclick="yesintent()" type="button" style="background-color:white;border-radius:30px; border: 2px solid #5a17ee; color: #5a17ee"> Yes </button>  <button class="noedit btn" id="noIntent" onclick="nointent()" type="button" style="background-color:white;border-radius:30px; border: 2px solid #5a17ee; color: #5a17ee"> No </button> </div>';
    $(choiceButton).appendTo(".feedback");
    var selectDesc="<div class='yesDesc'><p style='float:left; width: 100%;'>If you think this is your intent, press the Next button. </p> </div> <div class='noDesc'> <p style='float:left; width: 100%;'> If not, please select one intent from below that could better capture your intention in the message.</p> </div>";
    $(selectDesc).appendTo(".feedback");
    var intentRanking="<div class='intentOption'> <div class='input-field col s12' style='float:left;width:100%;'> <select> <option value=''> "+ intent['name'] +"</option>";
    for(i=0;i<ranking.length;i++) {
        intentRanking+="<option value='"+ranking[i]['name']+"'>"+ranking[i]['name']+'  (confindence='+ranking[i]['confidence']+")</option>";
        console.log(ranking[i]);
    }
    intentRanking+="</select> </div> </div>"
    $(intentRanking).appendTo(".feedback");
}

//=================== set bot response in the chats ===========================================
function setBotResponse(response) {
    //display bot response after 500 milliseconds
    setTimeout(function() {
        hideBotTyping();


        if (response.length < 1) {
            //if there is no response from Rasa, send  fallback message to the user
            var fallbackMsg = "I am facing some issues, please try again later!!!";

            var BotResponse = '<img class="botAvatar" src="../static/img/sara_avatar.png"/><p class="botMsg">' + fallbackMsg + '</p><div class="clearfix"></div>';

            $(BotResponse).appendTo(".chats").hide().fadeIn(500);
            scrollToBottomOfResults();
        } else {

            //if we get response from Rasa
            for (i = 0; i < response.length; i++) {
                var msg_type=0
                var botmessage=response[i];

                //check if the response contains "text"
                if (response[i].hasOwnProperty("text")) {
                    var BotResponse = '<img class="botAvatar" src="../static/img/sara_avatar.png"/><p class="botMsg">' + response[i].text + '</p><div class="clearfix"></div>';
                    $(BotResponse).appendTo(".chats").hide().fadeIn(500);
                    message_count++;
                }

                //check if the response contains "buttons" 
                if (response[i].hasOwnProperty("buttons")) {
                    addSuggestion(response[i].buttons);
                }

                //check if the response contains "custom" message  
                if (response[i].hasOwnProperty("custom")) {

                    //check of the custom payload type is "collapsible"
                    if (response[i].custom.payload == "collapsible") {
                        data = (response[i].custom.data);
                        msg_type=1;
                        //pass the data variable to createCollapsible function
                        createCollapsible(data);
                        botmessage=data;
                    }
                }

                var message_id=para+message_count.toString();
                $.ajax({
                    url: "/botResponse",
                    type: "POST",
                    contentType: 'application/json;charset=UTF-8',
                    data: JSON.stringify({ 'message_id': message_id, 'message': botmessage, 'chatroom_id': para, 'message_type': msg_type, 'feedback': '', 'sender_id': 0}),
                    success: function() {
                        console.log("message=",botmessage);
                    }
                });
            }
            scrollToBottomOfResults();
        }
    }, 500);


}
//====================================== Submit Feedback ======================================
$("#feedbackButton").on("click", function(e) {
    var form_data = $("#feedbackForm").serialize();
    console.log(form_data);
})
//====================================== Toggle chatbot =======================================
$("#profile_div").click(function() {
    $(".profile_div").toggle();
    $(".widget").toggle();
});
//====================================== Yes and No button ==========================================
function nointent() {
    var no=document.getElementById("noIntent");
    no.style="background-color:#5a17ee; color: white; border-radius:30px";
    var yes=document.getElementById("yesIntent");
    yes.style="background-color:white; border-radius:30px; border: 2px solid #5a17ee; color: #5a17ee";
    $(".noDesc").toggle();
    $(".intentOption").toggle();
    $('select').formSelect();
}
function yesintent() {
    var yes=document.getElementById("yesIntent");
    yes.style="background-color:#5a17ee; color:white; border-radius:30px";
    var no=document.getElementById("noIntent");
    no.style="background-color:white; border-radius:30px; border: 2px solid #5a17ee; color: #5a17ee";
    $(".yesDesc").toggle();
}

//====================================== Render Pdf attachment =======================================
function renderPdfAttachment(data) {
    pdf_url = data.custom.url;
    pdf_title = data.custom.title;
    pdf_attachment =
    '<div class="pdf_attachment">' +
    '<div class="row">' +
    '<div class="col s3 pdf_icon"><i class="fa fa-file-pdf-o" aria-hidden="true"></i></div>' +
    '<div class="col s9 pdf_link">' +
    '<a href="' + pdf_url + '" target="_blank">' + pdf_title + ' </a>' +
    '</div>' +
    '</div>' +
    '</div>'
    $(".chats").append(pdf_attachment);
    scrollToBottomOfResults();

}



//====================================== DropDown ==================================================
//render the dropdown messageand handle user selection
function renderDropDwon(data) {
    var options = "";
    for (i = 0; i < data.length; i++) {
        options += '<option value="' + data[i].value + '">' + data[i].label + '</option>'
    }
    var select = '<div class="dropDownMsg"><select class="browser-default dropDownSelect"> <option value="" disabled selected>Choose your option</option>' + options + '</select></div>'
    $(".chats").append(select);
    scrollToBottomOfResults();

    //add event handler if user selects a option.
    $("select").change(function() {
        var value = ""
        var label = ""
        $("select option:selected").each(function() {
            label += $(this).text();
            value += $(this).val();
        });

        setUserResponse(label);
        send(value);
        $(".dropDownMsg").remove();
    });
}

//====================================== Suggestions ===========================================

function addSuggestion(textToAdd) {
    setTimeout(function() {
        var suggestions = textToAdd;
        var suggLength = textToAdd.length;
        $(' <div class="singleCard"> <div class="suggestions"><div class="menu"></div></div></diV>').appendTo(".chats").hide().fadeIn(500);
        // Loop through suggestions
        for (i = 0; i < suggLength; i++) {
            $('<div class="menuChips" data-payload=\'' + (suggestions[i].payload) + '\'>' + suggestions[i].title + "</div>").appendTo(".menu");
        }
        scrollToBottomOfResults();
    }, 500);
}

// on click of suggestions, get the value and send to rasa
$(document).on("click", ".menu .menuChips", function() {
    var text = this.innerText;
    var payload = this.getAttribute('data-payload');
    console.log("payload: ", this.getAttribute('data-payload'))
    setUserResponse(text);
    send(payload);

    //delete the suggestions once user click on it
    $(".suggestions").remove();

});


//====================================== Cards Carousel =========================================

function showCardsCarousel(cardsToAdd) {
    var cards = createCardsCarousel(cardsToAdd);

    $(cards).appendTo(".chats").show();


    if (cardsToAdd.length <= 2) {
        $(".cards_scroller>div.carousel_cards:nth-of-type(" + i + ")").fadeIn(3000);
    } else {
        for (var i = 0; i < cardsToAdd.length; i++) {
            $(".cards_scroller>div.carousel_cards:nth-of-type(" + i + ")").fadeIn(3000);
        }
        $(".cards .arrow.prev").fadeIn("3000");
        $(".cards .arrow.next").fadeIn("3000");
    }


    scrollToBottomOfResults();

    const card = document.querySelector("#paginated_cards");
    const card_scroller = card.querySelector(".cards_scroller");
    var card_item_size = 225;

    card.querySelector(".arrow.next").addEventListener("click", scrollToNextPage);
    card.querySelector(".arrow.prev").addEventListener("click", scrollToPrevPage);


    // For paginated scrolling, simply scroll the card one item in the given
    // direction and let css scroll snaping handle the specific alignment.
    function scrollToNextPage() {
        card_scroller.scrollBy(card_item_size, 0);
    }

    function scrollToPrevPage() {
        card_scroller.scrollBy(-card_item_size, 0);
    }

}

function createCardsCarousel(cardsData) {

    var cards = "";

    for (i = 0; i < cardsData.length; i++) {
        title = cardsData[i].name;
        ratings = Math.round((cardsData[i].ratings / 5) * 100) + "%";
        data = cardsData[i];
        item = '<div class="carousel_cards in-left">' + '<img class="cardBackgroundImage" src="' + cardsData[i].image + '"><div class="cardFooter">' + '<span class="cardTitle" title="' + title + '">' + title + "</span> " + '<div class="cardDescription">' + '<div class="stars-outer">' + '<div class="stars-inner" style="width:' + ratings + '" ></div>' + "</div>" + "</div>" + "</div>" + "</div>";

        cards += item;
    }

    var cardContents = '<div id="paginated_cards" class="cards"> <div class="cards_scroller">' + cards + '  <span class="arrow prev fa fa-chevron-circle-left "></span> <span class="arrow next fa fa-chevron-circle-right" ></span> </div> </div>';

    return cardContents;
}

//====================================== Quick Replies ==================================================

function showQuickReplies(quickRepliesData) {
    var chips = ""
    for (i = 0; i < quickRepliesData.length; i++) {
        var chip = '<div class="chip" data-payload=\'' + (quickRepliesData[i].payload) + '\'>' + quickRepliesData[i].title + '</div>'
        chips += (chip)
    }

    var quickReplies = '<div class="quickReplies">' + chips + '</div><div class="clearfix"></div>'
    $(quickReplies).appendTo(".chats").fadeIn(500);
    scrollToBottomOfResults();
    const slider = document.querySelector('.quickReplies');
    let isDown = false;
    let startX;
    let scrollLeft;

    slider.addEventListener('mousedown', (e) => {
        isDown = true;
        slider.classList.add('active');
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    });
    slider.addEventListener('mouseleave', () => {
        isDown = false;
        slider.classList.remove('active');
    });
    slider.addEventListener('mouseup', () => {
        isDown = false;
        slider.classList.remove('active');
    });
    slider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 3; //scroll-fast
        slider.scrollLeft = scrollLeft - walk;
    });

}

// on click of quickreplies, get the value and send to rasa
$(document).on("click", ".quickReplies .chip", function() {
    var text = this.innerText;
    var payload = this.getAttribute('data-payload');
    console.log("chip payload: ", this.getAttribute('data-payload'))
    setUserResponse(text);
    send(payload);

    //delete the quickreplies
    $(".quickReplies").remove();

});

//====================================== Get User Location ==================================================
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getUserPosition, handleLocationAccessError);
    } else {
        response = "Geolocation is not supported by this browser.";
    }
}

function getUserPosition(position) {
    response = "Latitude: " + position.coords.latitude + " Longitude: " + position.coords.longitude;
    console.log("location: ", response);

    //here you add the intent which you want to trigger 
    response = '/inform{"latitude":' + position.coords.latitude + ',"longitude":' + position.coords.longitude + '}';
    $("#userInput").prop('disabled', false);
    send(response);
    showBotTyping();
}

function handleLocationAccessError(error) {

    switch (error.code) {
        case error.PERMISSION_DENIED:
        console.log("User denied the request for Geolocation.")
        break;
        case error.POSITION_UNAVAILABLE:
        console.log("Location information is unavailable.")
        break;
        case error.TIMEOUT:
        console.log("The request to get user location timed out.")
        break;
        case error.UNKNOWN_ERROR:
        console.log("An unknown error occurred.")
        break;
    }

    response = '/inform{"user_location":"deny"}';
    send(response);
    showBotTyping();
    $(".usrInput").val("");
    $("#userInput").prop('disabled', false);


}

//======================================bot typing animation ======================================
function showBotTyping() {

    var botTyping = '<img class="botAvatar" id="botAvatar" src="../static/img/sara_avatar.png"/><div class="botTyping">' + '<div class="bounce1"></div>' + '<div class="bounce2"></div>' + '<div class="bounce3"></div>' + '</div>'
    $(botTyping).appendTo(".chats");
    $('.botTyping').show();
    scrollToBottomOfResults();
}

function hideBotTyping() {
    $('#botAvatar').remove();
    $('.botTyping').remove();
}

//====================================== Collapsible =========================================

// function to create collapsible,
// for more info refer:https://materializecss.com/collapsible.html
function createCollapsible(data) {
    //sample data format:
    //var data=[{"title":"abc","description":"xyz"},{"title":"pqr","description":"jkl"}]
    list = "";
    hintList="";
    for (i = 0; i < data.length; i++) {
        item = '<li>' +
        '<div class="collapsible-header">' + data[i].title + '</div>' +
        '<div class="collapsible-body"><span>' + data[i].description + '</span></div>' +
        '</li>'
        list += item;
        hintItem = '<li>' +
        '<div class="feedbackHint-header">' + data[i].title + '</div>' +
        '<div class="feedbackHint-body"><span>' + data[i].description + '</span></div>' +
        '</li>'
        hintList += hintItem;

    }
    var contents = '<ul class="collapsible">' + list + '</uL>';
    $(contents).appendTo(".chats");
    message_count++;
    var feedbackContents='<ul class="feedbackHint">' + hintList + '</uL> <div class="input-field">  <label for="userFeedback">Please help us imporve this hints</label> <input id="userFeedback' +message_count.toString()+' class="userFeedback" type="text" name="userFeedback'+ message_count.toString()+'"> </div>';
    $(feedbackContents).appendTo(".feedback");
    // initialize the collapsible
    $('.collapsible').collapsible();
    scrollToBottomOfResults();
}

