import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { IJwtPayload } from '../auth/auth.interface';
import { OperationGenServices } from './operation.service';

const copyFile = catchAsync(async (req: Request, res: Response) => {
  await OperationGenServices.copyFIleInDB(req.user as IJwtPayload, req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'File copied successfully!',
    data: null,
  });
});

const renameFile = catchAsync(async (req: Request, res: Response) => {
  const { fileId } = req.params;
  await OperationGenServices.renameFIleInDB(fileId, req.body.filename);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Filename changed successfully!',
    data: null,
  });
});

const duplicateAfile = catchAsync(async (req: Request, res: Response) => {
  const { fileId } = req.params;
  await OperationGenServices.duplicateFIleInDB(fileId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'File duplicated successfully!',
    data: null,
  });
});

const makeAfileFavourite = catchAsync(async (req: Request, res: Response) => {
  const { fileId } = req.params;
  await OperationGenServices.makeAfileFavouriteIntoDB(fileId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'File is added in favorite list successfully!',
    data: null,
  });
});

const deleteAfileController = catchAsync(async (req: Request, res: Response) => {
  const { fileId } = req.params;
  await OperationGenServices.makeAfileDelteFromDB(fileId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'File is deleted successfully!',
    data: null,
  });
});

const filterFileController = catchAsync(async (req: Request, res: Response) => {
  const { start } = req.body;
  const results = await OperationGenServices.filterFileFromDBservice({ start });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Files are filtered successfully!',
    data: results,
  });
});

export const OperationController = {
  copyFile,
  renameFile,
  duplicateAfile,
  makeAfileFavourite,
  deleteAfileController,
  filterFileController,
};
