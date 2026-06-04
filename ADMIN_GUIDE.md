# Ishonchli.uz — Admin User Guide

Complete guide for using the Ishonchli.uz information system as an administrator.

---

## Table of Contents

1. [Logging In as Admin](#1-logging-in-as-admin)
2. [Admin Panel Overview](#2-admin-panel-overview)
3. [Dashboard](#3-dashboard)
4. [Reports Moderation](#4-reports-moderation)
5. [User Management](#5-user-management)
6. [Statistics](#6-statistics)
7. [Settings](#7-settings)
8. [Using the Public Site as Admin](#8-using-the-public-site-as-admin)
9. [Trust Score System](#9-trust-score-system)
10. [Anti-Fraud Detection Rules](#10-anti-fraud-detection-rules)

---

## 1. Logging In as Admin

1. Open the site at **http://localhost:3000** (or your deployed URL).
2. Click **Login** in the top navigation bar.
3. Enter the admin credentials:
   - **Email:** `admin@ishonchli.uz`
   - **Password:** `Password123!`
4. Click **Login**.

After login you will see your name in the navbar and an **Admin** link will appear. The site language defaults to Uzbek — use the **UZ / RU / EN** switcher in the top-right corner to change it.

---

## 2. Admin Panel Overview

Click the **Admin** link in the navbar or go to `/admin` directly. You will enter the admin panel with a dark sidebar on the left containing 5 sections:

| Section | URL | Purpose |
|---|---|---|
| Dashboard | `/admin` | Overview stats and pending reports queue |
| Reports | `/admin/reports` | Moderate all submitted reports |
| Users | `/admin/users` | Manage registered users |
| Statistics | `/admin/statistics` | Charts and analytics |
| Settings | `/admin/settings` | View fraud detection configuration |

Click **← Back to Site** at the bottom of the sidebar to return to the public site.

---

## 3. Dashboard

The dashboard is the first screen you see after entering the admin panel.

### Statistics Cards

Eight cards show key numbers at a glance:

| Card | What it shows |
|---|---|
| Total Users | All registered accounts |
| Total Sellers | All sellers tracked in the system |
| Total Reports | All reports ever submitted |
| Approved | Reports that have been approved by admin |
| Rejected | Reports that have been rejected by admin |
| Pending | Reports waiting for your review |
| Confirmed Fraud | Approved fraud-type reports |
| New Today | Reports submitted today |

### Pending Reports Table

Below the cards is a live table of the most recent **pending** reports (up to 8 rows). Each row shows:
- Report type (FRAUD or POSITIVE)
- Seller name or identifier
- Username of who submitted it
- Submission date
- A **Review** link that takes you to the full Reports Moderation page

> **Tip:** Check this table every time you log in. A growing pending queue means sellers are being flagged and buyers are waiting for moderator action before the trust score updates.

---

## 4. Reports Moderation

**URL:** `/admin/reports`

This is the most important page for an administrator. All reports submitted by users go through here before they affect any seller's trust score.

### Filtering Reports

Use the filter tabs at the top to narrow down what you see:

| Tab | Shows |
|---|---|
| All | Every report regardless of status |
| Pending | Only reports waiting for review |
| Approved | Reports you have already approved |
| Rejected | Reports you have already rejected |

### Report Table Columns

| Column | Description |
|---|---|
| Report | Type (Fraud/Positive), category label, and a preview of the description |
| Seller | The seller's Telegram username, marketplace name, or phone number |
| Reporter | Full name and email of the user who submitted the report |
| Status | Current status badge: Pending / Approved / Rejected |
| Date | Submission date |
| Actions | Buttons to approve, reject, or delete |

### Taking Action on a Report

Each row has action buttons on the right:

#### Approve a Report
- Click the green **Approve** button.
- The report status changes to **APPROVED** instantly.
- The seller's trust score is **automatically recalculated** — a positive review adds points, a fraud report deducts points.
- The seller's suspicious/fraudster flags are also re-evaluated.

#### Reject a Report
- Click the red **Reject** button.
- The report status changes to **REJECTED**.
- Rejected reports do **not** affect the seller's trust score.
- Use this for spam, duplicate, or unsubstantiated reports.

#### Delete a Report
- Click the grey **Del** button.
- A confirmation dialog appears — click OK to confirm.
- The report is **permanently deleted** from the database.
- Use this only for clearly abusive or illegal content.

> **Important:** Only **approved** reports affect seller trust scores. Pending and rejected reports have no effect. This means you must review pending reports for the system to work correctly.

### Pagination

If there are more than 15 reports, pagination controls appear at the bottom. Use **Previous** / **Next** to move between pages.

---

## 5. User Management

**URL:** `/admin/users`

This page lists every registered user in the system.

### User Table Columns

| Column | Description |
|---|---|
| User | Full name and email address |
| Role | USER or ADMIN badge |
| Reports | Number of reports this user has submitted |
| Joined | Account creation date |
| Actions | Buttons to promote/demote and delete |

### Promoting a User to Admin

- Click **Make Admin** next to any user.
- Their role badge changes to **ADMIN** immediately.
- They will now have access to the admin panel and can moderate reports and manage users.

> **Warning:** Only promote trusted individuals. Admin users can delete reports, delete other users, and change roles.

### Revoking Admin Access

- Click **Revoke Admin** next to any admin user.
- Their role reverts to **USER** and they lose access to the admin panel.
- You cannot revoke your own admin access (the button will still appear but the API will block it).

### Deleting a User

- Click the red **Delete** button next to any user.
- A confirmation dialog appears.
- Deleting a user **also deletes all their reports, comments, and votes** (cascade delete).
- You cannot delete your own account from this panel.

> **Use deletion carefully.** Removing a user removes their fraud reports, which may allow bad sellers to recover their trust scores unfairly.

### Pagination

20 users per page. Use pagination controls at the bottom to navigate.

---

## 6. Statistics

**URL:** `/admin/statistics`

Three interactive charts built with Recharts.

### Reports per Month (Bar Chart)

Shows the volume of reports submitted in the last 6 months, split by:
- **Red bars** — Fraud reports
- **Green bars** — Positive reviews

Hover over any bar to see the exact count. Use this to spot trends — a spike in fraud reports may indicate a scam campaign targeting buyers.

### Fraud Categories (Pie Chart)

Shows the breakdown of fraud report types:
- Scam
- Fake Product
- Non Delivery
- Payment Fraud
- Account Theft
- Other

Hover over a slice to see the count. This helps identify which type of fraud is most common and may inform moderation priorities.

### Seller Risk Distribution (Pie Chart)

Shows how many sellers fall into each risk level:
- **Green** — Safe (score 80–100)
- **Yellow** — Moderate Risk (score 50–79)
- **Orange** — High Risk (score 20–49)
- **Red** — Dangerous (score 0–19)

A large dangerous slice means many sellers have accumulated serious fraud reports and buyers should be warned.

---

## 7. Settings

**URL:** `/admin/settings`

This page is read-only and shows the currently configured fraud detection rules. It is useful for understanding how the system makes decisions.

### Fraud Detection Rules

| Rule | Current Value |
|---|---|
| Suspicious Threshold | Mark seller suspicious after **3 complaints in 7 days** |
| Potential Fraudster Threshold | Mark as potential fraudster after **5 confirmed fraud reports** |
| Trust Score: Positive Weight | **+3 points** per approved positive review |
| Trust Score: Negative Weight | **−5 points** per approved fraud report |
| Trust Score: Confirmed Fraud Weight | **−10 additional points** per confirmed fraud report |

### Risk Level Ranges

| Label | Score Range | Meaning |
|---|---|---|
| Safe | 80 – 100 | Seller has good reputation |
| Moderate Risk | 50 – 79 | Some concerns, proceed with caution |
| High Risk | 20 – 49 | Multiple complaints, not recommended |
| Dangerous | 0 – 19 | Severe fraud history, avoid |

### Upload Limits

| Setting | Value |
|---|---|
| Allowed formats | PNG, JPG, JPEG |
| Max file size | 10 MB |
| Storage | Cloudinary |

> To change these rules, edit `src/lib/trust-score.ts` in the codebase and redeploy.

---

## 8. Using the Public Site as Admin

As admin you have full access to the public site in addition to the admin panel. Use the **← Back to Site** link in the sidebar or click **Ishonchli.uz** in the navbar.

### Searching Sellers

1. Click **Sellers** in the navbar or go to `/search`.
2. Type a phone number (e.g. `+998901234567`), Telegram username (e.g. `seller_amir`), or marketplace username.
3. Results appear as cards showing trust score and risk level.
4. Click any card to open the full seller profile.

### Viewing a Seller Profile

The seller profile page shows:
- Contact information (phone, Telegram, marketplace username)
- Trust score bar and risk level badge
- Warning banners if the seller is flagged as **Suspicious** or **Potential Fraudster**
- Count of fraud reports vs positive reviews
- All approved reports listed with full descriptions

### Viewing a Report in Detail

Click any report card to open the detail page. You can see:
- Full description and category
- Evidence screenshot (if uploaded)
- Comment thread from the community
- Upvote/downvote counts
- Direct link to the seller profile

### Submitting Reports as Admin

Admins can also submit fraud reports and positive reviews just like regular users via **Submit Report** in the navbar. Admin-submitted reports still go through the same moderation queue — you would need to approve them yourself or have another admin do it.

### Language Switching

Use the **UZ / RU / EN** pill in the top-right of the navbar to switch the interface language at any time. The choice applies to all UI text but does not change user-submitted content (descriptions, comments, etc.).

---

## 9. Trust Score System

Every seller starts with a trust score of **50** when they are first added to the system.

### Formula

```
Trust Score = 50
            + (number of approved positive reviews × 3)
            − (number of approved fraud reports × 5)
            − (number of approved fraud reports × 10)   ← additional confirmed fraud penalty

Final score is clamped between 0 and 100.
```

### When Does the Score Update?

The trust score recalculates automatically every time you **approve or reject** a report on the moderation page. It does not update in real time for pending reports — you must take action first.

### Score Interpretation

| Score | Risk Level | Color | Recommended Action |
|---|---|---|---|
| 80 – 100 | Safe | Green | Seller is trustworthy |
| 50 – 79 | Moderate Risk | Yellow | Proceed with caution |
| 20 – 49 | High Risk | Orange | Not recommended |
| 0 – 19 | Dangerous | Red | Avoid completely |

---

## 10. Anti-Fraud Detection Rules

Two automatic flags are applied on top of the trust score to highlight dangerous patterns.

### Suspicious Flag

**Condition:** The seller receives more than **3 fraud complaints within the last 7 days**.

**What happens:**
- A yellow warning banner appears on the seller profile: *"⚠ Suspicious Activity"*
- The badge also shows on search result cards
- This flag resets automatically if no new complaints arrive within 7 days

**Admin response:** Review the recent reports for this seller immediately. If the complaints are valid, approve them so the trust score drops accordingly.

### Potential Fraudster Flag

**Condition:** The seller has more than **5 approved (confirmed) fraud reports** in total.

**What happens:**
- A red warning banner appears on the seller profile: *"🚨 Potential Fraudster"*
- This is a permanent flag that remains until fraud reports are rejected or deleted

**Admin response:** This is a serious flag. Consider whether the seller should remain in the system. You can delete approved reports if they were made in error, which will trigger a trust score recalculation.

---

## Quick Reference — Admin Workflow

**Daily routine:**

1. Log in → check **Dashboard** for pending count
2. Go to **Reports → Pending** tab
3. Read each description carefully
4. **Approve** legitimate fraud reports or positive reviews
5. **Reject** spam, duplicates, or unverifiable claims
6. Check **Statistics** weekly to spot trends

**When a user reports a problem:**

1. Go to **Users**, find the user by email
2. Check their report history (Reports column count)
3. Go to **Reports**, filter and find their submissions
4. Take moderation action as appropriate

**When a seller needs to be cleared:**

1. Go to **Reports**, filter by seller name
2. Reject any unsubstantiated reports
3. The trust score recalculates automatically after each rejection
4. The seller's risk level updates on their profile immediately

---

*Ishonchli.uz Admin Guide — generated for diploma project documentation.*
