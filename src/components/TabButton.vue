<script setup lang="ts">
defineProps<{
  active?: boolean;
}>();
</script>

<template>
  <div
    class="button transition-all duration-150 ease-out cursor-pointer"
    :class="{
      'bg-white border border-separator  shadow-none  text-label-1': !active,
    }"
  >
    <slot></slot>
  </div>
</template>
