import { Configuration, OpenAIApi } from 'openai';
import fs from 'fs/promises';
import { createReadStream } from 'fs';
import textToSpeech from '@google-cloud/text-to-speech';

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const WHISPER_PROMPT =
  'The transcript is about a child speaking to an anthropomorphic half-bear half-fox character called Keimo. The child asks questions about school subjects or interests they are curious about.';

const GPT_PROMPT =
  'You are an anthropomorphic half-bear half-fox character called Keimo. Your help children aged 6-12 with questions and comments. Respond to them in a fun, brief and concise manner. Use appropriate and easy to understand language for children. Use descriptive statements without bias. Generate very short responses. You are an interactive tutor that responds to questions and raises questions for the student to answer.';

export async function POST(request: Request) {
  const { sound } = await request.json();

  if (!sound) {
    return new Response('No sound provided', { status: 400 });
  }

  const base64Data = sound.replace(/^data:audio\/webm;base64,/, '');

  const buffer = await Buffer.from(base64Data, 'base64');
  await fs.writeFile('/tmp/sound.webm', buffer);

  const openai = new OpenAIApi(config);

  const { data } = await openai.createTranscription(
    createReadStream('/tmp/sound.webm') as any,
    'whisper-1',
    WHISPER_PROMPT
  );

  const query = data.text;

  const res = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: GPT_PROMPT },
      { role: 'user', content: query },
    ],
  });

  const answer = res.data.choices[0].message;
  console.log(answer);

  // TODO: Possible remove markdown before sending it to the TTS endpoint
  const textToSpeechClient = new textToSpeech.TextToSpeechClient();

  const [speechResponse] = await textToSpeechClient.synthesizeSpeech({
    input: { text: answer?.content },
    voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
    audioConfig: { audioEncoding: 'OGG_OPUS' },
  });

  console.log(speechResponse);
  // Turn speechResponse into a base64 string
  const base64 = speechResponse.audioContent?.toString('base64');

  return Response.json({
    query,
    response: {
      audio: base64,
      text: answer?.content,
    },
  });
}
