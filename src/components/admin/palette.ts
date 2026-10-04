/**
 * The dashboard's data colours, fixed per entity: visitors are always orange,
 * page views always blue, and each device keeps its own. The three hues were
 * checked for colour-blind separation on a white surface. This lives in a plain
 * module because server components read it too, and values exported from a
 * "use client" file are not available on the server.
 */
export const SERIES = { orange: "#e8590c", blue: "#1971c2", green: "#0fa37a" } as const;

export const DEVICE_COLORS: Record<string, string> = {
  desktop: SERIES.orange,
  mobile: SERIES.blue,
  tablet: SERIES.green,
};

export const OTHER_COLOR = "#8a857c";
