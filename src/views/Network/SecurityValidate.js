class SecurityValidate {
	static isValidSSID (ssid) {
		return (typeof ssid === 'string' && (1 <= ssid.length) && (ssid.length <= 32));
	}

	static isValidPasskey (type, key) {
		let asciiPattern = new RegExp('^[\x00-\x7F]*$'),
			hexPattern = new RegExp('^[A-Fa-f0-9]*$'),
			pass = false;

		if ('wep' === type) {
			switch (key.length) {
				case 5:		// 40-bit ASCII
				case 13:	// 104-bit ASCII
					if (asciiPattern.test(key)) {
						pass = true;
					}
					break;
				case 10:	// 40-bit HEX
				case 26:	// 104-bit HEX
					if (hexPattern.test(key)) {
						pass = true;
					}
					break;
				default:
					break;
			}
		} else if ('wpa-personal' === type || 'psk' === type) {
			if (8 <= key.length && 63 >= key.length) {
				pass = true;
			} else if (64 === key.length && hexPattern.test(key)) {
				pass = true;
			}
		} else if ('wapi-psk' === type) {
			if ((hexPattern.test(key) && 0 < key.length && !(key.length % 2)) ||
				(8 <= key.length && 63 >= key.length)) {
				pass = true;
			}
		} else if ('none' === type)	{
			pass = true;
		}
		return pass;
	}
}

export default SecurityValidate;
