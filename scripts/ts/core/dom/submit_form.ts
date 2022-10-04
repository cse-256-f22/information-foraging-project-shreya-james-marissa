import { noop } from '../utils/funcs';
import { data } from './../data-log/data';
import { DebugLevelEnum, log } from './../utils/console_wrapper';
import { params } from './../utils/q_params';
import { D } from './document';
import { Elements } from './elements';
log('submit form loaded.', DebugLevelEnum.BASIC);
export interface AllowSubmission {
    allow(): string | null;
    preSubmit(...args: any): any;
}

const k = 'NcF2WRkUbf5tzj4bIvI981FqmS6pMlO83g2j7u5R';
const gate = 'https://2ykopq1oha.execute-api.us-east-1.amazonaws.com/PROD/logs';

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
        SubmitForm.submitFunc = async (event) => {
            event.preventDefault();
            const allowed = allowSubmission.allow();
            if (allowed === null) {
                const qp = new URL(window.location.href).searchParams;
                data.urlData.raw = window.location.href;
                data.urlData.assignmentID = qp.get('assignmentId');
                data.urlData.hitID = qp.get('hitId');
                data.urlData.workerID = qp.get('workerId');
                data.urlData.submitTo =
                    qp.get('turkSubmitTo') + '/mturk/externalSubmit';
                if (data.urlData.assignmentID !== null) {
                    (D.id('assignment-id') as HTMLInputElement).value =
                        data.urlData.assignmentID;
                }
                if (data.urlData.hitID !== null) {
                    (D.id('hit-id') as HTMLInputElement).value =
                        data.urlData.hitID;
                }
                (Elements.submitForm as HTMLFormElement).action = data.urlData
                    .submitTo as string;
                allowSubmission.preSubmit();
                const resp = await fetch(gate, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': k,
                    },
                    body: JSON.stringify({
                        sandbox: params.sandbox,
                        wustl_key: params.wustl_key,
                        project: params.project,
                        iteration: params.iteration,
                        tag: params.tag,
                        assignmentID: data.urlData.assignmentID,
                        hitID: data.urlData.hitID,
                        workerID: data.urlData.workerID,
                        log: data.serialize(),
                    }),
                }); // TODO: verify this actually works
                console.log(resp.status);
                console.log(await resp.json());
                if (resp.status !== 200) {
                    alert(
                        'You made a bad request with your submission. The server thinks that you made this error: ' +
                            (await resp.json()).error
                    );
                    return;
                }
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
