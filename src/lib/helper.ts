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

export const dateFormatter = (dateString: string) => {
  const dateObject = new Date(dateString);
  const formattedDate = dateObject.toLocaleString('en-US', {
    weekday: 'short', // Short day name (e.g., Thu)
    month: 'short', // Short month name (e.g., Dec)
    day: 'numeric', // Day of the month (e.g., 21)
  });

  return formattedDate;
};
