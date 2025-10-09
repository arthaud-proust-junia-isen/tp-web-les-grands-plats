<template>
  <div
    class="relative px-2 py-1 rounded-md flex gap-1 items-center"
    :class="{
      'bg-blue-200 text-blue-900': type === 'ingredient',
      'bg-red-200 text-red-900': type === 'appliance',
      'bg-green-200 text-green-900': type === 'ustensil',
    }"
  >
    <span>{{ name }} </span>
    <button
      type="button"
      class="after:absolute after:inset-0 cursor-pointer"
      :aria-label="`Retirer ${name}`"
    >
      <XMarkIcon class="size-5" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/24/outline'

defineProps<{
  name: string
  type: 'ingredient' | 'ustensil' | 'appliance'
}>()
</script>
