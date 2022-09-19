import { isTrackerEvent, objectToTrackerEvent } from '../data-log/event';
import { EventReceiver } from '../data-log/receiver';
import { Elements } from '../dom/elements';
import { TrackerElements } from '../dom/tracker_elems';
import { DebugLevelEnum, log, setDebugLevel } from '../utils/console_wrapper';
import { Scenario } from '../utils/scenarios';
import { MturkClient } from './../aws/mturk';
import { data } from './../data-log/data';
import { AllowSubmission, SubmitForm } from './../dom/submit_form';

log('tracker loaded.', DebugLevelEnum.BASIC);

export interface TrackerConfiguration {
    allowSubmission: AllowSubmission;
    debugLevel: DebugLevelEnum;
    bucketName: string;
    keyPrefix: string;
    setup(): void;
}

export class Tracker {
    public static lastPos = { x: 0, y: 0, time: 0 };

    public static loadScenario(scen: Scenario) {
        let sub = scen.scenario;
        if (sub.length > 50) {
            sub = sub.substring(0, 50);
            const inds = [
                sub.lastIndexOf(' '),
                sub.lastIndexOf('.'),
                sub.lastIndexOf(','),
                sub.lastIndexOf('?'),
                sub.lastIndexOf('!'),
            ];
            const ind = Math.max(...inds);
            sub = sub.substring(0, ind) + '...';
        }

        Elements.mtTopBannerText.innerText = sub;
        Elements.mtScenarioContext.innerText = scen.scenario;
        Elements.mtScenarioQuestion.innerText = scen.question;
        Elements.htmlLoc.dataset.task = scen.tag;
    }

    public static start(config: TrackerConfiguration) {
        setDebugLevel(config.debugLevel);
        // configure tracker specific elements
        TrackerElements.setupTrackerElements();
        SubmitForm.setup(config.allowSubmission);
        MturkClient.init(config.bucketName, config.keyPrefix);
        data.data.task = Elements.htmlLoc.dataset.task;
        config.setup();
    }

    public static registerEvent(eventType: string) {
        data.logs[eventType] = [];
        this.receiver.register(eventType, (event) => {
            data.logs[eventType].push(event);
        });
        return this.getEventDispatchFunc(eventType);
    }

    public static getEventDispatchFunc(eventType: string) {
        return (evData: any) => {
            if (typeof evData === 'object') {
                if (!isTrackerEvent(evData)) {
                    objectToTrackerEvent(evData, eventType);
                }
                this.receiver.doEvent(evData);
            }
        };
    }

    public static attachData(key: string, attribute: any) {
        data.data[key] = attribute;
    }

    public static computeAttribute(name: string, compute: (val: any) => any) {
        data.data[name] = compute(data.data[name]);
    }

    private static receiver = new EventReceiver();
}
