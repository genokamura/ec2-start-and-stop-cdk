# EC2自動起動＆終了

## 機能

- 1つインスタンスIDを指定してcron式に則って自動開始・終了のLambda関数をデプロイする

- （開発中）以下の形式でタグを付与したEC2インスタンスを指定してcron式に則って自動開始・終了のLambda関数をデプロイする

## 事前準備

### ツールの準備

- [AWS CLI](https://aws.amazon.com/jp/cli/)、および[AWS CDK](https://aws.amazon.com/jp/cdk/)をインストールする。(npm等も含む)

### インスタンスIDを指定する場合

- 自動起動・開始したいEC2インスタンスのIDを特定し、インスタンスIDを控える。

### タグを指定する場合

- 自動起動・開始したいEC2インスタンスに、以下の形式でタグを付与する

  - Key : `EC2-start-stop`
  - Value : `{systemName}-{envType}-{instanceUsage}-instance`

## 実行方法

```(bash)
# clone
$ git clone git@github.com:genokamura/ec2-start-and-stop-cdk.git

# bootstrap実行前の場合
$ cdk bootstrap

# deploy (インスタンスIDを指定する場合)
$ cdk deploy -c startCronOptions={開始スケジュールを指定するCron式} -c stopCronOptions={終了時間を指定するCron式} -c targetInstanceId={インスタンスID}

# deploy (インスタンスのタグを指定する場合)
$ cdk deploy -c systemName={systemName} -c instanceUsage={instanceUsage} -c envType={envType} -c startCronOptions={開始スケジュールを指定するCron式} -c stopCronOptions={終了時間を指定するCron式}
```

## 参考資料

- [Cron式](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/events/ScheduledEvents.html)
