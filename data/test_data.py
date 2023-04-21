import random

"""This script generates a volumnous amount of dummy data, used for testing
the questionnaire system API functionality. The data is written to a file 
called test_data.sql"""

def create_test_data():
    
    questionnaires = [("QQ" + str(i),"Questionnaire" + str(i), "mask" + str(i)) for i in range(1, 11)]
    questions = [("Q" + str(i), "QQ" + str(j), "Question " + str(i), False, False) for i in range(1, 21) for j in range(1, 11)]
    keywords = [("QQ" + str(j), "Keyword " + str(i)) for i in range(1, 11) for j in range(1, 11)]
    choices = [("Choice" + str(i), "QQ" + str(j), "Q" + str(k), "Choice " + str(i), "Q" + str(k + 1 + k % 3) if k + 1 + k % 3 < 21 else "NULLQ") for i in range(1, 10) for j in range(1, 11) for k in range(1, 21)]
    participants = [("Session" + str(i), "QQ" + str(j)) for i in range(1, 81) for j in range(1, 11)]
    answers = [("QQ" + str(j), "Q" + str(k), "Session" + str(i), "Choice" + str(random.randint(1,9))) for i in range(1, 81) for j in range(1, 11) for k in range(1, 21)]

    add_questionnaire = "INSERT INTO Questionnaire (QQID, Title, Mask) VALUES ('%s', '%s', '%s');"
    add_question = "INSERT INTO Question (QID, QQID, Qtext, Mandatory, Personal) VALUES ('%s', '%s', '%s', %s, %s);"
    add_keyword = "INSERT INTO Keyword (QQID, Keyword) VALUES ('%s', '%s');"
    add_choice = "INSERT INTO Choice (ChoiceID, QQID, QID, ChoiceText, NextQID) VALUES ('%s', '%s', '%s', '%s', '%s');"
    add_participant = "INSERT INTO Participant (SessionID, QQID) VALUES ('%s', '%s');"
    add_answer = "INSERT INTO Answer (QQID, QID, SessionID, ChoiceID) VALUES ('%s', '%s', '%s', '%s');"
    
    with open("test_data.sql", "w") as file:
        for questionnaire in questionnaires:
            file.write(f"{add_questionnaire.replace('%s', '{}')}\n".format(*questionnaire))
        for question in questions:
            file.write(f"{add_question.replace('%s', '{}')}\n".format(*question))
        for keyword in keywords:
            file.write(f"{add_keyword.replace('%s', '{}')}\n".format(*keyword))
        for choice in choices:
            file.write(f"{add_choice.replace('%s', '{}')}\n".format(*choice))
        for participant in participants:
            file.write(f"{add_participant.replace('%s', '{}')}\n".format(*participant))
        for answer in answers:
            file.write(f"{add_answer.replace('%s', '{}')}\n".format(*answer))
    
if __name__ == "__main__":
    create_test_data()