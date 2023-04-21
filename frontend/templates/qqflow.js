var questionData = JSON.parse(sessionStorage.getItem('questionData'));

// create the drop down list for a given option
// the parameter is the qID of the option
function createQnextSelect(questionIndex) {
    var qid_arr = [];

    var select = document.createElement("select");
    select.name = "nextqID";

    var option = document.createElement("option");
    option.value = "NULLQ";
    option.innerHTML = "NULLQ";
    select.appendChild(option);

    for (var i = 0; i < questionData.length; i++) {
        if (questionData[i].qID !== questionIndex && !qid_arr.includes(questionData[i].qID)) {
            var option = document.createElement("option");
            option.value = questionData[i].qID;
            option.innerHTML = questionData[i].qID;
            select.appendChild(option);
            qid_arr.push(questionData[i].qID);
        }
    }
    return select;
}

// on window load, show all the questions and options so that the user can specify the flow
// for each question-option pair, a drop down list appears with all the other qIDs
function displayQuestions() {
    var qcount = 1;
    var optcount = 1;

    for (var i = 0; i < questionData.length; i++) {
        if (questionData[i].qtext === undefined) {
            //option
            var option = questionData[i];
            var optionDiv = document.createElement("div");
            var optionTitle = document.createElement("p");
            var br = document.createElement("br");
            optionTitle.innerHTML = "Option " + optcount + ": " + option.optID + " - " + option.opttxt;
            var qnextSelect = createQnextSelect(option.qID);
            optionDiv.appendChild(optionTitle);
            optionDiv.appendChild(qnextSelect);
            document.getElementById("questionsContainer").appendChild(optionDiv);
            document.getElementById("questionsContainer").appendChild(br);
            optcount++;
        }
        else {
            //question
            var questionDiv = document.createElement("div");
            var questionTitle = document.createElement("h1");
            questionTitle.style = "font-size: 1.2em;";
            questionTitle.innerHTML = "<br>Question " + (qcount) + " (" + questionData[i].qID + ")" + "<br>" + questionData[i].qtext;
            questionDiv.appendChild(questionTitle);
            document.getElementById("questionsContainer").appendChild(questionDiv);
            qcount++;
            optcount = 1;
        }
    }
}

// submits the data by adding the 
function submitQnext() {
    let selects = document.getElementsByName("nextqID");
    let answers = [];

    // retrieve the nextqIDs from the drop down lists
    for (let i = 0; i < selects.length; i++) {
        answers.push(selects[i].options[selects[i].selectedIndex].value);
    }

    // add them to the option jsons in the larger preliminary json object
    var cnt = 0;
    for (var i = 0; i < questionData.length; i++) {
        // the if stmt is to recognize option jsons
        if (questionData[i].qtext === undefined) {
            questionData[i].nextqID = answers[cnt];
            cnt++;
        }
    }

    var json = JSON.stringify(questionData);
    sessionStorage.setItem("questionData", json);
    window.location.href = "/createinit";
}
