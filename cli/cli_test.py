import subprocess
subprocess.check_call("pip install pytest", shell=True)
subprocess.check_call("pip install asyncio", shell=True)
subprocess.check_call("python -m pytest .\cli-testing.py", shell=True)