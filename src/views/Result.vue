<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuizStore } from '@/stores/quiz'
import { RotateCcw, Sparkles, Brain, Heart, Share2, Link2, ChevronDown, ChevronUp, Zap, AlertCircle } from 'lucide-vue-next'
import mbtiDescriptions from '@/config/mbtiDescriptions.json'

const router = useRouter()
const quizStore = useQuizStore()

// GitHub Pages部署后的URL
const SHARE_URL = 'https://seraphnana.github.io/AISBT/'

const levelData = computed(() => quizStore.getLevelData())
const personaData = computed(() => quizStore.getPersonaData())

// 获取完整MBTI描述
const currentMbtiType = computed(() => quizStore.detectedMbti)
const mbtiInfo = computed(() => {
  const type = currentMbtiType.value as keyof typeof mbtiDescriptions
  return mbtiDescriptions[type] || null
})

// 是否展开MBTI描述
const showMbtiDetail = ref(false)

const characterImage = computed(() => {
  if (!personaData.value?.image) return null
  return `/AISBT/images/characters/${personaData.value.image}`
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
  const userMbti = quizStore.mbti || '未选择'
  const detectedMbti = quizStore.detectedMbti
  const level = levelData.value?.level || 0
  const title = levelData.value?.title || ''
  const name = personaData.value?.name || ''
  
  let prefix = ''
  if (userMbti === detectedMbti) {
    prefix = `🦐瞎给我测的还挺准：【${userMbti}】`
  } else {
    prefix = `🦞我一个【${userMbti}】，在AISBT测试中居然被AI说成是「${detectedMbti}」🤣`
  }
  
  return `${prefix}
${userMbti !== detectedMbti ? '不过' : '居然'}我获得了：AI等级L${level} ${title}！ 虾送称号：${name}
快来测测你的AI段位吧：${SHARE_URL}`
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
  await typeWriter('AI偷偷分析你的MBTI其实是……')
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
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s;"></div>
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
            得分：{{ quizStore.totalScore }}
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
            <p v-if="personaData?.professionalDescAddition" class="text-cyan-300 text-sm leading-relaxed mt-2 font-medium">
              {{ personaData?.professionalDescAddition }}
            </p>
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
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-2">
                <Heart class="w-4 h-4 text-pink-400" />
                <span class="text-sm font-medium text-pink-400">你的性格特点</span>
              </div>
              <button
                v-if="mbtiInfo"
                @click="showMbtiDetail = !showMbtiDetail"
                class="text-xs text-pink-300 hover:text-pink-200 flex items-center gap-1 transition-colors"
              >
                {{ showMbtiDetail ? '收起' : '展开详情' }}
                <ChevronDown v-if="!showMbtiDetail" class="w-3 h-3" />
                <ChevronUp v-if="showMbtiDetail" class="w-3 h-3" />
              </button>
            </div>
            
            <div v-if="mbtiInfo">
              <div class="mb-3">
                <p class="text-pink-200 text-sm font-medium mb-1">{{ mbtiInfo.name }}（{{ mbtiInfo.percentage }}）</p>
                <p class="text-slate-300 text-sm leading-relaxed">{{ mbtiInfo.description }}</p>
              </div>
              
              <div v-if="showMbtiDetail" class="space-y-3 pt-3 border-t border-slate-700/30">
                <div>
                  <div class="flex items-center gap-2 mb-2">
                    <Zap class="w-3 h-3 text-green-400" />
                    <span class="text-xs font-medium text-green-400">AI学习优势</span>
                  </div>
                  <ul class="text-slate-300 text-sm leading-relaxed space-y-1">
                    <li v-for="(adv, idx) in mbtiInfo.aiAdvantages" :key="idx" class="flex items-start gap-2">
                      <span class="text-green-400 mt-1">•</span>
                      <span>{{ adv }}</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <div class="flex items-center gap-2 mb-2">
                    <AlertCircle class="w-3 h-3 text-amber-400" />
                    <span class="text-xs font-medium text-amber-400">避坑建议</span>
                  </div>
                  <ul class="text-slate-300 text-sm leading-relaxed space-y-1">
                    <li v-for="(warn, idx) in mbtiInfo.aiWarnings" :key="idx" class="flex items-start gap-2">
                      <span class="text-amber-400 mt-1">•</span>
                      <span>{{ warn }}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <p v-else class="text-slate-300 text-sm leading-relaxed">{{ personaData?.personalityDesc }}</p>
          </div>
        </div>
        
        <div 
          class="flex gap-4 transition-all duration-500"
          :class="showRest ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
        >
          <button
            @click="shareResult"
            class="flex-1 py-4 px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold text-lg rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/25 flex items-center justify-center gap-2"
          >
            <Share2 class="w-5 h-5" />
            分享
          </button>
          
          <button
            @click="restart"
            class="relative flex-1 py-4 px-6 overflow-hidden rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-slate-500/20"
          >
            <div class="absolute inset-0 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 hover:from-slate-600 hover:via-slate-500 hover:to-slate-600 transition-all duration-300"></div>
            <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-700"></div>
            <span class="relative flex items-center justify-center gap-2 text-white font-semibold text-lg">
              <RotateCcw class="w-5 h-5" />
              再测一次
            </span>
          </button>
        </div>
      </div>
      
      <p class="text-center text-slate-500 text-xs mt-4">
        纯前端运行，不收集任何个人数据
      </p>
    </div>
  </div>
</template>
