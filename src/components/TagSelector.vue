<template>
  <div class="w-72">
    <Combobox v-model="selected" multiple>
      <div class="relative mt-1">
        <div
          class="relative w-full cursor-default overflow-hidden rounded-lg text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300"
          :class="[clx.bg, clx.text]"
        >
          <ComboboxInput
            class="w-full border-none py-2 pl-3 pr-10 text-base leading-5 focus:ring-0 focus:outline-none"
            :class="[clx.bg, clx.text]"
            :placeholder="placeholder"
            @change="query = $event.target.value"
          />
          <ComboboxButton class="absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon class="h-5 w-5" :class="[clx.text]" aria-hidden="true" />
          </ComboboxButton>
        </div>
        <TransitionRoot
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          @after-leave="query = ''"
        >
          <ComboboxOptions
            class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none"
            :class="[clx.bg, clx.text]"
          >
            <div
              v-if="filteredOptions.length === 0 && query !== ''"
              class="relative cursor-default select-none px-4 py-2"
            >
              Aucun résultat.
            </div>

            <ComboboxOption
              v-for="option in filteredOptions"
              as="template"
              :key="option"
              :value="option"
              v-slot="{ active }"
            >
              <li
                class="relative cursor-default select-none py-2 px-4"
                :class="{
                  'bg-neutral-900/5': active,
                }"
              >
                <span class="block truncate">
                  {{ option }}
                </span>
              </li>
            </ComboboxOption>
          </ComboboxOptions>
        </TransitionRoot>
      </div>
    </Combobox>
  </div>
</template>

<script setup lang="ts">
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  TransitionRoot,
} from '@headlessui/vue'
import { ChevronUpDownIcon } from '@heroicons/vue/20/solid'
import { computed, ref } from 'vue'

const props = defineProps<{
  options: Array<string>
  placeholder?: string
  type: 'ingredient' | 'ustensil' | 'appliance'
}>()

const selected = defineModel<Array<string>>({
  required: true,
})

const query = ref('')

const filteredOptions = computed(() =>
  query.value === ''
    ? props.options
    : props.options.filter((option) =>
        option
          .toLowerCase()
          .replace(/\s+/g, '')
          .includes(query.value.toLowerCase().replace(/\s+/g, '')),
      ),
)

const clx = computed(
  () =>
    ({
      ingredient: { bg: 'bg-blue-200', text: 'text-blue-900' },
      appliance: { bg: 'bg-red-200', text: ' text-red-900' },
      ustensil: { bg: 'bg-green-200', text: ' text-green-900' },
    })[props.type],
)
</script>
