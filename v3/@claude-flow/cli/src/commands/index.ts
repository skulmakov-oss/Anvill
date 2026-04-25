/**
 * V3 CLI Commands Index
 * Central registry for all CLI commands
 *
 * NOTE: All commands are synchronously imported at module load time (lines below).
 * The commandLoaders/loadCommand infrastructure provides an async fallback for
 * commands looked up via getCommandAsync() but does NOT reduce startup time since
 * all modules are already imported synchronously for the commands array and
 * commandsByCategory exports.
 */

import type { Command } from '../types.js';

export type CommandCategory = 'primary' | 'advanced' | 'utility' | 'analysis' | 'management';

export interface CommandMetadata {
  name: string;
  aliases?: string[];
  category: CommandCategory;
  description: string;
  hidden?: boolean;
  heavy?: boolean;
  experimental?: boolean;
}

// =============================================================================
// Lazy Loading Infrastructure
// =============================================================================

type CommandLoader = () => Promise<{ default?: Command; [key: string]: Command | unknown }>;

/**
 * Command loaders - commands are only imported when needed
 * This reduces initial bundle parse time by ~200ms
 */
const commandLoaders: Record<string, CommandLoader> = {
  // P1 Core Commands (frequently used - load first)
  init: () => import('./init.js'),
  start: () => import('./start.js'),
  status: () => import('./status.js'),
  task: () => import('./task.js'),
  session: () => import('./session.js'),
  // Original Commands
  agent: () => import('./agent.js'),
  swarm: () => import('./swarm.js'),
  memory: () => import('./memory.js'),
  mcp: () => import('./mcp.js'),
  config: () => import('./config.js'),
  migrate: () => import('./migrate.js'),
  hooks: () => import('./hooks.js'),
  workflow: () => import('./workflow.js'),
  'hive-mind': () => import('./hive-mind.js'),
  process: () => import('./process.js'),
  daemon: () => import('./daemon.js'),
  // V3 Advanced Commands (less frequently used - lazy load)
  neural: () => import('./neural.js'),
  security: () => import('./security.js'),
  performance: () => import('./performance.js'),
  providers: () => import('./providers.js'),
  plugins: () => import('./plugins.js'),
  deployment: () => import('./deployment.js'),
  claims: () => import('./claims.js'),
  embeddings: () => import('./embeddings.js'),
  // P0 Commands
  completions: () => import('./completions.js'),
  doctor: () => import('./doctor.js'),
  // Analysis Commands
  analyze: () => import('./analyze.js'),
  // Q-Learning Routing Commands
  route: () => import('./route.js'),
  // Progress Commands
  progress: () => import('./progress.js'),
  // Issue Claims Commands (ADR-016)
  issues: () => import('./issues.js'),
  // Auto-update System (ADR-025)
  update: () => import('./update.js'),
  // RuVector PostgreSQL Bridge
  ruvector: () => import('./ruvector/index.js'),
  // Benchmark Suite (Pre-training, Neural, Memory)
  benchmark: () => import('./benchmark.js'),
  // Guidance Control Plane
  guidance: () => import('./guidance.js'),
  // RVFA Appliance Management
  appliance: () => import('./appliance.js'),
  'appliance-advanced': () => import('./appliance-advanced.js'),
  'transfer-store': () => import('./transfer-store.js'),
  cleanup: () => import('./cleanup.js'),
  autopilot: () => import('./autopilot.js'),
};

/**
 * Lightweight command metadata used for top-level help output.
 * Important: this registry must stay import-safe and must not import command modules.
 */
