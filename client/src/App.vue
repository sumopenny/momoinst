<template>
  <div class="app" :class="{ 'light-mode': !isDark }">
    <div class="bg-animation">
      <div class="bg-gradient"></div>
      <div class="bg-orb orb-1"></div>
      <div class="bg-orb orb-2"></div>
      <div class="bg-orb orb-3"></div>
    </div>

    <header class="app-header">
      <div class="header-content">
        <div class="logo-section">
          <div class="logo-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 18V5l12-2v13"/>
              <circle cx="6" cy="18" r="3"/>
              <circle cx="18" cy="16" r="3"/>
            </svg>
          </div>
          <div class="logo-text">
            <h1>momoinst</h1>
            <p class="tagline">专业级音乐分离引擎</p>
          </div>
        </div>
        <div class="header-actions">
          <button class="theme-toggle" @click="toggleTheme" :title="isDark ? '切换到浅色模式' : '切换到深色模式'">
            <svg v-if="isDark" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/>
              <line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/>
              <line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          </button>
          <nav class="main-nav">
            <button 
              class="nav-btn" 
              :class="{ active: currentMainView === 'upload' && currentView === 'upload' }"
              @click="switchToUpload"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
              <span>新建分离</span>
            </button>
            <button 
              class="nav-btn" 
              :class="{ active: currentMainView === 'history' }"
              @click="switchToHistory"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              <span>历史记录</span>
            </button>
          </nav>
        </div>
      </div>
    </header>

    <main class="app-main">
      <div v-if="isLoadingHistory" class="loading-view">
        <div class="loading-card glass-card">
          <div class="loading-spinner">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
            </svg>
          </div>
          <p>加载中...</p>
        </div>
      </div>

      <div v-else-if="currentMainView === 'upload' && currentView === 'upload'" class="upload-view">
        <div class="upload-section glass-card">
          <div class="section-header">
            <div class="section-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
            </div>
            <h2 class="section-title">上传音频文件</h2>
          </div>
          <FileUpload
            ref="fileUploadRef"
            @file-selected="handleFileSelected"
            @file-removed="handleFileRemoved"
          />
        </div>

        <div class="options-section glass-card">
          <div class="section-header">
            <div class="section-icon settings-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
            </div>
            <h2 class="section-title">分离选项</h2>
          </div>
          <ModelSelector @options-change="handleOptionsChange" />
        </div>

        <div class="action-section">
          <button
            class="separate-btn"
            :disabled="!selectedFile || isSubmitting"
            @click="handleSeparate"
          >
            <div class="btn-bg"></div>
            <svg v-if="isSubmitting" class="spinner" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
            <span>{{ isSubmitting ? '提交中...' : '开始分离' }}</span>
          </button>
        </div>
      </div>

      <div v-else-if="currentMainView === 'upload' && currentView === 'processing'" class="processing-view">
        <QueueStatus
          :status="processingStatus"
          :queue-data="queueData"
          :global-queue="globalQueue"
          :show-queue-info="true"
        />

        <div class="cancel-section">
          <button
            v-if="processingStatus === 'waiting'"
            class="cancel-btn"
            @click="handleCancel"
            :disabled="isCancelling"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
            {{ isCancelling ? '取消中...' : '取消任务' }}
          </button>
        </div>
      </div>

      <div v-else-if="currentMainView === 'upload' && currentView === 'result'" class="result-view">
        <ResultPage
          :result-data="resultData"
          @new-separation="handleNewSeparation"
          @download="handleDownload"
        />
      </div>

      <div v-else-if="currentMainView === 'upload' && currentView === 'error'" class="error-view">
        <div class="error-card glass-card">
          <div class="error-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <h3>出错了</h3>
          <p>{{ errorMessage }}</p>
          <button class="retry-btn" @click="handleNewSeparation">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
            </svg>
            重新开始
          </button>
        </div>
      </div>

      <div v-else-if="currentMainView === 'history'" class="history-view">
        <HistoryPage 
          ref="historyPageRef"
          @view-result="handleViewHistoryResult"
          @show-notification="showNotification"
        />
      </div>
    </main>

    <footer class="app-footer">
      <div class="footer-content">
        <p>Powered by <a href="https://b23.tv/XnqyN47" target="_blank" rel="noopener">素茉penny</a></p>
      </div>
    </footer>

    <Transition name="notification">
      <div v-if="notification.show" class="notification" :class="notification.type">
        <div class="notification-icon">
          <svg v-if="notification.type === 'success'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
          <svg v-else-if="notification.type === 'error'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="16" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
        </div>
        <span>{{ notification.message }}</span>
        <button class="notification-close" @click="hideNotification">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import FileUpload from './components/FileUpload.vue';
