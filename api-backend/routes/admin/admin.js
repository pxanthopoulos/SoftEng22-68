const express = require('express');
const router = express.Router();

router.use("/healthcheck", require("./Healthcheck"));
router.use("/questionnaire_upd", require("./QuestionnaireUpd"));
router.use("/resetall", require("./ResetAll"));
router.use("/resetq", require("./ResetQ"));
router.use("/insert_testdata", require("./InsertTestData"));
router.use("/insert_sampledata", require("./InsertSampleData"));

module.exports = router;