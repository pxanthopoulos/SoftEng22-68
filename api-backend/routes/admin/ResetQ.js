const express = require('express');
const router = express.Router();
const pool = require('../../db_connect');
const promisePool = pool.promise();

/**
 * @swagger
 * /intelliq_api/admin/resetq/{questionnaireID}:
 *   post:
*     tags:
 *      - admin
 *     summary: Reset a questionnaire
 *     description: Resets the specified questionnaire in the database
 *     parameters:
 *       - in: path
 *         name: questionnaireID
 *         required: true
 *         description: The ID of the questionnaire to reset
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The questionnaire was reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum:
 *                     - OK
 *       400:
 *         description: No questionnaire ID was provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum:
 *                     - failed
 *                 error:
 *                   type: string
 *       500:
 *         description: An error occurred while resetting the questionnaire
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum:
 *                     - failed
 *                 reason:
 *                   type: string
 */


router.post("/", (req, res) => {
    // Return 400 (Bad Request) if no questionnaireID is provided
    res.status(400).json({ status: "failed", error: "Missing required parameters: questionnaireID" });
    return;
});

router
    .route("/:questionnaireID")
    .post(async (req, res) => {
        const qqid = req.params.questionnaireID;

        // Get a connection from the promise pool
        const connection = await promisePool.getConnection();

        const participant_query = `delete from Participant WHERE QQID = '${qqid}'`;
        const answers_query = `delete from Answer WHERE QQID = '${qqid}'`;
        try {
            await connection.query(participant_query);
            await connection.query(answers_query);

            res.status(200).json({ status: "OK" });
            console.log("Questionnaire reset successful!");
        }
        catch (err) {
            res.status(500).json({ status: "failed", reason: err });
            console.log(err);
            return;
        }

    });

module.exports = router;