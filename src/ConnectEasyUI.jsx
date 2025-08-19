import React, { useMemo, useState, useEffect } from "react";

/**
 * ConnectEasy – Static MVP UI
 * -------------------------------------------------------------
 * This is a single-file, static React prototype that implements
 * a neat, clean, production-style UI aligned to the BRD v1.2.
 * - SPA shell with sidebar navigation
 * - Screens: Dashboard, Contacts & Tags, Templates, Campaigns, Inbox, Ops, Analytics, Billing, Settings, Onboarding
 * - Campaign stepper (Template → Audience → Schedule → Preview → Send)
 * - Client-side validations for template rules (kebab-case name, contiguous placeholders)
 * - Quiet hours + 24-hour window behavior simulated in UI
 * - Policy guardrails visually represented (STOP, NEEDS_OPT_IN exclusions)
 * - CSV Import & Tag Merge modals (static demo)
 * - Clean Tailwind design, rounded 2xl, soft shadows
 *
 * Notes:
 * - Static only; no backend or external state. Safe to click around.
 * - Icons are inline to avoid external deps. Tailwind classes used.
 * - Replace placeholders/images as desired. Designed to print or share as wireframes.
 */

// ------------------ Minimal Inline Icons (no external deps) ------------------
const iconCls = "w-5 h-5 inline-block align-text-bottom";
const IconLogo = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z"/>
    <path d="M12 7v10M8 9.5l8 4"/>
  </svg>
);
const IconUsers = () => (
  <svg viewBox="0 0 24 24" className={iconCls} fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm6 8v-1a4 4 0 0 0-4-4H10a4 4 0 0 0-4 4v1"/></svg>
);
const IconTag = () => (
  <svg viewBox="0 0 24 24" className={iconCls} fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 10l-8 8-8-8V4h6z"/><circle cx="8" cy="8" r="1"/></svg>
);
const IconTemplate = () => (
  <svg viewBox="0 0 24 24" className={iconCls} fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>
);
const IconCampaign = () => (
  <svg viewBox="0 0 24 24" className={iconCls} fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 10V6a2 2 0 0 1 2-2h6l6 6v8a2 2 0 0 1-2 2H10"/><path d="M10 4v4a2 2 0 0 0 2 2h4"/></svg>
);
const IconInbox = () => (
  <svg viewBox="0 0 24 24" className={iconCls} fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 13l2-8h14l2 8v6H3z"/><path d="M3 13h5a4 4 0 0 0 8 0h5"/></svg>
);
const IconOps = () => (
  <svg viewBox="0 0 24 24" className={iconCls} fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="9"/><path d="M8 12l2 2 4-4"/></svg>
);
const IconAnalytics = () => (
  <svg viewBox="0 0 24 24" className={iconCls} fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 19V5M10 19V9M16 19V13M22 19H2"/></svg>
);
const IconBilling = () => (
  <svg viewBox="0 0 24 24" className={iconCls} fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 9h18"/></svg>
);
const IconSettings = () => (
  <svg viewBox="0 0 24 24" className={iconCls} fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 15a3 3 0 1 0-3-3 3 3 0 0 0 3 3z"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.07a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.07a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06A2 2 0 1 1 7.02 4.4l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.07a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c0 .66.39 1.26 1 1.51.31.13.65.2 1 .2H21a2 2 0 1 1 0 4h-.07a1.65 1.65 0 0 0-1.51 1z"/></svg>
);
const IconSearch = () => (
  <svg viewBox="0 0 24 24" className={iconCls} fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></svg>
);
const IconUpload = () => (
  <svg viewBox="0 0 24 24" className={iconCls} fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 15V3"/><path d="M7 8l5-5 5 5"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/></svg>
);
const IconCalendar = () => (
  <svg viewBox="0 0 24 24" className={iconCls} fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
);
const IconPlay = () => (
  <svg viewBox="0 0 24 24" className={iconCls} fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
);
const IconSend = () => (
  <svg viewBox="0 0 24 24" className={iconCls} fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>
);
const IconCheck = () => (
  <svg viewBox="0 0 24 24" className={iconCls} fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 13l4 4L19 7"/></svg>
);
const IconX = () => (
  <svg viewBox="0 0 24 24" className={iconCls} fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 6l12 12M18 6l-12 12"/></svg>
);
const IconClock = () => (
  <svg viewBox="0 0 24 24" className={iconCls} fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="9"/><path d="M12 7v6l4 2"/></svg>
);

// ------------------ Helpers ------------------
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
const sampleContacts = [
  { name: "Asha Patil", phone: "+919820000001", tags: ["fees-due", "batch-a"], consent: "OPTED_IN" },
  { name: "Rohit Verma", phone: "+919820000002", tags: ["paid", "batch-a"], consent: "OPTED_IN" },
  { name: "Sara Khan", phone: "+919820000003", tags: ["needs_review"], consent: "NEEDS_OPT_IN" },
  { name: "Parent (Pranav)", phone: "+919820000004", tags: ["stop"], consent: "UNSUBSCRIBED" },
];

