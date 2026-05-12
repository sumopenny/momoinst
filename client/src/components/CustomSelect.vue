<template>
  <div class="custom-select" ref="selectRef" :class="{ 'is-open': isOpen, 'is-disabled': disabled, 'dropup': shouldDropUp }">
    <div
      class="select-trigger"
      @click="toggleDropdown"
      @keydown="handleKeydown"
      tabindex="0"
      role="combobox"
      :aria-expanded="isOpen"
      :aria-haspopup="'listbox'"
    >
      <div class="select-value">
        <span v-if="selectedOption" class="selected-label">{{ selectedOption.label }}</span>
        <span v-else class="placeholder">{{ placeholder }}</span>
      </div>
      <div class="select-arrow" :class="{ rotated: isOpen }">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </div>
    </div>

    <Teleport to="body">
      <Transition name="dropdown">
        <div
          v-if="isOpen"
          class="select-dropdown"
          :style="dropdownStyle"
          role="listbox"
        >
          <div class="dropdown-scroll">
            <div
              v-for="(option, index) in options"
              :key="option.value"
              class="dropdown-option"
              :class="{
                'is-selected': option.value === modelValue,
                'is-highlighted': highlightedIndex === index
              }"
              @click.stop="selectOption(option)"
              @mouseenter="highlightedIndex = index"
              role="option"
              :aria-selected="option.value === modelValue"
            >
              <div class="option-content">
                <div class="option-main">
                  <span class="option-label">{{ option.label }}</span>
                  <span v-if="option.badge" class="option-badge">{{ option.badge }}</span>
                </div>
                <p v-if="option.description" class="option-description">{{ option.description }}</p>
              </div>
              <div v-if="option.value === modelValue" class="option-check">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  options: {
    type: Array,
    default: () => []
  },
  placeholder: {
    type: String,
    default: '请选择'
  },
  disabled: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'change']);

const selectRef = ref(null);
const isOpen = ref(false);
const highlightedIndex = ref(-1);
const shouldDropUp = ref(false);
const dropdownStyle = ref({});

const selectedOption = computed(() => {
  return props.options.find(opt => opt.value === props.modelValue);
});

const calculateDropdownPosition = async () => {
  await nextTick();
  
  if (!selectRef.value) return;
  
  const triggerRect = selectRef.value.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  const dropdownHeight = Math.min(320, props.options.length * 60 + 16);
  const spaceBelow = viewportHeight - triggerRect.bottom - 8;
  const spaceAbove = triggerRect.top - 8;
  
  shouldDropUp.value = spaceBelow < dropdownHeight && spaceAbove > spaceBelow;
  
  if (shouldDropUp.value) {
    dropdownStyle.value = {
      position: 'fixed',
      bottom: `${viewportHeight - triggerRect.top + 8}px`,
      left: `${triggerRect.left}px`,
      width: `${triggerRect.width}px`
    };
  } else {
    dropdownStyle.value = {
      position: 'fixed',
      top: `${triggerRect.bottom + 8}px`,
      left: `${triggerRect.left}px`,
      width: `${triggerRect.width}px`
    };
  }
};

const toggleDropdown = async () => {
  if (props.disabled) return;
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    const selectedIndex = props.options.findIndex(opt => opt.value === props.modelValue);
    highlightedIndex.value = selectedIndex >= 0 ? selectedIndex : 0;
    await calculateDropdownPosition();
  }
};

const selectOption = (option) => {
  emit('update:modelValue', option.value);
  emit('change', option.value);
  isOpen.value = false;
};

const handleKeydown = (event) => {
  if (props.disabled) return;

  switch (event.key) {
    case 'Enter':
    case ' ':
      event.preventDefault();
      if (isOpen.value && highlightedIndex.value >= 0) {
        selectOption(props.options[highlightedIndex.value]);
      } else {
        toggleDropdown();
      }
      break;
    case 'Escape':
      isOpen.value = false;
      break;
    case 'ArrowDown':
      event.preventDefault();
      if (!isOpen.value) {
        isOpen.value = true;
        highlightedIndex.value = 0;
      } else {
        highlightedIndex.value = Math.min(highlightedIndex.value + 1, props.options.length - 1);
      }
      break;
    case 'ArrowUp':
      event.preventDefault();
      if (isOpen.value) {
        highlightedIndex.value = Math.max(highlightedIndex.value - 1, 0);
      }
      break;
    case 'Tab':
      isOpen.value = false;
      break;
  }
};

