var e = {};
function t(e, t) {
	const n = Object.create(null),
		o = e.split(',');
	for (let e = 0; e < o.length; e++) n[o[e]] = !0;
	return t ? (e) => !!n[e.toLowerCase()] : (e) => !!n[e];
}
const n = t(
	'Infinity,undefined,NaN,isFinite,isNaN,parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,BigInt'
);
function o(e) {
	if (v(e)) {
		const t = {};
		for (let n = 0; n < e.length; n++) {
			const r = e[n],
				s = o(m(r) ? c(r) : r);
			if (s) for (const e in s) t[e] = s[e];
		}
		return t;
	}
	if (N(e)) return e;
}
const r = /;(?![^(]*\))/g,
	s = /:(.+)/;
function c(e) {
	const t = {};
	return (
		e.split(r).forEach((e) => {
			if (e) {
				const n = e.split(s);
				n.length > 1 && (t[n[0].trim()] = n[1].trim());
			}
		}),
		t
	);
}
function i(e) {
	let t = '';
	if (m(e)) t = e;
	else if (v(e))
		for (let n = 0; n < e.length; n++) {
			const o = i(e[n]);
			o && (t += o + ' ');
		}
	else if (N(e)) for (const n in e) e[n] && (t += n + ' ');
	return t.trim();
}
const a = 'production' !== process.env.NODE_ENV ? Object.freeze({}) : {},
	l = 'production' !== process.env.NODE_ENV ? Object.freeze([]) : [],
	u = () => {},
	p = /^on[^a-z]/,
	f = (e) => p.test(e),
	d = Object.assign,
	h = Object.prototype.hasOwnProperty,
	_ = (e, t) => h.call(e, t),
	v = Array.isArray,
	g = (e) => '[object Map]' === b(e),
	y = (e) => 'function' == typeof e,
	m = (e) => 'string' == typeof e,
	E = (e) => 'symbol' == typeof e,
	N = (e) => null !== e && 'object' == typeof e,
	w = Object.prototype.toString,
	b = (e) => w.call(e),
	O = (e) => b(e).slice(8, -1),
	V = (e) => m(e) && 'NaN' !== e && '-' !== e[0] && '' + parseInt(e, 10) === e,
	k = (e) => {
		const t = Object.create(null);
		return (n) => t[n] || (t[n] = e(n));
	},
	x = /-(\w)/g,
	S = k((e) => e.replace(x, (e, t) => (t ? t.toUpperCase() : ''))),
	$ = k((e) => e.charAt(0).toUpperCase() + e.slice(1)),
	D = (e, t) => e !== t && (e == e || t == t),
	C = new WeakMap(),
	R = [];
let j;
const P = Symbol('production' !== process.env.NODE_ENV ? 'iterate' : ''),
	M = Symbol('production' !== process.env.NODE_ENV ? 'Map key iterate' : '');
function F(e, t = a) {
	(function (e) {
		return e && !0 === e._isEffect;
	})(e) && (e = e.raw);
	const n = (function (e, t) {
		const n = function () {
			if (!n.active) return t.scheduler ? void 0 : e();
			if (!R.includes(n)) {
				T(n);
				try {
					return z.push(U), (U = !0), R.push(n), (j = n), e();
				} finally {
					R.pop(), J(), (j = R[R.length - 1]);
				}
			}
		};
		return (
			(n.id = A++),
			(n.allowRecurse = !!t.allowRecurse),
			(n._isEffect = !0),
			(n.active = !0),
			(n.raw = e),
			(n.deps = []),
			(n.options = t),
			n
		);
	})(e, t);
	return t.lazy || n(), n;
}
function I(e) {
	e.active && (T(e), e.options.onStop && e.options.onStop(), (e.active = !1));
}
let A = 0;
function T(e) {
	const { deps: t } = e;
	if (t.length) {
		for (let n = 0; n < t.length; n++) t[n].delete(e);
		t.length = 0;
	}
}
let U = !0;
const z = [];
function H() {
	z.push(U), (U = !1);
}
function J() {
	const e = z.pop();
	U = void 0 === e || e;
}
function B(e, t, n) {
	if (!U || void 0 === j) return;
	let o = C.get(e);
	o || C.set(e, (o = new Map()));
	let r = o.get(n);
	r || o.set(n, (r = new Set())),
		r.has(j) ||
			(r.add(j),
			j.deps.push(r),
			'production' !== process.env.NODE_ENV &&
				j.options.onTrack &&
				j.options.onTrack({ effect: j, target: e, type: t, key: n }));
}
function W(e, t, n, o, r, s) {
	const c = C.get(e);
	if (!c) return;
	const i = new Set(),
		a = (e) => {
			e &&
				e.forEach((e) => {
					(e !== j || e.allowRecurse) && i.add(e);
				});
		};
	if ('clear' === t) c.forEach(a);
	else if ('length' === n && v(e))
		c.forEach((e, t) => {
			('length' === t || t >= o) && a(e);
		});
	else
		switch ((void 0 !== n && a(c.get(n)), t)) {
			case 'add':
				v(e) ? V(n) && a(c.get('length')) : (a(c.get(P)), g(e) && a(c.get(M)));
				break;
			case 'delete':
				v(e) || (a(c.get(P)), g(e) && a(c.get(M)));
				break;
			case 'set':
				g(e) && a(c.get(P));
		}
	i.forEach((c) => {
		'production' !== process.env.NODE_ENV &&
			c.options.onTrigger &&
			c.options.onTrigger({ effect: c, target: e, key: n, type: t, newValue: o, oldValue: r, oldTarget: s }),
			c.options.scheduler ? c.options.scheduler(c) : c();
	});
}
const K = t('__proto__,__v_isRef,__isVue'),
	q = new Set(
		Object.getOwnPropertyNames(Symbol)
			.map((e) => Symbol[e])
			.filter(E)
	),
	L = Z(),
	G = Z(!1, !0),
	Q = Z(!0),
	X = Z(!0, !0),
	Y = {};
