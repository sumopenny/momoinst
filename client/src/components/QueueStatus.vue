<template>
  <div class="queue-status">
    <div class="status-card" :class="statusClass">
      <div class="status-header">
        <div class="status-icon">
          <div v-if="status === 'waiting'" class="icon-spinner waiting">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <div v-else-if="status === 'processing'" class="icon-spinner processing">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
          </div>
          <div v-else-if="status === 'distributing'" class="icon-spinner distributing">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
            </svg>
          </div>
          <div v-else-if="status === 'merging'" class="icon-spinner merging">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="7" height="7"/>
              <rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/>
            </svg>
          </div>
          <div v-else-if="status === 'done'" class="icon-done">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <div v-else-if="status === 'failed'" class="icon-failed">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
          </div>
        </div>
        <div class="status-text">
          <h3>{{ statusTitle }}</h3>
          <p v-if="statusMessage">{{ statusMessage }}</p>
        </div>
      </div>

      <div v-if="status === 'waiting' || status === 'distributing'" class="queue-info">
        <div class="queue-item">
          <span class="queue-label">队列位置</span>
          <span class="queue-value">{{ queueData.current_order || '-' }} / {{ queueData.queue_count || '-' }}</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
          <div class="progress-glow" :style="{ width: progressPercent + '%' }"></div>
        </div>
      </div>

      <div v-if="status === 'distributing'" class="chunk-info">
        <div class="chunk-progress">
          <span>处理进度</span>
          <span>{{ queueData.finished_chunks || 0 }} / {{ queueData.all_chunks || 0 }}</span>
        </div>
        <div class="progress-bar secondary">
          <div class="progress-fill" :style="{ width: chunkProgressPercent + '%' }"></div>
        </div>
      </div>

      <div v-if="status === 'processing'" class="processing-animation">
        <div class="wave">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <p>正在分离音频，请稍候...</p>
      </div>

      <div v-if="status === 'failed'" class="error-info">
        <p>{{ queueData.message || '处理失败，请重试' }}</p>
      </div>
    </div>

    <div v-if="showQueueInfo && globalQueue" class="global-queue">
      <h4>
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
        </svg>
        全局队列状态
      </h4>
      <div class="queue-stats">
        <div class="stat-item">
          <div class="stat-value">{{ globalQueue.in_process || 0 }}</div>
          <div class="stat-label">处理中</div>
        </div>
        <div class="stat-item premium">
          <div class="stat-value">{{ globalQueue.premium || 0 }}</div>
          <div class="stat-label">Premium</div>
        </div>
        <div class="stat-item registered">
          <div class="stat-value">{{ globalQueue.registered || 0 }}</div>
          <div class="stat-label">注册用户</div>
        </div>
        <div class="stat-item guest">
          <div class="stat-value">{{ globalQueue.unregistered || 0 }}</div>
          <div class="stat-label">访客</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  status: {
    type: String,
    default: 'waiting'
  },
  queueData: {
    type: Object,
    default: () => ({})
  },
  globalQueue: {
    type: Object,
    default: null
  },
  showQueueInfo: {
    type: Boolean,
    default: true
  }
});

const statusClass = computed(() => {
  return `status-${props.status}`;
});

const statusTitle = computed(() => {
  const titles = {
    waiting: '排队中',
    processing: '处理中',
    distributing: '分发中',
    merging: '合并中',
    done: '处理完成',
    failed: '处理失败'
  };
  return titles[props.status] || '未知状态';
});

const statusMessage = computed(() => {
  return props.queueData.message || '';
});

const progressPercent = computed(() => {
  if (!props.queueData.queue_count || !props.queueData.current_order) return 0;
  const total = props.queueData.queue_count;
  const current = props.queueData.current_order;
  return Math.round(((total - current) / total) * 100);
});

const chunkProgressPercent = computed(() => {
  if (!props.queueData.all_chunks || !props.queueData.finished_chunks) return 0;
  return Math.round((props.queueData.finished_chunks / props.queueData.all_chunks) * 100);
});
</script>

<style scoped>
.queue-status {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.status-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 28px;
  position: relative;
  overflow: hidden;
}

.status-card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  border-radius: 4px 0 0 4px;
}

