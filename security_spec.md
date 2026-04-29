# Security Specification: NeonVibe Music

## Data Invariants
1. A song metadata record must have a valid `audioUrl` and `uploaderId`.
2. Users can only upload and edit their own songs (unless they are system admins).
3. Public reads are allowed for all songs to enable streaming.
4. Admin status is strictly managed in a locked `admins` collection.

## The Dirty Dozen Payloads (Targeting Rejection)
1. **Unauthenticated Write**: Attempting to add a song without a token.
2. **Identity Spoofing**: User A trying to upload a song with `uploaderId` of User B.
3. **Ghost Fields**: Adding `isVerified: true` to a song upload.
4. **Admin Escalation**: Regular user trying to write to the `admins` collection.
5. **PII Leak**: Non-admin user trying to read private user profiles.
6. **Path Poisoning**: Providing a 1MB string as a `songId`.
7. **Type Mismatch**: `viewCount` as a string instead of a number.
8. **Shadow Update**: Changing the `uploaderId` of an existing song.
9. **Terminal State Break**: Attempting to modify a song's `createdAt` timestamp.
10. **Huge Payload**: Song title exceeding 200 characters.
11. **Malicious ID**: Using `../` or special characters in the Document ID.
12. **Insecure Search**: Trying to list all `users` without specific UID queries.
