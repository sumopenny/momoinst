<template>
  <div class="model-selector">
    <div class="selector-group">
      <label class="selector-label">
        <div class="label-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
        </div>
        <span>分离模型</span>
      </label>
      <CustomSelect
        v-model="selectedModelId"
        :options="modelOptions"
        placeholder="选择分离模型"
        @change="handleModelChange"
      />
      <p v-if="currentModel" class="model-description">{{ currentModel.description }}</p>
    </div>

    <div v-if="currentModel?.addOpt1Options" class="selector-group">
      <label class="selector-label">{{ currentModel.addOpt1Label }}</label>
      <CustomSelect
        v-model="selectedOpt1"
        :options="opt1Options"
        :placeholder="currentModel.addOpt1Label"
        @change="emitOptions"
      />
      <div v-if="currentOpt1Info" class="opt-info">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
        <span>SDR: {{ currentOpt1Info.sdr }}</span>
      </div>
    </div>

    <div v-if="currentModel?.addOpt2Options" class="selector-group">
      <label class="selector-label">{{ currentModel.addOpt2Label }}</label>
      <CustomSelect
        v-model="selectedOpt2"
        :options="opt2Options"
        :placeholder="currentModel.addOpt2Label"
        @change="emitOptions"
      />
    </div>

    <div class="selector-group">
      <label class="selector-label">
        <div class="label-icon format-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10 9 9 9 8 9"/>
          </svg>
        </div>
        <span>输出格式</span>
      </label>
      <CustomSelect
        v-model="selectedFormat"
        :options="formatOptions"
        placeholder="选择输出格式"
        @change="emitOptions"
      />
      <p v-if="currentFormatInfo" class="format-description">{{ currentFormatInfo.description }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { separationModels, outputFormats, getDefaultModel } from '../config/models';
import CustomSelect from './CustomSelect.vue';

const emit = defineEmits(['options-change']);

const selectedModelId = ref(11);
const selectedOpt1 = ref('');
const selectedOpt2 = ref('');
const selectedFormat = ref('0');

const models = separationModels;

const currentModel = computed(() => {
  return models.find(m => m.id === selectedModelId.value);
});

const currentOpt1Info = computed(() => {
  if (!currentModel.value?.addOpt1Options) return null;
  return currentModel.value.addOpt1Options.find(o => o.value === selectedOpt1.value);
});

const currentFormatInfo = computed(() => {
  return outputFormats.find(f => f.value === selectedFormat.value);
});

const modelOptions = computed(() => {
  return models.map(model => ({
    value: model.id,
    label: model.name,
    description: model.description
  }));
});

const opt1Options = computed(() => {
  if (!currentModel.value?.addOpt1Options) return [];
  return currentModel.value.addOpt1Options.map(opt => ({
    value: opt.value,
    label: opt.label,
    badge: opt.recommended ? '推荐' : null,
    sdr: opt.sdr
  }));
});

const opt2Options = computed(() => {
  if (!currentModel.value?.addOpt2Options) return [];
  return currentModel.value.addOpt2Options.map(opt => ({
    value: opt.value,
    label: opt.label
  }));
});

const formatOptions = computed(() => {
  return outputFormats.map(format => ({
    value: format.value,
    label: format.label,
    description: format.description
  }));
});

const handleModelChange = () => {
  if (currentModel.value?.addOpt1Options) {
    const recommended = currentModel.value.addOpt1Options.find(o => o.recommended);
    selectedOpt1.value = recommended ? recommended.value : currentModel.value.addOpt1Options[0].value;
  } else {
    selectedOpt1.value = '';
  }
  
  if (currentModel.value?.addOpt2Options) {
    selectedOpt2.value = currentModel.value.addOpt2Options[0].value;
  } else {
    selectedOpt2.value = '';
  }
  
  emitOptions();
};

const emitOptions = () => {
  const options = {
    sep_type: selectedModelId.value.toString(),
    output_format: selectedFormat.value
  };
  
  if (selectedOpt1.value) options.add_opt1 = selectedOpt1.value;
  if (selectedOpt2.value) options.add_opt2 = selectedOpt2.value;
  
  emit('options-change', options);
};

onMounted(() => {
  const defaultModel = getDefaultModel();
  selectedModelId.value = defaultModel.id;
  handleModelChange();
});
</script>

<style scoped>
.model-selector {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.selector-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.selector-label {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-secondary);
}

.label-icon {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent-primary);
}

.label-icon.format-icon {
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.2) 0%, rgba(219, 39, 119, 0.2) 100%);
  color: #f472b6;
}

.model-description,
.format-description {
  font-size: 13px;
  color: var(--text-muted);
  margin: 0;
  padding-left: 42px;
}

.opt-info {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--success-color);
  background: var(--success-bg);
  border: 1px solid rgba(16, 185, 129, 0.2);
  padding: 8px 16px;
  border-radius: 10px;
  margin: 0;
  width: fit-content;
  font-weight: 500;
}

@media (max-width: 640px) {
  .model-description,
  .format-description {
    padding-left: 0;
  }
}
</style>
