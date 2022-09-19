export interface Scenario {
    scenario: string;
    question: string;
    inputType: string;
    tag: string;
}

// tslint:disable-next-line: no-var-requires
export const scenarios: Scenario[] = require('./../../../../scenarios/scenarios.json');
