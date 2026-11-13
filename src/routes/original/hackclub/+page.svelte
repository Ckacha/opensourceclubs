<script>
  import LiveFrame from "../../../lib/LiveFrame.svelte";
  const sources = [
    {
      label: "Local copy (hackclub/site)",
      src: "http://localhost:3000/",
      probe: "http://localhost:3000/",
      hint: "Start it: cd originals/site && bun install && bun dev",
    },
    { label: "Live", src: "https://hackclub.com/" },
  ];
</script>

<LiveFrame {sources} title="hackclub.com" />
