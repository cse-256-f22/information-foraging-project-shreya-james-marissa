import { D } from '../dom/document';
import { Elements } from '../dom/elements';
import { Modal } from '../dom/modal';
import { DebugLevelEnum, error, log } from '../utils/console_wrapper';
import { noop } from '../utils/funcs';
import { HTMLLoader } from '../utils/html_loader';
import { History } from './history';
log('router loaded.', DebugLevelEnum.BASIC);
export const enum RouterMode {
    OFF,
    ON,
    STANDARD_ALLOWANCES,
}

// TODO: Need to improve this to take in a function for the allowance or reduce abstractness overall.

export const enum RouterModule {
    A = 'A',
    IMG = 'IMG',
    FORM = 'FORM',
}

export interface RouterConfig {
    module: RouterModule;
    mode: RouterMode;
}

interface FullRouterConfig extends RouterConfig {
    setup(config: FullRouterConfig, elem: Element): any;
}

function testOn(elem: Element, config: RouterConfig) {
    return (
        elem.tagName === config.module &&
        (config.mode === RouterMode.ON ||
            config.mode === RouterMode.STANDARD_ALLOWANCES)
    );
}
function testAllowance(config: RouterConfig) {
    return config.mode === RouterMode.STANDARD_ALLOWANCES;
}

export class Router {
    public static HASH_TAGS = new RegExp('#');
    public static EMPTY = new RegExp('^$');
    public static AT_SYMBOL = new RegExp('@');

    public static HASH_TAG_RESPONDER = noop;
    public static EMPTY_RESPONDER = (event: Event) => event.preventDefault();
    public static AT_SYMBOL_RESPONDER = (event: Event) =>
        event.preventDefault();

    public static pathPrefix = '';

    public static configure(configs: RouterConfig[], pathPrefix: string) {
        configs.forEach((config) => {
            Router.configs.set(config.module, Router.upgradeConfig(config));
        });
        Router.pathPrefix = pathPrefix;
    }

    public static setup(elem: Element | string) {
        D.eachRecur(elem, (node) => {
            for (const config of Router.configs.values()) {
                if (testOn(node, config)) {
                    config.setup(config, node);
                }
            }
        });
    }

    public static STANDARD_LINK_LISTENER(e: MouseEvent) {
        return error(() => {
            e.preventDefault();
            const target = e.target as HTMLAnchorElement;
            const url = target.href;
            History.forward(Router.getPathName(url));
            const ret = HTMLLoader.loadURL(url, Elements.htmlLoc);
            window.dispatchEvent(new CustomEvent('newPageLoad'));
            return ret;
        });
    }

    public static ON_COMPLETE_SLL(post: (e: MouseEvent) => any) {
        return (e: MouseEvent) => {
            error(async () => {
                await Router.STANDARD_LINK_LISTENER(e);
                post(e);
            });
        };
    }

    public static IMAGE_LINK_LISTENER(e: MouseEvent) {
        return error(() => {
            // TODO: Load modal or load nothing at all, fix this
            e.preventDefault();
            const target = e.target as HTMLImageElement;
            const url = target.src;
            History.forward(Router.getPathName(url));
            return HTMLLoader.loadURL(url, Elements.htmlLoc);
        });
    }

    public static FORM_OFF_LISTENER(e: Event) {
        e.preventDefault();
        console.error(
            'All forms except for the one in the top header are inactive.'
        );
    }

    public static defaultAllowancesOn() {
        Router.registerAllowance(
            { regex: Router.EMPTY, func: Router.EMPTY_RESPONDER },
            { regex: Router.HASH_TAGS, func: Router.HASH_TAG_RESPONDER },
            { regex: Router.AT_SYMBOL, func: Router.AT_SYMBOL_RESPONDER }
        );
    }
    public static defaultAllowancesOff() {
        Router.unregisterAllowance(
            Router.EMPTY,
            Router.HASH_TAGS,
            Router.AT_SYMBOL
        );
    }
    public static registerAllowance(
        ...regexs: Array<{ regex: RegExp; func: (event: Event) => any }>
    ) {
        regexs.forEach((regex) =>
            Router.linkAllowances.set(regex.regex, regex.func)
        );
    }
    public static unregisterAllowance(...regexs: RegExp[]) {
        regexs.forEach((regex) => Router.linkAllowances.delete(regex));
    }
    public static clearAllowances() {
        Router.linkAllowances.clear();
    }

