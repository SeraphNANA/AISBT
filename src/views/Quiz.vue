<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuizStore } from '@/stores/quiz'
import { ChevronLeft, ChevronRight, Send } from 'lucide-vue-next'

const router = useRouter()
const quizStore = useQuizStore()

const currentQ = computed(() => quizStore.getCurrentQuestionData)
const progress = computed(() => quizStore.getProgress)
const isLast = computed(() => quizStore.getIsLastQuestion)
const hasAnswered = computed(() => quizStore.getHasAnsweredCurrent)
const currentAnswer = computed(() => currentQ.value ? quizStore.answers[currentQ.value.id] : undefined)

const selectAnswer = (index: number) => {
  if (currentQ.value) {
    quizStore.setAnswer(currentQ.value.id, index)
  }
}

const goNext = () => {
  if (isLast.value) {
    submitQuiz()
  } else {
    quizStore.nextQuestion()
  }
}

const goPrev = () => {
  quizStore.prevQuestion()
}

const submitQuiz = () => {
  quizStore.calculateResult()
  router.push('/result')
}

// 判断是否为专业题
const isProfessional = computed(() => {
  if (!currentQ.value) return false
  return currentQ.value.id < 100
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex flex-col relative overflow-hidden">
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl"></div>
    </div>
    
    <div class="relative z-10 p-4">
      <div class="max-w-2xl mx-auto">
        <div class="flex items-center justify-between mb-4">
          <span class="text-slate-400 text-sm">
            题目 {{ quizStore.currentQuestion + 1 }} / {{ quizStore.getTotalQuestions }}
          </span>
          <span class="px-3 py-1 bg-purple-500/20 text-purple-300 text-sm rounded-full border border-purple-500/30">
            {{ quizStore.mbti }}
          </span>
        </div>
        
        <div class="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-8">
          <div 
            class="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500 ease-out"
            :style="{ width: `${progress}%` }"
          ></div>
        </div>
      </div>
    </div>
    
    <div class="flex-1 flex items-center justify-center p-4 relative z-10">
      <div class="w-full max-w-2xl">
        <div v-if="currentQ" class="bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-6 md:p-8 shadow-2xl">
          <div class="mb-2">
            <span class="text-xs text-purple-400 font-medium">
              {{ isProfessional ? '专业题' : '趣味题' }}
            </span>
            <span v-if="currentQ.level" class="ml-2 text-xs text-cyan-400 font-medium">
              L{{ currentQ.level }}
            </span>
          </div>
          
          <h2 class="text-xl md:text-2xl font-semibold text-white mb-8 leading-relaxed">
            {{ currentQ.question }}
          </h2>
          
          <div class="space-y-3">
            <button
              v-for="(option, index) in currentQ.options"
              :key="index"
              @click="selectAnswer(index)"
              class="w-full p-4 text-left rounded-2xl border transition-all duration-300"
              :class="[
                currentAnswer === index
                  ? 'bg-gradient-to-r from-purple-600/30 to-pink-600/30 border-purple-500/50 text-white'
                  : 'bg-slate-800/50 border-slate-700/50 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
              ]"
            >
              <span class="inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-medium mr-3"
                :class="[
                  currentAnswer === index
                    ? 'bg-purple-500 text-white'
                    : 'bg-slate-700 text-slate-400'
                ]"
              >
                {{ String.fromCharCode(65 + index) }}
              </span>
              {{ option }}
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <div class="relative z-10 p-4 pb-8">
      <div class="max-w-2xl mx-auto flex items-center justify-between gap-4">
        <button
          @click="goPrev"
          :disabled="quizStore.currentQuestion === 0"
          class="flex items-center gap-2 px-6 py-3 bg-slate-800/80 hover:bg-slate-700 disabled:bg-slate-800/50 disabled:text-slate-600 text-white rounded-2xl transition-all disabled:cursor-not-allowed"
        >
          <ChevronLeft class="w-5 h-5" />
          上一题
        </button>
        
        <button
          v-if="!isLast"
          @click="goNext"
          :disabled="!hasAnswered"
          class="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed text-white rounded-2xl transition-all"
        >
          下一题
          <ChevronRight class="w-5 h-5" />
        </button>
        
        <button
          v-else
          @click="goNext"
          :disabled="!hasAnswered"
          class="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed text-white rounded-2xl transition-all"
        >
          提交
          <Send class="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
</template>
