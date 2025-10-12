// luma-runtime.ts
// Runtime helper for luma_animation_schema.json
// - classifies archetype from tiers
// - evaluates formulas (linear, step, clamp, min, max + arithmetic)
// - resolves @json.path references
// - returns render-ready state (composition, params, colors, particles, audio)

type Json = any;
type Tier = 1|2|3|4|5|6;

export interface MoodInput {
  energy: number; // 0-100
  focus:  number; // 0-100
  social: number; // 0-100
  state?: keyof Schema["states"];           // e.g., "idle" | "listening"...
  event?: string;                           // optional: to select transition
  reducedMotion?: boolean;
  seed?: number;
}

export interface RuntimeOut {
  composition: string;        // lottie/rive file path
  loop: boolean;
  params: Record<string, number | string>;
  particles?: { type: string; density: number } | null;
  ambientGradient: [string, string];
  hornGlowMultiplier: number;
  audio?: { loop?: string; sfx?: string; volume: number };
  archetype: string;
  state: string;
}

type Schema = typeof import("./data/luma_animation_schema.json");

function clamp(n: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, n)); }
function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

// ---------- Path resolution for "@foo.bar[0]" ----------
function resolvePath(root: Json, path: string): any {
  const p = path.startsWith("@") ? path.slice(1) : path;
  const parts = p.replace(/\[(\d+)\]/g, ".$1").split(".");
  let cur: any = root;
  for (const key of parts) {
    if (key === "") continue;
    if (cur == null) return undefined;
    cur = cur[key];
  }
  return cur;
}

// ---------- Tier mapping ----------
function mapToTier(value: number, thresholds: number[]): Tier {
  const v = Math.max(0, Math.min(100, value));
  for (let i = 0; i < thresholds.length - 1; i++) {
    if (v >= thresholds[i] && v < thresholds[i + 1]) return (i + 1) as Tier;
  }
  return 6;
}

// ---------- Tiny expression evaluator ----------
class Expr {
  constructor(private schema: Schema, private contextVars: Record<string, number>) {}

  eval(str: string): number {
    const tokens = this.tokenize(this.substituteRefs(str));
    let i = 0;

    const parsePrimary = (): number => {
      const t = tokens[i++];
      if (!t) throw new Error("Unexpected end of expression");
      if (t.type === "num") return t.value!;
      if (t.type === "id") {
        if (tokens[i] && tokens[i].type === "lp") {
          i++;
          const args: number[] = [];
          if (tokens[i]?.type !== "rp") {
            while (true) {
              args.push(parseExpr());
              if (tokens[i]?.type === "comma") { i++; continue; }
              break;
            }
          }
          if (tokens[i]?.type !== "rp") throw new Error("Expected ')'");
          i++;
          return this.callFn(t.text!, args);
        }
        const v = this.contextVars[t.text!];
        if (typeof v !== "number") throw new Error(`Unknown identifier: ${t.text}`);
        return v;
      }
      if (t.type === "lp") {
        const val = parseExpr();
        if (tokens[i]?.type !== "rp") throw new Error("Expected ')'");
        i++;
        return val;
      }
      if (t.type === "minus") {
        return -parsePrimary();
      }
      throw new Error(`Unexpected token: ${t.type}`);
    };

    const parseFactor = (): number => {
      let v = parsePrimary();
      while (tokens[i] && (tokens[i].type === "mul" || tokens[i].type === "div")) {
        const op = tokens[i++].type;
        const rhs = parsePrimary();
        v = op === "mul" ? v * rhs : v / rhs;
      }
      return v;
    };

    const parseTerm = (): number => {
      let v = parseFactor();
      while (tokens[i] && (tokens[i].type === "plus" || tokens[i].type === "minus")) {
        const op = tokens[i++].type;
        const rhs = parseFactor();
        v = op === "plus" ? v + rhs : v - rhs;
      }
      return v;
    };

    const parseExpr = (): number => parseTerm();

    const out = parseExpr();
    if (i !== tokens.length) throw new Error("Trailing tokens in expression");
    return out;
  }

  private substituteRefs(str: string): string {
    return str.replace(/@[\w\.\[\]']+/g, (ref) => {
      const val = resolvePath(this.schema as any, ref);
      if (typeof val === "number") return String(val);
      if (typeof val === "string") {
        return String(this.eval(val));
      }
      throw new Error(`Unsupported reference ${ref}`);
    });
  }

  private callFn(name: string, args: number[]): number {
    switch (name) {
      case "min": return Math.min(...args);
      case "max": return Math.max(...args);
      case "clamp": return Math.max(args[1], Math.min(args[2], args[0]));
      case "linear": {
        const [x, inMin, inMax, outMin, outMax] = args;
        const t = (x - inMin) / (inMax - inMin);
        return outMin + (outMax - outMin) * Math.max(0, Math.min(1, t));
      }
      case "step": {
        throw new Error("Use stepA() via normalizeStep()");
      }
      case "stepA": {
        const count = args[1] | 0;
        const x = args[0];
        const thresholds = args.slice(2, 2 + count);
        const values = args.slice(2 + count, 2 + count + count);
        if (values.length !== thresholds.length) throw new Error("stepA mismatch");
        let idx = 0;
        while (idx < thresholds.length && x >= thresholds[idx]) idx++;
        idx = Math.max(0, Math.min(values.length - 1, idx - 1));
        return values[idx];
      }
      default:
        throw new Error(`Unknown function: ${name}`);
    }
  }

