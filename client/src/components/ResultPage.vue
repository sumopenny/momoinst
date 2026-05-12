<template>
  <div class="result-page">
    <div class="result-header">
      <div class="success-icon-wrapper">
        <div class="success-icon-bg"></div>
        <svg class="success-icon" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
      </div>
      <h2>分离完成</h2>
      <p>您的音频已成功分离，请查看下方结果</p>
    </div>

    <div class="result-info">
      <div class="info-card">
        <div class="card-header">
          <div class="card-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
          </div>
          <h4>算法信息</h4>
        </div>
        <div class="info-item">
          <span class="info-label">使用算法</span>
          <span class="info-value">{{ resultData.algorithm || '-' }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">算法描述</span>
          <span class="info-value">{{ resultData.algorithm_description || '-' }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">输出格式</span>
          <span class="info-value">{{ resultData.output_format || '-' }}</span>
        </div>
        <div class="info-item" v-if="resultData.date">
          <span class="info-label">处理时间</span>
          <span class="info-value">{{ resultData.date }}</span>
        </div>
      </div>

      <div class="info-card">
        <div class="card-header">
          <div class="card-icon music-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 18V5l12-2v13"/>
              <circle cx="6" cy="18" r="3"/>
              <circle cx="18" cy="16" r="3"/>
            </svg>
          </div>
          <h4>音频信息</h4>
        </div>
        <div class="info-item">
          <span class="info-label">音乐名称</span>
          <span class="info-value">{{ musicName }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">格式</span>
          <span class="info-value">{{ resultData.output_format || '-' }}</span>
        </div>
      </div>

      <div class="info-card" v-if="resultData.input_file">
        <div class="card-header">
          <div class="card-icon file-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
          </div>
          <h4>原始文件</h4>
        </div>
        <div class="info-item">
          <span class="info-label">文件大小</span>
          <span class="info-value">{{ resultData.input_file.size || '-' }}</span>
        </div>
      </div>
    </div>

    <div class="result-files">
      <h3>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
        </svg>
        分离结果文件
      </h3>
      <div class="files-list">
        <AudioPlayer
          v-for="(file, index) in processedFiles"
          :key="index"
          :url="file.url"
          :name="file.displayName || file.name"
          :size="file.size"
          @download="handleDownload(file)"
          @error="handlePlayerError"
        />
      </div>
    </div>

    <div class="result-actions">
      <button class="btn btn-primary" @click="$emit('new-separation')">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        开始新的分离
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import AudioPlayer from './AudioPlayer.vue';
import { getOutputFileNames, getSepTypeFromAlgorithm } from '../config/models';

const props = defineProps({
  resultData: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['new-separation', 'download']);

const musicName = computed(() => {
  if (props.resultData.tags?.title) {
    return props.resultData.tags.title;
  }
  
  if (props.resultData.input_file?.url) {
    const urlFileName = decodeURIComponent(props.resultData.input_file.url.split('/').pop().split('?')[0]);
    const nameWithoutExt = urlFileName.replace(/\.[^/.]+$/, '');
    if (nameWithoutExt) {
      return nameWithoutExt;
    }
  }
  
  return '未知';
});

const processedFiles = computed(() => {
  if (!props.resultData.files || !props.resultData.files.length) {
    return [];
  }
  
  let modelId = props.resultData.sep_type;
  if (!modelId) {
    modelId = getSepTypeFromAlgorithm(props.resultData.algorithm);
  }
  
  return getOutputFileNames(modelId, props.resultData.files);
});

const handleDownload = (file) => {
  emit('download', file);
};

const handlePlayerError = (error) => {
  console.error('播放器错误:', error);
};
</script>

<style scoped>
.result-page {
  max-width: 900px;
  margin: 0 auto;
}

.result-header {
  text-align: center;
  padding: 48px 32px;
  background: var(--success-bg);
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 24px;
  margin-bottom: 28px;
  position: relative;
  overflow: hidden;
}

.result-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(16, 185, 129, 0.5), transparent);
}

.success-icon-wrapper {
  position: relative;
  width: 100px;
  height: 100px;
  margin: 0 auto 24px;
  display: flex;/** 意思是启用 flexbox 布局 **/
  align-items: center;/** 意思是将元素垂直居中显示 **/
  justify-content: center;/** 意思是将元素水平居中显示 **/
}

.success-icon-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.3) 0%, rgba(5, 150, 105, 0.2) 100%);
  border-radius: 50%;
  animation: pulseSuccess 2s ease-in-out infinite;
}

@keyframes pulseSuccess {
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.1); opacity: 0.3; }
}

.success-icon {
  position: relative;
  color: var(--success-color);
  z-index: 1;
}

.result-header h2 {
  margin: 0 0 10px;
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
}

.result-header p {
  margin: 0;
  font-size: 15px;
  color: var(--text-muted);
}

.result-info {
  display: grid;
  gap: 20px;
  margin-bottom: 28px;
}

.info-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 24px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border-color);
}

.card-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent-primary);
}

.card-icon.music-icon {
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.2) 0%, rgba(219, 39, 119, 0.2) 100%);
  color: #f472b6;
}

.card-icon.file-icon {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(37, 99, 235, 0.2) 100%);
  color: #60a5fa;
}

.card-header h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
}

.info-item:not(:last-child) {
  border-bottom: 1px solid var(--border-color);
}

.info-label {
  font-size: 14px;
  color: var(--text-muted);
}

.info-value {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  text-align: right;
  max-width: 60%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.result-files {
  margin-bottom: 28px;
}

.result-files h3 {
  margin: 0 0 20px;
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 10px;
}

.result-files h3 svg {
  color: var(--accent-primary);
}

.files-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.result-actions {
  display: flex;
  justify-content: center;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 16px 36px;
  border: none;
  border-radius: 14px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary {
  background: var(--accent-gradient);
  color: white;
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.4);
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 32px rgba(99, 102, 241, 0.5);
}

@media (max-width: 640px) {
  .result-header {
    padding: 32px 20px;
  }
  
  .success-icon-wrapper {
    width: 80px;
    height: 80px;
  }
  
  .success-icon {
    width: 40px;
    height: 40px;
  }
  
  .result-header h2 {
    font-size: 24px;
  }
  
  .info-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }
  
  .info-value {
    text-align: left;
    max-width: 100%;
  }
  
  .result-actions {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
