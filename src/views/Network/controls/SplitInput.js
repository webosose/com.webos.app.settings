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

import PropTypes from "prop-types";
import React from "react";

import Input from "@enact/moonstone/Input";
import Item from "@enact/moonstone/Item";

import css from "./SplitInput.less";

class SplitInput extends React.Component {
	render() {
		return (({ label, ...rest }) => {
			return (
				<div role="region" aria-label={label} className={css.splitInput}>
					<Item spotlightDisabled marqueeOn={"render"} className={css.label}>
						{label}
					</Item>
					<Input className={css.input} {...rest} />
				</div>
			);
		})(this.props);
	}
}

SplitInput.propTypes = {
	label: PropTypes.string.isRequired,
	...Input.propTypes
};

export default SplitInput;