const handleClickOutside = (event) => {
  if (selectRef.value && !selectRef.value.contains(event.target)) {
    const dropdown = document.querySelector('.select-dropdown');
    if (dropdown && dropdown.contains(event.target)) return;
    isOpen.value = false;
  }
};

const handleScroll = () => {
  if (isOpen.value) {
    calculateDropdownPosition();
  }
};

watch(isOpen, async (open) => {
  if (open) {
    await calculateDropdownPosition();
  }
});

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  window.addEventListener('scroll', handleScroll, true);
  window.addEventListener('resize', handleScroll);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  window.removeEventListener('scroll', handleScroll, true);
  window.removeEventListener('resize', handleScroll);
});
</script>

<style scoped>
.custom-select {
  position: relative;
  width: 100%;
  user-select: none;
}

.select-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  min-height: 52px;
}

.select-trigger:hover {
  border-color: var(--border-color-hover);
  background: var(--bg-card-hover);
}

.custom-select.is-open .select-trigger {
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
}

.custom-select.is-disabled .select-trigger {
  opacity: 0.5;
  cursor: not-allowed;
}

.select-value {
  flex: 1;
  overflow: hidden;
}

.selected-label {
  font-size: 15px;
  font-weight: 500;
  color: var(--text-primary);
}

.placeholder {
  font-size: 15px;
  color: var(--text-hint);
}

.select-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  margin-left: 12px;
}

.select-arrow.rotated {
  transform: rotate(180deg);
  color: var(--accent-primary);
}

.custom-select.dropup .select-arrow.rotated {
  transform: rotate(0deg);
}

.custom-select.dropup .select-arrow {
  transform: rotate(180deg);
}
</style>

<style>
.select-dropdown {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(20px);
  z-index: 9999;
  overflow: hidden;
}

.dropdown-scroll {
  max-height: 320px;
  overflow-y: auto;
  padding: 8px;
}

.dropdown-scroll::-webkit-scrollbar {
  width: 6px;
}

.dropdown-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.dropdown-scroll::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 3px;
}

.dropdown-scroll::-webkit-scrollbar-thumb:hover {
  background: var(--text-muted);
}

.dropdown-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.15s ease;
  gap: 12px;
}

.dropdown-option:hover,
.dropdown-option.is-highlighted {
  background: rgba(99, 102, 241, 0.08);
}

.dropdown-option.is-selected {
  background: rgba(99, 102, 241, 0.12);
}

.dropdown-option.is-selected:hover,
.dropdown-option.is-selected.is-highlighted {
  background: rgba(99, 102, 241, 0.18);
}

.option-content {
  flex: 1;
  min-width: 0;
}

.option-main {
  display: flex;
  align-items: center;
  gap: 10px;
}

.option-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
}

.option-badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  font-size: 11px;
  font-weight: 600;
  color: white;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.option-description {
  font-size: 12px;
  color: var(--text-muted);
  margin: 4px 0 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.option-check {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent-primary);
  flex-shrink: 0;
}

.dropdown-enter-active {
  animation: dropdownIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.dropdown-leave-active {
  animation: dropdownOut 0.15s cubic-bezier(0.4, 0, 1, 1);
}

@keyframes dropdownIn {
  from {
    opacity: 0;
    transform: translateY(-8px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes dropdownOut {
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateY(-4px) scale(0.98);
  }
}

@media (max-width: 640px) {
  .select-dropdown {
    left: 16px !important;
    right: 16px !important;
    width: calc(100% - 32px) !important;
  }

  .dropdown-option {
    padding: 10px 12px;
  }

  .option-label {
    font-size: 13px;
  }

  .option-description {
    font-size: 11px;
  }
}
</style>
