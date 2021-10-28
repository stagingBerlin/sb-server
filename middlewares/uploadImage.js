import createError from 'http-errors';
import { v2 as cloudinary } from 'cloudinary';

const uploadImage = async (req, res, next) => {
  if (req.body.imageUrl) {
    try {
      cloudinary.uploader.upload(
        req.body.imageUrl,
        {
          folder: 'avatar_images/',
          use_filename: true,
        },
        (error, result) => {
          if (error) next(new createError(404, `Image was not valid`));

          // console.log('CLOUD', result);
          req.cloudFileUrl = result.secure_url;
          next();
        }
      );
    } catch (error) {
      next(error);
    }
  } else next();
};

export default uploadImage;