function Z(e = !1, t = !1) {
	return function (n, o, r) {
		if ('__v_isReactive' === o) return !e;
		if ('__v_isReadonly' === o) return e;
		if ('__v_raw' === o && r === (e ? ke : Ve).get(n)) return n;
		const s = v(n);
		if (!e && s && _(Y, o)) return Reflect.get(Y, o, r);
		const c = Reflect.get(n, o, r);
		if (E(o) ? q.has(o) : K(o)) return c;
		if ((e || B(n, 'get', o), t)) return c;
		if (Me(c)) {
			return !s || !V(o) ? c.value : c;
		}
		return N(c) ? (e ? Se(c) : xe(c)) : c;
	};
}
['includes', 'indexOf', 'lastIndexOf'].forEach((e) => {
	const t = Array.prototype[e];
	Y[e] = function (...e) {
		const n = Pe(this);
		for (let e = 0, t = this.length; e < t; e++) B(n, 'get', e + '');
		const o = t.apply(n, e);
		return -1 === o || !1 === o ? t.apply(n, e.map(Pe)) : o;
	};
}),
	['push', 'pop', 'shift', 'unshift', 'splice'].forEach((e) => {
		const t = Array.prototype[e];
		Y[e] = function (...e) {
			H();
			const n = t.apply(this, e);
			return J(), n;
		};
	});
function ee(e = !1) {
	return function (t, n, o, r) {
		const s = t[n];
		if (!e && ((o = Pe(o)), !v(t) && Me(s) && !Me(o))) return (s.value = o), !0;
		const c = v(t) && V(n) ? Number(n) < t.length : _(t, n),
			i = Reflect.set(t, n, o, r);
		return t === Pe(r) && (c ? D(o, s) && W(t, 'set', n, o, s) : W(t, 'add', n, o)), i;
	};
}
const te = {
		get: L,
		set: ee(),
		deleteProperty: function (e, t) {
			const n = _(e, t),
				o = e[t],
				r = Reflect.deleteProperty(e, t);
			return r && n && W(e, 'delete', t, void 0, o), r;
		},
		has: function (e, t) {
			const n = Reflect.has(e, t);
			return (E(t) && q.has(t)) || B(e, 'has', t), n;
		},
		ownKeys: function (e) {
			return B(e, 'iterate', v(e) ? 'length' : P), Reflect.ownKeys(e);
		},
	},
	ne = {
		get: Q,
		set: (e, t) => (
			'production' !== process.env.NODE_ENV &&
				console.warn(`Set operation on key "${String(t)}" failed: target is readonly.`, e),
			!0
		),
		deleteProperty: (e, t) => (
			'production' !== process.env.NODE_ENV &&
				console.warn(`Delete operation on key "${String(t)}" failed: target is readonly.`, e),
			!0
		),
	};
d({}, te, { get: G, set: ee(!0) });
const oe = d({}, ne, { get: X }),
	re = (e) => (N(e) ? xe(e) : e),
	se = (e) => (N(e) ? Se(e) : e),
	ce = (e) => e,
	ie = (e) => Reflect.getPrototypeOf(e);
function ae(e, t, n = !1, o = !1) {
	const r = Pe((e = e.__v_raw)),
		s = Pe(t);
	t !== s && !n && B(r, 'get', t), !n && B(r, 'get', s);
	const { has: c } = ie(r),
		i = n ? se : o ? ce : re;
	return c.call(r, t) ? i(e.get(t)) : c.call(r, s) ? i(e.get(s)) : void 0;
}
function le(e, t = !1) {
	const n = this.__v_raw,
		o = Pe(n),
		r = Pe(e);
	return e !== r && !t && B(o, 'has', e), !t && B(o, 'has', r), e === r ? n.has(e) : n.has(e) || n.has(r);
}
function ue(e, t = !1) {
	return (e = e.__v_raw), !t && B(Pe(e), 'iterate', P), Reflect.get(e, 'size', e);
}
function pe(e) {
	e = Pe(e);
	const t = Pe(this);
	return ie(t).has.call(t, e) || (t.add(e), W(t, 'add', e, e)), this;
}
function fe(e, t) {
	t = Pe(t);
	const n = Pe(this),
		{ has: o, get: r } = ie(n);
	let s = o.call(n, e);
	s ? 'production' !== process.env.NODE_ENV && Oe(n, o, e) : ((e = Pe(e)), (s = o.call(n, e)));
	const c = r.call(n, e);
	return n.set(e, t), s ? D(t, c) && W(n, 'set', e, t, c) : W(n, 'add', e, t), this;
}
function de(e) {
	const t = Pe(this),
		{ has: n, get: o } = ie(t);
	let r = n.call(t, e);
	r ? 'production' !== process.env.NODE_ENV && Oe(t, n, e) : ((e = Pe(e)), (r = n.call(t, e)));
	const s = o ? o.call(t, e) : void 0,
		c = t.delete(e);
	return r && W(t, 'delete', e, void 0, s), c;
}
function he() {
	const e = Pe(this),
		t = 0 !== e.size,
		n = 'production' !== process.env.NODE_ENV ? (g(e) ? new Map(e) : new Set(e)) : void 0,
		o = e.clear();
	return t && W(e, 'clear', void 0, void 0, n), o;
}
function _e(e, t) {
	return function (n, o) {
		const r = this,
			s = r.__v_raw,
			c = Pe(s),
			i = e ? se : t ? ce : re;
		return !e && B(c, 'iterate', P), s.forEach((e, t) => n.call(o, i(e), i(t), r));
	};
}
function ve(e, t, n) {
	return function (...o) {
		const r = this.__v_raw,
			s = Pe(r),
			c = g(s),
			i = 'entries' === e || (e === Symbol.iterator && c),
			a = 'keys' === e && c,
			l = r[e](...o),
			u = t ? se : n ? ce : re;
		return (
			!t && B(s, 'iterate', a ? M : P),
			{
				next() {
					const { value: e, done: t } = l.next();
					return t ? { value: e, done: t } : { value: i ? [u(e[0]), u(e[1])] : u(e), done: t };
				},
				[Symbol.iterator]() {
					return this;
				},
			}
		);
	};
}
function ge(e) {
	return function (...t) {
		if ('production' !== process.env.NODE_ENV) {
			const n = t[0] ? `on key "${t[0]}" ` : '';
			console.warn(`${$(e)} operation ${n}failed: target is readonly.`, Pe(this));
		}
		return 'delete' !== e && this;
	};
}
const ye = {
		get(e) {
			return ae(this, e);
		},
		get size() {
			return ue(this);
		},
		has: le,
		add: pe,
		set: fe,
		delete: de,
		clear: he,
		forEach: _e(!1, !1),
	},
	me = {
		get(e) {
			return ae(this, e, !1, !0);
		},
		get size() {
			return ue(this);
		},
		has: le,
		add: pe,
		set: fe,
		delete: de,
		clear: he,
		forEach: _e(!1, !0),
	},
	Ee = {
		get(e) {
			return ae(this, e, !0);
		},
		get size() {
			return ue(this, !0);
		},
		has(e) {
			return le.call(this, e, !0);
		},
		add: ge('add'),
		set: ge('set'),
		delete: ge('delete'),
		clear: ge('clear'),
		forEach: _e(!0, !1),
	};
