<template>
  <div class="file-upload">
    <div 
      class="upload-area"
      :class="{ 'drag-over': isDragOver, 'has-file': selectedFile }"
      @dragover.prevent="handleDragOver"
      @dragleave.prevent="handleDragLeave"
      @drop.prevent="handleDrop"
      @click="triggerFileInput"
    >
      <input
        ref="fileInput"
        type="file"
        :accept="acceptFormats"
        @change="handleFileChange"
        hidden
      />
      
      <div v-if="!selectedFile" class="upload-placeholder">
        <div class="upload-icon-wrapper">
          <div class="upload-icon-bg"></div>
          <svg class="upload-icon" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="17 8 12 3 7 8"/>
            <line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
        </div>
        <div class="upload-text-group">
          <p class="upload-text">拖拽音频文件到此处</p>
          <p class="upload-text-sub">或 <span class="browse-link">点击浏览</span> 选择文件</p>
        </div>
        <div class="upload-formats">
          <span class="format-tag" v-for="format in displayFormats" :key="format">{{ format }}</span>
        </div>
        <p class="upload-hint">最大支持 100MB</p>
      </div>
      
      <div v-else class="file-info">
        <div class="file-icon-wrapper">
          <div class="file-icon-bg"></div>
          <svg class="file-icon" xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 18V5l12-2v13"/>
            <circle cx="6" cy="18" r="3"/>
            <circle cx="18" cy="16" r="3"/>
          </svg>
        </div>
        <div class="file-details">
          <p class="file-name">{{ selectedFile.name }}</p>
          <div class="file-meta">
            <span class="file-size">{{ formatFileSize(selectedFile.size) }}</span>
            <span class="file-status">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              已就绪
            </span>
          </div>
        </div>
        <button class="remove-btn" @click.stop="removeFile" title="移除文件">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
    </div>
    
    <Transition name="error">
      <div v-if="error" class="error-message">
        <div class="error-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <span>{{ error }}</span>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { supportedAudioFormats, maxFileSize } from '../config/models';

const emit = defineEmits(['file-selected', 'file-removed']);

const fileInput = ref(null);
const selectedFile = ref(null);
const isDragOver = ref(false);
const error = ref('');

const acceptFormats = computed(() => {
  return supportedAudioFormats.join(',');
});

const displayFormats = computed(() => {
  return ['MP3', 'WAV', 'FLAC', 'OGG', 'M4A'];
});

const handleDragOver = () => {
  isDragOver.value = true;
};

const handleDragLeave = () => {
  isDragOver.value = false;
};

const handleDrop = (e) => {
  isDragOver.value = false;
  const files = e.dataTransfer.files;
  if (files.length > 0) {
    processFile(files[0]);
  }
};

const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileChange = (e) => {
  const files = e.target.files;
  if (files.length > 0) {
    processFile(files[0]);
  }
};

const processFile = (file) => {
  error.value = '';
  
  const ext = '.' + file.name.split('.').pop().toLowerCase();
  if (!supportedAudioFormats.includes(ext)) {
    error.value = '不支持的音频文件格式';
    return;
  }
  
  if (file.size > maxFileSize) {
    error.value = '文件大小超过限制（最大100MB）';
    return;
  }
  
  selectedFile.value = file;
  emit('file-selected', file);
};

const removeFile = () => {
  selectedFile.value = null;
  error.value = '';
  if (fileInput.value) {
    fileInput.value.value = '';
  }
  emit('file-removed');
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

defineExpose({
  selectedFile,
  removeFile
});
</script>

<style scoped>
.file-upload {
  width: 100%;
}

.upload-area {
  position: relative;
  border: 2px dashed var(--border-color);
  border-radius: 20px;
  padding: 48px 32px;
  text-align: center;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  background: var(--bg-card);
  overflow: hidden;
}

.upload-area::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, rgba(99, 102, 241, 0.1) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.4s;
}

.upload-area:hover {
  border-color: var(--accent-primary);
  background: var(--bg-card-hover);
}

.upload-area:hover::before {
  opacity: 1;
}

.upload-area.drag-over {
  border-color: var(--accent-primary);
  background: var(--bg-card-hover);
  transform: scale(1.01);
}

.upload-area.drag-over::before {
  opacity: 1;
}

.upload-area.has-file {
  border-style: solid;
  border-color: var(--success-color);
  background: var(--success-bg);
  padding: 24px 32px;
}

.upload-area.has-file::before {
  background: radial-gradient(circle at center, rgba(16, 185, 129, 0.1) 0%, transparent 70%);
  opacity: 1;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.upload-icon-wrapper {
  position: relative;
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-icon-bg {
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%);
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.1); opacity: 0.3; }
}

.upload-icon {
  position: relative;
  color: var(--accent-primary);
  z-index: 1;
  transition: transform 0.3s;
}

.upload-area:hover .upload-icon {
  transform: translateY(-4px);
}

.upload-text-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.upload-text {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.upload-text-sub {
  font-size: 14px;
  color: var(--text-muted);
  margin: 0;
}

.browse-link {
  color: var(--accent-primary);
  font-weight: 600;
  cursor: pointer;
  transition: color 0.2s;
}

.browse-link:hover {
  color: var(--accent-secondary);
}

.upload-formats {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
}

.format-tag {
  padding: 6px 14px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.upload-hint {
  font-size: 13px;
  color: var(--text-hint);
  margin: 0;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 8px;
}

.file-icon-wrapper {
  position: relative;
  width: 72px;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.file-icon-bg {
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.2) 100%);
  border-radius: 18px;
}

.file-icon {
  position: relative;
  color: var(--success-color);
  z-index: 1;
}

.file-details {
  flex: 1;
  text-align: left;
  min-width: 0;
}

.file-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.file-meta {
  display: flex;
  align-items: center;
  gap: 16px;
}

.file-size {
  font-size: 13px;
  color: var(--text-muted);
}

.file-status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--success-color);
  font-weight: 500;
}

.remove-btn {
  background: var(--error-bg);
  border: 1px solid rgba(239, 68, 68, 0.2);
  padding: 12px;
  cursor: pointer;
  color: var(--error-color);
  border-radius: 12px;
  transition: all 0.3s;
  flex-shrink: 0;
}

.remove-btn:hover {
  background: rgba(239, 68, 68, 0.2);
  border-color: rgba(239, 68, 68, 0.4);
}

.error-message {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 16px;
  padding: 14px 18px;
  background: var(--error-bg);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 12px;
  color: var(--error-color);
  font-size: 14px;
}

.error-icon {
  width: 32px;
  height: 32px;
  background: rgba(239, 68, 68, 0.2);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--error-color);
}

.error-enter-active,
.error-leave-active {
  transition: all 0.3s ease;
}

.error-enter-from,
.error-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@media (max-width: 640px) {
  .upload-area {
    padding: 32px 20px;
  }
  
  .upload-icon-wrapper {
    width: 80px;
    height: 80px;
  }
  
  .upload-icon {
    width: 36px;
    height: 36px;
  }
  
  .upload-text {
    font-size: 16px;
  }
  
  .file-info {
    flex-wrap: wrap;
    gap: 16px;
  }
  
  .file-icon-wrapper {
    width: 56px;
    height: 56px;
  }
  
  .file-icon {
    width: 28px;
    height: 28px;
  }
  
  .file-details {
    width: calc(100% - 100px);
  }
  
  .file-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
}
</style>
