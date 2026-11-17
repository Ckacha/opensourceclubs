// Decides where each link in the hackclub.com demo goes.
// The demo is only an example of the home page + clubs page, so only two links work:
//   "/"      -> the demo home page   (/mock/hackclub)
//   "/clubs" -> the demo clubs page  (/mock/hackclub/clubs)
// Everything else (other pages, hackclub.com, Slack, forms, socials) returns undefined.
// An <a> with no href is not a link, so clicking it does nothing.
export function href(path) {
  if (path === "/") return "/mock/hackclub";
  if (path === "/clubs" || path === "/clubs/") return "/mock/hackclub/clubs";
  return undefined;
}
