import messages from "../data/messages.json";

export function useT(ns) {
  return (key, params = {}) => {
    let s = messages[ns]?.[key] ?? key;
    for (const [k, v] of Object.entries(params)) s = s.replace(`{${k}}`, v);
    return s;
  };
}
