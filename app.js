try {
	(() => {
		var e = __$$hmAppManager$$__.currentApp;

		function t() {
			return e.app
		}
		const n = {};

		function o() {
			if ("undefined" != typeof self) return self;
			if ("undefined" != typeof window) return window;
			if ("undefined" != typeof global) return global;
			if ("undefined" != typeof globalThis) return globalThis;
			throw new Error("unable to locate global object")
		}
		t() ? DeviceRuntimeCore.HmUtils.gettextFactory(n, t()
			.__globals__.lang, "en-US") : console.log(n);
		let r = o();
		r.Logger || "undefined" != typeof DeviceRuntimeCore && (r.Logger = DeviceRuntimeCore.HmLogger);
		let i = o();
		i.Buffer || ("undefined" != typeof Buffer ? i.Buffer = Buffer : i.Buffer = DeviceRuntimeCore.Buffer);
		let u = o();
		"undefined" == typeof setTimeout && "undefined" != typeof timer && (u.clearTimeout = function(e) {
				e && timer.stopTimer(e)
			}, u.setTimeout = function(e, t) {
				const n = timer.createTimer(t || 1, Number.MAX_SAFE_INTEGER, (function() {
					u.clearTimeout(n), e && e()
				}), {});
				return n
			}, u.clearImmediate = function(e) {
				e && timer.stopTimer(e)
			}, u.setImmediate = function(e) {
				const t = timer.createTimer(1, Number.MAX_SAFE_INTEGER, (function() {
					u.clearImmediate(t), e && e()
				}), {});
				return t
			}, u.clearInterval = function(e) {
				e && timer.stopTimer(e)
			}, u.setInterval = function(e, t) {
				return timer.createTimer(1, t, (function() {
					e && e()
				}), {})
			}), e.app = DeviceRuntimeCore.App({
				globalData: {},
				onCreate(e) {},
				onDestroy(e) {},
				onError(e) {},
				onPageNotFound(e) {},
				onUnhandledRejection(e) {}
			}), t()
			.__globals__ = {
				lang: new DeviceRuntimeCore.HmUtils.Lang(DeviceRuntimeCore.HmUtils.getLanguage()),
				px: DeviceRuntimeCore.HmUtils.getPx(480)
			}, t()
			.__globals__.gettext = t() ? DeviceRuntimeCore.HmUtils.gettextFactory(n, t()
				.__globals__.lang, "en-US") : console.log(n)
	})()
} catch (e) {
	console.log(e)
}