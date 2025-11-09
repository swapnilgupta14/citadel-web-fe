Auth

POST /api/v1/auth/send-otp
Headers: Content-Type: application/json
Body:

{
"email": "student@university.edu"
}

Success (200):

{
"success": true,
"message": "OTP sent successfully",
"expiresIn": 300
}

POST /api/v1/auth/verify-otp
Headers: Content-Type: application/json
Body:

{
"email": "student@university.edu",
"otp": "123456"
}

Success (200):

{
"success": true,
"tokens": {
"accessToken": "eyJ...access",
"refreshToken": "eyJ...refresh"
},
"user": {
"id": "uuid",
"email": "student@university.edu",
"isProfileComplete": false
}
}

Universities

GET /api/v1/universities?search={q}&limit={n}&offset={o}
Headers: Authorization: Bearer {accessToken} (optional for cached list)
No body (query params only).
Success (200):

{
"universities": [
{ "id": "uuid", "name": "University Name", "country": "India" }
],
"hasMore": true
}

User Profile

GET /api/v1/users/profile/{userId}
Headers: Authorization: Bearer {accessToken}
No body.
Success (200): (trimmed)

{
"id": "user_id",
"name": "John Doe",
"email": "john@university.edu",
"university": "University Name",
"degree": "Computer Science",
"year": 2024,
"skills": ["JavaScript","Python"],
"images": [{ "id":"img_1","url":"https://...","isPrimary": true }],
"isOnline": true,
"lastSeen": "2025-06-19T10:30:00Z"
}

POST /api/v1/users/profile (update/create)
Headers: Authorization: Bearer {accessToken}, Content-Type: application/json (or multipart/form-data if uploading images)
Body (JSON example for profile fields):

{
"name": "John Doe",
"dateOfBirth": "2002-05-01",
"gender": "male",
"universityId": "uuid",
"degree": "Computer Science",
"year": 2024,
"aboutMe": "Short bio",
"skills": ["JavaScript","React"],
"portfolioLink": "https://example.com"
}

Success (200):

{ "success": true, "userId": "uuid" }

Matching / Explore

GET /api/v1/matches/explore?limit=10&offset=0&filters={...}
Headers: Authorization: Bearer {accessToken}
No body. filters can be a JSON-encoded query param.
Success (200):

{
"profiles": [
{
"id":"user_id",
"name":"Jane Smith",
"primaryImage":"https://...",
"university":"University",
"degree":"Engineering",
"year":2024,
"skills":["Python"],
"adjectives":["creative","smart"],
"distance":2.5,
"mutualFriends":3
}
],
"hasMore": true
}

POST /api/v1/matches/select-adjective
Headers: Authorization: Bearer {accessToken}, Content-Type: application/json
Body:

{
"targetUserId": "target_user_id",
"adjective": "smart"
}

Success (200) — two cases:

If mutual match:

{ "success": true, "matched": true, "chatId": "chat_id_if_matched" }

If not mutual:

{ "success": true, "matched": false }

Chats / Messaging

GET /api/v1/chats
Headers: Authorization: Bearer {accessToken}
No body.
Success (200) (trimmed):

{
"activeChats": [
{
"id": "chat_id",
"type": "direct",
"participants": ["user_id_1","user_id_2"],
"lastMessage": { "content": "Hey", "timestamp":"2025-06-19T10:30:00Z", "senderId":"user_id_1" },
"unreadCount": 2
}
],
"generalChats": []
}

POST /api/v1/chats/{chatId}/messages
Headers: Authorization: Bearer {accessToken}, Content-Type: application/json (or multipart/form-data for file upload)
Body (text message):

{
"type": "text",
"content": "Hello there!",
"replyTo": null
}

Success (201):

{
"id": "message_id",
"chatId": "chatId",
"senderId": "user_id",
"message_type": "text",
"content": "Hello there!",
"created_at": "2025-06-19T10:31:00Z"
}

For media (images/voice/video): send multipart/form-data with file field and metadata:

fields: type (image/voice/video), replyTo (optional)

file: file (binary)

Events

GET /api/v1/events/available-slots?city=Delhi&area=Connaught%20Place&date=2025-06-20
Headers: Authorization: Bearer {accessToken} (optional for browsing)
No body.
Success (200):

{
"slots": [
{
"id":"slot_id",
"date":"2025-06-20",
"time":"19:00",
"spotsAvailable":3,
"totalSpots":6,
"estimatedCost":1200
}
]
}

POST /api/v1/events/book
Headers: Authorization: Bearer {accessToken}, Content-Type: application/json
Body:

{
"slotId": "slot_id",
"paymentMethodId": "razorpay_payment_id"
}

Success (200):

{
"success": true,
"bookingId": "booking_uuid",
"status": "confirmed"
}

Payment Webhook (Razorpay)

POST /api/v1/payments/webhook/razorpay
(Used by Razorpay; verify signature header X-Razorpay-Signature)
Body: Razorpay webhook JSON (forwarded as-is). Respond 200 OK when verified.

WhatsApp / Notifications

POST /api/v1/notifications/whatsapp (internal / provider)
Headers: Authorization: Bearer {serviceToken}, Content-Type: application/json
Body:

{
"to": "+918XXXXXXXXX",
"templateName": "onboarding_invite",
"parameters": {
"userName": "Swapnil",
"appLink": "https://app.link"
}
}

Success (200):

{ "success": true, "messageId": "whatsapp_msg_id" }

Common Requirements (apply to all APIs)

All JSON requests: Content-Type: application/json.

Protected endpoints: Authorization: Bearer {accessToken}.

Access token: short-lived JWT; use refresh token endpoint (not listed) to rotate.

Rate-limit headers may be returned (e.g., X-RateLimit-Limit, X-RateLimit-Remaining).

Error responses follow the error code map (e.g., {"code":"1002","message":"OTP expired"}).
