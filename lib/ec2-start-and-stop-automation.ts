import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as events from 'aws-cdk-lib/aws-events';
import { LambdaServiceRole } from './lambda_service_role';
import { EC2 } from 'aws-sdk';
import { EventBridge } from './ec2-start-and-stop-event-bridge';
import { CronOptions } from 'aws-cdk-lib/aws-events';

export interface EC2StartAndStopAutomationProps {
	tagKey: string,
	systemName: string,
	instanceUsage: string,
	envType: string,
	startCronOptions: events.CronOptions,
	stopCronOptions: events.CronOptions,
	targetInstanceId: string,
}

export class EC2StartAndStopAutomation extends Construct {
	constructor(scope: Construct, id: string, props: EC2StartAndStopAutomationProps) {
		super(scope, id);

		const ec2 = new EC2();

		let instanceIds: string[] = [];

		const tagKey = props.tagKey;
		const tagValue = `${props.systemName}-${props.envType}-${props.instanceUsage}-instance`;

		if (props.targetInstanceId !== 'NONE') {
			instanceIds.push(props.targetInstanceId);
			this.buildResources(instanceIds, props.startCronOptions, props.stopCronOptions);
		} else {
			const describeInstanceParams = {
				Filters: [
					{
						Name: "tag:" + props.tagKey,
						Values: [
							tagValue
						]
					}
				]
			};

			ec2.describeInstances(describeInstanceParams).promise().then(async (data) => {
				data.Reservations?.map(reservation => reservation.Instances)?.forEach(instanceList => instanceList?.forEach(instance => {
					if (instance.InstanceId && !instanceIds.includes(instance.InstanceId)) {
						instanceIds.push(instance.InstanceId);
					}
				}));
				this.buildResources(instanceIds, props.startCronOptions, props.stopCronOptions);
			}).catch((err) => console.log(err, err.stack));
		}
	}

	private buildResources = (instanceIds: string[], startCronOptions: CronOptions, stopCronOptions: CronOptions) => {
		// define Lambda Execution IAM Role
		const serviceRole = new LambdaServiceRole(this, 'EC2StartAndStopLambdaServiceRole');

		// define EC2 Start Lambda function
		const startfunc = new lambda.Function(this, 'EC2StartHandler', {
			runtime: lambda.Runtime.NODEJS_14_X,
			code: lambda.Code.fromAsset('lambda'),
			handler: 'start_server.handler',
			environment: {
				INSTANCE_IDS: instanceIds.join(","),
			},
			role: serviceRole.role
		});

		// difine EC2 Stop Lambda function
		const stopfunc = new lambda.Function(this, 'EC2StopHandler', {
			runtime: lambda.Runtime.NODEJS_14_X,
			code: lambda.Code.fromAsset('lambda'),
			handler: 'stop_server.handler',
			environment: {
				INSTANCE_IDS: instanceIds.join(","),
			},
			role: serviceRole.role
		});

		const events = new EventBridge(this, "EC2StartAndStopEvents", {
			startFunction: startfunc,
			stopFunction: stopfunc,
			startCronOptions: startCronOptions,
			stopCronOptions: stopCronOptions
		});
	}
}