const commandMetadata: CommandMetadata[] = [
  { name: 'init', aliases: ['i'], category: 'primary', description: 'Initialize project with AI agent system' },
  { name: 'start', category: 'primary', description: 'Start the interactive AI agent system' },
  { name: 'status', aliases: ['st'], category: 'primary', description: 'Show system status and active agents' },
  { name: 'agent', aliases: ['a'], category: 'primary', description: 'Agent management and lifecycle control' },
  { name: 'swarm', aliases: ['s'], category: 'primary', description: 'Swarm orchestration and coordination' },
  { name: 'memory', aliases: ['mem'], category: 'primary', description: 'Persistent memory and context management' },
  { name: 'task', aliases: ['t'], category: 'primary', description: 'Task creation, assignment, and tracking' },
  { name: 'session', aliases: ['sess'], category: 'primary', description: 'Session management and analytics' },
  { name: 'mcp', category: 'primary', description: 'Model Context Protocol server and tools' },
  { name: 'hooks', aliases: ['h'], category: 'primary', description: 'Hook management and event handling' },
  { name: 'neural', aliases: ['n'], category: 'advanced', description: 'Neural network training and optimization', heavy: true },
  { name: 'security', aliases: ['sec'], category: 'advanced', description: 'Security scanning and vulnerability analysis' },
  { name: 'performance', aliases: ['perf'], category: 'advanced', description: 'Performance monitoring and optimization' },
  { name: 'embeddings', aliases: ['emb'], category: 'advanced', description: 'Vector embeddings and semantic search', heavy: true },
  { name: 'hive-mind', aliases: ['hm'], category: 'advanced', description: 'Byzantine fault-tolerant consensus system' },
  { name: 'ruvector', aliases: ['rv'], category: 'advanced', description: 'RuVector PostgreSQL bridge and commands', heavy: true },
  { name: 'guidance', aliases: ['guide'], category: 'advanced', description: 'Guidance policy and control plane' },
  { name: 'autopilot', aliases: ['ap'], category: 'advanced', description: 'Autonomous workflow orchestration', experimental: true },
  { name: 'config', aliases: ['cfg'], category: 'utility', description: 'Configuration management and validation' },
  { name: 'doctor', aliases: ['diag'], category: 'utility', description: 'Diagnostics and troubleshooting checks' },
  { name: 'daemon', aliases: ['d'], category: 'utility', description: 'Background daemon process management' },
  { name: 'completions', aliases: ['comp'], category: 'utility', description: 'Generate shell completion scripts' },
  { name: 'migrate', aliases: ['mig'], category: 'utility', description: 'Migration tools and utilities' },
  { name: 'workflow', aliases: ['wf'], category: 'utility', description: 'Workflow definition and execution' },
  { name: 'analyze', aliases: ['an'], category: 'analysis', description: 'Code analysis and quality assessment' },
  { name: 'route', aliases: ['r'], category: 'analysis', description: 'Q-learning based task routing' },
  { name: 'progress', aliases: ['pg'], category: 'analysis', description: 'Progress tracking and analytics' },
  { name: 'providers', aliases: ['prov'], category: 'management', description: 'AI provider configuration and management' },
  { name: 'plugins', aliases: ['p'], category: 'management', description: 'Plugin installation and management' },
  { name: 'deployment', aliases: ['dep'], category: 'management', description: 'Deployment and release management' },
  { name: 'claims', aliases: ['cl'], category: 'management', description: 'Issue claims and ownership management' },
  { name: 'issues', aliases: ['iss'], category: 'management', description: 'Issue tracking and management' },
  { name: 'update', aliases: ['up'], category: 'management', description: 'Update checks and package upgrades' },
  { name: 'process', aliases: ['proc'], category: 'management', description: 'Process and worker orchestration' },
  { name: 'appliance', aliases: ['app'], category: 'management', description: 'RVFA appliance lifecycle management', heavy: true },
  { name: 'cleanup', aliases: ['clean'], category: 'management', description: 'Workspace and artifact cleanup utilities' },
];

// Cache for loaded commands
const loadedCommands = new Map<string, Command>();

/**
 * Load a command lazily
 */
async function loadCommand(name: string): Promise<Command | undefined> {
  if (loadedCommands.has(name)) {
    return loadedCommands.get(name);
  }

  const loader = commandLoaders[name];
  if (!loader) return undefined;

  try {
    const module = await loader();
    // Try to find the command export (either default or named)
    const command = (module.default || module[`${name}Command`] || Object.values(module).find(
      (v): v is Command => typeof v === 'object' && v !== null && 'name' in v && 'description' in v
    )) as Command | undefined;

    if (command) {
      loadedCommands.set(name, command);
      return command;
    }
  } catch (error) {
    // Silently fail for missing optional commands
    if (process.env.DEBUG) {
      console.error(`Failed to load command ${name}:`, error);
    }
  }
  return undefined;
}

// =============================================================================
// Synchronous Imports for Core Commands (needed immediately at startup)
// These are the most commonly used commands that need instant access
// =============================================================================

// PERF-03: Only import core commands synchronously (~10 most-used).
// All other commands are lazy-loaded via commandLoaders on demand.
import { initCommand } from './init.js';
import { startCommand } from './start.js';
import { statusCommand } from './status.js';
import { taskCommand } from './task.js';
import { sessionCommand } from './session.js';
import { agentCommand } from './agent.js';
import { swarmCommand } from './swarm.js';
import { memoryCommand } from './memory.js';
import { mcpCommand } from './mcp.js';
import { hooksCommand } from './hooks.js';

// Pre-populate cache with core commands only
loadedCommands.set('init', initCommand);
loadedCommands.set('start', startCommand);
loadedCommands.set('status', statusCommand);
loadedCommands.set('task', taskCommand);
loadedCommands.set('session', sessionCommand);
loadedCommands.set('agent', agentCommand);
loadedCommands.set('swarm', swarmCommand);
loadedCommands.set('memory', memoryCommand);
loadedCommands.set('mcp', mcpCommand);
loadedCommands.set('hooks', hooksCommand);

