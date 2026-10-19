import test from "node:test";
import assert from "node:assert/strict";
import {
  FDA_FOOD_2026, FDA_FOOD_INPUT_CHOICES, FDA_FOOD_INPUT_REQUIRED,
  prepare2026FoodFacilityRenewal
} from "../src/food-renewal-preparation.mjs";

const FOREIGN = {
  facilityLocation: "foreign",
  registrationRequired: "yes",
  registeredBeforeOctober: "yes",
  ownershipChanged: "no",
  ufiAvailable: "yes",
  qualifiedFacilityAttestation: "required",
  authorizedSubmitter: "owner-operator",
  foreignUsAgentCurrent: "yes"
};
const DOMESTIC = {
  ...FOREIGN,
  facilityLocation: "domestic",
  foreignUsAgentCurrent: undefined,
  qualifiedFacilityAttestation: "not-required"
};
delete DOMESTIC.foreignUsAgentCurrent;
const asOf = "2026-10-19";
const brief = (input, day = asOf) => prepare2026FoodFacilityRenewal(input, {asOf: day});

test("two original types of facility receive a usable official-source bilingual renewal brief", () => {
  for (const input of [FOREIGN, DOMESTIC]) {
    const result = brief(input);
    assert.equal(result.path, "biennial-renewal-preparation");
    assert.equal(result.state, "client-declared-preparation-path");
    assert.equal(result.window, "open");
    assert.equal(result.governmentFeeUSD, "0");
    assert.equal(result.submissionMade, false);
    assert.equal(result.customerAccepted, false);
    assert.equal(result.agentAppointed, false);
    assert.equal(result.mandatoryThirdPartyService, false);
    assert.match(result.markdown, /not an FDA notice/i);
    assert.match(result.markdown, /2026 年 FDA 食品设施注册续期准备/u);
    assert.match(result.markdown, /2026-10-19/u);
    assert.match(result.markdown, /2026/u);
    assert.match(result.markdown, /FDA Industry Systems/u);
    assert.ok(result.steps.every(step => step.sourceUrl.startsWith("https://www.fda.gov/")));
  }
});

test("extra attestation is distinct from registration for qualified facilities", () => {
  const qualified = brief(FOREIGN);
  assert.ok(qualified.steps.some(step => step.id === "qualified-attestation"));
  const nonQualified = brief({...FOREIGN, qualifiedFacilityAttestation: "not-required"});
  assert.ok(!nonQualified.steps.some(step => step.id === "qualified-attestation"));
  const uncertain = brief({...FOREIGN, qualifiedFacilityAttestation: "unknown"});
  assert.equal(uncertain.state, "further-client-and-source-review-required");
  assert.ok(uncertain.unresolved.includes("qualified-facility-attestation-applicability-unknown"));
});

test("ownership transfer cannot be reported as a ready renewal", () => {
  const result = brief({...FOREIGN, ownershipChanged: "yes"});
  assert.equal(result.path, "ownership-change-registration-review");
  assert.equal(result.state, "further-client-and-source-review-required");
  assert.ok(result.steps.some(step => step.id === "ownership-transfer"));
  assert.ok(result.unresolved.includes("ownership-change-requires-separate-cancellation-and-registration"));
});

test("no mandatory registration, unknown applicability, or post-October registration is not sold a false renewal", () => {
  const exempt = brief({...FOREIGN, registrationRequired: "no"});
  assert.equal(exempt.path, "not-a-renewal-candidate");
  assert.equal(exempt.state, "further-client-and-source-review-required");
  assert.ok(exempt.steps.some(step => step.id === "verify-exemption"));
  assert.equal(brief({...FOREIGN, registrationRequired: "unknown"}).state, "further-client-and-source-review-required");
  assert.equal(brief({...FOREIGN, registeredBeforeOctober: "no"}).state, "further-client-and-source-review-required");
});

test("missing UFI or foreign U.S. agent does not become an executable filing or agency service", () => {
  const ufi = brief({...FOREIGN, ufiAvailable: "no"});
  assert.equal(ufi.state, "further-client-and-source-review-required");
  assert.ok(ufi.steps.some(step => step.id === "unique-facility-identifier"));
  const agent = brief({...FOREIGN, foreignUsAgentCurrent: "no"});
  assert.equal(agent.state, "further-client-and-source-review-required");
  assert.equal(agent.agentAppointed, false);
  assert.ok(agent.steps.some(step => step.id === "foreign-agent"));
});

test("only permitted submitter types avoid the authority question, never filing success", () => {
  const ambiguous = brief({...FOREIGN, authorizedSubmitter: "unknown"});
  assert.ok(ambiguous.unresolved.includes("submission-authority-unconfirmed"));
  for (const s of ["owner-operator", "authorized-individual"]) {
    assert.equal(brief({...FOREIGN, authorizedSubmitter: s}).submissionMade, false);
  }
});

test("2026 window is bounded; historical claims never advertise a presently open registration period", () => {
  assert.equal(brief(FOREIGN, "2026-09-30").window, "upcoming");
  assert.equal(brief(FOREIGN, "2026-10-01").window, "open");
  assert.equal(brief(FOREIGN, "2026-12-31").window, "open");
  const stale = brief(FOREIGN, "2027-01-01");
  assert.equal(stale.window, "closed");
  assert.equal(stale.state, "further-client-and-source-review-required");
  assert.ok(stale.unresolved.includes("2026-renewal-window-ended"));
});

test("input is typed rather than unknown JSON; impossible calendar days and unqualified foreign cases refuse", () => {
  assert.deepEqual(Object.keys(FDA_FOOD_INPUT_CHOICES).sort(), [...FDA_FOOD_INPUT_REQUIRED, "foreignUsAgentCurrent"].sort());
  assert.equal(FDA_FOOD_2026.federalRegistrationFeeUSD,"0");
  for (const bad of [
    null, {...FOREIGN, sneakyRole: "fda-official"},
    {...FOREIGN, facilityLocation: "all"},
    {...FOREIGN, foreignUsAgentCurrent: undefined},
    {...FOREIGN, registrationRequired: true},
    {...FOREIGN, ufiAvailable: null},
    {...DOMESTIC, foreignUsAgentCurrent: "yes"}
  ]) assert.throws(() => brief(bad), /exact client-declared/u);
  for (const day of ["2026-02-30","2026-13-01","2026-1-1","2026-00-10"]) {
    assert.throws(() => brief(FOREIGN, day), /observation date/u);
  }
});

test("rendered customer material is informative even when no third-party service is bought", () => {
  const result = brief({...DOMESTIC, registrationRequired: "unknown"});
  assert.equal(result.governmentFeeUSD, "0");
  assert.match(result.markdown, /without hiring us|optional private assistance|never mandatory/i);
  assert.equal(result.steps.find(s => s.id === "customer-account")?.sourceUrl, FDA_FOOD_2026.officialEntrance);
  assert.doesNotMatch(result.markdown, /our FDA license number|registration approved/u);
});
