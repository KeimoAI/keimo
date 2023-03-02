from flask import Flask, request
import json
import base64
import openai
import os
import time

app = Flask(__name__)


@app.route("/api/process-data", methods=["POST"])
def process_data():
    encoded_sound = request.json[23:]
    audio = open("/tmp/sound.webm", "wb")
    decoded_string = base64.b64decode(encoded_sound)
    audio.write(decoded_string)

    audio.close()
    audio = open("/tmp/sound.webm", "rb")
    openai.api_key = os.getenv("OPENAI_API_KEY")
    transcript = openai.Audio.transcribe("whisper-1", audio).get("text")

    return json.dumps(transcript)
