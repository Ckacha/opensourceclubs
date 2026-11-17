<script>
  let { wrap = true } = $props();
</script>

{#if wrap}
  <span class="btn-arrow">{@render svg()}</span>
{:else}
  {@render svg()}
{/if}

{#snippet svg()}
  <svg
    aria-hidden="true"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style="display: block; flex-shrink: 0"
  >
    <path
      d="M3 8H13M13 8L8.5 3.5M13 8L8.5 12.5"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
{/snippet}
