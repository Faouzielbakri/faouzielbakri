/**
 * The small brain behind the heroes that look back (Look, Watcher).
 *
 * It decides where the eyes point and what mood they are in. With a moving
 * cursor it simply follows. Left alone it gets bored, looks at the edges of
 * the screen, eyes the button, rolls its eyes, acts shifty, and finally nods
 * off. Poked repeatedly it gets annoyed; shaken, it gets dizzy; woken, it is
 * startled and denies everything. Each hero maps the moods to its own face and
 * the events to its own lines.
 */

export type Mood =
  | "calm"
  | "bored"
  | "sleepy"
  | "asleep"
  | "startled"
  | "dizzy"
  | "annoyed"
  | "sad";

export type BrainEvent =
  | "edge"
  | "target"
  | "roll"
  | "shifty"
  | "sleepy"
  | "asleep"
  | "wake"
  | "dizzy"
  | "annoyed1"
  | "annoyed2"
  | "annoyed3"
  | "gone"
  | "ignored"
  | "resume";

export type Gaze = {
  /** Where to look, in client coordinates. */
  x: number;
  y: number;
  mood: Mood;
  /** Set while the eyes should orbit instead of aiming (dizzy, eye-roll). */
  spin: number | null;
};

type Point = { x: number; y: number };
type Act = { kind: "edge" | "target" | "roll" | "shifty" | "sleepy" | "asleep"; until: number; at: Point };

const IGNORED_AFTER = 2800;
const ACTS_AFTER = 5200;

export function createBrain(emit: (event: BrainEvent) => void, targets: () => Point[]) {
  const mouse = { x: 0, y: 0, inside: false, movedAt: 0, leftAt: 0 };
  let act: Act | null = null;
  let actsDone = 0;
  let lastKind = "";
  let lastMood: Mood = "calm";
  let saidIgnored = false;
  let dizzyUntil = 0;
  let annoyedUntil = 0;
  let startledUntil = 0;
  let rage = 0;
  let pokes: number[] = [];
  let flips: number[] = [];
  let lastDir = 0;
  let lastX = 0;

  const nextAct = (now: number, cx: number, cy: number): Act => {
    const W = window.innerWidth;
    const H = window.innerHeight;
    actsDone += 1;
    if (lastKind === "asleep") {
      // Nobody came. It wakes by itself and starts the round again.
      actsDone = 1;
      startledUntil = now + 900;
      emit("wake");
    } else if (actsDone > 6) {
      const kind = lastKind === "sleepy" ? "asleep" : "sleepy";
      lastKind = kind;
      emit(kind);
      return { kind, until: now + (kind === "sleepy" ? 2600 : 9000), at: { x: cx, y: cy + 400 } };
    }
    const kinds = (["edge", "target", "edge", "roll", "shifty"] as const).filter((k) => k !== lastKind);
    const kind = kinds[Math.floor(Math.random() * kinds.length)];
    lastKind = kind;
    emit(kind);
    let at = { x: cx, y: cy };
    if (kind === "edge") {
      const spots = [
        { x: 0, y: 0 },
        { x: W, y: 0 },
        { x: 0, y: H },
        { x: W, y: H },
        { x: W / 2, y: 0 },
        { x: 0, y: H / 2 },
        { x: W, y: H / 2 },
      ];
      at = spots[Math.floor(Math.random() * spots.length)];
    } else if (kind === "target") {
      const list = targets();
      if (list.length) at = list[Math.floor(Math.random() * list.length)];
    }
    return { kind, until: now + 1700 + Math.random() * 1900, at };
  };

  return {
    move(x: number, y: number, t: number) {
      const wasAway = !mouse.inside;
      mouse.x = x;
      mouse.y = y;
      mouse.inside = true;
      mouse.movedAt = t;
      if (act && (act.kind === "asleep" || act.kind === "sleepy")) {
        startledUntil = t + 1100;
        emit("wake");
      }
      if (act || wasAway) {
        act = null;
        actsDone = 0;
        lastKind = "";
      }
      saidIgnored = false;
      // Shaking: many fast left-right reversals in a short window.
      const dx = x - lastX;
      lastX = x;
      if (Math.abs(dx) > 14) {
        const dir = Math.sign(dx);
        if (dir !== lastDir) {
          lastDir = dir;
          flips = flips.filter((f) => t - f < 900);
          flips.push(t);
          if (flips.length >= 6 && t > dizzyUntil) {
            dizzyUntil = t + 2200;
            flips = [];
            emit("dizzy");
          }
        }
      }
    },

    leave(t: number) {
      mouse.inside = false;
      mouse.leftAt = t;
      emit("gone");
    },

    /** Returns true when this poke tipped it into being annoyed. */
    poke(t: number) {
      mouse.movedAt = t;
      if (act && (act.kind === "asleep" || act.kind === "sleepy")) {
        act = null;
        actsDone = 0;
        lastKind = "";
        startledUntil = t + 1100;
        emit("wake");
        return true;
      }
      pokes = pokes.filter((p) => t - p < 3000);
      pokes.push(t);
      if (pokes.length < 3) return false;
      pokes = [];
      rage = Math.min(3, rage + 1);
      annoyedUntil = t + 2600;
      emit(`annoyed${rage}` as BrainEvent);
      if (rage === 3) rage = 0;
      return true;
    },

    update(now: number, cx: number, cy: number): Gaze {
      let gaze: Gaze;
      const idleFor = now - mouse.movedAt;
      if (now < dizzyUntil) {
        gaze = { x: cx, y: cy, mood: "dizzy", spin: now / 70 };
      } else if (now < annoyedUntil) {
        gaze = { x: mouse.x, y: mouse.y, mood: "annoyed", spin: null };
      } else if (now < startledUntil) {
        gaze = { x: mouse.x, y: mouse.y, mood: "startled", spin: null };
      } else if (mouse.inside && idleFor < IGNORED_AFTER) {
        gaze = { x: mouse.x, y: mouse.y, mood: "calm", spin: null };
      } else if (mouse.inside && idleFor < ACTS_AFTER) {
        if (!saidIgnored) {
          saidIgnored = true;
          emit("ignored");
        }
        gaze = { x: mouse.x, y: mouse.y, mood: "bored", spin: null };
      } else if (!mouse.inside && mouse.leftAt && now - mouse.leftAt < 2400) {
        // Stares at the spot where the cursor left the window.
        gaze = { x: mouse.x, y: mouse.y, mood: "sad", spin: null };
      } else {
        if (!act || now > act.until) act = nextAct(now, cx, cy);
        if (act.kind === "roll") gaze = { x: cx, y: cy, mood: "bored", spin: now / 300 };
        else if (act.kind === "shifty")
          gaze = { x: cx + (Math.sin(now / 190) > 0 ? 500 : -500), y: cy + 30, mood: "calm", spin: null };
        else if (act.kind === "sleepy") gaze = { x: cx, y: cy + 400, mood: "sleepy", spin: null };
        else if (act.kind === "asleep") gaze = { x: cx, y: cy + 400, mood: "asleep", spin: null };
        else gaze = { x: act.at.x, y: act.at.y, mood: "calm", spin: null };
      }
      const settled = gaze.mood === "calm" && !act;
      if (settled && lastMood !== "calm") emit("resume");
      lastMood = settled ? "calm" : gaze.mood === "calm" ? "bored" : gaze.mood;
      return gaze;
    },
  };
}
