import random

"""This script generates answers for the questionnaire in sample_data_tiny.sql"""

def create_test_data():
        participants = [("SMPL" + str(i), "QQ1") for i in range(1, 250)]
        choice_nos = [2, 3, 3, 4, 2, 3, 3, 2, 2, 1, 1]
        answers = [("QQ1", "Q" + str(j), "SMPL" + str(i), "C" + str(random.randint(1, choice_nos[j-1]))) for i in range(1, 250) for j in range(1, 12)]
        add_participant = "INSERT INTO Participant (SessionID, QQID) VALUES ('%s', '%s');"
        add_answer = "INSERT INTO Answer (QQID, QID, SessionID, ChoiceID) VALUES ('%s', '%s', '%s', '%s');"
        
        with open("sample_answers.sql", "w") as file:
            for participant in participants:
                file.write(f"{add_participant.replace('%s', '{}')}\n".format(*participant))
            for answer in answers:
                file.write(f"{add_answer.replace('%s', '{}')}\n".format(*answer))

if __name__ == "__main__":
    create_test_data()