const express = require('express');
const router = express.Router();
const pool = require('../db_connect');
const promisePool = pool.promise();

/**
 * @swagger
 * /intelliq_api/doanswer/{questionnaireID}/{questionID}/{session}/{optionID}:
 *   post:
 *     summary: Add an answer to the database
 *     description: Adds an answer to a question in the database
 *     parameters:
 *       - in: path
 *         name: questionnaireID
 *         schema:
 *           type: string
 *         required: true
 *         description: The questionnaire ID of the answer to add
 *       - in: path
 *         name: questionID
 *         schema:
 *           type: string
 *         required: true
 *         description: The question ID of the answer to add
 *       - in: path
 *         name: session
 *         schema:
 *           type: string
 *         required: true
 *         description: The session ID of the answer to add
 *       - in: path
 *         name: optionID
 *         schema:
 *           type: string
 *         required: true
 *         description: The option ID of the answer to add
 *     responses:
 *       200:
 *         description: The answer was added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Answer added successfully
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Missing required parameters: questionnaireID, questionID"
 *       500:
 *         description: Internal error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal error"
 */


router.post("/", (req, res) => {
    // Return 400 (Bad Request) if no optionID, sessionID, questionID or questionnaireID is provided
    res.status(400).json({ error: "Missing required parameters: questionnaireID, questionID, sessionID, optionID" });
    return;
});

router.post("/:questionnaireID", (req, res) => {
    // Return 400 (Bad Request) if no optionID, sessionID, questionID or questionnaireID is provided
    res.status(400).json({ error: "Missing required parameter: questionID, sessionID, optionID" });
    return;
});

router.post("/:questionnaireID/:questionID", (req, res) => {
    // Return 400 (Bad Request) if no optionID, sessionID, questionID or questionnaireID is provided
    res.status(400).json({ error: "Missing required parameter: sessionID, optionID" });
    return;
});

router.post("/:questionnaireID/:questionID/:session", (req, res) => {
    // Return 400 (Bad Request) if no optionID, sessionID, questionID or questionnaireID is provided
    res.status(400).json({ error: "Missing required parameter: optionID" });
    return;
});

router.post("/:questionnaireID/:questionID/:session/:optionID", async (req, res) => {
    try {
        const { questionnaireID, questionID, session, optionID } = req.params;
        // check if session exists in participant table
        const select_query =
            `SELECT * FROM participant 
        WHERE QQID = '${questionnaireID}' AND SessionID = '${session}'`;

        // insert answer values into answer table
        const answer_query =
            `INSERT INTO Answer (QQID, QID, SessionID, ChoiceID) 
        VALUES ('${questionnaireID}', '${questionID}', '${session}', '${optionID}');`;

        try {
            const [select_result, _select_fields] = await promisePool.query(select_query, [questionnaireID, session]);
            if (select_result.length === 0) {
                const insert_query = `INSERT INTO participant (QQID, SessionID) VALUES ('${questionnaireID}', '${session}')`;
                await promisePool.query(insert_query, [questionnaireID, session]);
            }
            const [answer_result, _fields] = await promisePool.query(answer_query, [questionnaireID]);
            console.log(answer_result);
        } catch (error) {
            res.status(400).json({ error: error });
            console.log("Bad request");
            return;
        }
        res.status(200).json({ message: 'Answer added successfully' });
        return;

    } catch (err) {
        res.status(500).json({ error: "Internal error" });
        console.log(err);
        return;
    }
});

module.exports = router;