import * as actions from '../../../actions/networkAction';

describe('Network Actions', () => {
	it('should connecting AP', () => {
		const expected = {
			type: 'CONNECTING_AP',
			payload: 'Test'
		};
		const testString = 'Test';
		expect(actions.connectingAp(testString)).to.deep.equal(expected);
	});

	it('should release AP', () => {
		const expected = {
			type: 'RELEASE_CONNECTING_AP',
			payload: null
		};
		expect(actions.releaseAp()).to.deep.equal(expected);
	});

	it('should connect wifi', () => {
		const expected = {
			type: 'CONNECT_WIFI',
			network: 'Test'
		};
		const testObject = {network: 'Test'};
		expect(actions.connectWifi(testObject)).to.deep.equal(expected);
	});

	it('should parse error', () => {
		const expected = {
			type: 'PARSE_NETWORK_ERROR',
			payload: 'Test'
		};
		const testString = 'Test';
		expect(actions.parseError(testString)).to.deep.equal(expected);
	});

	it('should clear error status', () => {
		const expected = {
			type: 'CLEAR_NETWORK_ERROR',
			payload: {}
		};
		expect(actions.clearErrorStatus()).to.deep.equal(expected);
	});
});
