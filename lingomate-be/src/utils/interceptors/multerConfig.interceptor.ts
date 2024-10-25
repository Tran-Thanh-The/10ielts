import { diskStorage } from "multer";
import { v4 as uuidv4 } from "uuid";
import * as path from "path";

export const multerConfig = {
  storage: diskStorage({
    destination: "files/", // Set the destination folder
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname); // Get file extension
      const filename = `${uuidv4()}${ext}`; // Generate a unique filename
      cb(null, filename); // Call the callback with the new filename
    },
  }),
  // limits: {
  //   fileSize: 1024 * 1024 * 5, // 5MB file size limit (optional)
  // },
};