const sampleTemplates = [
  { name: "fee_reminder_aug", category: "utility", language: "en_IN", body: "Hello {{1}}, your fees of ₹{{2}} for {{3}} is due. Reply PAID after payment.", status: "approved" },
  { name: "class_update", category: "service", language: "en_IN", body: "Class timing update: {{1}} → {{2}}.", status: "approved" },
  { name: "payment_thanks", category: "utility", language: "en_IN", body: "Thanks {{1}}! We have marked PAID for {{2}}.", status: "approved" },
  { name: "promo_sept", category: "marketing", language: "en_IN", body: "September early-bird discount {{1}}% on new batch.", status: "submitted" },
];

// Quiet hours (business timezone) demo
const QUIET_START = 22; // 22:00
const QUIET_END = 7;    // 07:00

function isInQuietHours(date) {
  const h = date.getHours();
  if (QUIET_START > QUIET_END) {
    return h >= QUIET_START || h < QUIET_END; // overnight window
  }
  return h >= QUIET_START && h < QUIET_END;
}

function shiftOutOfQuiet(date) {
  // shift to next allowed minute
  const d = new Date(date);
  if (!isInQuietHours(d)) return d;
  if (QUIET_START > QUIET_END) {
    // overnight: if in [22..24) or [0..7)
    if (d.getHours() >= QUIET_START) {
      // move to next day 07:00
      d.setDate(d.getDate() + 1);
      d.setHours(QUIET_END, 0, 0, 0);
    } else {
      // same day 07:00
      d.setHours(QUIET_END, 0, 0, 0);
    }
  } else {
    // non-overnight (not used here)
    d.setHours(QUIET_END, 0, 0, 0);
  }
  return d;
}

// ------------------ Screens ------------------
function Dashboard() {
  const tiles = [
    { label: "Sent", value: 1280 },
    { label: "Delivered", value: 1214 },
    { label: "Replies", value: 217 },
    { label: "STOPs", value: 3 },
  ];
  const bars = [200, 180, 230, 150, 260, 170, 190]; // last 7 days – demo
  const max = Math.max(...bars) || 1;
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-4 gap-4">
        {tiles.map((t) => (
          <Card key={t.label} title={t.label} subtitle="Last 7 days">
            <div className="text-3xl font-semibold text-slate-900">{t.value}</div>
          </Card>
        ))}
      </div>
      <Card title="Traffic (7 days)" subtitle="Messages per day">
        <div className="flex items-end gap-3 h-40">
          {bars.map((b, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div className="bg-blue-600/80 rounded-t-lg w-full" style={{ height: `${(b / max) * 100}%` }}></div>
              <div className="text-xs text-slate-500">D{i+1}</div>
            </div>
          ))}
        </div>
      </Card>
      <div className="grid md:grid-cols-2 gap-4">
        <Card title="Policy Guardrails" subtitle="Quiet hours & consent">
          <ul className="text-sm text-slate-700 space-y-2">
            <li>• Customer quiet hours: <b>22:00–07:00</b>. Sends during this window auto-shift.</li>
            <li>• 24-hour window enforcement for free-form replies.</li>
            <li>• Proactive sends require <b>OPTED_IN</b> contacts only.</li>
            <li>• <b>STOP</b> overrides everything; future sends are blocked.</li>
          </ul>
        </Card>
        <Card title="Today at a Glance" subtitle="Ops number summary (aggregate)">
          <div className="space-y-3 text-sm">
            <div><Badge variant="blue">STATS</Badge> Sent 180 · Delivered 172 · Replies 38 · STOPs 1</div>
            <div className="text-slate-500">Reply <b>VIEW</b> in WhatsApp for details. Use <b>MARK PAID +91…</b> to tag payments.</div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Contacts() {
  const [q, setQ] = useState("");
  const [showImport, setShowImport] = useState(false);
  const [showMerge, setShowMerge] = useState(false);
  const filtered = sampleContacts.filter(c => [c.name, c.phone, c.tags.join(",")].join(" ").toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="relative">
            <IconSearch />
          </div>
          <TextInput placeholder="Search name, phone or tag…" value={q} onChange={e=>setQ(e.target.value)} style={{maxWidth: 320}} />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="subtle" onClick={()=>setShowMerge(true)}><IconTag/> Merge Tags</Button>
          <Button onClick={()=>setShowImport(true)}><IconUpload/> Import CSV</Button>
          <Button variant="primary">+ New Contact</Button>
        </div>
      </div>

      <Card title="Contacts" subtitle="Per-tenant list with badges">
        <Table columns={[
          { key: "name", title: "Name" },
          { key: "phone", title: "Phone" },
          { key: "tags", title: "Tags" },
          { key: "consent", title: "Consent" },
        ]} rows={filtered.map(c => ({
          name: <div className="font-medium text-slate-900">{c.name}</div>,
          phone: c.phone,
          tags: <div className="flex flex-wrap gap-1">{c.tags.map(t => <Badge key={t}>{t}</Badge>)}</div>,
          consent: c.consent === 'OPTED_IN' ? <Badge variant="green">OptedIn</Badge> : c.consent === 'UNSUBSCRIBED' ? <Badge variant="red">Unsubscribed</Badge> : <Badge variant="amber">NeedsOptIn</Badge>
        }))} />
        <div className="mt-3 text-xs text-slate-500">Deduplication: a contact matched by multiple tags receives at most <b>one</b> message per campaign.</div>
      </Card>

      {showImport && <ImportCsvModal onClose={()=>setShowImport(false)} />}
      {showMerge && <MergeTagsModal onClose={()=>setShowMerge(false)} />}
    </div>
  );
}

function ImportCsvModal({ onClose }){
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl">
        <div className="flex items-center justify-between px-4 py-3 border-b"><h3 className="font-semibold">Import Contacts (CSV)</h3><button onClick={onClose}><IconX/></button></div>
        <div className="p-4 space-y-4 text-sm">
          <div className="text-slate-600">Supported columns: <b>name, phone, optin, tags</b>. Rows with invalid phone are skipped and reported in a summary (line + reason). Empty <b>optin</b> becomes <Badge variant="amber">NEEDS_OPT_IN</Badge>.</div>
          <div className="rounded-xl border border-dashed p-6 text-center">
            <IconUpload/> Drop CSV here or <span className="text-blue-600 underline">browse</span>
          </div>
          <div className="bg-slate-50 rounded-xl p-3">
            <div className="text-xs text-slate-500 mb-1">Sample</div>
            <pre className="text-xs overflow-auto">name,phone,optin,tags{"\n"}Asha Patil,+919820000001,admission form 2025-08-05,fees-due,batch-a{"\n"}Parent (Pranav),+919820000004,,stop</pre>
          </div>
          <div className="flex justify-end gap-2"><Button variant="ghost" onClick={onClose}>Cancel</Button><Button><IconUpload/> Import</Button></div>
        </div>
      </div>
    </div>
  );
}

