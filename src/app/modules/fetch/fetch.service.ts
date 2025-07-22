import { Types } from 'mongoose';
import { fileTypes } from '../../utils/constants';
import { IJwtPayload } from '../auth/auth.interface';
import { FileType } from '../file-folder-generation/generate.model';

const fetchAllFolderFromDB = async (user: IJwtPayload) => {
  try {
    const result = await FileType.find({ createdBy: user.userId, fieldname: fileTypes.folder });
    return result;
  } catch (err) {
    console.log(err);
    return false;
  }
};

const fetchAllPdfsFromDB = async (user: IJwtPayload) => {
  try {
    const result = await FileType.find({ createdBy: user.userId, fieldname: fileTypes.pdf });
    return result;
  } catch (err) {
    console.log(err);
    return false;
  }
};

const fetchAllImagesFromDB = async (user: IJwtPayload) => {
  try {
    const result = await FileType.find({ createdBy: user.userId, fieldname: fileTypes.images });
    return result;
  } catch (err) {
    console.log(err);
    return false;
  }
};

const fetchAllNotesFromDB = async (user: IJwtPayload) => {
  try {
    const result = await FileType.find({ createdBy: user.userId, fieldname: fileTypes.notes });
    return result;
  } catch (err) {
    console.log(err);
    return false;
  }
};

const fetchSingleFileFromDB = async (user: IJwtPayload, fileId: string) => {
  try {
    const result = await FileType.findOne({ createdBy: user.userId, _id: fileId });
    switch (result!.fieldname) {
      case 'pdf':
        return `${process.env.SERVER_URL}/files/pdf/${result!.filename}`;
      case 'images':
        return `${process.env.SERVER_URL}/files/images/${result!.filename}`;
      case 'notes':
        return `${process.env.SERVER_URL}/files/doc-files/${result!.name}`;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
};

export const fetchFilesInGroupFromDB = async (user: IJwtPayload) => {
  try {
    const groupedFiles = await FileType.aggregate([
      {
        $match: {
          createdBy: new Types.ObjectId(user.userId),
        },
      },
      {
        $addFields: {
          category: {
            $switch: {
              branches: [
                { case: { $eq: ['$fieldname', 'pdf'] }, then: 'pdf' },
                { case: { $eq: ['$fieldname', 'images'] }, then: 'images' },
                { case: { $eq: ['$fieldname', 'notes'] }, then: 'notes' },
                { case: { $eq: ['$fieldname', 'folder'] }, then: 'folders' },
              ],
              default: 'others',
            },
          },
        },
      },
      {
        $group: {
          _id: '$category',
          files: { $push: '$$ROOT' },
        },
      },
    ]);

    return groupedFiles.reduce((acc: Record<string, any[]>, group) => {
      acc[group._id] = group.files;
      return acc;
    }, {});
  } catch (err) {
    console.error('Error fetching grouped files:', err);
    return false;
  }
};

export const FetchServices = {
  fetchAllFolderFromDB,
  fetchAllPdfsFromDB,
  fetchAllImagesFromDB,
  fetchAllNotesFromDB,
  fetchSingleFileFromDB,
  fetchFilesInGroupFromDB,
};
