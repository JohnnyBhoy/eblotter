# CLAUDE.md — Barangay e-Blotter System

## What This App Does

A full-stack **MERN** web application for the **Barangay e-Blotter System** of the
Province of Antique (expandable to all Philippine provinces). Barangay officials create
official incident blotter reports. PNP Municipal Stations view blotters from their
covered barangays. Provincial and Super Admin accounts have escalating oversight,
reporting, and management access.

All geographic data (Region → Province → Municipality → Barangay) is sourced from
the **Philippine Standard Geographic Code (PSGC)** static JSON. Every account level
has a tailored dashboard and can export data as **PDF**, **Word (.docx)**, and
**Excel/CSV**.

---

## Tech Stack

| Layer        | Technology                                                      |
|--------------|-----------------------------------------------------------------|
| Frontend     | React (Vite), React Router v6, Tailwind CSS, Axios             |
| Backend      | Node.js, Express.js                                             |
| Database     | MongoDB Atlas (Mongoose)                                        |
| Auth         | JWT + bcrypt                                                    |
| PDF Export   | `pdfkit` (server-side)                                          |
| Word Export  | `docx` npm package (server-side)                               |
| Excel Export | `exceljs` npm package (server-side)                            |
| PSGC Data    | Static JSON from `https://psgc.gitlab.io/api/` (downloaded at build) |
| Deployment   | Vercel (frontend) + Render (backend)                            |

---

## Project Structure

```
barangay-eblotter/
├── client/
│   ├── public/
│   │   └── assets/                     # Seals, logos, images
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── Sidebar.jsx          # Role-aware sidebar links
│   │   │   │   └── Footer.jsx
│   │   │   ├── blotter/
│   │   │   │   ├── BlotterForm.jsx      # 4-step wizard (barangay only)
│   │   │   │   ├── BlotterCard.jsx
│   │   │   │   ├── BlotterDetail.jsx
│   │   │   │   ├── ComplainantForm.jsx
│   │   │   │   ├── RespondentForm.jsx   # Dynamic multi-respondent
│   │   │   │   ├── WitnessForm.jsx      # Dynamic multi-witness
│   │   │   │   └── IncidentForm.jsx
│   │   │   ├── psgc/
│   │   │   │   └── PSGCSelector.jsx     # Cascading Region→Province→Municipality→Barangay dropdowns
│   │   │   ├── reports/
│   │   │   │   ├── ExportBar.jsx        # PDF / Word / Excel export buttons
│   │   │   │   ├── StatsCard.jsx
│   │   │   │   ├── IncidentTypeChart.jsx
│   │   │   │   ├── MonthlyTrendChart.jsx
│   │   │   │   └── BlotterTable.jsx     # Reusable filterable table
│   │   │   └── common/
│   │   │       ├── ProtectedRoute.jsx
│   │   │       ├── StatusBadge.jsx
│   │   │       └── ConfirmModal.jsx
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   └── ForgotPassword.jsx
│   │   │   ├── barangay/
│   │   │   │   ├── Dashboard.jsx        # Own blotters, stats, quick create
│   │   │   │   ├── CreateBlotter.jsx    # 4-step form
│   │   │   │   ├── BlotterList.jsx      # Own blotters, filter/search
│   │   │   │   └── BlotterView.jsx      # Single blotter + PDF/Word/Excel export
│   │   │   ├── municipal/
│   │   │   │   ├── Dashboard.jsx        # All blotters from covered barangays
│   │   │   │   ├── BlotterList.jsx      # Read-only, filter by barangay/type/status
│   │   │   │   ├── BlotterView.jsx
│   │   │   │   └── Reports.jsx          # Municipal summary report + Excel export
│   │   │   ├── province/
│   │   │   │   ├── Dashboard.jsx        # Province-wide stats and charts
│   │   │   │   ├── BlotterList.jsx      # All blotters in the province
│   │   │   │   ├── MunicipalBreakdown.jsx
│   │   │   │   └── Reports.jsx          # Province-wide report + Excel export
│   │   │   └── superadmin/
│   │   │       ├── Dashboard.jsx        # System-wide overview
│   │   │       ├── AccountManagement.jsx  # Create/manage all accounts
│   │   │       ├── AddAccount.jsx         # Form: select level → PSGC → create
│   │   │       ├── BarangayManagement.jsx # Register barangays via PSGC
│   │   │       ├── MunicipalManagement.jsx
│   │   │       ├── ProvinceManagement.jsx
│   │   │       ├── BlotterList.jsx        # System-wide blotter view
│   │   │       ├── Reports.jsx            # All-level report + Excel export
│   │   │       └── AuditLog.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   ├── useBlotter.js
│   │   │   └── usePSGC.js               # Load and cascade PSGC data
│   │   ├── data/
│   │   │   └── psgc.json                # Downloaded PSGC static JSON
│   │   ├── utils/
│   │   │   ├── api.js
│   │   │   ├── roleGuard.js
│   │   │   └── formatters.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env
│   ├── vite.config.js
│   └── package.json
│
├── server/
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Barangay.js
│   │   ├── Municipality.js
│   │   ├── Province.js
│   │   ├── Blotter.js
│   │   └── AuditLog.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── blotters.js
│   │   ├── users.js
│   │   ├── geography.js              # PSGC-backed geography endpoints
│   │   └── export.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── blotterController.js
│   │   ├── userController.js
│   │   ├── geographyController.js
│   │   └── exportController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── roleMiddleware.js
│   │   └── errorHandler.js
│   ├── utils/
│   │   ├── generatePDF.js
│   │   ├── generateDocx.js
│   │   ├── generateExcel.js
│   │   └── blotterNumber.js
│   ├── data/
│   │   └── psgc.json                 # Same PSGC static JSON, used server-side too
│   ├── seed/
│   │   └── seedData.js
│   ├── .env
│   ├── server.js
│   └── package.json
│
└── CLAUDE.md
```

