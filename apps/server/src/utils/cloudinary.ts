import { Request, Response } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import dotenv from 'dotenv';
import { NextFunction } from 'express';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true,
});

export const uploadToCloudinary = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.file) {
    try {
      const uploadOptions = {
        quality: 'auto:eco',
        folder: '/gated',
      };

      if (req.body.picture.publicId) {
        await deleteFromCloudinary(JSON.parse(req.body.picture.publicId));
      }

      const result = await cloudinary.uploader.upload(
        req.file.path,
        uploadOptions,
      );

      fs.unlink(req.file.path, (error) => {
        if (error) console.error('Error deleting temp file:', error);
      });

      const pictureData = JSON.parse(req.body.picture);

      req.body.picture = JSON.stringify({
        ...pictureData,
        imageUrl: result.secure_url,
        publicId: result.public_id,
      });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Error uploading to Cloudinary',
      });

      return;
    }
  }

  next();
};

export const deleteFromCloudinary = async (publicId: string) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    if (result.result === 'ok') {
      return result;
    }
    throw new Error('Error deleting image');
  } catch (error: any) {
    console.error(error);
  }
};

export default cloudinary;
