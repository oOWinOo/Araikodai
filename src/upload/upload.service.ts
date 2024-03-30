import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadService {
  private s3: AWS.S3;
  private bucket: string;
  private region: string;
  constructor(private configService: ConfigService) {
    this.region = configService.get('AWS_REGION');
    this.s3 = new AWS.S3({
      accessKeyId: this.configService.get('AWS_ACCESS_KEY'),
      secretAccessKey: this.configService.get('AWS_SECRET_KEY'),
      region: this.region,
    });
    this.bucket = configService.get('AWS_BUCKET_NAME');
  }
  async getPreSignedURL(key: string, contentType: string) {
    try {
      const uniqueKey = key + '-' + new Date().valueOf();

      const params = {
        Bucket: this.bucket,
        Key: uniqueKey,
        ContentType: contentType,
        Expires: 180000,
      };

      const presignedUrl = await this.s3.getSignedUrlPromise(
        'putObject',
        params,
      );
      return {
        presignedUrl,
        uniqueKey,
      };
    } catch (error) {
      throw error;
    }
  }

  getPreSignedURLToViewObject(key: string) {
    return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;
  }
}
