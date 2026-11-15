import { describe, expect, it } from "vitest";
import { calculateMission } from "../src/engine/missionEngine.js";
import { analyzeWhatIf } from "../src/engine/whatIf.js";
import { calculateMissionScore } from "../src/engine/scoring.js";
import { MISSION_BASELINE } from "../src/engine/componentsData.js";

const validSelection = [
  "structure_6u",
  "camera_basic",
  "solar_deployable_6u",
  "battery_high_capacity",
  "comms_basic",
  "adcs_basic",
  "computer_standard",
  "eps_standard",
  "thermal_harness"
];

describe("LUNAFORGE Member 3 engineering engine", () => {
  it("uses Member 1's 12 kg mass limit and 8 kg target", () => {
    const mission = calculateMission(validSelection);
    expect(mission.constraints.maxMassKg).toBe(12);
    expect(mission.constraints.targetMassKg).toBe(8);
    expect(mission.metrics.totalMassKg).toBeCloseTo(6.55, 2);
  });

  it("calculates the EarthWatch-1 baseline power reference", () => {
    const mission = calculateMission(validSelection);
    expect(mission.constraints.averageGenerationW).toBe(20);
    expect(mission.constraints.averageLoadW).toBe(12);
    expect(mission.constraints.peakLoadW).toBe(30);
  });

  it("tracks battery energy and storage", () => {
    const mission = calculateMission(validSelection);
    expect(mission.metrics.batteryEnergyWh).toBe(88.8);
    expect(mission.metrics.storageGb).toBe(32);
  });

  it("rejects an over-mass design", () => {
    const mission = calculateMission([
      ...validSelection,
      "adcs_precise",
      "camera_advanced"
    ]);
    expect(mission.status).toBe("FAIL");
    expect(mission.violations.some(v => v.includes("Mass limit exceeded"))).toBe(true);
  });

  it("supports What-If comparison", () => {
    const result = analyzeWhatIf(
      validSelection,
      validSelection.map(id => id === "camera_basic" ? "camera_advanced" : id)
    );
    expect(result.comparison.totalMassKg.absolute).toBeCloseTo(0.3, 2);
    expect(result.comparison.scienceScore.absolute).toBe(30);
    expect(result.changedComponents.added).toContain("camera_advanced");
  });

  it("returns a bounded mission score", () => {
    const mission = calculateMission(validSelection);
    const score = calculateMissionScore(mission);
    expect(score.total).toBeGreaterThanOrEqual(0);
    expect(score.total).toBeLessThanOrEqual(100);
    expect(["S","A","B","C","D","F"]).toContain(score.grade);
  });

  it("throws for an unknown component", () => {
    expect(() => calculateMission(["not_a_real_component"])).toThrow(/Unknown component/);
  });

  it("keeps the 1000-credit game budget", () => {
    expect(MISSION_BASELINE.budgetCredits).toBe(1000);
  });
});
