<template>
  <div class="history-page">
    <div class="history-header">
      <div class="header-left">
        <div class="header-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
        </div>
        <h2 class="section-title">分离历史</h2>
      </div>
      <button class="refresh-btn" @click="fetchHistory" :disabled="isLoading">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" :class="{ 'spinning': isLoading }">
          <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
        </svg>
        刷新
      </button>
    </div>

    <div v-if="isLoading && !historyList.length" class="loading-state">
      <div class="loading-spinner">
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
      </div>
      <p>加载中...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <div class="error-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      </div>
      <p>{{ error }}</p>
      <button class="retry-btn" @click="fetchHistory">重试</button>
    </div>

    <div v-else-if="!historyList.length" class="empty-state">
      <div class="empty-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="12" y1="18" x2="12" y2="12"/>
          <line x1="9" y1="15" x2="15" y2="15"/>
        </svg>
      </div>
      <p>暂无分离历史记录</p>
    </div>

    <div v-else class="history-table-wrapper">
      <table class="history-table">
        <thead>
          <tr>
            <th>日期</th>
            <th>文件名称</th>
            <th>分离类型</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in historyList" :key="item.hash">
            <td class="date-cell">{{ formatDate(item.hash) }}</td>
            <td class="filename-cell" :title="getFileName(item)">{{ getFileName(item) }}</td>
            <td class="type-cell">{{ getAlgorithmName(item) }}</td>
            <td class="status-cell">
              <span class="status-badge" :class="getStatusClass(item)">
                {{ isExpired(item) ? '已过期' : '未过期' }}
              </span>
            </td>
            <td class="action-cell">
              <div class="action-buttons">
                <button 
                  class="action-btn view-btn"
                  @click="handleDownload(item)"
                  :disabled="isExpired(item)"
                  :title="isExpired(item) ? '已过期，无法查看' : '查看结果'"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  查看
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="hasMore && historyList.length" class="load-more">
      <button class="load-more-btn" @click="loadMore" :disabled="isLoadingMore">
        <svg v-if="isLoadingMore" class="spinner-small" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
        </svg>
        {{ isLoadingMore ? '加载中...' : '加载更多' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { getSeparationHistory } from '../api';

const emit = defineEmits(['view-result', 'show-notification']);

const historyList = ref([]);
const isLoading = ref(false);
const isLoadingMore = ref(false);
const error = ref('');
const currentPage = ref(0);
const pageSize = 20;
const totalCount = ref(0);
const hasMore = computed(() => {
  return historyList.value.length < totalCount.value;
});

const formatDate = (hash) => {
  if (!hash || hash.length < 14) return '-';
  
  const year = hash.substring(0, 4);
  const month = hash.substring(4, 6);
  const day = hash.substring(6, 8);
  const hour = hash.substring(8, 10);
  const minute = hash.substring(10, 12);
  const second = hash.substring(12, 14);
  
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
};

const getFileName = (item) => {
  const hash = item.hash;
  if (!hash) return '-';
  
  const parts = hash.split('-');
  
  if (parts.length >= 3) {
    const fileName = parts.slice(2).join('-');
    const lastDotIndex = fileName.lastIndexOf('.');
    if (lastDotIndex > 0) {
      const name = fileName.substring(0, lastDotIndex);
      const ext = fileName.substring(lastDotIndex);
      return name.replace(/-/g, ' ') + ext;
    }
    return fileName.replace(/-/g, ' ');
  }
  
  return hash;
};

const getAlgorithmName = (item) => {
  const alg = item.algorithm;
  if (!alg) return '未知';
  
  if (typeof alg === 'object') {
    return alg.name || '未知';
  }
  
  if (typeof alg === 'string') {
    try {
      const parsed = JSON.parse(alg);
      return parsed.name || alg;
    } catch {
      return alg;
    }
  }
  
  return '未知';
};

const isExpired = (item) => {
  return !item.job_exists || item.time_left <= 0;
};

const getStatusClass = (item) => {
  return isExpired(item) ? 'expired' : 'available';
};

const fetchHistory = async () => {
  isLoading.value = true;
  error.value = '';
  
  try {
    const result = await getSeparationHistory(0, pageSize);
    
    if (result.success) {
      historyList.value = result.data || [];
      totalCount.value = result.data?.length || 0;
      currentPage.value = 0;
    } else {
      error.value = result.message || '获取历史记录失败';
    }
  } catch (err) {
    console.error('获取历史记录失败:', err);
    error.value = '网络错误，请稍后重试';
  } finally {
    isLoading.value = false;
  }
};

const loadMore = async () => {
  if (isLoadingMore.value || !hasMore.value) return;
  
  isLoadingMore.value = true;
  const start = (currentPage.value + 1) * pageSize;
  
  try {
    const result = await getSeparationHistory(start, pageSize);
    
    if (result.success && result.data?.length) {
      historyList.value = [...historyList.value, ...result.data];
      currentPage.value++;
    }
  } catch (err) {
    console.error('加载更多失败:', err);
    emit('show-notification', '加载失败，请重试', 'error');
  } finally {
    isLoadingMore.value = false;
  }
};

const handleDownload = (item) => {
  if (isExpired(item)) return;
  emit('view-result', item.hash);
};

onMounted(() => {
  fetchHistory();
});

defineExpose({
  fetchHistory
});
</script>

<style scoped>
.history-page {
  background: var(--bg-card);
  backdrop-filter: blur(20px);
  border: 1px solid var(--border-color);
  border-radius: 24px;
  padding: 28px;
  box-shadow: var(--shadow-md);
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-icon {
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

.section-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.refresh-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: var(--bg-card);
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.refresh-btn:hover:not(:disabled) {
  background: var(--bg-card-hover);
  border-color: var(--border-color-hover);
}

.refresh-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.refresh-btn .spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-state,
.error-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px 24px;
  color: var(--text-muted);
}

.loading-spinner {
  position: relative;
  width: 60px;
  height: 60px;
  margin-bottom: 24px;
}

.spinner-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 3px solid transparent;
  border-top-color: var(--accent-primary);
  border-radius: 50%;
  animation: spin 1.2s linear infinite;
}

.spinner-ring:nth-child(2) {
  width: 80%;
  height: 80%;
  top: 10%;
  left: 10%;
  border-top-color: var(--accent-secondary);
  animation-delay: -0.4s;
}

.spinner-ring:nth-child(3) {
  width: 60%;
  height: 60%;
  top: 20%;
  left: 20%;
  border-top-color: #a855f7;
  animation-delay: -0.8s;
}

.error-state .error-icon {
  width: 80px;
  height: 80px;
  background: var(--error-bg);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--error-color);
  margin-bottom: 20px;
}

.error-state p {
  margin-bottom: 20px;
  color: var(--text-muted);
}

.retry-btn {
  padding: 12px 28px;
  background: var(--accent-gradient);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
}

.retry-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(99, 102, 241, 0.5);
}