---

## Account Levels & Permissions

There are **4 account levels**. Each has a scoped dashboard, data access, and reports.

| Role               | Scope                              | Create Blotter | View Blotter              | Manage Accounts       | Export              |
|--------------------|------------------------------------|----------------|---------------------------|-----------------------|---------------------|
| `barangay`         | Own barangay only                  | ✅ Yes         | Own barangay only         | ❌ No                 | PDF, Word, Excel    |
| `municipal`        | All barangays in their municipality| ❌ No          | All in municipality       | ❌ No                 | Excel, PDF summary  |
| `provincial`       | All municipalities in province     | ❌ No          | All in province           | ❌ No                 | Excel, PDF summary  |
| `super_admin`      | System-wide                        | ❌ No          | Everything                | ✅ Full control       | All formats         |

### Role-Based Route Map
```
/login                        → public
/barangay/dashboard           → role: barangay
/barangay/blotters            → role: barangay
/barangay/blotters/create     → role: barangay
/barangay/blotters/:id        → role: barangay
/municipal/dashboard          → role: municipal
/municipal/blotters           → role: municipal
/municipal/reports            → role: municipal
/province/dashboard           → role: provincial
/province/blotters            → role: provincial
/province/reports             → role: provincial
/superadmin/dashboard         → role: super_admin
/superadmin/accounts          → role: super_admin
/superadmin/accounts/add      → role: super_admin
/superadmin/barangays         → role: super_admin
/superadmin/blotters          → role: super_admin
/superadmin/reports           → role: super_admin
/superadmin/audit             → role: super_admin
```

After login, redirect based on role:
```js
const roleRedirect = {
  barangay:    '/barangay/dashboard',
  municipal:   '/municipal/dashboard',
  provincial:  '/province/dashboard',
  super_admin: '/superadmin/dashboard',
};
```

---

## PSGC Geographic Data

### Source
Download the static JSON files from the PSGC GitLab API:
- Regions: `https://psgc.gitlab.io/api/regions/`
- Provinces: `https://psgc.gitlab.io/api/provinces/`
- Cities/Municipalities: `https://psgc.gitlab.io/api/cities-municipalities/`
- Barangays: `https://psgc.gitlab.io/api/barangays/`

Save as `client/src/data/psgc.json` and `server/data/psgc.json`.
Structure the JSON as:
```json
{
  "regions": [{ "code": "060000000", "name": "Region VI (Western Visayas)" }],
  "provinces": [{ "code": "064500000", "name": "Antique", "regionCode": "060000000" }],
  "municipalities": [{ "code": "064501000", "name": "Bugasong", "provinceCode": "064500000" }],
  "barangays": [{ "code": "064501001", "name": "Brgy. Ilaya", "municipalityCode": "064501000" }]
}
```

