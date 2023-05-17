import moment from "moment";

export const timelineMap = {
	0: "1 month",
	10: "15 day",
	20: "7 day",
	30: "3 day",
	40: "1 day",
	50: "12 hour",
	60: "6 hour",
	70: "1 hour",
	80: "30 minute",
	90: "5 minute",
	100: "1 second",
};

export function getTimeLabel(val, date) {
  let _d = moment(new Date(val * 1));
  switch (date) {
    case "1 second":
    case "5 minute":
      return _d.format("HH:mm:ss");
    case "30 minute":
    case "1 hour":
      return _d.format("HH:mm");
    case "6 hour":
    case "12 hour":
    case "1 day":
      return _d.format("MM-DD HH:mm");
    case "3 day":
    case "7 day":
    case "15 day":
    case "1 month":
      return _d.format("MM-DD");
    default:
      return _d.format("MM-DD HH:mm");
  }
}

export function getTimeline(date) {
  switch (date) {
    case "1 second":
    case "5 minute":
      return "toStartOfInterval(toDateTime(resTime/1000),interval 1 second)";
    case "30 minute":
    case "1 hour":
      return "toStartOfInterval(toDateTime(resTime/1000),interval 1 minute)";
    case "6 hour":
    case "12 hour":
    case "1 day":
      return "toStartOfInterval(toDateTime(resTime/1000),interval 1 hour)";
    case "3 day":
    case "7 day":
    case "15 day":
    case "1 month":
      return "toStartOfInterval(toDateTime(resTime/1000),interval 1 day)";
    default:
      return "toStartOfInterval(toDateTime(resTime/1000),interval 1 second)";
  }
}

export function getTimelineDateTime(type) {
	return getTimelineDate(type).getTime();
}

export function getTimelineDate(type) {
  switch (type) {
    case "1 second":
			return new Date(new Date().getTime()-1*1000);
    case "5 minute":
			return new Date(new Date().getTime()-1*1000*60*5);
    case "30 minute":
			return new Date(new Date().getTime()-1*1000*60*30);
    case "1 hour":
			return new Date(new Date().getTime()-1*1000*60*60);
    case "6 hour":
			return new Date(new Date().getTime()-1*1000*60*60*6);
    case "12 hour":
			return new Date(new Date().getTime()-1*1000*60*60*12);
    case "1 day":
			return new Date(new Date().getTime()-1*1000*60*60*24);
    case "3 day":
			return new Date(new Date().getTime()-1*1000*60*60*24*3);
    case "7 day":
			return new Date(new Date().getTime()-1*1000*60*60*24*7);
    case "15 day":
			return new Date(new Date().getTime()-1*1000*60*60*24*15);
    case "1 month":
			return new Date(new Date().getTime()-1*1000*60*60*24*30);
    default:
			return new Date(new Date().getTime()-1*1000);
  }
}

export function getTimelineDefaultStart(type) {
  switch (type) {
    case "1 second":
    case "5 minute":
    case "30 minute":
    case "1 hour":
			return new Date(new Date().getTime()-1*1000);
    case "6 hour":
    case "12 hour":
    case "1 day":
			return new Date(new Date().getTime()-1*1000*60);
    case "3 day":
    case "7 day":
    case "15 day":
    case "1 month":
			return new Date(new Date().getTime()-1*1000*60*60);
    default:
			return new Date(new Date().getTime()-1*1000);
  }
}
export function getTimeUnit(date) {
  switch (date) {
    case "1 second":
    case "5 minute":
      return "sec";
    case "30 minute":
    case "1 hour":
      return "min";
    case "6 hour":
    case "12 hour":
    case "1 day":
      return "hour";
    case "3 day":
    case "7 day":
    case "15 day":
    case "1 month":
      return "day";
    default:
      return "sec";
  }
}

export function getSteamTimeline(date) {
  switch (date) {
    case "1 second":
    case "5 minute":
    case "30 minute":
    case "1 hour":
      return "toStartOfInterval(toDateTime(resTime/1000),interval 1 second)";
    case "6 hour":
    case "12 hour":
    case "1 day":
      return "toStartOfInterval(toDateTime(resTime/1000),interval 1 minute)";
    case "3 day":
    case "7 day":
    case "15 day":
    case "1 month":
      return "toStartOfInterval(toDateTime(resTime/1000),interval 1 hour)";
    default:
      return "toStartOfInterval(toDateTime(resTime/1000),interval 1 second)";
  }
}