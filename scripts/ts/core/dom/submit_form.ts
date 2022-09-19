import { noop } from '../utils/funcs';
import { MturkClient } from './../aws/mturk';
import { data } from './../data-log/data';
import { DebugLevelEnum, log } from './../utils/console_wrapper';
import { D } from './document';
import { Elements } from './elements';
log('submit form loaded.', DebugLevelEnum.BASIC);
export interface AllowSubmission {
    allow(): string | null;
    preSubmit(...args: any): any;
}

const AllowSubmissionDefault: AllowSubmission = {
    allow: () => null,
    preSubmit: noop,
};

export class SubmitForm {
    public static elem = Elements.submitForm as HTMLFormElement;
    public static allowSubmitDefault = { allow: () => true, preSubmit: noop };

    public static setup(
        allowSubmission: AllowSubmission = AllowSubmissionDefault
    ) {
        if (data.urlData.assignmentID !== null) {
            (D.id('assignment-id') as HTMLInputElement).value =
                data.urlData.assignmentID;
        }
        if (data.urlData.hitID !== null) {
            (D.id('hit-id') as HTMLInputElement).value = data.urlData.hitID;
        }
        SubmitForm.submitFunc = async (event) => {
            event.preventDefault();
            const allowed = allowSubmission.allow();
            if (allowed === null) {
                allowSubmission.preSubmit();
                let hitID = data.urlData.hitID;
                if (hitID === null) {
                    hitID = 'hitid' + Math.round(Math.random() * 100000);
                }
                let assignmnetID = data.urlData.assignmentID;
                if (assignmnetID === null) {
                    assignmnetID =
                        'assignmnetid' + Math.round(Math.random() * 100000);
                }
                await MturkClient.submit(
                    MturkClient.keyGen(hitID, assignmnetID),
                    data
                );
                console.log('hello');
                SubmitForm.elem.removeEventListener(
                    'submit',
                    SubmitForm.submitFunc
                );
                SubmitForm.elem.submit();
            } else {
                alert(allowed);
            }
        };
        SubmitForm.elem.addEventListener('submit', SubmitForm.submitFunc);
    }

    private static submitFunc: (event: Event) => any;
}
