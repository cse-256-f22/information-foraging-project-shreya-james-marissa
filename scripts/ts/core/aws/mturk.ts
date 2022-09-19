import S3 from 'aws-sdk/clients/s3';
import { DebugLevelEnum, error, log } from '../utils/console_wrapper';
import { CredentialsProvider } from './cognito';
import { S3Client } from './s3';
log('mturk loaded.', DebugLevelEnum.BASIC);
export class MturkClient {
    public static init(bucketName: string, keyPrefix: string) {
        MturkClient.s3 = S3Client.get(bucketName, keyPrefix);
        Object.assign(window, {
            s3: MturkClient.s3,
            cog: MturkClient.cognito,
            sub: MturkClient.submit,
        });
    }

    public static async submit(name: string, data: any) {
        return error(async () => {
            const strData = JSON.stringify(data);
            console.log(strData);
            let ret = await MturkClient.s3.upload(name, strData);
            ret = ret as S3.PutObjectOutput;
        });
    }

    public static keyGen(hitID: string, assignmentID: string) {
        return `${hitID}_${assignmentID}_log.json`;
    }

    public static updateCognito(cp: CredentialsProvider) {
        MturkClient.cognito = cp;
    }

    public static updateS3(s3: S3Client) {
        MturkClient.s3 = s3;
    }

    // TODO: Change these back to private after debugging.
    public static cognito = CredentialsProvider.get();
    public static s3: S3Client;
}
