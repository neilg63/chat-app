var isRealString = () => {
	return typeof str === 'string' && str.trim() > 0;
}

module.exports = {isRealString};