function Ne(e, t) {
	const n = t ? me : e ? Ee : ye;
	return (t, o, r) =>
		'__v_isReactive' === o
			? !e
			: '__v_isReadonly' === o
			? e
			: '__v_raw' === o
			? t
			: Reflect.get(_(n, o) && o in t ? n : t, o, r);
}
['keys', 'values', 'entries', Symbol.iterator].forEach((e) => {
	(ye[e] = ve(e, !1, !1)), (Ee[e] = ve(e, !0, !1)), (me[e] = ve(e, !1, !0));
});
const we = { get: Ne(!1, !1) },
	be = { get: Ne(!0, !1) };
function Oe(e, t, n) {
	const o = Pe(n);
	if (o !== n && t.call(e, o)) {
		const t = O(e);
		console.warn(
			`Reactive ${t} contains both the raw and reactive versions of the same object${
				'Map' === t ? ' as keys' : ''
			}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`
		);
	}
}
const Ve = new WeakMap(),
	ke = new WeakMap();
function xe(e) {
	return e && e.__v_isReadonly ? e : De(e, !1, te, we);
}
function Se(e) {
	return De(e, !0, ne, be);
}
function $e(e) {
	return De(e, !0, oe, be);
}
function De(e, t, n, o) {
	if (!N(e))
		return 'production' !== process.env.NODE_ENV && console.warn(`value cannot be made reactive: ${String(e)}`), e;
	if (e.__v_raw && (!t || !e.__v_isReactive)) return e;
	const r = t ? ke : Ve,
		s = r.get(e);
	if (s) return s;
	const c =
		(i = e).__v_skip || !Object.isExtensible(i)
			? 0
			: (function (e) {
					switch (e) {
						case 'Object':
						case 'Array':
							return 1;
						case 'Map':
						case 'Set':
						case 'WeakMap':
						case 'WeakSet':
							return 2;
						default:
							return 0;
					}
			  })(O(i));
	var i;
	if (0 === c) return e;
	const a = new Proxy(e, 2 === c ? o : n);
	return r.set(e, a), a;
}
function Ce(e) {
	return Re(e) ? Ce(e.__v_raw) : !(!e || !e.__v_isReactive);
}
function Re(e) {
	return !(!e || !e.__v_isReadonly);
}
function je(e) {
	return Ce(e) || Re(e);
}
function Pe(e) {
	return (e && Pe(e.__v_raw)) || e;
}
function Me(e) {
	return Boolean(e && !0 === e.__v_isRef);
}
const Fe = [];
function Ie(e, ...t) {
	H();
	const n = Fe.length ? Fe[Fe.length - 1].component : null,
		o = n && n.appContext.config.warnHandler,
		r = (function () {
			let e = Fe[Fe.length - 1];
			if (!e) return [];
			const t = [];
			for (; e; ) {
				const n = t[0];
				n && n.vnode === e ? n.recurseCount++ : t.push({ vnode: e, recurseCount: 0 });
				const o = e.component && e.component.parent;
				e = o && o.vnode;
			}
			return t;
		})();
	if (o) ze(o, n, 11, [e + t.join(''), n && n.proxy, r.map(({ vnode: e }) => `at <${Zt(n, e.type)}>`).join('\n'), r]);
	else {
		const n = [`[Vue warn]: ${e}`, ...t];
		r.length &&
			n.push(
				'\n',
				...(function (e) {
					const t = [];
					return (
						e.forEach((e, n) => {
							t.push(
								...(0 === n ? [] : ['\n']),
								...(function ({ vnode: e, recurseCount: t }) {
									const n = t > 0 ? `... (${t} recursive calls)` : '',
										o = !!e.component && null == e.component.parent,
										r = ` at <${Zt(e.component, e.type, o)}`,
										s = '>' + n;
									return e.props ? [r, ...Ae(e.props), s] : [r + s];
								})(e)
							);
						}),
						t
					);
				})(r)
			),
			console.warn(...n);
	}
	J();
}
function Ae(e) {
	const t = [],
		n = Object.keys(e);
	return (
		n.slice(0, 3).forEach((n) => {
			t.push(...Te(n, e[n]));
		}),
		n.length > 3 && t.push(' ...'),
		t
	);
}
function Te(e, t, n) {
	return m(t)
		? ((t = JSON.stringify(t)), n ? t : [`${e}=${t}`])
		: 'number' == typeof t || 'boolean' == typeof t || null == t
		? n
			? t
			: [`${e}=${t}`]
		: Me(t)
		? ((t = Te(e, Pe(t.value), !0)), n ? t : [`${e}=Ref<`, t, '>'])
		: y(t)
		? [`${e}=fn${t.name ? `<${t.name}>` : ''}`]
		: ((t = Pe(t)), n ? t : [`${e}=`, t]);
}
const Ue = {
	bc: 'beforeCreate hook',
	c: 'created hook',
	bm: 'beforeMount hook',
	m: 'mounted hook',
	bu: 'beforeUpdate hook',
	u: 'updated',
	bum: 'beforeUnmount hook',
	um: 'unmounted hook',
	a: 'activated hook',
	da: 'deactivated hook',
	ec: 'errorCaptured hook',
	rtc: 'renderTracked hook',
	rtg: 'renderTriggered hook',
	0: 'setup function',
	1: 'render function',
	2: 'watcher getter',
	3: 'watcher callback',
	4: 'watcher cleanup function',
	5: 'native event handler',
	6: 'component event handler',
	7: 'vnode hook',
	8: 'directive hook',
	9: 'transition hook',
	10: 'app errorHandler',
	11: 'app warnHandler',
	12: 'ref function',
	13: 'async component loader',
	14: 'scheduler flush. This is likely a Vue internals bug. Please open an issue at https://new-issue.vuejs.org/?repo=vuejs/vue-next',
};
function ze(e, t, n, o) {
	let r;
	try {
		r = o ? e(...o) : e();
	} catch (e) {
		Je(e, t, n);
	}
	return r;
}
function He(e, t, n, o) {
	if (y(e)) {
		const s = ze(e, t, n, o);
		return (
			s &&
				N((r = s)) &&
				y(r.then) &&
				y(r.catch) &&
				s.catch((e) => {
					Je(e, t, n);
				}),
			s
		);
	}
	var r;
	const s = [];
	for (let r = 0; r < e.length; r++) s.push(He(e[r], t, n, o));
	return s;
}
function Je(e, t, n, o = !0) {
	const r = t ? t.vnode : null;
	if (t) {
		let o = t.parent;
		const r = t.proxy,
			s = 'production' !== process.env.NODE_ENV ? Ue[n] : n;
		for (; o; ) {
			const t = o.ec;
			if (t) for (let n = 0; n < t.length; n++) if (!1 === t[n](e, r, s)) return;
			o = o.parent;
		}
		const c = t.appContext.config.errorHandler;
		if (c) return void ze(c, null, 10, [e, r, s]);
	}
	!(function (e, t, n, o = !0) {
		if ('production' !== process.env.NODE_ENV) {
			const s = Ue[t];
			if (
				(n && ((r = n), Fe.push(r)), Ie('Unhandled error' + (s ? ` during execution of ${s}` : '')), n && Fe.pop(), o)
			)
				throw e;
			console.error(e);
		} else console.error(e);
		var r;
	})(e, n, r, o);
}
let Be = !1,
	We = !1;
