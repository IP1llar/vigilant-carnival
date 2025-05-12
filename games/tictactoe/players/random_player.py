from flask import Flask, request, jsonify
import sys
import random
import requests
import threading
import time

app = Flask(__name__)

# Read command line arguments
port = int(sys.argv[1])
game_key = int(sys.argv[2])
game_type = "tictactoe"
passcode = "1"  # This will be overwritten in `start()`

@app.route("/", methods=["GET"])

def root():
    print("Contact made from server")
    return f"Success from port {port}", 200

@app.route("/GameState", methods=["POST"])
def game_state():
    global passcode
    body = request.json

    print(body)

    state = body.get("gameState", [])
    move = pick_move(state)

    try:
        response = requests.post("http://localhost:3000/Move", json={
            "passcode": passcode,
            "move": move,
            "gameType": game_type,
            "apiKey": 1
        })
        print(response.json())
    except Exception as e:
        print(f"Error posting move: {e}")

    return "nice", 200

# @app.route("/GameOver", methods=["POST"])
# def game_over():
#     print(request.json)
#     shutdown_server()
#     return "OK", 200

@app.route("/GameOver", methods=["POST"])
def game_over():
    print(request.json)

    def shutdown_delayed():
        time.sleep(0.5)  # Give Flask time to send the response
        shutdown_server()

    threading.Thread(target=shutdown_delayed).start()

    return "OK", 200

def pick_move(state):
    choice = random.randint(0, 8)
    while state[choice] != "-":
        choice = random.randint(0, 8)
    return choice

def shutdown_server():
    sys.exit(0)
    func = request.environ.get('werkzeug.server.shutdown')
    if func is None:
        raise RuntimeError('Not running with the Werkzeug Server')
    func()

def start():
    global passcode
    try:
        response = requests.post("http://localhost:3000/Start", json={
            "gameKey": game_key,
            "gameType": game_type,
            "apiKey": 1,
            "returnURL": f"http://localhost:{port}"
        })
        passcode = response.json().get("passcode", "1")
    except Exception as e:
        print(f"Error starting game: {e}")

if __name__ == "__main__":
    start()
    app.run(port=port)