### `client/src/hooks/usePSGC.js`
```js
import psgc from '../data/psgc.json';

export function usePSGC() {
  const getRegions = () => psgc.regions;

  const getProvinces = (regionCode) =>
    psgc.provinces.filter(p => p.regionCode === regionCode);

  const getMunicipalities = (provinceCode) =>
    psgc.municipalities.filter(m => m.provinceCode === provinceCode);

  const getBarangays = (municipalityCode) =>
    psgc.barangays.filter(b => b.municipalityCode === municipalityCode);

  return { getRegions, getProvinces, getMunicipalities, getBarangays };
}
```

### `client/src/components/psgc/PSGCSelector.jsx`
A cascading 4-level dropdown component used in the Super Admin "Add Account" and
"Register Barangay" forms. Each level filters based on the parent selection.
Props:
```js
<PSGCSelector
  value={{ region, province, municipality, barangay }}
  onChange={(selection) => setGeoSelection(selection)}
  levels={['region', 'province', 'municipality', 'barangay']} // pass subset as needed
/>
```

---

## MongoDB Schemas

### Province (`server/models/Province.js`)
```js
{
  psgcCode: { type: String, required: true, unique: true },
  name: { type: String, required: true },        // e.g. "Antique"
  regionCode: String,
  regionName: String,
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
}
```

### Municipality (`server/models/Municipality.js`)
```js
{
  psgcCode: { type: String, required: true, unique: true },
  name: { type: String, required: true },        // e.g. "Bugasong"
  province: { type: ObjectId, ref: 'Province', required: true },
  provinceCode: String,
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
}
```

### Barangay (`server/models/Barangay.js`)
```js
{
  psgcCode: { type: String, required: true, unique: true },
  name: { type: String, required: true },        // e.g. "Brgy. Ilaya"
  municipality: { type: ObjectId, ref: 'Municipality', required: true },
  municipalityCode: String,
  province: { type: ObjectId, ref: 'Province', required: true },
  punongBarangay: String,
  barangaySecretary: String,
  contactNumber: String,
  address: String,
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
}
```

### User (`server/models/User.js`)
```js
{
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },    // bcrypt hashed
  role: {
    type: String,
    enum: ['barangay', 'municipal', 'provincial', 'super_admin'],
    required: true
  },
  fullName: String,
  email: String,
  contactNumber: String,

  // Scope references — only the relevant one is populated per role
  barangay:     { type: ObjectId, ref: 'Barangay' },     // role: barangay
  municipality: { type: ObjectId, ref: 'Municipality' }, // role: municipal
  province:     { type: ObjectId, ref: 'Province' },     // role: provincial

  // PSGC display strings (denormalized for fast display)
  scopeLabel: String,  // e.g. "Brgy. Ilaya, Bugasong, Antique"

  isActive: { type: Boolean, default: true },
  lastLogin: Date,
  createdBy: { type: ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
}
```

