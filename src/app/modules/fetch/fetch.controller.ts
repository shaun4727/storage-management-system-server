import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { IJwtPayload } from '../auth/auth.interface';
import { FetchServices } from './fetch.service';

const FetchFolders = catchAsync(async (req: Request, res: Response) => {
  const result = await FetchServices.fetchAllFolderFromDB(req.user as IJwtPayload);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Folders are fetched successfully!',
    data: result,
  });
});

const FetchPdfs = catchAsync(async (req: Request, res: Response) => {
  const result = await FetchServices.fetchAllPdfsFromDB(req.user as IJwtPayload);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'PDF files are fetched successfully!',
    data: result,
  });
});

const FetchImages = catchAsync(async (req: Request, res: Response) => {
  const result = await FetchServices.fetchAllImagesFromDB(req.user as IJwtPayload);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Images are fetched successfully!',
    data: result,
  });
});

const FetchNotes = catchAsync(async (req: Request, res: Response) => {
  const result = await FetchServices.fetchAllNotesFromDB(req.user as IJwtPayload);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Notes are fetched successfully!',
    data: result,
  });
});

const fetchSingleFile = catchAsync(async (req: Request, res: Response) => {
  const { fileId } = req.params;
  const result = await FetchServices.fetchSingleFileFromDB(req.user as IJwtPayload, fileId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'File is fetched successfully!',
    data: result,
  });
});

const getGroupByFiles = catchAsync(async (req: Request, res: Response) => {
  const result = await FetchServices.fetchFilesInGroupFromDB(req.user as IJwtPayload);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Files are fetched successfully in a group!',
    data: result,
  });
});

export const FetchController = {
  FetchFolders,
  FetchPdfs,
  FetchImages,
  FetchNotes,
  fetchSingleFile,
  getGroupByFiles,
};
