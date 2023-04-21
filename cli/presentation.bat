@echo off

echo --------------Healthcheck---------------
python se2268.py healthcheck --format json 
pause

echo --------------------------------------------------
echo --------------Showing Questionnaire---------------
python se2268.py questionnaire --format json --questionnaire_id QQ1
pause

echo --------------------------------------------------
echo --------------Showing Question---------------
python se2268.py question --format json --questionnaire_id QQ1 --question_id Q1
pause
echo --------------------------------------------------
echo --------------Answering that Question---------------
python se2268.py doanswer --format json --questionnaire_id QQ1 --question_id Q1 --session_id VCLI --option_id C1
pause

echo --------------------------------------------------
echo --------------Showing Next Question---------------
python se2268.py question --format json --questionnaire_id QQ1 --question_id Q2
pause
echo --------------------------------------------------
echo --------------Answering that Question---------------
python se2268.py doanswer --format json --questionnaire_id QQ1 --question_id Q2 --session_id VCLI --option_id C1
pause

echo --------------------------------------------------
echo --------------Showing Next Question---------------
python se2268.py question --format json --questionnaire_id QQ1 --question_id Q3
pause
echo --------------------------------------------------
echo --------------Answering that Question---------------
python se2268.py doanswer --format json --questionnaire_id QQ1 --question_id Q3 --session_id VCLI --option_id C1
pause

echo --------------------------------------------------
echo --------------Showing Next Question---------------
python se2268.py question --format json --questionnaire_id QQ1 --question_id Q6
pause
echo --------------------------------------------------
echo --------------Answering that Question---------------
python se2268.py doanswer --format json --questionnaire_id QQ1 --question_id Q6 --session_id VCLI --option_id C2
pause

echo --------------------------------------------------
echo --------------Showing Next Question---------------
python se2268.py question --format json --questionnaire_id QQ1 --question_id Q7
pause
echo --------------------------------------------------
echo --------------Answering that Question---------------
python se2268.py doanswer --format json --questionnaire_id QQ1 --question_id Q7 --session_id VCLI --option_id C3
pause

echo --------------------------------------------------
echo --------------Showing Next Question---------------
python se2268.py question --format json --questionnaire_id QQ1 --question_id Q11
pause
echo --------------------------------------------------
echo --------------Answering that Question---------------
python se2268.py doanswer --format json --questionnaire_id QQ1 --question_id Q11 --session_id VCLI --option_id C1
pause

echo -------------------------------------------------------------------------------------
echo --------------Getting All Answers for Q6: Who is your favorite Artist?---------------
python se2268.py getquestionanswers --format json --questionnaire_id QQ1 --question_id Q6
pause

echo ----------------------------------------------------
echo --------------Resetting Everything------------------
python se2268.py resetall --format json

echo ----------------------------------------------------
echo --------------Uploading Questionnaire qq.json---------------
python se2268.py questionnaire_upd --format json --source qq.json
pause

echo ----------------------------------------------------
echo --------------Showing Questionnaire---------------
python se2268.py questionnaire --format json --questionnaire_id QQ000
pause

echo ----------------------------------------------------
echo --------------END OF PRESENTATION---------------
echo       ,~~.          ,~~.          ,~~.
echo      (  9 )-_,     (  9 )-_,     (  9 )-_,
echo   (\___ )=='-'  (\___ )=='-'  (\___ )=='-'
echo    \ .   ) )     \ .   ) )     \ .   ) )
echo     \ `-' /       \ `-' /       \ `-' /
echo      `~j-'         `~j-'         `~j-'   
echo        "=:           "=:           "=: