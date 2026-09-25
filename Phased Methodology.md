## PHASE 1: Foundation & Setup

### Step 1.1: Project Structure
- Create root folder named "hms_mvp"
- Initialize Git repository with "git init"
- Create .gitignore at root (node_modules, .env, dist, build, .DS_Store)
- Create README.md with project title, description, and tech stack
- Stage all files and create initial commit "Initial project setup"
- Create remote repository on GitHub named "hms_mvp"
- Link local to remote with "git remote add origin" and push to main
- Create and switch to "dev" branch for all development work
- Push dev branch to remote

### Step 1.2: Backend Initialization
- Create "server" folder inside root
- Navigate into server and run "npm init y"
- Install core dependencies: express, mongoose, dotenv, cors, bcryptjs, jsonwebtoken, multer
- Install nodemon as dev dependency
- Create folder structure inside server: config, models, routes, controllers, middleware, utils
- Create main entry file server.js with express, cors, and dotenv configuration
- Add a health check route returning success message
- Add start and dev scripts to package.json (dev uses nodemon)
- Start server and verify it runs without errors

### Step 1.3: Database Connection
- Create MongoDB Atlas cluster (free tier)
- Get connection string and add to .env as MONGO_URI
- In config folder, create db.js using mongoose.connect with MONGO_URI
- Import and call db connection in server.js
- Start server and verify successful MongoDB connection in terminal
- Create a seed script placeholder in utils folder for future sample data

### Step 1.4: Environment Configuration
- Create .env file inside server folder
- Add variables: PORT, MONGO_URI, JWT_SECRET, JWT_EXPIRE
- Install helmet and express-mongo-sanitize for security
- Configure security middleware in server.js
- Test all connections by restarting the server
- Verify health check endpoint responds correctly

### Step 1.5: Git Checkpoint
- Stage all changes
- Commit with message "Backend server setup, DB connection, and security config"
- Push to dev branch

---

## PHASE 2: MODULE 1 - Authentication & User Management

### Backend Development

**Step 2.1: User Model**
- Create User schema in models folder
- Add fields: name, email, password, phone, role, address, dateOfBirth, gender, status (active/suspended)
- Set role as enum: admin, receptionist, doctor, nurse, pharmacist, lab_technician, accountant, patient
- Add password hashing pre-save middleware using bcryptjs
- Add method to compare entered password with hashed password
- Add method to generate JWT token with user id and role
- Add password reset token and expiry fields
- Add timestamps

**Step 2.2: Authentication Middleware**
- Create protect middleware in middleware folder that extracts JWT from Bearer token header
- Verify JWT and attach decoded user to request object
- Fetch full user from database and confirm user still exists and is active
- Create authorize middleware that accepts allowed roles as arguments
- Block request with 403 if user role is not in the allowed list
- Add input sanitization middleware using express-mongo-sanitize
- Add rate limiting middleware for auth routes

**Step 2.3: Auth Controller**
- Create authController.js in controllers folder
- Implement register function: validate input, check duplicate email, hash password, create user, return token
- Implement login function: verify email and password, check user status, return token
- Implement getProfile function: return current user details excluding password
- Implement updateProfile function: allow name, phone, address updates
- Implement changePassword function: verify old password, hash new password
- Implement forgotPassword function: generate reset token, save to user
- Implement resetPassword function: validate token, set new password

**Step 2.4: Auth Routes**
- Create authRoutes.js in routes folder
- POST /api/auth/register (admin only, creates staff accounts)
- POST /api/auth/login (public)
- GET /api/auth/me (protected)
- PUT /api/auth/profile (protected)
- PUT /api/auth/change-password (protected)
- POST /api/auth/forgot-password (public)
- PUT /api/auth/reset-password/:token (public)
- Register auth routes in server.js under /api/auth

**Step 2.5: Testing**
- Test register endpoint by creating one admin user via Postman
- Test login endpoint and verify JWT is returned
- Test getProfile with valid and invalid tokens
- Test role authorization by creating users with different roles
- Test forgot and reset password flow
- Verify error handling for duplicate emails and wrong credentials

### Frontend Development

**Step 2.6: React Project Setup**
- Navigate to root folder and run "npx create-react-app client"
- Navigate into client folder
- Install dependencies: react-router-dom, axios, react-icons, react-toastify
- Create folder structure inside src: components, pages, context, services, assets, styles
- Create global CSS file with base styles, color variables, and typography
- Clean up default React boilerplate files

**Step 2.7: Axios Service Configuration**
- In services folder, create api.js
- Create axios instance with baseURL pointing to backend server
- Add request interceptor to attach JWT from localStorage to Authorization header
- Add response interceptor to handle 401 errors and redirect to login
- Export the configured axios instance

**Step 2.8: Routing Setup**
- Install React Router DOM
- Create route configuration in App.js
- Define routes: /login, /register, /dashboard, /patients, /doctors, /appointments, /pharmacy, /billing, /records, /lab, /profile
- Create ProtectedRoute component that checks AuthContext for valid token
- Create RoleRoute component that checks user role against allowed roles list
- Wrap protected routes with both components
- Add catch-all 404 route

**Step 2.9: Auth Context**
- Create AuthContext.js in context folder
- Define state: user, token, isAuthenticated, loading
- Implement login function: call API, store token in localStorage, set user state
- Implement logout function: clear localStorage, reset state, redirect to login
- Implement auto-login on page refresh by checking localStorage for valid token
- Wrap entire App component with AuthContext.Provider

**Step 2.10: Login Page**
- Create LoginPage.js in pages folder
- Build form with email and password inputs
- Add form validation (required fields, email format)
- Connect form submission to AuthContext login function
- Show loading spinner during API call
- Display error toast for invalid credentials
- Redirect to role-based dashboard on success

**Step 2.11: Registration Page (Admin Only)**
- Create RegisterPage.js in pages folder
- Build form with fields: name, email, password, phone, role dropdown, dateOfBirth, gender
- Role dropdown includes all 8 roles
- Add form validation for all fields
- Connect to register API endpoint
- Show success toast and redirect to user management on completion

**Step 2.12: Dashboard Layout**
- Create Layout component with sidebar and header
- Build responsive sidebar navigation with links filtered by user role
- Admin sees all links, receptionist sees patients and appointments, doctor sees appointments and records, nurse sees wards and vitals, pharmacist sees pharmacy, lab tech sees lab, accountant sees billing, patient sees own records
- Add header with user name, role badge, and logout button
- Add collapsible sidebar for mobile view
- Create DashboardPage.js as the default landing page after login

**Step 2.13: Profile Page**
- Create ProfilePage.js in pages folder
- Display current user information in read-only view
- Add edit mode toggle with form fields
- Allow updating name, phone, and address
- Add change password section with old and new password fields
- Connect to update profile and change password APIs
- Show success toast on update

**Step 2.14: Module Testing**
- Test complete login flow for each role
- Verify sidebar shows correct links per role
- Test protected routes redirect to login when not authenticated
- Test registration flow as admin
- Test profile update and password change
- Fix bugs and polish UI

### Step 2.15: Git Checkpoint
- Stage all changes
- Commit with message "Auth module complete with role-based access and frontend"
- Push to dev branch

---

## PHASE 3: MODULE 2 - Patient Registration & Management

### Backend Development

**Step 3.1: Patient Model**
- Create Patient schema in models folder
- Add fields: patientId (auto-generated unique ID), fullName, dateOfBirth, age (virtual), gender, phone, email, address, bloodGroup, maritalStatus, occupation, emergencyContact (name, phone, relationship), medicalHistory (array of conditions), allergies (array), insuranceProvider, insuranceNumber, registeredBy (reference to User)
- Add timestamps
- Add index on patientId and phone for fast search

**Step 3.2: Patient Controller**
- Create patientController.js in controllers folder
- Implement createPatient: validate input, generate unique patientId, save to database, return patient object
- Implement getAllPatients: return paginated list with search by name, phone, or patientId
- Implement getPatientById: return single patient with full details
- Implement updatePatient: update patient fields, validate changes
- Implement deletePatient: soft delete by setting status to inactive
- Implement getPatientStats: return total count, gender distribution, age groups

**Step 3.3: Search and Filter Logic**
- Implement text search across fullName, phone, and patientId using regex
- Filter by gender, bloodGroup, and registration date range
- Implement pagination with page and limit query parameters
- Sort by registration date, name, or age

**Step 3.4: Patient Routes**
- Create patientRoutes.js in routes folder
- POST /api/patients (admin, receptionist)
- GET /api/patients (admin, receptionist, doctor, nurse)
- GET /api/patients/:id (admin, receptionist, doctor, nurse)
- PUT /api/patients/:id (admin, receptionist)
- DELETE /api/patients/:id (admin only)
- GET /api/patients/stats (admin)
- Apply protect and authorize middleware to all routes
- Register routes in server.js under /api/patients

**Step 3.5: Testing**
- Test patient creation with all required fields
- Test search by name, phone, and patientId
- Test pagination and sorting
- Verify role restrictions (pharmacist and lab tech cannot create patients)
- Test update and soft delete functionality

### Frontend Development

**Step 3.6: Patient List Page**
- Create PatientListPage.js in pages folder
- Display patients in a data table with columns: patientId, fullName, gender, age, phone, bloodGroup, registrationDate
- Add search bar that filters by name, phone, or patientId
- Add filter dropdowns for gender and bloodGroup
- Implement pagination controls
- Add row click to navigate to patient detail page
- Add "Register New Patient" button (visible to admin and receptionist only)
- Show loading skeleton while fetching data

**Step 3.7: Patient Registration Form**
- Create PatientFormPage.js in pages folder
- Build multi-section form: Personal Info, Contact Info, Emergency Contact, Medical History
- Personal Info section: fullName, dateOfBirth, gender, bloodGroup, maritalStatus, occupation
- Contact Info section: phone, email, address
- Emergency Contact section: name, phone, relationship
- Medical History section: dynamic array of conditions and allergies with add/remove buttons
- Add form validation for all required fields
- Connect to create patient API
- Show success toast with generated patientId on completion
- Redirect to patient detail page after creation

**Step 3.8: Patient Detail Page**
- Create PatientDetailPage.js in pages folder
- Display patient information in organized sections matching the form
- Show patientId prominently at the top
- Add edit button (admin and receptionist only) that opens the form in edit mode
- Add tabs for: Overview, Appointments, Medical Records, Invoices
- Overview tab shows basic info and medical history
- Appointments tab shows list of past and upcoming appointments
- Medical Records tab shows linked medical records
- Invoices tab shows linked bills
- Connect all tabs to their respective APIs

**Step 3.9: Patient Edit Flow**
- Reuse PatientFormPage component with pre-filled data
- Fetch patient data by ID and populate form fields
- Handle update API call on form submission
- Show confirmation dialog before saving changes
- Redirect to patient detail page after update

**Step 3.10: Module Testing**
- Test complete patient registration flow as receptionist
- Test patient search and filtering
- Test patient detail view with all tabs
- Test patient edit flow
- Verify role-based visibility of buttons and actions
- Fix bugs and polish UI

### Step 3.11: Git Checkpoint
- Stage all changes
- Commit with message "Patient registration and management module complete"
- Push to dev branch

---

## PHASE 4: MODULE 3 - Doctor Management & Appointment Scheduling

### Backend Development

**Step 4.1: Doctor Model**
- Create Doctor schema in models folder
- Add fields: userId (reference to User), employeeId, specialization, qualifications (array), experience (years), consultationFee, availableDays (array of strings), availableSlots (array of objects with startTime and endTime), isActive, bio
- Add timestamps

**Step 4.2: Appointment Model**
- Create Appointment schema in models folder
- Add fields: appointmentId (auto-generated), patientId (reference to Patient), doctorId (reference to Doctor), date, timeSlot (startTime, endTime), status (enum: booked, in-progress, completed, cancelled, no-show), reason, notes, bookedBy (reference to User), cancelledReason
- Add timestamps
- Add compound index on doctorId and date for availability checks

**Step 4.3: Doctor Controller**
- Create doctorController.js in controllers folder
- Implement createDoctor: link to existing user account, save doctor profile
- Implement getAllDoctors: return list with specialization filter and availability
- Implement getDoctorById: return full profile with schedule
- Implement updateDoctor: update profile and availability
- Implement getDoctorSchedule: return available slots for a specific date
- Implement getDoctorPatients: return all patients assigned to this doctor

**Step 4.4: Appointment Controller**
- Create appointmentController.js in controllers folder
- Implement createAppointment: validate patient and doctor exist, check slot availability, prevent double booking, save appointment
- Implement getAllAppointments: filter by date, doctor, patient, status
- Implement getAppointmentById: return full details with patient and doctor info
- Implement updateAppointmentStatus: change status with validation (cannot complete a cancelled appointment)
- Implement cancelAppointment: set status to cancelled with reason
- Implement getAvailableSlots: return unbooked slots for a doctor on a given date
- Implement getTodayAppointments: return all appointments for today filtered by doctor

**Step 4.5: Doctor and Appointment Routes**
- Create doctorRoutes.js and appointmentRoutes.js
- POST /api/doctors (admin only)
- GET /api/doctors (all authenticated roles)
- GET /api/doctors/:id (all authenticated roles)
- PUT /api/doctors/:id (admin, doctor self)
- GET /api/doctors/:id/schedule (all authenticated roles)
- POST /api/appointments (admin, receptionist, patient)
- GET /api/appointments (all roles, filtered by role)
- GET /api/appointments/:id (all roles)
- PUT /api/appointments/:id/status (admin, doctor, receptionist)
- PUT /api/appointments/:id/cancel (admin, receptionist, patient)
- GET /api/appointments/available-slots (all authenticated roles)
- Register routes in server.js

**Step 4.6: Testing**
- Test doctor creation and profile update
- Test appointment booking with slot availability check
- Test double booking prevention
- Test appointment status transitions
- Test available slots query for different dates
- Verify doctors only see their own appointments by default

### Frontend Development

**Step 4.7: Doctor List Page**
- Create DoctorListPage.js in pages folder
- Display doctors in a card grid or table with: name, specialization, experience, consultationFee, availability status
- Add filter by specialization dropdown
- Add search by name
- Click on doctor card navigates to doctor profile
- Add "Add Doctor" button visible to admin only

**Step 4.8: Doctor Profile and Form Page**
- Create DoctorProfilePage.js showing full doctor details
- Display specialization, qualifications, experience, consultation fee
- Show weekly schedule in a visual timetable format
- Create DoctorFormPage.js for adding and editing doctor profiles
- Form fields: select existing user account, specialization, qualifications, experience, consultationFee
- Add schedule builder: select available days and set time slots for each day
- Connect to create and update doctor APIs

**Step 4.9: Appointment Booking Page**
- Create AppointmentBookingPage.js in pages folder (receptionist and patient)
- Step 1: Search and select patient (or auto-fill if coming from patient detail)
- Step 2: Select doctor from dropdown (show specialization and fee)
- Step 3: Select date from calendar (disable past dates)
- Step 4: Fetch and display available time slots for selected doctor and date
- Step 5: Select time slot and add reason for visit
- Show appointment summary before confirmation
- Connect to create appointment API
- Show success toast with appointment details on completion

**Step 4.10: Appointment List Page**
- Create AppointmentListPage.js in pages folder
- Display appointments in a table with: appointmentId, patientName, doctorName, date, time, status
- Add date picker filter to view appointments by day
- Add status filter dropdown
- Doctors see only their own appointments
- Receptionists and admins see all appointments
- Add status badge with color coding (booked = blue, completed = green, cancelled = red, no-show = gray)
- Add action buttons per row: View, Complete, Cancel (based on role and current status)

**Step 4.11: Appointment Detail Page**
- Create AppointmentDetailPage.js
- Show full appointment information: patient details, doctor details, date, time, reason, status
- Add status update buttons: Start Consultation (changes to in-progress), Complete, Cancel
- Add notes text area for doctor to add consultation notes
- Add link to create medical record from this appointment
- Add link to patient detail page

**Step 4.12: Module Testing**
- Test doctor creation and schedule setup as admin
- Test appointment booking flow as receptionist
- Test available slots update after booking
- Test appointment status workflow
- Test doctor view showing only own appointments
- Fix bugs and polish UI

### Step 4.13: Git Checkpoint
- Stage all changes
- Commit with message "Doctor management and appointment scheduling module complete"
- Push to dev branch

---

## PHASE 5: MODULE 4 - Medical Records, Nursing & Lab Management

### Backend Development

**Step 5.1: Medical Record Model**
- Create MedicalRecord schema in models folder
- Add fields: recordId (auto-generated), patientId (reference), doctorId (reference), appointmentId (reference), visitDate, chiefComplaint, diagnosis (array), clinicalNotes, prescription (array of objects: medicineName, dosage, frequency, duration, instructions), treatmentPlan, followUpDate, status (active, resolved, referred)
- Add timestamps

**Step 5.2: Vital Signs Model**
- Create VitalSign schema in models folder
- Add fields: patientId (reference), nurseId (reference), recordId (reference, optional), temperature, bloodPressureSystolic, bloodPressureDiastolic, heartRate, respiratoryRate, oxygenSaturation, weight, height, bmi (calculated), notes, recordedAt
- Add timestamps

**Step 5.3: Lab Test Model**
- Create LabTest schema in models folder
- Add fields: testId (auto-generated), patientId (reference), doctorId (reference), recordId (reference), testName, testCategory (blood, urine, imaging, etc.), priority (routine, urgent, stat), status (requested, in-progress, completed, cancelled), requestedDate, completedDate, results (text or file path), normalRange, technicianNotes, technicianId (reference to User)
- Add timestamps

**Step 5.4: Medical Record Controller**
- Create medicalRecordController.js
- Implement createRecord: link to patient, doctor, and appointment, save diagnosis and prescription
- Implement getRecordsByPatient: return all records for a patient in chronological order
- Implement getRecordById: return single record with populated doctor and patient info
- Implement updateRecord: allow doctor to update diagnosis and notes
- Implement getRecordsByDoctor: return all records created by a specific doctor

**Step 5.5: Vital Signs Controller**
- Create vitalSignController.js
- Implement recordVitals: save vital signs recorded by nurse
- Implement getVitalsByPatient: return vitals history for a patient
- Implement getLatestVitals: return most recent vitals for quick view
- Calculate BMI automatically from height and weight

**Step 5.6: Lab Test Controller**
- Create labTestController.js
- Implement requestLabTest: doctor creates lab test request linked to patient and record
- Implement getAllLabRequests: filter by status, patient, doctor
- Implement updateLabStatus: lab technician updates status from requested to in-progress to completed
- Implement uploadLabResults: lab technician adds results and notes
- Implement getLabResultsByPatient: return all lab results for a patient

**Step 5.7: Routes**
- Create medicalRecordRoutes.js, vitalSignRoutes.js, labTestRoutes.js
- POST /api/records (doctor only)
- GET /api/records/patient/:patientId (doctor, nurse, admin, patient self)
- GET /api/records/:id (doctor, nurse, admin)
- PUT /api/records/:id (doctor only)
- POST /api/vitals (nurse, doctor)
- GET /api/vitals/patient/:patientId (doctor, nurse, admin)
- GET /api/vitals/latest/:patientId (doctor, nurse)
- POST /api/lab (doctor only)
- GET /api/lab (lab_technician, doctor, admin)
- PUT /api/lab/:id/status (lab_technician)
- PUT /api/lab/:id/results (lab_technician)
- Register all routes in server.js

**Step 5.8: Testing**
- Test medical record creation during consultation
- Test vital signs recording by nurse
- Test BMI auto-calculation
- Test lab request creation by doctor
- Test lab result upload by lab technician
- Verify role restrictions on all endpoints

### Frontend Development

**Step 5.9: Medical Record Form Page (Doctor)**
- Create MedicalRecordFormPage.js in pages folder
- Pre-fill patient and appointment info if coming from appointment detail
- Form sections: Chief Complaint, Diagnosis (dynamic list with add/remove), Clinical Notes, Prescription (dynamic list with medicineName, dosage, frequency, duration, instructions), Treatment Plan, Follow-up Date
- Add medicine autocomplete or dropdown from pharmacy inventory
- Connect to create record API
- Show success toast and redirect to patient detail on completion

**Step 5.10: Medical Record View Page**
- Create MedicalRecordViewPage.js
- Display record in a clean, readable format organized by sections
- Show doctor name, visit date, diagnosis, prescription table, and notes
- Add print button for generating a printable version
- Show linked lab test results if any
- Show linked vital signs if any
- Add chronological timeline view when viewing all records for a patient

**Step 5.11: Vital Signs Recording Page (Nurse)**
- Create VitalSignsPage.js in pages folder
- Search and select patient
- Form fields: temperature, BP systolic, BP diastolic, heart rate, respiratory rate, SpO2, weight, height
- Auto-calculate and display BMI in real time
- Show previous vitals history in a table below the form
- Add trend indicators (up/down arrows comparing to last reading)
- Connect to record vitals API

**Step 5.12: Lab Request Page (Doctor)**
- Create LabRequestPage.js
- Select patient and link to current medical record
- Select test name from predefined list or enter custom test
- Select test category and priority level
- Add clinical notes for the lab technician
- Connect to lab request API
- Show list of pending lab requests for the current patient

**Step 5.13: Lab Dashboard Page (Lab Technician)**
- Create LabDashboardPage.js in pages folder
- Display lab requests in a table grouped by status: Requested, In Progress, Completed
- Add filter by priority and date
- Click on a request to open detail view
- Add "Start Processing" button to change status to in-progress
- Add results form: text area for results, normal range input, technician notes
- Add "Complete" button to finalize results
- Connect to lab status update and results upload APIs

**Step 5.14: Module Testing**
- Test full consultation flow: doctor opens appointment, records vitals (nurse), creates medical record, requests lab test
- Test lab technician receiving and completing lab requests
- Test medical record history view for a patient
- Test vital signs trend display
- Verify all role restrictions
- Fix bugs and polish UI

### Step 5.15: Git Checkpoint
- Stage all changes
- Commit with message "Medical records, nursing vitals, and lab management complete"
- Push to dev branch

---

## PHASE 6: MODULE 5 - Pharmacy & Medicine Inventory

### Backend Development

**Step 6.1: Medicine Model**
- Create Medicine schema in models folder
- Add fields: medicineId (auto-generated), name, genericName, category (tablet, syrup, injection, cream, etc.), manufacturer, unitPrice, quantityInStock, reorderLevel, expiryDate, batchNumber, supplier, storageInstructions, requiresPrescription (boolean), isActive
- Add timestamps
- Add index on name and genericName for search

**Step 6.2: Dispense Record Model**
- Create DispenseRecord schema in models folder
- Add fields: dispenseId (auto-generated), patientId (reference), prescriptionId (reference to MedicalRecord prescription), medicineId (reference), quantity, unitPrice, totalPrice, dispensedBy (reference to User), dispensedAt, notes
- Add timestamps

**Step 6.3: Medicine Controller**
- Create medicineController.js
- Implement addMedicine: add new medicine to inventory
- Implement getAllMedicines: return paginated list with search and filters
- Implement getMedicineById: return single medicine details
- Implement updateMedicine: update stock, price, or details
- Implement deleteMedicine: soft delete or deactivate
- Implement getLowStockMedicines: return medicines below reorder level
- Implement getExpiringMedicines: return medicines expiring within 30 days
- Implement getMedicineStats: total medicines, total value, low stock count, expired count

**Step 6.4: Dispense Controller**
- Create dispenseController.js
- Implement dispenseMedicine: verify prescription exists, check stock availability, reduce stock quantity, create dispense record
- Implement getDispenseHistory: filter by patient, date, medicine
- Implement getPendingPrescriptions: return all prescriptions not yet dispensed

**Step 6.5: Routes**
- Create medicineRoutes.js and dispenseRoutes.js
- POST /api/medicines (admin, pharmacist)
- GET /api/medicines (admin, pharmacist, doctor)
- GET /api/medicines/:id (admin, pharmacist)
- PUT /api/medicines/:id (admin, pharmacist)
- DELETE /api/medicines/:id (admin only)
- GET /api/medicines/low-stock (admin, pharmacist)
- GET /api/medicines/expiring (admin, pharmacist)
- POST /api/dispense (pharmacist only)
- GET /api/dispense/history (admin, pharmacist)
- GET /api/dispense/pending (pharmacist)
- Register routes in server.js

**Step 6.6: Testing**
- Test medicine CRUD operations
- Test stock reduction on dispense
- Test low stock and expiring medicine queries
- Test dispensing against a valid prescription
- Test prevention of dispensing more than available stock
- Verify role restrictions

### Frontend Development

**Step 6.7: Medicine Inventory Page**
- Create MedicineInventoryPage.js in pages folder
- Display medicines in a table with: name, genericName, category, quantity, unitPrice, expiryDate, status
- Color code rows: red for expired, orange for expiring soon, yellow for low stock
- Add search by name or generic name
- Add filter by category and stock status
- Add "Add Medicine" button (admin and pharmacist)
- Add pagination

**Step 6.8: Medicine Form Page**
- Create MedicineFormPage.js for adding and editing medicines
- Form fields: name, genericName, category dropdown, manufacturer, unitPrice, quantityInStock, reorderLevel, expiryDate, batchNumber, supplier, storageInstructions, requiresPrescription checkbox
- Add form validation (quantity and price must be positive, expiry must be future date)
- Connect to create and update medicine APIs
- Show success toast on completion

**Step 6.9: Prescription Dispensing Page (Pharmacist)**
- Create DispensingPage.js in pages folder
- Display pending prescriptions in a list fetched from medical records
- Each prescription shows: patient name, doctor name, date, medicine list with dosages
- Click on a prescription to expand details
- For each medicine in the prescription, show available stock quantity
- Add quantity to dispense input (pre-filled with prescribed quantity)
- Show total price calculation
- Add "Dispense" button that calls dispense API and reduces stock
- Show warning if stock is insufficient
- Mark prescription as fully dispensed when all medicines are issued

**Step 6.10: Dispense History Page**
- Create DispenseHistoryPage.js
- Display all dispense records in a table: dispenseId, patientName, medicineName, quantity, totalPrice, dispensedBy, date
- Add filter by date range and patient
- Add search functionality
- Add export to CSV button (optional)

**Step 6.11: Stock Alerts Dashboard**
- Create StockAlertsPage.js
- Display low stock medicines in a card list with current quantity and reorder level
- Display expiring medicines with days remaining until expiry
- Add quick reorder note functionality
- Show summary stats: total low stock items, total expiring items

**Step 6.12: Module Testing**
- Test medicine addition and editing
- Test prescription dispensing flow from pharmacist view
- Test stock reduction after dispensing
- Test low stock and expiry alerts
- Test dispense history view
- Fix bugs and polish UI

### Step 6.13: Git Checkpoint
- Stage all changes
- Commit with message "Pharmacy and medicine inventory module complete"
- Push to dev branch

---

## PHASE 7: MODULE 6 - Billing & Invoicing

### Backend Development

**Step 7.1: Invoice Model**
- Create Invoice schema in models folder
- Add fields: invoiceId (auto-generated), patientId (reference), appointmentId (reference), items (array of objects: description, category (consultation, medicine, lab, room, procedure), quantity, unitPrice, totalPrice), subtotal, tax, discount, totalAmount, paymentStatus (enum: unpaid, partial, paid, refunded), paymentMethod (cash, card, insurance, transfer), paymentDate, dueDate, generatedBy (reference to User), notes
- Add timestamps

**Step 7.2: Payment Model**
- Create Payment schema in models folder
- Add fields: paymentId (auto-generated), invoiceId (reference), amount, paymentMethod, transactionReference, paymentDate, status (success, failed, pending), processedBy (reference to User)
- Add timestamps

**Step 7.3: Invoice Controller**
- Create invoiceController.js
- Implement generateInvoice: auto-populate items from appointment (consultation fee), linked prescriptions (medicine costs), and linked lab tests (test costs), calculate totals
- Implement getAllInvoices: filter by patient, date range, payment status
- Implement getInvoiceById: return full invoice with patient and item details
- Implement updateInvoice: add or remove line items, recalculate totals
- Implement deleteInvoice: only if unpaid and created within 24 hours
- Implement getInvoiceStats: total revenue, unpaid amount, daily/weekly/monthly breakdown

**Step 7.4: Payment Controller**
- Create paymentController.js
- Implement recordPayment: create payment record, update invoice payment status, handle partial payments
- Implement getPaymentHistory: filter by date, method, status
- Implement getReceipt: return formatted receipt data for a specific payment

**Step 7.5: Routes**
- Create invoiceRoutes.js and paymentRoutes.js
- POST /api/invoices (admin, accountant, receptionist)
- GET /api/invoices (admin, accountant, doctor, patient self)
- GET /api/invoices/:id (admin, accountant, patient self)
- PUT /api/invoices/:id (admin, accountant)
- DELETE /api/invoices/:id (admin only)
- GET /api/invoices/stats (admin, accountant)
- POST /api/payments (admin, accountant)
- GET /api/payments/history (admin, accountant)
- GET /api/payments/receipt/:id (admin, accountant, patient self)
- Register routes in server.js

**Step 7.6: Testing**
- Test auto-generation of invoice from appointment data
- Test manual addition of line items
- Test total calculation with tax and discount
- Test payment recording and invoice status update
- Test partial payment handling
- Verify role restrictions

### Frontend Development