### Blotter (`server/models/Blotter.js`)
```js
{
  // --- Reference ---
  blotterNumber: { type: String, unique: true }, // e.g. BLT-BUGASONG-2025-0001

  // --- Origin ---
  barangay:     { type: ObjectId, ref: 'Barangay',     required: true },
  municipality: { type: ObjectId, ref: 'Municipality', required: true },
  province:     { type: ObjectId, ref: 'Province',     required: true },
  createdBy:    { type: ObjectId, ref: 'User',         required: true },

  // --- Incident ---
  incident: {
    type: {
      type: String,
      enum: [
        'Physical Injury', 'Theft', 'Robbery', 'Estafa / Fraud',
        'Threat / Intimidation', 'Unjust Vexation', 'Trespassing',
        'Oral Defamation / Slander', 'Domestic Violence',
        'Drug-Related Incident', 'Noise Disturbance',
        'Property Damage', 'Missing Person', 'Other'
      ],
      required: true
    },
    otherType: String,
    dateOccurred:  { type: Date, required: true },
    timeOccurred:  String,
    placeOccurred: { type: String, required: true },
    narrative:     { type: String, required: true },
    motive: String,
    weaponOrObjectUsed: String,
    isReferred:   { type: Boolean, default: false },
    referredTo:   String,
    referredDate: Date,
  },

  // --- Complainant ---
  complainant: {
    lastName:    { type: String, required: true },
    firstName:   { type: String, required: true },
    middleName:  String,
    suffix:      String,
    alias:       String,
    sex:         { type: String, enum: ['Male', 'Female', 'Other'] },
    birthDate:   Date,
    age:         Number,
    civilStatus: { type: String, enum: ['Single','Married','Widowed','Separated','Live-in'] },
    nationality: { type: String, default: 'Filipino' },
    religion:    String,
    occupation:  String,
    contactNumber: String,
    address: {
      houseNo:      String,
      street:       String,
      barangay:     String,
      municipality: String,
      province:     String,
      zipCode:      String,
    },
    idType:   String,
    idNumber: String,
  },

  // --- Respondents (1 or more) ---
  respondents: [{
    lastName:   { type: String, required: true },
    firstName:  { type: String, required: true },
    middleName: String,
    suffix:     String,
    alias:      String,
    sex:        { type: String, enum: ['Male','Female','Other','Unknown'] },
    birthDate:  Date,
    age:        Number,
    civilStatus: String,
    nationality: { type: String, default: 'Filipino' },
    occupation:  String,
    contactNumber: String,
    address: {
      houseNo:      String,
      street:       String,
      barangay:     String,
      municipality: String,
      province:     String,
      zipCode:      String,
    },
    relationshipToComplainant: String,
    isKnown: { type: Boolean, default: true },
  }],

  // --- Witnesses (optional) ---
  witnesses: [{
    lastName:      String,
    firstName:     String,
    middleName:    String,
    contactNumber: String,
    address:       String,
    statement:     String,
  }],

  // --- Resolution ---
  reliefRequested: String,
  barangayAction: {
    actionTaken:       String,
    settledAmicably:   { type: Boolean, default: false },
    settlementDate:    Date,
    settlementDetails: String,
    endorsedToPNP:     { type: Boolean, default: false },
    endorsementDate:   Date,
    endorsementReason: String,
  },

  // --- Status ---
  status: {
    type: String,
    enum: ['draft','recorded','under_mediation','settled','referred_to_pnp','closed'],
    default: 'recorded'
  },

  // --- Recorded By ---
  recordedBy: {
    name:      { type: String, required: true },
    position:  String,
    signature: String,
  },

  // --- Meta ---
  dateRecorded: { type: Date, default: Date.now },
  lastUpdated:  Date,
  updatedBy:    { type: ObjectId, ref: 'User' },
  isDeleted:    { type: Boolean, default: false },
  deletedAt:    Date,
  deletedBy:    { type: ObjectId, ref: 'User' },
}
```

### AuditLog (`server/models/AuditLog.js`)
```js
{
  action:         String,           // CREATE_BLOTTER | UPDATE_STATUS | EXPORT_PDF | CREATE_ACCOUNT | etc.
  performedBy:    { type: ObjectId, ref: 'User' },
  targetBlotter:  { type: ObjectId, ref: 'Blotter' },
  targetUser:     { type: ObjectId, ref: 'User' },
  details:        String,
  ipAddress:      String,
  timestamp:      { type: Date, default: Date.now }
}
```

---

## API Endpoints

### Auth (`/api/auth`)
| Method | Endpoint            | Access | Description              |
|--------|---------------------|--------|--------------------------|
| POST   | `/login`            | Public | Login → returns JWT      |
| POST   | `/logout`           | Auth   | Clear session            |
| POST   | `/change-password`  | Auth   | Change own password      |

### Blotters (`/api/blotters`)
| Method | Endpoint          | Role                          | Description                         |
|--------|-------------------|-------------------------------|-------------------------------------|
| POST   | `/`               | barangay                      | Create blotter                      |
| GET    | `/`               | all roles                     | List blotters (auto-scoped by role) |
| GET    | `/:id`            | all roles                     | Single blotter                      |
| PUT    | `/:id`            | barangay                      | Edit blotter (own only)             |
| PATCH  | `/:id/status`     | barangay, super_admin         | Update status                       |
| DELETE | `/:id`            | super_admin                   | Soft delete                         |

### Export (`/api/export`)
| Method | Endpoint              | Role       | Description                             |
|--------|-----------------------|------------|-----------------------------------------|
| GET    | `/blotter/:id/pdf`    | all roles  | Single blotter as PDF                   |
| GET    | `/blotter/:id/docx`   | all roles  | Single blotter as Word doc              |
| GET    | `/blotter/:id/excel`  | all roles  | Single blotter as Excel                 |
| GET    | `/summary/excel`      | municipal, provincial, super_admin | Filtered blotter list as Excel |
| GET    | `/summary/pdf`        | municipal, provincial, super_admin | Summary report as PDF         |

