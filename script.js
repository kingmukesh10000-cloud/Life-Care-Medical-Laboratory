/* =============================================================
   Life Care Medical Laboratory — front-end logic
   Persistence: browser localStorage (works on any static host,
   including Vercel). Data lives per-browser/device — see README
   for notes on moving to a shared backend later.
   ============================================================= */

/* ============================= Data layer ============================= */
const DB = {
  getStaff(){
    try{ const raw = localStorage.getItem('lc_staff_list'); return raw ? JSON.parse(raw) : null; }
    catch(e){ return null; }
  },
  setStaff(list){ localStorage.setItem('lc_staff_list', JSON.stringify(list)); },
  getPatients(){
    try{ const raw = localStorage.getItem('lc_patients_list'); return raw ? JSON.parse(raw) : []; }
    catch(e){ return []; }
  },
  setPatients(list){ localStorage.setItem('lc_patients_list', JSON.stringify(list)); }
};

/* ============================= Test templates ============================= */
const TEST_TEMPLATES = {
  "Complete Blood Count (CBC)": [
    {parameter:"Hemoglobin", unit:"g/dL", range:"13.0-17.0"},
    {parameter:"Total WBC Count", unit:"/cumm", range:"4000-11000"},
    {parameter:"RBC Count", unit:"mill/cumm", range:"4.5-5.5"},
    {parameter:"Platelet Count", unit:"/cumm", range:"150000-450000"},
    {parameter:"Hematocrit (PCV)", unit:"%", range:"40-50"},
    {parameter:"MCV", unit:"fL", range:"83-101"},
    {parameter:"MCH", unit:"pg", range:"27-32"},
    {parameter:"MCHC", unit:"g/dL", range:"31.5-34.5"}
  ],
  "Fasting Blood Sugar (FBS)": [
    {parameter:"Fasting Blood Glucose", unit:"mg/dL", range:"70-100"}
  ],
  "Random Blood Sugar (RBS)": [
    {parameter:"Random Blood Glucose", unit:"mg/dL", range:"70-140"}
  ],
  "HbA1c (Glycated Hemoglobin)": [
    {parameter:"HbA1c", unit:"%", range:"4.0-5.6"}
  ],
  "Lipid Profile": [
    {parameter:"Total Cholesterol", unit:"mg/dL", range:"<200"},
    {parameter:"Triglycerides", unit:"mg/dL", range:"<150"},
    {parameter:"HDL Cholesterol", unit:"mg/dL", range:">40"},
    {parameter:"LDL Cholesterol", unit:"mg/dL", range:"<100"},
    {parameter:"VLDL", unit:"mg/dL", range:"5-40"}
  ],
  "Liver Function Test (LFT)": [
    {parameter:"Total Bilirubin", unit:"mg/dL", range:"0.3-1.2"},
    {parameter:"Direct Bilirubin", unit:"mg/dL", range:"0.0-0.3"},
    {parameter:"SGOT (AST)", unit:"U/L", range:"5-40"},
    {parameter:"SGPT (ALT)", unit:"U/L", range:"7-56"},
    {parameter:"Alkaline Phosphatase", unit:"U/L", range:"44-147"},
    {parameter:"Total Protein", unit:"g/dL", range:"6.0-8.3"},
    {parameter:"Albumin", unit:"g/dL", range:"3.5-5.0"}
  ],
  "Kidney Function Test (KFT)": [
    {parameter:"Blood Urea", unit:"mg/dL", range:"15-40"},
    {parameter:"Serum Creatinine", unit:"mg/dL", range:"0.6-1.3"},
    {parameter:"Uric Acid", unit:"mg/dL", range:"3.5-7.2"},
    {parameter:"Sodium", unit:"mEq/L", range:"135-145"},
    {parameter:"Potassium", unit:"mEq/L", range:"3.5-5.1"}
  ],
  "Thyroid Profile": [
    {parameter:"T3", unit:"ng/dL", range:"80-200"},
    {parameter:"T4", unit:"\u00b5g/dL", range:"5.1-14.1"},
    {parameter:"TSH", unit:"\u00b5IU/mL", range:"0.4-4.0"}
  ],
  "Urine Routine Examination": [
    {parameter:"Colour", unit:"-", range:"Pale Yellow"},
    {parameter:"Appearance", unit:"-", range:"Clear"},
    {parameter:"pH", unit:"-", range:"4.5-8.0"},
    {parameter:"Specific Gravity", unit:"-", range:"1.005-1.030"},
    {parameter:"Protein", unit:"-", range:"Nil"},
    {parameter:"Glucose", unit:"-", range:"Nil"},
    {parameter:"Pus Cells", unit:"/hpf", range:"0-5"}
  ],
  "Stool Routine Examination": [
    {parameter:"Colour", unit:"-", range:"Brown"},
    {parameter:"Consistency", unit:"-", range:"Formed"},
    {parameter:"Ova / Cyst", unit:"-", range:"Not seen"},
    {parameter:"Occult Blood", unit:"-", range:"Negative"}
  ],
  "Blood Grouping & Rh Typing": [
    {parameter:"ABO Group", unit:"-", range:"Report"},
    {parameter:"Rh Type", unit:"-", range:"Report"}
  ],
  "Coagulation Profile (PT/INR/APTT)": [
    {parameter:"Prothrombin Time (PT)", unit:"sec", range:"11-13.5"},
    {parameter:"INR", unit:"-", range:"0.8-1.2"},
    {parameter:"APTT", unit:"sec", range:"25-35"}
  ],
  "C-Reactive Protein (CRP)": [
    {parameter:"CRP", unit:"mg/L", range:"<6"}
  ],
  "ESR (Erythrocyte Sedimentation Rate)": [
    {parameter:"ESR", unit:"mm/hr", range:"0-15"}
  ],
  "Vitamin D (25-OH)": [
    {parameter:"Vitamin D", unit:"ng/mL", range:"30-100"}
  ],
  "Vitamin B12": [
    {parameter:"Vitamin B12", unit:"pg/mL", range:"200-900"}
  ],
  "Widal Test (Typhoid)": [
    {parameter:"S. Typhi O", unit:"-", range:"Non-reactive"},
    {parameter:"S. Typhi H", unit:"-", range:"Non-reactive"}
  ],
  "Malaria Parasite (MP) Test": [
    {parameter:"Malaria Antigen", unit:"-", range:"Negative"}
  ],
  "Dengue Test (NS1/IgG/IgM)": [
    {parameter:"NS1 Antigen", unit:"-", range:"Negative"},
    {parameter:"IgG Antibody", unit:"-", range:"Negative"},
    {parameter:"IgM Antibody", unit:"-", range:"Negative"}
  ],
  "HBsAg (Hepatitis B)": [
    {parameter:"HBsAg", unit:"-", range:"Non-reactive"}
  ],
  "HIV (Rapid Test)": [
    {parameter:"HIV I & II Antibody", unit:"-", range:"Non-reactive"}
  ],
  "Pregnancy Test (Urine hCG)": [
    {parameter:"hCG", unit:"-", range:"Negative"}
  ],
  "Other / Custom": []
};
const TEST_NAMES = Object.keys(TEST_TEMPLATES);

