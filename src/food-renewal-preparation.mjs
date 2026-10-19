/**
 * Produce a customer-usable, non-filing 2026 FDA food-facility renewal brief.
 * FDA's free government renewal is a different service from optional paid
 * preparation and from a foreign establishment's appointed U.S. agent.
 *
 * This reader takes client declarations, not authenticated FDA account data.
 * It performs no registration, agency appointment, credential handling,
 * submission, customer contact, or claim of regulatory compliance.
 */
export const FDA_FOOD_2026 = Object.freeze({
  periodStart: "2026-10-01",
  periodEnd: "2026-12-31",
  federalRegistrationFeeUSD: "0",
  renewalGuide: "https://www.fda.gov/food/online-registration-food-facilities/food-facility-registration-user-guide-biennial-registration-renewal",
  renewalNotice: "https://www.fda.gov/food/hfp-constituent-updates/fda-reminds-food-facilities-biennial-renewal-requirements",
  feeNotice: "https://www.fda.gov/food/guidance-regulation-food-and-dietary-supplements/questions-regarding-whether-food-facilities-are-required-pay-registration-fees-and-private",
  officialEntrance: "https://www.fda.gov/food/registration-food-facilities-and-other-submissions/online-registration-food-facilities",
  officialQuestions: "https://www.fda.gov/animal-veterinary/animal-foods-feeds/animal-food-facility-registration-and-qualified-facility-attestation-frequently-asked-questions"
});

export const FDA_FOOD_INPUT_CHOICES = Object.freeze({
  facilityLocation: ["domestic", "foreign"],
  registrationRequired: ["yes", "no", "unknown"],
  registeredBeforeOctober: ["yes", "no", "unknown"],
  ownershipChanged: ["yes", "no", "unknown"],
  ufiAvailable: ["yes", "no", "unknown"],
  qualifiedFacilityAttestation: ["required", "not-required", "unknown"],
  authorizedSubmitter: ["owner-operator", "authorized-individual", "unknown"],
  foreignUsAgentCurrent: ["yes", "no", "unknown"]
});
export const FDA_FOOD_INPUT_REQUIRED = Object.freeze([
  "facilityLocation", "registrationRequired", "registeredBeforeOctober",
  "ownershipChanged", "ufiAvailable", "qualifiedFacilityAttestation",
  "authorizedSubmitter"
]);
const literal = value => typeof value === "string" && value.length > 0;
const validDay = value => {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/u.test(value)) return false;
  const [year,month,day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() + 1 === month &&
    date.getUTCDate() === day;
};

function step(id, english, chinese, sourceUrl) {
  return Object.freeze({ id, english, chinese, sourceUrl });
}
const included = (steps, id, english, chinese, url = FDA_FOOD_2026.renewalGuide) =>
  steps.push(step(id, english, chinese, url));

/**
 * The caller states whether its facility is covered; this function never
 * determines legal applicability or attests that an FDA renewal was filed.
 * Unknowns remain questions, not positive eligibility or invented denials.
 */