### Users / Accounts (`/api/users`)
| Method | Endpoint            | Role        | Description                                |
|--------|---------------------|-------------|--------------------------------------------|
| GET    | `/`                 | super_admin | List all accounts (filterable by role)     |
| POST   | `/`                 | super_admin | Create account (any role)                  |
| GET    | `/:id`              | super_admin | Get single account                         |
| PUT    | `/:id`              | super_admin | Update account details                     |
| PATCH  | `/:id/toggle`       | super_admin | Activate / deactivate account              |
| DELETE | `/:id`              | super_admin | Delete account                             |

### Geography (`/api/geography`)
> Serves filtered PSGC data from the server-side `psgc.json`.
> Used to validate and register geographic entities.

| Method | Endpoint                       | Role        | Description                          |
|--------|--------------------------------|-------------|--------------------------------------|
| GET    | `/regions`                     | super_admin | All regions                          |
| GET    | `/provinces?region=:code`      | super_admin | Provinces by region                  |
| GET    | `/municipalities?province=:code` | super_admin | Municipalities by province         |
| GET    | `/barangays?municipality=:code` | super_admin | Barangays by municipality           |
| POST   | `/provinces/register`          | super_admin | Register a province in the system    |
| POST   | `/municipalities/register`     | super_admin | Register a municipality              |
| POST   | `/barangays/register`          | super_admin | Register a barangay                  |

---

## Super Admin: Add Account Flow

The `AddAccount` page (`/superadmin/accounts/add`) is the core Super Admin feature.
It works as a **2-step form**:

### Step 1 — Select Account Level & Geography
1. Dropdown: **Account Level** — `Barangay | Municipal | Provincial`
2. **PSGCSelector** component cascades based on level chosen:
   - Provincial: Region → Province
   - Municipal: Region → Province → Municipality
   - Barangay: Region → Province → Municipality → Barangay
3. System checks if the selected geographic entity is already registered; if not, it auto-registers it from PSGC data before creating the account.

### Step 2 — Account Credentials & Details
- Full name of the account holder
- Username (auto-suggested from barangay/municipality name, editable)
- Email address
- Contact number
- Password + Confirm Password
- Position / designation
- Submit → creates `User` doc, links to appropriate geographic model, logs to AuditLog

### Validation Rules
- No duplicate accounts for the same barangay/municipality/province
- Username must be unique system-wide
- Password minimum 8 characters, must contain letters and numbers
- Super admin can reset passwords at any time from the account list

---

## Dashboard Pages by Role

### Barangay Dashboard (`/barangay/dashboard`)
**Stats cards:**
- Total blotters (all time)
- Blotters this month
- Pending / under mediation
- Settled / closed

**Charts:**
- Blotters by status (donut)
- Blotters by incident type (bar)

**Table:** Last 10 blotters with status badge and quick-view link

**Actions:**
- "Create New Blotter" button (primary CTA)
- Export own blotters as Excel

**Reports available:**
- Individual blotter → PDF, Word, Excel
- All own blotters → Excel (with date range filter)

---

### Municipal Dashboard (`/municipal/dashboard`)
**Scope:** All blotters from all barangays in the account's municipality

**Stats cards:**
- Total blotters in municipality
- Blotters this month
- Active barangays (those that have filed at least 1 blotter)
- Referred to PNP (count)

**Charts:**
- Blotters per barangay (horizontal bar)
- Blotters by incident type (pie)
- Monthly trend (line chart, last 12 months)

**Table:** All blotters — filterable by barangay, incident type, status, date range

**Reports available:**
- Municipal blotter summary → PDF (header: municipality name, date range, counts by type)
- Full blotter list → Excel (all columns: blotter no., barangay, incident type, complainant name, date, status)

---

### Provincial Dashboard (`/province/dashboard`)
**Scope:** All blotters from all municipalities in the account's province

**Stats cards:**
- Total blotters province-wide
- Total this month
- Total municipalities reporting
- Total barangays with blotters

**Charts:**
- Blotters per municipality (bar)
- Blotters by incident type (pie)
- Monthly trend (line, last 12 months)
- Top 5 barangays by blotter count (ranked list)

**Table:** All blotters — filterable by municipality, barangay, incident type, status, date range

**Reports available:**
- Province-wide summary → PDF (letterhead: Province of Antique, date range, stats breakdown)
- Full blotter list → Excel
- Per-municipality breakdown → Excel (one sheet per municipality)