const Ke = [];
let qe = 0;
const Le = [];
let Ge = null,
	Qe = 0;
const Xe = [];
let Ye = null,
	Ze = 0;
const et = Promise.resolve();
let tt = null,
	nt = null;
function ot(e) {
	const t = tt || et;
	return e ? t.then(this ? e.bind(this) : e) : t;
}
function rt(e) {
	if (!((Ke.length && Ke.includes(e, Be && e.allowRecurse ? qe + 1 : qe)) || e === nt)) {
		const t = (function (e) {
			let t = qe + 1,
				n = Ke.length;
			const o = lt(e);
			for (; t < n; ) {
				const e = (t + n) >>> 1;
				lt(Ke[e]) < o ? (t = e + 1) : (n = e);
			}
			return t;
		})(e);
		t > -1 ? Ke.splice(t, 0, e) : Ke.push(e), st();
	}
}
function st() {
	Be || We || ((We = !0), (tt = et.then(ut)));
}
function ct(e, t, n, o) {
	v(e) ? n.push(...e) : (t && t.includes(e, e.allowRecurse ? o + 1 : o)) || n.push(e), st();
}
function it(e) {
	ct(e, Ye, Xe, Ze);
}
function at(e, t = null) {
	if (Le.length) {
		for (
			nt = t,
				Ge = [...new Set(Le)],
				Le.length = 0,
				'production' !== process.env.NODE_ENV && (e = e || new Map()),
				Qe = 0;
			Qe < Ge.length;
			Qe++
		)
			'production' !== process.env.NODE_ENV && pt(e, Ge[Qe]), Ge[Qe]();
		(Ge = null), (Qe = 0), (nt = null), at(e, t);
	}
}
const lt = (e) => (null == e.id ? 1 / 0 : e.id);
function ut(e) {
	(We = !1),
		(Be = !0),
		'production' !== process.env.NODE_ENV && (e = e || new Map()),
		at(e),
		Ke.sort((e, t) => lt(e) - lt(t));
	try {
		for (qe = 0; qe < Ke.length; qe++) {
			const t = Ke[qe];
			t && ('production' !== process.env.NODE_ENV && pt(e, t), ze(t, null, 14));
		}
	} finally {
		(qe = 0),
			(Ke.length = 0),
			(function (e) {
				if (Xe.length) {
					const t = [...new Set(Xe)];
					if (((Xe.length = 0), Ye)) return void Ye.push(...t);
					for (
						Ye = t,
							'production' !== process.env.NODE_ENV && (e = e || new Map()),
							Ye.sort((e, t) => lt(e) - lt(t)),
							Ze = 0;
						Ze < Ye.length;
						Ze++
					)
						'production' !== process.env.NODE_ENV && pt(e, Ye[Ze]), Ye[Ze]();
					(Ye = null), (Ze = 0);
				}
			})(e),
			(Be = !1),
			(tt = null),
			(Ke.length || Xe.length) && ut(e);
	}
}
function pt(e, t) {
	if (e.has(t)) {
		const n = e.get(t);
		if (n > 100)
			throw new Error(
				'Maximum recursive updates exceeded. This means you have a reactive effect that is mutating its own dependencies and thus recursively triggering itself. Possible sources include component template, render function, updated hook or watcher source function.'
			);
		e.set(t, n + 1);
	} else e.set(t, 1);
}
const ft = new Set();
if ('production' !== process.env.NODE_ENV) {
	('undefined' != typeof global
		? global
		: 'undefined' != typeof self
		? self
		: 'undefined' != typeof window
		? window
		: {}
	).__VUE_HMR_RUNTIME__ = {
		createRecord: ht(function (e, t) {
			t ||
				(Ie(
					'HMR API usage is out of date.\nPlease upgrade vue-loader/vite/rollup-plugin-vue or other relevant dependency that handles Vue SFC compilation.'
				),
				(t = {}));
			if (dt.has(e)) return !1;
			return dt.set(e, { component: en(t) ? t.__vccOpts : t, instances: new Set() }), !0;
		}),
		rerender: ht(function (e, t) {
			const n = dt.get(e);
			if (!n) return;
			t && (n.component.render = t);
			Array.from(n.instances).forEach((e) => {
				t && (e.render = t), (e.renderCache = []), e.update();
			});
		}),
		reload: ht(function (e, t) {
			const n = dt.get(e);
			if (!n) return;
			const { component: o, instances: r } = n;
			if (!ft.has(o)) {
				(t = en(t) ? t.__vccOpts : t), d(o, t);
				for (const e in o) e in t || delete o[e];
				ft.add(o),
					it(() => {
						ft.delete(o);
					});
			}
			Array.from(r).forEach((e) => {
				e.parent
					? rt(e.parent.update)
					: e.appContext.reload
					? e.appContext.reload()
					: 'undefined' != typeof window
					? window.location.reload()
					: console.warn('[HMR] Root or manually mounted instance modified. Full reload required.');
			});
		}),
	};
}
const dt = new Map();
function ht(e) {
	return (t, n) => {
		try {
			return e(t, n);
		} catch (e) {
			console.error(e),
				console.warn('[HMR] Something went wrong during Vue component hot-reload. Full reload required.');
		}
	};
}
let _t = null;
function vt(e) {
	_t = e;
}
function gt(e) {
	if ((y(e) && (e = e()), v(e))) {
		const t = (function (e) {
			let t;
			for (let n = 0; n < e.length; n++) {
				const o = e[n];
				if (!Ft(o)) return;
				if (o.type !== Ct || 'v-if' === o.children) {
					if (t) return;
					t = o;
				}
			}
			return t;
		})(e);
		'production' === process.env.NODE_ENV || t || Ie('<Suspense> slots expect a single root node.'), (e = t);
	}
	return Bt(e);
}
let yt = 0;
const mt = (e) => (yt += e);
function Et(e, t = _t) {
	if (!t) return e;
	const n = (...n) => {
		yt || Pt(!0);
		const o = _t;
		vt(t);
		const r = e(...n);
		return vt(o), yt || Mt(), r;
	};
	return (n._c = !0), n;
}
const Nt = {};
function wt(e, t, { immediate: n, deep: o, flush: r, onTrack: s, onTrigger: c } = a, i = Qt) {
	'production' === process.env.NODE_ENV ||
		t ||
		(void 0 !== n &&
			Ie('watch() "immediate" option is only respected when using the watch(source, callback, options?) signature.'),
		void 0 !== o &&
			Ie('watch() "deep" option is only respected when using the watch(source, callback, options?) signature.'));
	const l = (e) => {
		Ie(
			'Invalid watch source: ',
			e,
			'A watch source can only be a getter/effect function, a ref, a reactive object, or an array of these types.'
		);
	};
	let p,
		f,
		d = !1;
	if (
		(Me(e)
			? ((p = () => e.value), (d = !!e._shallow))
			: Ce(e)
			? ((p = () => e), (o = !0))
			: v(e)
			? (p = () =>
					e.map((e) =>
						Me(e)
							? e.value
							: Ce(e)
							? Ot(e)
							: y(e)
							? ze(e, i, 2, [i && i.proxy])
							: void ('production' !== process.env.NODE_ENV && l(e))
					))
			: y(e)
			? (p = t
					? () => ze(e, i, 2, [i && i.proxy])
					: () => {
							if (!i || !i.isUnmounted) return f && f(), ze(e, i, 3, [h]);
					  })
			: ((p = u), 'production' !== process.env.NODE_ENV && l(e)),
		t && o)
	) {
		const e = p;
		p = () => Ot(e());
	}
	const h = (e) => {
		f = E.options.onStop = () => {
			ze(e, i, 4);
		};
	};
	let _ = v(e) ? [] : Nt;
	const g = () => {
		if (E.active)
			if (t) {
				const e = E();
				(o || d || D(e, _)) && (f && f(), He(t, i, 3, [e, _ === Nt ? void 0 : _, h]), (_ = e));
			} else E();
	};
	let m;
	(g.allowRecurse = !!t),
		(m =
			'sync' === r
				? g
				: 'post' === r
				? () => Vt(g, i && i.suspense)
				: () => {
						!i || i.isMounted
							? (function (e) {
									ct(e, Ge, Le, Qe);
							  })(g)
							: g();
				  });
	const E = F(p, { lazy: !0, onTrack: s, onTrigger: c, scheduler: m });
	return (
		(function (e, t = Qt) {
			t && (t.effects || (t.effects = [])).push(e);
		})(E, i),
		t ? (n ? g() : (_ = E())) : 'post' === r ? Vt(E, i && i.suspense) : E(),
		() => {
			I(E),
				i &&
					((e, t) => {
						const n = e.indexOf(t);
						n > -1 && e.splice(n, 1);
					})(i.effects, E);
		}
	);
}
function bt(e, t, n) {
	const o = this.proxy;
	return wt(m(e) ? () => o[e] : e.bind(o), t.bind(o), n, this);
}
function Ot(e, t = new Set()) {
	if (!N(e) || t.has(e)) return e;
	if ((t.add(e), Me(e))) Ot(e.value, t);
	else if (v(e)) for (let n = 0; n < e.length; n++) Ot(e[n], t);
	else if ('[object Set]' === b(e) || g(e))
		e.forEach((e) => {
			Ot(e, t);
		});
	else for (const n in e) Ot(e[n], t);
	return e;
}
const Vt = function (e, t) {
	t && t.pendingBranch ? (v(e) ? t.effects.push(...e) : t.effects.push(e)) : it(e);
};
function kt(e) {
	return (
		(function (e, t, n = !0) {
			const o = _t || Qt;
			if (o) {
				const r = o.type;
				if ('components' === e) {
					if ('_self' === t) return r;
					const e = Yt(r);
					if (e && (e === t || e === S(t) || e === $(S(t)))) return r;
				}
				const s = St(o[e] || r[e], t) || St(o.appContext[e], t);
				return 'production' !== process.env.NODE_ENV && n && !s && Ie(`Failed to resolve ${e.slice(0, -1)}: ${t}`), s;
			}
			'production' !== process.env.NODE_ENV &&
				Ie(`resolve${$(e.slice(0, -1))} can only be used in render() or setup().`);
		})('components', e) || e
	);
}
const xt = Symbol();
function St(e, t) {
	return e && (e[t] || e[S(t)] || e[$(S(t))]);
}
const $t = Symbol('production' !== process.env.NODE_ENV ? 'Fragment' : void 0),
	Dt = Symbol('production' !== process.env.NODE_ENV ? 'Text' : void 0),
	Ct = Symbol('production' !== process.env.NODE_ENV ? 'Comment' : void 0);
