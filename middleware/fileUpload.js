const multer = require("multer");

const fileUpload = multer({
  limits: 100000000,
  storage: multer.memoryStorage({
    destination: (req, file, cb) => {
      cb(null, `fileUploads/photos`);
      // cb(null, "fileUploads/photos");
    },
    filename: (req, file, cb) => {
      const extension = MIME_TYPE[file.mimetype];
      cb(
        null,
        file.fieldname + "-" + file.originalname + Date.now() + "." + extension
      );
    },
    //file.originalname +
  }),
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/png"
    ) {
      cb(null, true);
    } else {
      cb(
        new Error(
          `Error: upload images only with extension of jpeg, jpg, or png!`,
          false
        )
      );
    }
  },
});

module.exports = fileUpload;
