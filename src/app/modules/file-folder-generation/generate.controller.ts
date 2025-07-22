import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { IJwtPayload } from '../auth/auth.interface';
import { GenServices } from './generate.service';

interface UploadedFiles {
  pdf?: Express.Multer.File[];
  images?: Express.Multer.File[];
}

const GenerateDocFile = catchAsync(async (req: Request, res: Response) => {
  const result = await GenServices.generateDocFileIntoDB(req.user as IJwtPayload);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'File created successfully!',
    data: result,
  });
});

const storeFiles = catchAsync(async (req: Request, res: Response) => {
  const result = await GenServices.uploadFilesIntoDB(req.user as IJwtPayload, req.files as UploadedFiles);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'File uploaded successfully!',
    data: result,
  });
});

const createFolder = catchAsync(async (req: Request, res: Response) => {
  const result = await GenServices.createFolderIntoDB(req.user as IJwtPayload, req.body.name);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Folder created successfully!',
    data: result,
  });
});

export const GenController = {
  GenerateDocFile,
  storeFiles,
  createFolder,
};
