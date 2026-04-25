#!/usr/bin/env node
/**
 * Source-checkout CLI runner for local development.
 *
 * This executes the TypeScript CLI entrypoint directly via tsx,
 * so help/version/init-help smoke checks do not depend on prebuilt dist artifacts.
 */

import { CLI } from '../v3/@claude-flow/cli/src/index.ts';

const cli = new CLI();

try {
  await cli.run(process.argv.slice(2));
  process.exit(0);
} catch (error) {
  console.error('Fatal error:', error instanceof Error ? error.message : String(error));
  process.exit(1);
}
