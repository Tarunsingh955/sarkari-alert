export default function Footer() {
  return (
    <footer style={{background:'#0a0f1e',borderTop:'1px solid #1e293b',padding:'32px 16px 20px'}}>
      <div style={{maxWidth:1200,margin:'0 auto'}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))',gap:24,marginBottom:24}}>
          <div>
            <div style={{fontSize:18,fontWeight:900,color:'#f59e0b',marginBottom:8}}>SarkariAlert</div>
            <p style={{color:'#475569',fontSize:12,lineHeight:1.7}}>India ki #1 Sarkari Naukri website. Latest Govt Jobs, Current Affairs, Free Resume Builder, Previous Papers.</p>
          </div>
          {[{title:'Jobs',links:[['Central Govt','/jobs?category=central'],['State Govt','/jobs?category=state'],['Railway','/jobs?category=railway'],['Banking','/jobs?category=banking'],['Defence','/jobs?category=defence'],['SSC','/jobs?category=ssc']]},{title:'Resources',links:[['Admit Card','/admit-card'],['Result','/result'],['Answer Key','/answer-key'],['Syllabus','/syllabus'],['Previous Papers','/previous-papers'],['Exam Calendar','/exam-calendar']]},{title:'More',links:[['Current Affairs','/current-affairs'],['Resume Builder','/resume'],['Blog','/blog'],['Advertise','/advertise'],['About Us','/about'],['Contact','/contact'],['Privacy Policy','/privacy-policy']]}].map(s=>(
            <div key={s.title}>
              <h4 style={{color:'#f1f5f9',fontWeight:700,marginBottom:10,fontSize:13}}>{s.title}</h4>
              {s.links.map(([l,h])=><a key={h} href={h} style={{display:'block',color:'#64748b',fontSize:12,marginBottom:6,textDecoration:'none'}}>{l}</a>)}
            </div>
          ))}
        </div>
        <div style={{borderTop:'1px solid #1e293b',paddingTop:16,display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:8}}>
          <p style={{color:'#334155',fontSize:11,margin:0}}>© 2025 SarkariAlert | All Rights Reserved</p>
          <p style={{color:'#334155',fontSize:11,margin:0}}>Disclaimer: Always verify from official government website</p>
        </div>
      </div>
    </footer>
  )
}
