#  Dialysis Patient Tracker

A full-stack application designed for dialysis clinics to register patients, log treatment sessions, and automatically flag clinical anomalies (like fluid overload or abnormal blood pressure) in real-time.

---

##  Quick Setup (Under 5 Minutes)

**Prerequisites:** Node.js installed, and MongoDB running locally (or a valid MongoDB URI).

1. **Clone the repository:**
   ```bash
   git clone <YOUR_REPO_URL_HERE>
   cd <YOUR_REPO_NAME>
   ```

2. **Start the Backend:**
   ```bash
   cd backend
   npm install
   # Ensure MongoDB is running on mongodb://localhost:27017/dialysis_tracker
   npm run dev
   ```

3. **Start the Frontend (in a NEW terminal window):**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **View the App:** Open your browser to `http://localhost:5173`

---

##  Architecture Overview

This project utilizes a standard **MERN Stack** (MongoDB, Express, React, Node.js) separated into two distinct services:

* **Frontend (React + Vite):** A responsive Single Page Application (SPA) using React Router for navigation and Axios for data fetching. State is managed locally via React Hooks (`useState`, `useEffect`).
* **Backend (Node.js + Express):** A RESTful API handling business logic and anomaly detection. 
* **Database (MongoDB + Mongoose):** A NoSQL database utilizing relational referencing (Sessions belong to Patients via an `ObjectId` reference).

**Data Flow:** The frontend submits session vitals ➔ Express intercepts the payload ➔ Business logic evaluates vitals against the `CLINICAL_THRESHOLDS` config ➔ Anomalies are encoded directly into the database document ➔ The UI dynamically renders clinical alerts based on the returned response.

---

##  Clinical Assumptions & Trade-offs

**Configuration & Avoiding "Magic Numbers":**
To ensure the application is easily maintainable and adheres to best clinical practices, no "magic numbers" are scattered throughout the business logic. All clinical thresholds have been centralized into a `CLINICAL_THRESHOLDS` configuration object located at the top of `backend/routes/sessions.js`.

**Clinical Assumptions & Justifications:**
Based on standard hemodialysis practices, the following assumptions were encoded into the configuration:

1. **Excess Interdialytic Weight Gain (IDWG):** * **Threshold:** `> 4.0 kg` over dry weight.
   * **Justification:** IDWG greater than 4kg generally indicates significant fluid overload, increasing cardiovascular risk and requiring aggressive ultrafiltration, which the nursing staff needs to be alerted to immediately.

2. **Abnormal Blood Pressure:** * **Hypertension Threshold:** Systolic `> 160` OR Diastolic `> 100`. 
   * **Hypotension Threshold:** Systolic `< 90` OR Diastolic `< 60`.
   * **Justification:** These conservative thresholds ensure nurses are alerted to impending intradialytic hypotension or severe hypertensive episodes *before* initiating treatment.

3. **Abnormal Session Duration:** * **Target:** `4.0 hours` (Flagged if `< 3.0 hours` or `> 5.0 hours`).
   * **Justification:** Standard thrice-weekly hemodialysis requires roughly 4 hours for adequate clearance (Kt/V). Sessions shorter than 3 hours risk under-dialysis, while > 5 hours may indicate machine complications or non-standard prolonged therapies requiring clinical review.

**Trade-offs:**
* Currently, these clinical thresholds are applied globally to all patients. In a fully-fledged production environment, these thresholds would be moved to the `Patient` database model to allow for personalized, patient-specific anomaly detection (e.g., a specific patient might have a baseline "normal" systolic BP of 165).

---

## Testing & Seed Data

* **Populate Dummy Data:** Run `node seed.js` (inside the backend folder) to automatically populate the database with example patients and treatment sessions.
* **Run Tests:** Navigate to the `backend` folder and run `npm test` to execute the automated test suite covering core business logic and API routes.

---

## Known Limitations & Future Work

1. **Authentication:** Currently lacks RBAC (Role-Based Access Control). Future versions will implement JWT authentication to separate 'Nurse' vs 'Admin/Nephrologist' views.
2. **Pagination:** The dashboard currently fetches all patients and today's sessions at once. This needs server-side pagination for production scale.
3. **Enhanced Filtering:** Allow doctors to filter session histories by specific date ranges or specific types of anomalies.

---

## AI Tools Usage

In the spirit of transparency, generative AI (Gemini) was utilized as an assistive tool during the development of this project. 

* **What AI was used for:** I used AI primarily as a sounding board for architecture brainstorming (structuring the MERN stack components) and for generating structural boilerplate (e.g., scaffolding the basic Express routes, React component shells, and the initial `seed.js` data generation script).
* **What I reviewed and changed manually:** I manually reviewed all generated code to ensure it fit the specific clinical requirements. I took ownership of the UI/UX layout, manually wired up the React state management (`useState`, `useEffect`), and explicitly enforced the extraction of "magic numbers" into centralized configuration objects to ensure maintainability.
* **Where I disagreed with the AI and why:** During the implementation of the anomaly detection logic, the AI initially generated an Express POST route that executed the duration anomaly check *after* the MongoDB document had already been constructed and saved. I caught this logical flaw during testing, as the database was silently dropping the duration alerts. I manually restructured the order of operations in the backend controller to ensure all three anomaly checks (weight, BP, duration) fully resolved *before* the session payload was committed to the database.

---

## Demo

* **Live Deployment:** [Placeholder for Render Link]
* **Video Walkthrough:** [Placeholder for YouTube Link]