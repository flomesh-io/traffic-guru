const salting = 'maSiaVawoW='
const salting2 = 'Aq'
function encryptCore(text){
	const encode = btoa(text);
	const encode2 = btoa(btoa(salting)+salting2+encode);
	return encode2;
}
function encrypt(text){
	return encryptCore(encryptCore(text));
}
function decryptCore(code){
	const decode = atob(atob(code).replace(btoa(salting)+salting2,''))
	return decode
}
function decrypt(code){
	return decryptCore(decryptCore(code))
}
module.exports = {
  encrypt,
  decrypt
};
