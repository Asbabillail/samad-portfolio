import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");

test("current public portfolio snapshot uses October 2026 device and identity scope", async () => {
  const page = await read("../app/page.tsx");
  assert.match(page, /400 student iPads, 60 teacher iPads/);
  assert.match(page, /800\+ Microsoft accounts/);
  assert.match(page, /52 SMART Boards/);
  assert.match(page, /Intune enrollment and shared-device policies for ICT labs/);
  assert.match(page, /<CertificationsSection \/>/);
});

test("unsupported legacy metrics are not presented as live claims", async () => {
  const page = await read("../app/page.tsx");
  const telemetry = await read("../app/data/telemetry.ts");
  for (const text of [page, telemetry]) {
    assert.doesNotMatch(text, /1,050\+|1,200 Users|350\+ iPads|99\.9+%|100% audit compliance|SAR 100k\+/i);
  }
  assert.match(page, /Not a live operations dashboard/);
});

test("credential entries distinguish certification, coursework, and simulation", async () => {
  const certificate = await read("../components/CertificationsSection.tsx");
  assert.match(certificate, /Google Certified Educator/);
  assert.match(certificate, /Feb 2029/);
  assert.match(certificate, /not the Cisco CCNA exam/i);
  assert.match(certificate, /Virtual job simulation/);
  assert.match(certificate, /original documents are not embedded publicly/i);
});

test("case-study cards expose keyboard activation and dialog controls", async () => {
  const page = await read("../app/page.tsx");
  assert.equal((page.match(/role="button"/g) ?? []).length, 4);
  assert.equal((page.match(/tabIndex=\{0\}/g) ?? []).length, 4);
  assert.match(page, /aria-modal="true"/);
  assert.match(page, /aria-label="Close case study"/);
});

test("public architecture summaries omit granular site topology", async () => {
  const telemetry = await read("../app/data/telemetry.ts");
  const map = await read("../components/InfrastructureMap.tsx");
  for (const content of [telemetry, map]) {
    assert.doesNotMatch(content, /Server\/Data Rooms|4 ISP WANs|STC DIA \(30Mbps\)|192\.168\./);
  }
});
