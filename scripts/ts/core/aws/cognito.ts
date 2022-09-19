import * as AWS from 'aws-sdk/global';
import { DebugLevelEnum, log } from './../utils/console_wrapper';
log('cognito loaded.', DebugLevelEnum.BASIC);
export class CredentialsProvider {
    public static ipID = 'us-east-2:94f763ec-3864-4e89-810d-6d2ba70172ba';
    public static region = 'us-east-2';

    public static get(
        identityPoolId = CredentialsProvider.ipID,
        region = CredentialsProvider.region
    ) {
        return new CredentialsProvider(identityPoolId, region);
    }

    private creds: AWS.CognitoIdentityCredentials;

    constructor(identityPoolId: string, private region: string) {
        AWS.config.region = region;
        this.creds = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: identityPoolId,
        });
        this.creds.get((error) => {
            error
                ? log(error.message, DebugLevelEnum.DETAILED)
                : log('No error was reported.', DebugLevelEnum.DETAILED);
        });
        AWS.config.credentials = this.creds;
    }

    public get credentials() {
        return this.creds;
    }
}
