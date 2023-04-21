function submitForm() {
    const questionnaireID = document.getElementById("questionnaireID").value;
    const questionID = document.getElementById("questionID").value;
    Promise.all([
        fetch(`/intelliq_api/getquestionanswers/${questionnaireID}/${questionID}`),
        fetch(`/intelliq_api/question/${questionnaireID}/${questionID}`)
    ])
        .then(([answersRes, optionsRes]) => {
            return Promise.all([answersRes.json(), optionsRes.json()]);
        })
        .then(([answers, options]) => {

            if (answers.hasOwnProperty("error") || options.hasOwnProperty("error")) {
                alert("The Questionnaire is empty, or doesn't exist. Please give a valid Questionnaire ID.");
                // Reset chart
                var chart = new CanvasJS.Chart("chartContainer", {});
                chart.render();
                return;
            }

            var ansList = new Set(options.options.map(o => o.optID));
            var dataPoints = [];
            for (let ans of ansList) {
                var opttxt = options.options.find(o => o.optID === ans).opttxt;
                dataPoints.push({ y: countAnswers(answers, ans), label: opttxt });
            }
            var chart = new CanvasJS.Chart("chartContainer", {
                animationEnabled: true,
                theme: "light2",
                title: {
                    text: "Answers for Question " + answers.questionID + ": " + options.qtext
                },
                axisY: {
                    title: "Number of answers",
                    minimum: 0 // Set the minimum value of the y-axis to 0
                },
                data: [{
                    type: "column",
                    dataPoints: dataPoints,
                }]
            });
            chart.render();
        })
        .catch(error => console.error(error));
}

function loadQuestionList() {
    const questionnaireID = document.getElementById("questionnaireID").value;
    fetch(`/intelliq_api/questionnaire/${questionnaireID}`)
        .then(response => response.json())
        .then(data => {
            var select = document.getElementById("questionID");
            select.innerHTML = '';
            if (data.hasOwnProperty("error")) {
                var defaultOption = document.createElement("option");
                defaultOption.text = "Enter a valid questionnaire ID and the available questions will show here";
                defaultOption.value = "";
                defaultOption.disabled = true;
                defaultOption.selected = true;
                select.appendChild(defaultOption);
                alert("The Questionnaire is empty, or doesn't exist. Please give a valid Questionnaire ID.");
                return;
            }

            
            for (var i = 0; i < data["questions"].length; i++) {
                var option = document.createElement("option");
                option.value = data["questions"][i].qid;
                option.text = data["questions"][i].qid + " - " + data["questions"][i].qtext;
                select.appendChild(option);
            }

        })
        .catch(error => console.error(error));
}

function countAnswers(data, ans) {
    return data.answers.filter(a => a.ans === ans).length;
}