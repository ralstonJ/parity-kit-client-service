import { promises as fs } from "fs";
import path from "path";

const copyAndRenameFile = async (source, destination, newFileName) => {
  try {
    // Check if source exists
    await fs.access(source);

    // Ensure destination directory exists
    const destinationDir = path.dirname(destination);
    await fs.mkdir(destinationDir, { recursive: true });

    // Copy file directly to final destination path
    const finalPath = path.join(destinationDir, newFileName);
    await fs.copyFile(source, finalPath);

    console.log(`File copied from ${source} to ${finalPath}`);

    return finalPath;
  } catch (error) {
    console.error("Error:", error);
    throw error; // Re-throw to handle errors in calling code
  }
};

export default copyAndRenameFile;