export function prepare2026FoodFacilityRenewal(input, { asOf = new Date().toISOString().slice(0, 10) } = {}) {
  if (!input || typeof input !== "object" || Array.isArray(input) ||
      !validDay(asOf) ||
      Object.keys(input).some(key => !Object.hasOwn(FDA_FOOD_INPUT_CHOICES, key)) ||
      FDA_FOOD_INPUT_REQUIRED.some(key => !Object.hasOwn(input, key)) ||
      Object.entries(input).some(([key,value]) => !FDA_FOOD_INPUT_CHOICES[key].includes(value)) ||
      (input.facilityLocation === "foreign" && !literal(input.foreignUsAgentCurrent)) ||
      (input.facilityLocation === "domestic" && input.foreignUsAgentCurrent !== undefined)) {
    throw new TypeError("food renewal preparation needs exact client-declared FDA program coordinates and a valid observation date");
  }
  const window = asOf < FDA_FOOD_2026.periodStart ? "upcoming" :
    asOf > FDA_FOOD_2026.periodEnd ? "closed" : "open";
  const issues = [];
  const steps = [];
  let path = "registration-applicability-review";
  if (input.registrationRequired === "no") {
    path = "not-a-renewal-candidate";
    included(steps, "verify-exemption", "Check the actual facility exemption and retain the official basis. Do not pay for a renewal assumed to be required.",
      "核实设施是否适用注册豁免，并保留官方依据；不要为未经确认的续期义务付费。",
      FDA_FOOD_2026.officialQuestions);
  } else if (input.registrationRequired === "unknown") {
    issues.push("registration-applicability-unknown");
    included(steps, "establish-applicability", "Determine whether this facility must register under FDA rules before preparing a renewal.",
      "先根据 FDA 规定确认该设施是否需要注册，再准备续期。", FDA_FOOD_2026.officialQuestions);
  } else if (input.ownershipChanged === "yes") {
    path = "ownership-change-registration-review";
    issues.push("ownership-change-requires-separate-cancellation-and-registration");
    included(steps, "ownership-transfer", "A change of owner requires the former owner to address cancellation and the new owner to determine re-registration; do not silently renew the former owner's record.",
      "所有权发生变更时，原所有者须处理取消注册，新所有者须确认重新注册；不可直接沿用原所有者记录续期。",
      FDA_FOOD_2026.officialQuestions);
  } else if (input.registeredBeforeOctober === "yes") {
    path = "biennial-renewal-preparation";
  } else {
    issues.push("prior-registration-or-period-unknown");
    included(steps, "determine-record", "Confirm the actual FDA account registration date/status; a new registration or missing registration is not automatically a biennial renewal.",
      "核实 FDA 系统中的实际注册日期与状态；新注册或未注册不能自动视为两年一次的续期。",
      FDA_FOOD_2026.renewalGuide);
  }
  if (input.ownershipChanged === "unknown") issues.push("ownership-history-unknown");
  if (input.ufiAvailable !== "yes") {
    issues.push("recognized-ufi-unconfirmed");
    included(steps, "unique-facility-identifier", "Confirm the FDA-accepted unique facility identifier (currently D-U-N-S) before filing; missing or unknown identifiers require resolution.",
      "提交前确认 FDA 接受的设施唯一标识符（目前为 D-U-N-S）；缺失或不确定时须先处理。",
      FDA_FOOD_2026.renewalGuide);
  }
  if (input.facilityLocation === "foreign" && input.foreignUsAgentCurrent !== "yes") {
    issues.push("foreign-us-agent-unconfirmed");
    included(steps, "foreign-agent", "Confirm the legally appointed U.S. agent and its correct contact information; optional paid preparation does not appoint a U.S. agent.",
      "确认依法指定的美国代理人及其准确联系方式；付费协助准备文件并不等于任命美国代理人。",
      FDA_FOOD_2026.officialQuestions);
  }
  if (input.qualifiedFacilityAttestation !== "not-required") {
    if (input.qualifiedFacilityAttestation === "unknown") issues.push("qualified-facility-attestation-applicability-unknown");
    included(steps, "qualified-attestation", "Check qualified-facility status. If applicable, the qualified facility must submit its separate attestation in the 2026 renewal period.",
      "核实是否属于合格设施；如适用，须在 2026 年续期期间另行提交相应声明。",
      FDA_FOOD_2026.renewalNotice);
  }
  if (input.authorizedSubmitter === "unknown") issues.push("submission-authority-unconfirmed");
  if (window !== "open") issues.push(window === "closed" ? "2026-renewal-window-ended" : "2026-renewal-window-not-yet-open");
  included(steps, "customer-account", "The facility or its individually authorized submitter must use the official FDA Industry Systems Food Facility Registration Module. Never send portal passwords to an intermediary.",
    "设施或经其明确授权的提交人应使用 FDA Industry Systems 中的食品设施注册模块；不要向中介提供账户密码。",
    FDA_FOOD_2026.officialEntrance);
  included(steps, "review-and-submit", "Review all mandatory fields for accuracy, renew (not merely update), and retain FDA's confirmation if the submission succeeds. This brief is NOT that confirmation.",
    "核对所有必填项目的准确性，办理续期（而非仅更新信息），成功提交后保留 FDA 确认；本说明不是续期确认。",
    FDA_FOOD_2026.renewalGuide);
  const filingRouteClear = path === "biennial-renewal-preparation" &&
    input.ownershipChanged === "no" && input.ufiAvailable === "yes" &&
    (input.facilityLocation === "domestic" || input.foreignUsAgentCurrent === "yes") &&
    input.authorizedSubmitter !== "unknown" && window === "open" &&
    input.qualifiedFacilityAttestation !== "unknown";
  const state = filingRouteClear ? "client-declared-preparation-path" : "further-client-and-source-review-required";
  const en = [
    "# 2026 FDA food-facility renewal preparation / 2026 年 FDA 食品设施注册续期准备",
    "",
    "Prepared against official FDA guidance as of " + asOf + ". This document is independent assistance, **not an FDA notice, registration, approval, or submitted filing**.",
    "本说明依照截至 " + asOf + " 的 FDA 官方指南准备；属独立协助，**不是 FDA 通知、注册、批准或已提交文件**。",
    "",
    "**FDA government registration/renewal fee: $0. Optional private assistance is separately priced and never mandatory.**",
    "**FDA 官方注册及续期费用为零美元。私人协助若收费，须另行议价，且并非强制。**",
    "",
    "Official 2026 renewal period: October 1–December 31, 2026. Window at this observation: " + window + ".",
    "FDA 2026 年官方续期时段：10 月 1 日至 12 月 31 日。当前状态：" + window + "。",
    "",
    "Preparation route: " + path + "; unresolved declarations: " + (issues.join(", ") || "none stated (not independently verified)") + ".",
    "",
    ...steps.flatMap((s,i) => [
      String(i + 1) + ". " + s.english,
      "   " + s.chinese,
      "   Official source: " + s.sourceUrl
    ]),
    "",
    "The customer and/or its authorized submitter retain responsibility for accurate FDA account information and the actual filing. No agent appointment or renewal completion is inferred.",
    "注册人及其授权提交人仍须负责 FDA 账户信息准确及实际提交。本说明不构成代理任命或续期完成证明。",
  ];
  return Object.freeze({
    kind: "causeway.us-representation.food-renewal-preparation.v1",
    program: "fda-food-facility-registration-2026",
    asOf, window, source: Object.freeze({...FDA_FOOD_2026}),
    declaredInput: Object.freeze({...input}), path, state,
    unresolved: Object.freeze([...new Set(issues)]),
    governmentFeeUSD: "0", mandatoryThirdPartyService: false,
    submissionMade: false, agentAppointed: false, customerAccepted: false,
    steps: Object.freeze(steps),
    markdown: en.join("\n") + "\n"
  });
}
