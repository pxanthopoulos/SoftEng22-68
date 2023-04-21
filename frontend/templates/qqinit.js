var questionData = JSON.parse(sessionStorage.getItem('questionData'));

// checks if a mandatory field was left empty
function checkForError() {
    var qqid = document.getElementById("qqid").value;
    var qqtitle = document.getElementById("qqtitle").value;
    if (qqid === "" || qqtitle === "") {
        document.getElementById("error-box").style.display = "flex";
        return true;
    }
    return false;
}

var keywordCount = 1;

// adds new keyword div, appended to the keyword container div
function addKeyword() {
    keywordCount++;

    var newKeyword = document.createElement("div");
    newKeyword.innerHTML = `
        <div id="keyword${keywordCount}">
            <br><input type="text" class="keyword"/><br><br>
            <input type="button" value="Remove Keyword" class="btn btn-danger" onclick="removeKeyword(${keywordCount})" style="margin: 0 auto; display: block;" />
        </div>
        `;
    var keywordContainer = document.getElementById("keywordContainer");
    keywordContainer.insertBefore(newKeyword, keywordContainer.lastChild);
}

function removeKeyword(keywordIndex) {
    var keywordDiv = document.getElementById(`keyword${keywordIndex}`);
    keywordDiv.parentNode.removeChild(keywordDiv);

    // adjust the keywordCount
    keywordCount--;
}

// checks if the qqmask is of the correct format
function checkdomain(str) {
    if (str === "") return false;
    if (!(str.match(/^@[a-zA-Z][a-zA-Z0-9]*([.-][a-zA-Z0-9]+)*\.[a-zA-Z0-9]*[a-zA-Z]$/) && str.length <= 63)) {
        document.getElementById("error-box").style.display = "flex";
        return true;
    } else {
        return false;
    }
}

// parses the questionnaire general data into a json
// and passes it to the final function, parseAll
function parseQQdata() {
    if (checkForError()) return;
    var questionnaireID = document.getElementById("qqid").value;
    var questionnaireTitle = document.getElementById("qqtitle").value;

    var qqmask = document.getElementById("qqmask").value;
    if (checkdomain(qqmask)) return;

    var keywords = [];
    var keywordElements = document.getElementsByClassName("keyword");
    for (var i = 0; i < keywordElements.length; i++) {
        if (keywordElements[i].value !== "") {
            keywords.push(keywordElements[i].value);
        }
    }

    var data = {
        "questionnaireID": questionnaireID,
        "questionnaireTitle": questionnaireTitle,
        "qqmask": qqmask,
        "keywords": keywords
    };

    parseAll(data);
}

// parses all the data into a json and posts it to the endpoint
function parseAll(qqgenData) {
    qqgenData.questions = [];

    var firstopt = 1;

    question = null;
    for (var i = 0; i < questionData.length; i++) {
        if (questionData[i].qtext === undefined) {
            //option

            delete questionData[i].qID;

            if (firstopt === 1) {
                question.options = [];
                question.options.push(questionData[i]);
                firstopt = 0;
            } else {
                question.options.push(questionData[i]);
            }
        }
        else {
            //question

            firstopt = 1;
            qqgenData.questions.push(question);
            question = questionData[i];
        }
    }
    qqgenData.questions.push(question);
    qqgenData.questions.shift();


    var json = JSON.stringify(qqgenData);
    const formData = new FormData();
    formData.append("jsonFile", new Blob([json], { type: "application/json" }), "questionnaire.json");

    fetch("/intelliq_api/admin/questionnaire_upd", {
        method: "POST",
        body: formData
    })
        .then(response => response.json())
        .then(responseJson => {
            if (responseJson.error) {
                alert(responseJson.error);
            } else {
                sessionStorage.removeItem("qqgenData");
                sessionStorage.removeItem("questionData");
                window.location.href = "/";
            }
        })
        .catch(error => {
            console.log(error);
        });
}
