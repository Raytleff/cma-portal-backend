import cloudinary from "../utils/cloudinary.js" 

//const folder = 'users_profile';

export const uploadPfp = (pfpFile, folder) => {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { resource_type: 'image', folder: folder },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve({
              secureUrl: result.secure_url,
              publicId: result.public_id,
            });
          }
        }
      ).end(pfpFile.buffer);
    });
  };
  
export const deletePfp = async(publicId) => {
    return await cloudinary.uploader.destroy(publicId)
}
