import isNumeric from '../../../utils/isNumeric';
import {isArray} from '../../../utils/isNumeric';
import $L from '@enact/i18n/$L';

export const regExps = {
	ipv4: new RegExp('^([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$'),
	subnetMask: new RegExp('^(((128|192|224|240|248|252|254)\\.0\\.0\\.0)|(255\\.(0|128|192|224|240|248|252|254)\\.0\\.0)|(255\\.255\\.(0|128|192|224|240|248|252|254)\\.0)|(255\\.255\\.255\\.(0|128|192|224|240|248|252|254|255)))$'),
	ipv6: new RegExp('^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|::(ffff(:0{1,4}){0,1}:){0,1}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))$'),
	subnetPrefixLength: new RegExp('^([1-9]|[1-9][0-9]|1[0-1][0-9]|12[0-7])$')
};

export function getDNSs (info, mode) {
	let i, dns, dnss = [];
	const reg = regExps[mode];
	const maxCount = 16;
	if (reg) {
		for (i = 1; i <= maxCount; i++) {
			dns = info['dns' + i];
			if (reg.test(dns) === true) {
				dnss.push(dns);
			}
		}
	}

	return dnss;
}
export function getConnectionStatus (info) {
	let status = 'NOT_CONNECTED';
	if (info && info.state === 'connected') {
		status = (info.onInternet === 'yes' ? 'ON_INTERNET' : 'CONNECTED');
	}
	return status;
}

export function getIpInformation (info, mode, supportIPv6) {
	let dnss = [];
	const ipInformation = {ipv6: false, method: '', ipAddress: '', subnet: '', gateway: '', dns: ''};

	if (!info) {
		return ipInformation;
	}

	if ((mode !== 'ipv4') && (mode !== 'ipv6')) {
		mode = (supportIPv6 && (info.ipv6)) ? 'ipv6' : 'ipv4';
	}

	if (mode === 'ipv6') {
		ipInformation.ipv6 = true;
		if (info.ipv6) {
			ipInformation.method = info.ipv6.method;
			ipInformation.ipAddress = info.ipv6.ipAddress;	// e.g. 'fd89:ae1e:9544:1:d82a:7c1d:f69b:4300'
			ipInformation.subnet = info.ipv6.prefixLength;
			ipInformation.gateway = info.ipv6.gateway;

			if (isNumeric(ipInformation.subnet)) {
				ipInformation.subnet = ipInformation.subnet.toString();
			}
		}
	} else		/*	if(mode == "ipv4")*/ {
		ipInformation.ipv6 = false;
		ipInformation.method = info.method;
		ipInformation.ipAddress = info.ipAddress;
		ipInformation.subnet = info.netmask;
		ipInformation.gateway = info.gateway;
	}

	// find dns address
	ipInformation.dns = '';
	dnss = getDNSs(info, mode);
	if (dnss.length > 0) {
		ipInformation.dns = dnss[0];
	}

	if (ipInformation.method === 'auto')	{
		ipInformation.method = 'dhcp';	// ipv4 : 'dhcp' or 'manual', ipv6 : 'auto' or 'manual'
	}

	return ipInformation;
}

const parseNetworkInfo = (inNetworkInfo) => {
	const network = {
		displayName: inNetworkInfo.displayName,
		ssid: inNetworkInfo.ssid,
		bssInfo: inNetworkInfo.bssInfo || {},
		strength: inNetworkInfo.signalBars,
		status: 'NOT_CONNECTED',
		secure: false,
		securityType: 'none'
	};
	if (toString.call(inNetworkInfo.connectState) === '[object String]') {
		if (inNetworkInfo.connectState === 'ipConfigured') {
			network.status = 'CONNECTED';
		} else if (inNetworkInfo.connectState === 'associating' || inNetworkInfo.connectState === 'associated') {
			network.status = 'CONNECTING';
		}
	}
	if (isArray(inNetworkInfo.availableSecurityTypes) && inNetworkInfo.availableSecurityTypes.length > 0 && inNetworkInfo.availableSecurityTypes[0] !== 'none') {
		network.secure = true;
		network.securityType = inNetworkInfo.availableSecurityTypes[0];
	}

	if (inNetworkInfo.profileId) {
		network.profileId = inNetworkInfo.profileId;
	}

	return network;
};

