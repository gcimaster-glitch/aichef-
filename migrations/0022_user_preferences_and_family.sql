-- Migration: User Preferences and Family Members
-- Purpose: Store user preferences for one-click meal planning and family member email notifications

-- User Preferences Table
-- Stores saved preferences for quick meal plan generation
CREATE TABLE IF NOT EXISTS user_preferences (
    preference_id INTEGER PRIMARY KEY AUTOINCREMENT,
    household_id INTEGER NOT NULL,
    
    -- Quick settings flag
    is_quick_mode_enabled INTEGER DEFAULT 0, -- 1 = enabled, 0 = disabled
    
    -- Saved meal planning preferences
    saved_cuisine_style TEXT DEFAULT '和食', -- 和食, 洋食, 中華, etc.
    saved_plan_days INTEGER DEFAULT 7, -- 7, 14, 21, 30
    saved_budget_tier INTEGER, -- Per person budget
    saved_cooking_time_limit INTEGER, -- Max cooking time in minutes
    
    -- Timestamps
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (household_id) REFERENCES households(household_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_user_preferences_household ON user_preferences(household_id);

-- Family Members Table
-- Stores family member email addresses for meal plan notifications
CREATE TABLE IF NOT EXISTS family_members (
    member_id INTEGER PRIMARY KEY AUTOINCREMENT,
    household_id INTEGER NOT NULL,
    
    -- Member information
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    relationship TEXT, -- 'spouse', 'child', 'parent', etc.
    
    -- Notification settings
    is_notification_enabled INTEGER DEFAULT 1, -- 1 = enabled, 0 = disabled
    notification_time TEXT DEFAULT '15:00', -- HH:MM format
    timezone TEXT DEFAULT 'Asia/Tokyo',
    
    -- Status
    status TEXT DEFAULT 'active', -- 'active', 'inactive', 'pending'
    verified_at DATETIME,
    
    -- Timestamps
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (household_id) REFERENCES households(household_id) ON DELETE CASCADE,
    UNIQUE(household_id, email)
);

CREATE INDEX IF NOT EXISTS idx_family_members_household ON family_members(household_id);
CREATE INDEX IF NOT EXISTS idx_family_members_email ON family_members(email);
CREATE INDEX IF NOT EXISTS idx_family_members_notifications ON family_members(household_id, is_notification_enabled) 
    WHERE is_notification_enabled = 1;

-- Notification Log Table
-- Track sent notifications for debugging and analytics
CREATE TABLE IF NOT EXISTS notification_log (
    log_id INTEGER PRIMARY KEY AUTOINCREMENT,
    member_id INTEGER NOT NULL,
    household_id INTEGER NOT NULL,
    plan_id INTEGER,
    
    -- Notification details
    notification_type TEXT NOT NULL, -- 'daily_menu', 'shopping_list', etc.
    sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'sent', -- 'sent', 'failed', 'bounced'
    error_message TEXT,
    
    -- Email content metadata
    subject TEXT,
    recipient_email TEXT NOT NULL,
    
    FOREIGN KEY (member_id) REFERENCES family_members(member_id) ON DELETE CASCADE,
    FOREIGN KEY (household_id) REFERENCES households(household_id) ON DELETE CASCADE,
    FOREIGN KEY (plan_id) REFERENCES meal_plans(plan_id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_notification_log_member ON notification_log(member_id);
CREATE INDEX IF NOT EXISTS idx_notification_log_household ON notification_log(household_id);
CREATE INDEX IF NOT EXISTS idx_notification_log_sent_at ON notification_log(sent_at);
