<script>
  import LiveFrame from "../../../lib/LiveFrame.svelte";
  const sources = [
    {
      label: "Saved copy (Nov 11)",
      src: "/snapshots/clubs.html",
      probe: "/snapshots/clubs.html",
      hint: "Only on local copies of this repo",
    },
    { label: "Live", src: "https://clubs.hackclub.com/" },
  ];
</script>

<LiveFrame {sources} title="clubs.hackclub.com" />