---

### Super Admin Dashboard (`/superadmin/dashboard`)
**Scope:** System-wide

**Stats cards:**
- Total blotters (all provinces)
- Total registered barangays
- Total registered municipalities
- Total active accounts by role

**Charts:**
- Blotters by province (bar)
- Blotters by incident type (pie)
- Monthly trend system-wide (line)

**Tables:**
- Recent accounts created (last 10)
- Recent blotters system-wide (last 10)
- Audit log (last 20 actions)

**Reports available:**
- All blotters → Excel (filterable by region, province, municipality, barangay, date range)
- Account list → Excel
- Audit log → Excel

---

## Export Specifications

### Single Blotter PDF (`server/utils/generatePDF.js`)
Generate using `pdfkit`. Layout:
```
[Republic PH Seal]  BARANGAY BLOTTER  [Province of Antique Seal]
Republic of the Philippines
Province of Antique — Municipality of [X] — Barangay [Y]

Blotter No.: BLT-BUGASONG-2025-0001        Date Recorded: Jan 1, 2025

INCIDENT INFORMATION
  Type:         Physical Injury
  Date/Time:    January 1, 2025 at 2:30 PM
  Place:        Purok 3, Brgy. Ilaya, Bugasong, Antique
  Narrative:    [full paragraph text]

COMPLAINANT
  Name:         DELA CRUZ, Juan P.
  Address:      ...
  Contact:      ...

RESPONDENT(S)
  [Table: Name | Address | Relationship | Contact]

WITNESSES
  [if any]

RELIEF REQUESTED:   [text]
ACTION TAKEN:       [text]
STATUS:             Recorded

_______________________          _______________________
Recorded by / Signature          Punong Barangay / Signature
[Name], [Position]               [Name]
Date: ___________
```

### Summary Report PDF (`server/utils/generatePDF.js` — summary mode)
- Header with account scope (municipality or province name)
- Date range covered
- Stats summary table (counts by incident type, by status)
- Blotter list table (blotter no., barangay, incident type, complainant, date, status)

### Excel Export (`server/utils/generateExcel.js`) — use `exceljs`
All Excel exports share this structure:

**Sheet 1: Summary**
- Title row (bold, merged)
- Scope label (Province / Municipality / Barangay)
- Date range
- Stats table: Incident Type | Count | % of Total

**Sheet 2: Blotter Records**
Column headers (bold, frozen first row, auto-filter enabled):
```
Blotter No. | Date Recorded | Barangay | Municipality | Province |
Incident Type | Date of Incident | Place | Complainant Name |
No. of Respondents | Status | Referred to PNP | Recorded By
```

**Formatting:**
- Alternating row colors
- Status column uses color-coded cell fill:
  - `recorded` → light blue
  - `under_mediation` → yellow
  - `settled` → green
  - `referred_to_pnp` → orange
  - `closed` → gray
- Auto-fit column widths

**Provincial Excel — Additional Sheet 3: Per-Municipality Breakdown**
One row per municipality: Municipality | Total Blotters | By Incident Type columns | % of Province Total

---

## Blotter Number Generation (`server/utils/blotterNumber.js`)

Format: `BLT-[MUNICIPALITY]-[YEAR]-[SEQUENCE]`
Example: `BLT-BUGASONG-2025-0001`

```js
export async function generateBlotterNumber(municipalityId) {
  const mun = await Municipality.findById(municipalityId);
  const year = new Date().getFullYear();
  const prefix = `BLT-${mun.name.toUpperCase().replace(/\s+/g, '-')}-${year}`;
  const last = await Blotter.findOne(
    { blotterNumber: { $regex: `^${prefix}` } },
    {},
    { sort: { blotterNumber: -1 } }
  );
  const seq = last
    ? String(parseInt(last.blotterNumber.split('-').pop()) + 1).padStart(4, '0')
    : '0001';
  return `${prefix}-${seq}`;
}
```

---

## Role-Based Data Scoping (Backend)

