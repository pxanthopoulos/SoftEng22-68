const express = require('express');
const router = express.Router();
const pool = require('../db_connect');
const promisePool = pool.promise();
const { parse } = require('json2csv');

/**
 * @swagger
 * /intelliq_api/getlastsessid:
 *   get:
 *     summary: Get last session ID
 *     description: Returns the lexicographically last session ID
 *     produces:
 *       - application/json
 *       - text/csv
 *     parameters:
 *       - name: format
 *         description: Response format (json or csv)
 *         in: query
 *         required: false
 *         type: string
 *         enum: [json, csv]
 *         default: json
 *     responses:
 *       200:
 *         description: Returns the last sessid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sessionID:
 *                   type: string
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

router.get("/", async (req, res) => {
    try {

        // the query below returns the lexicographically last session ID
        const session_query =
            `SELECT SessionID as sessID
            FROM Participant 
            ORDER BY CAST(REVERSE(CAST(REVERSE(sessID) AS SIGNED)) AS SIGNED)
            DESC
            LIMIT 1;`;

        const [session_result, _fields] = await promisePool.query(session_query);
        if (session_result.length === 0) {
            res.status(402).json({ error: "No data" });
            console.log("No sessionID was found.");
            return;
        }

        // the above query fails if the 2 last sessionIDs are S79 and S80, where it returns S79
        // so we resolve this problem
        var sessid = session_result[0].sessID;
        var final_sessid = sessid;

        // if the returned sessionID ends with 9
        // check if the lexicographically next sessionID exists in the DB
        // if yes, return that, if not, return the previous sessionID
        if (sessid.endsWith("9")) {
            const match = sessid.match(/(\d+)$/);
            if (match) {
                const numericPart = match[1];
                const newNumericPart = String(parseInt(numericPart) + 1);
                sessid = sessid.replace(/(\d+)$/, newNumericPart.padStart(numericPart.length, "0"));
            } else {
                sessid += "1";
            }
            const check_query =
                `SELECT * FROM Participant 
            WHERE SessionID = '${sessid}'`;

            const [check_result, _fields] = await promisePool.query(check_query);
            if (check_result.length !== 0) {
                final_sessid = sessid;
            }
        }

        // Create result JSON object
        const result = {
            "sessionID": final_sessid
        }
        // Return result as JSON or CSV
        if (req.query.format === "csv") {
            const data_fields = ['session', 'answers'];
            const data_opts = { data_fields };
            var result_csv = parse(result, data_opts);
            res.status(200).send(result_csv);
            console.log("Get sessionID query successful! (CSV)");
        } else {
            res.status(200).send(result);
            console.log("Get sessionID query successful! (JSON)");
        }

    } catch (err) {
        res.status(500).json({ error: "Internal error" });
        console.log(err);
        return;
    }
});
module.exports = router;