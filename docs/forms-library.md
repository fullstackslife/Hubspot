# HubSpot Form Library

## Shared required hidden fields (all forms)
- `website_domain`
- `lead_source=form`
- `lead_type`
- `source_campaign` (default from `utm_campaign`, optional)

## `group_booking_intake`
Fields:
- `event_type`
- `event_dates`
- `rooms_needed`
- `city`
- `budget`
- `firstname`, `lastname`, `email`, `phone`, `company`

Hidden defaults:
- `lead_type=hotel_group_booking`

## `corporate_rate_request`
Fields:
- `company`
- `travel_frequency`
- `cities`
- `room_count_per_month`
- `firstname`, `lastname`, `email`, `phone`

Hidden defaults:
- `lead_type=hotel_corporate_rate`

## `warbot_access_request`
Fields:
- `discord_handle`
- `account_slots`
- `experience`
- `referral`
- `firstname`, `lastname`, `email`

Hidden defaults:
- `lead_type=warbot_access`

## `creator_collaboration_intake`
Fields:
- `platform`
- `followers`
- `category`
- `collaboration_idea`
- `firstname`, `lastname`, `email`, `phone`

Hidden defaults:
- `lead_type=creator_collab`

## `client_project_intake`
Fields:
- `budget_range`
- `timeline`
- `project_type`
- `goals`
- `firstname`, `lastname`, `email`, `phone`, `company`

Hidden defaults:
- `lead_type=client_project`

## Domain embed mapping
- `forms/embeds/hotelsales.online.html`: hotel forms (`hotel_group_booking` or `hotel_corporate_rate`)
- `forms/embeds/warbot.cloud.html`: `warbot_access`
- `forms/embeds/vibechain.ink.html`: `creator_collab`
- `forms/embeds/fullstacks.us.html`: `client_project`
