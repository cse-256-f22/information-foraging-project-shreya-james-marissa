import { TrackerEvent } from './event';
console.log('data loaded.');
export interface MturkURLData {
    raw: string;
    assignmentID: string | null;
    hitID: string | null;
    workerID: string | null;
    submitTo: string | null;
}

const urlParams = new URLSearchParams(window.location.hash.split('?')[1]);

export const urlData: MturkURLData = {
    raw: urlParams.toString(),
    assignmentID: urlParams.get('assignmentId'),
    hitID: urlParams.get('hitId'),
    workerID: urlParams.get('workerId'),
    submitTo: urlParams.get('turkSubmitTo'),
};

export class Data {
    public logs: { [eventType: string]: TrackerEvent[] } = {};
    public data: { [key: string]: any } = {};
    public errors: any[] = [];
    public urlData: MturkURLData;

    constructor(rawMturkURLData: MturkURLData) {
        this.urlData = rawMturkURLData;
    }

    public serialize(): string {
        return JSON.stringify(this);
    }
}

export const data = new Data(urlData);

Object.assign(window, { data });
