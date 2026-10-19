# US Representation Services Section

The 561 Group's **source-owned prospective U.S. representation and independent
preparation service**. Foreign companies entering the United States need
reliable U.S.-side representation, market help and preparation for external
institutional processes. A code repository does **not** establish a staffed
representative, legally formed signatory, client appointment, running host,
completed service or customer payment.

Four different potential services operate through this one enterprise:

- **Medical-device U.S. Agent.** For foreign device establishments that
  require a U.S. agent, the service requires a real physically available
  U.S. person/place of business, client appointment, the agent's own FDA
  confirmation, ongoing communication capacity and a signed contract.
  This is a proposed **device-only** annual service; those conditions have
  not been observed to hold for an active 561 client.
- **Food-facility renewal preparation (independent optional assistance).**
  Prepare a bilingual FDA-source-linked 2026 renewal brief and, only when
  actually contracted, additional client document review. **FDA itself
  charges $0 for food facility registration/renewal, and independent
  preparation is never mandatory.** This is not a food-facility U.S.-agent
  appointment or FDA filing.
- **Sales representation.** We sell a maker's line to US distributors,
  clinics, retailers and manufacturers for a commission on what sells, under a
  sales representative agreement that meets Minnesota's statute.
- **Local presence.** Booth staffing, buyer meetings and US-side errands, by
  the day.

Why, and the law it runs under:

- [Doing business with Chinese businesses](../../../../../561-group-services-section/content/text/documents/articles/notes/2026/09/26/2026-09-26-note-on-doing-business-with-chinese-businesses.md)
  (the Group note this business comes from)
- [What Chinese firms going abroad buy from US residents](../../../../../science-services-section/services/social-science-services-section/services/economics-and-business-science-services-section/services/economics-science-services-section/content/text/documents/articles/notes/2026/09/26/2026-09-26-note-on-what-chinese-firms-going-abroad-buy-from-us-residents.md)
- [US law for doing business with and for Chinese firms](../../../../../science-services-section/services/social-science-services-section/services/law-science-services-section/content/text/documents/articles/notes/2026/09/26/2026-09-26-note-on-us-law-for-doing-business-with-and-for-chinese-firms.md)

## What is here

- `src/leads.mjs`: FDA device registration listings merged into
  establishments (name, city, province, devices and classes, official
  correspondent, the US agent named), the market of US agents, and the score
  and reasons for who to call first.
- `src/operations.mjs`: the MetroPlat operation family
  (`usRepresentationOperations`):
  `representation-establishments-pull`, `representation-agent-market`,
  `representation-establishments-find`, `representation-call-queue`,
  `representation-screen`, `representation-contact-log`,
  `representation-engagement-record` (signing screens the client and its
  owners), `representation-engagements`, `representation-payment-record`
  (records asserted settlements separately from bank confirmation),
  `representation-food-renewal-brief`, `representation-activity`,
  `representation-document-draft`. The original Organizing engine
  distinguishes one-off preparation closure from annual agent renewal.
- `lib/agency/`: the enterprise (a market micro-enterprise with grey-band
  settings for the agent fee, commission, day rate and caller share), its
  leading goal and its maker-representation chain-group contract, three
  offices (US representation caller, US agent of record, sales
  representative), their duties, works and skills, and a rule that a signed
  engagement states its commercial scope.
- `content/text/documents/templates/`: the device-only U.S. agent agreement,
  the separately scoped food-renewal-preparation agreement, the sales
  representative agreement, the local presence order and the caller's
  joint-venture agreement.
- `content/text/documents/articles/guides/caller-kit.md`: when to call China,
  the first email in English and Chinese, the call, and what makers ask.

