// app/current-affairs/page.tsx
'use client'
import { useState, useEffect } from 'react'
import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

export default function CurrentAffairsPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMonth, setSelectedMonth] = useState('')
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [score, setScore] = useState({ correct: 0, wrong: 0 })

  useEffect(() => {
    fetchItems()
  }, [selectedMonth])

  async function fetchItems() {
    setLoading(true)
    const url = selectedMonth
      ? `/api/current-affairs?month=${selectedMonth}`
      : '/api/current-affairs'
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
    if (selected === correct) {
      setScore(s => ({ ...s, correct: s.correct + 1 }))
    } else {
      setScore(s => ({ ...s, wrong: s.wrong + 1 }))
    }
  }

  const answered = Object.keys(answers).length
  const total = items.length

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#fff' }}>
      <Header />
      <main style={{ maxWidth: 900, margin: '0 auto', padding: 16 }}>
        <div style={{ marginBottom: 16 }}>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: '#f1f5f9', marginBottom: 4 }}>Current Affairs MCQ</h1>
          <p style={{ color: '#64748b', fontSize: 13 }}>Exam preparation ke liye daily questions</p>
        </div>

        {/* Score Card */}
        {answered > 0 && (
          <div style={{ background: '#1e293b', borderRadius: 12, padding: 16, marginBottom: 16, border: '1px solid #334155', display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 900, color: '#f59e0b' }}>{answered}/{total}</div>
              <div style={{ fontSize: 11, color: '#64748b' }}>Attempted</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 900, color: '#10b981' }}>{score.correct}</div>
              <div style={{ fontSize: 11, color: '#64748b' }}>Correct</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 900, color: '#ef4444' }}>{score.wrong}</div>
              <div style={{ fontSize: 11, color: '#64748b' }}>Wrong</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 900, color: '#8b5cf6' }}>{answered > 0 ? Math.round(score.correct/answered*100) : 0}%</div>
              <div style={{ fontSize: 11, color: '#64748b' }}>Score</div>
            </div>
          </div>
        )}

        {/* Month Filter */}
        <div style={{ background: '#1e293b', borderRadius: 12, padding: 14, marginBottom: 16, border: '1px solid #334155' }}>
          <div style={{ fontSize: 11, color: '#64748b', marginBottom: 8, fontWeight: 600 }}>Month Filter:</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <button onClick={() => setSelectedMonth('')} style={{ padding: '5px 14px', borderRadius: 20, fontSize: 12, background: !selectedMonth ? '#f59e0b' : '#0f172a', border: `1px solid ${!selectedMonth ? '#f59e0b' : '#334155'}`, color: !selectedMonth ? '#000' : '#94a3b8', cursor: 'pointer', fontWeight: !selectedMonth ? 700 : 400 }}>Sab</button>
            {MONTHS.map(m => (
              <button key={m} onClick={() => setSelectedMonth(m)} style={{ padding: '5px 14px', borderRadius: 20, fontSize: 12, background: selectedMonth === m ? '#f59e0b' : '#0f172a', border: `1px solid ${selectedMonth === m ? '#f59e0b' : '#334155'}`, color: selectedMonth === m ? '#000' : '#94a3b8', cursor: 'pointer', fontWeight: selectedMonth === m ? 700 : 400 }}>{m}</button>
            ))}
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 48, color: '#64748b' }}>Loading...</div>
        ) : !items.length ? (
          <div style={{ textAlign: 'center', padding: 48, color: '#64748b' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📰</div>
            <p>Abhi koi Current Affairs available nahi hain.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {items.map((item: any, idx: number) => {
              const userAnswer = answers[item.id]
              const correct = item.correct_option || 'A'
              const hasOptions = item.option_a || item.option_b
              const options = [
                { key: 'A', text: item.option_a || item.answer },
                { key: 'B', text: item.option_b || '' },
                { key: 'C', text: item.option_c || '' },
                { key: 'D', text: item.option_d || '' },
              ].filter(o => o.text)

              return (
                <div key={item.id} style={{ background: '#1e293b', borderRadius: 12, padding: 20, border: '1px solid #334155' }}>
                  {/* Question */}
                  <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
                    <span style={{ background: '#f59e0b', color: '#000', borderRadius: 6, padding: '2px 10px', fontSize: 13, fontWeight: 900, flexShrink: 0 }}>Q{idx + 1}</span>
                    {item.topic && <span style={{ background: '#8b5cf620', color: '#8b5cf6', fontSize: 11, padding: '2px 8px', borderRadius: 12, fontWeight: 700, alignSelf: 'center' }}>{item.topic}</span>}
                  </div>
                  <p style={{ color: '#f1f5f9', fontSize: 15, fontWeight: 600, lineHeight: 1.6, marginBottom: 14 }}>{item.question}</p>

                  {/* Options */}
                  {hasOptions ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
                      {options.map(opt => {
                        const isSelected = userAnswer === opt.key
                        const isCorrect = opt.key === correct
                        let bg = '#0f172a'
                        let border = '#334155'
                        let color = '#94a3b8'
                        if (userAnswer) {
                          if (isCorrect) { bg = '#10b98120'; border = '#10b981'; color = '#10b981' }
                          else if (isSelected) { bg = '#ef444420'; border = '#ef4444'; color = '#ef4444' }
                        }
                        return (
                          <button key={opt.key} onClick={() => handleAnswer(item.id, opt.key, correct)}
                            style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '10px 14px', background: bg, border: `1px solid ${border}`, borderRadius: 8, color, fontSize: 14, cursor: userAnswer ? 'default' : 'pointer', textAlign: 'left', transition: 'all 0.15s' }}>
                            <span style={{ background: isSelected || (userAnswer && isCorrect) ? border : '#334155', color: isSelected || (userAnswer && isCorrect) ? (isCorrect ? '#10b981' : '#ef4444') : '#64748b', borderRadius: 4, padding: '1px 7px', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{opt.key}</span>
                            {opt.text}
                            {userAnswer && isCorrect && <span style={{ marginLeft: 'auto', flexShrink: 0 }}>✅</span>}
                            {userAnswer && isSelected && !isCorrect && <span style={{ marginLeft: 'auto', flexShrink: 0 }}>❌</span>}
                          </button>
                        )
                      })}
                    </div>
                  ) : (
                    /* Simple Q&A if no options */
                    <details style={{ background: '#0f172a', borderRadius: 8, padding: '10px 14px', border: '1px solid #334155', cursor: 'pointer' }}>
                      <summary style={{ color: '#f59e0b', fontSize: 13, fontWeight: 600, listStyle: 'none' }}>Answer Dekho 👁️</summary>
                      <p style={{ color: '#10b981', fontSize: 14, margin: '10px 0 0', fontWeight: 600 }}>✅ {item.answer}</p>
                    </details>
                  )}

                  {/* Explanation */}
                  {userAnswer && item.explanation && (
                    <div style={{ background: '#0f172a', borderRadius: 8, padding: '12px 14px', border: '1px solid #334155', marginTop: 8 }}>
                      <div style={{ fontSize: 11, color: '#f59e0b', fontWeight: 700, marginBottom: 6 }}>📖 Explanation:</div>
                      <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.7, margin: 0 }}>{item.explanation}</p>
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