```js
// blotterController.js
export const scopeFilter = async (user) => {
  switch (user.role) {
    case 'barangay':
      return { barangay: user.barangay, isDeleted: false };

    case 'municipal': {
      const barangays = await Barangay.find(
        { municipality: user.municipality },
        '_id'
      );
      return { barangay: { $in: barangays.map(b => b._id) }, isDeleted: false };
    }

    case 'provincial': {
      const municipalities = await Municipality.find(
        { province: user.province },
        '_id'
      );
      const barangays = await Barangay.find(
        { municipality: { $in: municipalities.map(m => m._id) } },
        '_id'
      );
      return { barangay: { $in: barangays.map(b => b._id) }, isDeleted: false };
    }

    case 'super_admin':
      return { isDeleted: false };
  }
};
```

---

## Middleware

### `authMiddleware.js`
```js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Populate scope references for use in controllers
    req.user = await User.findById(decoded.id)
      .populate('barangay')
      .populate('municipality')
      .populate('province');
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};
```

### `roleMiddleware.js`
```js
export const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role))
    return res.status(403).json({ message: 'Access denied' });
  next();
};
```

---

## `server/server.js`
```js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import blotterRoutes from './routes/blotters.js';
import userRoutes from './routes/users.js';
import geographyRoutes from './routes/geography.js';
import exportRoutes from './routes/export.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();
connectDB();

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json());

app.use('/api/auth',       authRoutes);
app.use('/api/blotters',   blotterRoutes);
app.use('/api/users',      userRoutes);
app.use('/api/geography',  geographyRoutes);
app.use('/api/export',     exportRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

---

## `client/src/utils/api.js`
```js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
```

---

## Environment Variables

### `client/.env`
```env
VITE_API_URL=https://your-render-app.onrender.com
```

### `server/.env`
```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/eblotter
JWT_SECRET=your_very_strong_secret_here
JWT_EXPIRES_IN=8h
CORS_ORIGIN=https://your-app.vercel.app
NODE_ENV=production
```

---

## Seed Data (`server/seed/seedData.js`)

On first run, create:
1. **1 Super Admin** — `username: superadmin`, strong password
2. **Province** — Antique (PSGC code: `064500000`)
3. **5 Municipalities** — Bugasong, Culasi, Tibiao, Sebaste, Valderrama (from PSGC)
4. **15 Barangays** — 3 per municipality (from PSGC)
5. **1 Provincial account** — scoped to Antique
6. **5 Municipal accounts** — one per municipality
7. **15 Barangay accounts** — one per barangay
8. **10 Sample blotters** — spread across barangays, varied statuses and incident types

---

## Deployment

### Backend → Render
1. Push to GitHub
2. New **Web Service** on Render
3. Root Directory: `server`
4. Build Command: `npm install`
5. Start Command: `node server.js`
6. Add all `server/.env` vars in Render dashboard

### Frontend → Vercel
1. New project on Vercel
2. Root Directory: `client`
3. Framework: Vite
4. Add env var: `VITE_API_URL=https://your-render-url.onrender.com`

### MongoDB Atlas
1. Free cluster → network access `0.0.0.0/0`
2. Create DB user → paste URI into `MONGO_URI`
3. Run `node server/seed/seedData.js` locally once

---

## Quick Start (Local Development)

```bash
git clone https://github.com/youruser/barangay-eblotter.git
cd barangay-eblotter

# Backend
cd server && npm install
cp .env.example .env       # fill in values
node seed/seedData.js      # seed initial data
npm run dev                # http://localhost:5000

# Frontend (new terminal)
cd ../client && npm install
cp .env.example .env       # VITE_API_URL=http://localhost:5000
npm run dev                # http://localhost:5173
```

---

## Security Notes

- bcrypt saltRounds: 12
- JWT expires in 8 hours (one work shift)
- `municipal` and `provincial` roles are **read-only** on blotters
- Soft delete only — blotters never permanently removed
- All create / update / delete / export actions logged to AuditLog
- CORS restricted to deployed frontend origin only
- PSGC data is static (no live API calls at runtime) — fast and offline-safe

---

## Design System

- **Colors:** Navy `#003366` (primary), White `#FFFFFF`, Gold `#FFD700` (accent)
- **Status badge colors:**
  - `draft` → gray
  - `recorded` → blue
  - `under_mediation` → yellow
  - `settled` → green
  - `referred_to_pnp` → orange
  - `closed` → slate
- **Typography:** `Barlow Condensed` (headings), `Source Sans 3` (body/forms)
- **Tone:** Official Philippine government portal — clean, trustworthy, mobile-friendly
- **Seals:** Include Republic of the Philippines and Province of Antique seals in app header and on all exported PDFs
- **Print CSS:** `@media print` styles so BlotterDetail renders printably without exporting