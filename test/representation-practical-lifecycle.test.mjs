import test from "node:test";
import assert from "node:assert/strict";
import {mkdtempSync, rmSync} from "node:fs";
import {tmpdir} from "node:os";
import {join} from "node:path";
import {usRepresentationOperations} from "../src/operations.mjs";

function fixture() {
  const dataRoot=mkdtempSync(join(tmpdir(),"us-representation-practical-"));
  const journal=[];
  let counter=0;
  const store={
    read(category,filter={}) {
      return journal.filter(row => row.category===category &&
        Object.entries(filter).every(([key,value])=>row[key]===value));
    },
    order(record) {
      const saved={
        ...record,category:"order",
        recordedAt:new Date(Date.parse("2026-10-19T12:00:00Z")+
          (counter++*1000)).toISOString()
      };
      journal.push(saved);
      return saved;
    }
  };
  const actions=usRepresentationOperations({dataRoot},{
    store,now:()=>Date.parse("2026-10-19T12:00:00Z"),
    contractingParty:()=>"Fixture (not legally appointed)"
  });
  const doOperation=(verb,input={})=>{
    const op=actions.find(item=>item.verb===verb);
    assert.ok(op, "native service has operation "+verb);
    return op.execute(input,{},{
      invocation:{subject:"fixture:operator",caller:{hand:"authenticated-session"}}
    });
  };
  return {dataRoot,doOperation,journal,cleanup:()=>rmSync(dataRoot,{recursive:true,force:true})};
}
const base={
  client:"Fixture International Foods",country:"CN",
  offer:"food-renewal-preparation",
  fdaProgram:"food-facility-registration-biennial-renewal"
};
const facility=name=>({...base,establishment:name,stage:"proposed"});
const domestic={
  facilityLocation:"domestic",registrationRequired:"yes",
  registeredBeforeOctober:"yes",ownershipChanged:"no",
  ufiAvailable:"yes",qualifiedFacilityAttestation:"not-required",
  authorizedSubmitter:"owner-operator"
};

test("a real operation makes a customer-usable bilingual 2026 food renewal brief without filing",async()=>{
  const f=fixture();
  try {
    const view=await f.doOperation("representation-food-renewal-brief",domestic);
    assert.equal(view.governmentFeeUSD,"0");
    assert.equal(view.submissionMade,false);
    assert.equal(view.agentAppointed,false);
    assert.equal(view.path,"biennial-renewal-preparation");
    assert.match(view.markdown,/FDA Industry Systems/u);
    assert.match(view.markdown,/2026 年/u);
    assert.deepEqual(f.journal,[],"public source guidance never writes an engagement");
  } finally {f.cleanup();}
});

test("one real buyer can propose distinct preparation for two separate factories without shared order identity",async()=>{
  const f=fixture();
  try {
    const first=await f.doOperation("representation-engagement-record",facility("CN-Plant-1"));
    const second=await f.doOperation("representation-engagement-record",facility("CN-Plant-2"));
    assert.notEqual(first.order,second.order);
    assert.match(first.order,/food-renewal-preparation-2026$/u);
    assert.equal(f.journal.length,2);
    const list=await f.doOperation("representation-engagements");
    assert.equal(list.preparationFunnel.stages[0].stage,"proposed");
    assert.equal(list.preparationFunnel.stages[0].reached,2);
    assert.equal(list.funnel.stages[0].reached,0,
      "one-off preparation is not counted as an ongoing U.S. agent");
    const document=await f.doOperation("representation-document-draft",{
      template:"food-renewal-preparation-agreement",engagement:first.order
    });
    assert.match(document.markdown,/Fixture International Foods/u);
    assert.match(document.markdown,/FDA government registration\/renewal fee: US\$ 0/u);
    await assert.rejects(()=>f.doOperation("representation-document-draft",{
      template:"us-agent-service-agreement",engagement:first.order
    }),/must match/u);
  } finally {f.cleanup();}
});

test("a client can't skip signed or authorized work, fake an annual food-agent renewal, or merge facilities",async()=>{
  const f=fixture();
  try {
    const one=await f.doOperation("representation-engagement-record",facility("CN-Plant-1"));
    await assert.rejects(()=>f.doOperation("representation-engagement-record",{
      ...base,establishment:"CN-Plant-1",stage:"active",
      customerAuthorizationRef:"fixture:customer-says-so"
    }),/cannot skip/u);
    await assert.rejects(()=>f.doOperation("representation-engagement-record",{
      ...base,establishment:"CN-Plant-1",stage:"renewed"
    }),/unknown order stage/u);
    await assert.rejects(()=>f.doOperation("representation-engagement-record",{
      ...base,establishment:"",stage:"proposed"
    }),/distinct client-sourced facility/u);
    await assert.rejects(()=>f.doOperation("representation-document-draft",{
      template:"food-renewal-preparation-agreement",engagement:one.order,
      values:{client:"Different Buyer"}
    }),/cannot rewrite/u);
    assert.equal(f.journal.length,1,"refused moves never append enterprise effects");
  } finally {f.cleanup();}
});