**Step 7.7: Invoice Generator Page**
- Create InvoiceGeneratorPage.js in pages folder
- Step 1: Select patient and appointment
- Step 2: Auto-populate consultation fee from doctor profile
- Step 3: Auto-populate medicine costs from dispensed prescriptions
- Step 4: Auto-populate lab test costs from completed lab tests
- Step 5: Allow manual addition of extra line items (room charges, procedures)
- Display itemized table with running subtotal
- Add tax percentage and discount fields
- Show final total prominently
- Add "Generate Invoice" button
- Connect to generate invoice API

**Step 7.8: Invoice List Page**
- Create InvoiceListPage.js
- Display invoices in a table: invoiceId, patientName, date, totalAmount, paymentStatus
- Color code payment status: unpaid = red, partial = orange, paid = green
- Add filter by payment status and date range
- Add search by patient name or invoice ID
- Add pagination
- Click row to view invoice details

**Step 7.9: Invoice Detail and Payment Page**
- Create InvoiceDetailPage.js
- Display full invoice with hospital header, patient info, itemized table, totals
- Add "Record Payment" button for unpaid or partial invoices
- Payment modal: select payment method, enter amount, add transaction reference
- Show payment history for this invoice if multiple partial payments exist
- Add "Print Invoice" button that opens a print-friendly view
- Update invoice status automatically after full payment

**Step 7.10: Payment History Page**
- Create PaymentHistoryPage.js
- Display all payments in a table: paymentId, invoiceId, patientName, amount, method, date, status
- Add filter by date range and payment method
- Add daily and monthly total summaries at the top
- Add export functionality (optional)

**Step 7.11: Module Testing**
- Test invoice generation from appointment data
- Test manual line item addition
- Test payment recording flow
- Test partial payment handling
- Test invoice print view
- Verify role restrictions (doctor cannot access billing)
- Fix bugs and polish UI

### Step 7.12: Git Checkpoint
- Stage all changes
- Commit with message "Billing and invoicing module complete"
- Push to dev branch

---

## PHASE 8: MODULE 7 - Admin Panel & Role-Based Dashboards

### Backend Development

**Step 8.1: Admin Controllers**
- Create adminController.js in controllers folder
- Implement getDashboardStats: return total patients, total doctors, total appointments today, total revenue this month, bed occupancy rate, pending lab tests, low stock medicines
- Implement getUserManagement: return all users with role, status, last login
- Implement updateUserRole: change user role (admin only)
- Implement suspendUser: set user status to suspended
- Implement activateUser: reactivate suspended user
- Implement getDepartmentStats: return patient count and revenue per department/specialization

**Step 8.2: Report Controllers**
- Create reportController.js
- Implement getRevenueReport: daily, weekly, monthly revenue breakdown
- Implement getPatientReport: new registrations over time, demographics
- Implement getAppointmentReport: total appointments, completion rate, cancellation rate
- Implement getDoctorPerformance: appointments per doctor, patient satisfaction
- Implement getPharmacyReport: medicine sales, stock movement, expiry alerts

**Step 8.3: Admin and Report Routes**
- Create adminRoutes.js and reportRoutes.js
- GET /api/admin/stats (admin only)
- GET /api/admin/users (admin only)
- PUT /api/admin/users/:id/role (admin only)
- PUT /api/admin/users/:id/suspend (admin only)
- PUT /api/admin/users/:id/activate (admin only)
- GET /api/reports/revenue (admin, accountant)
- GET /api/reports/patients (admin)
- GET /api/reports/appointments (admin, receptionist)
- GET /api/reports/doctors (admin)
- GET /api/reports/pharmacy (admin, pharmacist)
- Register routes in server.js

**Step 8.4: Seed Data Script**
- Create seed.js in utils folder
- Generate sample data: 1 admin, 1 receptionist, 3 doctors, 2 nurses, 1 pharmacist, 1 lab technician, 1 accountant, 15 patients
- Generate 30 appointments across different dates and statuses
- Generate 20 medicines with varying stock levels
- Generate 10 medical records with prescriptions
- Generate 5 lab test requests with results
- Generate 10 invoices with payment records
- Add script command to package.json: "seed": "node utils/seed.js"

**Step 8.5: Testing**
- Test all admin endpoints
- Test report generation with seed data
- Verify statistics accuracy
- Run seed script and verify database population
- Test user management actions

### Frontend Development

**Step 8.6: Admin Dashboard Page**
- Create AdminDashboardPage.js in pages folder
- Display summary cards: Total Patients, Total Doctors, Today's Appointments, Monthly Revenue, Pending Lab Tests, Low Stock Alerts
- Add line chart showing patient registrations over the last 6 months
- Add bar chart showing revenue by department
- Add pie chart showing appointment status distribution
- Add recent activity feed showing last 10 actions in the system
- Add quick action buttons: Register Patient, Book Appointment, Add Medicine

**Step 8.7: User Management Page (Admin)**
- Create UserManagementPage.js
- Display all users in a table: name, email, role, status, dateCreated
- Add filter by role and status
- Add search by name or email
- Add action buttons per row: Edit Role, Suspend, Activate
- Role change opens a modal with role dropdown
- Suspend/Activate shows confirmation dialog
- Connect to admin user management APIs