import ModelSelector from './components/ModelSelector.vue';
import QueueStatus from './components/QueueStatus.vue';
import ResultPage from './components/ResultPage.vue';
import HistoryPage from './components/HistoryPage.vue';
import { createSeparation, getSeparationResult, cancelSeparation, getQueueInfo } from './api';
import { isDark, initTheme, toggleTheme } from './composables/useTheme';

const STORAGE_KEY = 'momoinst_task_state';

const currentMainView = ref('upload');
const currentView = ref('upload');
const selectedFile = ref(null);
const separationOptions = ref({});
const isSubmitting = ref(false);
const isCancelling = ref(false);
const isLoadingHistory = ref(false);
const globalQueue = ref(null);
const processingStatus = ref('waiting');
const queueData = ref({});
const resultData = ref({});
const currentHash = ref('');
const errorMessage = ref('');
const pollInterval = ref(null);
const fileUploadRef = ref(null);
const historyPageRef = ref(null);

const notification = ref({
  show: false,
  type: 'info',
  message: ''
});

const saveState = () => {
  const state = {
    currentView: currentView.value,
    currentHash: currentHash.value,
    processingStatus: processingStatus.value,
    queueData: queueData.value,
    resultData: resultData.value,
    errorMessage: errorMessage.value,
    separationOptions: separationOptions.value
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

const loadState = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const state = JSON.parse(saved);
      currentView.value = state.currentView || 'upload';
      currentHash.value = state.currentHash || '';
      processingStatus.value = state.processingStatus || 'waiting';
      queueData.value = state.queueData || {};
      resultData.value = state.resultData || {};
      errorMessage.value = state.errorMessage || '';
      separationOptions.value = state.separationOptions || {};
      
      if (currentView.value === 'processing' && currentHash.value) {
        startPolling();
      }
      return true;
    }
  } catch (e) {
    console.error('加载状态失败:', e);
  }
  return false;
};

const clearState = () => {
  localStorage.removeItem(STORAGE_KEY);
};

watch([currentView, currentHash, processingStatus, queueData, resultData, errorMessage], () => {
  if (currentView.value !== 'upload') {
    saveState();
  }
}, { deep: true });

const showNotification = (message, type = 'info') => {
  notification.value = { show: true, type, message };
  setTimeout(() => {
    hideNotification();
  }, 5000);
};

const hideNotification = () => {
  notification.value.show = false;
};

const switchToUpload = () => {
  stopPolling();
  currentMainView.value = 'upload';
  currentView.value = 'upload';
};

const switchToHistory = () => {
  currentMainView.value = 'history';
};

