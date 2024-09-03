import logger from '../../utils/logger';
import * as _ from 'lodash';
import { CronJob } from 'cron';
import { getAllCloudFolder, getQuestionSignedUrl } from '../../services/awsService';
import { getProcessByMetaData, updateProcess } from '../../services/process';
import path from 'path';
import AdmZip from 'adm-zip';

const checkStatus = new CronJob('0 */1 * * * *', async () => {
  try {
    const processInfo = await getProcessByMetaData({ status: 'in_progres' });
    const { getProcess } = processInfo;
    for (const process of getProcess) {
      const { process_id, fileName, name } = process;
      const folderPath = `upload/${process_id}`;

      // Fetch the list of files in the S3 folder
      const s3Objects = await getAllCloudFolder(folderPath);

      //checking the process id folder is empty
      if (!s3Objects.Contents || _.isEmpty(s3Objects.Contents)) {
        await updateProcess(process_id, {
          error_status: 'is_empty',
          error_message: 'the uploaded zip folder is empty ,please ensure the valid uplaod file',
          status: 'is_failed',
        });
        continue;
      }

      //checking main folder in zip format
      let isZipFile = true;
      for (const s3Object of s3Objects.Contents) {
        const cloudFileName = s3Object.Key?.split('/').pop();
        const fileExt = path.extname(cloudFileName || '').toLowerCase();

        if (fileExt !== '.zip') {
          await updateProcess(process_id, {
            error_status: 'is_unsupported_format',
            error_message: 'the uploaded file is unsuported fromat,please ensure to upload all the csv file inside zip file',
            status: 'is_failed',
          });
          isZipFile = false;
          break;
        }
        isZipFile;

        // If it's a zip folder, validate the contents
        const s3File = await getQuestionSignedUrl(folderPath, fileName, 10);
        if (!s3File.url) {
          throw new Error('Signed URL is missing or invalid');
        }

        const response = await fetch(s3File.url);
        if (!response.ok) throw new Error('Network response was not ok');
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const zip = new AdmZip(buffer);
        const zipEntries = zip.getEntries();

        //Checking that process_id folder having folder inside
        if (!zipEntries[0].isDirectory) {
          await updateProcess(process_id, {
            error_status: 'is_unsupported_folder_type',
            error_message: 'In the uploaded zip folder file are in csv format ,please ensure to upload all the csv file inside the  zip folder',
            status: 'is_failed',
          });
        }

        //checking that same question type is added as main folder name
        if (!zipEntries[0].entryName.includes(name.split('.')[0])) {
          await updateProcess(process_id, {
            error_status: 'is_unsupported_type',
            error_message: 'the uploaded zip folder are same question type as the main folder name',
            status: 'is_failed',
          });
        }

        let firstIteration = true;

        for (const entry of zipEntries) {
          if (firstIteration) {
            firstIteration = false;
            continue;
          }

          //checking that inside zip folder all are
          if (entry.isDirectory) {
            await updateProcess(process_id, {
              error_status: 'is_unsupported_type',
              error_message: 'inside the zip folder only be a csv file with same question type of the main folder',
              status: 'is_failed',
            });

            break;
          }

          //checking same question type is uploaded
          if (!entry.entryName.includes(name.split('.')[0])) {
            await updateProcess(process_id, {
              error_status: 'is_unsupported_type',
              error_message: 'the uploaded file are same question type as the main folder name',
              status: 'is_failed',
            });
            break;
          }
        }
      }
    }
  } catch (error) {
    const err = error instanceof Error;
    const code = _.get(error, 'code', 'TEMPLATE_GET_FAILURE');
    const errorMsg = err ? error.message : 'error while upload question';
    logger.error({ errorMsg, code });
  }
});
checkStatus.start();
