import { exec } from 'child_process';
import { promises as fs } from 'fs';
import textToSpeech from "@google-cloud/text-to-speech"

const client = new textToSpeech.TextToSpeechClient();

export async function POST(request: Request) {
    const { sound } = await request.json();

    if (!sound) {
        return new Response('No sound provided', { status: 400 });
    }

    const base64Data = sound.replace(/^data:audio\/webm;base64,/, '');

    const buffer = Buffer.from(base64Data, 'base64');
    await fs.writeFile('/tmp/sound.webm', buffer);

    console.log("START")
    const result = await new Promise((resolve, _) => {
        exec(`whisper /tmp/sound.webm --fp16 False --model small --language English -f txt -o /tmp > /dev/null && cat /tmp/sound.webm.txt`,
            (err, stdout, stderr) => {
                if (err) {
                    resolve(stderr);
                } else {
                    resolve(stdout);
                }
            }
        );
    });
    console.log("FINISH")

    if (!result) {
        return new Response('No transcription', { status: 400 });
    }

    const ttsRequest = {
        input: { text: result },
        voice: { languageCode: 'en-US', ssmlGender: 'FEMALE' },
        audioConfig: { audioEncoding: 'OGG_OPUS' },
    }
    const [ttsResponse] = await client.synthesizeSpeech(ttsRequest);
    const audioBlob = new Blob([ttsResponse], { type: "audio/ogg" });
    const audioUrl = URL.createObjectURL(audioBlob);
    console.log(audioUrl)


    return new Response(JSON.stringify({ audioUrl }));
}