const handleViewHistoryResult = async (hash) => {
  currentHash.value = hash;
  isLoadingHistory.value = true;
  
  try {
    const result = await getSeparationResult(hash);
    isLoadingHistory.value = false;
    
    if (result.success) {
      if (result.status === 'done') {
        resultData.value = result.data;
        currentMainView.value = 'upload';
        currentView.value = 'result';
      } else if (result.status === 'failed') {
        errorMessage.value = result.data?.message || '处理失败';
        currentMainView.value = 'upload';
        currentView.value = 'error';
      } else {
        queueData.value = result.data || {};
        processingStatus.value = result.status;
        currentMainView.value = 'upload';
        currentView.value = 'processing';
        startPolling();
      }
    } else {
      errorMessage.value = '获取结果失败';
      currentMainView.value = 'upload';
      currentView.value = 'error';
    }
  } catch (error) {
    console.error('获取历史结果失败:', error);
    isLoadingHistory.value = false;
    errorMessage.value = '网络错误，请重试';
    currentMainView.value = 'upload';
    currentView.value = 'error';
  }
};

const handleFileSelected = (file) => {
  selectedFile.value = file;
};

const handleFileRemoved = () => {
  selectedFile.value = null;
};

const handleOptionsChange = (options) => {
  separationOptions.value = options;
};

const handleSeparate = async () => {
  if (!selectedFile.value) {
    showNotification('请先选择音频文件', 'error');
    return;
  }

  isSubmitting.value = true;

  try {
    const result = await createSeparation(selectedFile.value, separationOptions.value);
    console.log('创建分离任务响应:', result);

    const hash = result.data?.hash || result.hash;
    
    if (result.success && hash) {
      currentHash.value = hash;
      currentView.value = 'processing';
      processingStatus.value = 'waiting';
      startPolling();
      showNotification('任务已提交，正在处理中', 'success');
    } else {
      const errorMsg = result.errors?.[0] || result.message || result.error || '提交失败，请重试';
      showNotification(errorMsg, 'error');
    }
  } catch (error) {
    console.error('分离请求失败:', error);
    const errorMsg = error.response?.data?.errors?.[0] || error.response?.data?.message || '网络错误，请检查连接后重试';
    showNotification(errorMsg, 'error');
  } finally {
    isSubmitting.value = false;
  }
};

const startPolling = () => {
  stopPolling();
  
  pollInterval.value = setInterval(async () => {
    if (!currentHash.value) {
      console.error('轮询失败: hash为空');
      return;
    }
    
    try {
      console.log('轮询状态, hash:', currentHash.value);
      const result = await getSeparationResult(currentHash.value);
      console.log('轮询响应:', result);
      
      if (result.success) {
        processingStatus.value = result.status;
        queueData.value = result.data || {};

        if (result.status === 'done') {
          stopPolling();
          resultData.value = {
            ...result.data,
            sep_type: separationOptions.value.sep_type
          };
          currentView.value = 'result';
          showNotification('分离完成！', 'success');
        } else if (result.status === 'failed') {
          stopPolling();
          errorMessage.value = result.data?.message || '处理失败';
          currentView.value = 'error';
        }
      } else {
        console.error('轮询返回失败:', result);
      }
    } catch (error) {
      console.error('轮询状态失败:', error);
    }
  }, 3000);
};

const stopPolling = () => {
  if (pollInterval.value) {
    clearInterval(pollInterval.value);
    pollInterval.value = null;
  }
};

const handleCancel = async () => {
  if (!currentHash.value) return;

  isCancelling.value = true;

  try {
    const result = await cancelSeparation(currentHash.value);

    if (result.success) {
      stopPolling();
      clearState();
      showNotification('任务已取消', 'info');
      handleNewSeparation();
    } else {
      showNotification('取消失败，请重试', 'error');
    }
  } catch (error) {
    console.error('取消任务失败:', error);
    showNotification('网络错误，请重试', 'error');
  } finally {
    isCancelling.value = false;
  }
};

const handleNewSeparation = () => {
  stopPolling();
  clearState();
  currentView.value = 'upload';
  selectedFile.value = null;
  currentHash.value = '';
  processingStatus.value = 'waiting';
  queueData.value = {};
  resultData.value = {};
  errorMessage.value = '';
  
  if (fileUploadRef.value) {
    fileUploadRef.value.removeFile();
  }
};

const handleDownload = (file) => {
  console.log('下载文件:', file.name);
};