.empty-state .empty-icon {
  width: 100px;
  height: 100px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-hint);
  margin-bottom: 20px;
}

.history-table-wrapper {
  overflow-x: auto;
  margin: 0 -8px;
  padding: 0 8px;
}

.history-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 8px;
  font-size: 14px;
}

.history-table th {
  text-align: center;
  padding: 14px 16px;
  background: var(--bg-card);
  color: var(--text-muted);
  font-weight: 600;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.history-table th:first-child {
  border-radius: 12px 0 0 12px;
}

.history-table th:last-child {
  border-radius: 0 12px 12px 0;
}

.history-table td {
  padding: 18px 16px;
  background: var(--bg-card);
  vertical-align: middle;
  text-align: center;
  transition: background 0.3s;
}

.history-table td:first-child {
  border-radius: 12px 0 0 12px;
}

.history-table td:last-child {
  border-radius: 0 12px 12px 0;
}

.history-table tr:hover td {
  background: var(--bg-card-hover);
}

.date-cell {
  white-space: nowrap;
  color: var(--text-muted);
  font-size: 13px;
}

.filename-cell {
  max-width: 300px;
  min-width: 150px;
  color: var(--text-primary);
  font-weight: 500;
  word-break: break-word;
  line-height: 1.5;
}

.type-cell {
  color: var(--text-secondary);
  white-space: nowrap;
  min-width: 280px;
}

.status-cell {
  min-width: 100px;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-badge.available {
  background: var(--success-bg);
  color: var(--success-color);
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.status-badge.expired {
  background: var(--error-bg);
  color: var(--error-color);
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.action-cell {
  min-width: 160px;
  white-space: nowrap;
}

.action-buttons {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  border: none;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.view-btn {
  background: rgba(99, 102, 241, 0.15);
  color: var(--accent-primary);
  border: 1px solid rgba(99, 102, 241, 0.3);
}

.view-btn:hover {
  background: rgba(99, 102, 241, 0.25);
  border-color: rgba(99, 102, 241, 0.5);
}

.view-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.load-more {
  text-align: center;
  margin-top: 28px;
  padding-top: 20px;
  border-top: 1px solid var(--border-color);
}

.load-more-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 32px;
  background: var(--bg-card);
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.load-more-btn:hover:not(:disabled) {
  background: var(--bg-card-hover);
  border-color: var(--border-color-hover);
}

.load-more-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.spinner-small {
  animation: spin 1s linear infinite;
}

@media (max-width: 768px) {
  .history-page {
    padding: 20px;
    border-radius: 20px;
  }

  .history-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .refresh-btn {
    width: 100%;
    justify-content: center;
  }

  .history-table {
    font-size: 13px;
  }

  .history-table th,
  .history-table td {
    padding: 12px 10px;
  }

  .filename-cell {
    max-width: 180px;
    min-width: 100px;
  }

  .status-cell {
    min-width: 80px;
  }

  .status-badge {
    padding: 6px 12px;
    font-size: 11px;
  }

  .action-cell {
    min-width: 120px;
  }

  .action-buttons {
    flex-direction: column;
    gap: 8px;
  }

  .action-btn {
    justify-content: center;
    padding: 8px 12px;
    font-size: 12px;
  }
}
</style>
