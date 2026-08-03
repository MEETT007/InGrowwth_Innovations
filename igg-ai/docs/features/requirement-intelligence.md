# Feature Specification: Requirement Intelligence Engine

## 1. Description

The Requirement Intelligence Engine (RIE) is the "Crown Jewel" of the Multimodal Platform. It accepts structured text from specialized engines (Document, Vision, Audio) and synthesizes it into a highly actionable business JSON object.

It acts as a pre-sales consultant, analyzing a prospect's requirements to define the scope, timeline, team, and identify critical missing elements.

## 2. API Contract

### Input

The RIE accepts the parsed text/context extracted from a file.

```typescript
interface RequirementInput {
  sourceType: 'DOCUMENT' | 'VISION' | 'AUDIO';
  rawExtractedText: string;
  metadata: Record<string, any>;
}
```

### Output

The RIE outputs a strictly typed JSON object that is fed into the Consultant Engine.

```typescript
interface RequirementOutput {
  projectType: string; // e.g., "Two-sided mobility platform"
  businessDomain: string; // e.g., "Ride-sharing, Logistics"
  detectedFeatures: string[]; // e.g., ["Customer App", "Driver App", "Wallet"]
  missingRequirements: string[]; // e.g., ["Surge pricing", "Driver verification"]
  recommendedTechStack: string[];
  estimatedTimelineWeeks: { min: number; max: number };
  suggestedTeam: string[]; // e.g., ["1 PM", "2 Flutter Devs"]
  relevantInGrowthServices: string[];
}
```

## 3. Acceptance Criteria

- [ ] GIVEN a PDF containing an "Uber Clone" requirement, WHEN passed to the RIE, THEN it should identify standard features (GPS, Wallet, Profiles).
- [ ] GIVEN the same PDF, WHEN passed to the RIE, THEN it must identify at least 3 missing critical features (e.g., Fraud Detection, Surge Pricing) that a normal founder might forget.
- [ ] GIVEN the RIE output, WHEN passed to the Consultant Engine, THEN the final response must format these insights gracefully into a consultative proposal.
- [ ] The Engine must fallback gracefully if the document is not a requirement spec (e.g., just a logo).