    public static async load(url: string): Promise<boolean> {
        History.forward(Router.getPathName(url));
        const ret = await HTMLLoader.loadURL(url, Elements.htmlLoc);
        window.dispatchEvent(new CustomEvent('newPageLoad'));
        return ret;
    }

    public static async loadWithPathPrefix(page: string): Promise<boolean> {
        const ret = HTMLLoader.loadURL(
            Router.pathPrefix + page,
            Elements.htmlLoc
        );
        window.dispatchEvent(new CustomEvent('newPageLoad'));
        return ret;
    }

    private static SetupFunctions = {
        A: (config: FullRouterConfig, elem: Element) => {
            const aNode = elem as HTMLAnchorElement;
            if (testAllowance(config)) {
                let passesRegexTest = true;
                const href = aNode.href;
                Router.linkAllowances.forEach((func, regex) => {
                    const test = regex.test(href);
                    passesRegexTest = passesRegexTest && !test;
                    if (test) {
                        D.addEventListener(elem, 'click', func);
                    }
                });
                if (passesRegexTest) {
                    if (href.substr(href.length - 3) === 'pdf') {
                        D.addEventListener(elem, 'click', (e) => {
                            e.preventDefault();
                            Modal.display(href);
                        });
                    } else {
                        D.addEventListener(elem, 'click', (e) =>
                            Router.STANDARD_LINK_LISTENER(e as MouseEvent)
                        );
                    }
                }
            } else {
                D.addEventListener(elem, 'click', (e) =>
                    Router.STANDARD_LINK_LISTENER(e as MouseEvent)
                );
            }
        },
        IMG: (config: FullRouterConfig, elem: Element) => {
            const imgNode = elem as HTMLImageElement;
            if (testAllowance(config)) {
                let passesRegexTest = true;
                Router.linkAllowances.forEach((func, regex) => {
                    const test = !regex.test(imgNode.src);
                    passesRegexTest = passesRegexTest && test;
                    if (test) {
                        D.addEventListener(elem, 'click', func);
                    }
                });
                if (passesRegexTest) {
                    D.addEventListener(elem, 'click', (e) =>
                        Router.STANDARD_LINK_LISTENER(e as MouseEvent)
                    );
                }
            } else {
                D.addEventListener(elem, 'click', (e) =>
                    Router.STANDARD_LINK_LISTENER(e as MouseEvent)
                );
            }
        },
        FORM: (config: FullRouterConfig, elem: Element) => {
            const formNode = elem as HTMLFormElement;
            if (testAllowance(config)) {
                let passesRegexTest = true;
                Router.linkAllowances.forEach((func, regex) => {
                    const test = !regex.test(formNode.src);
                    passesRegexTest = passesRegexTest && test;
                    if (test) {
                        D.addEventListener(elem, 'click', func);
                    }
                });
                if (passesRegexTest) {
                    D.addEventListener(
                        elem,
                        'submit',
                        Router.FORM_OFF_LISTENER
                    );
                }
            } else {
                D.addEventListener(elem, 'submit', Router.FORM_OFF_LISTENER);
            }
        },
    };

    private static configs = new Map<RouterModule, FullRouterConfig>();

    private static linkAllowances: Map<RegExp, (event: Event) => any> = new Map<
        RegExp,
        (event: Event) => any
    >();

    private static pathRegex = /\/([\w]+.html)/;

    private static upgradeConfig(config: RouterConfig): FullRouterConfig {
        return {
            module: config.module,
            mode: config.mode,
            setup: Router.SetupFunctions[config.module],
        };
    }
    private static getPathName(url: string): string {
        const ret = Router.pathRegex.exec(url);
        return ret === null ? url : ret.length > 1 ? ret[1] : url;
    }
}
