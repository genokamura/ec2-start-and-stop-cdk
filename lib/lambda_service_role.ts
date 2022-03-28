import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export class LambdaServiceRole extends Construct {
	public readonly role:iam.IRole;

	constructor(scope: Construct, id: string) {
		super(scope, id);

		const allowLogAccessStatement = new iam.PolicyStatement({
					effect: iam.Effect.ALLOW,
					actions: [
						'logs:CreateLogGroup',
						'logs:CreateLogStream',
						'logs:PutLogEvents'
					],
					resources: [
						'arn:aws:logs:*:*:*'
					]
		});

		const allowEC2StartAndStopStatement = new iam.PolicyStatement({
					effect: iam.Effect.ALLOW,
					actions: [
						'ec2:Start*',
						'ec2:Stop*'
					],
					resources: [
						'*'
					]
		});

		const policy = new iam.PolicyDocument({
			statements: [
				allowLogAccessStatement,
				allowEC2StartAndStopStatement
			]
		});

		this.role = new iam.Role(this, 'EC2StartAndStopAutomationSeviceRole', {
			description: 'Grant access permissions to execute EC2 server start and stop lambda functions.',
			assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
			inlinePolicies: { policy }
		});
	}
}
