<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuizStore } from '@/stores/quiz'
import { Sparkles, Brain, Zap } from 'lucide-vue-next'

const router = useRouter()
const quizStore = useQuizStore()

const mbtiTypes = [
  'INTJ', 'INTP', 'ENTJ', 'ENTP',
  'INFJ', 'INFP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
  'ISTP', 'ISFP', 'ESTP', 'ESFP'
]

const selectedMBTI = ref('')

const startQuiz = () => {
  if (selectedMBTI.value) {
    quizStore.setMBTI(selectedMBTI.value)
    router.push('/quiz')
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s;"></div>
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style="animation-delay: 2s;"></div>
    </div>
    
    <div class="relative z-10 w-full max-w-lg">
      <div class="text-center mb-8">
        <div class="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-full border border-purple-500/30 mb-6">
          <Sparkles class="w-4 h-4 text-purple-400" />
          <span class="text-sm text-purple-300">AI 认知段位测试</span>
        </div>
        
        <h1 class="text-5xl md:text-6xl font-black mb-4">
          <span class="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">AISBT</span>
        </h1>
        
        <p class="text-slate-400 text-lg mb-2">AI 认知段位趣味测试</p>
      </div>
      
      <div class="bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-6 md:p-8 shadow-2xl">
        <div class="flex items-center gap-3 mb-6">
          <Brain class="w-5 h-5 text-cyan-400" />
          <h2 class="text-lg font-semibold text-white">选择你的 MBTI 类型</h2>
        </div>
        
        <div class="relative mb-6">
          <select 
            v-model="selectedMBTI"
            class="w-full px-4 py-4 bg-slate-800/80 border border-slate-600/50 rounded-2xl text-white text-lg appearance-none cursor-pointer focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
          >
            <option value="" disabled>点击选择 MBTI 类型</option>
            <option v-for="type in mbtiTypes" :key="type" :value="type">{{ type }}</option>
          </select>
          <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
        
        <div class="grid grid-cols-2 gap-4 mb-6 text-center">
          <div class="bg-slate-800/50 rounded-xl p-4 border border-slate-700/30">
            <div class="text-2xl font-bold text-pink-400 mb-1">19</div>
            <div class="text-xs text-slate-500">专业试题</div>
          </div>
          <div class="bg-slate-800/50 rounded-xl p-4 border border-slate-700/30">
            <div class="text-2xl font-bold text-cyan-400 mb-1">6</div>
            <div class="text-xs text-slate-500">趣味测试</div>
          </div>
        </div>
        
        <button
          @click="startQuiz"
          :disabled="!selectedMBTI"
          class="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-semibold text-lg rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/25 disabled:hover:scale-100 disabled:hover:shadow-none flex items-center justify-center gap-2"
        >
          <Zap class="w-5 h-5" />
          开始测试
        </button>
        
        <p class="text-center text-slate-500 text-xs mt-4">
          纯前端运行，不收集任何个人数据
        </p>
      </div>
    </div>
  </div>
</template>
