<template>
  <div class="layout-configurator">
    <div class="layout-container">
      <n-tabs type="segment" animated>
        <n-tab-pane name="lower" tab="Lower Deck">
          <div class="deck-wrapper">
            <!-- Driver Area (Lower Deck Only) -->
            <div class="driver-row">
              <div class="steer-label" style="position: absolute; left: 50%; transform: translateX(-50%);">Front</div>
              <div 
                class="driver-seat" 
                :class="{ 'is-right': steering === 'right' }"
              >
                <n-icon size="24"><CircleDot /></n-icon>
                <span>Driver</span>
              </div>
            </div>

            <!-- Seats Grid Lower -->
            <div class="seats-grid" :style="gridStyle">
              <template v-for="(row, rIndex) in lowerDeckGrid" :key="`L-${rIndex}`">
                <div 
                  v-for="(cell, cIndex) in row" 
                  :key="`L-${rIndex}-${cIndex}`"
                  class="seat-cell"
                  :class="{ 
                    'is-seat': cell.type === 'seat',
                    'is-gap': cell.type === 'gap',
                    'is-female': cell.isFemale
                  }"
                  @click="handleCellClick(1, rIndex, cIndex)"
                  @contextmenu.prevent="handleRightClick(1, rIndex, cIndex)"
                >
                  <n-icon v-if="cell.type === 'seat'" size="20"><Armchair /></n-icon>
                  <span v-if="cell.type === 'seat'" class="seat-label">{{ cell.label }}</span>
                  <span v-if="cell.type === 'gap'" class="gap-label">Walkway</span>
                </div>
              </template>
            </div>
          </div>
        </n-tab-pane>
        
        <n-tab-pane v-if="hasUpperDeck" name="upper" tab="Upper Deck">
          <div class="deck-wrapper">
            <div class="driver-row" style="visibility: hidden;">
              <div class="driver-seat"><n-icon size="24"><CircleDot /></n-icon></div>
            </div>

            <!-- Seats Grid Upper -->
            <div class="seats-grid" :style="gridStyle">
              <template v-for="(row, rIndex) in upperDeckGrid" :key="`U-${rIndex}`">
                <div 
                  v-for="(cell, cIndex) in row" 
                  :key="`U-${rIndex}-${cIndex}`"
                  class="seat-cell"
                  :class="{ 
                    'is-seat': cell.type === 'seat',
                    'is-gap': cell.type === 'gap',
                    'is-female': cell.isFemale
                  }"
                  @click="handleCellClick(2, rIndex, cIndex)"
                  @contextmenu.prevent="handleRightClick(2, rIndex, cIndex)"
                >
                  <n-icon v-if="cell.type === 'seat'" size="20"><Armchair /></n-icon>
                  <span v-if="cell.type === 'seat'" class="seat-label">{{ cell.label }}</span>
                  <span v-if="cell.type === 'gap'" class="gap-label">Walkway</span>
                </div>
              </template>
            </div>
          </div>
        </n-tab-pane>
      </n-tabs>

      <div class="legend">
        <div class="legend-item">
          <div class="sample-seat is-seat"><n-icon size="16"><Armchair /></n-icon></div>
          <span>Seat</span>
        </div>
        <div class="legend-item">
          <div class="sample-seat is-gap"></div>
          <span>Walkway (Click to toggle)</span>
        </div>
        <div class="legend-item">
          <div class="sample-seat is-seat is-female"><n-icon size="16"><Armchair /></n-icon></div>
          <span>Ladies (Right click)</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { Armchair, CircleDot } from 'lucide-vue-next';
import type { SeatList } from '@/types/buses/busLayout';

// Input Props
interface Props {
  rows: number;
  columns: number;
  steering: string;
  hasUpperDeck: boolean;
  initialSeats?: SeatList[];
}

const props = withDefaults(defineProps<Props>(), {
  initialSeats: () => []
});

const emit = defineEmits<{
  (e: 'update:maxSeats', count: number): void;
}>();


// Data Structures
type CellType = 'seat' | 'gap';
interface GridCell {
  type: CellType;
  label?: string;
  isFemale: boolean;
}

