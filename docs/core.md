Citadel App - Product Requirements Document (PRD)
Frontend Development Specifications
1. Project Overview
Product Name: Citadel App
 Product Type: Social networking mobile application for college students
 Platform: Mobile (iOS/Android)
 Target Audience: University students within the same city
Core Functionality: A social discovery app that connects college students through adjective-based matching, group dining events, and friendship building within their academic community.

2. App Architecture & Navigation
2.1 Bottom Navigation Structure
Explore (Main discovery screen)
Events (Group dining coordination)
Chat (Messaging functionality)
Notifications (Updates and activity feed)
Profile (User's own profile management)
2.2 Navigation Behavior
Incomplete Profile Indicator: Red dot appears on Profile navigation icon until all required fields are completed
Screen Transitions: Smooth transitions between main navigation screens
Back Navigation: Consistent back button placement in top-left corner for sub-screens

3. Onboarding Flow (8 Screens)
3.1 University Selection Screen
UI Components:
Progress bar at top of screen (1/8)
University dropdown selector
Continue button (disabled until selection made)
Functionality:
Dropdown populated with available universities
Form validation before proceeding
3.2 Email Login Screen
UI Components:
Progress bar (2/8)
Email input field with university domain validation
Login button
Error messaging area
Functionality:
Email validation (must be university email)
Integration with email verification system
3.3 OTP Verification Screen
UI Components:
Progress bar (3/8)
6-digit OTP input fields
Resend OTP button (with countdown timer)
Verify button
Functionality:
Auto-focus next input field
Resend functionality with 60-second cooldown
Error handling for invalid OTP
3.4 Personal Details Screen
UI Components:
Progress bar (4/8)
Full name input field
Date of birth picker
Degree dropdown selector
Year dropdown selector
Continue button
Functionality:
Form validation for all required fields
Date picker with age restriction (18+ only)
Dynamic year options based on current academic year
3.5 Skills Selection Screen
UI Components:
Progress bar (5/8)
Multi-select dropdown for skills
Selected skills display (chips/tags)
Skill counter (x/5 selected)
Continue button
Functionality:
Maximum 5 skills selectable
Visual feedback when limit reached
Search functionality within skills dropdown
3.6 Profile Picture Upload Screen
UI Components:
Progress bar (6/8)
Image upload area with placeholder
Camera/gallery selection options
Crop/edit functionality
Continue button
Functionality:
Image compression and optimization
Crop to square aspect ratio
File size validation
3.7 Contacts Permission Screen
UI Components:
Progress bar (7/8)
Permission explanation text
"Allow Contacts" primary button
Skip option (if applicable)
Permission Denied State:
Error message: "Please allow your contacts so that we can proceed further"
"Allow Contacts" button
Retry popup functionality
Functionality:
Native contacts permission request
Graceful handling of permission denial
Retry mechanism with improved messaging
3.8 Best Friends Selection Screen
UI Components:
Progress bar (8/8)
Contact list with Citadel UI styling
Multi-select checkboxes/cards
Selected count indicator (min 1, max 5)
Finish button (disabled until minimum selection)
Functionality:
Contact list display with profile pictures (if available)
Selection validation (1-5 friends required)
WhatsApp message automation: "Someone named you their best friend, sign up to find out who"

4. Main App Screens
4.1 Explore Screen (Primary Discovery)
Layout:
Full-screen card-based profile display
4 adjective buttons overlaid on profile image
Top-right grid view icon
Swipe gesture area
Profile Card Components:
Main profile image (3/4 screen height)
User name
College, degree, year
Skill tags
Friend count
Adjective Buttons:
4 dynamically positioned buttons with adjectives
Visual feedback on selection
Smooth animation on tap
Functionality:
Swipe Logic: Left/right swipe for next/previous profile
Matching Algorithm: Automatic friend creation when both users select same adjective
Profile Hierarchy: Same college/year/degree → same college/year → same college → other colleges (city-based)
Geofencing: Only show profiles from same city
4.2 Explore Grid View Sub-Screen
Layout:
3x3 grid layout
Search bar at top
Filter button
Back navigation to main explore
Profile Cards:
Profile picture
Name
College abbreviation
Year
Friend/Unfriend toggle button
Search & Filter Panel:
Search: Real-time user search
Filters: Degree, year, college, skills/expertise, city, gender
Apply/Clear filter buttons
4.3 Events Screen
First-Time Setup Flow:
City Selection: Dropdown with available cities
Area Selection: Multi-select from predefined areas
Budget Preference: Radio buttons ($, $$, $$$)
Language Preference: Dropdown selector
Dietary Restrictions: Radio buttons (None, Pure Veg)
Drinks Preference: Yes/No toggle
Relationship Status: Radio buttons (Single, In Relationship, Not Looking)
Personality Quiz: 5-10 MCQ questions with progress indicator
Default Events Screen Layout:
Location Header: Current area with change city/area options
Booking Section:
Heading: "Book your next dinner"
Subheading: "X people are waiting for you"
Date Selection: Calendar with available slots
Time Selection: Available time slots for selected date
Payment Section: All methods except COD, booking fee disclaimer
Restaurant Info: "Details provided 24 hours before dinner" notice
4.4 Chat Screen
Main Layout:
Two tabs: "Active" and "General"
Chat list with last message preview
Unread message indicators
Individual Chat Interface:
Header: User name, online status, options menu
Message Area: Standard chat interface with timestamps
Input Area: Text input, media attachment, voice note buttons
AI Icebreakers: Auto-generated conversation starters for new matches
Chat Options Menu:
Delete chat
Copy text
Block/Report user
Mute/Unmute notifications
Group Chat Features:
Create group functionality
Add/remove members
Change group name/image
Auto-generated event groups: "{dd/mm/yy}-{cafe_name}"
Limitations to Implement:
No calling/video calling options
No message editing functionality
4.5 Notifications Screen
Layout:
Instagram-style list format
Latest notifications at top
Notification categories with icons
Daily Notification Format:
Timing: 8:30 AM weekdays, 11:30 AM weekends
Content: "{x} number of people found you {adjective}"
Example: "40 people found you smart, 77 found you creative, 5 found you witty, 1 found you intelligent"
Notification Types:
Friend request acceptances
Adjective selections
Event updates
System notifications
4.6 Profile Screen (Own Profile)
Layout:
Main profile image (3/4 screen)
Profile information section
Edit Profile button
Settings icon (top-right)
Profile Information:
Name
Friend count (clickable to view friends list)
Skillsets (tags)
College, degree, year
About Me section
Portfolio/LinkedIn links
Incomplete Profile Messaging:
Red dot on navigation icon
Completion prompt: "Complete your profile to be visible in explore"
Requirements: 5 images total, 4 prompt responses
4.7 User Profile View Screen
Layout:
Header with back button, name, friend/unfriend button
Main image (3/4 screen)
Profile details section
Content flow: 4 prompts alternating with 4 images
Action Buttons:
Message Button:
Active if friends
Disabled with info nudge if not friends
Options Menu: Report, block, share profile, copy link, mute notifications
Report Options:
Impersonation
Inappropriate content
Spam/fake account
Admin account issues
Other (with text input)
4.8 Edit Profile Screen
Editable Fields:
Main profile image
4 additional images (mandatory for visibility)
Name
Phone number (optional)
Date of birth
Gender
Skillsets (max 5)
Degree
Year
About Me section
Portfolio/LinkedIn links
4 prompts (sports, movies, TV shows, teams)
Non-Editable Fields:
Email address
College/University
Image Requirements:
Minimum 4 images required for profile visibility
Image compression and optimization
Crop functionality
4.9 Settings Screen
Menu Options:
Help (email contact form)
FAQs
Blocked Users (list management)
Event Bookings (history and upcoming)
Logout
Delete Account
4.10 Event Bookings Detail Screen
Sections:
Upcoming Bookings: Event details, date, time, attendees
Past Bookings: Historical booking information
Booking Details: Complete information per event

5. Key Technical Features
5.1 Matching System
Adjective-Based Logic: Automatic friend creation on mutual selection
Real-time Updates: Instant notification when match occurs
AI Integration: Profile analysis for conversation starters
5.2 Geofencing
City-Based Filtering: GPS/location-based user filtering
College Prioritization: Algorithm-based profile ordering
Privacy Controls: Location permission management
5.3 Profile Completion System
Progress Tracking: Visual indicators for incomplete sections
Visibility Controls: Hide incomplete profiles from discovery
Completion Requirements: 5 images + 4 prompts validation
5.4 Notification System
Push Notifications: Friend requests, matches, daily reports
In-App Notifications: Real-time activity feed
WhatsApp Integration: Best friends invitation messages

6. UI/UX Guidelines
6.1 Design Principles
Mobile-First: Optimized for mobile screen sizes
Intuitive Navigation: Clear visual hierarchy and familiar patterns
Engagement-Focused: Swipe gestures, smooth animations, visual feedback
Safety-First: Clear reporting mechanisms and privacy controls
6.2 Visual Elements
Color Scheme: Modern, youth-oriented palette
Typography: Clean, readable fonts appropriate for mobile
Icons: Consistent icon library throughout app
Imagery: High-quality image handling and optimization
6.3 Interaction Patterns
Swipe Gestures: Primary navigation method for profile discovery
Pull-to-Refresh: Standard refresh pattern for lists
Haptic Feedback: Tactile responses for key interactions
Loading States: Smooth loading animations and skeleton screens

7. Performance Requirements
7.1 Loading Times
App launch: < 3 seconds
Screen transitions: < 1 second
Image loading: Progressive loading with placeholders
7.2 Offline Functionality
Cache recent conversations
Store user profile data locally
Graceful offline state handling
7.3 Data Management
Efficient image compression
Optimized API calls
Local storage for frequently accessed data

8. Development Phases
Phase 1: Core Onboarding
Implement all 8 onboarding screens
Basic navigation structure
User registration and authentication
Phase 2: Discovery & Matching
Explore screen with swipe functionality
Grid view implementation
Basic matching algorithm integration
Phase 3: Communication
Chat functionality
Notifications system
Friend management
Phase 4: Events & Advanced Features
Events booking system
Profile completion features
Settings and account management
Phase 5: Polish & Optimization
Performance optimization
UI/UX refinements
Testing and bug fixes

9. Success Metrics
9.1 User Engagement
Daily active users
Profile completion rates
Swipe-to-match conversion
Chat message frequency
9.2 Technical Performance
App crash rate < 1%
Average loading time metrics
User retention rates
Feature adoption rates

10. Constraints & Considerations
10.1 Technical Limitations
No video/voice calling functionality
No message editing capabilities
COD payment method excluded
City-based user restriction
10.2 Privacy & Safety
Mandatory university email verification
Robust reporting system
User blocking functionality
Data protection compliance
10.3 Integration Requirements
WhatsApp message automation
Email verification system
Payment gateway integration
Push notification services

This PRD serves as the comprehensive guide for frontend development. Each section should be implemented with attention to user experience, performance, and the specific requirements outlined above.