export function makeNetworkListArray (wifiNetworks) {
	const newNetworkList = [];
	if (wifiNetworks) {
		let network = {};
		let connectingConnectedNetwork = null;
		for (let net of wifiNetworks.foundNetworks) {
			let netInfo = net.networkInfo;
			if (!netInfo.supported) {
				continue;
			}
			network = parseNetworkInfo(netInfo);
			if (connectingConnectedNetwork === null && network.status !== 'NOT_CONNECTED') {
				connectingConnectedNetwork = network;
			} else {
				if (typeof network.profileId !== 'undefined') {		// eslint-disable-line
					newNetworkList.unshift(network);
				} else {
					newNetworkList.push(network);
				}
			}
		}
		if (connectingConnectedNetwork !== null) {
			newNetworkList.unshift(connectingConnectedNetwork);
		}
	}
	return newNetworkList;
}

const NetworkError = {
	UNKNOWN_ERROR: 1,
	WIFI_TECHNOLOGY_UNAVAILABLE:5,
	PASSWORD_ERROR: 10,
	AUTHENTICATION_FAILURE:11,
	LOGIN_FAILURE:12,
	CONNECTION_ESTABLISHMENT_FAILURE:13,
	INVALID_IP_ADDRESS:14,
	PINCODE_ERROR:15,
	OUT_OF_RAGE:16,
	NETWORK_NOT_FOUND:102
};

export function findMsgByErrorCode (errorCode) {
	let msg = '';
	let errorMsg = [];
	switch (errorCode) {
		case NetworkError.UNKNOWN_ERROR:
			msg = $L('Could not indentify the reason for failure.'); // i18n : New exception message of unknown error
			break;
		case NetworkError.PASSWORD_ERROR:
			msg = $L('Reason: Entered password is incorrect.'); // i18n : New exception message when the supplied password is incorrect
			break;
		case NetworkError.AUTHENTICATION_FAILURE:
			msg = $L('Reason: Authentication with access point failed.'); // i18n : New exception message of authentication failure
			break;
		case NetworkError.LOGIN_FAILURE:
			msg = $L('Reason: Unable to login.'); // i18n : New exception message of login failure
			break;
		case NetworkError.CONNECTION_ESTABLISHMENT_FAILURE:
			msg = $L('Reason: Could not establish a connection to access point.'); // i18n : New exception message of no internet connection
			break;
		case NetworkError.INVALID_IP_ADDRESS:
			msg = $L('Reason: Could not retrieve a valid IP address by using DHCP.'); // i18n : DHCP means dynamic host configuration protocol
			break;
		case NetworkError.PINCODE_ERROR:
			msg = $L('Reason: PIN is missing.'); // i18n : New exception message of wrong PIN code
			break;
		case NetworkError.OUT_OF_RAGE:
			msg = $L('Reason: The network you selected is out of range.'); // i18n : New exception message of network out of range
			break;
		case NetworkError.NETWORK_NOT_FOUND: // Error message: 'Network not found'
			msg = $L('Could not fined available network.'); // i18n : New exception message of network out of range
			break;
		case NetworkError.WIFI_TECHNOLOGY_UNAVAILABLE: // 'WiFi technology unavailable'
			msg = $L('Wi-Fi error occurred.'); // i18n : New exception message of network out of range
			break;
		default:
			msg = $L('Please check the network name and password and try again.');
			break;
	}
	errorMsg.push($L('Unable to connect to the network.'), msg, ($L('Please check the status and try again')));
	return errorMsg;
}
