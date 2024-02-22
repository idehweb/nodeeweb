import Subscriber from './subscriber.abstract';
import { CronJob } from 'cron';
export default class AnalysisSubscriber extends Subscriber {
    dailyCron: CronJob;
    private dailyAnalysis;
    private getDailyCron;
    private setDailyCron;
    subscribe(): void;
    unSubscribe(): void;
}