// =============================================================================
// Exports (maintain backwards compatibility)
// =============================================================================

// Export core commands (synchronous)
export { initCommand } from './init.js';
export { startCommand } from './start.js';
export { statusCommand } from './status.js';
export { taskCommand } from './task.js';
export { sessionCommand } from './session.js';
export { agentCommand } from './agent.js';
export { swarmCommand } from './swarm.js';
export { memoryCommand } from './memory.js';
export { mcpCommand } from './mcp.js';
export { hooksCommand } from './hooks.js';

// Lazy-loaded command re-exports (for backwards compatibility, but async-only)
export async function getConfigCommand() { return loadCommand('config'); }
export async function getMigrateCommand() { return loadCommand('migrate'); }
export async function getWorkflowCommand() { return loadCommand('workflow'); }
export async function getHiveMindCommand() { return loadCommand('hive-mind'); }
export async function getProcessCommand() { return loadCommand('process'); }
export async function getTaskCommand() { return loadCommand('task'); }
export async function getSessionCommand() { return loadCommand('session'); }
export async function getNeuralCommand() { return loadCommand('neural'); }
export async function getSecurityCommand() { return loadCommand('security'); }
export async function getPerformanceCommand() { return loadCommand('performance'); }
export async function getProvidersCommand() { return loadCommand('providers'); }
export async function getPluginsCommand() { return loadCommand('plugins'); }
export async function getDeploymentCommand() { return loadCommand('deployment'); }
export async function getClaimsCommand() { return loadCommand('claims'); }
export async function getEmbeddingsCommand() { return loadCommand('embeddings'); }
export async function getCompletionsCommand() { return loadCommand('completions'); }
export async function getAnalyzeCommand() { return loadCommand('analyze'); }
export async function getRouteCommand() { return loadCommand('route'); }
export async function getProgressCommand() { return loadCommand('progress'); }
export async function getIssuesCommand() { return loadCommand('issues'); }
export async function getRuvectorCommand() { return loadCommand('ruvector'); }
export async function getGuidanceCommand() { return loadCommand('guidance'); }
export async function getApplianceCommand() { return loadCommand('appliance'); }
export async function getCleanupCommand() { return loadCommand('cleanup'); }
export async function getAutopilotCommand() { return loadCommand('autopilot'); }

/**
 * Core commands loaded synchronously (available immediately)
 * Advanced commands loaded on-demand for faster startup
 */
export const commands: Command[] = [
  // Core commands (synchronously loaded) — PERF-03
  initCommand,
  startCommand,
  statusCommand,
  taskCommand,
  sessionCommand,
  agentCommand,
  swarmCommand,
  memoryCommand,
  mcpCommand,
  hooksCommand,
];

/**
 * Commands organized by category for help display (synchronous core only).
 * @deprecated Use getCommandsByCategory() for full categorized listing.
 */
export const commandsByCategory = {
  primary: [
    initCommand,
    startCommand,
    statusCommand,
    agentCommand,
    swarmCommand,
    memoryCommand,
    taskCommand,
    sessionCommand,
    mcpCommand,
    hooksCommand,
  ],
  advanced: [] as Command[],
  utility: [] as Command[],
  analysis: [] as Command[],
  management: [] as Command[],
};

/**
 * Async version that loads all commands by category (PERF-03).
 * Use this for help display and full command listings.
 */
export async function getCommandsByCategory(): Promise<Record<string, Command[]>> {
  const [
    daemonCmd, doctorCmd, embeddingsCmd, neuralCmd,
    performanceCmd, securityCmd, ruvectorCmd, hiveMindCmd,
    configCmd, completionsCmd, migrateCmd, workflowCmd,
    analyzeCmd, routeCmd, progressCmd, providersCmd,
    pluginsCmd, deploymentCmd, claimsCmd, issuesCmd,
    updateCmd, processCmd, guidanceCmd, applianceCmd,
    cleanupCmd, autopilotCmd,
  ] = await Promise.all([
    loadCommand('daemon'), loadCommand('doctor'), loadCommand('embeddings'), loadCommand('neural'),
    loadCommand('performance'), loadCommand('security'), loadCommand('ruvector'), loadCommand('hive-mind'),
    loadCommand('config'), loadCommand('completions'), loadCommand('migrate'), loadCommand('workflow'),
    loadCommand('analyze'), loadCommand('route'), loadCommand('progress'), loadCommand('providers'),
    loadCommand('plugins'), loadCommand('deployment'), loadCommand('claims'), loadCommand('issues'),
    loadCommand('update'), loadCommand('process'), loadCommand('guidance'), loadCommand('appliance'),
    loadCommand('cleanup'), loadCommand('autopilot'),
  ]);

  return {
    primary: [
      initCommand, startCommand, statusCommand, agentCommand,
      swarmCommand, memoryCommand, taskCommand, sessionCommand,
      mcpCommand, hooksCommand,
    ],
    advanced: [
      neuralCmd, securityCmd, performanceCmd, embeddingsCmd,
      hiveMindCmd, ruvectorCmd, guidanceCmd, autopilotCmd,
    ].filter(Boolean) as Command[],
    utility: [
      configCmd, doctorCmd, daemonCmd, completionsCmd,
      migrateCmd, workflowCmd,
    ].filter(Boolean) as Command[],
    analysis: [
      analyzeCmd, routeCmd, progressCmd,
    ].filter(Boolean) as Command[],
    management: [
      providersCmd, pluginsCmd, deploymentCmd, claimsCmd,
      issuesCmd, updateCmd, processCmd, applianceCmd, cleanupCmd,
    ].filter(Boolean) as Command[],
  };
}

