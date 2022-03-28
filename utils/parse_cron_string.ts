import * as events from "aws-cdk-lib/aws-events";

export const parse_cron_string = (param: string): events.CronOptions => {
	const cronParams = param.split(" ");

	const parsed: events.CronOptions = {
		minute: cronParams[0],
		hour: cronParams[1],
		day: cronParams[2],
		month: cronParams[3],
		weekDay: cronParams[4],
		year: cronParams[5],
	};

	if (parsed.day === "?") {
		return {
			minute: parsed.minute,
			hour: parsed.hour,
			month: parsed.month,
			weekDay: parsed.weekDay,
			year: parsed.year
		}
	} else if (parsed.weekDay === "?") {
		return {
			minute: parsed.minute,
			hour: parsed.hour,
			day: parsed.day,
			month: parsed.month,
			year: parsed.year
		}
	} else {
		throw new Error('Can not supply both \'day\' and \'weekDay\', use at most one');
	}
}
