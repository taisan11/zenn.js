import { rmSync, existsSync, readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { join } from "node:path";

const OUTDIR = "./dist";
const ENTRYPOINTS = ["./src/index.ts"];

const start = performance.now();

if (existsSync(OUTDIR)) {
  rmSync(OUTDIR, { recursive: true, force: true });
}

type Format = "esm" | "cjs";

async function bundle(format: Format, naming: string): Promise<void> {
  process.stdout.write(`→ bundling ${format.toUpperCase()} ... `);

  const result = await Bun.build({
    entrypoints: ENTRYPOINTS,
    outdir: OUTDIR,
    format,
    target: "node",
    splitting: false,
    sourcemap: "external",
    naming,
    minify: false,
  });

  if (!result.success) {
    console.log("failed");
    for (const log of result.logs) console.error(log);
    throw new Error(`${format.toUpperCase()} bundle failed`);
  }
  console.log("done");
}

await bundle("esm", "[dir]/[name].[ext]");
await bundle("cjs", "[dir]/[name].cjs");

process.stdout.write("→ emitting .d.ts via tsc ... ");
const tsc = Bun.spawnSync({
  cmd: ["node_modules/.bin/tsc", "-p", "tsconfig.build.json"],
  stdout: "inherit",
  stderr: "inherit",
});
if (tsc.exitCode !== 0) {
  console.log("failed");
  process.exit(tsc.exitCode ?? 1);
}
console.log("done");

process.stdout.write("→ normalizing .d.ts specifiers ... ");

const TS_EXT = /((?:\.{1,2}\/[^"')]+))\.ts(?=["')])/g;
let normalized = 0;
function walk(dir: string): void {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      walk(p);
      continue;
    }
    if (!name.endsWith(".d.ts")) continue;
    const src = readFileSync(p, "utf8");
    const next = src.replace(TS_EXT, "$1");
    if (next !== src) {
      writeFileSync(p, next);
      normalized++;
    }
  }
}
walk(OUTDIR);
console.log(`${normalized} file(s)`);

const ms = (performance.now() - start).toFixed(0);
console.log(`\n✓ build complete in ${ms}ms → ${OUTDIR}/`);