**Step 8.8: Reports Page**
- Create ReportsPage.js with tab navigation
- Revenue Tab: date range picker, revenue chart, summary table
- Patient Tab: registration trend chart, demographics breakdown
- Appointment Tab: completion rate, cancellation rate, doctor-wise breakdown
- Pharmacy Tab: top selling medicines, stock alerts, expiry report
- Add print and export buttons for each report

**Step 8.9: Doctor Dashboard Page**
- Create DoctorDashboardPage.js
- Display today's appointment list with patient names and times
- Show pending lab results for doctor's patients
- Show total patients seen this week
- Show upcoming follow-up appointments

**Step 8.10: Receptionist Dashboard Page**
- Create ReceptionistDashboardPage.js
- Display today's appointment queue with status
- Show recent patient registrations
- Show available doctors for quick booking
- Add quick appointment booking widget

**Step 8.11: Nurse Dashboard Page**
- Create NurseDashboardPage.js
- Display patients currently admitted or in wards
- Show pending vital sign recordings
- Show medication administration schedule
- Show alerts for critical vitals

**Step 8.12: Patient Dashboard Page**
- Create PatientDashboardPage.js
- Display upcoming appointments
- Show recent medical records summary
- Show lab test results
- Show outstanding bills and payment history

**Step 8.13: Module Testing**
- Test admin dashboard with real data from seed script
- Test user management actions
- Test all report views
- Test each role-specific dashboard
- Verify data accuracy across all dashboards
- Fix bugs and polish UI

### Step 8.14: Git Checkpoint
- Stage all changes
- Commit with message "Admin panel, reports, and role-based dashboards complete"
- Push to dev branch

---

## PHASE 9: Testing, Optimization & Deployment

### Step 9.1: Comprehensive End-to-End Testing
- Test full patient journey: receptionist registers patient, books appointment, nurse records vitals, doctor conducts consultation and creates medical record, doctor requests lab test, lab technician completes test, pharmacist dispenses medicine, accountant generates invoice and records payment
- Test each role login and verify correct dashboard and navigation
- Test all CRUD operations across every module
- Test search, filter, and pagination on all list pages
- Test error handling: invalid inputs, network failures, unauthorized access
- Test edge cases: empty databases, concurrent bookings, expired tokens

### Step 9.2: Bug Fixes and UI Polish
- Fix all identified bugs from testing phase
- Improve loading states with skeleton screens
- Add error boundary components in React
- Standardize toast notifications across all pages
- Improve form validation messages
- Ensure consistent styling across all pages
- Add confirmation dialogs for all destructive actions (delete, cancel, suspend)
- Optimize images and assets

### Step 9.3: Performance Optimization
- Implement React.lazy and Suspense for code splitting on route level
- Add lazy loading for large data tables
- Optimize MongoDB queries with proper indexes
- Add pagination limits to prevent large data fetches
- Compress API responses using compression middleware
- Minimize re-renders in React components using memo and useMemo

### Step 9.4: Documentation
- Update README.md with: project overview, features list, tech stack, installation steps, environment variables, API endpoint summary, deployment links, screenshots
- Write HND project report chapters: Introduction, Literature Review, System Analysis, System Design (ERD, Use Case Diagram, DFD Level 0 and Level 1, Sequence Diagrams), Implementation, Testing, Conclusion, Future Enhancements
- Create user manual explaining how each role uses the system
- Capture screenshots of every module for the report appendix
- Prepare viva presentation slides covering problem statement, solution architecture, live demo walkthrough, and future scope

### Step 9.5: Backend Deployment
- Setup MongoDB Atlas production cluster if not already done
- Deploy backend to Render or Railway
- Connect GitHub repository for automatic deployments
- Configure environment variables on hosting platform: MONGO_URI, JWT_SECRET, PORT, NODE_ENV
- Set CORS to allow requests from deployed frontend URL
- Test all API endpoints on deployed backend
- Run seed script on production database

### Step 9.6: Frontend Deployment
- Build production bundle with "npm run build" inside client folder
- Deploy to Vercel or Netlify
- Connect GitHub repository for automatic deployments
- Configure environment variables: REACT_APP_API_URL pointing to deployed backend
- Test all pages and flows on deployed frontend
- Verify API calls connect to production backend

### Step 9.7: Post-Deployment Verification
- Test complete patient journey on deployed application
- Verify all role-based dashboards load correctly
- Test authentication flow on production
- Check browser console for errors
- Test on mobile and tablet screen sizes
- Verify database operations on MongoDB Atlas

### Step 9.8: Final Git Operations
- Merge dev branch into main branch
- Push main to remote
- Tag the release as "v1.0" with "git tag v1.0"
- Push tags with "git push origin v1.0"
- Create GitHub release with changelog
- Submit project report, GitHub repository link, and deployed application links

---

## GIT WORKFLOW RULES

- Always work on the dev branch, never commit directly to main
- Commit after completing each logical step with a clear descriptive message
- Push to remote dev branch at the end of every work session
- Run "git status" before every commit to review changes
- Run "git pull origin dev" before starting work each day
- Merge dev into main only when a full phase is complete and tested
- Use "git log" to maintain a clean commit history for the project report