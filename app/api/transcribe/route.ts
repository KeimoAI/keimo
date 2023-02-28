import { exec } from "child_process";

export async function GET() {
    return new Response(
        await new Promise((resolve, reject) => {
            exec(`sudo whisper /tmp/small-tesla.mp3 --fp16 False --model tiny --language English -f txt > /dev/null && cat small-tesla.mp3.txt`, (err, stdout, stderr) => {
                if (err) {
                    resolve(err.name);
                } else {
                    resolve(stdout);
                }
            })
        })
    );
}
