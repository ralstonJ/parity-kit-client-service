import path from "path";
import checkFilesWithPrefixAndExtension from "./checkFilesWithPrefixAndExtension.mjs";
import copyAndRenameFile from "./copyAndRenameFile.mjs";

async function main() {
  // find the directory with the assets, js and css files
  const directoryPath = path.join(process.cwd(), "dist/assets");

  // the prefix of the files to find in dist/assets
  let filePrefix = "index-";

  // find the js file with the prefix "index-"
  const indexJS = await checkFilesWithPrefixAndExtension(
    directoryPath,
    filePrefix,
    ".js"
  );

  const sourceFilePathJS = path.join(process.cwd(), `dist/assets/${indexJS}`);
  const destinationFilePathJS = path.join(process.cwd(), "public/assets/js");

  copyAndRenameFile(sourceFilePathJS, destinationFilePathJS, "embed.js")
    .then((finalPath) =>
      console.log("Copy to public/assets is a success for index.js:", finalPath)
    )
    .catch((err) => console.error("Failed to copy js file:", err));

  // find the css file with the prefix "index-"
  const indexCSS = await checkFilesWithPrefixAndExtension(
    directoryPath,
    filePrefix,
    ".css"
  );

  const sourceFilePathCSS = path.join(process.cwd(), `dist/assets/${indexCSS}`);
  const destinationFilePathCSS = path.join(process.cwd(), "public/assets/css");

  copyAndRenameFile(sourceFilePathCSS, destinationFilePathCSS, "embed.css")
    .then((finalPath) =>
      console.log(
        "Copy to public/assets is a success for index.css:",
        finalPath
      )
    )
    .catch((err) => console.error("Failed to copy css file:", err));
}

main();
