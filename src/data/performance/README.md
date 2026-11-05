# Performance Lab snapshot

Replace `public/data/performance-lab/health-snapshot.json` with the same schema for a later export. No UI changes are needed. The browser fetches the file when the Performance Lab page opens; this is not a live account integration. No services or new dependencies are used.

The loader and transformations live in `src/data/performance/snapshot.ts`. It validates metadata, dates, nonnegative numeric values or explicit nulls, workout intervals, and unique dates in daily steps and resting heart rate. Invalid exports show an error with a retry action rather than guessed values. Keep all four arrays even if empty. Unknown activity codes are displayed as unmapped.

Activity mapping uses Apple HealthKit codes, corroborated by the supplied Running=37, Cycling=13, DiscSports=75 labels. Verified with the SDK binding at https://github.com/dotnet/macios/blob/main/src/HealthKit/Enums.cs and https://developer.apple.com/documentation/healthkit/hkworkoutactivitytype . Code 75 includes ultimate AND disc golf. Original Fitbit source labels cannot be verified from the export alone.

Exact workout intervals are collapsed (first record retained). Any distinct intervals that overlap are all excluded from analytics, including chains of overlaps. This conservative policy prevents double counting without inventing how their calories or distance should be apportioned. Adjacent intervals are retained. The current source has 46 records, no duplicate intervals, and no overlaps.

Date filters are inclusive on the supplied date field. Week buckets start Monday. Session duration is the reported durationMinutes, assigned to the recorded start date. Weeks at the edges may be partial; no workout records is not evidence of rest. Null metrics stay null. Metric sums use known observations only with coverage labels. Daily walking/running distance is not added to workout distance.

Steps cover Oct 22-Nov 4, 2026 only. Missing dates are rendered as gaps, not zeros. Resting heart rate is a mean of recorded observations, without clinical interpretation.

Sleep sums asleep minutes from all sessions on each supplied date (including short sessions); it does not infer sleep onset from end-minus-duration. The consistency chart uses each day's longest session and shows population standard deviation in minutes. It is not a bedtime consistency score, and missing dates remain missing. Upstream segment grouping uses >90-minute gaps and only asleep stages, as described in the file.

Run `node scripts/test-performance-snapshot.mjs` for data integrity and regression checks. Run `npm run build` for TypeScript and production bundling. No lint script is configured. Preview with `npm run dev`, then open `/#/performance-lab`.
