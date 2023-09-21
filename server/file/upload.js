import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./public/gallery"),
  filename: (req, file, cb) => cb(null, Date.now() + file.originalname),
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "image/jpg",
    "image/jpeg",
    "image/png",
    "image/gif",
  ];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage,
  fileFilter,
});

export default upload;
