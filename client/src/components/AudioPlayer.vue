<template>
  <div class="audio-player">
    <div class="player-header">
      <div class="track-info">
        <div class="track-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 18V5l12-2v13"/>
            <circle cx="6" cy="18" r="3"/>
            <circle cx="18" cy="16" r="3"/>
          </svg>
        </div>
        <div class="track-details">
          <h4 class="track-name">{{ name }}</h4>
          <span class="track-size" v-if="size">{{ size }}</span>
        </div>
      </div>
      <a :href="url" :download="name" class="download-btn" @click="$emit('download')">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="7 10 12 15 17 10"/>
          <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
        <span>下载</span>
      </a>
    </div>

    <div class="player-controls">
      <button class="play-btn" @click="togglePlay" :disabled="!isLoaded">
        <svg v-if="isPlaying" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <rect x="6" y="4" width="4" height="16"/>
          <rect x="14" y="4" width="4" height="16"/>
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="5 3 19 12 5 21 5 3"/>
        </svg>
      </button>

      <div class="progress-container">
        <span class="time current">{{ formatTime(currentTime) }}</span>
        <div class="progress-bar" @click="seek" ref="progressBar">
          <div class="progress-bg"></div>
          <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
          <div class="progress-glow" :style="{ width: progressPercent + '%' }"></div>
          <div class="progress-handle" :style="{ left: progressPercent + '%' }"></div>
        </div>
        <span class="time duration">{{ formatTime(duration) }}</span>
      </div>

      <div class="volume-control">
        <button class="volume-btn" @click="toggleMute">
          <svg v-if="isMuted || volume === 0" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
            <line x1="23" y1="9" x2="17" y2="15"/>
            <line x1="17" y1="9" x2="23" y2="15"/>
          </svg>
          <svg v-else-if="volume < 0.5" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
          </svg>
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          v-model="volume"
          @input="changeVolume"
          class="volume-slider"
        />
      </div>
    </div>

    <audio
      ref="audioElement"
      :src="url"
      @loadedmetadata="onLoaded"
      @timeupdate="onTimeUpdate"
      @ended="onEnded"
      @error="onError"
      preload="metadata"
    ></audio>
  </div>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from 'vue';

const props = defineProps({
  url: {
    type: String,
    required: true
  },
  name: {
    type: String,
    default: '音频文件'
  },
  size: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['download', 'error']);

const audioElement = ref(null);
const progressBar = ref(null);
const isPlaying = ref(false);
const isLoaded = ref(false);
const currentTime = ref(0);
const duration = ref(0);
const volume = ref(1);
const isMuted = ref(false);
const previousVolume = ref(1);

const progressPercent = computed(() => {
  if (duration.value === 0) return 0;
  return (currentTime.value / duration.value) * 100;
});

const togglePlay = () => {
  if (!audioElement.value) return;
  
  if (isPlaying.value) {
    audioElement.value.pause();
  } else {
    audioElement.value.play();
  }
  isPlaying.value = !isPlaying.value;
};

const toggleMute = () => {
  if (isMuted.value) {
    volume.value = previousVolume.value;
    isMuted.value = false;
  } else {
    previousVolume.value = volume.value;
    volume.value = 0;
    isMuted.value = true;
  }
  if (audioElement.value) {
    audioElement.value.volume = volume.value;
  }
};

const changeVolume = () => {
  if (audioElement.value) {
    audioElement.value.volume = volume.value;
  }
  isMuted.value = volume.value === 0;
};

const seek = (event) => {
  if (!audioElement.value || !progressBar.value) return;
  
  const rect = progressBar.value.getBoundingClientRect();
  const percent = (event.clientX - rect.left) / rect.width;
  const newTime = percent * duration.value;
  
  audioElement.value.currentTime = newTime;
  currentTime.value = newTime;
};

const onLoaded = () => {
  isLoaded.value = true;
  duration.value = audioElement.value.duration;
};

const onTimeUpdate = () => {
  if (audioElement.value) {
    currentTime.value = audioElement.value.currentTime;
  }
};

const onEnded = () => {
  isPlaying.value = false;
  currentTime.value = 0;
};

const onError = () => {
  emit('error', '音频加载失败');
};

const formatTime = (seconds) => {
  if (isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

watch(() => props.url, () => {
  isPlaying.value = false;
  isLoaded.value = false;
  currentTime.value = 0;
  duration.value = 0;
});

onUnmounted(() => {
  if (audioElement.value) {
    audioElement.value.pause();
  }
});
</script>

<style scoped>
.audio-player {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 20px;
  transition: all 0.3s;
}

.audio-player:hover {
  background: var(--bg-card-hover);
  border-color: var(--border-color-hover);
}

.player-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
}

.track-info {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
  flex: 1;
}

.track-icon {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent-primary);
  flex-shrink: 0;
}

.track-details {
  min-width: 0;
}

.track-name {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.track-size {
  font-size: 12px;
  color: var(--text-muted);
  margin-top: 2px;
  display: block;
}

.download-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: var(--accent-gradient);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s;
  flex-shrink: 0;
  box-shadow: 0 4px 14px rgba(99, 102, 241, 0.3);
}

.download-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
}

