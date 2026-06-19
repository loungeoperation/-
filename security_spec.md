# Firebase Security Rule Specification

## 1. Data Invariants
- **Public Inquiry Submission**: Any visitor (unauthenticated) can submit an inquiry (`create`).
- **Data Integrity on Submission**: Visitors can only set `status` to `"new"` and `adminMemo` to empty string `""` upon creation, preventing malicious state setting or notes injection.
- **Timestamp Integrity**: The `createdAt` timestamp must match the server-generated `request.time`.
- **Admin Access Control**: Only an authorized, verified administrator matching `loungeinseoul@gmail.com` can view (`get`, `list`) or update the status and consultant notes of inquiries.
- **Immutable Fields**: High-integrity fields like `hotelName`, `roomsCount`, `contact`, and `createdAt` are immutable after creation. Only `status` and `adminMemo` can be updated.
- **Universal Privacy**: No customer can read another customer's submitted data.

## 2. The "Dirty Dozen" (Attack Payloads & Expected Decisions)

| Payload ID | Operation | Target Path | Actor / Auth Token | Payload / Action Details | Expected Decision |
|------------|-----------|-------------|--------------------|--------------------------|-------------------|
| PL_01 | `get` | `/inquiries/some_id` | Unauthenticated | Fetch personal or other customer data | **PERMISSION_DENIED** |
| PL_02 | `list` | `/inquiries` | Unauthenticated | List all customer inquiries | **PERMISSION_DENIED** |
| PL_03 | `list` | `/inquiries` | Checked-in User `hacker@gmail.com` | Leak potential lead contacts | **PERMISSION_DENIED** |
| PL_04 | `get` | `/inquiries/some_id` | Verified User `hacker@gmail.com` | Snooping on another hotel's inquiry | **PERMISSION_DENIED** |
| PL_05 | `create` | `/inquiries/inq_99` | Unauthenticated | `{"status": "completed", ...}` client-assumed state hijacking | **PERMISSION_DENIED** |
| PL_06 | `create` | `/inquiries/inq_99` | Unauthenticated | `{"adminMemo": "Prefilled malicious notes", ...}` injecting admin comments | **PERMISSION_DENIED** |
| PL_07 | `create` | `/inquiries/inq_99` | Unauthenticated | Creating with future-dated client-side `createdAt` timestamp | **PERMISSION_DENIED** |
| PL_08 | `create` | `/inquiries/inq_99_SUPER_LONG_ID_OR_MALICIOUS_PATH` | Unauthenticated | Injecting an extremely long document ID into the collection | **PERMISSION_DENIED** |
| PL_09 | `update` | `/inquiries/some_id` | Unauthenticated | Attempting to update status or memo without auth | **PERMISSION_DENIED** |
| PL_10 | `update` | `/inquiries/some_id` | Verified Admin `loungeinseoul@gmail.com` | Modifying immutable fields (e.g. changing `hotelName` or `contactInfo`) after submission | **PERMISSION_DENIED** |
| PL_11 | `update` | `/inquiries/some_id` | Hacker `hacker@gmail.com` (spoofed email but verified) | Attempting to write memo or update status of an inquiry | **PERMISSION_DENIED** |
| PL_12 | `delete` | `/inquiries/some_id` | Verified Admin `loungeinseoul@gmail.com` | Deleting database contents (leads must be permanent and archived) | **PERMISSION_DENIED** |
