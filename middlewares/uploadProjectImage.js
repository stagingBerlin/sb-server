import createError from 'http-errors';
import { v2 as cloudinary } from 'cloudinary';

const uploadProjectImage = async (req, res, next) => {
  if (req.body.image) {
    try {
      cloudinary.uploader.upload(
        req.body.image,
        {
          folder: `staging_berlin/users/${req.user.email}/project`,
          use_filename: true,
        },
        (error, result) => {
          if (error) next(new createError(404, `Image was not valid`));
          req.cloudProjectUrl = result.secure_url;
          next();
        }
      );
    } catch (error) {
      next(error);
    }
  } else next();
};

export default uploadProjectImage;
