# PayMeNow Frontend Explanation & UI Spec

This document explains the system for a frontend developer to design and later integrate the UI. It maps backend capabilities to user-facing pages, flows, data fields, and API endpoints.

## Purpose & Roles
- **Purpose:** Peer-to-peer micro‑lending with borrower requests, lender offers, loans, repayments, notifications, KYC, and trust score tracking.
- **Roles:**
  - **Guest:** Browse public loan requests, learn about the platform, sign up.
  - **User (Borrower/Lender):** Complete profile + KYC; borrow (create requests, accept offers), lend (create offers, sign loans), receive notifications, view trust score.
  - **Admin:** Review verification documents (KYC), manage users, loan requests, loans, and investigate trust score history.

## Core Flows
1. **Onboarding & KYC**
   - Register → complete profile (personal + address + optional family) → upload verification documents (e.g., NATIONAL_ID/PASSPORT) → wait for admin review.
   - Some actions (creating loan requests/offers) require verified documents.
2. **Borrowing**
   - Create a loan request → receive lender offers → accept an offer (upload docs if requested) → loan created → borrower marks paid → lender confirms payment → trust score updates.
3. **Lending**
   - Discover open loan requests → submit a loan offer → borrower accepts → lender signs loan (activates) → track repayments → confirm final payment.
4. **Notifications**
   - In‑app notifications; unread badge; mark read/read all; delete.
5. **Trust Score**
   - View timeline and current category; linked to loan events (repaid/defaulted).

## Sitemap
- Public
  - Landing / Home (with public loan requests)
  - About / How it Works (optional)
- Auth
  - Login
  - Register (multi‑step)
- App Shell (after login)
  - Dashboard
  - Borrower
    - Create Loan Request
    - My Loan Requests (list + detail)
    - My Loans (Borrowed) (list + detail)
    - Accept Offer flow
  - Lender
    - Discover Requests (list + detail)
    - Make Offer
    - My Offers (list + detail)
    - My Loans (Lent) (list + detail; sign/confirm)
  - Notifications (list)
  - Profile & KYC
    - Personal Info
    - Address
    - Family Details
    - Verification Documents (upload/list/status)
  - Trust Score (timeline)
  - Settings (security, logout)
- Admin
  - KYC Review (pending/all, approve/reject)
  - Users (list + detail; admin edit; soft delete)
  - Loan Requests (list + detail; admin update; soft delete)
  - Loans (list + detail; status updates; soft delete)
  - Trust Score History (search, user timeline)
  - Platform Settings (placeholder)

## Pages & Specs
Below each page includes: purpose, key components, forms/fields (validation), primary actions, and API endpoints.

### Landing
- Purpose: Explain value, display public open loan requests, drive registration.
- Components: Hero + CTA, cards for open requests (amount, minAmount, rate, durationDays, funded%, deadline, status), filters.
- Data: From `GET /loan-request` (only display public ones if server filters, otherwise filter client-side by `isPublic`).

### Auth: Login
- Fields: `email` (email), `password` (min length 6). DTO: `LoginDto`.
- Actions: Login; navigate to register.
- API: `POST /auth/login` → tokens and user info; `POST /auth/refresh`; `POST /auth/logout`.

### Auth: Register (Multi‑step)
- Steps:
  1) Account: `email`, `phone`, `password`.
  2) Personal: `firstName`, `lastName`, `dateOfBirth`, `maritalStatus`, `nationalId`.
  3) Address: `countryId`, `provinceId`, `districtId`, `sectorId`, `cellId`, `villageId`, `street?`, `latitude?`, `longitude?`.
  4) Family (optional): spouse/father/mother/emergency contact fields.
  5) Verification Docs: array of items: `documentType` (e.g., NATIONAL_ID/PASSPORT), `documentUrl`.
- Validation: As per DTOs.
- API: `POST /auth/register` (DTO: `RegisterDto`).

### Dashboard
- Purpose: At‑a‑glance metrics and shortcuts.
- Components: KPIs (trustScore, category, totals, currentDebt, walletBalance), recent activities, notifications preview.
- API: `GET /auth/profile` for a unified profile view.

### Profile & KYC
- Personal Info: view/edit `firstName`, `lastName`, `dateOfBirth`, `maritalStatus`, `profilePicture?`.
- Address: view/edit address fields.
- Family Details: view/edit optional fields.
- Verification Documents: upload/doc list with `status`, admin notes; resubmit.
- API:
  - Users: `GET /user`, `GET /user/:id`, `POST /user`, `PATCH /user/:id` (admin), `DELETE /user/:id` (admin). Note: `GET /auth/profile` is the canonical "my profile".
  - Verification (admin protected): `GET /verification-docs`, `GET /verification-docs/pending`, `PATCH /verification-docs/:id/approve`, `PATCH /verification-docs/:id/reject`.

### Notifications
- Purpose: Keep users informed; show unread badge; mark read; bulk read; delete.
- API:
  - `GET /notifications/me?limit=20`
  - `GET /notifications/me/unread`
  - `PATCH /notifications/:id/read`
  - `PATCH /notifications/me/read-all`
  - `PATCH /notifications/:id/delete`

