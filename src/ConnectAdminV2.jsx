import React, { useMemo, useState, useEffect } from "react";

/**
 * ConnectEasy – Ops Admin Console (Static UI)
 * -------------------------------------------------------------
 * Single-file React prototype for internal OPS only.
 * Purpose: onboard businesses, apply a ruleset, send welcome email,
 * manage tokens/health, invites, and audits. No backend calls.
 *
 * Notes:
 * - No routers, no external deps. Navigation is state-based.
 * - Same component style as your previous UI (Card, Field, etc.).
 * - Safe to click around; forms validate in-browser only.
 */

// ------------------ Minimal Inline Icons ------------------
const iconCls = "w-5 h-5 inline-block align-text-bottom";
const IconLogo = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z"/>
    <path d="M12 7v10M8 9.5l8 4"/>
  </svg>
);
const IconAdd = () => (
  <svg viewBox="0 0 24 24" className={iconCls} fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 5v14M5 12h14"/></svg>
);
const IconSettings = () => (
  <svg viewBox="0 0 24 24" className={iconCls} fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 15a3 3 0 1 0-3-3 3 3 0 0 0 3 3z"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.07a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.07a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06A2 2 0 1 1 7.02 4.4l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.07a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c0 .66.39 1.26 1 1.51.31.13.65.2 1 .2H21a2 2 0 1 1 0 4h-.07a1.65 1.65 0 0 0-1.51 1z"/></svg>
);
const IconClipboard = () => (
  <svg viewBox="0 0 24 24" className={iconCls} fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="8" y="2" width="8" height="4" rx="1"/><rect x="4" y="6" width="16" height="14" rx="2"/></svg>
);
const IconUsers = () => (
  <svg viewBox="0 0 24 24" className={iconCls} fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm6 8v-1a4 4 0 0 0-4-4H10a4 4 0 0 0-4 4v1"/></svg>
);
const IconRules = () => (
  <svg viewBox="0 0 24 24" className={iconCls} fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 6h16M4 12h16M4 18h10"/></svg>
);
const IconHealth = () => (
  <svg viewBox="0 0 24 24" className={iconCls} fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="9"/><path d="M8 12l2 2 4-4"/></svg>
);
const IconMail = () => (
  <svg viewBox="0 0 24 24" className={iconCls} fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 7h18v10H3z"/><path d="M3 7l9 6 9-6"/></svg>
);
const IconAudit = () => (
  <svg viewBox="0 0 24 24" className={iconCls} fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 8h10M7 12h10M7 16h6"/></svg>
);
const IconSearch = () => (
  <svg viewBox="0 0 24 24" className={iconCls} fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></svg>
);
const IconCopy = () => (
  <svg viewBox="0 0 24 24" className={iconCls} fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="9" y="9" width="10" height="10" rx="2"/><rect x="5" y="5" width="10" height="10" rx="2"/></svg>
);
const IconCheck = () => (
  <svg viewBox="0 0 24 24" className={iconCls} fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 13l4 4L19 7"/></svg>
);
const IconX = () => (
  <svg viewBox="0 0 24 24" className={iconCls} fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 6l12 12M18 6l-12 12"/></svg>
);

const IconSwap = () => (
  <svg viewBox="0 0 24 24" className={iconCls} fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M7 7h11l-3-3M17 17H6l3 3"/></svg>
);

// ------------------ Primitives ------------------
const Badge = ({ children, variant = "default" }) => {
  const cls = {
    default: "bg-slate-100 text-slate-700",
    green: "bg-emerald-100 text-emerald-700",
    amber: "bg-amber-100 text-amber-700",
    red: "bg-rose-100 text-rose-700",
    blue: "bg-blue-100 text-blue-700",
    violet: "bg-violet-100 text-violet-700",
    gray: "bg-slate-200 text-slate-700",
  }[variant];
  return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>{children}</span>;
};

const Card = ({ title, subtitle, right, children, className = "" }) => (
  <div className={`bg-white rounded-2xl shadow-sm border border-slate-100 ${className}`}>
    {(title || right) && (
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <div>
          <div className="text-sm text-slate-500">{subtitle}</div>
          <h3 className="text-base font-semibold text-slate-900">{title}</h3>
        </div>
        {right}
      </div>
    )}
    <div className="p-4">{children}</div>
  </div>
);

const Field = ({ label, hint, children, required }) => (
  <label className="block space-y-1.5">
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-slate-700">{label}{required && <span className="text-rose-600">*</span>}</span>
      {hint && <span className="text-xs text-slate-400">{hint}</span>}
    </div>
    {children}
  </label>
);

const TextInput = (props) => (
  <input {...props} className={`w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${props.className||""}`} />
);
const TextArea = (props) => (
  <textarea {...props} className={`w-full rounded-xl border border-slate-200 px-3 py-2 text-sm min-h-[92px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${props.className||""}`} />
);
const Select = ({ options = [], ...props }) => (
  <select {...props} className={`w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${props.className||""}`}>
    {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
  </select>
);
const Button = ({ children, variant = "primary", className = "", ...props }) => {
  const base = "inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium focus:outline-none";
  const styles = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    ghost: "bg-transparent hover:bg-slate-100 text-slate-700",
    subtle: "bg-slate-100 hover:bg-slate-200 text-slate-800",
    danger: "bg-rose-600 hover:bg-rose-700 text-white",
    success: "bg-emerald-600 hover:bg-emerald-700 text-white",
  }[variant];
  return <button {...props} className={`${base} ${styles} ${className}`}>{children}</button>;
};
const Toggle = ({ checked, onChange, label }) => (
  <div className="flex items-center gap-3">
    <button type="button" onClick={() => onChange(!checked)} className={`w-10 h-6 rounded-full p-0.5 transition ${checked?"bg-blue-600":"bg-slate-300"}`}>
      <div className={`h-5 w-5 bg-white rounded-full transition ${checked?"translate-x-4":""}`}></div>
    </button>
    {label && <span className="text-sm text-slate-700">{label}</span>}
  </div>
);

