const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const pool = require('../../db_connect');
const promisePool = pool.promise();


/**
 * @swagger
 * /intelliq_api/admin/questionnaire_upd:
 *  post:
 *    tags:
 *     - admin
 *    summary: Update a questionnaire
 *    description: Updates the questionnaire details in the database
 *    requestBody:
 *      content:
 *        multipart/form-data:
 *          schema:
 *            type: object
 *            properties:
 *              jsonFile:
 *                type: string
 *                format: binary
 *    responses:
 *      200:
 *        description: Successful operation
 *      400:
 *        description: Bad request (malformed input)
 *      500:
 *        description: Internal server error
 */


// checks if the json file has the required format
function check(jsonData) {
    // first check the general questionnaire data
    if (!(
        jsonData.hasOwnProperty('questionnaireID') &&
        typeof jsonData.questionnaireID === 'string' &&
        jsonData.questionnaireID.length > 0 &&
        jsonData.questionnaireID.length < 11 &&

        jsonData.hasOwnProperty('questionnaireTitle') &&
        typeof jsonData.questionnaireTitle === 'string' &&
        jsonData.questionnaireTitle.length > 0 &&
        jsonData.questionnaireTitle.length < 256 &&

        jsonData.hasOwnProperty('keywords') &&
        Array.isArray(jsonData.keywords) &&

        jsonData.hasOwnProperty('questions') &&
        Array.isArray(jsonData.questions) &&
        jsonData.questions.length > 0
    )) {
        console.log("qq error");
        return false;
    } else {

        if (jsonData.hasOwnProperty('qqmask') && jsonData.qqmask.length > 0) {
            if (!(
                typeof jsonData.qqmask === 'string' &&
                jsonData.qqmask.match(/^@[a-zA-Z][a-zA-Z0-9]*([.-][a-zA-Z0-9]+)*\.[a-zA-Z0-9]*[a-zA-Z]$/) &&
                jsonData.qqmask.length <= 63
            )) {
                console.log("qqmask error");
                return false;
            }
        }

        for (let i = 0; i < jsonData.keywords.length; i++) {
            var keyword = jsonData.keywords[i];

            if (keyword.length > 255) {
                console.log("keyword error");
                return false;
            }
        }

        // for each question, check its format and every option it has

        for (let i = 0; i < jsonData.questions.length; i++) {
            var question = jsonData.questions[i];

            if (!(
                question.hasOwnProperty('qID') &&
                typeof question.qID === 'string' &&
                question.qID.length > 0 &&
                question.qID.length < 11 &&

                question.hasOwnProperty('qtext') &&
                typeof question.qtext === 'string' &&
                question.qtext.length > 0 &&
                question.qtext.length < 256 &&

                question.hasOwnProperty('required') &&
                typeof question.required === 'string' &&
                question.required.match(/^(TRUE|FALSE)$/) &&

                question.hasOwnProperty('type') &&
                typeof question.type === 'string' &&
                question.type.match(/^(profile|question)$/) &&

                question.hasOwnProperty('options') &&
                Array.isArray(question.options) &&
                question.options.length > 0
            )) {
                console.log("q error");
                console.log(question);
                return false;
            }
            else {
                // for each option of the current question, check the format
                for (let i = 0; i < question.options.length; i++) {
                    var option = question.options[i];

                    if (!(
                        option.hasOwnProperty('optID') &&
                        typeof option.optID === 'string' &&
                        option.optID.length > 0 &&
                        option.optID.length < 11 &&

                        option.hasOwnProperty('opttxt') &&
                        typeof option.opttxt === 'string' &&
                        option.opttxt.length > 0 &&
                        option.opttxt.length < 256 &&

                        option.hasOwnProperty('nextqID') &&
                        typeof option.nextqID === 'string' &&
                        option.nextqID.length > 0 &&
                        option.nextqID.length < 11
                    )) {
                        console.log("opt error");
                        console.log(option);
                        return false;
                    }
                }
            }
        }
    }

    return true;
}

// creates an array of the query statements, in the correct order to be executed
function showqueries(jsonstr) {
    var qq = JSON.parse(jsonstr);

    // first, it checks the format and returns false of it is wrong
    var ret = check(qq);

    if (ret === false) {
        console.log("json error");
        return false;
    } else {
        console.log("good json");
    }

    // creates all the query statements and adds them to an array
    if (qq.mask === undefined) {
        var qq_query = "INSERT INTO Questionnaire (QQID, Title) VALUES ('" + qq.questionnaireID + "', '" + qq.questionnaireTitle + "');";
    }
    else {
        var qq_query = "INSERT INTO Questionnaire (QQID, Title, Mask) VALUES ('" + qq.questionnaireID + "', '" + qq.questionnaireTitle + "', '" + qq.qqmask + "');";
    }

    var keywords_queries = [];
    for (var i = 0; i < qq.keywords.length; i++) {
        var query = "INSERT INTO Keyword (QQID, Keyword) VALUES ('" + qq.questionnaireID + "', '" + qq.keywords[i] + "');";
        keywords_queries.push(query);
    }

    var question_queries = [];
    var option_queries = [];
    for (var i = 0; i < qq.questions.length; i++) {
        var mandatory = false;
        var profile = false;

        if (qq.questions[i].required === "TRUE") {
            mandatory = true;
        }
        if (qq.questions[i].type === "profile") {
            profile = true;
        }

        var q_query = "INSERT INTO Question (QID, QQID, Qtext, Mandatory, Personal) VALUES ('" + qq.questions[i].qID + "', '" + qq.questionnaireID + "', '" + qq.questions[i].qtext + "', " + mandatory + ", " + profile + ");";
        question_queries.push(q_query);

        for (var j = 0; j < qq.questions[i].options.length; j++) {
            var opt_query = "INSERT INTO Choice (ChoiceID, QQID, QID, ChoiceText, NextQID) VALUES ('" + qq.questions[i].options[j].optID + "', '" + qq.questionnaireID + "', '" + qq.questions[i].qID + "', '" + qq.questions[i].options[j].opttxt + "', '" + qq.questions[i].options[j].nextqID + "');";
            option_queries.push(opt_query);
        }
    }

    query_arr = [];
    query_arr.push(qq_query);
    query_arr.push(keywords_queries);
    query_arr.push(question_queries);
    query_arr.push(option_queries);
    return query_arr;
}

router
    .route("/")
    .post(upload.single('jsonFile'), async (req, res) => {
        try {
            if (req.file) {
                var jsonstr = req.file.buffer.toString();
                var query_arr = showqueries(jsonstr);

                // if showqueries returned false, return error message
                if (!query_arr) {
                    res.status(400).json({ status: "failed", error: "Wrong JSON format" });
                    console.log("Wrong JSON format");
                    return;
                }

                // flatten the array and execute each query
                query_arr = query_arr.flat();
                for (var i = 0; i < query_arr.length; i++) {
                    try {
                        query = query_arr[i];
                        const [result, _fields] = await promisePool.query(query);
                        console.log(result);
                    } catch (error) {
                        res.status(400).json({ status: "failed", error: error.message });
                        console.log("Bad request/MySQL error");
                        return;
                    }
                }
                res.status(200).json({ status: "OK", message: 'Questionnaire added successfully' });
                return;
            }
            else {
                res.status(400).json({ status: "failed", error: "No file was given!" });
                console.log("Bad request/No file");
                return;
            }
        }
        catch (err) {
            res.status(500).json({ status: "failed", error: "Internal error" });
            console.log(err);
            return;
        }
    });

module.exports = router;