### Borrower: Create Loan Request
- Fields (see `CreateLoanRequestDto`):
  - `amount` (required), `minAmount?`, `interestRate?` (defaults to ~6%/mo), `durationDays` (required), `purpose?`, `fundingDeadline?`, `isPublic?`, `maxLenders?`.
- Validation: numeric types, optional where noted; ISO dates; boolean flags.
- API: `POST /loan-request` (requires JWT; user must have verified docs).

### Borrower: My Loan Requests (List + Detail)
- List: card/table with `amount`, `amountFunded`, `amountNeeded`, `status`, `expiresAt`, progress bar, actions.
- Detail: includes request fields, offers received list; actions to view/accept/decline offers.
- API: `GET /loan-request/me`, `GET /loan-request/:id`.

### Borrower: Accept Offer
- Purpose: Accept a specific lender offer and provide any required documents.
- Fields: `documents[]` where each is `{ documentType, documentUrl }`.
- API: `POST /loan/accept-offer/:offerId` (requires JWT). Resulting loan is created server-side.

### Borrower: My Loans (Borrowed)
- List: show `loanNumber`, `amount`, `interestRate`, `totalAmount`, `amountPaid`, `amountDue`, `status`, `dueDate`, late flags.
- Detail: agreement link, signatures, important dates, penalties if any.
- Actions: `Mark Paid` → triggers lender confirmation flow.
- API: `GET /loan/me/borrowed`, `GET /loan/:id`, `PATCH /loan/:id/mark-paid-by-borrower`.

### Lender: Discover Requests (List + Detail)
- Filters: `amount`, `durationDays`, `interestRate`, `fundingDeadline`, borrower trust category.
- Detail: borrower summary, request details, offers list snapshot.
- API: `GET /loan-request`, `GET /loan-request/:id`.

### Lender: Make Offer
- Fields (see `CreateLoanOfferDto`): `loanRequestId`, `amount`, `interestRate?`, `isCounterOffer?`, `message?`.
- API: `POST /loan-offers` (requires JWT; verified docs needed).

### Lender: My Offers (List + Detail)
- List: filter by `status`, sort by `createdAt`.
- Actions: edit/cancel while `PENDING`.
- API: `GET /loan-offers/me`, `GET /loan-offers/:id`, `PATCH /loan-offers/:id`, `DELETE /loan-offers/:id`.

### Lender: My Loans (Lent)
- List + Detail similar to Borrowed, but lender-side.
- Actions: `Sign Loan` (activates & sets disbursement date), `Confirm Payment`.
- API: `GET /loan/me/lent`, `GET /loan/:id`, `PATCH /loan/:id/sign-by-lender`, `PATCH /loan/:id/confirm-payment-by-lender`.

### Admin: KYC Review
- Purpose: Review verification documents; approve/reject with note.
- API: `GET /verification-docs`, `GET /verification-docs/pending`, `PATCH /verification-docs/:id/approve`, `PATCH /verification-docs/:id/reject` (admin + JWT).

### Admin: Users
- List, detail (full profile), admin edit, soft delete.
- API: `GET /user`, `GET /user/:id`, `PATCH /user/:id`, `DELETE /user/:id`.

### Admin: Loan Requests
- List, detail, admin update, soft delete.
- API: `GET /loan-request`, `GET /loan-request/:id`, `PATCH /loan-request/:id`, `DELETE /loan-request/:id`.

### Admin: Loans
- List, detail, update status, soft delete.
- API: `GET /loan`, `GET /loan/:id`, `PATCH /loan/:id`, `DELETE /loan/:id` (204), `PATCH /loan/:id/status`, `PATCH /loan/:id/defaulted`.

### Trust Score
- User View: timeline with entries; current score + category.
- Admin View: search/filter by user/loan/reason/date; view user timeline.
- API: `POST /trust-score-history`, `GET /trust-score-history`, `GET /trust-score-history/user/:userId`, `GET /trust-score-history/user/:userId/timeline`, `GET /trust-score-history/loan/:loanId`, `GET /trust-score-history/:id`.

## Data & Validation (from DTOs)
- Registration (`RegisterDto`):
  - `email` (email, required)
  - `phone` (string, regex `^[+]?\d{7,15}$`, required)
  - `password` (length 8–128, required)
  - `firstName`, `lastName` (required)
  - `dateOfBirth` (ISO date string, required)
  - `maritalStatus` (string, required)
  - `nationalId` (string, required)
  - `address` (`AddressDto`): `countryId`, `provinceId`, `districtId`, `sectorId`, `cellId`, `villageId` (all required), `street?`, `latitude?`, `longitude?`
  - `familyDetails?` (`FamilyDetailsDto`): spouse/father/mother/emergency contact fields (optional)
  - `verificationDocuments` (array, min 1): each with `documentType` (enum e.g., NATIONAL_ID/PASSPORT) and `documentUrl` (URL)
