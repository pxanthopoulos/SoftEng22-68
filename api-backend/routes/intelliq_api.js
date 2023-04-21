const express = require('express');
const router = express.Router();

router.use("/admin", require('./admin/admin.js'));
router.use("/doanswer", require("./DoAnswer"));
router.use("/questionnaire", require("./Questionnaire"));
router.use("/question", require("./Question"));
router.use("/getsessionanswers", require("./GetSessionAnswers"));
router.use("/getquestionanswers", require("./GetQuestionAnswers"));
router.use("/getlastsessid", require("./GetLastSessid"));

module.exports = router