const fetchQueueInfo = async () => {
  try {
    const result = await getQueueInfo();
    globalQueue.value = result.queue || result;
  } catch (error) {
    console.error('获取队列信息失败:', error);
  }
};

onMounted(() => {
  initTheme();
  const hasRestoredState = loadState();
  fetchQueueInfo();
  const queueInterval = setInterval(fetchQueueInfo, 30000);
  
  onUnmounted(() => {
    stopPolling();
    clearInterval(queueInterval);
  });
});
</script>

<style>
:root {
  --bg-primary: #0f0f23;
  --bg-secondary: #1a1a3e;
  --bg-card: rgba(255, 255, 255, 0.03);
  --bg-card-hover: rgba(255, 255, 255, 0.05);
  --border-color: rgba(255, 255, 255, 0.08);
  --border-color-hover: rgba(255, 255, 255, 0.15);
  --text-primary: #ffffff;
  --text-secondary: rgba(255, 255, 255, 0.8);
  --text-muted: rgba(255, 255, 255, 0.5);
  --text-hint: rgba(255, 255, 255, 0.4);
  --accent-primary: #6366f1;
  --accent-secondary: #8b5cf6;
  --accent-gradient: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  --success-color: #10b981;
  --success-bg: rgba(16, 185, 129, 0.15);
  --error-color: #ef4444;
  --error-bg: rgba(239, 68, 68, 0.15);
  --warning-color: #f59e0b;
  --warning-bg: rgba(245, 158, 11, 0.15);
  --info-color: #3b82f6;
  --info-bg: rgba(59, 130, 246, 0.15);
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.2);
  --shadow-md: 0 8px 32px rgba(0, 0, 0, 0.3);
  --shadow-lg: 0 12px 48px rgba(0, 0, 0, 0.4);
}

[data-theme="light"] {
  --bg-primary: #f8fafc;
  --bg-secondary: #f1f5f9;
  --bg-card: rgba(255, 255, 255, 0.8);
  --bg-card-hover: rgba(255, 255, 255, 0.95);
  --border-color: rgba(0, 0, 0, 0.08);
  --border-color-hover: rgba(99, 102, 241, 0.3);
  --text-primary: #1e293b;
  --text-secondary: #334155;
  --text-muted: #64748b;
  --text-hint: #94a3b8;
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.06);
  --shadow-md: 0 8px 32px rgba(0, 0, 0, 0.08);
  --shadow-lg: 0 12px 48px rgba(0, 0, 0, 0.12);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background: var(--bg-primary);
  min-height: 100vh;
  overflow-x: hidden;
  transition: background 0.3s ease;
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
}

.bg-animation {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  overflow: hidden;
  transition: opacity 0.3s ease;
}

.app.light-mode .bg-animation {
  opacity: 0.3;
}

.bg-gradient {
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 50%, #2d1b4e 100%);
  background-size: 400% 400%;
  animation: gradientShift 15s ease infinite;
}

.app.light-mode .bg-gradient {
  background: linear-gradient(135deg, #f8fafc 0%, #e0e7ff 25%, #f1f5f9 50%, #ede9fe 75%, #f8fafc 100%);
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.bg-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.5;
  animation: float 20s ease-in-out infinite;
}

.orb-1 {
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, #6366f1 0%, transparent 70%);
  top: -200px;
  left: -200px;
  animation-delay: 0s;
}

.orb-2 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, #8b5cf6 0%, transparent 70%);
  bottom: -150px;
  right: -150px;
  animation-delay: -7s;
}

.orb-3 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, #ec4899 0%, transparent 70%);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation-delay: -14s;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  25% { transform: translate(50px, -50px) scale(1.1); }
  50% { transform: translate(-30px, 30px) scale(0.95); }
  75% { transform: translate(40px, 40px) scale(1.05); }
}

