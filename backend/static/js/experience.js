
document.addEventListener('DOMContentLoaded', function() {
    // var elemsTap = document.querySelector('.tap-target');
    // var instancesTap = M.TapTarget.init(elemsTap, {});
    // instancesTap.open();
    // setTimeout(function() { instancesTap.close(); }, 4000);
    var elems = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elems);

});


//initialization
$(document).ready(function() {



    //drop down menu for close, restart conversation & clear the chats.
    $('.dropdown-trigger').dropdown();

    //initiate the modal for displaying the charts, if you dont have charts, then you comment the below line
    // $('.modal').modal();

    $('.modal').modal();

    //enable this if u have configured the bot to start the conversation. 
    // showBotTyping();
    // $("#userInput").prop('disabled', true);

    //global variables
    $('#previousButton').hide();
    $('#nextButton').hide();
    $('#feedbackForm').hide();
    action_name = "action_greet_user";
    url = window.location.href;
    arrUrl = url.split("%3F");
    para = arrUrl[1];
    message_count=0;
    intentsDict={"age_inquiry":"age_inquiry: the listener is asking for the user’s age. <br/> Ex: How old are you?", "greeting":"greeting: the listener says hi to start the conversation. <br/> Ex: Hi, welcome to 7cups"};
    currentShow=0;

    //if you want the bot to start the conversation
    // action_trigger();

})

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
            appendIntents(intent, message,ranking);
        }
    });

}

//===================append Intents and scores to interface ===================================

function appendIntents(intent, message,ranking) {
    var divid='msg'+message_count.toString();
    var tempdiv="<div class='codesign' id='"+divid+"'> </div>";
    $(tempdiv).appendTo(".feedback");
    divid='#'+divid;
    $(divid).hide();
    var listenerMessage='<h6>Your message</h6> <div class="lmsg"> <p class="listenerMsg">' + message + '</p> </div> <div class="selectIntents"> <p> The model detected the intention of this message as "' +intent['name']+ '" with the confidence as ' +intent['confidence']+ '/1.0. </p></div>';
    $(listenerMessage).appendTo(divid);
    var intentCard='<div class="intentCard"><div class="card"><div class="card-content">'+ intentsDict[intent['name']] +'</div> </div> </div>';
    $(intentCard).appendTo(divid);
    var isCorrect="<div class=isCorrect><p> Did this capture your intention?</p></div>";
    $(isCorrect).appendTo(divid);
    var choiceButton='<div class="choiceButton"> <input type="text" class="hiddenInput" style="height:1px;display:none;"> <br/> <button class="yesintent btn" id="yesIntent'+message_count.toString()+'" onclick="yesintent('+message_count.toString()+')" type="button" style="background-color:white;border-radius:30px; border: 2px solid #5a17ee; color: #5a17ee"> Yes </button>  <button class="nointent btn" id="noIntent'+message_count.toString()+'" onclick="nointent('+message_count.toString()+')" type="button" style="background-color:white;border-radius:30px; border: 2px solid #5a17ee; color: #5a17ee"> No </button> </div>';
    $(choiceButton).appendTo(divid);
    var selectDesc="<div class='yesDesc' id='yesDesc"+message_count.toString()+"'><p style='float:left; width: 100%;'>If you think this is your intent, press the Next button. </p> </div> <div class='noDesc' id='noDesc"+message_count.toString()+"'> <p style='float:left; width: 100%;'> If not, please select one intent from below that could better capture your intention in the message.</p> </div>";
    $(selectDesc).appendTo(divid);
    var intentRanking="<div class='intentOption' id='intentOption"+message_count.toString()+"'> <div class='input-field col s12' style='float:left;width:100%;'> <select> <option value=''> "+ intent['name'] +"</option>";
    for(i=0;i<ranking.length;i++) {
        intentRanking+="<option value='"+ranking[i]['name']+"'>"+ranking[i]['name']+'  (confindence='+ranking[i]['confidence']+")</option>";
    }
    intentRanking+="</select> </div> </div>"
    $(intentRanking).appendTo(divid);
}
//====================================== append Actions to the interface ===========================
function appendActions(botmessage) {
    var divid='msg'+message_count.toString();
    var tempdiv="<div class='codesign' id='"+divid+"'> </div>";
    $(tempdiv).appendTo(".feedback");
    divid='#'+divid;
    $(divid).hide();
    var botMessage='<h6>Chatbot response</h6> <div class="bmsg"> <p class="chatbotResponse">' + botmessage + '</p> </div> <div class="selectResponse"> <p> Does the chatbot response seem reasonable? If not, please select no to improve the resonse. </p></div>';
    $(botMessage).appendTo(divid);
    var isResonable='<div class="choiceButton"> <input type="text" class="hiddenInput" style="height:1px;display:none;"> <br/> <button class="yesaction btn" id="yesAction'+message_count.toString()+'" onclick="yesaction('+message_count.toString()+')" type="button" style="background-color:white;border-radius:30px; border: 2px solid #5a17ee; color: #5a17ee"> Yes </button>  <button class="noaction btn" id="noAction'+message_count.toString()+'" onclick="noaction('+message_count.toString()+')" type="button" style="background-color:white;border-radius:30px; border: 2px solid #5a17ee; color: #5a17ee"> No </button> </div>';
    $(isResonable).appendTo(divid);
    var yesGuide="<div class='yesGuide' id='yesGuide"+message_count.toString()+"'><p style='float:left; width: 100%;'>If you think this response is no need to be changed, press the Next button. </p> </div>";
    $(yesGuide).appendTo(divid);
    var actionRanking="<div class='actionOption' id='actionOption"+message_count.toString()+"'> <div class='input-field col s12' style='float:left;width:100%;'> <select> <option value=''> "+ botmessage +"</option>";
    actionRanking+="</select> </div> </div>";
    $(actionRanking).appendTo(divid);
    $('select').formSelect();
    var otherResponse="<div class='otherResponse' id='otherResponse"+message_count.toString()+"'><p>What other ways could the chatbot respond with this type of “introduce stressor” action?</p> <textarea class='materialize-textarea' style='float:left;width:100%;'></textarea>  </div>";
    $(otherResponse).appendTo(divid);

}
//=================== next and previous button ==================================================
$("#nextButton").on("click", function(e) {
    var currentDiv='#msg'+currentShow.toString();
    currentShow++;
    if(currentShow>1) {
        $('#previousButton').show();
    }
    else {
        $('#previousButton').hide();        
    }
    $(currentDiv).hide();
    var nextDiv='#msg'+currentShow.toString();
    $(nextDiv).toggle();
})

