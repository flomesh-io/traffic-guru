export function getPercentage(current, status) {
  let per = status.running + status.succeeded + status.failed;
  return per == 0 ? 0 : Math.round((current * 100) / per);
}
