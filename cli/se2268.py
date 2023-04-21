import argparse
import requests
import sys
import csv
import json

#SCOPES: "healthcheck", "resetall", "questionnaire_upd", "resetq", "questionnaire",
#   "question", "doanswer", "getsessionanswers", "getquestionanswers", "admin"

def print_format(res,args):
    if args.format[0]=="json":
        print(res.json())
    else:
        decoded_content = res.content.decode('utf-8')
        cr = csv.reader(decoded_content, delimiter=',')
        my_list = list(cr)
        for row in my_list:
            print(*row, sep = ",", end='')

#otan h requests.get den briskei th selida petaei exception to opoio isws prepei na kanoume catch.

#json
def healthcheck(args):
    res = requests.get('http://localhost:9103/intelliq_api/admin/healthcheck' +'?format='+args.format[0])
    print(res.status_code)
    print(res.json())
    return 0

#json       
def resetall(args):
    res = requests.post('http://localhost:9103/intelliq_api/admin/resetall' +'?format='+args.format[0])
    print(res.status_code)
    print(res.json())
    return 0
  
#json
def questionnaire_upd(args):
    print(args.source[0])
    file = open(args.source[0])
    myjson = json.load(file)
    json_data = json.dumps(myjson)
    files = {"jsonFile": ("qqjson.json", json_data, "application/json")}
    res = requests.post('http://localhost:9103/intelliq_api/admin/questionnaire_upd' \
                        +'?format='+args.format[0], files=files)
    print(res.status_code)
    print(res.json())
    return 0

#json
def resetq(args):
    res = requests.post('http://localhost:9103/intelliq_api/admin/resetq/' + \
                        args.questionnaire_id[0] +'?format='+args.format[0])
    print(res.status_code)
    print(res.json())
    return 0

#json/csv
def questionnaire(args):
    res = requests.get('http://localhost:9103/intelliq_api/questionnaire/' + \
                       args.questionnaire_id[0] +'?format='+args.format[0])
    print(res.status_code)
    print_format(res,args)
    return 0

#json/csv
def question(args):
    res = requests.get('http://localhost:9103/intelliq_api/question/'  + \
                       args.questionnaire_id[0] + '/' + args.question_id[0] +'?format='+args.format[0])
    print(res.status_code)
    print_format(res,args)
    return 0

#json 
def doanswer(args):
    res = requests.post('http://localhost:9103/intelliq_api/doanswer/'  + \
                       args.questionnaire_id[0] + '/' + args.question_id[0] + '/' + \
                       args.session_id[0] + '/' + args.option_id[0] +'?format='+args.format[0])
    print(res.status_code)
    print(res.json())
    return 0

#json/csv
def getsessionanswers(args):
    res = requests.get('http://localhost:9103/intelliq_api/getsessionanswers/' + \
                       args.questionnaire_id[0] + '/' + \
                       args.session_id[0] + '?format='+args.format[0])
    print(res.status_code)
    print_format(res,args)
    return 0

#json/csv
def getquestionanswers(args):
    res = requests.get('http://localhost:9103/intelliq_api/getquestionanswers/'  + \
                       args.questionnaire_id[0] + '/' + \
                       args.question_id[0] + '?format='+args.format[0])
    print(res.status_code)
    print_format(res,args)
    return 0

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    subs = parser.add_subparsers(
    title="scopes", help="Choose a scope"
)
    
    #healthcheck
    healthcheck_parser = subs.add_parser("healthcheck", help="check end-to-end connectivity")
    healthcheck_parser.add_argument("--format", nargs=1, choices=["json", "csv"], help="Format of output", required=True)
    healthcheck_parser.set_defaults(func=healthcheck)

    #resetall
    resetall_parser = subs.add_parser("resetall", help="reset all")
    resetall_parser.add_argument("--format", nargs=1, choices=["json", "csv"], help="Format of output", required=True)
    resetall_parser.set_defaults(func=resetall)

    #questionnaire_upd
    questionnaire_upd_parser = subs.add_parser("questionnaire_upd", help="update questionnaire")
    questionnaire_upd_parser.add_argument("--format", nargs=1, choices=["json", "csv"], help="Format of output", required=True)
    questionnaire_upd_parser.add_argument("--source", nargs=1, type=str, help="Name of the JSON file that contains the questionnaire.", required=True)
    questionnaire_upd_parser.set_defaults(func=questionnaire_upd)

    #resetq
    resetq_parser = subs.add_parser("resetq", help="reset questionnaire")
    resetq_parser.add_argument("--format", nargs=1, choices=["json", "csv"], help="Format of output", required=True)
    resetq_parser.add_argument("--questionnaire_id", nargs=1, type=str, help="Questionnaire ID", required=True)
    resetq_parser.set_defaults(func=resetq)

    #questionnaire
    questionnaire_parser = subs.add_parser("questionnaire", help="show questionnaire")
    questionnaire_parser.add_argument("--format", nargs=1, choices=["json", "csv"], help="Format of output", required=True)
    questionnaire_parser.add_argument("--questionnaire_id", nargs=1, type=str, help="Questionnaire ID", required=True)
    questionnaire_parser.set_defaults(func=questionnaire)

    #question
    question_parser = subs.add_parser("question", help="show question")
    question_parser.add_argument("--format", nargs=1, choices=["json", "csv"], help="Format of output", required=True)
    question_parser.add_argument("--questionnaire_id", nargs=1, type=str, help="Questionnaire ID", required=True)
    question_parser.add_argument("--question_id", nargs=1, type=str, help="Question ID", required=True)
    question_parser.set_defaults(func=question)

    #doanswer
    doanswer_parser = subs.add_parser("doanswer", help="answer a questionnaire")
    doanswer_parser.add_argument("--format", nargs=1, choices=["json", "csv"], help="Format of output", required=True)
    doanswer_parser.add_argument("--questionnaire_id", nargs=1, type=str, help="Questionnaire ID", required=True)
    doanswer_parser.add_argument("--question_id", nargs=1, type=str, help="Question ID", required=True)
    doanswer_parser.add_argument("--session_id", nargs=1, type=str, help="Session ID", required=True)
    doanswer_parser.add_argument("--option_id", nargs=1, type=str, help="Option ID", required=True)
    doanswer_parser.set_defaults(func=doanswer)

    #getsessionanswers
    getsessionanswers_parser = subs.add_parser("getsessionanswers", help="session answers")
    getsessionanswers_parser.add_argument("--format", nargs=1, choices=["json", "csv"], help="Format of output", required=True)
    getsessionanswers_parser.add_argument("--questionnaire_id", nargs=1, type=str, help="Questionnaire ID", required=True)
    getsessionanswers_parser.add_argument("--session_id", nargs=1, type=str, help="Session ID", required=True)
    getsessionanswers_parser.set_defaults(func=getsessionanswers)

    #getquestionanswers
    getquestionanswers_parser = subs.add_parser("getquestionanswers", help="get question answers")
    getquestionanswers_parser.add_argument("--format", nargs=1, choices=["json", "csv"], help="Format of output", required=True)
    getquestionanswers_parser.add_argument("--questionnaire_id", nargs=1, type=str, help="Questionnaire ID", required=True)
    getquestionanswers_parser.add_argument("--question_id", nargs=1, type=str, help="Question ID", required=True)
    getquestionanswers_parser.set_defaults(func=getquestionanswers)

    parsed_args = parser.parse_args()

    if hasattr(parsed_args, 'func'):
        parsed_args.func(parsed_args)
    else:
        parser.print_help()
        sys.exit(2)
    

  