.status-card.status-waiting::before { background: linear-gradient(180deg, #f59e0b, #fbbf24); }
.status-card.status-processing::before { background: var(--accent-gradient); }
.status-card.status-distributing::before { background: linear-gradient(180deg, #8b5cf6, #a855f7); }
.status-card.status-merging::before { background: linear-gradient(180deg, #3b82f6, #60a5fa); }
.status-card.status-done::before { background: linear-gradient(180deg, #10b981, #34d399); }
.status-card.status-failed::before { background: linear-gradient(180deg, #ef4444, #f87171); }

.status-header {
  display: flex;
  align-items: flex-start;
  gap: 20px;
}

.status-icon {
  flex-shrink: 0;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  position: relative;
}

.status-waiting .status-icon {
  background: var(--warning-bg);
  color: #fbbf24;
}

.status-processing .status-icon {
  background: rgba(99, 102, 241, 0.15);
  color: var(--accent-primary);
}

.status-distributing .status-icon {
  background: rgba(139, 92, 246, 0.15);
  color: #a78bfa;
}

.status-merging .status-icon {
  background: rgba(59, 130, 246, 0.15);
  color: #60a5fa;
}

.status-done .status-icon {
  background: var(--success-bg);
  color: var(--success-color);
}

.status-failed .status-icon {
  background: var(--error-bg);
  color: var(--error-color);
}

.icon-spinner {
  animation: spin 2s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.icon-done, .icon-failed {
  animation: scaleIn 0.5s ease;
}

@keyframes scaleIn {
  from { transform: scale(0); }
  to { transform: scale(1); }
}

.status-text h3 {
  margin: 0 0 6px;
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
}

.status-text p {
  margin: 0;
  font-size: 14px;
  color: var(--text-muted);
}

.queue-info {
  margin-top: 24px;
}

.queue-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}

.queue-label {
  font-size: 14px;
  color: var(--text-muted);
}

.queue-value {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
}

.progress-bar {
  height: 10px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 5px;
  overflow: hidden;
  position: relative;
}

.progress-fill {
  height: 100%;
  background: var(--accent-gradient);
  border-radius: 5px;
  transition: width 0.5s ease;
  position: relative;
}

.progress-glow {
  position: absolute;
  top: 0;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: progressGlow 2s ease infinite;
  border-radius: 5px;
}

@keyframes progressGlow {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(400%); }
}

.progress-bar.secondary .progress-fill {
  background: linear-gradient(90deg, #10b981, #34d399);
}

.chunk-info {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid var(--border-color);
}

.chunk-progress {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: var(--text-muted);
  margin-bottom: 10px;
}

.processing-animation {
  margin-top: 24px;
  text-align: center;
}

.wave {
  display: flex;
  justify-content: center;
  gap: 6px;
  height: 50px;
  align-items: center;
}

.wave span {
  width: 6px;
  height: 100%;
  background: var(--accent-gradient);
  border-radius: 3px;
  animation: wave 1.2s ease-in-out infinite;
}

.wave span:nth-child(2) { animation-delay: 0.1s; }
.wave span:nth-child(3) { animation-delay: 0.2s; }
.wave span:nth-child(4) { animation-delay: 0.3s; }
.wave span:nth-child(5) { animation-delay: 0.4s; }

@keyframes wave {
  0%, 100% { transform: scaleY(0.4); }
  50% { transform: scaleY(1); }
}

.processing-animation p {
  margin-top: 20px;
  font-size: 14px;
  color: var(--text-muted);
}

.error-info {
  margin-top: 20px;
  padding: 16px;
  background: var(--error-bg);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 12px;
}

.error-info p {
  margin: 0;
  font-size: 14px;
  color: var(--error-color);
}

.global-queue {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 20px;
}

.global-queue h4 {
  margin: 0 0 18px;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 10px;
}

.global-queue h4 svg {
  color: var(--accent-primary);
}

.queue-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.stat-item {
  text-align: center;
  padding: 16px 12px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  transition: all 0.3s;
}

.stat-item:hover {
  background: var(--bg-card-hover);
  transform: translateY(-2px);
}

.stat-value {
  font-size: 28px;
  font-weight: 800;
  color: var(--accent-primary);
  margin-bottom: 4px;
}

.stat-item.premium .stat-value { color: #fbbf24; }
.stat-item.registered .stat-value { color: var(--success-color); }
.stat-item.guest .stat-value { color: #f472b6; }

.stat-label {
  font-size: 11px;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 500;
}

@media (max-width: 640px) {
  .queue-stats {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .status-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .status-icon {
    width: 64px;
    height: 64px;
  }
}
</style>
