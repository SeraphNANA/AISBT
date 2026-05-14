<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuizStore } from '@/stores/quiz'
import { RotateCcw, Sparkles, Brain, Heart, Share2, Link2 } from 'lucide-vue-next'

const router = useRouter()
const quizStore = useQuizStore()

// GitHub Pages部署后的URL
const SHARE_URL = 'https://seraphnana.github.io/AISBTI/'

const levelData = computed(() => quizStore.getLevelData())
const personaData = computed(() => quizStore.getPersonaData())

const characterImage = computed(() => {
  if (!personaData.value?.image) return null
  return `/images/characters/${personaData.value.image}`
})

// 打字机效果状态
const typedText = ref('')
const showMbtiResult = ref(false)
const currentMbti = computed(() => quizStore.detectedMbti)

// 区块动画状态
const showBlock1 = ref(false)
const showBlock2 = ref(false)
const showBlock3 = ref(false)
const showRest = ref(false)

// 打字机效果
const typeWriter = async (text: string, speed: number = 80) => {
  for (let i = 0; i < text.length; i++) {
    typedText.value += text.charAt(i)
    await new Promise(resolve => setTimeout(resolve, speed))
  }
}

// 检查浏览器是否支持Web Share API
const hasWebShare = computed(() => {
  return 'share' in navigator
})

// 生成分享文案
const shareText = computed(() => {
  return `🦞 我在 AISBT 测试中获得了：L${levelData.value?.level} ${levelData.value?.title}！
人设称号：${personaData.value?.name}
MBTI：${quizStore.detectedMbti}
得分：${quizStore.totalScore}

快来测测你的 AI 认知段位吧！${SHARE_URL}`
})

// 使用Web Share API分享（支持微信等）
const shareResult = async () => {
  try {
    await navigator.share({
      title: `我的 AI 段位：L${levelData.value?.level}`,
      text: shareText.value,
      url: SHARE_URL
    })
  } catch {
    // 如果不支持Web Share，降级到复制
    try {
      await navigator.clipboard.writeText(shareText.value)
      alert('结果已复制到剪贴板！快去发给你的朋友吧～')
    } catch {
      alert('分享失败，请截图分享')
    }
  }
}

const restart = () => {
  quizStore.reset()
  router.push('/')
}

