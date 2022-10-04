export interface Scenario {
    context: string;
    question: string;
    tag: string;
}

// tslint:disable-next-line: no-var-requires
export const scenarios: Scenario[] = require('./../../../../scenarios/scenarios.json');
(window as any).scenarios = scenarios;
