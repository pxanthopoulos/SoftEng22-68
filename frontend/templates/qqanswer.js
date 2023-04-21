var questionnaireData = JSON.parse(sessionStorage.getItem('questionnaireData'));
//index determining the question taken from questionnaire json
var qindex = 0;
//will contain the results of question request
var question_result = {};
//will contain the answers of one session
var answers = [];

//function that checks the optional mask given
function checkMask() {
    //if no mask was given display first question (get)
    if (questionnaireData["mask"] === "") {
        get();
    }
    else {
        var input = document.getElementById("mail");
        //check if mask is contained in mail given
        if (!input.value.includes(questionnaireData["mask"])) {
           alert("You are not allowed to answer");
           window.location.href = "/";
        }
        else {
            get();
        }
    }
}

//fetching first question when page loads
function display() {  
    var title = questionnaireData["questionnaireTitle"];
    var question = document.createElement("div");
    question.innerHTML = `
    <div>
    <form id="questionnaireIntro" style="text-align: center; padding: 10px 20px;">
    <h1>${title}
    <h1/>
    </form>
    </div>
    `;
    var questionContainer = document.getElementById("header");
    questionContainer.appendChild(question);
    if (questionnaireData["mask"] !== "") {
        //if a mask is specified show the form fields for mail input
        var mailspace = document.getElementById("mask");
        mailspace.style.display = "block";
    }
    //hide begin button
    var butt = document.getElementById("beginButton");
       butt.style.display = "block";
}

//this function pulls the options for every question and displays them
function get() {
    //display question
    var question = questionnaireData["questions"][qindex];
    var showq = document.createElement("div");
    showq.innerHTML = `
    <div>
    <form id="questionnaireIntro" style="text-align: center;">
    <h2>${question["qtext"]}
    <h2/>
    </form>
    </div>
    `;
    var questionContainer = document.getElementById("card");
    questionContainer.style.backgroundColor = "lightgrey";
    questionContainer.replaceChildren(showq);
    const questionID =  question["qid"];
    const questionnaireID = questionnaireData["questionnaireID"];
    //send GET request for the question
    fetch(`/intelliq_api/question/${questionnaireID}/${questionID}`)
    .then(response => response.json())
    .then(data => {
        if (data.hasOwnProperty("error")) {
        }
        else {
            //take the result of the request
            question_result = {
                "questionnaireID": data["questionnaireID"],
                "qID": data["qID"],
                "qtext": data["qtext"],
                "required": data["required"],
                "type": data["type"],
                "options": data["options"]
            }
            //display each option
            for (var i = 0; i < question_result["options"].length; i++) {
                var option = document.createElement("div");
                //<label class="form-check-label" for="exampleRadios1" style="display: inline-block; vertical-align: top; text-align: center;">
                option.innerHTML = `
                
                    <div class="form-check" style="text-align: center;">
                    <label><input class="form-check-input"  type="radio" name="exampleRadios" id="exampleRadios1" value="option1">
                        ${ question_result["options"][i]["opttxt"]}
                        </label>
                    </div> 

                `;
                questionContainer.appendChild(option);
            }
            questionContainer.style.textAlign = "center";
            var butt = document.createElement("div");
            butt.innerHTML = `
                <div>
                <br>
                <button id="secondButton" class="btn btn-danger"  onclick=" fetchNext(question_result)"
                        style="margin: 0 auto; display: block;">Next</button>
                </div>`;
            questionContainer.appendChild(butt);
        }    
    })
    .catch(error => console.error(error));
}