$("#previousButton").on("click", function(e) {
    var currentDiv='#msg'+currentShow.toString();
    currentShow--;
    if(currentShow>1) {
        $('#previousButton').show();
    }
    else {
        $('#previousButton').hide();        
    }
    $(currentDiv).hide();
    var previousDiv='#msg'+currentShow.toString();
    $(previousDiv).toggle();
})


//=================== set bot response in the chats ===========================================
function setBotResponse(response) {

    var url = window.location.href;
    var arrUrl = url.split("%3F");
    var para = arrUrl[1];
    console.log("para=", para);


    //display bot response after 500 milliseconds
    setTimeout(function() {
        hideBotTyping();


        if (response.length < 1) {
            //if there is no response from Rasa, send  fallback message to the user
            var fallbackMsg = "I am facing some issues, please try again later!!!";

            var BotResponse = '<img class="botAvatar" src="../static/img/sara_avatar.png"/><p class="botMsg">' + fallbackMsg + '</p><div class="clearfix"></div>';

            $(BotResponse).appendTo(".chats").hide().fadeIn(1000);
            scrollToBottomOfResults();
        } else {

            //if we get response from Rasa
            for (i = 0; i < response.length; i++) {
                var msg_type=0
                var botmessage=response[i];

                //check if the response contains "text"
                if (response[i].hasOwnProperty("text")) {
                    var BotResponse = '<img class="botAvatar" src="../static/img/sara_avatar.png"/><p class="botMsg">' + response[i].text + '</p><div class="clearfix"></div>';
                    $(BotResponse).appendTo(".chats").hide().fadeIn(1000);
                    message_count++;
                }

                //check if the response contains "images"
                if (response[i].hasOwnProperty("image")) {
                    var BotResponse = '<div class="singleCard">' + '<img class="imgcard" src="' + response[i].image + '">' + '</div><div class="clearfix">';
                    $(BotResponse).appendTo(".chats").hide().fadeIn(1000);
                }


                //check if the response contains "buttons" 
                if (response[i].hasOwnProperty("buttons")) {
                    addSuggestion(response[i].buttons);
                }

                //check if the response contains "custom" message  
                if (response[i].hasOwnProperty("custom")) {

                    //check if the custom payload type is "dropDown"
                    if (response[i].custom.payload == "dropDown") {
                        dropDownData = response[i].custom.data;
                        renderDropDwon(dropDownData);
                        return;
                    }

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
                    data: JSON.stringify({ 'message_id': message_id, 'message': botmessage, 'chatroom_id': para, 'message_type': msg_type, 'sender_id': 0}),
                    success: function() {
                        console.log("message=",botmessage);
                        appendActions(botmessage['text']);
                    }
                });
            }
            scrollToBottomOfResults();
        }
    }, 500);


}

