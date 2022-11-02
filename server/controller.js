const { spawn } = require("child_process");
const { nanoid } = require("nanoid");
const fs = require("fs");

const uploadAudio = async (req, res) => {
  const {
    urlObj: { url, title },
  } = req.body;

  const id = nanoid();
  const urlObj = {
    url,
    title,
    id,
  };

  try {
    const childPython = await spawn("python", [
      "./summarize.py",
      JSON.stringify(urlObj),
    ]);

    var isAudioCreated = false;

    childPython.stdout.on("data", (data) => {
      isAudioCreated = true;
      console.log(true);
      console.log(`stdout:${data}`);
    });

    childPython.stderr.on("data", (data) => {
      isAudioCreated = false;
      console.log(false);
      console.error(`stderror:${data}`);
    });

    //check weather audio is created
    console.log(isAudioCreated);
    if (!isAudioCreated) {
      // return res.json({ error: "audio not produced" });
    }

    res.json({ urlObj }); // return a unique id with nanoid
    // res.redirect(302,`/audio/${id}`)
  } catch (error) {
    console.log(error);
  }
};

const getAudioById = function (req, res) {

  // Implement a cache system to check weather that article is already converted
  const { id } = req.params;

  // Ensure there is a range given for the video
  const range = req.headers.range;
  if (!range) {
    res.status(400).send("Requires Range header");
  }
  // sample_video.mp4

  // get video stats (about 61MB)
  const videoPath = `audio/${id}.mp3`;

  if (!videoPath) {
    return res.json({ error: "no such directory" });
  }
  const videoSize = fs.statSync(`audio/${id}.mp3`).size;

  // Parse Range
  // Example: "bytes=32324-"
  const CHUNK_SIZE = 10 ** 6; // 1MB
  const start = Number(range.replace(/\D/g, ""));
  const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

  // Create headers
  const contentLength = end - start + 1;
  const headers = {
    "Content-Range": `bytes ${start}-${end}/${videoSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type": "audio/mp3",
  };

  // HTTP Status 206 for Partial Content
  res.writeHead(206, headers);

  // create video read stream for this particular chunk
  const videoStream = fs.createReadStream(videoPath, { start, end });

  // Stream the video chunk to the client
  videoStream.pipe(res);
};

module.exports = {
  uploadAudio,
  getAudioById,
};
