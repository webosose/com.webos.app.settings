// Copyright (c) 2016-2018 LG Electronics, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// SPDX-License-Identifier: Apache-2.0

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
