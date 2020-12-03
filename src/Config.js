/**********
 * Config *
 **********/

CM.SaveConfig = function(config) {
	localStorage.setItem(CM.ConfigPrefix, JSON.stringify(config));
}

CM.LoadConfig = function() {
	if (localStorage.getItem(CM.ConfigPrefix) != null) {
		CM.Config = JSON.parse(localStorage.getItem(CM.ConfigPrefix));

		// Check values
		var mod = false;
		for (var i in CM.ConfigDefault) {
			if (typeof CM.Config[i] === 'undefined') {
				mod = true;
				CM.Config[i] = CM.ConfigDefault[i];
			}
			else if (i != 'StatsPref' && i != 'Colors') {
				if (i.indexOf('SoundURL') == -1) {
					if (!(CM.Config[i] > -1 && CM.Config[i] < CM.ConfigData[i].label.length)) {
						mod = true;
						CM.Config[i] = CM.ConfigDefault[i];
					}
				}
				else {  // Sound URLs
					if (typeof CM.Config[i] != 'string') {
						mod = true;
						CM.Config[i] = CM.ConfigDefault[i];
					}
				}
			}
			else if (i == 'StatsPref') {
				for (var j in CM.ConfigDefault.StatsPref) {
					if (typeof CM.Config[i][j] === 'undefined' || !(CM.Config[i][j] > -1 && CM.Config[i][j] < 2)) {
						mod = true;
						CM.Config[i][j] = CM.ConfigDefault[i][j];
					}
				}
			}
			else { // Colors
				for (var j in CM.ConfigDefault.Colors) {
					if (typeof CM.Config[i][j] === 'undefined' || typeof CM.Config[i][j] != 'string') {
						mod = true;
						CM.Config[i][j] = CM.ConfigDefault[i][j];
					}
				}
			}
		}
		if (mod) CM.SaveConfig(CM.Config);
		CM.Loop(); // Do loop once
		for (var i in CM.ConfigDefault) {
			if (i != 'StatsPref' && i != 'MenuPref' && typeof CM.ConfigData[i].func !== 'undefined') {
				CM.ConfigData[i].func();
			}
		}
	}
	else { // Default values
		CM.RestoreDefault();
	}
}

CM.RestoreDefault = function() {
	CM.Config = {};
	CM.SaveConfig(CM.ConfigDefault);
	CM.LoadConfig();
	Game.UpdateMenu();
}

CM.ToggleConfig = function(config) {
	CM.ToggleConfigUp(config);
	if (CM.ConfigData[config].toggle) {
		if (CM.Config[config] == 0) {
			l(CM.ConfigPrefix + config).className = 'option off';
		}
		else {
			l(CM.ConfigPrefix + config).className = 'option';
		}
	}
}

CM.ToggleConfigUp = function(config) {
	CM.Config[config]++;
	if (CM.Config[config] == CM.ConfigData[config].label.length) {
		CM.Config[config] = 0;
	}
	if (typeof CM.ConfigData[config].func !== 'undefined') {
		CM.ConfigData[config].func();
	}
	l(CM.ConfigPrefix + config).innerHTML = CM.Disp.GetConfigDisplay(config);
	CM.SaveConfig(CM.Config);
}

CM.ToggleConfigDown = function(config) {
	CM.Config[config]--;
	if (CM.Config[config] < 0) {
		CM.Config[config] = CM.ConfigData[config].label.length - 1;
	}
	if (typeof CM.ConfigData[config].func !== 'undefined') {
		CM.ConfigData[config].func();
	}
	l(CM.ConfigPrefix + config).innerHTML = CM.Disp.GetConfigDisplay(config);
	CM.SaveConfig(CM.Config);
}

CM.ToggleStatsConfig = function(config) {
	if (CM.Config.StatsPref[config] == 0) {
		CM.Config.StatsPref[config]++;
	}
	else {
		CM.Config.StatsPref[config]--;
	}
	CM.SaveConfig(CM.Config);
}

CM.ToggleMenuConfig = function(config) {
	if (CM.Config.MenuPref[config] == 0) {
		CM.Config.MenuPref[config]++;
	}
	else {
		CM.Config.MenuPref[config]--;
	}
	CM.SaveConfig(CM.Config);
}

