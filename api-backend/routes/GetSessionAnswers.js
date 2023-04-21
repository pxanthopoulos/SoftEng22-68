const express = require('express');
const router = express.Router();
const pool = require('../db_connect');
const promisePool = pool.promise();
const { parse } = require('json2csv');

/**
 * @swagger
 * /intelliq_api/getsessionanswers/{questionnaireID}/{session}:
 *   get:
 *     summary: Get answers for a given session
 *     description: Returns the answers for a given session
 *     produces:
 *       - application/json
 *       - text/csv
 *     parameters:
 *       - name: questionnaireID
 *         description: ID of the questionnaire
 *         in: path
 *         required: true
 *         type: string
 *       - name: session
 *         description: Session ID
 *         in: path
 *         required: true
 *         type: string
 *       - name: format
 *         description: Response format (json or csv)
 *         in: query
 *         required: false
 *         type: string
 *         enum: [json, csv]
 *         default: json
 *     responses:
 *       200:
 *         description: Returns the answers of the session
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 questionnaireID:
 *                   type: string
 *                 session:
 *                   type: string
 *                 answers:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       qID:
 *                         type: string
 *                       ans:
 *                         type: string
 *           text/csv:
 *             schema:
 *               type: string
 *       400:
 *         description: Returned if required parameters are missing
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *       402:
 *         description: Returned if no data is found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *       500:
 *         description: Returned if internal error occurs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 */

router.get("/", (req, res) => {
    // Return 400 (Bad Request) if no sessionID or questionnaireID is provided
    res.status(400).json({ error: "Missing required parameters: questionnaireID, questionID" });
    return;
});

router.get("/:questionnaireID", (req, res) => {
    // Return 400 (Bad Request) if no sessionID or questionnaireID is provided
    res.status(400).json({ error: "Missing required parameter: sessionID" });
    return;
});

router.get("/:questionnaireID/:session", async (req, res) => {
    try {
        const { questionnaireID, session } = req.params;
        // Get questionnaire id, title
        const session_query =
            `SELECT QID as qID, ChoiceID AS ans 
        FROM answer 
        WHERE SessionID = '${session}' AND QQID = '${questionnaireID}';`;

        const [session_result, _fields] = await promisePool.query(session_query, [questionnaireID]);
        if (session_result.length === 0) {
            res.status(402).json({ error: "No data" });
            console.log("No Session with that QQID and sessionID was found.");
            return;
        }

        // Create result JSON object
        const result = {
            "questionnaireID": questionnaireID,
            "session": session,
            "answers": session_result
        }

        // Return result as JSON or CSV
        if (req.query.format === "csv") {
            const data_fields = ['questionnaireID', 'session', 'answers'];
            const data_opts = { data_fields };
            var result_csv = parse(result, data_opts);
            res.status(200).send(result_csv);
            console.log("Get session query successful! (CSV)");
        } else {
            res.status(200).send(result);
            console.log("Get session query successful! (JSON)");
        }

    } catch (err) {
        res.status(500).json({ error: "Internal error" });
        console.log(err);
        return;
    }
});
module.exports = router;