export function getPercentage(current, status) {
  let per = status.running + status.succeeded + status.failed;
  return per == 0 ? 0 : Math.round((current * 100) / per);
}

export function getBitUnit(max){
	if(max>(1024 * 1024 * 1024)){
		return "GB";
	} else if(max>(1024 * 1024)){
		return "MB";
	} else if(max>1024){
		return "KB";
	} else {
		return "B";
	}
}

export function getBitValue(max, value){
	if(max>(1024 * 1024 * 1024)){
		return value/(1024 * 1024 * 1024);
	} else if(max>(1024 * 1024)){
		return value/(1024 * 1024);
	} else if(max>1024){
		return value/1024;
	} else {
		return value*1;
	}
}