# Convergent Technology Questionnaire - Project TODO

## Core Features

### Phase 1: Database Schema & Backend Setup
- [x] Initialize web-db-user project
- [x] Create questionnaire submissions table in schema
- [x] Create asset inventory table (UPS, Cooling, Racks, PDUs, Busway, Containments, Surveillance, Access Control, Fire Alarm, Fire Fighting, Electrical, Generators)
- [x] Create DCIM assessment table
- [x] Create sales opportunities table
- [x] Add database helpers in server/db.ts
- [x] Create tRPC procedures for questionnaire submission

### Phase 2: Frontend UI - General Information & DCIM Assessment
- [x] Design layout and navigation structure
- [ ] Create Home page with project overview
- [x] Build form component for general information (client name, location, contact details)
- [x] Build DCIM assessment section with conditional logic
- [x] Implement question: "Does client have DCIM?" (Yes/No)
- [x] Implement question: "Does client need DCIM?" (Yes/No/Unsure) - CRITICAL QUESTION
- [x] Add form validation and error handling

### Phase 3: Frontend UI - Asset Inventory Forms
- [ ] Create multi-step form for asset assessment
- [ ] Build UPS assessment form with specific fields (capacity, battery type, topology)
- [ ] Build Precision Cooling form (DX/CW, capacity, distribution method)
- [ ] Build Racks form (height, width/depth, sensors)
- [ ] Build PDUs form (type, voltage/current, outlet count)
- [ ] Build Busway form (current rating, location, monitoring points)
- [ ] Build Aisle Containments form (type, closure method, condition)
- [ ] Build Surveillance form (system type, camera count, retention period)
- [ ] Build Access Control form (system type, access points, DCIM integration)
- [ ] Build Fire Alarm & Fire Fighting forms (system type, last maintenance date)
- [ ] Build Electrical (LV Panels) form (current rating, breaker type, smart meters)
- [ ] Build Diesel Generators form (capacity, operation mode, fuel autonomy)

### Phase 4: Frontend UI - Sales Opportunities & Report
- [ ] Build opportunities summary section
- [ ] Create proposed solutions checklist (Spare Parts, Maintenance Contract, UPS Upgrade, Cooling Modernization, EcoStruxure IT, etc.)
- [ ] Add follow-up date picker
- [ ] Implement form submission logic
- [ ] Create report preview page (before saving)

### Phase 5: Report Generation & Export
- [ ] Create report generation page
- [ ] Display formatted report with Convergent Technology header
- [ ] Include customer name, location, date in footer
- [ ] Implement PDF export functionality
- [ ] Add ability to view/edit previously submitted questionnaires

### Phase 6: Admin Dashboard & Analytics
- [ ] Create admin dashboard for viewing all submissions
- [ ] Add filters (location, date range, DCIM status)
- [ ] Display sales opportunities summary
- [ ] Create analytics charts (assets by type, DCIM adoption rate, opportunities pipeline)
- [ ] Add export to Excel functionality

### Phase 7: Authentication & User Management
- [ ] Verify Manus OAuth integration
- [ ] Set up role-based access (admin vs field user)
- [ ] Create user profile page
- [ ] Implement logout functionality

### Phase 8: Testing & Deployment
- [ ] Test form validation and error handling
- [ ] Test report generation and export
- [ ] Verify database operations
- [ ] Create checkpoint for deployment
- [ ] Deploy to production

## UI/UX Enhancements
- [ ] Add loading states and spinners
- [ ] Implement toast notifications for form submission
- [ ] Add confirmation dialogs for critical actions
- [ ] Create empty states for lists
- [ ] Add breadcrumb navigation
- [ ] Implement responsive design for mobile
- [ ] Add keyboard shortcuts for form navigation

## Documentation
- [ ] Create user guide for field team
- [ ] Create admin guide for dashboard
- [ ] Document API endpoints
- [ ] Create troubleshooting guide

## Known Issues & Improvements
- [ ] (To be filled as issues are discovered)



## Bug Fixes
- [x] Fix AssetsForm: Product type selection doesn't change form fields dynamically (all products show UPS fields)


- [x] Fix database insert error: Assets table expects different schema (unitCount, specificData fields mismatch)


- [x] Fix database insert error: technology field sends 'default' instead of NULL/empty string


- [x] Add quantity field to assets form
- [x] Replace "غير محدد" with "أخرى" in topology enum to avoid zero/infinity values


- [x] Remove "أخرى" value from topology enum
- [x] Replace "الطوبولجيا" with "Topology" throughout the application


- [x] Replace all occurrences of "Topology" label with "Topology" without translation in assets form


- [x] Create dedicated Reports page with search, filter, and export options


- [x] Add interactive charts to Reports page (Recharts)


- [x] Add bar chart showing asset count by product type to Reports page


- [x] Add top 3 follow-up recommendations section at top of Reports page


- [x] Add pie chart showing asset distribution by status (Active, Inactive, Under Maintenance) to Reports page


- [x] Implement PDF export functionality for Reports page with print-friendly layout


- [ ] Add mandatory engineer name field to General Info form - block progress until filled
- [ ] Implement automatic PDF email sending to arezk@ctechsa.com after questionnaire completion
- [ ] Add PDF header with Convergent Technology logo and footer with Convergent Data Center logo


- [x] Add contact person fields to General Info form: name, job title, phone, email (after client name field)


- [x] Apply Convergent Data Center branding colors and logo to all pages
- [ ] Update all reports to include contact person details (name, job title, phone, email)
- [x] Add network communication protocol field to AssetsForm with options: SNMP, TCP/IP, Backnet over IP, Standalone
- [x] Update all report outputs to include network protocol field in asset details
- [x] Fix 404 error when clicking "ابدأ الآن" button on home page
- [x] Replace "Other" with "Civil Works" in OpportunitiesForm
- [x] Add sensors field to AssetsForm with options: No sensors, Temperature & Humidity, Temperature only, Refer to description


- [x] Remove "Other", "None", "لايوجد" options from all forms to prevent database errors (no such options found in current forms)
- [x] Enhance report output with rich graphics and Convergent Technology Logo
- [x] Add professional tabular forms with borders to report output



- [x] Add executive summary section at the beginning of the report



- [x] Fix "Reports container not found" error when exporting PDF from ReportsPage



- [ ] Fix deployment links - convertechq and datacenter-bqhm4rfx.manus.space not accessible from any browser or user



- [x] Convert web application to Desktop app (Electron) with same UI/UX



- [x] Prepare deployment files for Vercel
- [x] Prepare deployment files for Netlify
- [x] Prepare deployment files for Render



- [x] Create step-by-step visual guide for deploying to Vercel/Netlify without technical commands



- [x] Push project to GitHub repository (https://github.com/abdelhadyrezk1/convergent_tech_questionnaire)


