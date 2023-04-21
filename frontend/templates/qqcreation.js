var questionCount = 1;
var optionCount = { 1: 1 };

//adds a new question div, appended to the question conatiner div
function addQuestion() {
    questionCount++;
    optionCount[questionCount] = 1;

    var newQuestion = document.createElement("div");
    newQuestion.innerHTML = `
        <div id="question${questionCount}" style="text-align: center;">
            <br><h1 style="font-size: 1.7em;">Question ${questionCount}</h1>
            <input type="button" value="Remove Question" class="btn btn-danger" onclick="removeQuestion(${questionCount})"
			style="margin: 0 auto; display: block;" /><br>
            <label style="font-size: 1.2em;">Question ID</label><br>
            <input type="text" name="qid" placeholder="Max length 10 characters"/><br>
            <label style="font-size: 1.2em;">Question text</label><br>
            <input type="text" name="qtext" placeholder="Max length 255 characters"/><br> <br>
            <label style="font-size: 1.2em;">Is the question mandatory?</label><br>
            <input type="text" name="mandatory" placeholder="TRUE or FALSE" /><br>
            <label style="font-size: 1.2em;">Type of question</label><br>
            <input type="text" name="type" placeholder="profile or question" /><br><br>
            <input type="button" value="+" class="btn btn-danger" onclick="addOption(${questionCount})"
			style="margin: 0 auto; display: block;" /><br>
            <div id="optionsContainer${questionCount}">
            <div id="option1">
                <label style="font-size: 1.2em;">Option ID</label><br>
                <input type="text" name="opt" placeholder="Max length 10 characters"/><br>
                <label style="font-size: 1.2em;">Option Text</label><br>
                <input type="text" name="opttxt" placeholder="Max length 255 characters"/><br>
            </div><br>
            </div>
        </div>
        `;
    var questionContainer = document.getElementById("questionContainer");
    questionContainer.appendChild(newQuestion);
}

// removes the questin div that corresponds to the questionIndex
function removeQuestion(questionIndex) {
    var questionDiv = document.getElementById(`question${questionIndex}`);
    questionDiv.parentNode.removeChild(questionDiv);

    // adjust the questionCount and optionCount
    questionCount--;
    delete optionCount[questionIndex];
}

// adds option appended to the question div
function addOption(questionNum) {
    optionCount[questionNum]++;
    var newOption = document.createElement("div");
    newOption.innerHTML = `
        <div id="option${optionCount[questionNum]}" class="option" idx="${optionCount[questionNum]}">
            <br><label style="font-size: 1.2em;">Option ID</label><br>
            <input type="text" name="opt" placeholder="Max length 10 characters"/><br>
            <label style="font-size: 1.2em;">Option Text</label><br>
            <input type="text" name="opttxt" placeholder="Max length 255 characters"/><br><br>
            <input type="button" value="Remove Option" class="btn btn-danger" onclick="removeOption(this, ${questionNum})"
			style="margin: 0 auto; display: block;" />
        </div>
        `;
    var optionsContainer = document.getElementById("optionsContainer" + questionNum);
    optionsContainer.insertBefore(newOption, optionsContainer.lastChild);
}

// removes the option
function removeOption(el, questionNum) {
    var optionIndex = el.parentNode.getAttribute('idx');
    var optionDiv = document.getElementById(`option${optionIndex}`);
    optionDiv.parentNode.removeChild(optionDiv);

    optionCount[questionNum]--;
}

// adds the question and option data to a preliminary json object
// checks if a mandatory field was left empty informs the user
function parseQuestions() {
    var questions = document.getElementsByTagName("div");
    var questionData = [];
    for (var i = 0; i < questions.length; i++) {
        if (questions[i].id.startsWith("question")) {
            var inputs = questions[i].getElementsByTagName("input");

            var qid = "";
            var qtext = "";
            var mand = "";
            var questionAdded = false;
            for (var j = 0; j < inputs.length; j++) {
                if (inputs[j].name === "qid") {
                    qid = inputs[j].value;
                }
                if (inputs[j].name === "qtext") {
                    qtext = inputs[j].value;
                }
                if (inputs[j].name === "mandatory") {
                    mand = inputs[j].value;
                }
                if (inputs[j].name === "type") {
                    if (!questionAdded) {
                        if (qid !== "" && qtext !== "" && mand !== "" && inputs[j].value !== "" && mand.match(/^(TRUE|FALSE)$/) && inputs[j].value.match(/^(profile|question)$/)) {
                            questionData.push({ "qID": qid, "qtext": qtext, "required": mand, "type": inputs[j].value });
                            questionAdded = true;
                        } else {
                            document.getElementById("error-box").style.display = "flex";
                            return;
                        }
                    }
                }
            }
            var options = questions[i].getElementsByTagName("div");
            var optionsAdded = [];
            for (var k = 0; k < options.length; k++) {
                if (options[k].id.startsWith("option")) {
                    var optionInputs = options[k].getElementsByTagName("input");
                    var opt = "";
                    var opttxt = "";
                    for (var l = 0; l < optionInputs.length; l++) {
                        if (optionInputs[l].name === "opt") {
                            opt = optionInputs[l].value;
                            if (opt === "") {
                                document.getElementById("error-box").style.display = "flex";
                                return;
                            }
                        }
                        if (optionInputs[l].name === "opttxt") {
                            opttxt = optionInputs[l].value;
                            if (opttxt === "") {
                                document.getElementById("error-box").style.display = "flex";
                                return;
                            }
                        }
                        if (opt !== "" && opttxt !== "") {
                            var option = opt + opttxt;
                            if (optionsAdded.indexOf(option) === -1) {
                                questionData.push({ "qID": qid, "optID": opt, "opttxt": opttxt });
                                optionsAdded.push(option);
                            }
                            opt = "";
                            opttxt = "";
                        }
                    }
                }
            }
        }
    }
    var json = JSON.stringify(questionData);
    sessionStorage.setItem("questionData", json);
    window.location.href = "/createflow";
}