- Login (`LoginDto`): `email`, `password (>=6)`
- Create Loan Request (`CreateLoanRequestDto`): `amount`, `durationDays` required; optional `minAmount`, `interestRate`, `purpose`, `fundingDeadline`, `isPublic`, `maxLenders`, `expiresAt`.
- Create Loan Offer (`CreateLoanOfferDto`): `loanRequestId`, `amount` required; optional `interestRate`, `status`, `isCounterOffer`, `message`.
- Accept Offer (`AcceptOfferDto`): `documents[]` with `documentType`, `documentUrl`.
- Loan Response (`LoanResponseDto`) includes: identities, `amount`, `interestRate`, `durationDays`, dates (`disbursedAt`, `dueDate`, `repaidAt`), totals (`totalAmount`, `amountPaid`, `amountDue`), `status`, `isLate`, `lateDays`, `penaltyAmount`, `agreementUrl?`, `signedByBorrower`, `signedByLender`, timestamps.
- Loan Request Response (`LoanRequestResponseDto`) includes: core request fields, funding progress, status, timestamps.
- Loan Offer Response (`LoanOfferResponseDto`) includes: identities, `amount`, `interestRate`, `status`, `isCounterOffer`, `message`, timestamps.

## UX & States
- **Auth:** show logged‑in state; handle token expiry (refresh); logout feedback.
- **KYC Gating:** show status PENDING/APPROVED/REJECTED; disable gated actions with tooltip and guidance when not approved.
- **Lists:** pagination, filtering, sorting; empty states; loading skeletons.
- **Numbers:** currency formatting; percentage funded; chips for durations and statuses.
- **Dates:** ISO 8601 in/out; localized display; date/time pickers.
- **File Uploads:** progress bars, previews, size/type validation; accept image/PDF for docs.
- **Actions:** confirmation dialogs for destructive ops; toasts/snackbars for success/failure.
- **Access Control:** hide/disable actions if not permitted by role or ownership.

## Integration Map (by area)
- **Auth:**
  - Login → `POST /auth/login`
  - Profile → `GET /auth/profile` (use for dashboard/profile data)
  - Refresh → `POST /auth/refresh`
  - Logout → `POST /auth/logout`
- **Borrower:**
  - Create Request → `POST /loan-request`
  - My Requests → `GET /loan-request/me`
  - Request Detail → `GET /loan-request/:id`
  - Accept Offer → `POST /loan/accept-offer/:offerId`
  - My Borrowed Loans → `GET /loan/me/borrowed`
  - Mark Paid → `PATCH /loan/:id/mark-paid-by-borrower`
- **Lender:**
  - Discover → `GET /loan-request`
  - Make Offer → `POST /loan-offers`
  - My Offers → `GET /loan-offers/me`
  - Edit Offer → `PATCH /loan-offers/:id`
  - Cancel Offer → `DELETE /loan-offers/:id`
  - My Lent Loans → `GET /loan/me/lent`
  - Sign Loan → `PATCH /loan/:id/sign-by-lender`
  - Confirm Payment → `PATCH /loan/:id/confirm-payment-by-lender`
- **Notifications:** as listed in the Notifications page.
- **Trust Score:** as listed in the Trust Score section.
- **Admin:** KYC review, Users, Loan Requests, Loans endpoints above. Some routes are admin‑guarded server‑side.

## Security & Headers
- **Auth:** Bearer JWT required for protected endpoints using `Authorization: Bearer <token>`.
- **Error Handling:** surface 400/401/403/404/409 messages from server; map to clear UI errors.

## Acceptance Criteria (high‑level)
- Registration flow captures all required fields and validates per DTO constraints; successful registration leads to onboarding/KYC status page.
- Users without verified docs cannot access gated actions (buttons disabled with explanation).
- Borrowers can create requests, view their requests, see offers, and accept one.
- Lenders can discover requests, make/manage offers, sign loans, and confirm payments.
- Loan pages show accurate computed states (paid/due/late) and display agreement URL if present.
- Notifications page supports unread badge, mark read, bulk read, and delete.
- Trust Score timeline displays entries with loan links when applicable.
- Admin can review and change KYC statuses and manage core records.

## Design Deliverables
- Wireframes: mobile + desktop for all pages and key states (loading/empty/error).
- Component Library: buttons, inputs, selects, file upload, tables, pagination, tabs, cards, badges, modals, toasts, skeletons.
- Patterns: form validation styling, filters/search, confirmation flows.
- Design Tokens: colors, spacing, typography, elevation; number & currency formatting.

## Glossary
- **Loan Request:** A borrower’s funding ask; can receive multiple offers.
- **Loan Offer:** A lender’s proposal to fund a request; borrower may accept.
- **Loan:** A binding contract created from an accepted offer.
- **Trust Score:** A score reflecting repayment behavior and risk; auto‑updates on loan events.
- **KYC:** Know Your Customer; document verification by admin.

## Notes
- Interest rate fields are percent per month (numeric).
- Dates are ISO 8601 strings in requests/responses.
- Document types come from backend enum (e.g., NATIONAL_ID, PASSPORT).

If you want this broken down into tickets per page (with success states, empty states, and error states), we can generate a page‑by‑page checklist next.
