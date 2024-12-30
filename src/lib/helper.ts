// import crypto from 'crypto';

import { EncryptJWT, jwtDecrypt } from 'jose';
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
export const timezoneDateFormatter = (dateString: string) => {
  if (typeof window === 'undefined') return ''; // Avoid running on the server

  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const dateObject = new Date(dateString);

  const formattedDate = dateObject.toLocaleString('en-US', {
    timeZone: userTimezone,
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return formattedDate;
};

export const timezoneTimeFormatter = (date: Date) => {
  if (typeof window === 'undefined') return ''; // Avoid running on the server

  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const localTime = new Date(date).toLocaleString('en-US', {
    timeZone: userTimezone,
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });
  return localTime;
};

function setCookie(name: string, value: string, days: number) {
  if (typeof document === 'undefined') return; // Ensure this runs only in the client

  const date = new Date(Date.now() + days * 864e5);
  const expires = days ? `; expires=${date.toUTCString()}` : '';
  document.cookie = `${name}=${value || ''}${expires}; path=/; Secure; SameSite=Strict`;
}

export function base64ToUint8Array(base64Key: string): Uint8Array {
  const binaryString = atob(base64Key);
  const byteArray = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    byteArray[i] = binaryString.charCodeAt(i);
  }
  return byteArray;
}

export async function encryptAndStoreInCookie(data: Record<string, unknown>) {
  if (!process.env.NEXT_PUBLIC_BASE_KEY) {
    console.error('Base key is not set');
    return;
  }

  const originalKey = base64ToUint8Array(process.env.NEXT_PUBLIC_BASE_KEY as string);

  try {
    const jwt = await new EncryptJWT(data)
      .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
      .setIssuedAt()
      .setExpirationTime('2h')
      .encrypt(originalKey);

    setCookie('user_data', jwt, 7);
  } catch (error) {
    console.error('Encryption failed:', error);
  }
}

export async function decryptCookie() {
  if (typeof document === 'undefined') return null; // Prevent server-side execution

  const encryptedCookie = getCookie('user_data');
  if (!encryptedCookie) {
    console.error('Cookie not found');
    return null;
  }

  if (!process.env.NEXT_PUBLIC_BASE_KEY) {
    console.error('Base key is not set');
    return null;
  }

  const originalKey = base64ToUint8Array(process.env.NEXT_PUBLIC_BASE_KEY as string);

  try {
    const { payload } = await jwtDecrypt(encryptedCookie, originalKey);
    console.log('Decrypted Data:', payload);
    return payload;
  } catch (error) {
    console.error('Decryption failed:', error);
    return null;
  }
}

export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null; // Prevent server-side execution

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}
