<script setup lang="ts">
withDefaults(
    defineProps<{
        cssColor: string
        disabled?: boolean
        currentCooldown?: number | false
    }>(),
    {
        disabled: false,
        currentCooldown: false,
    },
)
</script>
<template>
    <div :class="['segment', { disabled }]" :style="{ backgroundColor: cssColor }">
        <span v-if="typeof currentCooldown === 'number'">
            {{ currentCooldown }}
        </span>
    </div>
</template>
<style scoped lang="scss">
.segment {
    width: 100%;
    height: 200px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: opacity 0.1s;
    cursor: pointer;

    & > span {
        font-size: 4rem;
        font-family: 'digital-7', 'Courier New', Courier, monospace;
        font-weight: bold;
        opacity: 0.5;
        letter-spacing: 5px;
    }
    &.disabled {
        opacity: 0.2;
    }
}
</style>
