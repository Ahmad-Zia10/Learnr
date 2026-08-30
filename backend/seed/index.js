import dotenv from "dotenv";
dotenv.config();

import { connect, disconnect, countAll, wipe } from "./db.js";
import verify from "./verify.js";

//Content modules are registered here as each phase lands. Phase 01 ships the
//harness alone, so an empty list is expected and not an error.
const PHASES = [];

const label = (text) => `\n${text}\n${"-".repeat(text.length)}`;

const run = async () => {
    const verifyOnly = process.argv.includes("--verify");

    const connection = await connect();
    console.log(`Connected to ${connection.name} on ${connection.host}`);

    if(verifyOnly) {
        console.log(label("Verifying"));

        const problems = await verify();

        if(problems.length) {
            problems.forEach((problem) => console.log(`  FAIL  ${problem}`));
            console.log(`\n${problems.length} problem(s) found.`);
            await disconnect();
            process.exitCode = 1;
            return;
        }

        console.log("  All integrity checks passed.");
        await disconnect();
        return;
    }

    //Say what is about to be destroyed before destroying it, so a run against
    //the wrong database is obvious rather than silent.
    console.log(label("Wiping"));

    const before = await countAll();
    const total = before.reduce((sum, entry) => sum + entry.count, 0);

    before
        .filter((entry) => entry.count)
        .forEach((entry) => console.log(`  ${String(entry.count).padStart(5)}  ${entry.name}`));

    if(!total) {
        console.log("  (already empty)");
    }

    await wipe();
    console.log(`  Deleted ${total} document(s).`);

    //Each phase hands the next one whatever it created, so later phases can
    //reference earlier documents without querying for them again.
    const context = {};

    for (const phase of PHASES) {
        console.log(label(phase.title));
        const created = await phase.run(context);
        Object.assign(context, created ?? {});
    }

    if(!PHASES.length) {
        console.log(label("Seeding"));
        console.log("  No content phases registered yet.");
    }

    console.log(label("Verifying"));

    const problems = await verify();

    if(problems.length) {
        problems.forEach((problem) => console.log(`  FAIL  ${problem}`));
        console.log(`\n${problems.length} problem(s) found. The database is NOT demo-ready.`);
        await disconnect();
        process.exitCode = 1;
        return;
    }

    console.log("  All integrity checks passed.");

    const after = await countAll();
    console.log(label("Result"));
    after.forEach((entry) => console.log(`  ${String(entry.count).padStart(5)}  ${entry.name}`));

    await disconnect();
}

run().catch(async (error) => {
    console.error("\nSeed failed:", error.message);
    await disconnect().catch(() => {});
    process.exitCode = 1;
});
