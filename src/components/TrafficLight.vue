<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import LightSection from './LightSection.vue'

type LightProgram = [
    name: string,
    durationSec: number,
    options?: {
        blinkTime?: number
    },
]

const program: LightProgram[] = [
    ['red', 10],
    ['yellow', 3],
    [
        'green',
        15,
        {
            blinkTime: 3,
        },
    ],
    ['yellow', 3],
]

interface SignalGlobalOptions {
    cssColorOverride?: string
    hideCooldown?: boolean
}
const allSignals: {
    [signal: string]: SignalGlobalOptions
} = {
    red: {},
    yellow: {
        // not in spec
        // hideCooldown: true
    },
    green: {
        cssColorOverride: 'lime',
    },
}

const route = useRoute()
const router = useRouter()
const TRAFFIC_LIGHT_MEMORY_KEY = 'trafficLightMemory'

const trafficLightState = reactive({
    // set immediately
    signalIndex: 0,
    currentCooldown: 0,
})
let forceDisableLight = ref(false)

const lightProgram = computed(() => program[trafficLightState.signalIndex])

let internalParamChange = false
watch(
    () => route.params,
    (_newState, oldValue) => {
        // avoid reseting currentCooldown on initialUpdate
        if (internalParamChange) {
            internalParamChange = false
            return
        }
        const initialUpdate = oldValue === undefined
        if (initialUpdate) {
            const rawValue = localStorage.getItem(TRAFFIC_LIGHT_MEMORY_KEY)
            if (rawValue) {
                const memoryState = JSON.parse(rawValue) as typeof trafficLightState
                // in case if url is set, ensure it is the same as we have in memory atm
                if (!route.params.light || route.params.light === program[memoryState.signalIndex]![0]) {
                    changeLight(memoryState.signalIndex)
                    trafficLightState.currentCooldown = memoryState.currentCooldown
                    return
                }
            }
        }

        changeLight(route.params.light ? program.findIndex(([light]) => light === route.params.light) : 0)
    },
    {
        immediate: true,
    },
)
// watching for light blinking
watch(
    () => trafficLightState.currentCooldown,
    currentCooldown => {
        const { blinkTime } = lightProgram.value?.[2] ?? {}
        if (blinkTime && currentCooldown <= blinkTime && currentCooldown !== 0) {
            forceDisableLight.value = true
            setTimeout(() => {
                forceDisableLight.value = false
            }, 500)
        }
    },
)
// save the state to memory
watch(trafficLightState, () => {
    localStorage.setItem(TRAFFIC_LIGHT_MEMORY_KEY, JSON.stringify(trafficLightState))
})
onMounted(() => {
    // automatic light control
    setInterval(() => {
        if (--trafficLightState.currentCooldown === 0) {
            // looping it
            changeLight(trafficLightState.signalIndex === program.length - 1 ? 0 : trafficLightState.signalIndex + 1)
        }
    }, 1000)
})

function changeLight(signalIndex: number) {
    if (signalIndex === -1) signalIndex = 0
    internalParamChange = true
    const [light, durationSec] = program[signalIndex]!
    router.push(`/${light}`)
    trafficLightState.signalIndex = signalIndex
    trafficLightState.currentCooldown = durationSec
}
</script>

<template>
    <div class="body">
        <LightSection
            v-for="(light, signalIndex) in Object.keys(allSignals)"
            :key="light"
            :disabled="forceDisableLight || light !== program[trafficLightState.signalIndex]![0]"
            :css-color="allSignals[light]?.cssColorOverride ?? light"
            :current-cooldown="light === program[trafficLightState.signalIndex]![0] && !allSignals[light]?.hideCooldown && trafficLightState.currentCooldown"
            class="segment"
            role="button"
            @click="changeLight(signalIndex)"
        >
        </LightSection>
    </div>
</template>

<style scoped lang="scss">
.body {
    width: 200px;
    display: flex;
    flex-direction: column;
    background: rgb(46, 46, 46);
    padding: 15px;
    user-select: none;
    border-radius: 15px;
}
.segment:not(:last-child) {
    margin-bottom: 20px;
}
</style>