Leads come from two networking clients in computer networking engineering:
`openfda-services-section` (the FDA's public registration data) and
`consolidated-screening-list-services-section` (the US restricted-party list
and name screening).

## Roadmap to the first dollar

The US agent offer comes first because it is the smallest job. Being a
device maker's US agent means being a US address, phone and email the FDA
can reach, and passing what the FDA sends on to the maker the same day. Most
clients, most years, hear nothing from the FDA, which is how one agent can
hold 741 of them.

1. **A company to sign as.** The agreements need a legal entity (an LLC is
   enough) with a bank account that can receive international wires.
2. **The address and phone.** A US street address (not a PO box), a business
   phone answered in US business hours, and a mailbox someone reads every
   day. A home address qualifies: the device rule asks that the agent "reside
   or maintain a place of business in the United States" (21 CFR 807.40(b)).
   The agent's name, address, phone and email are published in the FDA's open
   data, so a home address becomes public; a staffed office or a coworking
   address with mail handling keeps it private.
3. **A page to point to.** One web page saying who we are and what the
   service is, in English and Chinese, since makers check before they pay.
4. **Reach makers in the renewal window.** Pull the establishments list,
   send the first email from the caller kit (October 1 to December 31), then
   call those who answer.
5. **Sign, screen, get named.** A maker that agrees is screened, signs the
   US agent service agreement, and enters our details in its FDA
   registration; we record it active.
6. **Get paid.** Invoice; the maker wires the fee, which its bank releases
   against the signed service contract in about five to ten business days.
7. **Do the job.** Answer the phone and mail, forward FDA messages the same
   day, remind clients of renewal next October.

**Ongoing U.S.-agent appointments are device-only in this implementation.**
The distinct food-renewal-preparation offer does not take appointment, U.S.
presence or reinspection-fee liabilities. A foreign food-facility's legally
appointed U.S. agent has different responsibilities and may receive FDA
reinspection invoices; a separate qualified legal/operational agreement
would be required for that service. <https://www.fda.gov/food/inspections-protect-food-supply/foreign-food-facility-inspection-program-questions-answers>

**The fee** is a grey-band setting on the enterprise (`us-agent-annual-fee`,
default $450, between $150 and $1,500). The market runs from about $250 a year
at one-person agents to $800–1,500 at staffed firms; the offer (a named person,
same-day forwarding in Chinese) sits above the bottom. The first emails can
test it: half the batch at one price, half at another, and the setting moves
to the one that signs more fee per email.

Sales representation and local presence come after: they need a product
line worth selling and time to build a buyer list. Trade shows are one
place to meet makers and buyers, not a requirement to start.

## Working it

People work the business in the metroplex at bare-cedar-fog.561.group, where their
office grants the `representation-*` verbs as powers:

```
representation-establishments-pull country=CN
representation-agent-market limit=20
representation-call-queue device=thermometer limit=20
representation-contact-log establishment=3005951403 outcome="letter sent" channel=email
representation-screen name="Ningbo Example Medical Co., Ltd."
representation-engagement-record client="Ningbo Example Medical Co., Ltd." establishment=3005951403 offer=us-agent stage=proposed
representation-document-draft template=us-agent-service-agreement engagement=ningbo-example-medical-co-ltd-us-agent
```

## 2026 FDA food-facility renewal — original practical capability

[Preparing FDA food facility renewals](lib/agency/skills/preparing-fda-food-facility-renewals/SKILL.md)
is a **Practical Skill** of the existing US Representation Caller office,
not a new U.S.-agent incumbency. Its source-owned producer
[`src/food-renewal-preparation.mjs`](src/food-renewal-preparation.mjs)
creates English/Chinese, FDA-linked client briefs. The original
`usRepresentationOperations` exports `representation-food-renewal-brief`;
the separate [optional service agreement](content/text/documents/templates/food-renewal-preparation-agreement.md)
can be drafted for an actual proposed `food-renewal-preparation` engagement.

FDA's [September 29, 2026 announcement](https://www.fda.gov/food/hfp-constituent-updates/fda-reminds-food-facilities-biennial-renewal-requirements)
and [official user guide](https://www.fda.gov/food/online-registration-food-facilities/food-facility-registration-user-guide-biennial-registration-renewal)
put the current renewal period at **October 1–December 31, 2026**.
Facility coverage, exemption, ownership changes, UFI, qualified-facility
attestation and submission authority must be considered case-by-case.

**Read-only preparation without accounts or credentials:**

```sh
node --input-type=module -e '
import {prepare2026FoodFacilityRenewal} from "./src/food-renewal-preparation.mjs";
console.log(prepare2026FoodFacilityRenewal({
  facilityLocation:"domestic",registrationRequired:"unknown",
  registeredBeforeOctober:"unknown",ownershipChanged:"unknown",
  ufiAvailable:"unknown",qualifiedFacilityAttestation:"unknown",
  authorizedSubmitter:"unknown"
}, {asOf:"2026-10-19"}).markdown);
'
```

The original customer process is **proposed → signed → active → closed**
with an actual optional fee and separately accepted delivery, not an
annual representation renewal. The client or explicitly authorized submitter
performs any official FDA account submission.

```sh
npm test
npm run check
```

**Installation and receiving status (October 19, 2026):**
the 2026 bilingual producer, source tests, optional-service template and
actual operation selection are committed. The installed MetroPlat host
returned *Unknown command* when asked to execute
`representation-food-renewal-brief`; therefore no deployed service,
official filing, FDA representative appointment, third-party permission,
client acceptance or earned payment is claimed. Native full dependency
closure and installed source receiving remain distinct.