const lowerDeckGrid = ref<GridCell[][]>([]);
const upperDeckGrid = ref<GridCell[][]>([]);

// Styles
const gridStyle = computed(() => ({
  display: 'grid',
  gridTemplateColumns: `repeat(${props.columns}, 1fr)`,
  gap: '8px',
  width: '100%',
  maxWidth: `${props.columns * 60}px`,
  margin: '0 auto'
}));

// --- Logic ---

const createEmptyGrid = (rows: number, cols: number, makeAisle = false): GridCell[][] => {
  const newGrid: GridCell[][] = [];
  const aisleCol = Math.floor(cols / 2);

  for (let i = 0; i < rows; i++) {
    const row: GridCell[] = [];
    for (let j = 0; j < cols; j++) {
        let type: CellType = 'seat';
        // Simple default logic: aisle in middle if cols >= 4
        if (makeAisle && cols >= 4 && j === aisleCol) {
             // Leave last row as seats (back bench)
             // Unless it's just initialized, usually user wants full aisle
             if (i < rows - 1) {
                 type = 'gap';
             }
        }
        row.push({ type, isFemale: false, label: '' });
    }
    newGrid.push(row);
  }
  return newGrid;
};

const handleGridResize = () => {
  const newRows = props.rows;
  const newCols = props.columns;
  
  const resizeValues = (currentGrid: GridCell[][]) => {
      const currentRows = currentGrid.length;
      if (currentRows === 0) return createEmptyGrid(newRows, newCols, true);
      
      const currentCols = currentGrid[0]?.length || 0;
      const newGrid: GridCell[][] = [];

      for (let i = 0; i < newRows; i++) {
        const row: GridCell[] = [];
        for (let j = 0; j < newCols; j++) {
            if (i < currentRows && j < currentCols) {
                row.push({ ...currentGrid[i][j] });
            } else {
                row.push({ type: 'seat', isFemale: false, label: '' });
            }
        }
        newGrid.push(row);
      }
      return newGrid;
  };

  lowerDeckGrid.value = resizeValues(lowerDeckGrid.value);
  if (props.hasUpperDeck) {
      upperDeckGrid.value = resizeValues(upperDeckGrid.value);
  }
  recalculateLabels();
};

const handleCellClick = (deck: number, r: number, c: number) => {
  const grid = deck === 1 ? lowerDeckGrid.value : upperDeckGrid.value;
  const cell = grid[r][c];
  
  cell.type = cell.type === 'seat' ? 'gap' : 'seat';
  if (cell.type === 'gap') {
      cell.isFemale = false;
  }
  recalculateLabels();
};

const handleRightClick = (deck: number, r: number, c: number) => {
    const grid = deck === 1 ? lowerDeckGrid.value : upperDeckGrid.value;
    const cell = grid[r][c];
    if (cell.type === 'seat') {
        cell.isFemale = !cell.isFemale;
    }
};

const recalculateLabels = () => {
    let count = 1;
    
    // Lower
    lowerDeckGrid.value.forEach(row => {
        row.forEach(cell => {
             if (cell.type === 'seat') {
                 if (props.hasUpperDeck) {
                     cell.label = `L${count}`;
                 } else {
                     cell.label = count.toString();
                 }
                 count++;
             } else {
                 cell.label = '';
             }
        });
    });

    let lowerMax = count - 1;
    let upperMax = 0;

    // Upper
    if (props.hasUpperDeck) {
        let upperCount = 1;
        upperDeckGrid.value.forEach(row => {
            row.forEach(cell => {
                if (cell.type === 'seat') {
                    cell.label = `U${upperCount}`;
                    upperCount++;
                } else {
                    cell.label = '';
                }
            });
        });
        upperMax = upperCount - 1;
    }
    
    emit('update:maxSeats', lowerMax + upperMax);
};

// --- Initialization & Watchers ---

watch(() => [props.rows, props.columns], () => {
    handleGridResize();
});

watch(() => props.hasUpperDeck, (newVal) => {
    if (newVal) {
        if (upperDeckGrid.value.length === 0) {
             upperDeckGrid.value = createEmptyGrid(props.rows, props.columns, true);
        }
    } else {
        upperDeckGrid.value = [];
    }
    recalculateLabels();
});