.player-controls {
  display: flex;
  align-items: center;
  gap: 14px;
}

.play-btn {
  width: 48px;
  height: 48px;
  background: var(--accent-gradient);
  color: white;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  flex-shrink: 0;
  box-shadow: 0 4px 14px rgba(99, 102, 241, 0.4);
}

.play-btn:hover:not(:disabled) {
  transform: scale(1.08);
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.5);
}

.play-btn:active:not(:disabled) {
  transform: scale(1.02);
}

.play-btn:disabled {
  background: #374151;
  cursor: not-allowed;
  box-shadow: none;
}

.progress-container {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
}

.time {
  font-size: 12px;
  color: var(--text-muted);
  min-width: 42px;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
}

.time.current {
  text-align: right;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: transparent;
  cursor: pointer;
  position: relative;
  border-radius: 4px;
}

.progress-bg {
  position: absolute;
  inset: 0;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 4px;
}

.progress-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: var(--accent-gradient);
  border-radius: 4px;
  transition: width 0.1s;
}

.progress-glow {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  border-radius: 4px;
  animation: progressGlow 2s ease infinite;
  pointer-events: none;
}

@keyframes progressGlow {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(400%); }
}

.progress-handle {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 16px;
  height: 16px;
  background: white;
  border: 3px solid var(--accent-primary);
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.2s, transform 0.2s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.progress-bar:hover .progress-handle {
  opacity: 1;
}

.progress-bar:hover .progress-handle:hover {
  transform: translate(-50%, -50%) scale(1.2);
}

.volume-control {
  display: flex;
  align-items: center;
  gap: 8px;
}

.volume-btn {
  background: none;
  border: none;
  padding: 6px;
  cursor: pointer;
  color: var(--text-muted);
  transition: color 0.2s;
  border-radius: 8px;
}

.volume-btn:hover {
  color: var(--accent-primary);
  background: rgba(99, 102, 241, 0.1);
}

.volume-slider {
  width: 80px;
  height: 4px;
  appearance: none;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 2px;
  cursor: pointer;
}

.volume-slider::-webkit-slider-thumb {
  appearance: none;
  width: 14px;
  height: 14px;
  background: var(--accent-gradient);
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(99, 102, 241, 0.4);
  transition: transform 0.2s;
}

.volume-slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
}

.volume-slider::-moz-range-thumb {
  width: 14px;
  height: 14px;
  background: var(--accent-gradient);
  border-radius: 50%;
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 6px rgba(99, 102, 241, 0.4);
}

@media (max-width: 640px) {
  .player-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 14px;
  }
  
  .download-btn {
    width: 100%;
    justify-content: center;
  }
  
  .player-controls {
    flex-wrap: wrap;
  }
  
  .progress-container {
    width: 100%;
    order: 1;
  }
  
  .volume-control {
    order: 2;
    margin-left: auto;
  }
  
  .volume-slider {
    width: 60px;
  }
}
</style>