/* ============================= State ============================= */
let state = {
  view: 'login',
  user: null,
  patients: [],
  staff: [],
  activePatientId: null,
  editingId: null,
  search: '',
  statusFilter: 'All',
  tempResults: [],
  loginError: '',
  formError: '',
  loaded: false
};

function uid(prefix){
  return prefix + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2,5).toUpperCase();
}

const INFO_RANGES = ['-', 'n/a', 'na', 'report', 'informational'];

function computeFlag(range, rawValue){
  if(rawValue === undefined || rawValue === null || String(rawValue).trim() === '') return '';
  if(!range || INFO_RANGES.includes(range.trim().toLowerCase())) return '';
  const value = String(rawValue).trim();
  const num = parseFloat(value);
  let m;
  if(!isNaN(num) && /^-?\d/.test(value)){
    if((m = range.match(/^(-?\d+\.?\d*)\s*-\s*(-?\d+\.?\d*)$/))){
      const lo = parseFloat(m[1]), hi = parseFloat(m[2]);
      if(num < lo) return 'Low';
      if(num > hi) return 'High';
      return 'Normal';
    }
    if((m = range.match(/^<\s*(-?\d+\.?\d*)$/))){
      return num < parseFloat(m[1]) ? 'Normal' : 'High';
    }
    if((m = range.match(/^>\s*(-?\d+\.?\d*)$/))){
      return num > parseFloat(m[1]) ? 'Normal' : 'Low';
    }
    return '';
  }
  return value.toLowerCase() === range.trim().toLowerCase() ? 'Normal' : 'Abnormal';
}

