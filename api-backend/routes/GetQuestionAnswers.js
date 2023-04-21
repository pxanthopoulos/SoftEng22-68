const express = require('express');
const router = express.Router();
const pool = require('../db_connect');
const promisePool = pool.promise();
const { parse } = require('json2csv');

/**
 * @swagger
 * /intelliq_api/getquestionanswers/{questionnaireID}/{questionID}:
 *   get:
 *     summary: Get answers for a given question
 *     description: Returns the answers to a given question
 *     parameters:
 *       - in: path
 *         name: questionnaireID
 *         description: The ID of the questionnaire
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: questionID
 *         description: The ID of the question
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: format
 *         description: The format to return the data in, either JSON or CSV
 *         required: false
 *         schema:
 *           type: string
 *           enum: [csv, json]
 *     responses:
 *       200:
 *         description: The answers to the question
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 questionnaireID:
 *                   type: string
 *                 questionID:
 *                   type: string
 *                 answers:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       session:
 *                         type: string
 *                       ans:
 *                         type: string
 *           text/csv:
 *             schema:
 *               type: string
 *       400:
 *         description: Bad Request. Returns if no sessionID or questionnaireID is provided.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       402:
 *         description: No data. Returns if no data is found for the given questionnaireID and questionID.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Internal error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */


router.get("/", (req, res) => {
    // Return 400 (Bad Request) if no sessionID or questionnaireID is provided
    res.status(400).json({ error: "Missing required parameters: questionnaireID, questionID" });
    return;
});

router.get("/:questionnaireID", (req, res) => {
    // Return 400 (Bad Request) if no sessionID or questionnaireID is provided
    res.status(400).json({ error: "Missing required parameter: questionID" });
    return;
});

router.get("/:questionnaireID/:questionID", async (req, res) => {
    try {
        const { questionnaireID, questionID } = req.params;
        // Get questionnaire id, title
        const answers_query =
        `SELECT SessionID as session, ChoiceID AS ans 
        FROM answer 
        WHERE QQID = '${questionnaireID}' AND QID = '${questionID}';`;

        const [answer_result, _fields] = await promisePool.query(answers_query, [questionnaireID]);
        if (answer_result.length === 0) {
            res.status(402).json({ error: "No data" });
            console.log("No Question with that QQID and QID was found, or Questionnaire has no answers.");
            return;
        }

        // Create result JSON object
        const result = {
            "questionnaireID": questionnaireID,
            "questionID": questionID,
            "answers": answer_result
        }

        // Return result as JSON or CSV
        if (req.query.format === "csv") {
            const data_fields = ['questionnaireID', 'questionID', 'answers'];
            const data_opts = { data_fields };
            var result_csv = parse(result, data_opts);
            res.status(200).send(result_csv);
            console.log("Get question query successful! (CSV)");
        } else {
            res.status(200).send(result);
            console.log("Get question query successful! (JSON)");
        }
        
    } catch (err) {
        res.status(500).json({ error: "Internal error" });
        console.log(err);
        return;
    }
});
module.exports = router