// 页面加载时执行动画
onMounted(async () => {
  await typeWriter('AI偷偷分析你的MBTI其实是...')
  await new Promise(resolve => setTimeout(resolve, 800))
  showMbtiResult.value = true
  await new Promise(resolve => setTimeout(resolve, 500))
  showBlock1.value = true
  await new Promise(resolve => setTimeout(resolve, 300))
  showBlock2.value = true
  await new Promise(resolve => setTimeout(resolve, 300))
  showBlock3.value = true
  await new Promise(resolve => setTimeout(resolve, 300))
  showRest.value = true
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/30 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s;"></div>
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style="animation-delay: 2s;"></div>
    </div>
    
    <div class="relative z-10 w-full max-w-lg">
      <div class="text-center mb-6">
        <div class="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-full border border-purple-500/30 mb-4">
          <Sparkles class="w-4 h-4 text-purple-400" />
          <span class="text-sm text-purple-300">测试完成</span>
        </div>
      </div>
      
      <div class="bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-6 md:p-8 shadow-2xl">
        <div class="text-center mb-6">
          <div class="text-6xl md:text-7xl font-black mb-2">
            <span class="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              L{{ levelData?.level }}
            </span>
          </div>
          <h1 class="text-2xl md:text-3xl font-bold text-white mb-2">{{ levelData?.title }}</h1>
          <p class="text-slate-400">{{ personaData?.name }}</p>
        </div>
        
        <div class="w-40 h-40 mx-auto mb-6 rounded-2xl overflow-hidden border-2 border-purple-500/30 shadow-lg shadow-purple-500/20">
          <img 
            v-if="characterImage" 
            :src="characterImage" 
            :alt="personaData?.name"
            class="w-full h-full object-cover"
          />
          <div v-else class="w-full h-full bg-slate-800/30 flex items-center justify-center">
            <div class="text-center text-slate-500">
              <div class="text-4xl mb-2">🦞</div>
              <div class="text-xs">小龙虾</div>
            </div>
          </div>
        </div>
        
        <div class="flex justify-center gap-2 mb-6">
          <span class="px-3 py-1 bg-purple-500/20 text-purple-300 text-sm rounded-full border border-purple-500/30">
            {{ quizStore.mbti || quizStore.detectedMbti }}
          </span>
          <span class="px-3 py-1 bg-cyan-500/20 text-cyan-300 text-sm rounded-full border border-cyan-500/30">
            得分: {{ quizStore.totalScore }}
          </span>
        </div>
        
        <!-- MBTI彩蛋动画区域 -->
        <div class="mb-6 p-4 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-xl border border-pink-500/20">
          <div class="text-center">
            <p class="text-pink-300 text-sm mb-2">
              {{ typedText }}<span class="animate-pulse">|</span>
            </p>
            <p 
              v-if="showMbtiResult"
              class="text-2xl font-bold bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent animate-bounce"
            >
              「{{ currentMbti }}」
            </p>
          </div>
        </div>
        
        <div class="space-y-4 mb-6">
          <div 
            class="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/30 transition-all duration-500"
            :class="showBlock1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
          >
            <div class="flex items-center gap-2 mb-2">
              <Brain class="w-4 h-4 text-cyan-400" />
              <span class="text-sm font-medium text-cyan-400">专业能力评级</span>
            </div>
            <p class="text-slate-300 text-sm leading-relaxed">{{ levelData?.professionalDesc }}</p>
          </div>
          
          <div 
            class="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/30 transition-all duration-500"
            :class="showBlock2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
          >
            <div class="flex items-center gap-2 mb-2">
              <Sparkles class="w-4 h-4 text-purple-400" />
              <span class="text-sm font-medium text-purple-400">AI 能力吐槽解读</span>
            </div>
            <p class="text-slate-300 text-sm leading-relaxed">{{ personaData?.aiAbilityDesc }}</p>
          </div>
          
          <div 
            class="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/30 transition-all duration-500"
            :class="showBlock3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
          >
            <div class="flex items-center gap-2 mb-2">
              <Heart class="w-4 h-4 text-pink-400" />
              <span class="text-sm font-medium text-pink-400">MBTI 性格联动解读</span>
            </div>
            <p class="text-slate-300 text-sm leading-relaxed">{{ personaData?.personalityDesc }}</p>
          </div>
        </div>
        
        <!-- 分享区域 -->
        <div 
          class="mb-6 p-4 bg-slate-800/30 rounded-xl border border-slate-700/30 transition-all duration-500"
          :class="showRest ? 'opacity-100' : 'opacity-0'"
        >
          <div class="flex items-center gap-2 mb-3">
            <Link2 class="w-4 h-4 text-slate-400" />
            <span class="text-sm text-slate-400">分享给朋友</span>
          </div>
          <p class="text-slate-300 text-xs leading-relaxed mb-4">{{ shareText }}</p>
        </div>
        
        <div 
          class="grid grid-cols-2 gap-3 transition-all duration-500"
          :class="showRest ? 'opacity-100' : 'opacity-0'"
        >
          <button
            @click="shareResult"
            class="flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-2xl transition-all"
          >
            <Share2 class="w-4 h-4" />
            分享
          </button>
          <button
            @click="restart"
            class="flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-2xl transition-all"
          >
            <RotateCcw class="w-4 h-4" />
            再测一次
          </button>
        </div>
      </div>
      
      <p class="text-center text-slate-500 text-xs mt-4">
        AISBT - AI 认知段位趣味测试
      </p>
    </div>
  </div>
</template>
