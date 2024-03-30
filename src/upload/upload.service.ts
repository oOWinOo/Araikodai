import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadService {
  private s3;
  constructor(private configService: ConfigService) {
    this.s3 = new AWS.S3({
      accessKeyId: this.configService.get('AWS_ACCESS_KEY'),
      secretAccessKey: this.configService.get('AWS_SECRET_KEY'),
      region: this.configService.get('AWS_REGION'),
    });
  }
}
