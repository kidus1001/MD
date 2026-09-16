import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowed = [
      "audio/mpeg",
      "audio/wav",
      "audio/x-wav",
      "audio/mp4",
      "audio/x-m4a",
      "audio/ogg",
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true); //cb - stands for call back
    } else {
      cb(new Error("Only mp3, wav, m4a, ogg allowed"));
    }
  },
});

export default upload;
