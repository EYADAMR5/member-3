# LUNAFORGE — Member 3 Engineering & Calculation Engine v2

This version is rebuilt from the **Member 1 EarthWatch-1 baseline**.

## What is aligned with Member 1

- Mission: EarthWatch-1
- Spacecraft: 6U CubeSat
- Scenario orbit: 500 km LEO
- Maximum mass: 12 kg
- Recommended target mass: 8 kg
- Average solar generation: 20 W (game assumption)
- Average load: 12 W (game assumption)
- Peak load: 30 W (game assumption)
- Battery reference: 88.8 Wh
- Storage: 32 GB
- Budget: 1,000 game credits
- Required subsystems: structure, payload, solar, battery, communications, ADCS, computer, EPS

## Files

- `src/engine/componentsData.js` — Member 1-aligned baseline and component catalog.
- `src/engine/missionEngine.js` — mass, power, battery, storage, budget and validation engine.
- `src/engine/whatIf.js` — before/after trade-off comparison.
- `src/engine/scoring.js` — gameplay mission score.
- `tests/missionEngine.test.js` — automated tests.

## Important engineering-model rule

This is an **educational game model**, not a flight-ready spacecraft analysis.

Member 1 explicitly distinguishes NASA/reference values from gameplay assumptions. The code keeps that distinction in the data and documentation.

## React integration

```js
import { calculateMission } from "./engine/missionEngine.js";
import { analyzeWhatIf } from "./engine/whatIf.js";
import { calculateMissionScore } from "./engine/scoring.js";

const mission = calculateMission(selectedComponentIds);
const score = calculateMissionScore(mission);

const whatIf = analyzeWhatIf(
  selectedComponentIds,
  changedComponentIds
);
```

## Install and test

```bash
npm install
npm test
```

## UI recommendations

Show these metrics in the dashboard:

1. Mass / 12 kg limit and distance from the 8 kg target.
2. Average generation / average load / power margin.
3. Peak load and battery support warning.
4. Battery energy in Wh.
5. Storage in GB and generated data per day.
6. Budget / 1,000 credits.
7. Validation status and exact violations.
8. Mission score and grade.

Do not label the 20 W, 12 W, 30 W, 32 GB or 1,000 credits as NASA specifications; they are the LUNAFORGE gameplay baseline.