  private tokenize(s: string) {
    const tokens: {type: string; text?: string; value?: number}[] = [];
    const re = /\s+|(\d+(\.\d+)?)|([A-Za-z_][A-Za-z0-9_]*)|(\())|(\))|(\,)|(\+)|(-)|(\*)|(\/)|(\[)|(\])|(#)/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(s)) !== null) {
      if (m[0].trim() === "") { continue; }
      if (m[1]) tokens.push({ type: "num", value: parseFloat(m[1]) });
      else if (m[3]) tokens.push({ type: "id", text: m[3] });
      else if (m[4]) tokens.push({ type: "lp" });
      else if (m[5]) tokens.push({ type: "rp" });
      else if (m[6]) tokens.push({ type: "comma" });
      else if (m[7]) tokens.push({ type: "plus" });
      else if (m[8]) tokens.push({ type: "minus" });
      else if (m[9]) tokens.push({ type: "mul" });
      else if (m[10]) tokens.push({ type: "div" });
    }
    return tokens;
  }
}

// Convert "step(x, [a,b,c], [d,e,f])" into "stepA(x,3,a,b,c,d,e,f)"
function normalizeStep(expr: string): string {
  const re = /step\(\s*([^,]+)\s*,\s*\[([^\]]*)\]\s*,\s*\[([^\]]*)\]\s*\)/g;
  return expr.replace(re, (_m, x, ts, vs) => {
    const thresholds = ts.split(",").map((s: string) => s.trim()).filter(Boolean);
    const values = vs.split(",").map((s: string) => s.trim()).filter(Boolean);
    const packed = ["stepA(", x, ",", thresholds.length, ",", ...thresholds, ",", ...values, ")"].join("");
    return packed;
  });
}

function classifyArchetype(schema: Schema, eTier: Tier, fTier: Tier, sTier: Tier): string {
  const inRange = (t: number, r: [Tier,Tier]) => t >= r[0] && t <= r[1];
  for (const a of (schema as any).archetypes) {
    const { energy, focus, social } = a.conditions as any;
    if (inRange(eTier, energy) && inRange(fTier, focus) && inRange(sTier, social)) return a.name;
  }
  return "Equilibrium";
}

export function computeLumaState(schema: Schema, input: MoodInput): RuntimeOut {
  const { energy, focus, social, state = "idle", reducedMotion = false } = input;

  const th = (schema as any).mappings.tierThresholds;
  const eT = mapToTier(energy, th.energy);
  const fT = mapToTier(focus,  th.focus);
  const sT = mapToTier(social, th.social);

  const ctxVars: Record<string, number> = { energy, focus, social };
  const expr = new Expr(schema as any, ctxVars);

  const paramFormulas = (schema as any).mappings.parameters;
  const resolvedBaseParams: Record<string, number> = {};
  for (const [k, formula] of Object.entries(paramFormulas)) {
    const normalized = normalizeStep(String(formula));
    resolvedBaseParams[k] = expr.eval(normalized);
  }
  Object.assign(ctxVars, resolvedBaseParams);

  const archetype = classifyArchetype(schema as any, eT, fT, sT);
  const arch = (schema as any).archetypes.find((a: any) => a.name === archetype);
  const preset = arch?.preset ?? {};

  const st = (schema as any).states[state];
  if (!st) throw new Error(`Unknown state: ${state}`);

  const finalParams: Record<string, number | string> = {};
  if (st.params) {
    for (const [k, v] of Object.entries(st.params)) {
      if (typeof v === "number") { finalParams[k] = v; continue; }
      if (typeof v === "string") {
        const str = normalizeStep(v);
        if (str.trim().startsWith("@")) {
          const refVal = resolvePath(schema as any, str);
          finalParams[k] = typeof refVal === "number" ? refVal : String(refVal);
        } else {
          finalParams[k] = expr.eval(str);
        }
      }
    }
  }

  const hornGlowMultiplier = typeof (preset as any).hornGlowMultiplier === "number" ? (preset as any).hornGlowMultiplier : 1.0;
  if (typeof finalParams["hornGlow"] === "number") {
    finalParams["hornGlow"] = (finalParams["hornGlow"] as number) * hornGlowMultiplier;
  }

  const particles = (preset as any).particles ?? null;
  const grad = (() => {
    const ref = (preset as any).ambientGradient;
    if (typeof ref === "string" && ref.startsWith("@")) {
      const g = resolvePath(schema as any, ref);
      return [g[0], g[1]] as [string, string];
    }
    return (schema as any).color.ambientByArchetype["Equilibrium"] as [string,string];
  })();

  const composition = st.composition as string;
  const loop = !!st.loop;
  const paramsOut = { ...finalParams };

  if (reducedMotion) {
    if (particles) (particles as any).density = 0;
    if (typeof paramsOut["breathBpm"] === "number") {
      paramsOut["breathBpm"] = Math.max(20, Math.min(60, paramsOut["breathBpm"] as number));
    }
  }

  const rules = (schema as any).audioRules;
  const audio = rules?.enabled ? (() => {
    const vol = rules.volume ?? 0.3;
    let loopTrack: string | undefined;
    for (const r of rules.byEnergy) {
      if (energy >= r.min && energy <= r.max) { loopTrack = r.loop; break; }
    }
    return { loop: loopTrack, volume: vol };
  })() : undefined;

  return {
    composition,
    loop,
    params: paramsOut,
    particles: particles ?? undefined,
    ambientGradient: grad,
    hornGlowMultiplier,
    audio,
    archetype,
    state
  };
}

// Example:
// import schema from "./data/luma_animation_schema.json";
// const out = computeLumaState(schema as any, { energy: 72, focus: 40, social: 85, state: "listening" });
// console.log(out);