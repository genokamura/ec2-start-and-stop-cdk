import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { parse_cron_string } from '../utils/parse_cron_string';
import { EC2StartAndStopAutomation } from './ec2-start-and-stop-automation';

export class EC2StartAndStopAutomationStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    /**
     * Contextとして対象となるインスタンスを特定するtagをパラメータとして渡す
     * $ cdk deploy -c tagKey=XXXXX -c systemName=yyyyyy -c envType=zzzzz
     */
    const tagKey = this.node.tryGetContext('tagKey');
    const systemName = this.node.tryGetContext('systemName');
    const instanceUsage = this.node.tryGetContext('instanceUsage');
    const envType = this.node.tryGetContext('envType');
    const startCronOptions = parse_cron_string(this.node.tryGetContext('startCronOptions'));
    const stopCronOptions = parse_cron_string(this.node.tryGetContext('stopCronOptions'));
    const targetInstanceId = this.node.tryGetContext('targetInstanceId');

    const ec2startstopautomation = new EC2StartAndStopAutomation(this, "EC2StartAndStopAutomation", {
      tagKey,
      systemName,
      instanceUsage,
      envType,
      startCronOptions,
      stopCronOptions: stopCronOptions,
      targetInstanceId,
    });
  }
}