const Table = ({ columns, rows }) => (
  <div className="overflow-auto">
    <table className="min-w-full text-sm">
      <thead>
        <tr className="text-slate-600">
          {columns.map((c) => (
            <th key={c.key} className="text-left font-medium py-2 px-3 whitespace-nowrap">{c.title}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i} className="border-t border-slate-100">
            {columns.map((c) => (
              <td key={c.key} className="py-2.5 px-3 align-top whitespace-nowrap">{r[c.key]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// ------------------ Helpers & Sample Data ------------------
const phoneRegex = /^\+?[1-9]\d{7,14}$/; // simple E.164-ish

function slugFromName(name) {
  const base = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  return (base || "biz").slice(0, 24);
}

const defaultBusinessSettings = () => ({
  timezone: "Asia/Kolkata",
  quiet_hours: { start: "22:00", end: "07:00" },
  keywords: {
    customer_rules: [],
    ops_rules: []
  }
});

const RULESET_CATALOG = [
  {
    id: "tuition-basic",
    label: "Tuition – Basic",
    summary: "Payments, attendance, fee reminders",
    sample: {
      keywords: {
        customer_rules: [
          { match: "contains", triggers: ["fees","amount"], do: "TEMPLATE", template_id: "tmpl-fee-reminder", vars: ["{{1}}","{{2}}"] }
        ],
        ops_rules: [
          { match: "exact", triggers: ["PAID"], do: "OPS_MARK_PAID", expects: "phone amount [note]" },
          { match: "contains", triggers: ["ATTEND"], do: "OPS_ATTEND", expects: "batch_code present_list_or_count" }
        ]
      }
    }
  },
  {
    id: "kitchen-basic",
    label: "Cloud Kitchen – Basic",
    summary: "Orders, status updates, menu",
    sample: {
      keywords: {
        customer_rules: [
          { match: "contains", triggers: ["menu","order"], do: "TEMPLATE", template_id: "tmpl-menu" }
        ],
        ops_rules: [
          { match: "contains", triggers: ["NEW"], do: "NEW_ORDER", expects: "items; name phone" },
          { match: "exact", triggers: ["READY","OUT","DONE","CANCEL"], do: "ADVANCE_ORDER", expects: "order_id to_status" }
        ]
      }
    }
  }
];

const SAMPLE_BUSINESSES = [
  { code: "TTR-01", name: "BrightTuition", owner_email: "owner@bright.edu", owner_phone: "+919820000001", timezone: "Asia/Kolkata", ruleset: "tuition-basic", status: "active" },
  { code: "HPL-02", name: "HealthPlus", owner_email: "ops@health.plus", owner_phone: "+971500000001", timezone: "Asia/Dubai", ruleset: "kitchen-basic", status: "trial" },
];

function seededSettingsFor(biz) {
  const pack = RULESET_CATALOG.find(p=>p.id===biz.ruleset);
  return {
    ...defaultBusinessSettings(),
    timezone: biz.timezone,
    keywords: pack?.sample.keywords || { customer_rules: [], ops_rules: [] }
  };
}

// ------------------ Screens ------------------
function AdminDashboard() {
  const kpis = [
    { k: "Businesses", v: 12 },
    { k: "Active tokens", v: 10 },
    { k: "Pending invites", v: 5 },
    { k: "Incidents (7d)", v: 1 },
  ];
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <Card title="Overview" subtitle="Last 7 days">
        <div className="grid grid-cols-2 gap-3">
          {kpis.map(m => (
            <div key={m.k} className="p-4 rounded-xl bg-slate-50 border">
              <div className="text-xs text-slate-500">{m.k}</div>
              <div className="text-2xl font-semibold">{m.v}</div>
            </div>
          ))}
        </div>
      </Card>
      <Card title="Recent Activity" subtitle="Audits (sample)">
        <ul className="text-sm text-slate-700 space-y-1">
          <li>• Created business <b>BrightTuition</b> (TTR-01)</li>
          <li>• Applied ruleset <b>tuition-basic</b> to <b>BrightTuition</b></li>
          <li>• Sent welcome email to owner@bright.edu</li>
        </ul>
      </Card>
    </div>
  );
}

function OnboardBusiness() {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [tz, setTz] = useState("Asia/Kolkata");
  const [site, setSite] = useState("");
  const [support, setSupport] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");
  const [ruleset, setRuleset] = useState("tuition-basic");
  const [copied, setCopied] = useState(false);

  useEffect(() => { setCode(slugFromName(name).toUpperCase()); }, [name]);

  const selectedPack = RULESET_CATALOG.find(r => r.id === ruleset);
  const settingsPreview = useMemo(() => ({
    ...defaultBusinessSettings(),
    timezone: tz,
    keywords: selectedPack?.sample.keywords || { customer_rules: [], ops_rules: [] }
  }), [tz, ruleset]);

  const isEmail = /.+@.+/.test(ownerEmail);
  const isPhone = phoneRegex.test(ownerPhone || "");
  const valid = name && code && isEmail && isPhone;

  const copyJson = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(settingsPreview, null, 2));
      setCopied(true); setTimeout(()=>setCopied(false), 1200);
    } catch {}
  };

  return (
    <div className="grid xl:grid-cols-[1.2fr_1fr] gap-4 items-start">
      <Card title="Create Business" subtitle="Internal only" right={<Badge variant="violet">OPS</Badge>}>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Business name" required>
            <TextInput value={name} onChange={e=>setName(e.target.value)} placeholder="Acme Classes" />
          </Field>
          <Field label="Business code" hint="Auto from name; editable" required>
            <div className="flex gap-2">
              <TextInput value={code} onChange={e=>setCode(e.target.value.toUpperCase())} placeholder="ACME-01" />
              <Button type="button" variant="subtle" onClick={()=> setCode(slugFromName(name).toUpperCase())}><IconClipboard/> Gen</Button>
            </div>
          </Field>
          <Field label="Timezone" required>
            <Select value={tz} onChange={e=>setTz(e.target.value)} options={[
              { value: "Asia/Kolkata", label: "Asia/Kolkata (IST)" },
              { value: "Asia/Dubai", label: "Asia/Dubai" },
              { value: "Asia/Singapore", label: "Asia/Singapore" },
            ]}/>
          </Field>
          <Field label="Website">
            <TextInput value={site} onChange={e=>setSite(e.target.value)} placeholder="https://…"/>
          </Field>
          <Field label="Support email">
            <TextInput value={support} onChange={e=>setSupport(e.target.value)} placeholder="support@example.com"/>
          </Field>
          <Field label="Ruleset" hint="Default pack">
            <Select value={ruleset} onChange={e=>setRuleset(e.target.value)} options={RULESET_CATALOG.map(r=>({ value:r.id, label:r.label }))}/>
          </Field>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <Field label="Owner email (for welcome)" required>
            <TextInput value={ownerEmail} onChange={e=>setOwnerEmail(e.target.value)} placeholder="owner@acme.com" />
          </Field>
          <Field label="Owner phone (E.164)" required>
            <TextInput value={ownerPhone} onChange={e=>setOwnerPhone(e.target.value)} placeholder="+9198…" />
          </Field>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          <Button disabled={!valid}><IconAdd/> Create business</Button>
          <Button disabled={!valid}><IconMail/> Send welcome email</Button>
          <Button variant="subtle" onClick={copyJson}><IconCopy/> Copy settings JSON {copied && <Badge variant="green">Copied</Badge>}</Button>
        </div>
      </Card>

      <Card title="Settings Preview" subtitle="What we will seed">
        <div className="text-xs text-slate-500 mb-2">timezone, quiet hours, and the ruleset pack will be stored in <b>businesses.settings_json</b></div>
        <pre className="text-xs bg-slate-50 rounded-xl p-3 overflow-auto max-h-[460px]">{JSON.stringify(settingsPreview, null, 2)}</pre>
      </Card>
    </div>
  );
}

function Businesses() {
  const [q, setQ] = useState("");
  const [rows, setRows] = useState(SAMPLE_BUSINESSES);
  const filtered = rows.filter(r => [r.code,r.name,r.owner_email].join(" ").toLowerCase().includes(q.toLowerCase()));
  const flip = (idx) => setRows(rows.map((r,i)=> i===idx? { ...r, status: r.status==="active"?"paused":"active" }: r));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2"><IconSearch/><TextInput value={q} onChange={e=>setQ(e.target.value)} placeholder="Search code, name or email…" style={{maxWidth:320}}/></div>
        <Button variant="subtle"><IconAdd/> New</Button>
      </div>
      <Card title="Businesses" subtitle="Tenant list">
        <Table columns={[
          { key: "code", title: "Code" },
          { key: "name", title: "Name" },
          { key: "owner", title: "Owner" },
          { key: "tz", title: "TZ" },
          { key: "ruleset", title: "Ruleset" },
          { key: "status", title: "Status" },
          { key: "actions", title: "" },
        ]} rows={filtered.map((r, idx)=> ({
          code: <span className="font-mono">{r.code}</span>,
          name: r.name,
          owner: <div className="text-xs"><div>{r.owner_email}</div><div className="text-slate-500">{r.owner_phone}</div></div>,
          tz: r.timezone,
          ruleset: <Badge variant="violet">{r.ruleset}</Badge>,
          status: <Badge variant={r.status==="active"?"green":"amber"}>{r.status}</Badge>,
          actions: <div className="flex gap-2"><Button variant="subtle">Edit</Button><Button variant={r.status==="active"?"danger":"success"} onClick={()=>flip(idx)}>{r.status==="active"?"Pause":"Resume"}</Button></div>
        }))} />
      </Card>
    </div>
  );
}

function RulesetsCatalog() {
  const [assignTo, setAssignTo] = useState("TTR-01");
  const [picked, setPicked] = useState(RULESET_CATALOG[0].id);

  const pack = RULESET_CATALOG.find(r=>r.id===picked);

  return (
    <div className="grid lg:grid-cols-[1.1fr_1fr] gap-4 items-start">
      <Card title="Ruleset Catalog" subtitle="Prebuilt packs">
        <div className="grid md:grid-cols-2 gap-4">
          {RULESET_CATALOG.map(r => (
            <button key={r.id} onClick={()=>setPicked(r.id)} className={`text-left p-4 rounded-2xl border ${picked===r.id?"border-blue-600 bg-blue-50":"border-slate-200 hover:bg-slate-50"}`}>
              <div className="font-semibold">{r.label}</div>
              <div className="text-xs text-slate-600">{r.summary}</div>
            </button>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-2">
          <Field label="Assign to business code" hint="e.g., TTR-01">
            <TextInput value={assignTo} onChange={e=>setAssignTo(e.target.value.toUpperCase())}/>
          </Field>
          <Button><IconCheck/> Apply to business</Button>
        </div>
      </Card>

      <Card title="Preview" subtitle={pack?.label}>
        <pre className="text-xs bg-slate-50 rounded-xl p-3 overflow-auto max-h-[520px]">{JSON.stringify(pack?.sample || {}, null, 2)}</pre>
      </Card>
    </div>
  );
}

function Invites() {
  const [email, setEmail] = useState("");
  const [bizCode, setBizCode] = useState("TTR-01");
  const [role, setRole] = useState("ADMIN");
  const [list, setList] = useState([
    { email: "ops@bright.edu", code: "TTR-01", role: "ADMIN", sent_at: "today 10:05" },
    { email: "chef@salads.io", code: "HPL-02", role: "STAFF", sent_at: "yesterday" },
  ]);

  const valid = /.+@.+/.test(email) && bizCode;

  const send = () => {
    if(!valid) return;
    setList([{ email, code: bizCode, role, sent_at: "just now" }, ...list]);
    setEmail("");
  };

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <Card title="Invite Staff" subtitle="Email link">
        <div className="grid gap-3">
          <Field label="Business code" required><TextInput value={bizCode} onChange={e=>setBizCode(e.target.value.toUpperCase())}/></Field>
          <Field label="Email" required><TextInput value={email} onChange={e=>setEmail(e.target.value)} placeholder="user@company.com"/></Field>
          <Field label="Role" required>
            <Select value={role} onChange={e=>setRole(e.target.value)} options={[{value:"ADMIN",label:"ADMIN"},{value:"STAFF",label:"STAFF"}]} />
          </Field>
          <div className="flex gap-2"><Button disabled={!valid} onClick={send}><IconMail/> Send invite</Button><Button variant="subtle">Copy invite link</Button></div>
        </div>
      </Card>
      <Card title="Pending Invites" subtitle="Latest first">
        <Table columns={[{key:"email",title:"Email"},{key:"code",title:"Biz Code"},{key:"role",title:"Role"},{key:"sent",title:"Sent at"}]} rows={list.map(i=>({
          email: i.email,
          code: <span className="font-mono">{i.code}</span>,
          role: i.role,
          sent: i.sent_at,
        }))} />
      </Card>
    </div>
  );
}

function OpsHealth() {
  const [ok, setOk] = useState(true);
  const [rate, setRate] = useState(0.8);
  const [last, setLast] = useState("10:32 IST");

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <Card title="Ops Number Health" subtitle="ConnectEasy-owned">
        <div className="text-sm space-y-2">
          <div>Status: {ok? <Badge variant="green">healthy</Badge> : <Badge variant="red">degraded</Badge>}</div>
          <div>Rate-limit headroom: <Badge variant={rate>0.6?"green":rate>0.3?"amber":"red"}>{Math.round(rate*100)}%</Badge></div>
          <div>Last check: {last}</div>
          <div className="flex gap-2 mt-2">
            <Button onClick={()=>{ setOk(true); setRate(0.9); setLast("just now"); }}><IconCheck/> Recheck</Button>
            <Button variant="subtle">Rotate token</Button>
          </div>
        </div>
      </Card>
      <Card title="Alerts" subtitle="Last 24h">
        <ul className="text-sm text-slate-700 space-y-1">
          <li>• 1 transient 401 from provider (auto-retry succeeded)</li>
          <li>• No delivery dips detected</li>
        </ul>
      </Card>
    </div>
  );
}

function Audits() {
  const rows = [
    { when: "11:02", who: "ops@co.com", action: "ruleset.apply", meta: "tuition-basic -> TTR-01" },
    { when: "10:58", who: "ops@co.com", action: "business.create", meta: "HPL-02" },
    { when: "10:55", who: "ops@co.com", action: "invite.send", meta: "chef@salads.io" },
  ];
  return (
    <Card title="Audit Log" subtitle="Recent actions">
      <Table columns={[{key:"when",title:"When"},{key:"who",title:"Who"},{key:"action",title:"Action"},{key:"meta",title:"Meta"}]} rows={rows} />
    </Card>
  );
}

function AdminSettings(){
  const [defaults, setDefaults] = useState({ tz:"Asia/Kolkata", quiet_start:"22:00", quiet_end:"07:00" });
  const [welcome, setWelcome] = useState("Welcome to ConnectEasy! Your business is ready.\n\nLogin URL: https://…\nSupport: support@connecteasy.in");
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <Card title="Global Defaults" subtitle="Applied on create">
        <div className="grid gap-3">
          <Field label="Timezone"><Select value={defaults.tz} onChange={e=>setDefaults({...defaults,tz:e.target.value})} options={[{value:"Asia/Kolkata",label:"Asia/Kolkata (IST)"},{value:"Asia/Dubai",label:"Asia/Dubai"}]}/></Field>
          <Field label="Quiet hours">
            <div className="grid grid-cols-2 gap-2">
              <TextInput value={defaults.quiet_start} onChange={e=>setDefaults({...defaults,quiet_start:e.target.value})}/>
              <TextInput value={defaults.quiet_end} onChange={e=>setDefaults({...defaults,quiet_end:e.target.value})}/>
            </div>
          </Field>
        </div>
      </Card>
      <Card title="Welcome Email Template" subtitle="Used by Send welcome">
        <TextArea value={welcome} onChange={e=>setWelcome(e.target.value)} />
        <div className="mt-3"><Button variant="subtle"><IconMail/> Save template</Button></div>
      </Card>
    </div>
  );
}

// ------------------ Business Ops (context mode) ------------------
function BusinessSwitcher({ businesses, active, onPick }){
  const [q, setQ] = useState("");
  const filtered = businesses.filter(b => [b.code,b.name,b.owner_email].join(" ").toLowerCase().includes(q.toLowerCase()));
  return (
    <Card title="Pick a business" subtitle="Work in one context" right={<Badge variant="violet">Business Ops</Badge>}>
      <div className="flex items-center gap-2 mb-3"><IconSearch/><TextInput value={q} onChange={e=>setQ(e.target.value)} placeholder="Search code/name/email…" style={{maxWidth:320}}/></div>
      <div className="grid md:grid-cols-2 gap-3">
        {filtered.map(b => (
          <button key={b.code} onClick={()=>onPick(b.code)} className={`text-left p-4 rounded-2xl border ${active===b.code?"border-blue-600 bg-blue-50":"border-slate-200 hover:bg-slate-50"}`}>
            <div className="flex items-center justify-between"><div className="font-semibold">{b.name}</div><Badge variant="gray">{b.code}</Badge></div>
            <div className="text-xs text-slate-600">{b.owner_email} · {b.timezone}</div>
          </button>
        ))}
      </div>
    </Card>
  );
}

function BizHeaderStrip({ biz, onSwitch }){
  return (
    <div className="flex items-center justify-between p-3 rounded-2xl border bg-white">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 text-white flex items-center justify-center shadow-sm"><IconLogo/></div>
        <div>
          <div className="font-semibold">{biz.name}</div>
          <div className="text-xs text-slate-500">{biz.code} • {biz.timezone}</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="subtle" onClick={onSwitch}><IconSwap/> Switch business</Button>
      </div>
    </div>
  );
}

function RulesetsV2Builder({ value, onChange }){
  // value: { customer_rules: [], ops_rules: [] }
  const [simpleMode, setSimpleMode] = useState(true);
  const [channel, setChannel] = useState("customer");
  const [rules, setRules] = useState(()=> ({
    customer: value?.customer_rules || [],
    ops: value?.ops_rules || []
  }));
  useEffect(()=>{ onChange({ customer_rules: rules.customer, ops_rules: rules.ops }); },[rules]);
  useEffect(()=>{ setRules({ customer: value?.customer_rules||[], ops: value?.ops_rules||[] }); },[value]);

  const addRule = () => {
    const r = { match: "contains", triggers: ["keyword"], do: "AUTOREPLY", reply_text: "Thanks!" };
    setRules(prev => ({ ...prev, [channel]: [...prev[channel], r] }));
  };
  const removeRule = (idx) => setRules(prev => ({ ...prev, [channel]: prev[channel].filter((_,i)=>i!==idx) }));
  const updateRule = (idx, patch) => setRules(prev => ({ ...prev, [channel]: prev[channel].map((r,i)=> i===idx? { ...r, ...patch }: r) }));

  const list = channel==="customer"? rules.customer : rules.ops;

  // Raw JSON editor state
  const [raw, setRaw] = useState(JSON.stringify({ customer_rules: rules.customer, ops_rules: rules.ops }, null, 2));
  const [rawErr, setRawErr] = useState("");
  useEffect(()=>{ setRaw(JSON.stringify({ customer_rules: rules.customer, ops_rules: rules.ops }, null, 2)); },[rules]);
  const loadFromRaw = () => {
    try {
      const obj = JSON.parse(raw);
      if (!obj || !obj.customer_rules || !obj.ops_rules) throw new Error("Missing keys");
      setRules({ customer: obj.customer_rules, ops: obj.ops_rules });
      setRawErr("");
    } catch(e){ setRawErr(String(e.message||e)); }
  };

  return (
    <Card title="Rulesets (v2)" subtitle="Simple builder or raw JSON" right={<div className="flex items-center gap-3"><Toggle checked={simpleMode} onChange={setSimpleMode} label="Try simple Rulesets UI (beta)"/></div>}>
      {simpleMode ? (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Field label="Channel"><Select value={channel} onChange={e=>setChannel(e.target.value)} options={[{value:"customer",label:"Customer"},{value:"ops",label:"Ops"}]}/></Field>
            <Button onClick={addRule}><IconAdd/> Add rule</Button>
          </div>

          <div className="space-y-3">
            {list.length===0 && <div className="text-sm text-slate-500">No rules yet. Add your first rule.</div>}
            {list.map((r, idx)=> (
              <div key={idx} className="p-3 rounded-xl border bg-slate-50">
                <div className="grid md:grid-cols-3 gap-3">
                  <Field label="Match">
                    <Select value={r.match} onChange={e=>updateRule(idx,{match:e.target.value})} options={[{value:"contains",label:"contains"},{value:"exact",label:"exact"}]}/>
                  </Field>
                  <Field label="Triggers" hint="comma-separated">
                    <TextInput value={(r.triggers||[]).join(', ')} onChange={e=>updateRule(idx,{triggers:e.target.value.split(',').map(s=>s.trim()).filter(Boolean)})}/>
                  </Field>
                  <Field label="Action">
                    <Select value={r.do} onChange={e=>updateRule(idx,{do:e.target.value})} options={[
                      {value:"AUTOREPLY",label:"AUTOREPLY"},
                      {value:"TEMPLATE",label:"TEMPLATE"},
                      {value:"OPS_MARK_PAID",label:"OPS_MARK_PAID"},
                      {value:"OPS_ATTEND",label:"OPS_ATTEND"},
                      {value:"NEW_ORDER",label:"NEW_ORDER"},
                      {value:"ADVANCE_ORDER",label:"ADVANCE_ORDER"},
                    ]}/>
                  </Field>
                </div>
                <div className="grid md:grid-cols-3 gap-3 mt-3">
                  {(r.do==="AUTOREPLY") && (
                    <Field label="Reply text"><TextInput value={r.reply_text||""} onChange={e=>updateRule(idx,{reply_text:e.target.value})}/></Field>
                  )}
                  {(r.do==="TEMPLATE") && (
                    <>
                      <Field label="Template ID"><TextInput value={r.template_id||""} onChange={e=>updateRule(idx,{template_id:e.target.value})}/></Field>
                      <Field label="Vars" hint="comma-separated"><TextInput value={(r.vars||[]).join(', ')} onChange={e=>updateRule(idx,{vars:e.target.value.split(',').map(s=>s.trim()).filter(Boolean)})}/></Field>
                    </>
                  )}
                  {["OPS_MARK_PAID","OPS_ATTEND","NEW_ORDER","ADVANCE_ORDER"].includes(r.do) && (
                    <Field label="Expects (help)"><TextInput value={r.expects||""} onChange={e=>updateRule(idx,{expects:e.target.value})}/></Field>
                  )}
                  <Field label="Throttle (sec)"><TextInput type="number" min={0} value={r.throttle_sec||0} onChange={e=>updateRule(idx,{throttle_sec: Number(e.target.value)||0})}/></Field>
                </div>
                <div className="mt-3 flex justify-end"><Button variant="danger" onClick={()=>removeRule(idx)}><IconX/> Remove</Button></div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Field label="Raw JSON"><TextArea value={raw} onChange={e=>setRaw(e.target.value)} /></Field>
            {rawErr && <div className="text-xs text-rose-600 mt-1">{rawErr}</div>}
            <div className="mt-2"><Button variant="subtle" onClick={loadFromRaw}><IconClipboard/> Load into builder</Button></div>
          </div>
          <div>
            <div className="text-xs text-slate-500 mb-1">Preview (parsed)</div>
            <pre className="text-xs bg-slate-50 rounded-xl p-3 overflow-auto max-h-[440px]">{raw}</pre>
          </div>
        </div>
      )}
    </Card>
  );
}

function BizSettings({ model, onChange }){
  const [tz, setTz] = useState(model.timezone||"Asia/Kolkata");
  const [quiet, setQuiet] = useState(model.quiet_hours||{start:"22:00",end:"07:00"});
  useEffect(()=>{ onChange({ ...model, timezone: tz, quiet_hours: quiet }); },[tz, quiet]);
  return (
    <Card title="Business Settings" subtitle="Timezone & quiet hours">
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Timezone"><Select value={tz} onChange={e=>setTz(e.target.value)} options={[{value:"Asia/Kolkata",label:"Asia/Kolkata (IST)"},{value:"Asia/Dubai",label:"Asia/Dubai"},{value:"Asia/Singapore",label:"Asia/Singapore"}]}/></Field>
        <Field label="Quiet hours">
          <div className="grid grid-cols-2 gap-2">
            <TextInput value={quiet.start} onChange={e=>setQuiet({...quiet,start:e.target.value})}/>
            <TextInput value={quiet.end} onChange={e=>setQuiet({...quiet,end:e.target.value})}/>
          </div>
        </Field>
      </div>
    </Card>
  );
}

function BizOpsHealth({ onRecheck }){
  const [ok, setOk] = useState(true);
  const [rate, setRate] = useState(0.85);
  const [last, setLast] = useState("10:32 IST");
  return (
    <Card title="Ops Number Health" subtitle="Per business">
      <div className="text-sm space-y-2">
        <div>Status: {ok? <Badge variant="green">healthy</Badge> : <Badge variant="red">degraded</Badge>}</div>
        <div>Rate-limit headroom: <Badge variant={rate>0.6?"green":rate>0.3?"amber":"red"}>{Math.round(rate*100)}%</Badge></div>
        <div>Last check: {last}</div>
        <div className="flex gap-2 mt-2">
          <Button onClick={()=>{ setOk(true); setRate(0.9); setLast("just now"); onRecheck&&onRecheck(); }}><IconCheck/> Recheck</Button>
          <Button variant="subtle">Rotate token</Button>
        </div>
      </div>
    </Card>
  );
}

function BizInvites({ bizCode }){
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("ADMIN");
  const [list, setList] = useState([
    { email: "ops@bright.edu", role: "ADMIN", sent_at: "today 10:05" },
  ]);
  const valid = /.+@.+/.test(email);
  const send = () => { if(!valid) return; setList([{ email, role, sent_at: "just now" }, ...list]); setEmail(""); };
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <Card title="Invite Staff" subtitle={`Business ${bizCode}`}>
        <div className="grid gap-3">
          <Field label="Email" required><TextInput value={email} onChange={e=>setEmail(e.target.value)} placeholder="user@company.com"/></Field>
          <Field label="Role" required><Select value={role} onChange={e=>setRole(e.target.value)} options={[{value:"ADMIN",label:"ADMIN"},{value:"STAFF",label:"STAFF"}]}/></Field>
          <div className="flex gap-2"><Button disabled={!valid} onClick={send}><IconMail/> Send invite</Button><Button variant="subtle">Copy invite link</Button></div>
        </div>
      </Card>
      <Card title="Pending Invites" subtitle="Latest first">
        <Table columns={[{key:"email",title:"Email"},{key:"role",title:"Role"},{key:"sent",title:"Sent at"}]} rows={list.map(i=>({ email:i.email, role:i.role, sent:i.sent_at }))} />
      </Card>
    </div>
  );
}

function BizAudits({ code, tz }){
  return (
    <Card title="Audit Log" subtitle={`Recent actions for ${code}`}>
      <Table columns={[{key:"when",title:"When"},{key:"who",title:"Who"},{key:"action",title:"Action"},{key:"meta",title:"Meta"}]} rows={[
        { when:"11:02", who:"ops@co.com", action:"ruleset.save", meta:`${code}` },
        { when:"10:58", who:"ops@co.com", action:"settings.update", meta:`TZ ${tz}` },
      ]} />
    </Card>
  );
}

const NAV_ADMIN = [
  { key: "admin_dashboard", label: "Dashboard", icon: <IconSettings/> },
  { key: "onboard", label: "Onboard Business", icon: <IconAdd/> },
  { key: "businesses", label: "Businesses", icon: <IconUsers/> },
  { key: "rulesets", label: "Rulesets", icon: <IconRules/> },
  { key: "invites", label: "Invites", icon: <IconMail/> },
  { key: "ops_health", label: "Ops Health", icon: <IconHealth/> },
  { key: "audits", label: "Audits", icon: <IconAudit/> },
  { key: "settings", label: "Settings", icon: <IconSettings/> },
];

const NAV_BIZ = [
  { key: "rulesets", label: "Rulesets", icon: <IconRules/> },
  { key: "invites", label: "Invites", icon: <IconMail/> },
  { key: "ops_health", label: "Ops Health", icon: <IconHealth/> },
  { key: "biz_settings", label: "Settings", icon: <IconSettings/> },
  { key: "audits", label: "Audits", icon: <IconAudit/> },
];

// ------------------ App Shell ------------------
const NAV = [
  { key: "admin_dashboard", label: "Dashboard", icon: <IconSettings/> },
  { key: "onboard", label: "Onboard Business", icon: <IconAdd/> },
  { key: "businesses", label: "Businesses", icon: <IconUsers/> },
  { key: "rulesets", label: "Rulesets", icon: <IconRules/> },
  { key: "invites", label: "Invites", icon: <IconMail/> },
  { key: "ops_health", label: "Ops Health", icon: <IconHealth/> },
  { key: "audits", label: "Audits", icon: <IconAudit/> },
  { key: "settings", label: "Settings", icon: <IconSettings/> },
];

function AppShell(){
  // Mode
  const [mode, setMode] = useState("biz"); // 'biz' | 'admin'

  // Data models
  const [businesses, setBusinesses] = useState(SAMPLE_BUSINESSES);
  const [activeBizCode, setActiveBizCode] = useState(""); // start with no business selected
  const activeBiz = businesses.find(b=>b.code===activeBizCode);

  // Per-biz settings (in-memory)
  const initialSettings = useMemo(()=> Object.fromEntries(businesses.map(b=>[b.code, seededSettingsFor(b)])), []);
  const [settingsByCode, setSettingsByCode] = useState(initialSettings);

  // Admin nav state
  const [adminNav, setAdminNav] = useState("onboard");

  // Biz nav state
  const [bizNav, setBizNav] = useState("rulesets");

  // Admin screens map
  const AdminScreen = {
    admin_dashboard: <AdminDashboard/>,
    onboard: <OnboardBusiness/>,
    businesses: <Businesses/>,
    rulesets: <RulesetsCatalog/>,
    invites: <Invites/>,
    ops_health: <OpsHealth/>,
    audits: <Audits/>,
    settings: <AdminSettings/>,
  }[adminNav];

  // Biz actions
  const saveBizSettings = (code, model) => setSettingsByCode(prev=> ({ ...prev, [code]: { ...prev[code], timezone: model.timezone, quiet_hours: model.quiet_hours } }));
  const saveBizKeywords = (code, keywords) => setSettingsByCode(prev=> ({ ...prev, [code]: { ...prev[code], keywords } }));

  // Biz screens
  const RulesetsScreen = () => {
    const [packPick, setPackPick] = useState(activeBiz?.ruleset||"tuition-basic");
    const [keywords, setKeywords] = useState(settingsByCode[activeBizCode]?.keywords||{customer_rules:[],ops_rules:[]});
    const applyPreset = () => {
      const pack = RULESET_CATALOG.find(p=>p.id===packPick);
      setKeywords(pack?.sample.keywords || {customer_rules:[],ops_rules:[]});
    };
    const [saved, setSaved] = useState(false);
    const doSave = () => { saveBizKeywords(activeBizCode, keywords); setSaved(true); setTimeout(()=>setSaved(false), 1200); };
    return (
      <div className="space-y-4">
        <Card title="Preset" subtitle="Load pack into builder" right={saved && <Badge variant="green">Saved</Badge>}>
          <div className="flex items-center gap-3">
            <Select value={packPick} onChange={e=>setPackPick(e.target.value)} options={RULESET_CATALOG.map(r=>({value:r.id,label:r.label}))}/>
            <Button variant="subtle" onClick={applyPreset}><IconClipboard/> Load preset</Button>
            <Button onClick={doSave}><IconCheck/> Save to business</Button>
          </div>
        </Card>
        <RulesetsV2Builder value={keywords} onChange={setKeywords} />
        <Card title="settings_json preview" subtitle="What will be stored">
          <pre className="text-xs bg-slate-50 rounded-xl p-3 overflow-auto max-h-[320px]">{JSON.stringify({ ...settingsByCode[activeBizCode], keywords }, null, 2)}</pre>
        </Card>
      </div>
    );
  };

  const BizSettingsScreen = () => {
    const model = settingsByCode[activeBizCode] || defaultBusinessSettings();
    const [draft, setDraft] = useState(model);
    const [saved, setSaved] = useState(false);
    const save = () => { saveBizSettings(activeBizCode, draft); setSaved(true); setTimeout(()=>setSaved(false), 1200); };
    return (
      <div className="space-y-4">
        <BizSettings model={draft} onChange={setDraft} />
        <div className="flex gap-2"><Button onClick={save}><IconCheck/> Save</Button>{saved && <Badge variant="green">Saved</Badge>}</div>
        <Card title="settings_json (current)" subtitle="Stored for business">
          <pre className="text-xs bg-slate-50 rounded-xl p-3 overflow-auto max-h-[320px]">{JSON.stringify(settingsByCode[activeBizCode], null, 2)}</pre>
        </Card>
      </div>
    );
  };

  const BizDailyOpsScreen = () => {
    // --- Attendance ---
    const [batches, setBatches] = useState([
      { code: "B1", at: "17:00", enrolled: 20, present: 12 },
      { code: "B2", at: "18:30", enrolled: 16, present: 8 },
    ]);
    const [openBatch, setOpenBatch] = useState(null); // code
    const setPresentTo = (code, count) => setBatches(prev => prev.map(b=> b.code===code? { ...b, present: Math.min(count, b.enrolled)}: b));

    // --- Fees / Proofs ---
    const [auto1st3rd, setAuto1st3rd] = useState(true);
    const [autoDueDay, setAutoDueDay] = useState(true);
    const [pendingProofs, setPendingProofs] = useState([]); // {phone, at}
    const [receiptToday, setReceiptToday] = useState(0);
    const simulateIPaid = () => setPendingProofs([{ phone: "+919820000003", at: "just now" }, ...pendingProofs]);
    const verifyProof = (idx) => setPendingProofs(pendingProofs.filter((_,i)=>i!==idx));
    const [paidPhone, setPaidPhone] = useState("");
    const [paidAmt, setPaidAmt] = useState("");
    const [paidNote, setPaidNote] = useState("");
    const markPaid = () => {
      if(!phoneRegex.test(paidPhone) || !Number(paidAmt)) return;
      setReceiptToday(prev => prev + Number(paidAmt));
      setPaidPhone(""); setPaidAmt(""); setPaidNote("");
    };

    // --- Enrollments & Changes ---
    const [enrollPhone, setEnrollPhone] = useState("");
    const [enrollBatch, setEnrollBatch] = useState("B1");
    const [todayEnrolls, setTodayEnrolls] = useState([]); // {phone,batch,at}
    const doEnroll = () => {
      if(!phoneRegex.test(enrollPhone)) return;
      setTodayEnrolls([{ phone: enrollPhone, batch: enrollBatch, at: "now" }, ...todayEnrolls]);
      setEnrollPhone("");
    };
    const [changePhone, setChangePhone] = useState("");
    const [changeBatch, setChangeBatch] = useState("B1");
    const [toBatch, setToBatch] = useState("B2");
    const [changes, setChanges] = useState([]); // {op, phone, detail, at}
    const doPause = () => { if(!phoneRegex.test(changePhone)) return; setChanges([{ op:"PAUSE", phone: changePhone, detail: changeBatch, at:"now"}, ...changes]); setChangePhone(""); };
    const doResume = () => { if(!phoneRegex.test(changePhone)) return; setChanges([{ op:"RESUME", phone: changePhone, detail: changeBatch, at:"now"}, ...changes]); setChangePhone(""); };
    const doMove = () => { if(!phoneRegex.test(changePhone)) return; setChanges([{ op:"MOVE", phone: changePhone, detail: `${changeBatch}→${toBatch}`, at:"now"}, ...changes]); setChangePhone(""); };

    // --- Queries & Summaries ---
    const [duePhone, setDuePhone] = useState("");
    const [dueAns, setDueAns] = useState("");
    const askDue = () => {
      if(!phoneRegex.test(duePhone)) return;
      setDueAns(`Outstanding: ₹1,500 • Due: 5th Sept`);
    };
    const [stats, setStats] = useState(null);
    const askStats = () => setStats({ attendance: `${batches.reduce((a,b)=>a+b.present,0)} / ${batches.reduce((a,b)=>a+b.enrolled,0)}`, fees: `₹${receiptToday}` });

    return (
      <div className="space-y-4">
        <Card title="A) Attendance" subtitle="Ops-first; web when needed">
          <div className="space-y-3">
            <div className="text-sm text-slate-600">WhatsApp (Ops): <code className="px-1 bg-slate-100 rounded">ATTEND B1 12</code> or <code className="px-1 bg-slate-100 rounded">ATTEND B1 +9198… +9177…</code></div>
            <div className="grid md:grid-cols-2 gap-3">
              {batches.map(b=> (
                <div key={b.code} className="p-3 rounded-2xl border bg-white">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold">Batch {b.code} • {b.at}</div>
                    <Badge variant="blue">{b.present}/{b.enrolled}</Badge>
                  </div>
                  <div className="mt-2 flex gap-2">
                    <Button variant="subtle" onClick={()=>setPresentTo(b.code, 12)}>ATTEND {b.code} 12</Button>
                    <Button onClick={()=>setOpenBatch(b.code)}>Open Web marking</Button>
                  </div>
                </div>
              ))}
            </div>
            {openBatch && (
              <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl">
                  <div className="flex items-center justify-between px-4 py-3 border-b"><h3 className="font-semibold">Mark attendance • {openBatch}</h3><button onClick={()=>setOpenBatch(null)}><IconX/></button></div>
                  <div className="p-4 space-y-2 text-sm">
                    {["Asha","Rohit","Sara","Pranav","John"].map((n,i)=> (
                      <div key={i} className="flex items-center justify-between border rounded-xl px-3 py-2">
                        <div>{n}</div>
                        <Toggle checked={i%2===0} onChange={() => {}} label="Present"/>
                      </div>
                    ))}
                    <div className="flex justify-end gap-2 mt-2"><Button variant="subtle" onClick={()=>setOpenBatch(null)}>Close</Button><Button onClick={()=>{ setPresentTo(openBatch, Math.min(15, batches.find(b=>b.code===openBatch)?.enrolled||0)); setOpenBatch(null); }}><IconCheck/> Save</Button></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>

        <Card title="B) Fees / Reminders / Proofs" subtitle="Auto-reminders & quick actions">
          <div className="grid lg:grid-cols-2 gap-4 items-start">
            <div className="space-y-3">
              <div className="p-3 rounded-xl border bg-white text-sm">
                <div className="font-medium mb-2">Auto-reminders (customer channel)</div>
                <div className="flex items-center justify-between"><span>1st & 3rd of month</span><Toggle checked={auto1st3rd} onChange={setAuto1st3rd}/></div>
                <div className="flex items-center justify-between mt-1"><span>Due day (5th)</span><Toggle checked={autoDueDay} onChange={setAutoDueDay}/></div>
              </div>
              <div className="p-3 rounded-xl border bg-white text-sm">
                <div className="font-medium mb-2">Quick action (Ops WhatsApp)</div>
                <div className="text-slate-600 text-xs mb-2">Command: <code className="px-1 bg-slate-100 rounded">PAID +919876543210 2500 UPI TXN5213</code></div>
                <div className="grid md:grid-cols-3 gap-2">
                  <TextInput value={paidPhone} onChange={e=>setPaidPhone(e.target.value)} placeholder="+91…"/>
                  <TextInput type="number" value={paidAmt} onChange={e=>setPaidAmt(e.target.value)} placeholder="Amount"/>
                  <TextInput value={paidNote} onChange={e=>setPaidNote(e.target.value)} placeholder="Note (optional)"/>
                </div>
                <div className="mt-2"><Button onClick={markPaid}><IconCheck/> Mark paid</Button></div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="p-3 rounded-xl border bg-white text-sm">
                <div className="font-medium mb-2">Incoming proofs</div>
                <div className="text-xs text-slate-600 mb-2">Student reply "I paid" + screenshot → attach to latest DUE invoice, set <i>Payment Pending Verification</i></div>
                <div className="flex gap-2 mb-2"><Button variant="subtle" onClick={simulateIPaid}>Simulate "I PAID" + screenshot</Button></div>
                {pendingProofs.length===0 ? <div className="text-xs text-slate-500">No pending proofs</div> : (
                  <ul className="text-sm space-y-2">
                    {pendingProofs.map((p,i)=> (
                      <li key={i} className="flex items-center gap-2"><Badge variant="blue">{p.at}</Badge><span className="font-mono">{p.phone}</span><Button variant="success" onClick={()=>verifyProof(i)}><IconCheck/> Verify</Button></li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="p-3 rounded-xl border bg-white text-sm">
                <div className="font-medium mb-1">Today</div>
                <div>Receipts: <Badge variant="green">₹{receiptToday}</Badge></div>
                <div>Tag updates: <Badge variant="violet">PAID-THIS-MONTH</Badge> (simulated)</div>
              </div>
            </div>
          </div>
        </Card>

        <Card title="C) Enrollments & Changes" subtitle="Create & modify">
          <div className="grid lg:grid-cols-2 gap-4 items-start">
            <div className="space-y-3">
              <div className="p-3 rounded-xl border bg-white text-sm">
                <div className="font-medium mb-2">ENROLL +phone B#</div>
                <div className="grid md:grid-cols-3 gap-2">
                  <TextInput value={enrollPhone} onChange={e=>setEnrollPhone(e.target.value)} placeholder="+91…"/>
                  <Select value={enrollBatch} onChange={e=>setEnrollBatch(e.target.value)} options={[{value:"B1",label:"B1"},{value:"B2",label:"B2"}]}/>
                  <Button onClick={doEnroll}><IconCheck/> Enroll</Button>
                </div>
                <div className="text-xs text-slate-500 mt-2">Creates contact (if needed), adds enrollment, sends welcome template.</div>
              </div>
              <div className="p-3 rounded-xl border bg-white text-sm">
                <div className="font-medium mb-2">PAUSE / RESUME</div>
                <div className="grid md:grid-cols-4 gap-2 items-end">
                  <TextInput value={changePhone} onChange={e=>setChangePhone(e.target.value)} placeholder="+91…"/>
                  <Select value={changeBatch} onChange={e=>setChangeBatch(e.target.value)} options={[{value:"B1",label:"B1"},{value:"B2",label:"B2"}]}/>
                  <Button variant="subtle" onClick={doPause}>PAUSE</Button>
                  <Button variant="success" onClick={doResume}>RESUME</Button>
                </div>
              </div>
              <div className="p-3 rounded-xl border bg-white text-sm">
                <div className="font-medium mb-2">MOVE</div>
                <div className="grid md:grid-cols-5 gap-2 items-end">
                  <TextInput value={changePhone} onChange={e=>setChangePhone(e.target.value)} placeholder="+91…"/>
                  <Select value={changeBatch} onChange={e=>setChangeBatch(e.target.value)} options={[{value:"B1",label:"B1"},{value:"B2",label:"B2"}]}/>
                  <div className="flex items-center justify-center text-slate-400">→</div>
                  <Select value={toBatch} onChange={e=>setToBatch(e.target.value)} options={[{value:"B1",label:"B1"},{value:"B2",label:"B2"}]}/>
                  <Button onClick={doMove}><IconCheck/> Move</Button>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <Card title="Today’s Enrollments" subtitle="Latest first">
                <Table columns={[{key:"when",title:"When"},{key:"phone",title:"Phone"},{key:"batch",title:"Batch"}]} rows={todayEnrolls.map(e=>({ when:e.at, phone:<span className="font-mono">{e.phone}</span>, batch:e.batch }))} />
              </Card>
              <Card title="Batch Changes" subtitle="Pause/Resume/Move">
                <Table columns={[{key:"when",title:"When"},{key:"op",title:"Op"},{key:"phone",title:"Phone"},{key:"detail",title:"Detail"}]} rows={changes.map(c=>({ when:c.at, op:c.op, phone:<span className="font-mono">{c.phone}</span>, detail:c.detail }))} />
              </Card>
            </div>
          </div>
        </Card>

        <Card title="D) Queries & Summaries" subtitle="DUE / STATS TODAY / Daily summary">
          <div className="grid lg:grid-cols-2 gap-4 items-start">
            <div className="space-y-3">
              <div className="p-3 rounded-xl border bg-white text-sm">
                <div className="font-medium mb-2">DUE +phone</div>
                <div className="flex gap-2 items-end">
                  <TextInput value={duePhone} onChange={e=>setDuePhone(e.target.value)} placeholder="+91…"/>
                  <Button onClick={askDue}>Ask</Button>
                </div>
                {dueAns && <div className="mt-2 text-slate-700 text-sm">{dueAns}</div>}
              </div>
              <div className="p-3 rounded-xl border bg-white text-sm">
                <div className="font-medium mb-2">STATS TODAY</div>
                <Button variant="subtle" onClick={askStats}>Fetch</Button>
                {stats && (
                  <div className="mt-2 text-sm">
                    <div>Attendance: <b>{stats.attendance}</b></div>
                    <div>Fees received: <b>{stats.fees}</b></div>
                  </div>
                )}
              </div>
            </div>
            <div className="p-3 rounded-2xl border bg-white text-sm">
              <div className="font-medium mb-2">Daily Summary</div>
              <div className="text-slate-600 mb-2">Owner at <b>8:30 PM IST</b>: Attendance by batch, Fees collected today, Overdue count.</div>
              <div className="flex gap-2"><Button variant="subtle">Send preview (mock)</Button><Button>Configure recipients</Button></div>
            </div>
          </div>
        </Card>
      </div>
    );
  };

  // ---------- Render for Biz mode ----------
  const BizScreen = {
    daily: <BizDailyOpsScreen/> ,
    rulesets: <RulesetsScreen/> ,
    invites: <BizInvites bizCode={activeBizCode}/> ,
    ops_health: <BizOpsHealth/> ,
    biz_settings: <BizSettingsScreen/> ,
    audits: <BizAudits code={activeBizCode} tz={activeBiz?.timezone}/> ,
  }[bizNav];

  // ---------- Return layout ----------
  return (
    <div className="min-h-[100svh] bg-slate-50 text-slate-900">
      {/* Top Bar */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 text-white flex items-center justify-center shadow-sm"><IconLogo/></div>
            <div>
              <div className="font-semibold">ConnectEasy • Ops Console</div>
              <div className="text-xs text-slate-500">Admin & Business Ops</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="subtle" onClick={()=> setMode(mode==="admin"?"biz":"admin")}>{mode==="admin"?"Switch to Business Ops":"Switch to Admin"}</Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 grid md:grid-cols-[240px_1fr] gap-6">
        {mode === "admin" ? (
          <>
            <aside className="bg-white rounded-2xl border border-slate-100 shadow-sm p-3 h-fit sticky top-20">
              <nav className="space-y-1">
                {NAV_ADMIN.map(item => (
                  <button key={item.key} onClick={()=>setAdminNav(item.key)} className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm ${adminNav===item.key?"bg-slate-900 text-white":"hover:bg-slate-100"}`}>
                    {item.icon}<span>{item.label}</span>
                  </button>
                ))}
              </nav>
            </aside>
            <main className="space-y-6">
              {AdminScreen}
              <footer className="text-xs text-slate-500 pt-2">Static • No network • Updated: 15 Aug 2025 • IST</footer>
            </main>
          </>
        ) : (
          <>
            <aside className="bg-white rounded-2xl border border-slate-100 shadow-sm p-3 h-fit sticky top-20">
              <nav className="space-y-1">
                {[{key:"daily",label:"Daily Ops",icon:<IconRules/>},...NAV_BIZ].map(item => (
                  <button key={item.key} onClick={()=>setBizNav(item.key)} className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm ${bizNav===item.key?"bg-slate-900 text-white":"hover:bg-slate-100"}`}>
                    {item.icon}<span>{item.label}</span>
                  </button>
                ))}
              </nav>
              <div className="mt-3 p-3 rounded-xl bg-gradient-to-br from-blue-50 to-violet-50 text-sm">
                <div className="font-medium mb-1">Daily flow quick links</div>
                <ul className="list-disc pl-5 text-slate-700 space-y-1">
                  <li>Attendance</li>
                  <li>Fees & Proofs</li>
                  <li>Enrollments & Changes</li>
                  <li>Queries & Summary</li>
                </ul>
              </div>
            </aside>
            <main className="space-y-6">
              {!activeBiz ? (
                <BusinessSwitcher businesses={businesses} active={activeBizCode} onPick={setActiveBizCode} />
              ) : (
                <>
                  <BizHeaderStrip biz={activeBiz} onSwitch={()=> setActiveBizCode("")} />
                  {BizScreen}
                  <footer className="text-xs text-slate-500 pt-2">Static • No network • Updated: 15 Aug 2025 • IST</footer>
                </>
              )}
            </main>
          </>
        )}
      </div>
    </div>
  );
}

export default function OpsAdminConsole(){
  useEffect(()=>{ document.body.classList.add("bg-slate-50"); return ()=> document.body.classList.remove("bg-slate-50"); },[]);
  return <AppShell/>;
}
