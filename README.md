# US Representation Services Section

The 561 Group's US representation business. Chinese companies selling into
the United States need people here: someone the FDA can reach, someone who
sells their products to American buyers, someone who stands in their booth
and answers their phone in US hours. We are those people, for a fee or a
commission.

Three offers, sold by the same callers to the same makers:

- **US agent.** Every foreign medical device establishment and food facility
  registered with the FDA must name a US agent. We hold the role for a yearly
  fee: a named person in Minnesota who answers the FDA and forwards every
  message the same day in English and Chinese.
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
  (settles the originating caller's share), `representation-activity`,
  `representation-document-draft`.
- `lib/agency/`: the enterprise (a market micro-enterprise with grey-band
  settings for the agent fee, commission, day rate and caller share), its
  leading goal and its maker-representation chain-group contract, three
  offices (US representation caller, US agent of record, sales
  representative), their duties, works and skills, and a rule that a signed
  engagement states its commercial scope.
- `content/text/documents/templates/`: the US agent service agreement, the
  sales representative agreement, the local presence order and the caller's
  joint-venture agreement.
- `content/text/documents/articles/guides/caller-kit.md`: when to call China,
  the first email in English and Chinese, the call, and what makers ask.

Leads come from two networking clients in computer networking engineering:
`openfda-services-section` (the FDA's public registration data) and
`consolidated-screening-list-services-section` (the US restricted-party list
and name screening).

## Working it

People work the business in the metroplex at ops.561.group, where their
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
