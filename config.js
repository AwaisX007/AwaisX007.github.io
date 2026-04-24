const SUPABASE_URL = 'https://nbmvodklvnmnuntbmvvb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ibXZvZGtsdm5tbnVudGJtdnZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5OTA1ODcsImV4cCI6MjA4OTU2NjU4N30.JcpIlozE-J2DmcCExeNWt0pgtDBL70VX7jAXOBnix6E';
const CAPTCHA_PROVIDER = 'turnstile'; // 'turnstile' or 'hcaptcha'
const CAPTCHA_SITE_KEY = '0x4AAAAAACu3ttLPmMW90mOW'; // Optional: set your hCaptcha/Turnstile site key if Supabase CAPTCHA protection is enabled

// Single global Supabase client — all pages use window.sb
window.sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Shared auth/session helpers — use these across pages to avoid auth drift.
window.authUtils = window.authUtils || {
	async getCurrentUser() {
		if (!window.sb?.auth) return null;

		const { data: { session } } = await window.sb.auth.getSession();
		if (session?.user) return session.user;

		const { data: { user } } = await window.sb.auth.getUser();
		return user || null;
	},

	onAuthStateChange(callback) {
		if (!window.sb?.auth?.onAuthStateChange || typeof callback !== 'function') {
			return null;
		}

		return window.sb.auth.onAuthStateChange((_event, session) => {
			callback(session?.user || null, session);
		});
	},

	async getProfile(userId, fields = 'username, is_admin') {
		if (!window.sb || !userId) return null;
		const { data } = await window.sb.from('profiles').select(fields).eq('id', userId).single();
		return data || null;
	}
};

window.realtimeUtils = window.realtimeUtils || {
	subscribe({ table, filter, schema = 'public', events = '*', onChange, channelName }) {
		if (!window.sb?.channel || !table || typeof onChange !== 'function') {
			return null;
		}

		const name = channelName || `rt_${table}_${Math.random().toString(36).slice(2, 8)}`;
		const channel = window.sb
			.channel(name)
			.on('postgres_changes', {
				event: events,
				schema,
				table,
				...(filter ? { filter } : {})
			}, onChange)
			.subscribe();

		return channel;
	},

	unsubscribe(channel) {
		if (!channel || !window.sb?.removeChannel) return;
		window.sb.removeChannel(channel);
	}
};
