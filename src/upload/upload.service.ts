import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadService {
  private s3: AWS.S3;
  private bucket: string;
  constructor(private configService: ConfigService) {
    this.s3 = new AWS.S3({
      accessKeyId: this.configService.get('AWS_ACCESS_KEY'),
      secretAccessKey: this.configService.get('AWS_SECRET_KEY'),
      region: this.configService.get('AWS_REGION'),
    });
    this.bucket = configService.get('AWS_BUCKET_NAME');
  }
  async getPreSignedURL(key: string, contentType: string) {
    try {
      const params = {
        Bucket: this.bucket,
        Key: key,
        ContentType: contentType,
        Expires: 180000,
      };

      return await this.s3.getSignedUrlPromise('putObject', params);
    } catch (error) {
      throw error;
    }
  }
  async getPreSignedURLToViewObject(key: string) {
    try {
      const params = {
        Bucket: this.bucket,
        Key: key,
        Expires: 30000,
      };

      return await this.s3.getSignedUrlPromise('getObject', params);
    } catch (error) {
      throw error;
    }
  }
}
