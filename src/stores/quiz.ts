import { defineStore } from 'pinia'
import questions from '@/config/questions.json'
import levels from '@/config/levels.json'
import characters from '@/config/characters.json'

interface Question {
  id: number
  question: string
  options: string[]
  answer: number
  score: number
  level?: number
}

interface MbtiQuestion {
  id: number
  dimension: string
  question: string
  options: string[]
  mbtiMapping: string[]
  score: number
}

interface QuizState {
  mbti: string
  detectedMbti: string
  answers: Record<number, number>
  currentQuestion: number
  totalScore: number
  resultLevel: number | null
  resultPersona: string | null
  selectedQuestions: Question[]
  selectedMbtiQuestions: MbtiQuestion[]
  currentLevel: number
  consecutiveCorrect: number
  answeredInCurrentLevel: number
}

export const useQuizStore = defineStore('quiz', {
  state: (): QuizState => ({
    mbti: '',
    detectedMbti: '',
    answers: {},
    currentQuestion: 0,
    totalScore: 0,
    resultLevel: null,
    resultPersona: null,
    selectedQuestions: [],
    selectedMbtiQuestions: [],
    currentLevel: 1,
    consecutiveCorrect: 0,
    answeredInCurrentLevel: 0
  }),

  getters: {
    getQuestions: (state): Question[] => {
      if (state.selectedQuestions.length > 0) {
        return state.selectedQuestions
      }
      return [...questions.professional as Question[], ...questions.fun as Question[]]
    },
    
    getTotalQuestions: (state): number => {
      if (state.selectedQuestions.length > 0) {
        return state.selectedQuestions.length
      }
      return 25
    },
    
    getCurrentQuestionData: (state): Question | undefined => {
      const qs = state.selectedQuestions.length > 0 ? state.selectedQuestions : [...questions.professional as Question[], ...questions.fun as Question[]]
      return qs[state.currentQuestion]
    },
    
    getProgress: (state): number => {
      const total = state.selectedQuestions.length > 0 ? state.selectedQuestions.length : 25
      return ((state.currentQuestion + 1) / total) * 100
    },
    
    getIsLastQuestion: (state): boolean => {
      const total = state.selectedQuestions.length > 0 ? state.selectedQuestions.length : 25
      return state.currentQuestion >= total - 1
    },
    
    getHasAnsweredCurrent: (state): boolean => {
      const qs = state.selectedQuestions.length > 0 ? state.selectedQuestions : [...questions.professional as Question[], ...questions.fun as Question[]]
      const q = qs[state.currentQuestion]
      if (!q) return false
      return state.answers[q.id] !== undefined
    },
    
    resultCharacter(state) {
      if (!state.resultLevel || !state.resultPersona) return null
      const levelData = characters.levels.find(l => l.level === state.resultLevel)
      if (!levelData) return null
      return levelData.personas.find(p => p.id === state.resultPersona)
    }
  },

  actions: {
    setMBTI(mbti: string) {
      this.mbti = mbti
      this.generateQuestions()
    },
    
    generateMbtiQuestions() {
      const mbtiQuestions = questions.mbti as MbtiQuestion[]
      const dimensions = ['IE', 'SN', 'TF', 'JP', 'comprehensive', 'fun']
      
      const selected: MbtiQuestion[] = []
      
      dimensions.forEach(dim => {
        const pool = mbtiQuestions.filter(q => q.dimension === dim)
        if (pool.length > 0) {
          const shuffled = pool.sort(() => Math.random() - 0.5)
          selected.push(shuffled[0])
        }
      })
      
      this.selectedMbtiQuestions = selected
    },
    
    calculateMbtiResult(): string {
      const counts: Record<string, number> = {
        'I': 0, 'E': 0,
        'S': 0, 'N': 0,
        'T': 0, 'F': 0,
        'J': 0, 'P': 0
      }
      
      this.selectedMbtiQuestions.forEach(q => {
        const answerIndex = this.answers[q.id]
        if (answerIndex !== undefined) {
          const mapping = q.mbtiMapping[answerIndex]
          mapping.split('').forEach(c => {
            if (counts[c]) {
              counts[c]++
            }
          })
        }
      })
      
      const result = [
        counts['I'] >= counts['E'] ? 'I' : 'E',
        counts['S'] >= counts['N'] ? 'S' : 'N',
        counts['T'] >= counts['F'] ? 'T' : 'F',
        counts['J'] >= counts['P'] ? 'J' : 'P'
      ].join('')
      
      this.detectedMbti = result
      return result
    },
    
    generateQuestions() {
      // 清空状态
      this.currentLevel = 1
      this.consecutiveCorrect = 0
      this.answeredInCurrentLevel = 0
      
      // 基础题库配置
      const baseConfig: Record<number, { count: number; pool: Question[] }> = {}
      
      // 构建每个等级的题库池
      const profQuestions = [...questions.professional] as Question[]
      for (let i = 1; i <= 9; i++) {
        baseConfig[i] = {
          count: 0,
          pool: profQuestions.filter(q => q.level === i)
        }
      }
      
      // 基础配置：L1-3/L2-3/L3-3/L4-2/L5-2/L6-2/L7-2/L8-1/L9-1
      const baseDistribution = {
        1: 3, 2: 3, 3: 3,
        4: 2, 5: 2, 6: 2, 7: 2,
        8: 1, 9: 1
      }
      
      // 根据当前正确率动态调整
      // 初始正确率设为0.5作为假设
      let adjustmentFactor = 1.0
      
      // 基础题库：从每个等级随机选择
      const selectedProf: Question[] = []
      
      // 特殊调整：如果当前等级题库不足，优先从相邻等级补充
      const adjustedDistribution = { ...baseDistribution }
      
      // 选择专业题
      for (let level = 1; level <= 9; level++) {
        const count = adjustedDistribution[level]
        const pool = baseConfig[level].pool
        
        if (pool.length >= count) {
          const shuffled = pool.sort(() => Math.random() - 0.5)
          selectedProf.push(...shuffled.slice(0, count))
        } else {
          // 题库不足，从其他等级借用
          const needed = count - pool.length
          selectedProf.push(...pool)
          
          // 从高等级借题
          for (let higherLevel = level + 1; higherLevel <= 9 && needed > 0; higherLevel++) {
            if (baseConfig[higherLevel].pool.length > baseDistribution[higherLevel]) {
              const extra = baseConfig[higherLevel].pool.sort(() => Math.random() - 0.5).slice(0, 1)
              selectedProf.push(...extra)
              break
            }
          }
        }
      }
      
      // 从30道趣味题中随机选6道
      const funQuestions = ([...questions.fun] as Question[]).sort(() => Math.random() - 0.5).slice(0, 6)
      
      // 专业题按L1-L9顺序排列（由易到难）
      selectedProf.sort((a, b) => (a.level || 1) - (b.level || 1))
      
      // 合并：专业题 + 趣味题
      this.selectedQuestions = [...selectedProf, ...funQuestions]
    },
    
    setAnswer(questionId: number, answerIndex: number) {
      this.answers[questionId] = answerIndex
      
      // 检查答案是否正确
      const q = this.selectedQuestions.find(q => q.id === questionId)
      if (q && answerIndex === q.answer) {
        this.consecutiveCorrect++
      } else {
        this.consecutiveCorrect = 0
      }
      
      this.answeredInCurrentLevel++
    },
    
    nextQuestion() {
      const total = this.getTotalQuestions
      if (this.currentQuestion < total - 1) {
        this.currentQuestion++
      }
    },
    
    prevQuestion() {
      if (this.currentQuestion > 0) {
        this.currentQuestion--
      }
    },
    
    calculateResult() {
      let score = 0
      
      this.selectedQuestions.forEach(q => {
        if (q.id < 100 && this.answers[q.id] === q.answer) {
          score += q.score
        }
      })
      
      this.totalScore = score
      
      this.generateMbtiQuestions()
      this.calculateMbtiResult()
      
      const level = levels.levels.find(l => score >= l.minScore && score <= l.maxScore)
      if (level) {
        this.resultLevel = level.level
        this.resultPersona = this.matchPersona(level.level)
      }
    },
    
    matchPersona(level: number): string {
      const isIntrovert = this.detectedMbti.startsWith('I')
      
      if (isIntrovert) {
        return `L${level}_I`
      } else {
        return `L${level}_E`
      }
    },
    
    getPersonaData() {
      if (!this.resultPersona) return null
      const levelData = characters.levels.find(l => {
        return l.personas.some(p => p.id === this.resultPersona)
      })
      if (!levelData) return null
      return levelData.personas.find(p => p.id === this.resultPersona)
    },
    
    getLevelData() {
      if (!this.resultLevel) return null
      return levels.levels.find(l => l.level === this.resultLevel)
    },
    
    reset() {
      this.mbti = ''
      this.detectedMbti = ''
      this.answers = {}
      this.currentQuestion = 0
      this.totalScore = 0
      this.resultLevel = null
      this.resultPersona = null
      this.selectedQuestions = []
      this.selectedMbtiQuestions = []
      this.currentLevel = 1
      this.consecutiveCorrect = 0
      this.answeredInCurrentLevel = 0
    }
  }
})
