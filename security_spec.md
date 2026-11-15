# Elevora Firestore Security Specification

## 1. Data Invariants
1. **Strict Ownership**: Every document under `/users/{userId}` and its subcollections (`/private/info`, `/workspace/state`) belongs exclusively to the authenticated, email-verified user whose `request.auth.uid == userId`.
2. **No Cross-User Reads or List Scraping**: No user may `get`, `list`, `create`, `update`, or `delete` another user's profile, PII, or study workspace. Root `list` on `/users` is denied.
3. **PII Isolation**: Contact PII (`email`, `phone`, `portfolioUrl`) lives strictly inside `/users/{userId}/private/info` and is never readable by non-owners.
4. **Immutable Ownership & Creation Timestamp**: `uid` and `createdAt` cannot be modified after document creation; `updatedAt` must always equal `request.time`.
5. **Relational Parent Existence**: Subcollection documents (`/users/{userId}/private/info` and `/users/{userId}/workspace/state`) require the parent `/users/{userId}` document to exist (or be created atomically in the same batch via `exists` / `existsAfter`).

## 2. Adversarial "Dirty Dozen" Payloads (Expected: PERMISSION_DENIED)
1. **Unauthenticated Read**: `get(/users/aliceUid)` with `auth = null`.
2. **Cross-User Profile Read**: `get(/users/aliceUid)` authenticated as `bobUid`.
3. **Cross-User PII Read**: `get(/users/aliceUid/private/info)` authenticated as `bobUid`.
4. **Unverified Email Write**: `create(/users/aliceUid, ...)` where `auth.token.email_verified == false`.
5. **UID Spoofing on Create**: `create(/users/aliceUid, { uid: 'bobUid', ... })` authenticated as `aliceUid`.
6. **Ghost / Shadow Field Injection**: `create(/users/aliceUid, { ..., isAdmin: true })` rejected by `keys().hasOnly(...)`.
7. **Shadow Update Injection**: `update(/users/aliceUid, { role: 'superadmin', updatedAt: request.time })` rejected by `affectedKeys().hasOnly(...)`.
8. **Immutable Field Tampering**: `update(/users/aliceUid, { uid: 'other', createdAt: ... })`.
9. **Client-Forged Timestamp**: `create(/users/aliceUid, { ..., createdAt: '2020-01-01T00:00:00Z' })` rejected by `createdAt == request.time`.
10. **Path ID Poisoning**: `get(/users/invalid$id*over*128chars)` rejected by `isValidId(userId)`.
11. **Oversized String / Resource Poisoning**: `update(/users/aliceUid, { name: <500-char string>, ... })` rejected by `.size() <= 120`.
12. **Collection Enumeration Scraping**: `list(/users)` or `list(/users/aliceUid/private)` by non-owner (and `list` disabled on `/users`).