// Checks if the browsers has permissions to produce notifications
// Should be triggered when Config related to Notifications is toggled on
CM.CheckNotificationPermissions = function(ToggleOnOff) {
	if (ToggleOnOff == 1)	{
		// Check if browser support Promise version of Notification Permissions
		function checkNotificationPromise() {
			try {
				Notification.requestPermission().then();
			} catch(e) {
				return false;
			}
			return true;
		}

		// Check if the browser supports notifications and which type
		if (!('Notification' in window)) {
			console.log("This browser does not support notifications.");
		} 
		else {
			if(checkNotificationPromise()) {
				Notification.requestPermission().then();
			} 
			else {
				Notification.requestPermission();
			}
		}
	}
}

CM.ConfigData.BotBar = {label: ['Bottom Bar OFF', 'Bottom Bar ON'], desc: 'Building Information', toggle: true, func: function() {CM.Disp.ToggleBotBar();}};
CM.ConfigData.TimerBar = {label: ['Timer Bar OFF', 'Timer Bar ON'], desc: 'Timers of Golden Cookie, Season Popup, Frenzy (Normal, Clot, Elder), Click Frenzy', toggle: true, func: function() {CM.Disp.ToggleTimerBar();}};
CM.ConfigData.TimerBarPos = {label: ['Timer Bar Position (Top Left)', 'Timer Bar Position (Bottom)'], desc: 'Placement of the Timer Bar', toggle: false, func: function() {CM.Disp.ToggleTimerBarPos();}};
CM.ConfigData.BuildColor = {label: ['Building Colors OFF', 'Building Colors ON'], desc: 'Color code buildings', toggle: true, func: function() {CM.Disp.UpdateBuildings();}};
CM.ConfigData.BulkBuildColor = {label: ['Bulk Building Colors (Single Building Color)', 'Bulk Building Colors (Calculated Bulk Color)'], desc: 'Color code bulk buildings based on single buildings color or calculated bulk value color', toggle: false, func: function() {CM.Disp.UpdateBuildings();}};
CM.ConfigData.ColorPPBulkMode = {label: ['Color of PP (Compared to Single)', 'Color of PP (Compared to Bulk)'], desc: 'Color PP-values based on comparison with single purchase or with selected bulk-buy mode', toggle: false};
CM.ConfigData.UpBarColor = {label: ['Upgrade Colors/Bar OFF', 'Upgrade Colors with Bar ON', 'Upgrade Colors without Bar ON'], desc: 'Color code upgrades and optionally add a counter bar', toggle: false, func: function() {CM.Disp.ToggleUpgradeBarAndColor();}};
CM.ConfigData.Colors = {
	desc: {
		Blue: 'Color Blue.  Used to show better than best PP building, for Click Frenzy bar, and for various labels', 
		Green: 'Color Green.  Used to show best PP building, for Blood Frenzy bar, and for various labels', 
		Yellow: 'Color Yellow.  Used to show between best and worst PP buildings closer to best, for Frenzy bar, and for various labels', 
		Orange: 'Color Orange.  Used to show between best and worst PP buildings closer to worst, for Next Reindeer bar, and for various labels', 
		Red: 'Color Red.  Used to show worst PP building, for Clot bar, and for various labels', 
		Purple: 'Color Purple.  Used to show worse than worst PP building, for Next Cookie bar, and for various labels', 
		Gray: 'Color Gray.  Used to show negative or infinity PP, and for Next Cookie/Next Reindeer bar', 
		Pink: 'Color Pink.  Used for Dragonflight bar', 
		Brown: 'Color Brown.  Used for Dragon Harvest bar'
	}, 
	func: function() {CM.Disp.UpdateColors();}
};
CM.ConfigData.UpgradeBarFixedPos = {label: ['Upgrade Bar Fixed Position OFF', 'Upgrade Bar Fixed Position ON'], desc: 'Lock the upgrade bar at top of the screen to prevent it from moving ofscreen when scrolling', toggle: true, func: function() {CM.Disp.ToggleUpgradeBarFixedPos();}};
CM.ConfigData.CalcWrink = {label: ['Calculate with Wrinklers OFF', 'Calculate with Wrinklers ON'], desc: 'Calculate times and average Cookies Per Second with Wrinklers', toggle: true};
CM.ConfigData.CPSMode = {label: ['Current Cookies Per Second', 'Average Cookies Per Second'], desc: 'Calculate times using current Cookies Per Second or average Cookies Per Second', toggle: false};
CM.ConfigData.AvgCPSHist = {label: ['Average CPS for past 10s', 'Average CPS for past 15s', 'Average CPS for past 30s', 'Average CPS for past 1m', 'Average CPS for past 5m', 'Average CPS for past 10m', 'Average CPS for past 15m', 'Average CPS for past 30m'], desc: 'How much time average Cookies Per Second should consider', toggle: false};
CM.ConfigData.AvgClicksHist = {label: ['Average Cookie Clicks for past 1s', 'Average Cookie Clicks for past 5s', 'Average Cookie Clicks for past 10s', 'Average Cookie Clicks for past 15s', 'Average Cookie Clicks for past 30s'], desc: 'How much time average Cookie Clicks should consider', toggle: false};
CM.ConfigData.ToolWarnBon = {label: ['Calculate Tooltip Warning With Bonus CPS OFF', 'Calculate Tooltip Warning With Bonus CPS ON'], desc: 'Calculate the warning with or without the bonus CPS you get from buying', toggle: true};
CM.ConfigData.GCNotification = {label: ['Golden Cookie Notification OFF', 'Golden Cookie Notification ON'], desc: 'Create a notification when Golden Cookie spawns', toggle: true, func: function () {CM.CheckNotificationPermissions(CM.Config.GCNotification);}};
CM.ConfigData.GCFlash = {label: ['Golden Cookie Flash OFF', 'Golden Cookie Flash ON'], desc: 'Flash screen on Golden Cookie', toggle: true};
CM.ConfigData.GCSound = {label: ['Golden Cookie Sound OFF', 'Golden Cookie Sound ON'], desc: 'Play a sound on Golden Cookie', toggle: true};
CM.ConfigData.GCVolume = {label: [], desc: 'Volume of the Golden Cookie sound'};
for (var i = 0; i < 101; i++) {
	CM.ConfigData.GCVolume.label[i] = i + '%';
}
CM.ConfigData.GCSoundURL = {label: 'Golden Cookie Sound URL:', desc: 'URL of the sound to be played when a Golden Cookie spawns'};
CM.ConfigData.GCTimer = {label: ['Golden Cookie Timer OFF', 'Golden Cookie Timer ON'], desc: 'A timer on the Golden Cookie when it has been spawned', toggle: true, func: function() {CM.Disp.ToggleGCTimer();}};
CM.ConfigData.Favicon = {label: ['Favicon OFF', 'Favicon ON'], desc: 'Update favicon with Golden/Wrath Cookie', toggle: true, func: function() {CM.Disp.UpdateFavicon();}};
CM.ConfigData.FortuneNotification = {label: ['Fortune Cookie Notification OFF', 'Fortune Cookie Notification ON'], desc: 'Create a notification when Fortune Cookie is on the Ticker', toggle: true, func: function () {CM.CheckNotificationPermissions(CM.Config.FortuneNotification);}};
CM.ConfigData.FortuneFlash = {label: ['Fortune Cookie Flash OFF', 'Fortune Cookie Flash ON'], desc: 'Flash screen on Fortune Cookie', toggle: true};
CM.ConfigData.FortuneSound = {label: ['Fortune Cookie Sound OFF', 'Fortune Cookie Sound ON'], desc: 'Play a sound on Fortune Cookie', toggle: true};
CM.ConfigData.FortuneVolume = {label: [], desc: 'Volume of the Fortune Cookie sound'};
for (var i = 0; i < 101; i++) {
	CM.ConfigData.FortuneVolume.label[i] = i + '%';
}
CM.ConfigData.FortuneSoundURL = {label: 'Fortune Cookie Sound URL:', desc: 'URL of the sound to be played when the Ticker has a Fortune Cookie'};
CM.ConfigData.SeaNotification = {label: ['Season Special Notification OFF', 'Season Special Notification ON'], desc: 'Create a notification on Season Popup', toggle: true, func: function () {CM.CheckNotificationPermissions(CM.Config.SeaNotification);}};
CM.ConfigData.SeaFlash = {label: ['Season Special Flash OFF', 'Season Special Flash ON'], desc: 'Flash screen on Season Popup', toggle: true};
CM.ConfigData.SeaSound = {label: ['Season Special Sound OFF', 'Season Special Sound ON'], desc: 'Play a sound on Season Popup', toggle: true};
CM.ConfigData.SeaVolume = {label: [], desc: 'Volume of the Season Special sound'};
for (var i = 0; i < 101; i++) {
	CM.ConfigData.SeaVolume.label[i] = i + '%';
}
CM.ConfigData.SeaSoundURL = {label: 'Season Special Sound URL:', desc: 'URL of the sound to be played when a Season Special spawns'};
CM.ConfigData.GardFlash = {label: ['Garden Tick Flash OFF', 'Garden Tick Flash ON'], desc: 'Flash screen on Garden Tick', toggle: true};
CM.ConfigData.GardSound = {label: ['Garden Tick Sound OFF', 'Garden Tick Sound ON'], desc: 'Play a sound on Garden Tick', toggle: true};
CM.ConfigData.GardVolume = {label: [], desc: 'Volume of the Garden Tick sound'};
for (var i = 0; i < 101; i++) {
	CM.ConfigData.GardVolume.label[i] = i + '%';
}
CM.ConfigData.GardSoundURL = {label: 'Garden Tick Sound URL:', desc: 'URL of the sound to be played when the garden ticks'};
CM.ConfigData.MagicNotification = {label: ['Magic Max Notification OFF', 'Magic Max Notification ON'], desc: 'Create a notification when magic reaches maximum', toggle: true, func: function () {CM.CheckNotificationPermissions(CM.Config.MagicNotification);}};
CM.ConfigData.MagicFlash = {label: ['Magic Max Flash OFF', 'Magic Max Flash ON'], desc: 'Flash screen when magic reaches maximum', toggle: true};
CM.ConfigData.MagicSound = {label: ['Magic Max Sound OFF', 'Magic Max Sound ON'], desc: 'Play a sound when magic reaches maximum', toggle: true};
CM.ConfigData.MagicVolume = {label: [], desc: 'Volume of the Max Magic sound'};
for (var i = 0; i < 101; i++) {
	CM.ConfigData.MagicVolume.label[i] = i + '%';
}
CM.ConfigData.MagicSoundURL = {label: 'Magic Max Sound URL:', desc: 'URL of the sound to be played when magic reaches maxium'};
CM.ConfigData.WrinklerNotification = {label: ['Wrinkler Notification OFF', 'Wrinkler Notification ON'], desc: 'Create a notification when a Wrinkler appears', toggle: true, func: function () {CM.CheckNotificationPermissions(CM.Config.WrinklerNotification);}};
CM.ConfigData.WrinklerFlash = {label: ['Wrinkler Flash OFF', 'Wrinkler Flash ON'], desc: 'Flash screen when a Wrinkler appears', toggle: true};
CM.ConfigData.WrinklerSound = {label: ['Wrinkler Sound OFF', 'Wrinkler Sound ON'], desc: 'Play a sound when a Wrinkler appears', toggle: true};
CM.ConfigData.WrinklerVolume = {label: [], desc: 'Volume of the Wrinkler sound'};
for (var i = 0; i < 101; i++) {
	CM.ConfigData.WrinklerVolume.label[i] = i + '%';
}
CM.ConfigData.WrinklerSoundURL = {label: 'Wrinkler Sound URL:', desc: 'URL of the sound to be played when a Wrinkler appears'};
CM.ConfigData.WrinklerMaxNotification = {label: ['Wrinkler Max Notification OFF', 'Wrinkler Max Notification ON'], desc: 'Create a notification when the maximum amount of Wrinklers has appeared', toggle: true, func: function () {CM.CheckNotificationPermissions(CM.Config.WrinklerMaxNotification);}};
CM.ConfigData.WrinklerMaxFlash = {label: ['Wrinkler Max Flash OFF', 'Wrinkler Max Flash ON'], desc: 'Flash screen when the maximum amount of Wrinklers has appeared', toggle: true};
CM.ConfigData.WrinklerMaxSound = {label: ['Wrinkler Max Sound OFF', 'Wrinkler Max Sound ON'], desc: 'Play a sound when the maximum amount of Wrinklers has appeared', toggle: true};
CM.ConfigData.WrinklerMaxVolume = {label: [], desc: 'Volume of the Wrinkler Max sound'};
for (var i = 0; i < 101; i++) {
	CM.ConfigData.WrinklerMaxVolume.label[i] = i + '%';
}
CM.ConfigData.WrinklerMaxSoundURL = {label: 'Wrinkler Max Sound URL:', desc: 'URL of the sound to be played when the maximum amount of Wrinklers has appeared'};
CM.ConfigData.Title = {label: ['Title OFF', 'Title ON', 'Title Pinned Tab Highlight'], desc: 'Update title with Golden Cookie/Season Popup timers; pinned tab highlight only changes the title when a Golden Cookie/Season Popup spawns', toggle: true};
CM.ConfigData.TooltipBuildUp = {label: ['Buildings/Upgrades Tooltip Information OFF', 'Buildings/Upgrades Tooltip Information ON'], desc: 'Extra information in tooltip for buildings/upgrades', toggle: true};
CM.ConfigData.TooltipAmor = {label: ['Buildings Tooltip Amortization Information OFF', 'Buildings Tooltip Amortization Information ON'], desc: 'Add amortization information to buildings tooltip', toggle: true};
CM.ConfigData.ToolWarnLucky = {label: ['Tooltip Lucky Warning OFF', 'Tooltip Lucky Warning ON'], desc: 'A warning when buying if it will put the bank under the amount needed for max "Lucky!"/"Lucky!" (Frenzy) rewards', toggle: true};
CM.ConfigData.ToolWarnConjure = {label: ['Tooltip Conjure Warning OFF', 'Tooltip Conjure Warning ON'], desc: 'A warning when buying if it will put the bank under the amount needed for max "Conjure Baked Goods" rewards', toggle: true};
CM.ConfigData.ToolWarnPos = {label: ['Tooltip Warning Position (Left)', 'Tooltip Warning Position (Bottom)'], desc: 'Placement of the warning boxes', toggle: false, func: function() {CM.Disp.ToggleToolWarnPos();}};
CM.ConfigData.TooltipGrim = {label: ['Grimoire Tooltip Information OFF', 'Grimoire Tooltip Information ON'], desc: 'Extra information in tooltip for grimoire', toggle: true};
CM.ConfigData.ToolWrink = {label: ['Wrinkler Tooltip OFF', 'Wrinkler Tooltip ON'], desc: 'Shows the amount of cookies a wrinkler will give when popping it', toggle: true};
CM.ConfigData.TooltipLump = {label: ['Sugar Lump Tooltip OFF', 'Sugar Lump Tooltip ON'], desc: 'Shows the current Sugar Lump type in Sugar lump tooltip.', toggle: true};
CM.ConfigData.Stats = {label: ['Statistics OFF', 'Statistics ON'], desc: 'Extra Cookie Monster statistics!', toggle: true};
CM.ConfigData.MissingUpgrades = {label: ['Missing Upgrades OFF', 'Missing Upgrades ON'], desc: 'Shows Missing upgrades in Stats Menu. This feature can be laggy for users with a low amount of unlocked achievements.', toggle: true};
CM.ConfigData.UpStats = {label: ['Statistics Update Rate (Default)', 'Statistics Update Rate (1s)'], desc: 'Default Game rate is once every 5 seconds', toggle: false};
CM.ConfigData.TimeFormat = {label: ['Time XXd, XXh, XXm, XXs', 'Time XX:XX:XX:XX:XX'], desc: 'Change the time format', toggle: false};
CM.ConfigData.SayTime = {label: ['Format Time OFF', 'Format Time ON'], desc: 'Change how time is displayed in statistics', toggle: true, func: function() {CM.Disp.ToggleSayTime();}};
CM.ConfigData.GrimoireBar = {label: ['Grimoire Magic Meter Timer OFF', 'Grimoire Magic Meter Timer ON'], desc: 'A timer on how long before the Grimoire magic meter is full', toggle: true};
CM.ConfigData.Scale = {label: ['Game\'s Setting Scale', 'Metric', 'Short Scale', 'Scientific Notation', 'Engineering Notation'], desc: 'Change how long numbers are handled', toggle: false, func: function() {CM.Disp.RefreshScale();}};
CM.ConfigData.SortBuildings = {label: ['Sort Buildings: Default', 'Sort Buildings: PP'], desc: 'Sort the display of buildings in either default order or by PP', toggle: false,	func: function () { CM.Disp.UpdateBuildings();}};
CM.ConfigData.SortUpgrades = {label: ['Sort Upgrades: Default', 'Sort Upgrades: PP'], desc: 'Sort the display of upgrades in either default order or by PP', toggle: false, func: function () { CM.Disp.UpdateUpgrades();}};
