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

