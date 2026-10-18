// One-off cleanup for the switch to fixed categories (src/lib/categories.ts).
// 1. Normalises case/whitespace variants of free-text tags ("politics" -> "Politics").
// 2. Gives the posts saved with the old default tag "Latest" a real category.
//
// Run AFTER the fixed-categories code is deployed (old code would keep saving
// "Latest" as a tag). From the repo root, with MONGODB_URI in .env.local:
//
//   npx tsx --env-file=.env.local scripts/retag-categories.ts            # dry run: prints the plan
//   npx tsx --env-file=.env.local scripts/retag-categories.ts --apply    # backs up, then writes
//   npx tsx --env-file=.env.local scripts/retag-categories.ts --restore backups/<file>.json   # undo
//
// --apply first saves every changed post's old tag to backups/ (gitignored).
// "Latest" posts not listed below (e.g. published before the deploy) are reported
// as UNRESOLVED and left alone; give them a category in the admin panel.
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import { CATEGORIES, isCategory } from '../src/lib/categories';

const APPLY = process.argv.includes('--apply');
const restoreIdx = process.argv.indexOf('--restore');
const RESTORE_FILE = restoreIdx > -1 ? process.argv[restoreIdx + 1] : undefined;
const BACKUP_DIR = path.join(__dirname, '..', 'backups');

type Change = { _id: string; title: string; from: string; to: string };

// Suggested categories for the "Latest" posts, by post _id. Review before applying.
const LATEST_RETAG: Record<string, string> = {
  "6ad0cdc2c3b586ea303f74ee": "Politics", // Supreme Court Seeks EC Response on Voter Deletion Allegations
  "6ad05fe6e464356b2dfd04ac": "Global", // US Green Card Suspension: Impact on TCS, Infosys and Indian IT Workers
  "6ad05e4e53b021372ecd569f": "Business", // Musk vs Ambani: Is India’s Satellite Internet Battle About Competition
  "6aca379d2101663ff3014bdc": "Politics", // October 10 Protest: After July’s Unrest, Can Delhi Balance National Se
  "6abbd1faafa564c166134fb8": "Brands Story", // Diageo India Reimagines McDowell’s No.1 with an Upgraded Blend and Pre
  "6ab939475b9a4ca0f922a4f2": "News", // MrBeast’s ‘Jai Shri Ram’ Chant With Ranbir Kapoor Goes Viral at Ramaya
  "6aae76c1da154190eeaffc44": "Economy", // India’s Renewable Energy Push Enters a New Phase With Solar Leading
  "6aae712f612a32ed9b021a04": "Business", // India’s New Company Boom: Which Sectors Are Driving Corporate Growth?
  "6aae472cc0dbb502fbe380fe": "Business", // Cult.fit Co-Founder Dispute Takes Legal Turn: FIR Alleges Forgery and 
  "6a96edd0aaec673f29f61d80": "Economy", // India GDP Growth Hits 7.8% in Q1 FY27 as Investment and Manufacturing 
  "6a93e00dbc582065526547c2": "Policy", // Justice Bhuyan’s Big Question: Why No Distinguished Jurist in SC?
  "6a93d4c436f352d0ce604b8d": "Global", // Iran’s BRICS Pivot: As U.S. Pressure Intensifies, Tehran Builds a New 
  "6a873cb229a5bdc98ea43067": "News", // ‘I Apologise to the Indian Army’: Viral ‘We Are Gen Z’ Video Triggers 
  "6a85e01530222527e415e401": "Global", // US Envoy’s Kashmir Message: Will America Ease Its Travel Advisory?
  "6a80cccee4a9c6da2ff7367c": "Crypto", // The Infinite Loop: How One Man Exploited a Wall Street Glitch to Corne
  "6a76ccb1a6d7fd6f26fa0bac": "News", // Neha’s Protest Drama Turns Ugly , Ink Thrown Over ‘Anti-National’ Clai
  "6a75484485fd2c6fc574ecfa": "Markets", // Jamie Dimon Warns Hidden Market Leverage Could Trigger Financial Disru
  "6a754694ed1dd3e9d8e37732": "AI World", // India AI Impact Summit Becomes Global Turning Point, Says PM Modi in M
  "6a6f1e8f5efc160a7b5283e1": "AI World", // India's Top 100 Jobs Most Likely to Be Replaced by AI by 2030
  "6a6e2e8d3978c8fc58ad0a7b": "Economy", // India's Exports Defy Global Crisis, Surge 15% Despite Red Sea Trade Di
  "6a673366167367dcdc665cf3": "Policy", // How to File a Consumer Court Case in India: A Complete Step-by-Step Gu
  "6a66e7e2f76194e9c5e57ba4": "Global", // Modi, Vietnam's To Lam Elevate Strategic Partnership with New Trade Go
  "6a66e5c4fd17669ac667dffe": "Education", // PM Modi Unveils Nandan Nilekani-Led Exam Reform Task Force to Restore 
  "6a66e3756c6ce79dacd3bad9": "Business", // Sateliot Establishes India Subsidiary to Accelerate Satellite IoT Expa
  "6a649a6cd17429a7e294f709": "Politics", // Dharmendra Pradhan Resigns as Education Minister Amid Nationwide Stude
  "6a629588bcced59d5d3eec0e": "Policy", // THE DIGITAL TARIFF: Inside the Landmark Court Ruling Breaking Google’s
  "6a5dd13fdb4c9935398e7e51": "Business", // BSNL Just Launched a Satellite Phone Priced at ₹1,34,166 Here's Why In
  "6a589c90227eca5236509955": "Education", // Government Jobs 2026: UPSC, SSC, Railway, IBPS & State Exams See Recor
  "6a57d7670e9fa3892a456eaf": "Global", // Russia’s Silent Shield? Iran’s €500 Million Air Defence Deal Raises Gl
  "6a579e3c82a263c959e7562d": "Global", // Tariff Politics or Global Strategy? Why Trump's Trade Threats Are Losi
  "6a560a8d97d786e862b05014": "Global", // Middle East Tensions Rise Again as Iran Signals It Will Not Back Down
  "6a54cbba660e6f6fa9a4ad34": "News", // Kerala Lottery Result Today: Why Bhagyathara BT-62 Is Trending Across 
  "6a53b2e54ce71d8d19ca0c6c": "Business", // India–South Korea Chip Alliance Set to Power the Next AI Revolution
  "6a51370a7a90a894423f3410": "Brands Story", // Founder of Brandstrial Pratyush Pandey Receives Bharat Nirman Award fr
  "6a4ca573e44218d87922bd04": "Brands Story", // Healthwadi Puts Water Security at the Heart of Bharat Nirman Conclave 
  "6a37cb8491d1bfa0d0f2b6bb": "Economy", // Japan Deepens Its India Bet, Backing Chips, Factories and a New Econom
  "6a37bd3b4bedc117c965aec0": "News", // International Yoga Day 2026: When the World Stopped Running and Chose 
  "6a351f4c93dd6e3d780e6ba2": "Education", // UKSSSC Exam Calendar 2026: Upcoming Exam Dates, Notification Schedule 
  "6a314c2af3fbf816f51eec12": "Business", // Adani, Vedanta, and the Bigger Question: Is India Creating Champions o
  "6a2d4aa91f61dd909da604d3": "News", // IAF AN-32 Crash at Jorhat: 5 Air Warriors Killed, Co-Pilot Sole Surviv
  "69ef7f6a0301796448883d7f": "Politics", // Government introduces new data protection bill in parliament
};

