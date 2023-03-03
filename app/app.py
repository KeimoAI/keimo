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
    audio_encoding=texttospeech.AudioEncoding.OGG_OPUS
)

SUBJECT = {
    "math": "2 digit by 2 digit multiplication",
    "history": "the American revolution",
}


def SUBJECT_PROMPT(subject):
    return f"You teach about {subject} and nothing else."

INITIAL_PROMPT = "You are an anthropomorphic half-bear half-fox character called Keimo. Your help children aged 6-12 with questions and comments. Respond to them in a fun, brief and concise manner. Use appropriate and easy to understand language for children. Use descriptive statements without bias. Generate very short responses. You are an interactive tutor that responds to questions and raises questions for the student to answer."

CONVERSATION = [
    {"role": "system", "content": INITIAL_PROMPT},
]

app = Flask(__name__)


@app.route("/api/process-data", methods=["POST"])
def process_data():
    response_text = ""
    if not request.json["subject"]:
        a = time.time()
        # decode audio
        encoded_sound = request.json["sound"][23:]
        audio = open("/tmp/sound.webm", "wb")
        decoded_string = base64.b64decode(encoded_sound)
        audio.write(decoded_string)
        b = time.time()
        print(f"DECODING: {b - a}")

        # audio to transcript
        audio.close()
        audio = open("/tmp/sound.webm", "rb")
        openai.api_key = os.getenv("OPENAI_API_KEY")
        transcript = openai.Audio.transcribe("whisper-1", audio).get("text")
        c = time.time()
        print(f"TRANSCRIPTION: {c - b}")

        # transcript to chatgpt
        CONVERSATION.append({"role": "user", "content": f"${transcript}"})
    else:
        CONVERSATION.append({"role": "system", "content": SUBJECT_PROMPT(request.json["subject"])})

    res = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=CONVERSATION,
    )
    response_text = res["choices"][0]["message"]["content"]
    CONVERSATION.append({"role": "assistant", "content": response_text})
    # d = time.time()
    # print(f"CHATGPT: {d - c}")
    # response to audio
    synthesis_input = texttospeech.SynthesisInput(text=response_text)
    response_voice = client.synthesize_speech(
        input=synthesis_input, voice=voice, audio_config=audio_config
    )
    # e = time.time()
    # print(f"AUDIO SYNTHESIS: {e - d}")

    return jsonify(base64.b64encode(response_voice.audio_content).decode("utf-8"))
