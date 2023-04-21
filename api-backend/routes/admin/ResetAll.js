const express = require('express');
const router = express.Router();
const fs = require('fs');
const pool = require('../../db_connect');
const promisePool = pool.promise();

/**
 * @swagger
 * /intelliq_api/admin/resetall:
 *   post:
 *     tags:
 *      - admin
 *     summary: Reset all tables in the database
 *     description: Reset all tables in the database
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: failed
 *                 reason:
 *                   type: string
 *                   example: Error message.
 */


// Reset all tables in the database
router
    .route("/")
    .post(async (req, res) => {
        // Get a connection from the promise pool
        const connection = await promisePool.getConnection();

        try {
            // Read the SQL script
            const sql = await fs.promises.readFile('../data/tables.sql', 'utf8');

            // Split the script into separate statements
            let statements = sql.split(';');

            // Execute each statement individually
            for (let statement of statements) {
                if (statement === '\r\n') continue;
                if (statement === '\n') continue;

                await connection.query(statement);
            }

            res.status(200).json({ status: "OK" });
            console.log("Database reset successful!");
        } catch (err) {
            res.status(500).json({ status: "failed", reason: err });
            console.log(err);
            return;
        }
    });

module.exports = router;
