// 分离模型配置
export const separationModels = [
  {
    id: 48,
    name: 'MelBand Roformer',
    description: '人声 / 伴奏分离',

    addOpt1Label: '模型类型',
    addOpt1Options: [
      { value: '0', label: 'Kimberley Jensen edition', sdr: '人声: 11.01, 伴奏: 17.32' },
      { value: '1', label: 'ver 2024.08', sdr: '人声: 11.17, 伴奏: 17.48' },
      { value: '2', label: 'Bas Curtiz edition', sdr: '人声: 11.18, 伴奏: 17.49' },
      { value: '3', label: 'unwa Instrumental v1', sdr: '人声: 10.24, 伴奏: 16.54' },
      { value: '5', label: 'unwa Instrumental v1e', sdr: '人声: 10.05, 伴奏: 16.36' },
      { value: '6', label: 'unwa big beta v5e', sdr: '人声: 10.59, 伴奏: 16.89' },
      { value: '4', label: 'ver 2024.10 ', sdr: '人声: 11.28, 伴奏: 17.59' },
      { value: '7', label: 'becruily instrum high fullness', sdr: '伴奏: 16.47' },
      { value: '8', label: 'becruily vocals high fullness', sdr: '人声: 10.55' },
      { value: '9', label: 'unwa Instrumental v1e plus', sdr: '人声: 10.33, 伴奏: 16.64', recommended: true },
      { value: '10', label: 'gabox Instrumental v7', sdr: '人声: 10.32, 伴奏: 16.63' },
      { value: '11', label: 'becruily deux', sdr: '人声: 11.35, 伴奏: 17.66' }
    ]
  },
  {
    id: 49,
    name: 'MVSep Karaoke',
    description: '主唱 / 伴唱分离',
    isDefault: true,
    addOpt1Label: '模型类型',
    addOpt1Options: [
      { value: '0', label: 'Model by viperx and aufr33', sdr: '9.45' },
      { value: '1', label: 'Model by becruily', sdr: '9.61' },
      { value: '2', label: 'Model by gabox', sdr: '9.67' },
      { value: '3', label: 'Model fuzed gabox & aufr33/viperx', sdr: '9.85' },
      { value: '4', label: 'SCNet XL IHF by becruily', sdr: '9.53' },
      { value: '5', label: 'BS Roformer by frazer and becruily', sdr: '10.11' },
      { value: '6', label: 'BS Roformer by MVSep Team ', sdr: '10.41', recommended: true },
      { value: '7', label: 'BS Roformer by anvuew', sdr: '10.22' }
    ],
    addOpt2Label: '提取类型',
    addOpt2Options: [
      { value: '0', label: '直接使用' },
      { value: '1', label: '先提取人声' }
    ]
  },
  {
    id: 34,
    name: 'MVSep Crowd Removal',
    description: '人群噪音 / 其他分离',
    addOpt1Label: '模型类型',
    addOpt1Options: [
      { value: '8', label: 'MDX23C v1', sdr: '人群: 5.57' },
      { value: '9', label: 'MDX23C v2', sdr: '人群: 6.06' },
      { value: '0', label: 'Mel Roformer', sdr: '人群: 6.07' },
      { value: '1', label: 'Ensemble MDX23C + Mel Roformer', sdr: '人群: 6.27' },
      { value: '2', label: 'BS Roformer ', sdr: '人群: 7.21', recommended: true }
    ]
  },
];

// 输出格式配置
export const outputFormats = [
  { value: '0', label: 'MP3 (320 kbps)', description: '高质量MP3格式' },
  { value: '1', label: 'WAV (uncompressed, 16 bit)', description: '未压缩WAV格式' },
  { value: '2', label: 'FLAC (lossless, 16 bit)', description: '无损FLAC格式' },
  { value: '3', label: 'M4A (lossy)', description: 'M4A有损格式' }
];

// 支持的音频格式
export const supportedAudioFormats = [
  '.mp3', '.wav', '.flac', '.ogg', '.m4a', '.aac', '.wma'
];

// 最大文件大小 (100MB)
export const maxFileSize = 100 * 1024 * 1024;

// 获取默认模型
export const getDefaultModel = () => {
  return separationModels.find(m => m.isDefault) || separationModels[0];
};

// 根据ID获取模型
export const getModelById = (id) => {
  return separationModels.find(m => m.id === parseInt(id));
};

// 根据算法名称推断 sep_type
export const getSepTypeFromAlgorithm = (algorithm) => {
  if (!algorithm) return null;
  
  const lowerAlg = algorithm.toLowerCase();
  
  // 根据关键词匹配模型
  if (lowerAlg.includes('melband') || lowerAlg.includes('roformer')) {
    if (lowerAlg.includes('vocal') || lowerAlg.includes('instrumental')) {
      return '48';
    }
  }
  
  if (lowerAlg.includes('karaoke')) {
    return '49';
  }
  
  if (lowerAlg.includes('crowd')) {
    return '34';
  }
  
  // 默认返回 null，让文件名映射函数从 URL 推断
  return null;
};

// 从文件名中提取显示名称
// 格式示例: 20260322103724-xxx-song_roformer_karaoke_mt_6_vocals-lead.mp3
// 提取 mt_数字_ 后面的部分: vocals-lead
const extractDisplayName = (fileName) => {
  if (!fileName) return null;
  
  // 先移除扩展名
  const nameWithoutExt = fileName.replace(/\.[^/.]+$/, '');
  
  // 匹配 mt_数字_ 后面的内容
  const match = nameWithoutExt.match(/mt_\d+_(.+)$/);
  if (match && match[1]) {
    return match[1];
  }
  
  // 如果没有匹配到 mt_数字_ 格式，返回去除扩展名的原名
  return nameWithoutExt;
};

// 根据模型类型获取输出文件名映射
export const getOutputFileNames = (modelId, files) => {
  if (!files || !files.length) {
    return [];
  }
  
  return files.map((file, index) => {
    // 优先使用 API 返回的文件名
    if (file.name && file.name.trim()) {
      const displayName = extractDisplayName(file.name);
      return { ...file, displayName };
    }
    
    // 如果 API 没有返回名称，尝试从 URL 中提取
    if (file.url) {
      const urlFileName = decodeURIComponent(file.url.split('/').pop().split('?')[0]);
      const displayName = extractDisplayName(urlFileName);
      
      if (displayName) {
        return { ...file, name: urlFileName, displayName };
      }
    }
    
    // 默认名称
    return { ...file, name: `音频文件 ${index + 1}`, displayName: `音频文件 ${index + 1}` };
  });
};