function flagBadge(flag){
  if(!flag) return '<span class="flag-badge flag-none">&mdash;</span>';
  const cls = flag === 'Normal' ? 'flag-normal' : (flag === 'High' ? 'flag-high' : (flag === 'Low' ? 'flag-low' : 'flag-high'));
  return '<span class="flag-badge ' + cls + '">' + flag + '</span>';
}

function escapeHtml(str){
  return String(str === undefined || str === null ? '' : str)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function fmtDate(iso){
  if(!iso) return '\u2014';
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {day:'2-digit', month:'short', year:'numeric'}) + ' ' +
         d.toLocaleTimeString(undefined, {hour:'2-digit', minute:'2-digit'});
}

/* Build/merge a results array (each row tagged with testName) for a given
   list of selected tests, preserving any values already entered for tests
   that remain selected. */
function buildResultsForTests(tests, existingResults){
  existingResults = existingResults || [];
  const merged = [];
  tests.forEach(testName => {
    if(testName === 'Other / Custom'){
      const existingCustom = existingResults.filter(r => r.testName === testName);
      if(existingCustom.length) merged.push(...existingCustom);
      else merged.push({testName, parameter:'', unit:'', range:'', value:''});
    } else {
      const template = TEST_TEMPLATES[testName] || [];
      template.forEach(t => {
        const found = existingResults.find(r => r.testName === testName && r.parameter === t.parameter);
        merged.push({testName, parameter:t.parameter, unit:t.unit, range:t.range, value: found ? found.value : ''});
      });
    }
  });
  return merged;
}

function allFilled(results){
  return results.length > 0 && results.every(r => r.value !== undefined && String(r.value).trim() !== '');
}

/* ============================= Icons ============================= */
const ICON = {
  drop: '<svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C12 2 5 11 5 15.5C5 19.09 8.13 22 12 22C15.87 22 19 19.09 19 15.5C19 11 12 2 12 2Z"/></svg>',
  dashboard: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="8" height="8" rx="1.5"/><rect x="13" y="3" width="8" height="5" rx="1.5"/><rect x="13" y="11" width="8" height="10" rx="1.5"/><rect x="3" y="14" width="8" height="7" rx="1.5"/></svg>',
  add: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
  staff: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="9" cy="8" r="3.2"/><path d="M3.5 20c0-3.3 2.9-5.5 5.5-5.5s5.5 2.2 5.5 5.5"/><circle cx="18" cy="8.5" r="2.4"/><path d="M15.5 14.6c2.6.3 4.9 2.3 4.9 5.4"/></svg>',
  logout: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>'
};

/* ============================= Init ============================= */
function boot(){
  let staff = DB.getStaff();
  if(!staff || !staff.length){
    staff = [{username:'admin', password:'admin123', name:'Lab Administrator', role:'admin'}];
    DB.setStaff(staff);
  }
  state.staff = staff;
  state.patients = DB.getPatients();
  // migrate any older single-testType records to the tests[] shape
  state.patients.forEach(p => {
    if(!p.tests){
      p.tests = p.testType ? [p.testType] : [];
      (p.results || []).forEach(r => { if(!r.testName) r.testName = p.testType; });
    }
  });
  state.loaded = true;
  render();
}

