export function isArray (val) {
	return Array.isArray(val) || (toString.call(val) === '[object Array]');
}

function isNumeric (val) {
	return !isArray(val) && (val - parseFloat(val) + 1) >= 0;
}

export default isNumeric;
