<template>
  <span class="inline-flex text-sm bg-neutral-100 rounded-md px-2 py-0.5 items-center gap-0.5">
    <ClockIcon class="size-5" />
    <span>{{ time }} minute{{ time > 1 ? 's' : '' }}</span>
  </span>
</template>
<script setup lang="ts">
import { ClockIcon } from '@heroicons/vue/24/outline'

defineProps<{
  time: number
}>()
</script>