/* ============================= App actions ============================= */
const App = {
  gotoLogin(){ state.view='login'; state.loginError=''; render(); },

  login(e){
    e.preventDefault();
    const u = document.getElementById('login-username').value.trim();
    const p = document.getElementById('login-password').value;
    const found = state.staff.find(s => s.username.toLowerCase() === u.toLowerCase() && s.password === p);
    if(!found){ state.loginError = 'Incorrect username or password.'; render(); return; }
    state.user = found;
    state.loginError = '';
    state.view = 'dashboard';
    render();
  },

  logout(){
    state.user = null;
    state.view = 'login';
    render();
  },

  setView(v){ state.view = v; state.formError=''; state.editingId=null; render(); },

  setSearch(v){ state.search = v; renderContentOnly(); },
  setStatusFilter(v){ state.statusFilter = v; render(); },

  startNewPatient(){ state.editingId = null; state.formError=''; state.view='patientForm'; render(); },

  startEditPatient(id){ state.editingId = id; state.formError=''; state.view='patientForm'; render(); },

  savePatientForm(e){
    e.preventDefault();
    const name = document.getElementById('pf-name').value.trim();
    const age = document.getElementById('pf-age').value.trim();
    const gender = document.getElementById('pf-gender').value;
    const referredBy = document.getElementById('pf-referred').value.trim();
    const checked = Array.from(document.querySelectorAll('.test-check:checked')).map(cb => cb.value);

    if(!name || !age || checked.length === 0){
      state.formError = 'Please fill in patient name, age, and select at least one test.';
      render();
      return;
    }

    if(state.editingId){
      const p = state.patients.find(p => p.id === state.editingId);
      p.name = name; p.age = age; p.gender = gender; p.referredBy = referredBy || 'Self';
      p.tests = checked;
      p.results = buildResultsForTests(checked, p.results);
      p.status = allFilled(p.results) ? 'Completed' : 'Pending';
      p.updatedBy = state.user.name;
    } else {
      const record = {
        id: uid('LC'),
        name, age, gender,
        tests: checked,
        referredBy: referredBy || 'Self',
        status: 'Pending',
        createdAt: new Date().toISOString(),
        createdBy: state.user.name,
        reportDate: null,
        results: buildResultsForTests(checked, [])
      };
      state.patients.unshift(record);
    }
    DB.setPatients(state.patients);
    state.view = 'dashboard';
    render();
  },

  deletePatient(id){
    if(!confirm('Delete this patient record permanently? This cannot be undone.')) return;
    state.patients = state.patients.filter(p => p.id !== id);
    DB.setPatients(state.patients);
    render();
  },

  openResults(id){
    const p = state.patients.find(p => p.id === id);
    state.activePatientId = id;
    state.tempResults = JSON.parse(JSON.stringify(p.results || []));
    state.view = 'resultsForm';
    render();
  },

  addCustomRow(testName){
    const idx = state.tempResults.map(r => r.testName).lastIndexOf(testName);
    state.tempResults.splice(idx + 1, 0, {testName, parameter:'', unit:'', range:'', value:''});
    render();
  },

  removeCustomRow(idx){
    state.tempResults.splice(idx,1);
    render();
  },

  updateCustomField(idx, field, val){
    state.tempResults[idx][field] = val;
  },

  updateResultValue(idx, val){
    state.tempResults[idx].value = val;
    const flag = computeFlag(state.tempResults[idx].range, val);
    const badge = document.getElementById('flagcell-' + idx);
    if(badge) badge.innerHTML = flagBadge(flag);
  },

  saveResults(e){
    e.preventDefault();
    const p = state.patients.find(p => p.id === state.activePatientId);
    p.results = state.tempResults.map(r => ({
      testName: r.testName, parameter: r.parameter, unit: r.unit, range: r.range, value: r.value
    }));
    p.status = 'Completed';
    p.reportDate = new Date().toISOString();
    p.reportedBy = state.user.name;
    DB.setPatients(state.patients);
    state.view = 'dashboard';
    render();
  },

  openPrint(id){
    state.activePatientId = id;
    state.view = 'print';
    render();
  },

  doPrint(){ window.print(); },

  goStaffAdmin(){ state.view = 'staffAdmin'; state.formError=''; render(); },

  addStaff(e){
    e.preventDefault();
    const username = document.getElementById('st-username').value.trim();
    const password = document.getElementById('st-password').value;
    const name = document.getElementById('st-name').value.trim();
    const role = document.getElementById('st-role').value;
    if(!username || !password || !name){
      state.formError = 'All fields are required to add a staff account.';
      render(); return;
    }
    if(state.staff.some(s => s.username.toLowerCase() === username.toLowerCase())){
      state.formError = 'That username is already in use.';
      render(); return;
    }
    state.staff.push({username, password, name, role});
    DB.setStaff(state.staff);
    state.formError = '';
    render();
  },

  removeStaff(username){
    if(username === state.user.username){ alert("You can't remove your own account while logged in."); return; }
    const admins = state.staff.filter(s => s.role === 'admin');
    const target = state.staff.find(s => s.username === username);
    if(target.role === 'admin' && admins.length <= 1){
      alert('At least one administrator account must remain.');
      return;
    }
    if(!confirm('Remove staff account "' + username + '"?')) return;
    state.staff = state.staff.filter(s => s.username !== username);
    DB.setStaff(state.staff);
    render();
  }
};
window.App = App;

