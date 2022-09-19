import { D } from '../dom/document';
import { DebugLevelEnum, log } from './console_wrapper';
import { noop } from './funcs';
log('html loader loaded.', DebugLevelEnum.BASIC);
export interface Cache {
    [name: string]: Element;
}
export class HTMLLoader {
    public static CACHE: Cache = {};

    public static finish() {
        HTMLLoader.finished = true;
        HTMLLoader.flattenTSLoadTags();
    }

    public static isFinished() {
        return HTMLLoader.finished;
    }

    public static cacheHTML(name: string, content: string) {
        if (HTMLLoader.finished) {
            throw new Error(
                'Cannot cache new HTML entities after the application has been started.'
            );
        }
        const tsl = document.createElement('ts-load');
        tsl.dataset.name = name;
        tsl.innerHTML = content;
        this.CACHE[name] = tsl;
    }

    public static registerPostLoadFunc(func: () => any) {
        log('regsiter post load function', DebugLevelEnum.DETAILED);
        HTMLLoader.postLoadFunc = func;
    }

    public static load(html: string, elem: Element | string) {
        return new Promise<boolean>((resolve, reject) => {
            try {
                log('begin load', DebugLevelEnum.DETAILED);
                const context = D.elem(elem);
                const range = document.createRange();
                range.selectNodeContents(context);
                const frag = range.createContextualFragment(html);
                HTMLLoader.removeTagsFromDocumentFragment(frag, 'script');
                HTMLLoader.loadAllCachedElements(frag);
                context.innerHTML = '';
                context.appendChild(frag);
                log('end load', DebugLevelEnum.DETAILED);
                HTMLLoader.postLoadFunc();
                resolve(true);
            } catch (err) {
                reject(err);
            }
        });
    }

    public static async loadURL(url: string, elem: Element | string) {
        return HTMLLoader.load(await HTMLLoader.getHTML(url), elem);
    }

    public static getHTML(url: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            try {
                log('begin request', DebugLevelEnum.DETAILED);
                const request = new XMLHttpRequest();
                request.open('GET', url, true);
                request.send(null);
                request.onreadystatechange = () => {
                    if (request.readyState === 4) {
                        log('resolve request', DebugLevelEnum.DETAILED);
                        resolve(request.responseText);
                    }
                };
            } catch (err) {
                reject(err);
            }
        });
    }

    private static finished = false;

    private static postLoadFunc: () => any = noop;

    private static removeTagsFromDocumentFragment(
        frag: DocumentFragment,
        tagName: string
    ) {
        frag.querySelectorAll(tagName).forEach((tag) => frag.removeChild(tag));
    }

    private static flattenTSLoadTags() {
        log('Flattening', DebugLevelEnum.DETAILED);
        const s = new Set<string>();
        Object.keys(HTMLLoader.CACHE).forEach(
            (name) =>
                (HTMLLoader.CACHE[name] = HTMLLoader.flattenTSLoadTag(
                    HTMLLoader.getCachedContent(name) as Element,
                    s,
                    0
                ) as Element)
        );
    }

    private static multipleTabs(n: number): string {
        let ret = '';
        for (let i = 0; i < n; i++) {
            ret += '\t';
        }
        return ret;
    }

    private static flattenTSLoadTag(
        elem: Element,
        flattened: Set<string>,
        count: number
    ): Element | null {
        const tabs = HTMLLoader.multipleTabs(count);
        if (count > 100) {
            alert('Check the console, an error has occurred.');
            throw new Error(
                'It seems like you might have infinitely recursively nested tags.' +
                    '\nHere are all of the tags that have been flattened so far: ' +
                    flattened +
                    '\nHere is the name of the current element: ' +
                    elem.getAttribute('data-name')
            );
        }
        const name = elem.getAttribute('data-name');
        if (name === null) {
            return null;
        }
        const content = HTMLLoader.getCachedContent(name);
        if (content === null) {
            return null;
        }
        if (flattened.has(name)) {
            return content;
        }
        content.querySelectorAll('script').forEach((e) => e.remove());
        content.querySelectorAll('ts-load').forEach((e) => {
            const child = HTMLLoader.flattenTSLoadTag(e, flattened, count + 1);
            if (child !== null) {
                e.replaceWith(child);
            }
        });
        flattened.add(name);
        return content;
    }

    private static getCachedContent(
        name: string | null | undefined
    ): Element | null {
        if (name === undefined || name === null) {
            return null;
        }
        const content = HTMLLoader.CACHE[name];
        if (content === undefined || content === null) {
            return null;
        }
        return content.cloneNode(true) as Element;
    }

    private static loadAllCachedElements(frag: DocumentFragment) {
        frag.querySelectorAll('ts-load').forEach((elem) => {
            const name = elem.getAttribute('data-name');
            const content = HTMLLoader.getCachedContent(name);
            if (content != null) {
                elem.replaceWith(content);
            }
        });
    }
}
