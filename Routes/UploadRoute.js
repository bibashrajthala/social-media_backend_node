import express from "express";
import multer from "multer";

const router = express.Router();

// to store it in disk storage ,in destination folder public/images of our server
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // file parameter is the file key(having image) we upload , cb is callback function with 2 arguments
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    // provide the file name our our uploaded file , otherwise it gives some random file name
    cb(null, req.body.name); // name is key in data(formData) having filename as value
  },
});
const upload = multer({ storage: storage });

// to upload single file using multer
router.post("/", upload.single("file"), (req, res) => {
  // send response for image upload
  try {
    console.log("image uploaded");
    return res.status(200).json("File uploaded successfully");
  } catch (error) {
    console.error(error);
    res.status(500).json("File upload failed");
  }
});

export default router;