//this function defines the next question depending on the type of question
function fetchNext(question_result) {
    //take the chosen option and append it to answers
    var optindex = -1;
    var ele = document.getElementsByName('exampleRadios'); 
    for(i = 0; i < ele.length; i++) {
        if (ele[i].checked) {
            optindex = i;
        }
    }
    //if not answered check whether mandatory
    if (optindex === -1) {
        //if question is mandatory request answer
        if (question_result["required"] === "true") {
            alert("This question is required!");
            get();
            return
        }
        else {
            qindex = qindex + 1;
            //if there are no more questions display answers
            if (qindex == questionnaireData["questions"].length) {
                getAnswers();
                return;
            }
            else {
                //next question (QID) will be the one difined from first option
                for (var i = 0; i < questionnaireData["questions"].length; i++) {
                    //find wich question of the result has the wanted QID
                    if  (questionnaireData["questions"][i]["qid"] === question_result["options"][0]["nextqID"]) {
                        qindex = i;
                        break;
                    }
                }
                //display the question
                get();
                return;
            }
        }
    }
    else {

        //if answered
        //take the result
        var temp = {
            "questionnaireID": question_result["questionnaireID"],
            "qID": question_result["qID"],
            "qtext": question_result["qtext"],
            "type": question_result["type"],
            "optID": question_result["options"][optindex]["optID"],
            "optiontxt": question_result["options"][optindex]["opttxt"],
            "nextq": question_result["options"][optindex]["nextqID"]
        };
        //push the result to answers
        answers.push(temp);
        //if final question show all answers
        if (temp["nextq"] === "NULLQ") {
            getAnswers();
        }
        else {
            //find next question
            for (var i = 0; i < questionnaireData["questions"].length; i++) {
                if  (questionnaireData["questions"][i]["qid"] === temp["nextq"]) {
                    qindex = i;
                    break;
                }
            }
            //display the question
            get();
        }
        
    }
}
    
//this function displays all the questions ANSWERED and the selected option
function getAnswers() {
    //hide some buttons
    var butt2 = document.getElementById("secondButton");
    butt2.style.display = "none"; 
    var card2 = document.getElementById("card");
    var answer = document.createElement("div");
    answer.innerHTML = `
    <div>
    <form id="answers" style="text-align: center; padding: 10px 20px;">
    <h1>Your answers
    <h1/>
    </form>
    </div>
    `;
    card2.replaceChildren(answer);
    
    for (var i = 0; i < answers.length; i++) {
        var answer2 = document.createElement("div");
        answer2.innerHTML = `
        <div>
        <form id="answers" style="text-align: center; padding: 10px 20px;">
        <h2>Question ${i + 1} : ${answers[i]["qtext"]}
        <h2/>
        <h3>You answered : ${answers[i]["optiontxt"]}
        <h3/>
        </form>
        </div>
        `;
        card2.appendChild(answer2);
        
    }
    //display submit button
    var butt = document.getElementById("submitButton");
    butt.style.display = "block"; 
}

//this function actually submits the aswers
function submit(sessionID) {
    const questionnaireID = questionnaireData["questionnaireID"];
    //for every answer in answers array send POST request
    for (var i = 0; i < answers.length; i++) {
        var qid = answers[i]["qID"];
        var opt = answers[i]["optID"];
        fetch(`/intelliq_api/doanswer/${questionnaireID}/${qid}/${sessionID}/${opt}`, {method: 'POST'})
        .then(response => response.json())
        .catch(error => console.error(error));
    }
    //if successful clear answers array and redirect to home page
    answers = [];
    window.location.href = "/";
}

//decides next session id 
function getSession() {
    var new_session = [];
    //send GET request
    fetch(`/intelliq_api/getlastsessid/`)
    .then(response => response.json())
    .then(data => {
        if (data.hasOwnProperty("error")) {
            //if there was no session define the id
            if (data["error"] == "No data") {
                new_session.push("SESH1");
                submit(new_session[0]);
            }
        }
        else {
            //define next session id addind 1 (alphanumerical)
            var count = data["sessionID"].match(/\d*$/);
            new_session.push(data["sessionID"].substr(0, count.index) + (++count[0]));
            //ready to submit answers
            submit(new_session[0]);
        }
    }
    )
    .catch(error => console.error(error));
}
