from flask import Flask, request, jsonify
import json
import base64
import openai
import os
import time
from google.cloud import texttospeech

client = texttospeech.TextToSpeechClient()
voice = texttospeech.VoiceSelectionParams(
    language_code="en-US", ssml_gender=texttospeech.SsmlVoiceGender.NEUTRAL
)
audio_config = texttospeech.AudioConfig(
    audio_encoding=texttospeech.AudioEncoding.MP3 # IS THERE THE RIGHT FORMAT?
)

CONVERSATION = [
    {"role": "system", "content": "You are a helpful assistant talking to a child"},
]

app = Flask(__name__)



@app.route("/api/process-data", methods=["POST"])
def process_data():
    # decode audio
    encoded_sound = request.json[23:]
    audio = open("/tmp/sound.webm", "wb")
    decoded_string = base64.b64decode(encoded_sound)
    audio.write(decoded_string)

    # audio to transcript
    audio.close()
    audio = open("/tmp/sound.webm", "rb")
    openai.api_key = os.getenv("OPENAI_API_KEY")
    transcript = openai.Audio.transcribe("whisper-1", audio).get("text")

    # transcript to chatgpt
    CONVERSATION.append({"role": "user", "content": f"${transcript}"})
    res = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=CONVERSATION
    )
    response_text = res["choices"][0]["message"]["content"]
    CONVERSATION.append({"role": "assistant", "content": response_text})
    print(CONVERSATION)

    # response to audio
    synthesis_input = texttospeech.SynthesisInput(text="Hey, how is it going?")
    response_voice = client.synthesize_speech(
        input=synthesis_input, voice=voice, audio_config=audio_config
    )

    # HOW TO ENCODE PROPERLY?
    encoded_response = base64.b64encode(response_voice.audio_content)
    return jsonify({"response": encoded_response.decode()})
