# HubSpot Form Library

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
- `lead_source=form`

## `corporate_rate_request`
Fields:
- `company`
- `travel_frequency`
- `cities`
- `room_count_per_month`
- `firstname`, `lastname`, `email`, `phone`

Hidden defaults:
- `lead_type=hotel_corporate_rate`
- `lead_source=form`

## `warbot_access_request`
Fields:
- `discord_handle`
- `account_slots`
- `experience`
- `referral`
- `firstname`, `lastname`, `email`

Hidden defaults:
- `lead_type=warbot_access`
- `lead_source=form`

## `creator_collaboration_intake`
Fields:
- `platform`
- `followers`
- `category`
- `collaboration_idea`
- `firstname`, `lastname`, `email`, `phone`

Hidden defaults:
- `lead_type=creator_collab`
- `lead_source=form`

## `client_project_intake`
Fields:
- `budget_range`
- `timeline`
- `project_type`
- `goals`
- `firstname`, `lastname`, `email`, `phone`, `company`

Hidden defaults:
- `lead_type=client_project`
- `lead_source=form`

## Domain binding
Set hidden `website_domain` per site embed:
- `warbot.cloud`
- `hotelsales.online`
- `vibechain.ink`
- `fullstacks.us`
