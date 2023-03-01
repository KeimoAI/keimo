import { exec } from 'child_process';
import { promises as fs } from 'fs';

export async function POST(request: Request) {
  const { sound } = await request.json();

  if (!sound) {
    return new Response('No sound provided', { status: 400 });
  }

  const base64Data = sound.replace(/^data:audio\/webm;base64,/, '');

  const buffer = await Buffer.from(base64Data, 'base64');
  await fs.writeFile('/tmp/sound.webm', buffer);

  const result = await new Promise((resolve, reject) => {
    exec(
      `whisper /tmp/sound.webm --fp16 False --model tiny --language English`,
      (err, stdout, stderr) => {
        if (err) {
          resolve(stderr);
        } else {
          resolve(stdout);
        }
      }
    );
  });

  console.log(result);

  if (!result) {
    return new Response('No transcription', { status: 400 });
  }

  return Response.json({ result });
}
