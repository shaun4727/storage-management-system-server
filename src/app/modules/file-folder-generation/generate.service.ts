import { Document, Packer, Paragraph, Tab, TextRun } from 'docx';
import { IJwtPayload } from '../auth/auth.interface';
import { FileType } from './generate.model';

import * as fs from 'fs';
import { Types } from 'mongoose';
import path from 'path';
import { fileDestinations } from '../../utils/constants';
import { extractRelativePath } from '../../utils/methods';
import { IFileType } from './generate.interface';

interface UploadedFiles {
  pdf?: Express.Multer.File[];
  images?: Express.Multer.File[];
}

const generateDocFileIntoDB = async (user: IJwtPayload) => {
  try {
    interface IFileNameGenerator {
      (): string;
    }

    const generateFileName: IFileNameGenerator = () => {
      return `${Date.now()}-file.docx`;
    };

    const fileName: string = generateFileName();

    const baseDir = path.join(process.cwd(), fileDestinations.notes);
    let finalFolderPath = path.join(baseDir, fileName);

    const file = new FileType({
      name: fileName,
      filename: fileName,
      destination: fileDestinations.notes,
      createdBy: user.userId,
      fieldname: 'notes',
    });

    const result = await file.save();

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              children: [
                new TextRun('Hello World'),
                new TextRun({
                  text: 'Foo Bar',
                  bold: true,
                  size: 40,
                }),
                new TextRun({
                  children: [new Tab(), 'Github is the best'],
                  bold: true,
                }),
              ],
            }),
          ],
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);

    if (!fs.existsSync(baseDir)) fs.mkdirSync(baseDir, { recursive: true }); // Ensure the folder exists
    fs.writeFileSync(finalFolderPath, buffer);

    return result;
  } catch (err) {
    console.log(err);
    return false;
  }
};

const uploadFilesIntoDB = async (user: IJwtPayload, files: UploadedFiles) => {
  try {
    let arrayOfData: IFileType[] = [];

    if (files.images && files.pdf) {
      arrayOfData = [...files.images, ...files.pdf];
    } else if (!files.pdf && files.images) {
      arrayOfData = [...files.images];
    } else if (!files.images && files.pdf) {
      arrayOfData = [...files.pdf];
    }

    // extractRelativePath

    arrayOfData.forEach((item: IFileType) => {
      const relativePath = extractRelativePath(item?.path as string);
      item.path = relativePath;

      //destination
      const shortPath = extractRelativePath(item?.destination as string);
      item.destination = shortPath;
      item.createdBy = user.userId as unknown as Types.ObjectId;
    });

    const result = await FileType.insertMany(arrayOfData);
    return result;
  } catch (err) {
    console.log(err);
    return false;
  }
};

const createFolderIntoDB = async (user: IJwtPayload, folderName: string) => {
  try {
    const baseDir = path.join(process.cwd(), fileDestinations.folder);
    let finalFolderPath = path.join(baseDir, folderName);
    let counter = 1;

    // Generate unique folder path if it already exists
    while (fs.existsSync(finalFolderPath)) {
      finalFolderPath = path.join(baseDir, `${folderName}(${counter})`);
      counter++;
    }

    fs.mkdirSync(finalFolderPath, { recursive: true });
    const shortPath = extractRelativePath(finalFolderPath as string);

    const file = new FileType({
      destination: shortPath,
      createdBy: user.userId,
      filename: folderName,
      fieldname: 'folder',
    });

    const result = await file.save();

    return result;
  } catch (err) {
    console.log(err);
    return false;
  }
};

export const GenServices = {
  generateDocFileIntoDB,
  uploadFilesIntoDB,
  createFolderIntoDB,
};
