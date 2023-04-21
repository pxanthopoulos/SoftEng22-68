const firstButton = document.getElementById("firstButton");
const secondButton = document.getElementById("secondButton");

var questionnaire_result = {};

//this function searches for the questionnaire with the given QQID value
// and gives the user the optin to select the questionnaire and answer it
function fetchQuestionnaire(){
    const questionnaireID = document.getElementById("questionnaireID").value;
    //give a GET request
    fetch(`/intelliq_api/questionnaire/${questionnaireID}`)
        .then(response => response.json())
       // .then(response => console.log(response))
        .then(data => {
            var questionContainer = document.getElementById("card");
            //if no such questionnaire exist in database
            if (data.hasOwnProperty("error")) {
               alert("The Questionnaire is empty, or doesn't exist. Please give a valid Questionnaire ID.");
               secondButton.style.display = "none";
               var question = document.createElement("div");
                question.innerHTML = `<div></div>`;
               questionContainer.replaceChildren(question);
            }
            else {
                //enable (display) the option to answer the selected questionnaire
                secondButton.style.display = "block";
                var title = data["questionnaireTitle"];
                //change the apperance of page
                var question = document.createElement("div");
                question.innerHTML = `
                <div>
                <form id="questionnaireIntro" style="text-align: center; padding: 10px 20px;">
                <h1>Give answers for questionnaire with title :<h1/>
                <h2>${title}<h2/>
                <h3>Are you sure you want to answer this questionnaire?
                <h3/>
                </form>
                </div>
                `;
                //questionContainer.appendChild(question);
                questionContainer.replaceChildren(question);
                questionnaire_result = {
                    "questionnaireID": questionnaireID,
                    "questionnaireTitle": title,
                    "mask": data["mask"],
                    "keywords": data["keywords"],
                    "questions": data["questions"]
                }
            }
        })
        .catch(error => console.error(error));

}

//change page and pass questionnaire data to the next page
function answer() {
    var json = JSON.stringify(questionnaire_result);
    sessionStorage.setItem("questionnaireData", json);
    window.location.href = "/answer";
}
