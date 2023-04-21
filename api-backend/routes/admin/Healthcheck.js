const express = require('express');
const { PrecompiledLoader } = require('nunjucks');
const router = express.Router();
const pool = require("../../db_connect");
const promisePool = pool.promise();

/**
 * @swagger
 * /intelliq_api/admin/healthcheck:
 *  get:
 *    tags:
 *      - admin
 *    summary: Check the health of the API and its database connection
 *    description: Returns the status of the API and its database connection as a JSON object. A status of "OK" and "Connected" indicate that everything is functioning properly.
 *    responses:
 *      200:
 *        description: Health check was successful
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                status:
 *                  type: string
 *                  example: "OK"
 *                dbconnection:
 *                  type: string
 *                  example: "Connected"
 *      500:
 *        description: Internal error
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: string
 *                  example: "Error message"
 */


router
    .route("/")
    .get((req, res) => {
        pool.getConnection((err, conn) => {
            if (err) {
                res.json({ status: "failed", dbconnection: err.toString() });
                throw err;
            }
            else
                res.json({ status: "OK", dbconnection: "Connected" });
            conn.release();
        });

    });

module.exports = router;