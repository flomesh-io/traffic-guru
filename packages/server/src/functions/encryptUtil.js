const salting = 'maSiaVawoW='
const salting2 = 'Aq'
function encryptCore(text){
	const encode = new Buffer.from(text).toString('base64');
	const encode2 = new Buffer.from((new Buffer.from(salting).toString('base64')+salting2+encode)).toString('base64');
	return encode2;
}
function encrypt(text){
	return encryptCore(encryptCore(text));
}
function decryptCore(code){
	const decode = Buffer.from(Buffer.from(code, 'base64').toString().replace(new Buffer.from(salting).toString('base64')+salting2,''), 'base64').toString()

	return decode
}
function decrypt(code){
	return decryptCore(decryptCore(code))
}
module.exports = {
  encrypt,
  decrypt
};
