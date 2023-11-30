<script setup lang="ts">
defineProps<{
  active?: boolean;
}>();
</script>

<template>
  <div
    class="button transition-all border border-[rgba(0,0,0,0)] duration-100 ease-out cursor-pointer"
    :class="{
      'bg-background-1 border border-separator  shadow-none text-label-1':
        !active,
    }"
  >
    <slot></slot>
  </div>
</template>
