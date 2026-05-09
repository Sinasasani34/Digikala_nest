import {
  FileFieldsInterceptor,
  FileInterceptor,
} from "@nestjs/platform-express";
import { MulterField } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
import { memoryStorage } from "multer";

export function UploadFileS3(filename: string) {
  return class UploadUtility extends FileInterceptor(filename, {
    storage: memoryStorage(),
  }) {};
}

export function uploadFileFields3(uploadFields: MulterField[]) {
  return class UploadUtility extends FileFieldsInterceptor(uploadFields, {
    storage: memoryStorage(),
  }) {};
}