Symbol('production' !== process.env.NODE_ENV ? 'Static' : void 0);
const Rt = [];
let jt = null;
function Pt(e = !1) {
	Rt.push((jt = e ? null : []));
}
function Mt() {
	Rt.pop(), (jt = Rt[Rt.length - 1] || null);
}
function Ft(e) {
	return !!e && !0 === e.__v_isVNode;
}
const It = ({ key: e }) => (null != e ? e : null),
	At = ({ ref: e }) => (null != e ? (m(e) || Me(e) || y(e) ? { i: _t, r: e } : e) : null),
	Tt = 'production' !== process.env.NODE_ENV ? (...e) => Ut(...e) : Ut;
function Ut(e, t = null, n = null, r = 0, s = null, c = !1) {
	if (
		((e && e !== xt) ||
			('production' === process.env.NODE_ENV || e || Ie(`Invalid vnode type when creating vnode: ${e}.`), (e = Ct)),
		Ft(e))
	) {
		const o = zt(e, t, !0);
		return n && Wt(o, n), o;
	}
	if ((en(e) && (e = e.__vccOpts), t)) {
		(je(t) || '__vInternal' in t) && (t = d({}, t));
		let { class: e, style: n } = t;
		e && !m(e) && (t.class = i(e)), N(n) && (je(n) && !v(n) && (n = d({}, n)), (t.style = o(n)));
	}
	const a = m(e) ? 1 : ((e) => e.__isSuspense)(e) ? 128 : ((e) => e.__isTeleport)(e) ? 64 : N(e) ? 4 : y(e) ? 2 : 0;
	'production' !== process.env.NODE_ENV &&
		4 & a &&
		je(e) &&
		Ie(
			'Vue received a Component which was made a reactive object. This can lead to unnecessary performance overhead, and should be avoided by marking the component with `markRaw` or using `shallowRef` instead of `ref`.',
			'\nComponent that was made reactive: ',
			(e = Pe(e))
		);
	const l = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e,
		props: t,
		key: t && It(t),
		ref: t && At(t),
		scopeId: null,
		children: null,
		component: null,
		suspense: null,
		ssContent: null,
		ssFallback: null,
		dirs: null,
		transition: null,
		el: null,
		anchor: null,
		target: null,
		targetAnchor: null,
		staticCount: 0,
		shapeFlag: a,
		patchFlag: r,
		dynamicProps: s,
		dynamicChildren: null,
		appContext: null,
	};
	if (
		('production' !== process.env.NODE_ENV &&
			l.key != l.key &&
			Ie('VNode created with invalid key (NaN). VNode type:', l.type),
		Wt(l, n),
		128 & a)
	) {
		const { content: e, fallback: t } = (function (e) {
			const { shapeFlag: t, children: n } = e;
			let o, r;
			return (
				32 & t ? ((o = gt(n.default)), (r = gt(n.fallback))) : ((o = gt(n)), (r = Bt(null))),
				{ content: o, fallback: r }
			);
		})(l);
		(l.ssContent = e), (l.ssFallback = t);
	}
	return !c && jt && (r > 0 || 6 & a) && 32 !== r && jt.push(l), l;
}
function zt(e, t, n = !1) {
	const { props: r, ref: s, patchFlag: c, children: a } = e,
		l = t
			? (function (...e) {
					const t = d({}, e[0]);
					for (let n = 1; n < e.length; n++) {
						const r = e[n];
						for (const e in r)
							if ('class' === e) t.class !== r.class && (t.class = i([t.class, r.class]));
							else if ('style' === e) t.style = o([t.style, r.style]);
							else if (f(e)) {
								const n = t[e],
									o = r[e];
								n !== o && (t[e] = n ? [].concat(n, r[e]) : o);
							} else '' !== e && (t[e] = r[e]);
					}
					return t;
			  })(r || {}, t)
			: r;
	return {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e.type,
		props: l,
		key: l && It(l),
		ref: t && t.ref ? (n && s ? (v(s) ? s.concat(At(t)) : [s, At(t)]) : At(t)) : s,
		scopeId: e.scopeId,
		children: 'production' !== process.env.NODE_ENV && -1 === c && v(a) ? a.map(Ht) : a,
		target: e.target,
		targetAnchor: e.targetAnchor,
		staticCount: e.staticCount,
		shapeFlag: e.shapeFlag,
		patchFlag: t && e.type !== $t ? (-1 === c ? 16 : 16 | c) : c,
		dynamicProps: e.dynamicProps,
		dynamicChildren: e.dynamicChildren,
		appContext: e.appContext,
		dirs: e.dirs,
		transition: e.transition,
		component: e.component,
		suspense: e.suspense,
		ssContent: e.ssContent && zt(e.ssContent),
		ssFallback: e.ssFallback && zt(e.ssFallback),
		el: e.el,
		anchor: e.anchor,
	};
}
function Ht(e) {
	const t = zt(e);
	return v(e.children) && (t.children = e.children.map(Ht)), t;
}
function Jt(e = ' ', t = 0) {
	return Tt(Dt, null, e, t);
}
function Bt(e) {
	return null == e || 'boolean' == typeof e
		? Tt(Ct)
		: v(e)
		? Tt($t, null, e)
		: 'object' == typeof e
		? null === e.el
			? e
			: zt(e)
		: Tt(Dt, null, String(e));
}
function Wt(e, t) {
	let n = 0;
	const { shapeFlag: o } = e;
	if (null == t) t = null;
	else if (v(t)) n = 16;
	else if ('object' == typeof t) {
		if (1 & o || 64 & o) {
			const n = t.default;
			return void (n && (n._c && mt(1), Wt(e, n()), n._c && mt(-1)));
		}
		{
			n = 32;
			const o = t._;
			o || '__vInternal' in t
				? 3 === o && _t && (1024 & _t.vnode.patchFlag ? ((t._ = 2), (e.patchFlag |= 1024)) : (t._ = 1))
				: (t._ctx = _t);
		}
	} else
		y(t) ? ((t = { default: t, _ctx: _t }), (n = 32)) : ((t = String(t)), 64 & o ? ((n = 16), (t = [Jt(t)])) : (n = 8));
	(e.children = t), (e.shapeFlag |= n);
}
function Kt(e, t, n) {
	const o = n.appContext.config.optionMergeStrategies,
		{ mixins: r, extends: s } = t;
	s && Kt(e, s, n), r && r.forEach((t) => Kt(e, t, n));
	for (const r in t) o && _(o, r) ? (e[r] = o[r](e[r], t[r], n.proxy, r)) : (e[r] = t[r]);
}
const qt = (e) => (e ? (4 & e.vnode.shapeFlag ? (e.exposed ? e.exposed : e.proxy) : qt(e.parent)) : null),
	Lt = d(Object.create(null), {
		$: (e) => e,
		$el: (e) => e.vnode.el,
		$data: (e) => e.data,
		$props: (e) => ('production' !== process.env.NODE_ENV ? $e(e.props) : e.props),
		$attrs: (e) => ('production' !== process.env.NODE_ENV ? $e(e.attrs) : e.attrs),
		$slots: (e) => ('production' !== process.env.NODE_ENV ? $e(e.slots) : e.slots),
		$refs: (e) => ('production' !== process.env.NODE_ENV ? $e(e.refs) : e.refs),
		$parent: (e) => qt(e.parent),
		$root: (e) => qt(e.root),
		$emit: (e) => e.emit,
		$options: (e) =>
			__VUE_OPTIONS_API__
				? (function (e) {
						const t = e.type,
							{ __merged: n, mixins: o, extends: r } = t;
						if (n) return n;
						const s = e.appContext.mixins;
						if (!s.length && !o && !r) return t;
						const c = {};
						return s.forEach((t) => Kt(c, t, e)), Kt(c, t, e), (t.__merged = c);
				  })(e)
				: e.type,
		$forceUpdate: (e) => () => rt(e.update),
		$nextTick: (e) => ot.bind(e.proxy),
		$watch: (e) => (__VUE_OPTIONS_API__ ? bt.bind(e) : u),
	}),
	Gt = {
		get({ _: e }, t) {
			const { ctx: n, setupState: o, data: r, props: s, accessCache: c, type: i, appContext: l } = e;
			if ('__v_skip' === t) return !0;
			if ('production' !== process.env.NODE_ENV && '__isVue' === t) return !0;
			let u;
			if ('$' !== t[0]) {
				const i = c[t];
				if (void 0 !== i)
					switch (i) {
						case 0:
							return o[t];
						case 1:
							return r[t];
						case 3:
							return n[t];
						case 2:
							return s[t];
					}
				else {
					if (o !== a && _(o, t)) return (c[t] = 0), o[t];
					if (r !== a && _(r, t)) return (c[t] = 1), r[t];
					if ((u = e.propsOptions[0]) && _(u, t)) return (c[t] = 2), s[t];
					if (n !== a && _(n, t)) return (c[t] = 3), n[t];
					__VUE_OPTIONS_API__, (c[t] = 4);
				}
			}
			const p = Lt[t];
			let f, d;
			return p
				? ('$attrs' === t && (B(e, 'get', t), process.env.NODE_ENV), p(e))
				: (f = i.__cssModules) && (f = f[t])
				? f
				: n !== a && _(n, t)
				? ((c[t] = 3), n[t])
				: ((d = l.config.globalProperties),
				  _(d, t)
						? d[t]
						: void (
								'production' === process.env.NODE_ENV ||
								!_t ||
								(m(t) && 0 === t.indexOf('__v')) ||
								(r === a || ('$' !== t[0] && '_' !== t[0]) || !_(r, t)
									? e === _t &&
									  Ie(`Property ${JSON.stringify(t)} was accessed during render but is not defined on instance.`)
									: Ie(
											`Property ${JSON.stringify(
												t
											)} must be accessed via $data because it starts with a reserved character ("$" or "_") and is not proxied on the render context.`
									  ))
						  ));
		},
		set({ _: e }, t, n) {
			const { data: o, setupState: r, ctx: s } = e;
			if (r !== a && _(r, t)) r[t] = n;
			else if (o !== a && _(o, t)) o[t] = n;
			else if (_(e.props, t))
				return (
					'production' !== process.env.NODE_ENV && Ie(`Attempting to mutate prop "${t}". Props are readonly.`, e), !1
				);
			return '$' === t[0] && t.slice(1) in e
				? ('production' !== process.env.NODE_ENV &&
						Ie(`Attempting to mutate public property "${t}". Properties starting with $ are reserved and readonly.`, e),
				  !1)
				: ('production' !== process.env.NODE_ENV && t in e.appContext.config.globalProperties
						? Object.defineProperty(s, t, { enumerable: !0, configurable: !0, value: n })
						: (s[t] = n),
				  !0);
		},
		has({ _: { data: e, setupState: t, accessCache: n, ctx: o, appContext: r, propsOptions: s } }, c) {
			let i;
			return (
				void 0 !== n[c] ||
				(e !== a && _(e, c)) ||
				(t !== a && _(t, c)) ||
				((i = s[0]) && _(i, c)) ||
				_(o, c) ||
				_(Lt, c) ||
				_(r.config.globalProperties, c)
			);
		},
	};
