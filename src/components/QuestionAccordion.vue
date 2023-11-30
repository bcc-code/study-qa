<script setup lang="ts">
import { ref, watch } from "vue";
import { Question } from "../types.ts";
defineProps<{
  index: number;
  question: Question;
}>();

const isOpen = ref(false);
const el = ref<HTMLElement | null>(null);
const height = ref(0);

// on isOpen changed
watch(isOpen, () => {
  if (!el.value) return;
  if (isOpen.value) {
    height.value = el.value?.getBoundingClientRect().height;
  } else {
    height.value = 0;
  }
});
</script>

<template>
  <div>
    <div class="relative w-full">
      <div class="absolute bottom-0 w-full">
        <div class="w-full px-4">
          <div class="h-[1px] bg-separator"></div>
        </div>
      </div>
      <div class="flex flex-col p-4">
        <div class="flex w-full cursor-pointer" @click="isOpen = !isOpen">
          <div class="flex-1 pr-1">
            {{ index + 1 }}. {{ question.question }}
          </div>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="transform transition duration-300 ease-out"
            :class="{
              'transform rotate-180': isOpen,
            }"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M5.29297 9.70712L6.70718 8.29291L12.0001 13.5858L17.293 8.29291L18.7072 9.70712L12.0001 16.4142L5.29297 9.70712Z"
              fill="#0D131A"
            />
          </svg>
        </div>
        <div
          class="relative overflow-hidden transition-[height, opacity] duration-150 ease-out"
          :style="
            isOpen
              ? { height: `${height}px`, opacity: 1 }
              : { height: 0, opacity: 0 }
          "
        >
          <div class="absolute top-0" ref="el">
            <div
              class="pt-3 flex w-full text-style-paragraph-2 whitespace-pre-line"
            >
              {{ question.answer }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div></div>
  </div>
</template>

<style scoped></style>
