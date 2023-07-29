import path from "path";
import express from "express";
const router = express.Router();
import multer from "multer"; //Multer is a middleware for handling multipart/form-data, typically used for uploading files.

//Configure multer storage and file naming
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/")
  },

  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});


//Define a function to check the file type
function fileFilter(req, file, cb) {
  // Define the allowed file types using a regular expression.
  const filetypes = /jpe?g|png|webp/;
  const mimetypes = /image\/jpe?g|image\/png|image\/webp/;

  // Check if the file extension matches the allowed types.
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase()); //Returns Boolean

  // Check if the file mimetype matches the allowed types.
  const mimetype = mimetypes.test(file.mimetype); //Returns Boolean

  if(extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Images only!'), false);
  }
}


//Create a multer instance with the defined storage and file type checking
const upload = multer({
  storage,
  fileFilter
})
const uploadSingleImage = upload.single("image");

router.post('/', (req, res) => {
  uploadSingleImage(req, res, function (err) {
    if (err) {
      // Handle errors during file upload
      return res.status(400).send({ message: err.message });
    }

    // Check if req.file exists before accessing its properties
    if (req.file) {
      return res.status(200).send({
        message: 'Image uploaded successfully',
        image: `/${req.file.path.replace(/\\/g, "/")}`,
      });
    } else {
      // Handle the case when no file was selected for upload
      return res.status(400).send({ message: 'No file selected for upload' });
    }
  });
});

export default router;