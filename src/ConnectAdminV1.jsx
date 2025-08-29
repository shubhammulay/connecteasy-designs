import React, { useEffect, useMemo, useState } from "react";

/**
 * ConnectEasy – Ops Admin Console (static)
 * -------------------------------------------------------------
 * Purpose
 *  - Internal console for onboarding businesses and managing rulesets.
 *  - Adds a simpler "Rulesets v2" builder with a toggle to fall back to raw JSON (v1).
 *  - No backend calls; safe demo you can wire later.
 *
 * Screens
 *  - Businesses (list)
 *  - Onboard (create + seed settings)
 *  - Rulesets (v2 builder <-> v1 JSON toggle)
 *  - Invites (ops staff, customer links – static)
 *  - Ops Health (token & webhook mock)
 *  - Audits (recent actions – static)
 *  - Settings (console prefs)
 *
 * Notes
 *  - No external deps; icons inline SVG; Tailwind-like classes.
 *  - Keep everything in one file for easy copy/paste.
 */

// ------------------ Minimal Inline Icons ------------------
const icon = "w-5 h-5 inline-block align-text-bottom";
const IconLogo = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z"/>
    <path d="M12 7v10M8 9.5l8 4"/>
  </svg>
);
const IconBiz = () => (<svg viewBox="0 0 24 24" className={icon} fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 21h18M5 21V5a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2v16"/><path d="M9 9h2M9 13h2M15 9h2M15 13h2"/></svg>);
const IconAdd = () => (<svg viewBox="0 0 24 24" className={icon} fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 5v14M5 12h14"/></svg>);
const IconRules = () => (<svg viewBox="0 0 24 24" className={icon} fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 8h10M7 12h6M7 16h10"/></svg>);
const IconInvite = () => (<svg viewBox="0 0 24 24" className={icon} fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4z"/><path d="M20 21v-1a5 5 0 0 0-5-5H9a5 5 0 0 0-5 5v1"/></svg>);
const IconHealth = () => (<svg viewBox="0 0 24 24" className={icon} fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 12h5l2-5 4 10 2-5h5"/></svg>);
const IconAudit = () => (<svg viewBox="0 0 24 24" className={icon} fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>);
const IconSettings = () => (<svg viewBox="0 0 24 24" className={icon} fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 15a3 3 0 1 0-3-3 3 3 0 0 0 3 3z"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.07a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.07a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06A2 2 0 1 1 7.02 4.4l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.07a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c0 .66.39 1.26 1 1.51.31.13.65.2 1 .2H21a2 2 0 1 1 0 4h-.07a1.65 1.65 0 0 0-1.51 1z"/></svg>);
const IconCheck = () => (<svg viewBox="0 0 24 24" className={icon} fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 13l4 4L19 7"/></svg>);
const IconX = () => (<svg viewBox="0 0 24 24" className={icon} fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 6l12 12M18 6l-12 12"/></svg>);

// ------------------ Primitives ------------------
const Badge = ({ children, variant = "default" }) => {
  const cls = {
    default: "bg-slate-100 text-slate-700",
    green: "bg-emerald-100 text-emerald-700",
    amber: "bg-amber-100 text-amber-700",
    red: "bg-rose-100 text-rose-700",
    blue: "bg-blue-100 text-blue-700",
    violet: "bg-violet-100 text-violet-700",
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
    <button onClick={() => onChange(!checked)} className={`w-10 h-6 rounded-full p-0.5 transition ${checked?"bg-blue-600":"bg-slate-300"}`}>
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

// ------------------ Sample Data ------------------
const SAMPLE_BUSINESSES = [
  { name: "BrightTuition", code: "TTR-01", type: "Tuition", timezone: "Asia/Kolkata" },
  { name: "Leafy Salad Kitchen", code: "LSK-11", type: "Kitchen", timezone: "Asia/Kolkata" },
];

// ------------------ Screens ------------------
function Businesses(){
  const cols = [
    { key: "name", title: "Name" },
    { key: "code", title: "Code" },
    { key: "type", title: "Type" },
    { key: "tz", title: "Timezone" },
    { key: "actions", title: "Actions" },
  ];
  const rows = SAMPLE_BUSINESSES.map(b => ({
    name: <div className="font-medium">{b.name}</div>,
    code: b.code,
    type: b.type,
    tz: b.timezone,
    actions: <div className="flex gap-2"><Button variant="subtle">Open rules</Button><Button variant="subtle">Invite</Button></div>
  }));

  return (
    <div className="space-y-4">
      <Card title="Businesses" subtitle="Ops-managed tenants" right={<Button><IconAdd/> New</Button>}>
        <Table columns={cols} rows={rows}/>
      </Card>
    </div>
  );
}

function Onboard(){
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [type, setType] = useState("Tuition");
  const [tz, setTz] = useState("Asia/Kolkata");

  return (
    <div className="space-y-4">
      <Card title="Onboard Business" subtitle="Create + seed settings">
        <div className="grid md:grid-cols-2 gap-3">
          <Field label="Business name" required><TextInput value={name} onChange={e=>setName(e.target.value)} placeholder="e.g., BrightTuition"/></Field>
          <Field label="Business code" required><TextInput value={code} onChange={e=>setCode(e.target.value)} placeholder="e.g., TTR-01"/></Field>
          <Field label="Type" required>
            <Select value={type} onChange={e=>setType(e.target.value)} options={[{value:"Tuition",label:"Tuition"},{value:"Kitchen",label:"Cloud Kitchen"}]}/>
          </Field>
          <Field label="Timezone" required>
            <Select value={tz} onChange={e=>setTz(e.target.value)} options={[{value:"Asia/Kolkata",label:"Asia/Kolkata (IST)"},{value:"Asia/Dubai",label:"Asia/Dubai"},{value:"Asia/Singapore",label:"Asia/Singapore"}]}/>
          </Field>
        </div>
        <div className="mt-3 flex gap-2">
          <Button variant="primary"><IconCheck/> Create</Button>
          <Button variant="subtle">Seed defaults</Button>
        </div>
      </Card>
    </div>
  );
}

function Rulesets(){
  // v2 toggle – simple builder vs raw JSON (v1)
  const [useV2, setUseV2] = useState(true);
  const [targetBiz, setTargetBiz] = useState("TTR-01");

  // Presets kept minimal; extend later.
  const PRESET_RULESETS = {
    Tuition: {
      keywords: {
        customer_rules: [
          { match: "contains", triggers: ["fees","due"], do: "TEMPLATE", template_id: "tmpl-fee-reminder-uuid", vars: ["{{name}}","{{due_amount}}"] },
          { match: "contains", triggers: ["paid","payment done"], do: "AUTOREPLY", reply_text: "Thanks! We'll verify and confirm." }
        ],
        ops_rules: [
          { match: "exact", triggers: ["PAID"], do: "OPS_MARK_PAID", throttle_sec: 2 },
          { match: "contains", triggers: ["ATTEND"], do: "OPS_ATTEND" }
        ]
      }
    },
    Kitchen: {
      keywords: {
        customer_rules: [
          { match: "contains", triggers: ["menu","order"], do: "TEMPLATE", template_id: "tmpl-menu-list" }
        ],
        ops_rules: [
          { match: "contains", triggers: ["NEW "], do: "NEW_ORDER" },
          { match: "exact", triggers: ["PREP","READY","OUT","DONE","CANCEL"], do: "ADVANCE_ORDER" }
        ]
      }
    },
    Empty: { keywords: { customer_rules: [], ops_rules: [] } }
  };

  const [preset, setPreset] = useState("Tuition");
  const [customerRules, setCustomerRules] = useState(PRESET_RULESETS["Tuition"].keywords.customer_rules);
  const [opsRules, setOpsRules] = useState(PRESET_RULESETS["Tuition"].keywords.ops_rules);

  useEffect(()=>{
    setCustomerRules(structuredClone(PRESET_RULESETS[preset].keywords.customer_rules));
    setOpsRules(structuredClone(PRESET_RULESETS[preset].keywords.ops_rules));
  },[preset]);

  const ACTIONS = ["AUTOREPLY","TEMPLATE","MEDIA","OPS_MARK_PAID","OPS_ATTEND","NEW_ORDER","ADVANCE_ORDER"];
  const MATCHES = ["exact","contains","startswith"]; 

  const toSettingsJson = useMemo(()=>({
    keywords: { customer_rules: customerRules, ops_rules: opsRules }
  }),[customerRules, opsRules]);

  const RuleRow = ({row, onChange, onRemove}) => {
    const update = (patch) => onChange({ ...row, ...patch });
    const extras = () => {
      if (row.do === "AUTOREPLY") {
        return (
          <Field label="Reply text" hint="Plain text">
            <TextInput value={row.reply_text||""} onChange={e=>update({reply_text:e.target.value})} placeholder="Thanks! We received it."/>
          </Field>
        );
      }
      if (row.do === "TEMPLATE") {
        return (
          <div className="grid md:grid-cols-2 gap-2">
            <Field label="Template ID"><TextInput value={row.template_id||""} onChange={e=>update({template_id:e.target.value})} placeholder="tmpl-..."/></Field>
            <Field label="Vars (comma)"><TextInput value={(row.vars||[]).join(", ")} onChange={e=>update({vars:e.target.value.split(",").map(s=>s.trim()).filter(Boolean)})} placeholder="{{1}}, {{2}}"/></Field>
          </div>
        );
      }
      return null;
    };

    return (
      <div className="rounded-xl border p-3 bg-white">
        <div className="grid md:grid-cols-12 gap-2 items-end">
          <div className="md:col-span-2">
            <Field label="Match"><Select value={row.match} onChange={e=>update({match:e.target.value})} options={MATCHES.map(m=>({value:m,label:m}))}/></Field>
          </div>
          <div className="md:col-span-4">
            <Field label="Triggers" hint="comma-separated"><TextInput value={(row.triggers||[]).join(", ")} onChange={e=>update({triggers:e.target.value.split(",").map(s=>s.trim()).filter(Boolean)})} placeholder="paid, payment done"/></Field>
          </div>
          <div className="md:col-span-3">
            <Field label="Action"><Select value={row.do} onChange={e=>update({do:e.target.value})} options={ACTIONS.map(a=>({value:a,label:a}))}/></Field>
          </div>
          <div className="md:col-span-2">
            <Field label="Throttle (s)"><TextInput type="number" min={0} value={row.throttle_sec||""} onChange={e=>update({throttle_sec: e.target.value? Number(e.target.value): undefined})} placeholder="0"/></Field>
          </div>
          <div className="md:col-span-1 flex justify-end">
            <Button variant="danger" onClick={onRemove}>Remove</Button>
          </div>
        </div>
        <div className="mt-2">{extras()}</div>
      </div>
    );
  };

  const addRule = (where) => {
    const base = { match: "contains", triggers: ["keyword"], do: "AUTOREPLY", reply_text: "Thanks!" };
    if (where === "customer") setCustomerRules(prev=>[...prev, base]);
    else setOpsRules(prev=>[...prev, base]);
  };
  const updateRule = (where, idx, next) => {
    const updater = (arr)=> arr.map((r,i)=> i===idx? next: r);
    if (where === "customer") setCustomerRules(prev=>updater(prev));
    else setOpsRules(prev=>updater(prev));
  };
  const removeRule = (where, idx) => {
    const remover = (arr)=> arr.filter((_,i)=> i!==idx);
    if (where === "customer") setCustomerRules(prev=>remover(prev));
    else setOpsRules(prev=>remover(prev));
  };

  // V1 raw JSON editor (kept in sync with v2 when enabled)
  const [raw, setRaw] = useState(JSON.stringify(toSettingsJson, null, 2));
  useEffect(()=>{ if (useV2) setRaw(JSON.stringify(toSettingsJson, null, 2)); }, [toSettingsJson, useV2]);
  const loadRaw = () => {
    try {
      const parsed = JSON.parse(raw);
      setCustomerRules(parsed?.keywords?.customer_rules || []);
      setOpsRules(parsed?.keywords?.ops_rules || []);
      setUseV2(true);
    } catch(e) {
      alert("Invalid JSON");
    }
  };

  return (
    <div className="space-y-4">
      <Card title="Rulesets" subtitle="Attach keyword → action rules to a business" right={
        <div className="flex items-center gap-2">
          <Field label="Business"><Select value={targetBiz} onChange={e=>setTargetBiz(e.target.value)} options={SAMPLE_BUSINESSES.map(b=>({value:b.code,label:`${b.name} (${b.code})`}))}/></Field>
          <Badge variant={useV2?"blue":"amber"}>{useV2?"V2 Builder":"V1 JSON"}</Badge>
          <Toggle checked={useV2} onChange={setUseV2} label="Try simple Rulesets UI (beta)"/>
        </div>
      }>
        <div className="space-y-3">
          <div className="grid md:grid-cols-3 gap-3">
            <Field label="Preset">
              <Select value={preset} onChange={e=>setPreset(e.target.value)} options={[{value:"Tuition",label:"Tuition"},{value:"Kitchen",label:"Cloud Kitchen"},{value:"Empty",label:"Empty"}]}/>
            </Field>
            <div className="flex items-end"><Button variant="subtle">Reset to preset</Button></div>
            <div className="flex items-end"><Button variant="primary"><IconCheck/> Assign to {targetBiz}</Button></div>
          </div>

          {useV2 ? (
            <div className="space-y-4">
              <Card title="Customer Rules" subtitle="End-user channel">
                <div className="space-y-3">
                  {customerRules.length===0 && <div className="text-sm text-slate-500">No rules. Add your first rule.</div>}
                  {customerRules.map((r,idx)=> (
                    <RuleRow key={idx} row={r} onChange={(nr)=>updateRule("customer", idx, nr)} onRemove={()=>removeRule("customer", idx)} />
                  ))}
                  <Button onClick={()=>addRule("customer")}>+ Add customer rule</Button>
                </div>
              </Card>

              <Card title="Ops Rules" subtitle="Internal Ops number">
                <div className="space-y-3">
                  {opsRules.length===0 && <div className="text-sm text-slate-500">No rules. Add your first rule.</div>}
                  {opsRules.map((r,idx)=> (
                    <RuleRow key={idx} row={r} onChange={(nr)=>updateRule("ops", idx, nr)} onRemove={()=>removeRule("ops", idx)} />
                  ))}
                  <Button onClick={()=>addRule("ops")}>+ Add ops rule</Button>
                </div>
              </Card>

              <Card title="Preview (settings_json)" subtitle="Auto-synced">
                <pre className="text-xs bg-slate-50 p-3 rounded-xl overflow-auto">{JSON.stringify(toSettingsJson, null, 2)}</pre>
                <div className="flex gap-2 mt-3">
                  <Button variant="primary">Save draft (static)</Button>
                  <Button variant="subtle">Use as seed</Button>
                </div>
              </Card>
            </div>
          ) : (
            <div className="space-y-3">
              <Field label="Raw JSON (V1)"><TextArea value={raw} onChange={e=>setRaw(e.target.value)} className="min-h-[280px] font-mono"/></Field>
              <div className="flex gap-2">
                <Button onClick={loadRaw}><IconCheck/> Load into builder</Button>
                <Button variant="subtle">Save draft (static)</Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

function Invites(){
  return (
    <div className="space-y-4">
      <Card title="Ops Staff Invites" subtitle="Send email/SMS invites (static)">
        <div className="grid md:grid-cols-3 gap-3">
          <Field label="Business"><Select options={SAMPLE_BUSINESSES.map(b=>({value:b.code,label:`${b.name} (${b.code})`}))}/></Field>
          <Field label="Staff email"><TextInput placeholder="ops@example.com"/></Field>
          <div className="flex items-end"><Button variant="primary">Send invite</Button></div>
        </div>
      </Card>
      <Card title="Customer Opt-in Link" subtitle="For NEEDS_OPT_IN cohorts">
        <div className="flex items-center gap-2"><TextInput defaultValue="https://wa.me/1?text=START+BRIGHT"/><Button variant="subtle">Copy</Button></div>
      </Card>
    </div>
  );
}

function OpsHealth(){
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <Card title="Channel Tokens" subtitle="Health checks">
        <div className="grid gap-2 text-sm">
          <div>Customer number: <Badge variant="green">OK</Badge></div>
          <div>Ops number: <Badge variant="green">OK</Badge></div>
          <div>Webhook: <Badge variant="amber">WARN</Badge> (retrying)</div>
          <div className="pt-2"><Button variant="subtle">Re-check</Button></div>
        </div>
      </Card>
      <Card title="Inbound Activity" subtitle="Last 24h">
        <div className="text-sm">Messages: 412 • Failures: 3 • Avg latency: 240ms</div>
      </Card>
    </div>
  );
}

function Audits(){
  const items = [
    { at: "10:11", who: "ops@ce", what: "Assigned Tuition preset to TTR-01" },
    { at: "09:02", who: "ops@ce", what: "Invited staff maya@… for LSK-11" },
    { at: "Yesterday", who: "ops@ce", what: "Updated template ids for TTR-01" },
  ];
  return (
    <div className="space-y-4">
      <Card title="Recent Audits" subtitle="Last 30 items">
        <ul className="text-sm space-y-2">
          {items.map((it,i)=> <li key={i} className="flex items-center gap-3"><Badge variant="blue">{it.at}</Badge><div>{it.what}</div><span className="text-slate-500 text-xs ml-auto">{it.who}</span></li>)}
        </ul>
      </Card>
    </div>
  );
}

function ConsoleSettings(){
  const [compact, setCompact] = useState(false);
  const [dense, setDense] = useState(false);
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <Card title="Console Preferences" subtitle="Local-only">
        <div className="space-y-3">
          <Toggle checked={compact} onChange={setCompact} label="Compact sidebar"/>
          <Toggle checked={dense} onChange={setDense} label="Denser tables"/>
          <div className="text-xs text-slate-500">(Visual only for this demo.)</div>
        </div>
      </Card>
      <Card title="About" subtitle="Build info">
        <div className="text-sm text-slate-600">ConnectEasy Ops Console • Static demo • v0.3</div>
      </Card>
    </div>
  );
}

// ------------------ App Shell ------------------
const NAV = [
  { key: "businesses", label: "Businesses", icon: <IconBiz/> },
  { key: "onboard", label: "Onboard", icon: <IconAdd/> },
  { key: "rules", label: "Rulesets", icon: <IconRules/> },
  { key: "invites", label: "Invites", icon: <IconInvite/> },
  { key: "health", label: "Ops Health", icon: <IconHealth/> },
  { key: "audits", label: "Audits", icon: <IconAudit/> },
  { key: "settings", label: "Settings", icon: <IconSettings/> },
];

function AppShell(){
  const [active, setActive] = useState("rules");
  const Screen = {
    businesses: <Businesses/>,
    onboard: <Onboard/>,
    rules: <Rulesets/>,
    invites: <Invites/>,
    health: <OpsHealth/>,
    audits: <Audits/>,
    settings: <ConsoleSettings/>,
  }[active];

  return (
    <div className="min-h-[100svh] bg-slate-50 text-slate-900">
      {/* Top Bar */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 text-white flex items-center justify-center shadow-sm">
              <IconLogo/>
            </div>
            <div>
              <div className="font-semibold">ConnectEasy • Ops Console</div>
              <div className="text-xs text-slate-500">Onboard & Manage Rulesets</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-slate-200" title="Ops"/>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 grid md:grid-cols-[240px_1fr] gap-6">
        <aside className="bg-white rounded-2xl border border-slate-100 shadow-sm p-3 h-fit sticky top-20">
          <nav className="space-y-1">
            {NAV.map(item => (
              <button key={item.key} onClick={()=>setActive(item.key)} className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm ${active===item.key?"bg-slate-900 text-white":"hover:bg-slate-100"}`}>
                {item.icon}<span>{item.label}</span>
              </button>
            ))}
          </nav>
          <div className="mt-3 p-3 rounded-xl bg-gradient-to-br from-blue-50 to-violet-50 text-sm">
            <div className="font-medium mb-1">What’s new</div>
            <ul className="list-disc pl-5 text-slate-700 space-y-1">
              <li>Rulesets v2 builder with simple form</li>
              <li>Toggle back to JSON (v1)</li>
            </ul>
          </div>
        </aside>
        <main className="space-y-6">
          {Screen}
          <footer className="text-xs text-slate-500 pt-2">Static • No network • Updated: 14 Aug 2025 • IST</footer>
        </main>
      </div>
    </div>
  );
}

export default function OpsAdminConsole(){
  useEffect(()=>{ document.body.classList.add("bg-slate-50"); return ()=> document.body.classList.remove("bg-slate-50"); },[]);
  return <AppShell/>;
}
