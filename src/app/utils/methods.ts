import path from 'path';
/**
 * this method will be used to extract relative path
 *
 */

export const extractRelativePath = (fullPath: string) => {
  const idx = fullPath.indexOf(path.join('src'));
  return fullPath.substring(idx);
};

/**
 * Generates a unique filename by appending or incrementing a numerical suffix.
 * Examples:
 * - "xyz.txt" becomes "xyz(1).txt"
 * - "xyz(1).txt" becomes "xyz(2).txt"
 * - "image" becomes "image(1)"
 * - "my.document.final.pdf" becomes "my.document.final(1).pdf"
 *
 * @param {string} originalFileName The base filename to generate a unique version from.
 * @returns {string} The new unique filename.
 */

export const renameAFile = async (originalFileName: string) => {
  // Find the last dot to separate the base name and extension
  const lastDotIndex = originalFileName.lastIndexOf('.');
  let baseName = originalFileName;
  let extension = '';

  if (lastDotIndex !== -1 && lastDotIndex > 0) {
    // Ensure it's not a hidden file like .bashrc
    baseName = originalFileName.substring(0, lastDotIndex);
    extension = originalFileName.substring(lastDotIndex); // Includes the dot, e.g., ".txt"
  }

  // Regular expression to match (number) at the very end of the base name
  // It captures the number inside the parentheses
  const regex = /\((\d+)\)$/;
  const match = baseName.match(regex);

  if (match) {
    // If a match is found, extract the current number and increment it
    const currentNumber = parseInt(match[1], 10);
    const newNumber = currentNumber + 1;
    // Replace the old (number) with the new (incremented number)
    baseName = baseName.replace(regex, `(${newNumber})`);
  } else {
    // If no (number) suffix is found, append (1)
    baseName = `${baseName}(1)`;
  }

  return `${baseName}${extension}`;
};
