import { zip } from "react-native-zip-archive";
import { Directory, File, Paths } from "expo-file-system";
import { copyAsync } from "expo-file-system/legacy";

export const createZip = async (imagePaths: string[]) => {
  try {
    const tempDir = new Directory(Paths.cache, "faces_zip_temp");
    if (tempDir.exists) {
      console.log("tempDir already exists");
      tempDir.delete();
    }
    tempDir.create();

    const zipPath = new File(Paths.cache, "faces.zip");
    if (zipPath.exists) {
      console.log("zipPath already exists");
      zipPath.delete();
    }

    // Copy all images into the tempDir
    for (const [index, imgPath] of imagePaths.entries()) {
      const newPath = `${tempDir.uri}img-${index + 1}.jpg`;
      await copyAsync({ from: imgPath, to: newPath });
      // console.log("newPath: ", newPath);
    }

    // trim the file:// part
    const trimmedTempDir = tempDir.uri.replace("file://", "");
    const trimmedZipPath = zipPath.uri.replace("file://", "");

    // Zip it
    const result = await zip(trimmedTempDir, trimmedZipPath);
    console.log("✅ Zipped to:", result);
    return "file://" + result; // returns zip file URI
  } catch (error) {
    console.log(error);
  }
};