/* ============================= Renderers ============================= */
function render(){
  const root = document.getElementById('root');
  if(!state.loaded){ root.innerHTML = '<div style="padding:40px;font-family:sans-serif;color:#5B6B67;">Loading\u2026</div>'; return; }
  if(!state.user){ root.innerHTML = viewLogin(); attachLoginEvents(); return; }

  let inner = '';
  if(state.view === 'dashboard') inner = viewDashboard();
  else if(state.view === 'patientForm') inner = viewPatientForm();
  else if(state.view === 'resultsForm') inner = viewResultsForm();
  else if(state.view === 'print'){ root.innerHTML = viewPrint(); return; }
  else if(state.view === 'staffAdmin') inner = viewStaffAdmin();
  else inner = viewDashboard();

  root.innerHTML = viewShell(inner);
  attachShellEvents();
}

function renderContentOnly(){
  const content = document.getElementById('content-area');
  if(content && state.view === 'dashboard'){ content.innerHTML = dashboardInner(); }
}

function attachLoginEvents(){
  const f = document.getElementById('login-form');
  if(f) f.addEventListener('submit', App.login);
}

function attachShellEvents(){
  const pf = document.getElementById('patient-form');
  if(pf) pf.addEventListener('submit', App.savePatientForm);
  const rf = document.getElementById('results-form');
  if(rf) rf.addEventListener('submit', App.saveResults);
  const sf = document.getElementById('staff-form');
  if(sf) sf.addEventListener('submit', App.addStaff);
  const search = document.getElementById('dash-search');
  if(search) search.addEventListener('input', (e) => App.setSearch(e.target.value));
}

function viewLogin(){
  return `
  <div class="login-screen">
    <div class="login-card">
      <div class="brand">
        <div class="brand-mark">${ICON.drop}</div>
        <div class="brand-text">
          <h1>Life Care Medical Laboratory</h1>
          <p>Staff sign-in</p>
        </div>
      </div>
      ${state.loginError ? `<div class="error-msg">${escapeHtml(state.loginError)}</div>` : ''}
      <form id="login-form">
        <div class="field">
          <label for="login-username">Username</label>
          <input id="login-username" type="text" autocomplete="username" required>
        </div>
        <div class="field">
          <label for="login-password">Password</label>
          <input id="login-password" type="password" autocomplete="current-password" required>
        </div>
        <button type="submit" class="btn btn-primary btn-block">Sign in</button>
      </form>
      <div class="hint">
        First time here? Sign in with <strong>admin</strong> / <strong>admin123</strong>, then open
        Staff Management to change the password and add your team.<br><br>
        Records are stored in this browser's local storage, so each device/browser keeps its own
        patient list. This is a working prototype, not a HIPAA-grade system \u2014 for shared,
        multi-device patient data, pair this front end with a proper secured backend.
      </div>
    </div>
  </div>`;
}

function viewShell(inner){
  const isAdmin = state.user.role === 'admin';
  return `
  <div class="shell">
    <div class="sidebar">
      <div class="brand">
        <div class="brand-mark">${ICON.drop}</div>
        <div class="brand-text">
          <h1>Life Care</h1>
          <p>Medical Laboratory</p>
        </div>
      </div>
      <button class="nav-item ${state.view==='dashboard'?'active':''}" onclick="App.setView('dashboard')">${ICON.dashboard} Dashboard</button>
      <button class="nav-item ${state.view==='patientForm'?'active':''}" onclick="App.startNewPatient()">${ICON.add} New Patient</button>
      ${isAdmin ? `<button class="nav-item ${state.view==='staffAdmin'?'active':''}" onclick="App.goStaffAdmin()">${ICON.staff} Staff Management</button>` : ''}
      <div class="sidebar-footer">
        <div class="user-chip"><strong>${escapeHtml(state.user.name)}</strong>${state.user.role === 'admin' ? 'Administrator' : 'Lab Technician'}</div>
        <button class="nav-item" onclick="App.logout()">${ICON.logout} Log out</button>
      </div>
    </div>
    <div class="main">
      ${inner}
    </div>
  </div>`;
}

