import { Configuration, OpenAIApi } from 'openai';
import fs from 'fs/promises';
import { createReadStream } from 'fs';
import textToSpeech from '@google-cloud/text-to-speech';
import { NextResponse as Response } from 'next/server';

// OpenAI Configuration
const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

// Google Cloud Text-to-Speech Configuration
const textToSpeechClient = new textToSpeech.TextToSpeechClient({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY,
  },
  //  email: process.env.GOOGLE_CLIENT_EMAIL,
  projectId: process.env.GOOGLE_PROJECT_ID,
});

// Whisper Context Prompt
const WHISPER_PROMPT =
  'The transcript is about a child speaking to an anthropomorphic half-bear half-fox character called Keimo. The child asks questions about school subjects or interests they are curious about.';

// Starting ChatGPT Prompt
const GPT_PROMPT =
  'You are an anthropomorphic half-bear half-fox character called Keimo. Your help children aged 6-12 with questions and comments. Respond to them in a fun, brief and concise manner. Use appropriate and easy to understand language for children. Use descriptive statements without bias. Generate very short responses. You are an interactive tutor that responds to questions and raises questions for the student to answer.';

// TODO: Add better error handling
export async function POST(request: Request) {
  const { sound } = await request.json();

  if (!sound) {
    return new Response('No sound provided', { status: 400 });
  }

  const base64Data = sound.replace(/^data:audio\/webm;base64,/, '');

  const buffer = Buffer.from(base64Data, 'base64');
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
  // TODO: Use SSML to add pauses and other things...

  const [speechResponse] = await textToSpeechClient.synthesizeSpeech({
    input: { text: answer?.content },
    voice: {
      languageCode: 'en-US',
      ssmlGender: 'FEMALE',
      name: 'en-US-Neural2-H',
    },
    audioConfig: { audioEncoding: 'OGG_OPUS' },
  });

  console.log(speechResponse);
  // Turn speechResponse into a base64 string
  const base64 = Buffer.from(speechResponse.audioContent as string).toString(
    'base64'
  );

  return Response.json({
    query,
    response: {
      audio: base64,
      text: answer?.content,
    },
  });
}
