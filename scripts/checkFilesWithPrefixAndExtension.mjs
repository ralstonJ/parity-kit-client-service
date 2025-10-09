import { promises as fs } from "fs";
import path from "path";

const checkFilesWithPrefixAndExtension = async (
  directory,
  prefix,
  extension
) => {
  try {
    // Read all files in the specified directory
    const files = await fs.readdir(directory);

    // Filter files that start with the specified prefix and have the specified extension
    const matchingFiles = files.filter(
      (file) => file.startsWith(prefix) && file.endsWith(extension)
    );

    // Log the matching files
    if (matchingFiles.length > 0) {
      console.log(`Found files: ${matchingFiles.join(", ")}`);
      return matchingFiles.join(", ");
    } else {
      console.log(
        `No files found with prefix "${prefix}" and extension "${extension}".`
      );
    }
  } catch (error) {
    console.error("Error reading directory:", error);
  }
};

export default checkFilesWithPrefixAndExtension;