.app-header {
  background: var(--bg-card);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border-color);
  padding: 20px 24px;
  position: sticky;
  top: 0;
  z-index: 100;
  transition: all 0.3s ease;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.logo-icon {
  width: 56px;
  height: 56px;
  background: var(--accent-gradient);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 8px 32px rgba(99, 102, 241, 0.4);
  position: relative;
  overflow: hidden;
}

.logo-icon::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  animation: shimmer 3s infinite;
}

@keyframes shimmer {
  0% { left: -100%; }
  100% { left: 100%; }
}

.logo-text h1 {
  font-size: 28px;
  font-weight: 800;
  background: var(--accent-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.5px;
}

.app.light-mode .logo-text h1 {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.tagline {
  color: var(--text-muted);
  font-size: 13px;
  margin-top: 2px;
  font-weight: 500;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.theme-toggle {
  width: 44px;
  height: 44px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.3s ease;
}

.theme-toggle:hover {
  background: var(--bg-card-hover);
  border-color: var(--accent-primary);
  color: var(--accent-primary);
  transform: rotate(15deg);
}

.main-nav {
  display: flex;
  gap: 12px;
}

.nav-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: var(--bg-card);
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
}

.nav-btn:hover {
  background: var(--bg-card-hover);
  border-color: var(--border-color-hover);
  transform: translateY(-2px);
}

.nav-btn.active {
  background: var(--accent-gradient);
  color: white;
  border-color: transparent;
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.4);
}

.app-main {
  flex: 1;
  padding: 32px 24px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.glass-card {
  background: var(--bg-card);
  backdrop-filter: blur(20px);
  border: 1px solid var(--border-color);
  border-radius: 24px;
  padding: 28px;
  box-shadow: var(--shadow-md);
  transition: all 0.3s ease;
}

.glass-card:hover {
  border-color: var(--border-color-hover);
  box-shadow: var(--shadow-lg);
}

.section-header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 24px;
}

.section-icon {
  width: 48px;
  height: 48px;
  background: var(--accent-gradient);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.35);
}

.section-icon.settings-icon {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.35);
}

.section-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.upload-section,
.options-section,
.queue-section {
  margin-bottom: 24px;
}

.action-section {
  text-align: center;
  margin-top: 32px;
}

.separate-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 18px 56px;
  background: transparent;
  color: var(--accent-primary);
  border: none;
  border-radius: 16px;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.app:not(.light-mode) .separate-btn {
  color: white;
}

.separate-btn .btn-bg {
  position: absolute;
  inset: 0;
  background: var(--accent-gradient);
  background-size: 200% 200%;
  animation: gradientMove 3s ease infinite;
  z-index: 0;
  border-radius: 16px;
}

@keyframes gradientMove {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.separate-btn::before {
  content: '';
  position: absolute;
  inset: 2px;
  background: var(--bg-primary);
  border-radius: 14px;
  z-index: 1;
  transition: opacity 0.3s;
}

.separate-btn svg,
.separate-btn span {
  position: relative;
  z-index: 2;
}

.separate-btn:hover:not(:disabled)::before {
  opacity: 0;
}

.separate-btn:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 12px 40px rgba(99, 102, 241, 0.5);
  color: white;
}

.separate-btn:active:not(:disabled) {
  transform: translateY(-1px);
}

.separate-btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.separate-btn:disabled .btn-bg {
  background: #374151;
  animation: none;
}

.separate-btn .spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.processing-view {
  background: var(--bg-card);
  backdrop-filter: blur(20px);
  border: 1px solid var(--border-color);
  border-radius: 24px;
  padding: 28px;
  box-shadow: var(--shadow-md);
}

.history-view {
  background: transparent;
}

.loading-view {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.loading-card {
  text-align: center;
  padding: 48px;
}

.loading-spinner {
  width: 80px;
  height: 80px;
  margin: 0 auto 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent-primary);
  animation: spin 1s linear infinite;
}

