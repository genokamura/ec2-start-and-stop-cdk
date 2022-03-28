import { Construct } from 'constructs';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import { IFunction } from 'aws-cdk-lib/aws-lambda';

export interface EventBridgeProps {
	startCronOptions:events.CronOptions;
	stopCronOptions:events.CronOptions;
	startFunction:IFunction;
	stopFunction:IFunction;
}

export class EventBridge extends Construct {
	public startRule:events.IRule;
	public stopRule:events.IRule;

	constructor(scope: Construct, id: string, props?: EventBridgeProps) {
		super(scope, id);

		const startfunc = props?.startFunction;
		const stopfunc = props?.stopFunction;
		const startCronOptions = props?.startCronOptions;
		const stopCronOptions = props?.stopCronOptions;

		if (startfunc && startCronOptions) {
			this.startRule = new events.Rule(this, "EC2StartEevnt", {
				schedule: events.Schedule.cron(startCronOptions),
				targets: [new targets.LambdaFunction(startfunc, { retryAttempts: 3 })]
			});
		}
		if (stopfunc && stopCronOptions) {
			this.stopRule = new events.Rule(this, "EC2StopEvent", {
				schedule: events.Schedule.cron(stopCronOptions),
				targets: [new targets.LambdaFunction(stopfunc, { retryAttempts: 3 })]
			});
		}
	}
}
