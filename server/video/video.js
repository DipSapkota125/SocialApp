import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/videos");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "video/mp4" ||
    file.mimetype === "video/mpeg" ||
    file.mimetype === "video/quicktime" ||
    file.mimetype === "video/x-msvideo"
  ) {
    cb(null, true);
  } else {
    cb(new Error("file type not supported"), false);
  }
};

const uploadVideo = multer({
  storage: storage,
  fileFilter: fileFilter,
});

export default uploadVideo;
