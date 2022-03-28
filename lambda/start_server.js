const { EC2 } = require('aws-sdk');

exports.handler = async function(event) {
	console.log("request: ", JSON.stringify(event, undefined, 2));
	const ec2 = new EC2();

	// TODO instance status check

	const resp = await ec2.startInstances({
		InstanceIds: process.env.INSTANCE_IDS.split(",")
	}).promise();

	console.log('started instances: ' + process.env.INSTANCE_IDS);
}
