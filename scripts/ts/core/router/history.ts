import { Tracker } from './../tracker/tracker';

export interface HistoryEntry {
    hasPrevURL: boolean;
    prevEntry?: HistoryEntry;
    currURL: string;
    extra?: any;
    nextEntries: HistoryEntry[];
}

function newHistoryEntry(
    currURL: string,
    hasPrevURL: boolean,
    prevEntry?: HistoryEntry,
    extra?: any
): HistoryEntry {
    Tracker.getEventDispatchFunc('history')({ url: currURL, extra });
    return {
        currURL,
        hasPrevURL,
        prevEntry,
        extra,
        nextEntries: [],
    };
}

export class History {
    public static forward(url: string, extra?: any): string {
        const histEnt = newHistoryEntry(url, true, History.currhistory, extra);
        History.currhistory.nextEntries.push(histEnt);
        History.currhistory = histEnt;
        return url;
    }

    public static canBackward(): boolean {
        return (
            History.currhistory.hasPrevURL &&
            !History.currhistory.prevEntry?.extra?.wrapper
        );
    }

    public static backward(): string {
        if (!History.canBackward()) {
            throw new Error('Cannot go back any further.');
        }
        console.log(History.currhistory.prevEntry);
        const prevEntry = History.currhistory.prevEntry as HistoryEntry;
        const nextURL = prevEntry.currURL;
        const histEnt = newHistoryEntry(
            nextURL,
            prevEntry.hasPrevURL,
            prevEntry.prevEntry,
            { back: true }
        );
        History.currhistory = histEnt;
        return nextURL;
    }

    public static setup(url: string, extra?: any) {
        History.firstHistory = newHistoryEntry(url, false, undefined, extra);
        History.currhistory = History.firstHistory;
    }

    private static firstHistory: HistoryEntry;
    private static currhistory: HistoryEntry;
}

(window as any).h = History;
