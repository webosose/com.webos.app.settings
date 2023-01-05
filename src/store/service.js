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

export const EndPoints = {
	/* System services */
	systemService: 'luna://com.palm.systemservice',
	systemTime: 'luna://com.palm.systemservice/time',
	osInfo: 'luna://com.palm.systemservice/osInfo',

	settingService: 'luna://com.webos.settingsservice',
	appManager: 'luna://com.webos.applicationManager/',
	connectionManager: 'luna://com.webos.service.connectionmanager',
	notification: 'luna://com.webos.notification/',
	update: 'luna://com.webos.service.update',
	wifi: 'luna://com.palm.wifi',
	weboswifi:'luna://com.webos.service.wifi',
	wifiConnectionManager: 'palm://com.palm.connectionmanager'
};
