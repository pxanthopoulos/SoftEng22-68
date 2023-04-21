const express = require('express');
const router = express.Router();
const pool = require('../../db_connect');
const promisePool = pool.promise();
const fs = require('fs');
const path = require('path');

/**
 * @swagger
 * /intelliq_api/admin/insert_testdata:
 *  post:
 *    tags: 
 *     - admin
 *    description: Insert sample data into the database, after resetting the database
 *    produces:
 *      - application/json
 *    responses:
 *      200:
 *        description: Successfully inserted sample data
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  description: Indicates if the sample data insertion was successful or not
 *      500:
 *        description: Internal server error
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  description: Indicates if the sample data insertion was successful or not
 *                error:
 *                  type: object
 *                  properties:
 *                    message:
 *                      type: string
 *                      description: Error message
 *                    code:
 *                      type: string
 *                      description: Error code
 *                    errno:
 *                      type: integer
 *                      description: Error number
 *                    sql:
 *                      type: string
 *                      description: SQL statement that caused the error
 *                    sqlState:
 *                      type: string
 *                      description: SQL state
 *                    sqlMessage:
 *                      type: string
 *                      description: SQL error message
 */


router.post("/", async (req, res) => {
    try {
      // Read SQL files for reseting the database and inserting sample data,
      // and split the files into separate statements
      const tablesSql = fs.readFileSync(path.join(__dirname, '../../../data/tables.sql'), 'utf-8').split(';');
      const testDataSql = fs.readFileSync(path.join(__dirname, '../../../data/sample_data_tiny.sql'), 'utf-8').split(';');

      // Start transaction and execute SQL statements to reset the database and insert sample data
      await promisePool.query('START TRANSACTION');
      for (let i = 0; i < tablesSql.length; i++) {
        const statement = tablesSql[i];

        // Check if the statement is not empty. If it is, ignore.
        if (statement.replace("/\r/g", "").replace("/\n/g", "").trim().length > 0) 
            await promisePool.query(statement);
            console.log(statement);
      }

      for (let i = 0; i < testDataSql.length; i++) {
        const statement = testDataSql[i];
        if (statement.replace("/\r/g", "").replace("/\n/g", "").trim().length > 0) 
        await promisePool.query(statement);
        }

      await promisePool.query('COMMIT');
  
      res.status(200).send({ success: true });
    } catch (error) {
      console.error(error);
      await promisePool.query('ROLLBACK');
      res.status(500).send({ success: false, error });
    }
  });
  
module.exports = router;