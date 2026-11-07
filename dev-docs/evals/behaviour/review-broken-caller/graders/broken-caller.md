---
type: llm
---
PASS if the review reports that `src/invoice.js`, a file the change did not touch, now breaks because `getPrice` returns an object instead of a number (so `.toFixed(2)` throws), and treats it as a must-fix problem (Critical, High, or a reason not to ship).
FAIL if `invoice.js` is not mentioned, or only as a minor note.
