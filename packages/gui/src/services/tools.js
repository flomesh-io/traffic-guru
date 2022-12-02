import moment from "moment";

export const DefaultChartDate = {
  startTime: moment(
    new Date(new Date().setMonth(new Date().getMonth() - 3)),
  ).format("YYYY-MM-DD HH:mm:ss"),
  endTime: moment(new Date(), "YYYY-MM-DD HH:mm:ss").format(
    "YYYY-MM-DD HH:mm:ss",
  ),
};