import {
  Brain,
  BrainCircuit,
  Code2,
  Cpu,
  Database,
  Globe,
  MessageSquare,
  Search,
  Server,
  Smartphone,
  Workflow,
  type LucideIcon,
} from 'lucide-react';

/**
 * Explicit map of the icons referenced by name in content JSON
 * (content/services.json, content/skills.json). Using this instead of a
 * wildcard `import * as LucideIcons` lets the bundler tree-shake down to just
 * these icons rather than shipping the entire lucide-react set (~1500 icons)
 * to the browser — a major bundle-size win for low-end devices.
 *
 * When you add a new `"icon"` value to the content JSON, add it here too.
 */
export const CONTENT_ICONS: Record<string, LucideIcon> = {
  Brain,
  BrainCircuit,
  Code2,
  Cpu,
  Database,
  Globe,
  MessageSquare,
  Search,
  Server,
  Smartphone,
  Workflow,
};

/** Resolve a content icon name to its component, falling back to Cpu. */
export function getContentIcon(name: string): LucideIcon {
  return CONTENT_ICONS[name] ?? Cpu;
}
