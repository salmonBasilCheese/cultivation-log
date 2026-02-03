# Implementation Plan - Cultivation Log (Saibai Log)

## Goal Description

Mobile-first web application for tracking crop growth. Users can manage multiple crops (Album view) and record daily logs with photos, weather, and care details.
Backend powered by Supabase for resilient data storage and authentication.

## User Review Required

> [!IMPORTANT]
> **Database Schema Approval**: Once tables are created, changing relationships is difficult. Please review the "Schema Design" section carefully.

> [!WARNING]
> **Authentication Setup**: You will need to configure Google Cloud Platform credentials and add them to the Supabase Dashboard manually. I cannot do this for you.

## Architecture & Tech Stack

- **Frontend**: React (Vite), Vanilla CSS (Mobile-first design)
- **Backend (BaaS)**: Supabase
  - **Database**: PostgreSQL
  - **Auth**: Google OAuth
  - **Storage**: Supabase Storage (for crop photos)

## Schema Design (The House Blueprint)

### 1. `crops` Table (The Album Covers)

Represents a specific plant being grown (e.g., "Kitchen Basil 2024").

| Column       | Type        | Note                        |
| ------------ | ----------- | --------------------------- |
| `id`         | uuid        | Primary Key                 |
| `user_id`    | uuid        | Owner (Links to auth.users) |
| `name`       | text        | e.g. "Mini Tomato"          |
| `emoji`      | text        | Visual icon for the crop    |
| `created_at` | timestamptz | Auto-generated              |

### 2. `cultivation_logs` Table (The Diary Pages)

Individual entries for a specific crop.

| Column        | Type        | Note                     |
| ------------- | ----------- | ------------------------ |
| `id`          | uuid        | Primary Key              |
| `crop_id`     | uuid        | Foreign Key -> crops.id  |
| `log_date`    | date        | The "Diary Date"         |
| `photo_url`   | text        | Path to image in storage |
| `weather`     | text        | e.g. Sunny, Cloudy       |
| `temperature` | numeric     | Degrees Celsius          |
| `is_watered`  | boolean     | T/F check                |
| `notes`       | text        | Free text diary          |
| `created_at`  | timestamptz | Auto-generated           |

## Security Strategy (RLS)

> **Metaphor**: "Every row in the database is tagged with the owner's ID. The doorman (Policy) only lets you see rows where the tag matches your ID."

1. **Enable RLS** on all tables.
2. **Policy**: `SELECT`, `INSERT`, `UPDATE`, `DELETE` allowed IF `auth.uid() = user_id`.

## Proposed Changes

### Frontend Scaffold

#### [NEW] [vite-project structure]

- Initialize React + Vite.
- Setup `supa-client.js` for connection.

### Design System

#### [NEW] [index.css]

- Defined CSV variables for "Nature-inspired" premium colors (Greens, Earth tones).
- Mobile responsive utilities.

## Verification Plan

### Manual Verification

1. **Auth Flow**: Log in with Google, check if user session persists.
2. **CRUD Operations**:
   - Create a new Crop.
   - Add a Log to that Crop.
   - Verify data appears in Supabase Dashboard.
3. **Security Test**:
   - Log in as User A.
   - Attempt to fetch User B's crops (should return empty).
