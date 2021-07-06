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

import PropTypes from 'prop-types';
// import React from "react";

import kind from '@enact/core/kind';
import Marquee from '@enact/moonstone/Marquee';

import css from './SplitItem.less';

const SpilitItem = kind({
	name: 'SpilitItem',

	propTypes: {
		children: PropTypes.string.isRequired,
		label: PropTypes.string.isRequired
	},

	render: ({label, children}) => (
		<div className={css.splitItem}>
			<Marquee className={css.label}>{label}</Marquee>
			<Marquee className={css.content}>{children}</Marquee>
		</div>
	)

});

export default SpilitItem;