'production' !== process.env.NODE_ENV &&
	(Gt.ownKeys = (e) => (
		Ie(
			'Avoid app logic that relies on enumerating keys on a component instance. The keys will be empty in production mode to avoid performance overhead.'
		),
		Reflect.ownKeys(e)
	)),
	d({}, Gt, {
		get(e, t) {
			if (t !== Symbol.unscopables) return Gt.get(e, t, e);
		},
		has(e, t) {
			const o = '_' !== t[0] && !n(t);
			return (
				'production' !== process.env.NODE_ENV &&
					!o &&
					Gt.has(e, t) &&
					Ie(`Property ${JSON.stringify(t)} should not start with _ which is a reserved prefix for Vue internals.`),
				o
			);
		},
	});
let Qt = null;
const Xt = /(?:^|[-_])(\w)/g;
function Yt(e) {
	return (y(e) && e.displayName) || e.name;
}
function Zt(e, t, n = !1) {
	let o = Yt(t);
	if (!o && t.__file) {
		const e = t.__file.match(/([^/\\]+)\.\w+$/);
		e && (o = e[1]);
	}
	if (!o && e && e.parent) {
		const n = (e) => {
			for (const n in e) if (e[n] === t) return n;
		};
		o = n(e.components || e.parent.type.components) || n(e.appContext.components);
	}
	return o ? o.replace(Xt, (e) => e.toUpperCase()).replace(/[-_]/g, '') : n ? 'App' : 'Anonymous';
}
function en(e) {
	return y(e) && '__vccOpts' in e;
}
Symbol('production' !== process.env.NODE_ENV ? 'ssrContext' : ''),
	'production' !== process.env.NODE_ENV &&
		(function () {
			if ('production' === process.env.NODE_ENV || 'undefined' == typeof window) return;
			const e = { style: 'color:#3ba776' },
				t = { style: 'color:#0b1bc9' },
				n = { style: 'color:#b62e24' },
				o = { style: 'color:#9d288c' },
				r = {
					header: (t) =>
						N(t)
							? t.__isVue
								? ['div', e, 'VueInstance']
								: Me(t)
								? ['div', {}, ['span', e, p(t)], '<', i(t.value), '>']
								: Ce(t)
								? ['div', {}, ['span', e, 'Reactive'], '<', i(t), '>' + (Re(t) ? ' (readonly)' : '')]
								: Re(t)
								? ['div', {}, ['span', e, 'Readonly'], '<', i(t), '>']
								: null
							: null,
					hasBody: (e) => e && e.__isVue,
					body(e) {
						if (e && e.__isVue) return ['div', {}, ...s(e.$)];
					},
				};
			function s(e) {
				const t = [];
				e.type.props && e.props && t.push(c('props', Pe(e.props))),
					e.setupState !== a && t.push(c('setup', e.setupState)),
					e.data !== a && t.push(c('data', Pe(e.data)));
				const n = l(e, 'computed');
				n && t.push(c('computed', n));
				const r = l(e, 'inject');
				return (
					r && t.push(c('injected', r)),
					t.push([
						'div',
						{},
						['span', { style: o.style + ';opacity:0.66' }, '$ (internal): '],
						['object', { object: e }],
					]),
					t
				);
			}
			function c(e, t) {
				return (
					(t = d({}, t)),
					Object.keys(t).length
						? [
								'div',
								{ style: 'line-height:1.25em;margin-bottom:0.6em' },
								['div', { style: 'color:#476582' }, e],
								[
									'div',
									{ style: 'padding-left:1.25em' },
									...Object.keys(t).map((e) => ['div', {}, ['span', o, e + ': '], i(t[e], !1)]),
								],
						  ]
						: ['span', {}]
				);
			}
			function i(e, r = !0) {
				return 'number' == typeof e
					? ['span', t, e]
					: 'string' == typeof e
					? ['span', n, JSON.stringify(e)]
					: 'boolean' == typeof e
					? ['span', o, e]
					: N(e)
					? ['object', { object: r ? Pe(e) : e }]
					: ['span', n, String(e)];
			}
			function l(e, t) {
				const n = e.type;
				if (y(n)) return;
				const o = {};
				for (const r in e.ctx) u(n, r, t) && (o[r] = e.ctx[r]);
				return o;
			}
			function u(e, t, n) {
				const o = e[n];
				return (
					!!((v(o) && o.includes(t)) || (N(o) && t in o)) ||
					!(!e.extends || !u(e.extends, t, n)) ||
					!(!e.mixins || !e.mixins.some((e) => u(e, t, n))) ||
					void 0
				);
			}
			function p(e) {
				return e._shallow ? 'ShallowRef' : e.effect ? 'ComputedRef' : 'Ref';
			}
			window.devtoolsFormatters ? window.devtoolsFormatters.push(r) : (window.devtoolsFormatters = [r]);
		})();
const tn = Jt('Content goes here...');
(e.render = function (e, t, n, o, r, s) {
	const c = kt('private-view');
	return (
		Pt(),
		(function (e, t, n, o, r) {
			const s = Tt(e, t, n, o, r, !0);
			return (s.dynamicChildren = jt || l), Mt(), jt && jt.push(s), s;
		})(c, { title: 'My Custom Module' }, { default: Et(() => [tn]), _: 1 })
	);
}),
	(e.__file = 'src/module.vue');
var nn = { id: 'roman', name: 'Roman', icon: 'box', routes: [{ path: '/', component: e }] };
export default nn;
