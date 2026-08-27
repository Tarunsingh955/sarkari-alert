'use client'
import { useState, useEffect } from 'react'
import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'
import { useTheme } from '@/components/ui/ThemeProvider'

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

export default function CurrentAffairsPage() {
  const { colors } = useTheme()
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMonth, setSelectedMonth] = useState('')
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [score, setScore] = useState({ correct: 0, wrong: 0 })

  useEffect(() => { fetchItems() }, [selectedMonth])

  async function fetchItems() {
    setLoading(true)
    const url = selectedMonth ? `/api/current-affairs?month=${selectedMonth}` : '/api/current-affairs'
    const res = await fetch(url)
    const data = await res.json()
    setItems(data.items || [])
    setAnswers({})
    setScore({ correct: 0, wrong: 0 })
    setLoading(false)
  }

  function handleAnswer(itemId: string, selected: string, correct: string) {
    if (answers[itemId]) return
    setAnswers(prev => ({ ...prev, [itemId]: selected }))
    if (selected === correct) setScore(s => ({ ...s, correct: s.correct + 1 }))
    else setScore(s => ({ ...s, wrong: s.wrong + 1 }))
  }

  const answered = Object.keys(answers).length

  return (
    <div style={{ minHeight: '100vh', background: colors.bg, color: colors.textPrimary }}>
      <Header />
      <main style={{ maxWidth: 900, margin: '0 auto', padding: 16 }}>
        <div style={{ marginBottom: 16 }}>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: colors.textPrimary, marginBottom: 4 }}>Current Affairs MCQ</h1>
          <p style={{ color: colors.textMuted, fontSize: 13 }}>Daily exam preparation questions — answer karke score dekho!</p>
        </div>

        {/* Score Card */}
        {answered > 0 && (
          <div style={{ background: colors.cardBg, borderRadius: 12, padding: 16, marginBottom: 16, border: `1px solid ${colors.cardBorder}`, boxShadow: `0 1px 3px ${colors.cardShadow}`, display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'center' }}><div style={{ fontSize: 24, fontWeight: 900, color: colors.accent }}>{answered}/{items.length}</div><div style={{ fontSize: 11, color: colors.textMuted }}>Attempted</div></div>
            <div style={{ textAlign: 'center' }}><div style={{ fontSize: 24, fontWeight: 900, color: '#10b981' }}>{score.correct}</div><div style={{ fontSize: 11, color: colors.textMuted }}>Correct ✅</div></div>
            <div style={{ textAlign: 'center' }}><div style={{ fontSize: 24, fontWeight: 900, color: '#ef4444' }}>{score.wrong}</div><div style={{ fontSize: 11, color: colors.textMuted }}>Wrong ❌</div></div>
            <div style={{ textAlign: 'center' }}><div style={{ fontSize: 24, fontWeight: 900, color: '#8b5cf6' }}>{answered > 0 ? Math.round(score.correct / answered * 100) : 0}%</div><div style={{ fontSize: 11, color: colors.textMuted }}>Score</div></div>
          </div>
        )}

        {/* Month Filter */}
        <div style={{ background: colors.cardBg, borderRadius: 12, padding: 14, marginBottom: 16, border: `1px solid ${colors.cardBorder}`, boxShadow: `0 1px 3px ${colors.cardShadow}` }}>
          <div style={{ fontSize: 11, color: colors.textMuted, marginBottom: 8, fontWeight: 600 }}>Month Filter:</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <button onClick={() => setSelectedMonth('')} style={{ padding: '5px 14px', borderRadius: 20, fontSize: 12, background: !selectedMonth ? colors.accent : colors.inputBg, border: `1px solid ${!selectedMonth ? colors.accent : colors.cardBorder}`, color: !selectedMonth ? '#000' : colors.textSecondary, cursor: 'pointer', fontWeight: !selectedMonth ? 700 : 400 }}>Sab</button>
            {MONTHS.map(m => (
              <button key={m} onClick={() => setSelectedMonth(m)} style={{ padding: '5px 14px', borderRadius: 20, fontSize: 12, background: selectedMonth === m ? colors.accent : colors.inputBg, border: `1px solid ${selectedMonth === m ? colors.accent : colors.cardBorder}`, color: selectedMonth === m ? '#000' : colors.textSecondary, cursor: 'pointer', fontWeight: selectedMonth === m ? 700 : 400 }}>{m}</button>
            ))}
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 48, color: colors.textMuted }}>Loading...</div>
        ) : !items.length ? (
          <div style={{ textAlign: 'center', padding: 48, color: colors.textMuted }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📰</div>
            <p>Abhi koi Current Affairs available nahi hain.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {items.map((item: any, idx: number) => {
              const userAnswer = answers[item.id]
              const correct = item.correct_option || 'A'
              const options = [
                { key: 'A', text: item.option_a },
                { key: 'B', text: item.option_b },
                { key: 'C', text: item.option_c },
                { key: 'D', text: item.option_d },
              ].filter(o => o.text)

              return (
                <div key={item.id} style={{ background: colors.cardBg, borderRadius: 12, padding: 20, border: `1px solid ${colors.cardBorder}`, boxShadow: `0 1px 3px ${colors.cardShadow}` }}>
                  <div style={{ display: 'flex', gap: 10, marginBottom: 12, alignItems: 'center' }}>
                    <span style={{ background: colors.accent, color: '#000', borderRadius: 6, padding: '2px 10px', fontSize: 13, fontWeight: 900 }}>Q{idx + 1}</span>
                    {item.topic && <span style={{ background: '#8b5cf620', color: '#8b5cf6', fontSize: 11, padding: '2px 8px', borderRadius: 12, fontWeight: 700 }}>{item.topic}</span>}
                  </div>
                  <p style={{ color: colors.textPrimary, fontSize: 15, fontWeight: 600, lineHeight: 1.6, marginBottom: 14 }}>{item.question}</p>

                  {options.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
                      {options.map(opt => {
                        const isSelected = userAnswer === opt.key
                        const isCorrect = opt.key === correct
                        let bg = colors.inputBg, border = colors.cardBorder, color = colors.textSecondary
                        if (userAnswer) {
                          if (isCorrect) { bg = '#10b98120'; border = '#10b981'; color = '#10b981' }
                          else if (isSelected) { bg = '#ef444420'; border = '#ef4444'; color = '#ef4444' }
                        }
                        return (
                          <button key={opt.key} onClick={() => handleAnswer(item.id, opt.key, correct)}
                            style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '10px 14px', background: bg, border: `1px solid ${border}`, borderRadius: 8, color, fontSize: 14, cursor: userAnswer ? 'default' : 'pointer', textAlign: 'left' }}>
                            <span style={{ background: colors.cardBg, borderRadius: 4, padding: '1px 7px', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{opt.key}</span>
                            {opt.text}
                            {userAnswer && isCorrect && <span style={{ marginLeft: 'auto' }}>✅</span>}
                            {userAnswer && isSelected && !isCorrect && <span style={{ marginLeft: 'auto' }}>❌</span>}
                          </button>
                        )
                      })}
                    </div>
                  ) : (
                    <details style={{ background: colors.inputBg, borderRadius: 8, padding: '10px 14px', border: `1px solid ${colors.cardBorder}`, cursor: 'pointer' }}>
                      <summary style={{ color: colors.accent, fontSize: 13, fontWeight: 600, listStyle: 'none' }}>Answer Dekho 👁️</summary>
                      <p style={{ color: '#10b981', fontSize: 14, margin: '10px 0 0', fontWeight: 600 }}>✅ {item.answer}</p>
                    </details>
                  )}

                  {userAnswer && item.explanation && (
                    <div style={{ background: colors.inputBg, borderRadius: 8, padding: '12px 14px', border: `1px solid ${colors.cardBorder}`, marginTop: 8 }}>
                      <div style={{ fontSize: 11, color: colors.accent, fontWeight: 700, marginBottom: 6 }}>📖 Explanation:</div>
                      <p style={{ color: colors.textSecondary, fontSize: 13, lineHeight: 1.7, margin: 0 }}>{item.explanation}</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