//====================================== End the conversation =========================================

$("#endConversation").click(function() {
    $('.experience_instruction').remove();
    var codesign_instruction="<p>In this section of the codesign, please interact with the chatbot again, but as you do so, correct the chatbot by answering the corresponding questions regarding Intents, Responses and Feedback.<br/>  <br/> Intents refer to the goal or intention of any message you send to the chatbot. Responses are given by the chatbot based on the intent. Below are examples of corresponding intents and responses with the confidence score indicating the level of correlation between the intent and the response. <br/>  <br/> <table> <tbody> <tr> <td> Listener: “Hi!” </td> <td> Intent: greeting (confidence score = 0.98) </td> </tr> <tr> <td> Chatbot: “Hello”</td> <td>Response: greeting  </td> </tr> </tbody> </table> <br/>  <br/> The chatbot understood the listener’s intent of greeting saying “Hi” and responded with “Hello”. <br/> <br/> <table> <tbody> <tr> <td>Listener: “What happened?” </td> <td>Intent: stressor inquiry (confidence score = 0.88) </td> </tr> <tr> <td> Chatbot: “I just went through a breakup” </td> <td> Response: introduce stressor </td> </tr> </tbody> </table> <br/> <br/> The chatbot understood the listener’s intent of stressor_inquiry saying “What happened?” and responded with “I just went through a breakup” .  <br/>  <br/> As you look over the Intents, Responses, and Feedback please edit or provide feedback regarding the content of the chatbot’s responses to your messages. When you are done, click “End the conversation”.</p>";
    $(codesign_instruction).appendTo(".instruction");
    $(".startButton").toggle();
});

//====================================== Start co-design activity =========================================

$("#startCodesign").click(function() {
    $('#feedbackForm').show();
    currentShow++;
    $('#instruction').hide();
    var showDiv='#msg'+currentShow.toString();
    $(showDiv).show();
    $('#nextButton').show();
    var active=document.getElementById("codesign");
    var de_active=document.getElementById("experience");
    $(active).addClass('active');
    $(de_active).removeClass('active');
});

//====================================== Yes and No button for intents ==========================================
function nointent(msgid) {
    var no=document.getElementById("noIntent"+msgid);
    no.style="background-color:#5a17ee; color: white; border-radius:30px";
    var yes=document.getElementById("yesIntent"+msgid);
    yes.style="background-color:white; border-radius:30px; border: 2px solid #5a17ee; color: #5a17ee";
    $("#noDesc"+msgid).show();
    $("#intentOption"+msgid).show();
    $("#yesDesc"+msgid).hide();
    $('select').formSelect();
}
function yesintent(msgid) {
    var yes=document.getElementById("yesIntent"+msgid);
    yes.style="background-color:#5a17ee; color:white; border-radius:30px";
    var no=document.getElementById("noIntent"+msgid);
    no.style="background-color:white; border-radius:30px; border: 2px solid #5a17ee; color: #5a17ee";
    $("#yesDesc"+msgid).show();
    $("#noDesc"+msgid).hide();
    $("#intentOption"+msgid).hide();
}

//====================================== Yes and No button for actions ==========================================
function noaction(msgid) {
    var no=document.getElementById("noAction"+msgid);
    no.style="background-color:#5a17ee; color: white; border-radius:30px";
    var yes=document.getElementById("yesAction"+msgid);
    yes.style="background-color:white; border-radius:30px; border: 2px solid #5a17ee; color: #5a17ee";
    $("#actionOption"+msgid).show();
    $("#otherResponse"+msgid).show();
    $("#yesGuide"+msgid).hide();
    $('select').formSelect();
}
function yesaction(msgid) {
    var yes=document.getElementById("yesAction"+msgid);
    yes.style="background-color:#5a17ee; color:white; border-radius:30px";
    var no=document.getElementById("noAction"+msgid);
    no.style="background-color:white; border-radius:30px; border: 2px solid #5a17ee; color: #5a17ee";
    $("#yesGuide"+msgid).show();
    $("#otherResponse"+msgid).hide();
    $("#actionOption"+msgid).hide();
}

//====================================== Toggle chatbot =======================================
$("#profile_div").click(function() {
    $(".profile_div").toggle();
    $(".widget").toggle();
    $(".endButton").toggle();
});

//====================================== functions for drop-down menu of the bot  =========================================
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

    }
    var contents = '<ul class="collapsible">' + list + '</uL>';
    $(contents).appendTo(".chats");
    message_count++;
    // initialize the collapsible
    $('.collapsible').collapsible();
    scrollToBottomOfResults();
}