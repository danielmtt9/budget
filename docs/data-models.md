# Data Models Documentation

## Overview
Database schema using SQLAlchemy ORM.

## Entities

### User
- **Table:** `users`
- **Fields:**
    - `id` (PK, Integer)
    - `email` (String, Unique)
    - `google_sub` (String, Unique) - For OAuth
    - `simplefin_access_url` (String) - For Bank Sync
    - `created_at` (Timestamp)

### Account
- **Table:** `accounts`
- **Fields:**
    - `id` (PK, Integer)
    - `user_id` (FK -> users.id)
    - `name` (String)
    - `type` (String)
    - `simplefin_id` (String) - External ID
- **Constraints:** Unique(`simplefin_id`, `user_id`)

### Category
- **Table:** `categories`
- **Fields:**
    - `id` (PK, Integer)
    - `user_id` (FK -> users.id)
    - `parent_id` (FK -> categories.id) - For subcategories
    - `name` (String)
    - `monthly_limit` (Decimal)

### Transaction
- **Table:** `transactions`
- **Fields:**
    - `id` (PK, Integer)
    - `account_id` (FK -> accounts.id)
    - `category_id` (FK -> categories.id)
    - `amount` (Decimal)
    - `description` (String)
    - `date` (Timestamp)
    - `simplefin_id` (String)
- **Constraints:** Unique(`simplefin_id`, `account_id`)