/**
 * Lightweight command metadata grouped by category.
 * Use this for startup help paths that must avoid importing optional dependencies.
 */
export function getCommandMetadataByCategory(): Record<CommandCategory, CommandMetadata[]> {
  return {
    primary: commandMetadata.filter(cmd => cmd.category === 'primary'),
    advanced: commandMetadata.filter(cmd => cmd.category === 'advanced'),
    utility: commandMetadata.filter(cmd => cmd.category === 'utility'),
    analysis: commandMetadata.filter(cmd => cmd.category === 'analysis'),
    management: commandMetadata.filter(cmd => cmd.category === 'management'),
  };
}

/**
 * Command registry map for quick lookup
 * Supports both sync (core commands) and async (lazy-loaded) commands
 */
export const commandRegistry = new Map<string, Command>();

// Register core commands and their aliases
for (const cmd of commands) {
  commandRegistry.set(cmd.name, cmd);
  if (cmd.aliases) {
    for (const alias of cmd.aliases) {
      commandRegistry.set(alias, cmd);
    }
  }
}

/**
 * Get command by name (sync for core commands, returns undefined for lazy commands)
 * Use getCommandAsync for lazy-loaded commands
 */
export function getCommand(name: string): Command | undefined {
  return loadedCommands.get(name) || commandRegistry.get(name);
}

/**
 * Get command by name (async - supports lazy loading)
 */
export async function getCommandAsync(name: string): Promise<Command | undefined> {
  // Check already-loaded commands first
  const cached = loadedCommands.get(name);
  if (cached) return cached;

  // Check sync registry
  const synced = commandRegistry.get(name);
  if (synced) return synced;

  // Try lazy loading
  return loadCommand(name);
}

/**
 * Check if command exists (sync check for core commands)
 */
export function hasCommand(name: string): boolean {
  return loadedCommands.has(name) || commandRegistry.has(name) || name in commandLoaders;
}

/**
 * Get the names of all lazy-loadable commands (the commandLoaders keys).
 * Used by the CLI constructor to register these names with the parser so
 * the two-pass argument walker can recognize them as commands before their
 * modules have been imported. Fix for #1596.
 */
export function getLazyCommandNames(): string[] {
  return Object.keys(commandLoaders);
}

/**
 * Get all command names (including aliases and lazy-loadable)
 */
export function getCommandNames(): string[] {
  const names = new Set([
    ...Array.from(commandRegistry.keys()),
    ...Array.from(loadedCommands.keys()),
    ...Object.keys(commandLoaders),
  ]);
  return Array.from(names);
}

/**
 * Get all unique commands (excluding aliases)
 */
export function getUniqueCommands(): Command[] {
  return commands.filter(cmd => !cmd.hidden);
}

/**
 * Load all commands (populates lazy-loaded commands)
 * Use this when you need all commands available synchronously
 */
export async function loadAllCommands(): Promise<Command[]> {
  const allCommands: Command[] = [...commands];

  for (const name of Object.keys(commandLoaders)) {
    if (!loadedCommands.has(name)) {
      const cmd = await loadCommand(name);
      if (cmd && !allCommands.includes(cmd)) {
        allCommands.push(cmd);
      }
    }
  }

  return allCommands;
}

/**
 * Setup commands in a CLI instance
 */
export function setupCommands(cli: { command: (cmd: Command) => void }): void {
  for (const cmd of commands) {
    cli.command(cmd);
  }
}

/**
 * Setup all commands including lazy-loaded (async)
 */
export async function setupAllCommands(cli: { command: (cmd: Command) => void }): Promise<void> {
  const allCommands = await loadAllCommands();
  for (const cmd of allCommands) {
    cli.command(cmd);
  }
}
