import S3 from 'aws-sdk/clients/s3';
import * as AWS from 'aws-sdk/global';
import { DebugLevelEnum, log } from '../utils/console_wrapper';
log('s3 loaded.', DebugLevelEnum.BASIC);
export class S3Client {
    public static bucketName = '';
    public static apiVersion = '2006-03-01';
    public static keyPrefix = '';

    public static get(bucket: string = S3Client.bucketName, keyPrefix: string) {
        return new S3Client(bucket, keyPrefix);
    }

    private s3: S3;

    constructor(private bucketName: string, private keyPrefix: string) {
        this.s3 = new S3({
            apiVersion: S3Client.apiVersion,
        });
    }

    public get bucket() {
        return this.bucketName;
    }

    public upload(
        name: string,
        data: any
    ): Promise<AWS.AWSError | S3.PutObjectOutput> {
        return new Promise((resolve, reject) => {
            this.s3.putObject(
                {
                    Key: this.keyPrefix + '/' + name,
                    Body: data,
                    Bucket: this.bucket,
                },
                (err: AWS.AWSError, success: S3.PutObjectOutput) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(success);
                    }
                }
            );
        });
    }
}
