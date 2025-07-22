const fs = require('fs');
const path = require('path');

export const createFolderFun = (folderName: string) => {
  // Create the full path to the folder
  const folderPath = path.join(process.cwd(), folderName);

  // Create the folder if it doesn't already exist
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
};