function dashboardInner(){
  const q = state.search.trim().toLowerCase();
  let list = state.patients.filter(p => {
    const testsStr = (p.tests || []).join(', ').toLowerCase();
    const matchesSearch = !q || p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q) ||
      (p.referredBy||'').toLowerCase().includes(q) || testsStr.includes(q);
    const matchesStatus = state.statusFilter === 'All' || p.status === state.statusFilter;
    return matchesSearch && matchesStatus;
  });

  const rows = list.map(p => `
    <tr>
      <td>${escapeHtml(p.id)}</td>
      <td>${escapeHtml(p.name)}</td>
      <td>${escapeHtml(p.age)} / ${escapeHtml(p.gender)}</td>
      <td>${escapeHtml((p.tests || []).join(', '))}</td>
      <td>${escapeHtml(p.referredBy)}</td>
      <td>${fmtDate(p.createdAt)}</td>
      <td><span class="status-pill ${p.status==='Completed'?'status-completed':'status-pending'}">${p.status}</span></td>
      <td>
        <div class="row-actions">
          ${p.status==='Pending'
            ? `<button class="btn btn-primary btn-sm" onclick="App.openResults('${p.id}')">Enter Results</button>`
            : `<button class="btn btn-ghost btn-sm" onclick="App.openResults('${p.id}')">Edit Results</button>
               <button class="btn btn-ghost btn-sm" onclick="App.openPrint('${p.id}')">Print</button>`
          }
          <button class="btn btn-ghost btn-sm" onclick="App.startEditPatient('${p.id}')">Edit</button>
          <button class="btn btn-danger btn-sm" onclick="App.deletePatient('${p.id}')">Delete</button>
        </div>
      </td>
    </tr>`).join('');

  return `
    <div class="toolbar">
      <input id="dash-search" class="search-input" type="text" placeholder="Search by name, ID, test, or doctor\u2026" value="${escapeHtml(state.search)}">
      <div class="tabs">
        ${['All','Pending','Completed'].map(s => `<button class="tab-btn ${state.statusFilter===s?'active':''}" onclick="App.setStatusFilter('${s}')">${s}</button>`).join('')}
      </div>
      <div class="spacer"></div>
      <button class="btn btn-primary" onclick="App.startNewPatient()">${ICON.add} New Patient</button>
    </div>
    ${list.length === 0
      ? `<div class="empty-state">No patient records match here yet.<br>Register a new patient to get started.</div>`
      : `<table class="data-table">
          <thead><tr><th>ID</th><th>Patient</th><th>Age / Gender</th><th>Tests</th><th>Referred by</th><th>Registered</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>`
    }
  `;
}

function viewDashboard(){
  return `
    <div class="topbar">
      <div><h2>Patient Records</h2><div class="sub">${state.patients.length} total record${state.patients.length===1?'':'s'}</div></div>
    </div>
    <div class="content" id="content-area">${dashboardInner()}</div>
  `;
}