function MergeTagsModal({ onClose }){
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl">
        <div className="flex items-center justify-between px-4 py-3 border-b"><h3 className="font-semibold">Merge Tags</h3><button onClick={onClose}><IconX/></button></div>
        <div className="p-4 space-y-4 text-sm">
          <Field label="Source tags (to merge)" required>
            <TextInput placeholder="e.g., dues, fee-due, fees-due"/>
          </Field>
          <Field label="Target tag" required>
            <TextInput placeholder="fees-due"/>
          </Field>
          <div className="text-xs text-slate-500">Merging removes source tags from all contacts and replaces with the target atomically.</div>
          <div className="flex justify-end gap-2"><Button variant="ghost" onClick={onClose}>Cancel</Button><Button variant="success"><IconCheck/> Merge</Button></div>
        </div>
      </div>
    </div>
  );
}

function Templates() {
  const [form, setForm] = useState({ name: "", category: "utility", language: "en_IN", body: "Hello {{1}}…", buttons: "" });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(form.name)) e.name = "Use kebab-case (3–40 chars).";
    // find placeholders like {{n}} and ensure contiguous from 1..n
    const matches = [...form.body.matchAll(/\{\{(\d+)\}\}/g)].map(m => parseInt(m[1],10)).sort((a,b)=>a-b);
    if (matches.length) {
      for (let i=0;i<matches.length;i++) if (matches[i] !== i+1) { e.body = "Placeholders must be contiguous ({{1}}, {{2}}, …)."; break; }
      if (matches.length > 10) e.body = "Max 10 variables.";
    }
    setErrors(e);
    return Object.keys(e).length===0;
  };

  return (
    <div className="space-y-4">
      <Card title="Templates" subtitle="Manage WhatsApp-compatible texts" right={<Button>+ New</Button>}>
        <Table columns={[{key:"name",title:"Name"},{key:"category",title:"Category"},{key:"language",title:"Lang"},{key:"status",title:"Status"},{key:"preview",title:"Preview"}]} rows={sampleTemplates.map(t=>({
          name: <div className="font-medium">{t.name}</div>,
          category: t.category,
          language: t.language,
          status: t.status === 'approved'? <Badge variant="green">approved</Badge> : t.status === 'submitted'? <Badge variant="violet">submitted</Badge> : <Badge variant="amber">draft</Badge>,
          preview: <div className="text-slate-600 max-w-[360px] truncate">{t.body}</div>
        }))} />
      </Card>

      <Card title="Create / Edit Template" subtitle="Client-side checks">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <Field label="Name" hint="kebab-case" required>
              <TextInput value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="fee_reminder_aug"/>
            </Field>
            {errors.name && <div className="text-xs text-rose-600">{errors.name}</div>}
            <div className="grid grid-cols-2 gap-3">
              <Field label="Category" required>
                <Select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} options={[{value:"utility",label:"utility"},{value:"service",label:"service"},{value:"marketing",label:"marketing"},{value:"authentication",label:"authentication"}]}/>
              </Field>
              <Field label="Language" required>
                <Select value={form.language} onChange={e=>setForm({...form,language:e.target.value})} options={[{value:"en_IN",label:"en_IN"},{value:"mr_IN",label:"mr_IN"},{value:"hi_IN",label:"hi_IN"}]}/>
              </Field>
            </div>
            <Field label="Body" hint="Use {{1}}, {{2}}, …">
              <TextArea value={form.body} onChange={e=>setForm({...form,body:e.target.value})} />
            </Field>
            {errors.body && <div className="text-xs text-rose-600">{errors.body}</div>}
            <Field label="Buttons (optional)"><TextInput placeholder="Quick replies or CTAs (visual only)" value={form.buttons} onChange={e=>setForm({...form,buttons:e.target.value})}/></Field>
            <div className="flex gap-2">
              <Button onClick={validate}><IconCheck/> Validate</Button>
              <Button variant="primary" onClick={()=>{ if(validate()) alert('Submitted (static demo)'); }}><IconSend/> Submit</Button>
            </div>
          </div>
          <div className="space-y-3">
            <div className="text-sm text-slate-600">Preview</div>
            <div className="rounded-2xl border p-4 bg-gradient-to-br from-slate-50 to-white">
              <div className="text-xs text-slate-500 mb-1">WhatsApp template (mock)</div>
              <div className="text-slate-900 whitespace-pre-wrap">{form.body}
              </div>
              {form.buttons && <div className="mt-3 flex gap-2 flex-wrap">{form.buttons.split(',').map((b,i)=>(<button key={i} className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs">{b.trim()}</button>))}</div>}
            </div>
            <div className="text-xs text-slate-500">Rules: contiguous placeholders, max 10 vars; editing approved creates a new draft.</div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function Campaigns(){
  const [step, setStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState(sampleTemplates[0].name);
  const [includeMode, setIncludeMode] = useState("ANY");
  const [includeTags, setIncludeTags] = useState(["fees-due"]);
  const [excludeTags, setExcludeTags] = useState(["paid","stop","unsubscribed"]);
  const [scheduleNow, setScheduleNow] = useState(true);
  const [dt, setDt] = useState(() => {
    const d = new Date(); d.setHours(23,30,0,0); return d; // demo inside quiet hours
  });

  const shifted = useMemo(()=> shiftOutOfQuiet(dt), [dt]);
  const quietConflict = isInQuietHours(dt);

  // Audience count (static logic):
  const count = useMemo(()=> {
    // include ANY vs ALL basic demo
    const include = new Set(includeTags);
    const exclude = new Set(excludeTags);
    let matched = sampleContacts.filter(c => {
      const tset = new Set(c.tags);
      const hasInclude = includeMode === 'ANY' ? [...include].some(t=>tset.has(t)) : [...include].every(t=>tset.has(t));
      const hasExclude = [...exclude].some(t=>tset.has(t));
      const policy = c.consent === 'OPTED_IN';
      return hasInclude && !hasExclude && policy;
    });
    return matched.length;
  }, [includeTags, excludeTags, includeMode]);

  return (
    <div className="space-y-4">
      <Stepper step={step} setStep={setStep} />

      {step===1 && (
        <Card title="Choose Template" subtitle="Approved templates recommended">
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Template" required>
              <Select value={selectedTemplate} onChange={e=>setSelectedTemplate(e.target.value)} options={sampleTemplates.map(t=>({value:t.name,label:`${t.name} (${t.status})`}))} />
            </Field>
            <div className="text-sm text-slate-600">Tip: Campaigns are template-based by default. Outside the 24-hour window, free-form replies are blocked.</div>
          </div>
          <div className="mt-4 flex justify-end"><Button variant="primary" onClick={()=>setStep(2)}><IconChevronRight/> Next</Button></div>
        </Card>
      )}

      {step===2 && (
        <Card title="Build Audience" subtitle="Include/Exclude tags with policy guards">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <Field label="Include tags" hint="comma-separated">
                <TextInput value={includeTags.join(', ')} onChange={e=>setIncludeTags(e.target.value.split(',').map(s=>s.trim()).filter(Boolean))}/>
              </Field>
              <Field label="Match logic">
                <Select value={includeMode} onChange={e=>setIncludeMode(e.target.value)} options={[{value:'ANY',label:'ANY (default)'},{value:'ALL',label:'ALL'}]} />
              </Field>
              <Field label="Exclude tags" hint="STOP & UNSUBSCRIBED auto-excluded">
                <TextInput value={excludeTags.join(', ')} onChange={e=>setExcludeTags(e.target.value.split(',').map(s=>s.trim()).filter(Boolean))}/>
              </Field>
            </div>
            <div className="space-y-2 text-sm">
              <div>Live count preview: <Badge variant="blue">{count}</Badge> unique contacts</div>
              <div className="text-slate-500">Contacts with <Badge variant="amber">NEEDS_OPT_IN</Badge> are excluded by policy and shown with a reason.</div>
              <div className="pt-2"><Badge variant="red">STOP</Badge> and <Badge variant="red">UNSUBSCRIBED</Badge> cannot be removed from exclusions.</div>
            </div>
          </div>
          <div className="mt-4 flex justify-between">
            <Button variant="ghost" onClick={()=>setStep(1)}>Back</Button>
            <Button variant="primary" onClick={()=>setStep(3)}><IconChevronRight/> Next</Button>
          </div>
        </Card>
      )}

      {step===3 && (
        <Card title="Schedule" subtitle="Business timezone; quiet hours handled">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <Toggle checked={scheduleNow} onChange={setScheduleNow} label="Send now"/>
              {!scheduleNow && (
                <Field label="Schedule at" hint="Local time">
                  <div className="flex items-center gap-2">
                    <IconCalendar/>
                    <TextInput type="datetime-local" value={fmtForInput(dt)} onChange={e=>setDt(new Date(e.target.value))} />
                  </div>
                </Field>
              )}
            </div>
            <div className="space-y-2 text-sm">
              {(!scheduleNow && quietConflict) ? (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800">
                  <b>Quiet hours</b> {`22:00–07:00`} detected. This campaign will auto-shift to <b>{shifted.toLocaleString()}</b>.
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-slate-50 border text-slate-700">Quiet hours: 22:00–07:00 (customers). Ops alerts ignore quiet hours.</div>
              )}
            </div>
          </div>
          <div className="mt-4 flex justify-between">
            <Button variant="ghost" onClick={()=>setStep(2)}>Back</Button>
            <Button variant="primary" onClick={()=>setStep(4)}><IconChevronRight/> Next</Button>
          </div>
        </Card>
      )}

      {step===4 && (
        <Card title="Preview" subtitle="One message per contact (dedup)">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3 text-sm">
              <div><b>Template</b>: {selectedTemplate}</div>
              <div><b>Audience</b>: Include [{includeTags.join(', ')}] ({includeMode}), Exclude [{excludeTags.join(', ')}]</div>
              <div><b>Count</b>: {count} contacts</div>
              <div><b>Schedule</b>: {scheduleNow ? "Now" : (quietConflict ? `${dt.toLocaleString()} → shifted to ${shifted.toLocaleString()}` : dt.toLocaleString())}</div>
            </div>
            <div className="space-y-2">
              <div className="text-xs text-slate-500">Template preview</div>
              <div className="border rounded-2xl p-3 bg-white">{sampleTemplates.find(t=>t.name===selectedTemplate)?.body}</div>
            </div>
          </div>
          <div className="mt-4 flex justify-between">
            <Button variant="ghost" onClick={()=>setStep(3)}>Back</Button>
            <Button variant="success" onClick={()=>setStep(5)}><IconSend/> Send</Button>
          </div>
        </Card>
      )}

      {step===5 && (
        <Card title="Queued" subtitle="Rate limits + retries simulated">
          <div className="flex items-center gap-3 text-emerald-700"><IconCheck/> Campaign created with idempotency guard. {count} messages queued.</div>
          <div className="mt-4"><Button variant="primary" onClick={()=>{ setStep(1); }}>Create another</Button></div>
        </Card>
      )}
    </div>
  );
}

const IconChevronRight = () => (
  <svg viewBox="0 0 24 24" className={iconCls} fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 6l6 6-6 6"/></svg>
);

function Stepper({ step, setStep }){
  const items = ["Template","Audience","Schedule","Preview","Send"];
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {items.map((label, idx)=>{
        const active = idx+1 === step;
        const done = idx+1 < step;
        return (
          <button key={label} onClick={()=> setStep(idx+1)} className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${active?"bg-blue-600 text-white border-blue-600": done?"bg-emerald-50 text-emerald-700 border-emerald-200":"bg-white text-slate-700 border-slate-200"}`}>
            {done ? <IconCheck/> : active ? <IconPlay/> : <span className="w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center text-xs">{idx+1}</span>}
            <span className="text-sm">{label}</span>
          </button>
        );
      })}
    </div>
  );
}

function Inbox(){
  const messages = [
    { at: "10:14", contact: "Asha Patil", phone: "+919820000001", text: "I PAID yesterday", labels: ["PAID"], lastUserAgoHours: 2 },
    { at: "09:01", contact: "Parent (Pranav)", phone: "+919820000004", text: "STOP", labels: ["STOP"], lastUserAgoHours: 1 },
    { at: "Yesterday", contact: "Sara Khan", phone: "+919820000003", text: "Need details", labels: ["HELP"], lastUserAgoHours: 30 },
  ];
  const [filter, setFilter] = useState("All");
  const [active, setActive] = useState(messages[0]);
  const filtered = messages.filter(m => filter==="All" || m.labels.includes(filter));
  const canFreeForm = active?.lastUserAgoHours <= 24;

  return (
    <div className="grid md:grid-cols-3 gap-4">
      <Card title="Inbox" subtitle="Inbound messages & labels" className="md:col-span-1">
        <div className="flex gap-2 mb-3">
          {["All","PAID","STOP","HELP"].map(f=> <Button key={f} variant={filter===f?"primary":"subtle"} onClick={()=>setFilter(f)}>{f}</Button>)}
        </div>
        <div className="divide-y">
          {filtered.map((m, i)=> (
            <button key={i} onClick={()=>setActive(m)} className={`w-full text-left py-3 ${active===m?"bg-slate-50":""}`}>
              <div className="flex items-center justify-between px-2">
                <div>
                  <div className="font-medium text-slate-900">{m.contact}</div>
                  <div className="text-xs text-slate-500">{m.phone} • {m.at}</div>
                </div>
                <div className="flex gap-1">{m.labels.map(l=> <Badge key={l} variant={l==="PAID"?"green":l==="STOP"?"red":"blue"}>{l}</Badge>)}</div>
              </div>
            </button>
          ))}
        </div>
      </Card>

      <Card title="Thread" subtitle={active?.contact} className="md:col-span-2">
        <div className="space-y-3">
          <div className="bg-slate-50 rounded-xl p-3 max-w-[70%]">{active?.text}</div>
          <div className="text-xs text-slate-500">Last user message: {active?.lastUserAgoHours}h ago</div>
          <div className="border-t pt-3">
            {canFreeForm ? (
              <div className="flex items-center gap-2">
                <TextInput placeholder="Type a quick reply…" />
                <Button><IconSend/> Send</Button>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm flex items-center gap-2">
                <IconClock/> Session closed—send a template.
                <Button variant="subtle" className="ml-auto">Use Template</Button>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

function Ops(){
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <Card title="Ops Number" subtitle="Shared across tenants">
        <div className="space-y-3 text-sm">
          <div><b>Authorized staff</b> can use commands. Unknown senders receive an Unauthorized message.</div>
          <ul className="list-disc pl-5 space-y-1 text-slate-700">
            <li><b>HELP</b> → list commands + current business</li>
            <li><b>STATS</b> → today’s Sent/Delivered/Replies/STOPs</li>
            <li><b>LIST PAID</b> → first 10 names; <b>NEXT</b> to paginate</li>
            <li><b>MARK PAID +91…</b> → adds PAID tag</li>
            <li><b>SEND FEES @tag</b> → trigger default fee reminder</li>
            <li><b>SWITCH code</b> or prefix <b>B:code</b> for one-off</li>
          </ul>
        </div>
      </Card>
      <Card title="Try Commands (mock)" subtitle="Visual feedback only">
        <div className="flex items-center gap-2">
          <TextInput placeholder="Type e.g., STATS or MARK PAID +9198…" />
          <Button><IconSend/> Send</Button>
        </div>
        <div className="mt-3 text-sm text-slate-600">Response (mock): <Badge variant="blue">STATS</Badge> Sent 180 · Delivered 172 · Replies 38 · STOPs 1</div>
      </Card>
      <Card title="Alerts" subtitle="Aggregate-first">
        <div className="text-sm text-slate-700">Daily Summary at <b>20:30 IST</b>, template-based. Details revealed on demand.</div>
      </Card>
      <Card title="Compliance & Safety" subtitle="Hard stops">
        <ul className="text-sm text-slate-700 space-y-1">
          <li>• STOP and START logged with timestamps.</li>
          <li>• Tokens stored encrypted; token health visible.</li>
          <li>• Policy checks prevent non-compliant sends.</li>
        </ul>
      </Card>
    </div>
  );
}

function Analytics(){
  const metrics = [
    { k: "Send success rate", v: "94.8%" },
    { k: "Delivery rate", v: "89.8%" },
    { k: "Reply rate", v: "14.5%" },
    { k: "STOP rate", v: "0.4%" },
  ];
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <Card title="KPIs" subtitle="Change range from filter at top">
        <div className="grid grid-cols-2 gap-3">
          {metrics.map(m=> (
            <div key={m.k} className="p-4 rounded-xl bg-slate-50 border"><div className="text-xs text-slate-500">{m.k}</div><div className="text-2xl font-semibold">{m.v}</div></div>
          ))}
        </div>
      </Card>
      <Card title="Campaign Funnel (example)" subtitle="Queued → Sent → Delivered → Read → Failed">
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-3"><div className="w-28">Queued</div><div className="flex-1 bg-slate-100 rounded-full"><div className="h-2 rounded-full bg-slate-800" style={{width:'95%'}}/></div><div>950</div></div>
          <div className="flex items-center gap-3"><div className="w-28">Sent</div><div className="flex-1 bg-slate-100 rounded-full"><div className="h-2 rounded-full bg-blue-600" style={{width:'94%'}}/></div><div>940</div></div>
          <div className="flex items-center gap-3"><div className="w-28">Delivered</div><div className="flex-1 bg-slate-100 rounded-full"><div className="h-2 rounded-full bg-emerald-600" style={{width:'90%'}}/></div><div>900</div></div>
          <div className="flex items-center gap-3"><div className="w-28">Read</div><div className="flex-1 bg-slate-100 rounded-full"><div className="h-2 rounded-full bg-violet-600" style={{width:'78%'}}/></div><div>780</div></div>
          <div className="flex items-center gap-3"><div className="w-28">Failed</div><div className="flex-1 bg-slate-100 rounded-full"><div className="h-2 rounded-full bg-rose-600" style={{width:'6%'}}/></div><div>60</div></div>
        </div>
      </Card>
    </div>
  );
}

function Billing(){
  const [suspended, setSuspended] = useState(false);
  return (
    <div className="space-y-4">
      {suspended && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">Subscription suspended. Inbound/replies allowed; proactive templates blocked. Grace period ended.</div>
      )}
      <Card title="Plan" subtitle="Per business">
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-700">₹300/month · Grace: 7 days · WhatsApp fees pass-through</div>
          <Toggle checked={suspended} onChange={setSuspended} label="Simulate suspended"/>
        </div>
      </Card>
      <Card title="Estimates" subtitle="Pre-send (example)">
        <Table columns={[{key:"t",title:"Template"},{key:"cat",title:"Category"},{key:"aud",title:"Audience"},{key:"est",title:"Est. Cost"}]} rows={[
          { t: "fee_reminder_aug", cat:"utility", aud: "150", est: "₹150–₹300" },
        ]} />
      </Card>
    </div>
  );
}

function Settings(){
  const [tz, setTz] = useState("Asia/Kolkata");
  const [quiet, setQuiet] = useState({start: "22:00", end: "07:00"});
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <Card title="Business" subtitle="Profile & timezone">
        <div className="grid gap-3">
          <Field label="Name" required><TextInput defaultValue="BrightTuition"/></Field>
          <Field label="Timezone" required>
            <Select value={tz} onChange={(e)=>setTz(e.target.value)} options={[{value:"Asia/Kolkata",label:"Asia/Kolkata (IST)"},{value:"Asia/Dubai",label:"Asia/Dubai"}]}/>
          </Field>
          <Field label="Website"><TextInput placeholder="https://…"/></Field>
          <Field label="Support email"><TextInput placeholder="support@example.com"/></Field>
        </div>
      </Card>
      <Card title="Policies" subtitle="Quiet hours & 24-hour window">
        <div className="grid gap-3">
          <Field label="Customer quiet hours">
            <div className="grid grid-cols-2 gap-2">
              <TextInput value={quiet.start} onChange={e=>setQuiet({...quiet,start:e.target.value})}/>
              <TextInput value={quiet.end} onChange={e=>setQuiet({...quiet,end:e.target.value})}/>
            </div>
          </Field>
          <div className="text-xs text-slate-500">Ops alerts do not queue for quiet hours; customer sends auto-shift to the next allowed minute.</div>
        </div>
      </Card>
      <Card title="Channels" subtitle="WhatsApp tokens">
        <div className="grid gap-3">
          <Field label="Customer channel phone_number_id" required><TextInput placeholder="123456789"/></Field>
          <Field label="Customer channel token (encrypted)"><TextInput placeholder="••••••••"/></Field>
          <Field label="Ops number (shared)"><TextInput placeholder="987654321"/></Field>
          <Button className="w-fit">Verify token health</Button>
        </div>
      </Card>
      <Card title="Exports" subtitle="Simple CSVs">
        <div className="flex items-center gap-2"><Button variant="subtle">Export PAID list</Button><Button variant="subtle">Export Campaign report</Button></div>
      </Card>
    </div>
  );
}

function Onboarding(){
  return (
    <div className="grid md:grid-cols-2 gap-6 items-start">
      <div className="space-y-4">
        <Card title="Welcome to ConnectEasy" subtitle="MVP Onboarding">
          <ol className="list-decimal pl-5 space-y-2 text-sm text-slate-700">
            <li>Create business (name, timezone, website, support email)</li>
            <li>Connect <b>Customer</b> number (phone_number_id + token)</li>
            <li>(Optional) Activate Ops subscription for staff (capture opt-in)</li>
            <li>Import contacts (CSV) with tags; or add manually</li>
            <li>Pick starter templates; send a test reminder</li>
          </ol>
        </Card>
        <Card title="Bulk Invite Wizard" subtitle="For CSV NEEDS_OPT_IN">
          <div className="text-sm text-slate-700">Generate a join link and printable QR Poster (PDF). When contact sends <b>START</b>, flip to <Badge variant="green">OPTED_IN</Badge>.</div>
          <div className="mt-3 flex gap-2"><Button>Generate link</Button><Button variant="subtle">Preview QR Poster</Button></div>
        </Card>
      </div>
      <div className="rounded-2xl overflow-hidden shadow-sm border border-slate-100">
        <img alt="hero" src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=1600&auto=format&fit=crop" className="w-full h-64 object-cover"/>
        <div className="p-4 text-sm text-slate-600">Use the sidebar to explore Contacts, Templates, Campaigns, Inbox, Ops, Analytics, Billing, and Settings.</div>
      </div>
    </div>
  );
}

// ------------------ App Shell ------------------
const NAV = [
  { key: "dashboard", label: "Dashboard", icon: <IconAnalytics/> },
  { key: "contacts", label: "Contacts & Tags", icon: <IconUsers/> },
  { key: "templates", label: "Templates", icon: <IconTemplate/> },
  { key: "campaigns", label: "Campaigns", icon: <IconCampaign/> },
  { key: "inbox", label: "Inbox", icon: <IconInbox/> },
  { key: "ops", label: "Ops Number", icon: <IconOps/> },
  { key: "analytics", label: "Analytics", icon: <IconAnalytics/> },
  { key: "billing", label: "Billing", icon: <IconBilling/> },
  { key: "settings", label: "Settings", icon: <IconSettings/> },
  { key: "onboarding", label: "Onboarding", icon: <IconTemplate/> },
];

function AppShell(){
  const [active, setActive] = useState("dashboard");
  const [range, setRange] = useState("7d");
  const [biz, setBiz] = useState("BrightTuition (TTR-01)");

  const Screen = {
    dashboard: <Dashboard/>,
    contacts: <Contacts/>,
    templates: <Templates/>,
    campaigns: <Campaigns/>,
    inbox: <Inbox/>,
    ops: <Ops/>,
    analytics: <Analytics/>,
    billing: <Billing/>,
    settings: <Settings/>,
    onboarding: <Onboarding/>,
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
              <div className="font-semibold">ConnectEasy</div>
              <div className="text-xs text-slate-500">Ops & Customer Messaging</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Select value={biz} onChange={(e)=>setBiz(e.target.value)} options={[{value:"BrightTuition (TTR-01)",label:"BrightTuition (TTR-01)"},{value:"HealthPlus (HPL-02)",label:"HealthPlus (HPL-02)"}]}/>
            <Select value={range} onChange={(e)=>setRange(e.target.value)} options={[{value:"today",label:"Today"},{value:"7d",label:"7 days"},{value:"30d",label:"30 days"}]}/>
            <div className="w-9 h-9 rounded-full bg-slate-200" title="You"/>
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
            <div className="font-medium mb-1">MVP Scope</div>
            <ul className="list-disc pl-5 text-slate-700 space-y-1">
              <li>Contacts + Tags, CSV</li>
              <li>Templates</li>
              <li>Campaigns</li>
              <li>Inbox</li>
              <li>Ops alerts & commands</li>
            </ul>
          </div>
        </aside>

        <main className="space-y-6">
          {Screen}
          <footer className="text-xs text-slate-500 pt-2">BRD v1.2 • Last updated: 13 Aug 2025 • IST</footer>
        </main>
      </div>
    </div>
  );
}

function fmtForInput(d){
  const pad = (n)=> String(n).padStart(2,'0');
  const yy = d.getFullYear();
  const mm = pad(d.getMonth()+1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const mi = pad(d.getMinutes());
  return `${yy}-${mm}-${dd}T${hh}:${mi}`;
}

export default function ConnectEasyUI(){
  useEffect(()=>{
    document.body.classList.add("bg-slate-50");
    return ()=> document.body.classList.remove("bg-slate-50");
  },[]);
  return <AppShell/>;
}

