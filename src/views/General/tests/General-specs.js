import * as actions from '../../../actions/generalAction';

describe('General Actions', () => {
	it('should receive an action to get webOS version', () => {
		const expected = {
			coreOSRelease: 1
		};
		expect(actions.receiveWebOsVersion({
			'core_os_release': 1
		})).to.deep.equal(expected);
	});
});