// Puts back the tags recorded by an --apply run, only where the tag is still what that run set
async function restore(posts: mongoose.mongo.Collection, file: string) {
  const changes: Change[] = JSON.parse(fs.readFileSync(file, 'utf8'));
  const res = await posts.bulkWrite(
    changes.map((c) => ({
      updateOne: { filter: { _id: new mongoose.Types.ObjectId(c._id), tag: c.to }, update: { $set: { tag: c.from } } },
    }))
  );
  console.log(`Restored ${res.modifiedCount} of ${changes.length} posts from ${file}`);
}

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is not set');
  await mongoose.connect(uri);
  const posts = mongoose.connection.db!.collection('posts');

  if (RESTORE_FILE) {
    await restore(posts, RESTORE_FILE);
    return mongoose.disconnect();
  }

  const changes: Change[] = [];
  const unresolved: string[] = [];

  for (const p of await posts.find({}, { projection: { title: 1, tag: 1 } }).toArray()) {
    const from: string = p.tag ?? '';
    const id = String(p._id);
    const to =
      from === 'Latest' ? LATEST_RETAG[id]
      : CATEGORIES.find((c) => c.toLowerCase() === from.trim().toLowerCase());

    if (!to || !isCategory(to)) unresolved.push(`${id}  tag=${JSON.stringify(from)}  ${p.title}`);
    else if (to !== from) changes.push({ _id: id, title: p.title, from, to });
  }

  for (const c of changes) console.log(`${JSON.stringify(c.from).padEnd(16)} -> ${c.to.padEnd(14)} ${c.title.trim().slice(0, 70)}`);
  console.log(`\n${changes.length} posts to retag, ${unresolved.length} unresolved`);
  unresolved.forEach((u) => console.log('  UNRESOLVED', u));

  if (APPLY && changes.length) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
    const backup = path.join(BACKUP_DIR, `retag-categories-${new Date().toISOString().replace(/[:.]/g, '-')}.json`);
    fs.writeFileSync(backup, JSON.stringify(changes, null, 1));
    console.log(`Backup of old tags: ${path.relative(process.cwd(), backup)}`);

    const res = await posts.bulkWrite(
      changes.map((c) => ({
        updateOne: { filter: { _id: new mongoose.Types.ObjectId(c._id), tag: c.from }, update: { $set: { tag: c.to } } },
      }))
    );
    console.log(`Applied: ${res.modifiedCount} of ${changes.length} updated`);
    console.log(`To undo: npx tsx --env-file=.env.local scripts/retag-categories.ts --restore ${path.relative(process.cwd(), backup)}`);
  } else if (!APPLY) {
    console.log('Dry run. Re-run with --apply to write.');
  }
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
