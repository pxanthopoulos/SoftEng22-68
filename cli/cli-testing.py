import subprocess
import os
import pytest
import asyncio
from pathlib import Path

def capture(command):
	proc = subprocess.Popen(command,
		stdout = subprocess.PIPE,
		stderr = subprocess.PIPE
	)
	out,err = proc.communicate()
	return out, err, proc.returncode

@pytest.mark.asyncio
async def test_healthcheck():
	command = ["python", "./se2268.py", "healthcheck", "--format", "json"]
	out, err, exitcode = capture(command)
	assert b"200" in out

@pytest.mark.asyncio
async def test_questionnaire_upd():
	command = ["python", "./se2268.py", "questionnaire_upd", "--source", "qq.json", "--format", "json"]
	out, err, exitcode = capture(command)
	assert b"200" in out

@pytest.mark.asyncio
async def test_questionnaire_json():
	command = ["python", "./se2268.py", "questionnaire", "--questionnaire_id", "QQ1", "--format", "json"]
	out, err, exitcode = capture(command)
	assert b"200" in out

@pytest.mark.asyncio
async def test_questionnaire_csv():
	command = ["python", "./se2268.py", "questionnaire", "--questionnaire_id", "QQ1", "--format", "csv"]
	out, err, exitcode = capture(command)
	assert b"200" in out

@pytest.mark.asyncio
async def test_questionnaire_invalid_json():
	command = ["python", "./se2268.py", "questionnaire", "--questionnaire_id", "wrong", "--format", "json"]
	out, err, exitcode = capture(command)
	assert (b"400" in out) or (b"402" in out)

@pytest.mark.asyncio
async def test_question_json():
	command = ["python", "./se2268.py", "question", "--questionnaire_id", "QQ1", "--question_id", "Q1", "--format", "json"]
	out, err, exitcode = capture(command)
	assert b"200" in out

@pytest.mark.asyncio
async def test_question_csv():
	command = ["python", "./se2268.py", "question", "--questionnaire_id", "QQ1", "--question_id", "Q1", "--format", "csv"]
	out, err, exitcode = capture(command)
	assert b"200" in out

@pytest.mark.asyncio
async def test_question_invalid_json():
	command = ["python", "./se2268.py", "question", "--questionnaire_id", "QQ1", "--question_id", "wrong", "--format", "json"]
	out, err, exitcode = capture(command)
	assert (b"400" in out) or (b"402" in out)

@pytest.mark.asyncio
async def test_doanswer_json():
	command = ["python", "./se2268.py", "doanswer", "--questionnaire_id", "QQ000", "--question_id", "Q01", "--session_id", "68", "--option_id", "Q01A1", "--format", "json"]
	out, err, exitcode = capture(command)
	assert b"200" in out

@pytest.mark.asyncio
async def test_getsessionanswers_json():
	command = ["python", "./se2268.py", "getsessionanswers", "--questionnaire_id", "QQ000", "--session_id", "68", "--format", "json"]
	out, err, exitcode = capture(command)
	assert b"200" in out

@pytest.mark.asyncio
async def test_getsessionanswers_csv():
	command = ["python", "./se2268.py", "getsessionanswers", "--questionnaire_id", "QQ000", "--session_id", "68", "--format", "csv"]
	out, err, exitcode = capture(command)
	assert b"200" in out

@pytest.mark.asyncio
async def test_getsessionanswers_invalid_json():
	command = ["python", "./se2268.py", "getsessionanswers", "--questionnaire_id", "wrong", "--session_id", "68", "--format", "json"]
	out, err, exitcode = capture(command)
	assert (b"400" in out) or (b"402" in out)

@pytest.mark.asyncio
async def test_getquestionanswers_json():
	command = ["python", "./se2268.py", "getquestionanswers", "--questionnaire_id", "QQ000", "--question_id", "Q01", "--format", "json"]
	out, err, exitcode = capture(command)
	assert b"200" in out

@pytest.mark.asyncio
async def test_getsessionanswers_csv():
	command = ["python", "./se2268.py", "getsessionanswers", "--questionnaire_id", "QQ000", "--session_id", "68", "--format", "csv"]
	out, err, exitcode = capture(command)
	assert b"200" in out

@pytest.mark.asyncio
async def test_getquestionanswers__invalid_json():
	command = ["python", "./se2268.py", "getquestionanswers", "--questionnaire_id", "wrong", "--question_id", "Q01", "--format", "json"]
	out, err, exitcode = capture(command)
	assert (b"400" in out) or (b"402" in out)

@pytest.mark.asyncio
async def test_resetq_json():
	command = ["python", "./se2268.py", "resetq", "--questionnaire_id", "QQ1", "--format", "json"]
	out, err, exitcode = capture(command)
	assert b"200" in out

@pytest.mark.asyncio
async def test_resetall():
	command = ["python", "./se2268.py", "resetall", "--format", "json"]
	out, err, exitcode = capture(command)
	assert b"200" in out