const initialize = () => {

    // Always start with fresh empty grids of the correct dimension
    lowerDeckGrid.value = createEmptyGrid(props.rows, props.columns, true);
    if (props.hasUpperDeck) {
        upperDeckGrid.value = createEmptyGrid(props.rows, props.columns, true);
    } else {
        upperDeckGrid.value = [];
    }

    if (props.initialSeats && props.initialSeats.length > 0) {
        props.initialSeats.forEach(seat => {
            // Check if seat has valid coordinates
            if (seat.row && seat.col) {
                const rIndex = seat.row - 1;
                const cIndex = seat.col - 1;
                const deckGrid = seat.deck === 2 ? upperDeckGrid.value : lowerDeckGrid.value;

                // Safety check boundary
                if (deckGrid[rIndex] && deckGrid[rIndex][cIndex]) {
                    deckGrid[rIndex][cIndex] = {
                        type: seat.isSeat ? 'seat' : 'gap',
                        isFemale: seat.isFemale,
                        label: seat.name
                    };
                }
            }
        });
    }
    
    recalculateLabels();
};

onMounted(() => {
    initialize();
});


// --- Expose Data for Parent ---

const getLayoutData = () => {
    const seatLists: any[] = [];
    let idCounter = 1;

    // Helper
    const processGrid = (currentGrid: GridCell[][], deckId: number, prefix: string) => {
         for (let i = 0; i < currentGrid.length; i++) {
            for (let j = 0; j < currentGrid[i].length; j++) {
                const cell = currentGrid[i][j];
                seatLists.push({
                    id: idCounter++,
                    name: cell.label || `${prefix}-GAP-${i}-${j}`,
                    isFemale: cell.isFemale,
                    isSeat: cell.type === 'seat',
                    isGap: cell.type === 'gap',
                    deck: deckId,
                    row: i + 1,
                    col: j + 1
                });
            }
        }
    };

    processGrid(lowerDeckGrid.value, 1, 'L');
    if (props.hasUpperDeck) {
        processGrid(upperDeckGrid.value, 2, 'U');
    }

    return {
        seatLists
    };
};

defineExpose({
    getLayoutData
});

</script>

<style scoped>
.layout-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  background: #f9f9f9;
  padding: 24px;
  border-radius: 12px;
  align-items: center;
}

.deck-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 16px;
    background: #fff;
    border-radius: 8px;
    border: 1px solid #eee;
}

.driver-row {
  display: flex;
  position: relative;
  width: 100%;
  padding-bottom: 16px;
  border-bottom: 2px dashed #ddd;
  margin-bottom: 16px;
  align-items: center;
}
.steer-label {
    font-weight: bold;
    color: #999;
}

.driver-seat {
    width: 60px;
    height: 60px;
    background: #e0e0e0;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    color: #555;
    transition: all 0.3s;
}
.driver-seat.is-right {
    margin-left: auto;
}

.seat-cell {
  aspect-ratio: 1;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.2s;
  background: #fff;
  user-select: none;
}

.seat-cell.is-seat {
    background: #e6f7ff;
    border-color: #1890ff;
    color: #1890ff;
}
.seat-cell.is-seat:hover {
    background: #bae7ff;
}

.seat-cell.is-female {
    background: #fff0f6;
    border-color: #eb2f96;
    color: #eb2f96;
}

.seat-cell.is-gap {
    background: transparent;
    border: 1px dashed #ccc;
}

.seat-label {
    font-weight: bold;
    font-size: 12px;
}
.gap-label {
    font-size: 10px;
    color: #ccc;
}

.legend {
    display: flex;
    gap: 16px;
    margin-top: 16px;
    justify-content: center;
}
.legend-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
}
.sample-seat {
    width: 24px;
    height: 24px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
}
.sample-seat.is-seat {
    background: #e6f7ff;
    border: 1px solid #1890ff;
    color: #1890ff;
}
.sample-seat.is-gap {
    border: 1px dashed #ccc;
}
.sample-seat.is-female {
    background: #fff0f6;
    border: 1px solid #eb2f96;
    color: #eb2f96;
}
</style>
