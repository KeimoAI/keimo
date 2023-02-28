import { exec } from "child_process";
export async function POST(req: Request) {
    return new Response(
        await new Promise((resolve, reject) => {
            exec(`whisper /tmp/small-tesla.mp3 --model tiny --language English`, (err, stdout, stderr) => {
                if (err) {
                    resolve(err.name);
                } else {
                    resolve(stdout);
                }
            })
        })
    );
}
