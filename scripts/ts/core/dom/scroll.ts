import { DebugLevelEnum, error, log } from '../utils/console_wrapper';
import { noop, now } from './../utils/funcs';
log('scroll loaded.', DebugLevelEnum.BASIC);
/**
 * Linear implementation of scrolling.
 * Follows the singleton pattern, call do to start a scroll operation.
 *
 * If a scroll is called when another scroll has already begun an
 * error will be thrown, but the first scroll will continue until completion.
 */
export class Scroll {
    public static STEP_IN_MS = 17;

    public static callback(
        endPos: number,
        duration: number = 200,
        complete: (...args: any) => any = noop
    ): void {
        if (Scroll.running) {
            throw new Error(
                'Cannot make multiple calls to scroll at the same time.'
            );
        }
        Scroll.running = true;
        const oldComplete = complete;
        complete = () => {
            Scroll.running = false;
            error(oldComplete);
        };
        this.instance.update(endPos, duration, complete).attemptScroll();
    }

    public static promise(endPos: number, duration: number = 200) {
        if (Scroll.running) {
            throw new Error(
                'Cannot make multiple calls to scroll at the same time.'
            );
        }
        Scroll.running = true;
        return new Promise(
            (
                resolve: (value?: unknown) => void,
                reject: (arg0: any) => void
            ) => {
                try {
                    const runResolver = () => {
                        Scroll.running = false;
                        resolve();
                    };
                    this.instance
                        .update(endPos, duration, runResolver)
                        .attemptScroll();
                } catch (err) {
                    Scroll.running = false;
                    reject(err);
                }
            }
        );
    }

    private static running = false;
    private static instance = new Scroll(0, 0, noop);
    private complete: (...args: any) => any;

    private constructor(
        private endPos: number,
        private duration: number,
        complete: (...args: any) => any
    ) {
        this.complete = (...args: any) => {
            document.dispatchEvent(new CustomEvent('scroll'));
            complete(args);
        };
    }

    public static get isRunning() {
        return Scroll.running;
    }

    private update(
        endPos: number,
        duration: number,
        complete: (...args: any) => any
    ): Scroll {
        this.endPos = endPos;
        this.duration = duration;
        this.complete = complete;
        return this;
    }

    private calcScrollAmount() {
        const curTime = now();
        const steps = Math.max(
            1,
            (this.duration - curTime) / Scroll.STEP_IN_MS
        );
        const curPos = window.pageYOffset;
        return Math.ceil((this.endPos - curPos) / steps);
    }

    private scroll() {
        window.scroll(0, this.calcScrollAmount());
        if (window.pageYOffset === this.endPos) {
            this.complete();
        } else {
            requestAnimationFrame(this.scroll);
        }
    }

    private attemptScroll() {
        if ('requestAnimationFrame' in window === false) {
            window.scroll(0, this.endPos);
        }
        this.scroll();
    }
}
