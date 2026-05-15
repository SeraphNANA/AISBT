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
  <div class="min-h-screen bg-gradient-to-br from-slate-950 via-purple-900/50 to-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-60 -right-60 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute -bottom-60 -left-60 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s;"></div>
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-pink-500/10 rounded-full blur-3xl animate-pulse" style="animation-delay: 2s;"></div>
      
      <div class="absolute top-20 left-10 w-2 h-2 bg-purple-400/40 rounded-full animate-ping"></div>
      <div class="absolute top-40 right-20 w-3 h-3 bg-cyan-400/40 rounded-full animate-ping" style="animation-delay: 0.5s;"></div>
      <div class="absolute bottom-32 left-1/4 w-2 h-2 bg-pink-400/40 rounded-full animate-ping" style="animation-delay: 1s;"></div>
    </div>
    
    <div class="relative z-10 w-full max-w-lg">
      <div class="text-center mb-10">
        <div class="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-cyan-500/20 rounded-full border border-purple-500/30 mb-8 backdrop-blur-sm">
          <Sparkles class="w-4 h-4 text-purple-400" />
          <span class="text-sm font-medium text-purple-300">AI 认知段位测试</span>
        </div>
        
        <h1 class="text-5xl md:text-7xl font-black mb-4 tracking-tight">
          <span class="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-lg">AISBT</span>
        </h1>
        
        <p class="text-slate-400 text-lg md:text-xl mb-2 font-light">AI 认知段位趣味测试</p>
        <p class="text-slate-500 text-sm">专业试题19道 + 趣味测试6道</p>
      </div>
      
      <div class="bg-slate-900/40 backdrop-blur-xl rounded-3xl border border-slate-700/40 p-6 md:p-8 shadow-2xl shadow-purple-500/5">
        <div class="flex items-center gap-3 mb-7">
          <div class="p-2 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-xl">
            <Brain class="w-5 h-5 text-cyan-400" />
          </div>
          <h2 class="text-lg font-semibold text-white">选择你的 MBTI 类型</h2>
        </div>
        
        <div class="relative mb-7">
          <div class="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-2xl blur-sm"></div>
          <select 
            v-model="selectedMBTI"
            class="relative w-full px-5 py-4 bg-slate-800/60 backdrop-blur-md border border-slate-600/40 rounded-2xl text-white text-lg appearance-none cursor-pointer focus:outline-none focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/15 transition-all duration-300 hover:border-slate-500/50"
          >
            <option value="" disabled class="bg-slate-800 text-slate-400">点击选择 MBTI 类型</option>
            <option v-for="type in mbtiTypes" :key="type" :value="type" class="bg-slate-800 text-white">{{ type }}</option>
          </select>
          <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg class="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
        
        <div class="grid grid-cols-2 gap-4 mb-7">
          <div class="relative">
            <div class="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-2xl blur-md opacity-100"></div>
            <div class="relative bg-slate-800/50 backdrop-blur-md rounded-2xl p-5 border border-pink-500/30">
              <div class="text-center">
                <div class="text-3xl font-bold bg-gradient-to-r from-pink-400 to-pink-300 bg-clip-text text-transparent mb-2">19</div>
                <div class="text-xs text-slate-400 font-medium tracking-wider uppercase">专业试题</div>
              </div>
            </div>
          </div>
          <div class="relative">
            <div class="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-2xl blur-md opacity-100"></div>
            <div class="relative bg-slate-800/50 backdrop-blur-md rounded-2xl p-5 border border-cyan-500/30">
              <div class="text-center">
                <div class="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-cyan-300 bg-clip-text text-transparent mb-2">6</div>
                <div class="text-xs text-slate-400 font-medium tracking-wider uppercase">趣味测试</div>
              </div>
            </div>
          </div>
        </div>
        
        <button
          @click="startQuiz"
          :disabled="!selectedMBTI"
          class="relative w-full py-5 px-6 overflow-hidden rounded-2xl transition-all duration-300"
          :class="selectedMBTI ? 'hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/20' : 'cursor-not-allowed'"
        >
          <div 
            class="absolute inset-0 transition-all duration-300"
            :class="selectedMBTI 
              ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 hover:from-purple-500 hover:via-pink-500 hover:to-cyan-500' 
              : 'bg-gradient-to-r from-slate-700 to-slate-600'"
          ></div>
          <div 
            v-if="selectedMBTI"
            class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-700"
          ></div>
          <span class="relative flex items-center justify-center gap-2 text-white font-semibold text-lg">
            <Zap class="w-5 h-5" />
            开始测试
          </span>
        </button>
        
        <p class="text-center text-slate-500 text-xs mt-5">
          纯前端运行，不收集任何个人数据
        </p>
      </div>
    </div>
  </div>
</template>
