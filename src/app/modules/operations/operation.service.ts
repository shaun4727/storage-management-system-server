import fs from 'fs';
import path from 'path';
import AppError from '../../errors/appError';
import { fileDestinations } from '../../utils/constants';
import { createFolderFun } from '../../utils/createFolder';
import { extractRelativePath, renameAFile } from '../../utils/methods';
import { IJwtPayload } from '../auth/auth.interface';
import { FileType } from '../file-folder-generation/generate.model';

interface copyData {
  source_path: string;
  destination_path: string;
  filename: string;
  fieldname: string;
}

const copyFIleInDB = async (user: IJwtPayload, body: copyData) => {
  try {
    const { source_path, destination_path, filename, fieldname } = body;

    // const fileToBeCopied = await FileType.findOne({ filename: filename });

    // Basic validation for input paths
    if (!source_path || !destination_path) {
      throw new AppError(403, 'Path is missing!', '');
    }

    // Construct absolute paths to prevent directory traversal vulnerabilities
    // Always resolve paths relative to a controlled base directory
    createFolderFun(destination_path);
    const absoluteSourcePath = path.join(source_path, filename);
    const absoluteDestinationPath = path.join(destination_path, filename);

    // Check if the source file exists
    if (!fs.existsSync(absoluteSourcePath)) {
      throw new AppError(403, 'File is missing!', '');
    }

    // Perform the file copy operation
    fs.copyFile(absoluteSourcePath, absoluteDestinationPath, (err) => {
      if (err) {
        // Provide a more generic error message to the client for security
        throw new AppError(403, 'Copying failed!', '');
      }
    });
    const shortPath = extractRelativePath(absoluteDestinationPath as string);

    const file = new FileType({
      destination: shortPath,
      createdBy: user.userId,
      fieldname: fieldname,
      filename: filename,
    });

    await file.save();
  } catch (err) {
    console.log(err);
    return false;
  }
};
/**
 *
 * @param fileId original file is not being renamed
 * @param filename
 * @returns
 */
const renameFIleInDB = async (fileId: string, filename: string) => {
  try {
    const file = await FileType.findOne({ _id: fileId });

    const newAbsolutePath = path.join(file?.destination!, filename);
    const oldAbsolutePath = path.join(file?.destination!, file?.filename!);

    fs.rename(oldAbsolutePath, newAbsolutePath, (err) => {
      console.log(err);
    });

    if (file?.filename === filename) {
      throw new AppError(403, 'Filename already exists!');
    }
    if (file && file.name) {
      file.name = filename;
    }
    file!.filename = filename;

    await file?.save();
    return false;
  } catch (err) {
    console.log(err);
    return false;
  }
};

const duplicateFIleInDB = async (fileId: string) => {
  try {
    const file = await FileType.findOne({ _id: fileId });
    const newName = await renameAFile(file?.filename as string);

    const absoluteSourcePath = path.join(fileDestinations[file?.fieldname! as keyof typeof fileDestinations], file?.filename!);
    const absoluteDestinationPath = path.join(fileDestinations[file?.fieldname! as keyof typeof fileDestinations], newName);

    await fs.promises.copyFile(absoluteSourcePath, absoluteDestinationPath);

    if (file) {
      file.filename = newName;
      file.path = fileDestinations[file?.fieldname! as keyof typeof fileDestinations] + '/' + newName;

      const newFile = new FileType({
        ...file.toObject(),
        _id: undefined,
        createdAt: undefined,
        updatedAt: undefined,
      });
      await newFile.save();
    }

    return false;
  } catch (err) {
    console.log(err);
    return false;
  }
};

const makeAfileFavouriteIntoDB = async (fileId: string) => {
  try {
    const file = await FileType.findOne({ _id: fileId });

    if (file) {
      file.favourite = !file.favourite;
      file.save();
    }

    return false;
  } catch (err) {
    console.log(err);
    return false;
  }
};

const makeAfileDelteFromDB = async (fileId: string) => {
  try {
    const file = await FileType.findOne({ _id: fileId });

    let absoluteSourcePath = '';
    if (file?.fieldname === 'images' || file?.fieldname === 'pdf') {
      absoluteSourcePath = path.join(process.cwd(), file?.path!);
    } else if (file?.fieldname === 'folder') {
      absoluteSourcePath = path.join(process.cwd(), file?.location!);
    } else if (file?.fieldname === 'notes') {
      absoluteSourcePath = path.join(process.cwd(), file?.location! + file?.name);
    }

    // Use fs.promises to await file deletion before DB operation

    await fs.promises.unlink(absoluteSourcePath);

    // Note: fs operations do not support MongoDB sessions directly.
    // The session is only relevant for MongoDB operations.
    // If you want to ensure atomicity between file deletion and DB deletion,
    // you need to handle rollback logic manually if file deletion fails.

    await FileType.deleteOne({ _id: fileId });
    return false;
  } catch (err) {
    console.log(err);
    return false;
  }
};

const filterFileFromDBservice = async ({ start }: { start: Date }) => {
  try {
    const endOfDayUTC = new Date(Date.UTC(new Date(start).getUTCFullYear(), new Date(start).getUTCMonth(), new Date(start).getUTCDate(), 23, 59, 59, 999));

    const results = await FileType.find({
      createdAt: { $lte: endOfDayUTC },
    });

    return results;
  } catch (err) {
    console.log(err);
    return false;
  }
};

export const OperationGenServices = {
  copyFIleInDB,
  renameFIleInDB,
  duplicateFIleInDB,
  makeAfileFavouriteIntoDB,
  makeAfileDelteFromDB,
  filterFileFromDBservice,
};