.loading-card p {
  color: var(--text-secondary);
  font-size: 16px;
  font-weight: 500;
}

.cancel-section {
  text-align: center;
  margin-top: 28px;
}

.cancel-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 28px;
  background: var(--error-bg);
  color: var(--error-color);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  backdrop-filter: blur(10px);
}

.cancel-btn:hover:not(:disabled) {
  background: rgba(239, 68, 68, 0.2);
  border-color: rgba(239, 68, 68, 0.5);
}

.cancel-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.error-view {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.error-card {
  text-align: center;
  max-width: 400px;
}

.error-icon {
  width: 100px;
  height: 100px;
  background: var(--error-bg);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  color: var(--error-color);
}

.error-card h3 {
  font-size: 26px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.error-card p {
  color: var(--text-muted);
  margin-bottom: 28px;
  font-size: 15px;
}

.retry-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 32px;
  background: var(--accent-gradient);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
}

.retry-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(99, 102, 241, 0.5);
}

.app-footer {
  background: var(--bg-card);
  backdrop-filter: blur(20px);
  border-top: 1px solid var(--border-color);
  padding: 20px 24px;
  transition: all 0.3s ease;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}

.app-footer p {
  color: var(--text-muted);
  font-size: 13px;
}

.app-footer a {
  color: var(--accent-primary);
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s;
}

.app-footer a:hover {
  color: var(--accent-secondary);
}

.notification {
  position: fixed;
  bottom: 28px;
  right: 28px;
  padding: 16px 24px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 14px;
  box-shadow: var(--shadow-lg);
  z-index: 1000;
  backdrop-filter: blur(20px);
  border: 1px solid var(--border-color);
}

.notification-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notification.info {
  background: var(--info-bg);
  color: #60a5fa;
}

.notification.info .notification-icon {
  background: rgba(59, 130, 246, 0.2);
  color: #3b82f6;
}

.notification.success {
  background: var(--success-bg);
  color: #6ee7b7;
}

.notification.success .notification-icon {
  background: rgba(16, 185, 129, 0.2);
  color: #34d399;
}

.notification.error {
  background: var(--error-bg);
  color: #fca5a5;
}

.notification.error .notification-icon {
  background: rgba(239, 68, 68, 0.2);
  color: #f87171;
}

.notification span {
  font-size: 14px;
  font-weight: 500;
}

.notification-close {
  background: none;
  border: none;
  padding: 6px;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.2s;
  color: inherit;
  border-radius: 8px;
}

.notification-close:hover {
  opacity: 1;
  background: rgba(255, 255, 255, 0.1);
}

.notification-enter-active,
.notification-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.notification-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.notification-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

@media (max-width: 768px) {
  .app-header {
    padding: 16px;
  }
  
  .header-content {
    flex-direction: column;
    text-align: center;
  }
  
  .logo-section {
    flex-direction: column;
    gap: 12px;
  }
  
  .logo-icon {
    width: 48px;
    height: 48px;
    border-radius: 14px;
  }
  
  .logo-text h1 {
    font-size: 24px;
  }
  
  .header-actions {
    width: 100%;
    justify-content: center;
  }
  
  .main-nav {
    width: 100%;
  }
  
  .nav-btn {
    flex: 1;
    justify-content: center;
    padding: 12px 16px;
  }
  
  .app-main {
    padding: 20px 16px;
  }
  
  .glass-card {
    padding: 20px;
    border-radius: 20px;
  }
  
  .section-header {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }
  
  .section-icon {
    width: 44px;
    height: 44px;
  }
  
  .section-title {
    font-size: 18px;
  }
  
  .separate-btn {
    width: 100%;
    padding: 16px 32px;
    font-size: 16px;
  }
  
  .notification {
    left: 16px;
    right: 16px;
    bottom: 16px;
  }
}

@media (max-width: 480px) {
  .nav-btn span {
    display: none;
  }
  
  .nav-btn {
    padding: 12px;
  }
}
</style>
