<template>
  <div class="booking-viewer">
    <!-- Deck Switcher for Double Decker -->
    <div v-if="hasUpperDeck" class="deck-tabs">
        <div 
            class="deck-tab" 
            :class="{ active: currentDeck === 1 }"
            @click="currentDeck = 1"
        >
            Lower Deck
        </div>
        <div 
            class="deck-tab" 
            :class="{ active: currentDeck === 2 }"
            @click="currentDeck = 2"
        >
            Upper Deck
        </div>
    </div>

    <!-- The Grid Container -->
    <div class="bus-container">
        <!-- Driver -->
        <div class="driver-zone" :class="{ 'is-right': steering === 'right' }">
             <n-icon size="24" color="#666"><CircleDot /></n-icon>
             <span class="driver-text">Driver</span>
        </div>

        <!-- Seat Grid -->
        <div class="seats-layer" :style="gridStyle">
            <div 
                v-for="item in currentDeckSeats" 
                :key="item.id"
                class="grid-item"
                :class="{
                    'type-seat': item.isSeat,
                    'type-gap': item.isGap,
                    'is-female': item.isFemale,
                    'is-selected': selectedSeats.includes(item.id)
                }"
                :style="{
                    gridRow: item.row,
                    gridColumn: item.col
                }"
                @click="handleSeatClick(item)"
            >
                <!-- Seat Icon -->
                <template v-if="item.isSeat">
                    <n-icon size="20"><Armchair /></n-icon>
                    <span class="seat-num">{{ item.name }}</span>
                </template>
            </div>
        </div>
    </div>

    <!-- Booking Summary (Demo) -->
    <div class="booking-summary">
        <div class="legend">
            <span class="dot available"></span> Available
            <span class="dot female"></span> Ladies
            <span class="dot selected"></span> Selected
        </div>
        <div v-if="selectedSeats.length > 0" class="selected-info">
            Selected: {{ selectedSeatNames }}
        </div>
        <div v-else class="selected-text">
            Select a seat to proceed
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Armchair, CircleDot } from 'lucide-vue-next';
import type { SeatList } from '@/types/buses/busLayout';

interface Props {
  seatLists: SeatList[];
  steering?: string;
}

const props = withDefaults(defineProps<Props>(), {
  seatLists: () => [],
  steering: 'right'
});

const currentDeck = ref(1);
const selectedSeats = ref<number[]>([]);

// Computed
const hasUpperDeck = computed(() => {
    return props.seatLists.some(s => s.deck === 2);
});

const currentDeckSeats = computed(() => {
    return props.seatLists.filter(s => {
        const deck = s.deck || 1; // Default to 1 if missing
        return deck === currentDeck.value;
    });
});

const gridDimensions = computed(() => {
    // calculate max rows/cols dynamically from data
    let maxR = 0;
    let maxC = 0;
    currentDeckSeats.value.forEach(s => {
        if ((s.row || 0) > maxR) maxR = s.row || 0;
        if ((s.col || 0) > maxC) maxC = s.col || 0;
    });
    return { rows: maxR, cols: maxC };
});

const gridStyle = computed(() => ({
    display: 'grid',
    // maintain aspect ratio of cells
    gridTemplateColumns: `repeat(${gridDimensions.value.cols}, 1fr)`,
    gridTemplateRows: `repeat(${gridDimensions.value.rows}, 1fr)`,
    gap: '8px',
    maxWidth: `${gridDimensions.value.cols * 50}px`,
    margin: '0 auto'
}));

const selectedSeatNames = computed(() => {
    return props.seatLists
        .filter(s => selectedSeats.value.includes(s.id))
        .map(s => s.name)
        .join(', ');
});

// Methods
const handleSeatClick = (seat: SeatList) => {
    if (!seat.isSeat) return;
    
    // Toggle selection
    const idx = selectedSeats.value.indexOf(seat.id);
    if (idx === -1) {
        selectedSeats.value.push(seat.id);
    } else {
        selectedSeats.value.splice(idx, 1);
    }
};

</script>

<style scoped>
.booking-viewer {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    padding: 16px;
    background: #f5f7fa;
    border-radius: 12px;
}

.deck-tabs {
    display: flex;
    background: #e2e8f0;
    padding: 4px;
    border-radius: 8px;
    gap: 4px;
}
.deck-tab {
    padding: 6px 16px;
    font-size: 13px;
    font-weight: 500;
    border-radius: 6px;
    cursor: pointer;
    color: #64748b;
    transition: all 0.2s;
}
.deck-tab.active {
    background: #fff;
    color: #0f172a;
    box-shadow: 0 1px 2px rgba(0,0,0,0.1);
}

.bus-container {
    background: #fff;
    padding: 20px;
    border-radius: 16px; /* Rounded bus shape */
    border: 1px solid #e2e8f0;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.driver-zone {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    padding-bottom: 20px;
    border-bottom: 1px dashed #cbd5e1;
    margin-bottom: 20px;
    align-items: center;
    gap: 8px;
    padding-left: 80px;
    padding-right: 80px;
    box-sizing: border-box;
}
.driver-zone.is-right {
    flex-direction: row-reverse;
}
.driver-text {
    font-size: 10px;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-weight: 700;
}

.seats-layer {
    width: 100%;
}

.grid-item {
    aspect-ratio: 1;
    border-radius: 6px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
}

.type-seat {
    background: #f1f5f9;
    color: #64748b;
    border: 1px solid #cbd5e1;
    cursor: pointer;
}
.type-seat:hover {
    background: #e2e8f0;
}

.type-seat.is-female {
    background: #fff1f2;
    color: #e11d48;
    border-color: #fecdd3;
}

.type-seat.is-selected {
    background: #10b981; /* Green for selected */
    color: #fff;
    border-color: #059669;
}

.type-gap {
    /* Invisible or styled gap */
}

.seat-num {
    font-size: 10px;
    font-weight: 700;
    margin-top: -2px;
}

.booking-summary {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    font-size: 12px;
}

.legend {
    display: flex;
    gap: 12px;
    margin-bottom: 4px;
}
.dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    display: inline-block;
    margin-right: 4px;
}
.dot.available { background: #cbd5e1; }
.dot.female { background: #e11d48; }
.dot.selected { background: #10b981; }

.selected-info {
    font-weight: 600;
    color: #0f172a;
}
.selected-text {
    color: #94a3b8;
}
</style>