function viewPatientForm(){
  const editing = state.editingId ? state.patients.find(p => p.id === state.editingId) : null;
  const selectedTests = editing ? (editing.tests || []) : [];
  return `
    <div class="topbar"><div><h2>${editing ? 'Edit Patient' : 'New Patient'}</h2><div class="sub">${editing ? 'Update patient details and adjust the tests ordered' : 'Register a patient and select every test to be run'}</div></div></div>
    <div class="content">
      <div class="form-card" style="max-width:720px;">
        ${state.formError ? `<div class="error-msg">${escapeHtml(state.formError)}</div>` : ''}
        ${editing && editing.status==='Completed' ? `<div class="card-note">Adding a new test here will reopen this record as Pending until results for the new test are entered. Results already entered for unchanged tests are kept.</div>` : ''}
        <form id="patient-form">
          <div class="form-grid">
            <div class="field full">
              <label for="pf-name">Patient full name</label>
              <input id="pf-name" type="text" value="${editing ? escapeHtml(editing.name) : ''}" required>
            </div>
            <div class="field">
              <label for="pf-age">Age</label>
              <input id="pf-age" type="number" min="0" max="130" value="${editing ? escapeHtml(editing.age) : ''}" required>
            </div>
            <div class="field">
              <label for="pf-gender">Gender</label>
              <select id="pf-gender">
                ${['Male','Female','Other'].map(g => `<option value="${g}" ${editing && editing.gender===g ? 'selected':''}>${g}</option>`).join('')}
              </select>
            </div>
            <div class="field full">
              <label for="pf-referred">Referred by (doctor)</label>
              <input id="pf-referred" type="text" placeholder="e.g. Dr. Sharma \u2014 or leave blank for Self" value="${editing ? escapeHtml(editing.referredBy) : ''}">
            </div>
            <div class="field full">
              <label>Tests to run <span style="font-weight:400; color:var(--ink-muted);">(select as many as needed)</span></label>
              <div class="test-checklist">
                ${TEST_NAMES.map(t => `
                  <label class="test-check-item">
                    <input type="checkbox" class="test-check" value="${escapeHtml(t)}" ${selectedTests.includes(t) ? 'checked' : ''}>
                    <span>${escapeHtml(t)}</span>
                  </label>`).join('')}
              </div>
            </div>
          </div>
          <div class="form-actions">
            <button type="submit" class="btn btn-primary">${editing ? 'Save changes' : 'Register patient'}</button>
            <button type="button" class="btn btn-ghost" onclick="App.setView('dashboard')">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

function viewResultsForm(){
  const p = state.patients.find(p => p.id === state.activePatientId);
  const groups = p.tests && p.tests.length ? p.tests : [...new Set(state.tempResults.map(r => r.testName))];

  const sections = groups.map(testName => {
    const isCustom = testName === 'Other / Custom';
    const rowsHtml = state.tempResults.map((r, idx) => ({r, idx}))
      .filter(x => x.r.testName === testName)
      .map(({r, idx}) => `
        <tr>
          ${isCustom ? `
            <td><input type="text" value="${escapeHtml(r.parameter)}" oninput="App.updateCustomField(${idx},'parameter',this.value)" placeholder="Parameter"></td>
            <td><input type="text" value="${escapeHtml(r.value)}" oninput="App.updateCustomField(${idx},'value',this.value); App.updateResultValue(${idx}, this.value)" placeholder="Result"></td>
            <td><input type="text" value="${escapeHtml(r.unit)}" oninput="App.updateCustomField(${idx},'unit',this.value)" placeholder="Unit" style="width:90px;"></td>
            <td><input type="text" value="${escapeHtml(r.range)}" oninput="App.updateCustomField(${idx},'range',this.value)" placeholder="e.g. 4-11 or <200" style="width:130px;"></td>
            <td id="flagcell-${idx}">${flagBadge(computeFlag(r.range, r.value))}</td>
            <td><button type="button" class="btn btn-ghost btn-sm" onclick="App.removeCustomRow(${idx})">Remove</button></td>
          ` : `
            <td>${escapeHtml(r.parameter)}</td>
            <td><input type="text" value="${escapeHtml(r.value)}" oninput="App.updateResultValue(${idx}, this.value)" placeholder="Enter result"></td>
            <td>${escapeHtml(r.unit)}</td>
            <td>${escapeHtml(r.range)}</td>
            <td id="flagcell-${idx}">${flagBadge(computeFlag(r.range, r.value))}</td>
          `}
        </tr>`).join('');

    return `
      <div class="results-group-title">${escapeHtml(testName)}</div>
      <table class="results-table">
        <thead>
          <tr>
            <th style="width:26%;">Parameter</th>
            <th style="width:20%;">Result</th>
            <th style="width:14%;">Unit</th>
            <th style="width:18%;">Normal range</th>
            <th style="width:12%;">Flag</th>
            ${isCustom ? '<th></th>' : ''}
          </tr>
        </thead>
        <tbody>${rowsHtml}</tbody>
      </table>
      ${isCustom ? `<div style="margin-top:10px;"><button type="button" class="btn btn-ghost btn-sm" onclick="App.addCustomRow('${escapeHtml(testName)}')">${ICON.add} Add parameter</button></div>` : ''}
    `;
  }).join('');

  return `
    <div class="topbar"><div><h2>Test Results</h2><div class="sub">${escapeHtml(p.name)} \u2014 ID ${escapeHtml(p.id)} \u2014 ${(p.tests||[]).length} test${(p.tests||[]).length===1?'':'s'} ordered</div></div></div>
    <div class="content">
      <div class="form-card" style="max-width:860px;">
        <form id="results-form">
          ${sections}
          <div class="form-actions" style="margin-top:22px;">
            <button type="submit" class="btn btn-primary">Save &amp; mark completed</button>
            <button type="button" class="btn btn-ghost" onclick="App.setView('dashboard')">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

function viewStaffAdmin(){
  const rows = state.staff.map(s => `
    <tr>
      <td>${escapeHtml(s.username)}</td>
      <td>${escapeHtml(s.name)}</td>
      <td>${s.role === 'admin' ? 'Administrator' : 'Lab Technician'}</td>
      <td><button class="btn btn-danger btn-sm" onclick="App.removeStaff('${s.username}')">Remove</button></td>
    </tr>`).join('');

  return `
    <div class="topbar"><div><h2>Staff Management</h2><div class="sub">Only administrators can add or remove staff accounts</div></div></div>
    <div class="content">
      <div class="form-card" style="max-width:520px; margin-bottom:24px;">
        ${state.formError ? `<div class="error-msg">${escapeHtml(state.formError)}</div>` : ''}
        <form id="staff-form">
          <div class="form-grid">
            <div class="field"><label for="st-username">Username</label><input id="st-username" type="text" required></div>
            <div class="field"><label for="st-password">Password</label><input id="st-password" type="text" required></div>
            <div class="field"><label for="st-name">Full name</label><input id="st-name" type="text" required></div>
            <div class="field">
              <label for="st-role">Role</label>
              <select id="st-role"><option value="staff">Lab Technician</option><option value="admin">Administrator</option></select>
            </div>
          </div>
          <div class="form-actions"><button type="submit" class="btn btn-primary">Add staff account</button></div>
        </form>
      </div>
      <table class="data-table" style="max-width:640px;">
        <thead><tr><th>Username</th><th>Name</th><th>Role</th><th></th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}

function viewPrint(){
  const p = state.patients.find(p => p.id === state.activePatientId);
  const groups = p.tests && p.tests.length ? p.tests : [...new Set((p.results||[]).map(r => r.testName))];

  const sections = groups.map(testName => {
    const rows = (p.results || []).filter(r => r.testName === testName).map(r => {
      const flag = computeFlag(r.range, r.value);
      return `
        <tr>
          <td>${escapeHtml(r.parameter)}</td>
          <td><strong>${escapeHtml(r.value) || '\u2014'}</strong></td>
          <td>${escapeHtml(r.unit)}</td>
          <td>${escapeHtml(r.range)}</td>
          <td class="flag-cell">${flag && flag !== 'Normal' ? escapeHtml(flag) : (flag ? 'Normal' : '')}</td>
        </tr>`;
    }).join('');
    return `
      <div class="rep-section-title">${escapeHtml(testName)}</div>
      <table class="rep-table">
        <thead><tr><th>Parameter</th><th>Result</th><th>Unit</th><th>Normal range</th><th>Flag</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    `;
  }).join('');

  return `
    <div class="print-page-wrap">
      <div class="print-toolbar no-print">
        <button class="btn btn-ghost" onclick="App.setView('dashboard')">Back to dashboard</button>
        <button class="btn btn-primary" onclick="App.doPrint()">Print report</button>
      </div>
      <div class="print-sheet">
        <div class="rep-header">
          <div class="brand-mark" style="color:#0E4D45;">${ICON.drop}</div>
          <div>
            <h1>Life Care Medical Laboratory</h1>
            <p>Diagnostic &amp; Pathology Services &nbsp;|&nbsp; Report generated ${fmtDate(new Date().toISOString())}</p>
          </div>
        </div>
        <div class="rep-meta">
          <div><span class="k">Patient name</span><strong>${escapeHtml(p.name)}</strong></div>
          <div><span class="k">Patient ID</span>${escapeHtml(p.id)}</div>
          <div><span class="k">Age / Gender</span>${escapeHtml(p.age)} yrs / ${escapeHtml(p.gender)}</div>
          <div><span class="k">Referred by</span>${escapeHtml(p.referredBy)}</div>
          <div><span class="k">Sample registered</span>${fmtDate(p.createdAt)}</div>
          <div><span class="k">Report date</span>${fmtDate(p.reportDate)}</div>
          <div><span class="k">Reported by</span>${escapeHtml(p.reportedBy || '\u2014')}</div>
        </div>
        ${sections}
        <div class="rep-footer">
          <div>Generated via Life Care Laboratory Information System</div>
          <div class="sign-line">Authorized Signatory</div>
        </div>
        <div class="rep-disclaimer">
          Reference ranges shown are general adult ranges and may vary by analyzer, method, or population;
          verify against your laboratory's validated ranges before clinical use. This report is not valid
          without the authorized signatory's signature and laboratory stamp. Results should be interpreted
          by a qualified physician in the context of the patient's clinical presentation.
        </div>
      </div>
    </div>
  `;
}

boot();
