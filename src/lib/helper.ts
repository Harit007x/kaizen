import crypto from 'crypto';
import JSEncrypt from 'jsencrypt';
// import fs from 'fs';
// export async function uploadToCloudinary(fileUri: string, fileName: string) {
//   try {
//     const response = await cloudinary.uploader.upload(fileUri, {
//       invalidate: true,
//       resource_type: 'auto',
//       filename_override: fileName,
//       use_filename: true,
//       folder: 'kaizen',
//     });
//     return response;
//   } catch (error) {
//     return null;
//   }
// }

// export async function deleteFromCloudinary(publicId: string) {
//   try {
//     const response = await cloudinary.uploader.destroy(publicId);

//     return response;
//   } catch (error) {
//     return null;
//   }
// }

// export function decryptPassword(encryptedPassword: string) {
//   const privateKey = fs.readFileSync('./keys/private_key.pem', 'utf8');
//   const decryptedPassword = crypto.privateDecrypt(
//     {
//       key: privateKey,
//       padding: crypto.constants.RSA_PKCS1_PADDING,
//     },
//     Buffer.from(encryptedPassword, 'base64')
//   );

//   return decryptedPassword.toString('utf8');
// }

export const encryptPassword = async (password: string) => {
  try {
    // Generate a random AES key
    const aesKey = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);

    // Encrypt the password with AES
    const cipher = crypto.createCipheriv('aes-256-cbc', aesKey, iv);
    let encryptedPassword = cipher.update(password, 'utf8', 'base64');
    encryptedPassword += cipher.final('base64');

    // Encrypt the AES key with the RSA public key
    const response = await fetch('public_key.pem');
    const publicKey = await response.text();

    console.log('Public key =', publicKey);
    if (!publicKey) {
      throw new Error('Public key is missing');
    }

    const encryptedAesKey = crypto
      .publicEncrypt(
        {
          key: publicKey,
          padding: crypto.constants.RSA_PKCS1_PADDING,
        },
        aesKey
      )
      .toString('base64');

    // Return both encrypted password and encrypted AES key
    return {
      encryptedPassword,
      encryptedAesKey,
      iv: iv.toString('base64'),
    };
  } catch (error) {
    console.error('Encryption error:', error);
    throw error;
  }
};

export const dateFormatter = (dateString: string) => {
  const dateObject = new Date(dateString);
  const formattedDate = dateObject.toLocaleString('en-US', {
    weekday: 'short', // Short day name (e.g., Thu)
    month: 'short', // Short month name (e.g., Dec)
    day: 'numeric', // Day of the month (e.g., 21)
  });

  return formattedDate;
};
