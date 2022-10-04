import { params } from '../core/utils/q_params';
import { data } from './../core/data-log/data';
import { ActionEnum } from './../core/data-log/event';
import { D } from './../core/dom/document';
import { Elements } from './../core/dom/elements';
import { Scroll } from './../core/dom/scroll';
import { History } from './../core/router/history';
import { Router, RouterMode, RouterModule } from './../core/router/router';
import { Tracker } from './../core/tracker/tracker';
import { DebugLevelEnum } from './../core/utils/console_wrapper';
import { HTMLLoader } from './../core/utils/html_loader';
import { IDGenerator } from './../core/utils/id_generator';
import { waitUntilReady } from './../core/utils/ready';
import { scenarios, Scenario } from './../core/utils/scenarios';

const setup = async () => {
    await waitUntilReady();
    const scenario = scenarios.find((scen) => scen.tag === params.tag);
    if (!params.sandbox) {
        if (scenario === null || scenario === undefined) {
            alert('This HIT is broken and cannot be completed at this time.');
        } else {
            Tracker.loadScenario(scenario as Scenario);
        }
    }
    Tracker.start({
        keyPrefix: 'information-foraging',
        bucketName: 'cse-256-log',
        allowSubmission: {
            allow() {
                try {
                    const textArea = D.id('text-area') as HTMLTextAreaElement;
                    console.log(textArea.value);
                    if (textArea.value === '') {
                        return 'You must fill out the text box to turn this HIT in.';
                    } else {
                        return null;
                    }
                } catch (error) {
                    console.log(error);
                    return 'There was an error fill out the form and try again.';
                }
            },
            preSubmit() {
                data.data.response = (D.id(
                    'text-area'
                ) as HTMLTextAreaElement).value;
                return;
            },
        },

        debugLevel: DebugLevelEnum.NONE,

        async setup() {
            // configure router
            Router.defaultAllowancesOn();
            Router.configure(
                [
                    {
                        mode: RouterMode.STANDARD_ALLOWANCES,
                        module: RouterModule.A,
                    },
                    { mode: RouterMode.OFF, module: RouterModule.FORM },
                    {
                        mode: RouterMode.STANDARD_ALLOWANCES,
                        module: RouterModule.IMG,
                    },
                ],
                'files/'
            );
            History.setup(window.location.href, { wrapper: true });
            // configure html loader post operation
            HTMLLoader.finish();
            HTMLLoader.registerPostLoadFunc(() => {
                IDGenerator.reset();
                IDGenerator.attachIdsToAllElements();
                Router.setup(Elements.htmlLoc);
                Scroll.promise(0);
            });
            // configure listeners on html loc
            D.addEventListener(Elements.htmlLoc, ActionEnum.CLICK, (e) => {
                const ev = e as MouseEvent;
                const obj = {
                    x: ev.clientX,
                    y: ev.clientY,
                    id: (ev.target as HTMLElement).id,
                };
                Tracker.getEventDispatchFunc(ActionEnum.CLICK)(obj);
            });
            D.addEventListener(Elements.document, 'keypress', (e) => {
                const ev = e as KeyboardEvent;
                const obj = {
                    key: ev.key,
                    id: (ev.srcElement as HTMLElement).id,
                };
                Tracker.getEventDispatchFunc(ActionEnum.BUTTON)(obj);
            });
            // SPECIAL CASE: document.documentElement does not behave the same way as document so the below function must behave differently than the listeners above.
            const sElem = document.scrollingElement as Element;
            document.addEventListener('scroll', (e) => {
                const dx = sElem.scrollLeft;
                const dy = sElem.scrollTop;
                const dtime = new Date().getTime();
                if (
                    Math.abs(Tracker.lastPos.x - dx) > 10 ||
                    (Math.abs(Tracker.lastPos.y - dy) > 10 &&
                        dtime - Tracker.lastPos.time > 100)
                ) {
                    Tracker.lastPos.x = dx;
                    Tracker.lastPos.y = dy;
                    Tracker.lastPos.time = dtime;
                    const obj = { x: dx, y: dy };
                    Tracker.getEventDispatchFunc(ActionEnum.SCROLL)(obj);
                }
            });
            // configure tracked events
            Tracker.registerEvent(ActionEnum.HISTORY);
            Tracker.registerEvent(ActionEnum.BUTTON);
            Tracker.registerEvent(ActionEnum.CLICK);
            Tracker.registerEvent(ActionEnum.SCROLL);
            // load first page
            await Router.load('files/index.html');
        },
    });
};

setup();
