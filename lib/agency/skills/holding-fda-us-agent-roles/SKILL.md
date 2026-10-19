---
name: holding-fda-us-agent-roles
description: "Hold a client's FDA US agent role from signing through renewal: get named in the FDA's system, answer the FDA in US hours, forward every communication the same day, and record stages and payments."
closure-kind: process
requires-capabilities:
  - representation-engagement-record
  - representation-engagements
  - representation-payment-record
  - representation-document-draft
---

# Holding FDA US agent roles

1. At signing, record the engagement as signed with its commercial scope
   (`representation-engagement-record stage=signed commercialScope=...`); signing screens the
   client and its owners, and a client on OFAC's SDN list is not signed.
2. This particular `us-agent` practical operation and the present agreement template concern **medical-device establishments only**. Do not use them to sign a food-facility U.S. Agent appointment. Such an appointment needs its own source-qualified physical-presence, client-consent and potential reinspection-fee-liability contract.
   Send the client the actual U.S. agent details to enter in the **device FURLS** system. When the designation and agent's own confirmation are independently received, record the device engagement as active.
3. Answer FDA calls and mail in US business hours. Forward each FDA communication to the
   client the same day, in English with a Chinese summary.
4. Record each payment (`representation-payment-record`). Remind the client of its renewal
   between October 1 and December 31, and record the engagement as renewed when paid.

**Different optional service:** [Preparing FDA food-facility renewals](../preparing-fda-food-facility-renewals/SKILL.md) creates an independent administrative preparation brief and separately contracted help. It does **not** appoint this office as a food U.S. agent or grant access to the FDA food registration portal.
