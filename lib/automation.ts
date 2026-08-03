export async function extractOfficialLink(articleUrl: string): Promise<string> {
  if (!articleUrl) return articleUrl
  try {
    const articleHost = new URL(articleUrl).hostname.replace(/^www\./, '')
    const res = await fetch(articleUrl, { signal: AbortSignal.timeout(8000) })
    if (!res.ok) return articleUrl
    const html = await res.text()

    const hrefUrls = [...html.matchAll(/href="(https?:\/\/[^"]+)"/gi)].map(m => m[1])
    const bareUrls = [...html.matchAll(/(https?:\/\/[a-z0-9.-]+\.(?:gov\.in|nic\.in|ac\.in|org\.in)[^\s"'<>]*)/gi)].map(m => m[1])
    const allCandidates = [...hrefUrls, ...bareUrls]

    const officialPatterns = [/\.gov\.in/i, /\.nic\.in/i, /\.ac\.in/i, /\.org\.in/i, /rrb[a-z]*\.(com|gov\.in)/i, /ibps\.in/i, /sbi\.co\.in/i]
    const officialLink = allCandidates.find(href => {
      if (officialPatterns.every(p => !p.test(href))) return false
      let candidateHost = ''
      try { candidateHost = new URL(href).hostname.replace(/^www\./, '') } catch { return false }
      if (candidateHost === articleHost) return false
      if (candidateHost.includes('sarkarinaukrijobalert.com')) return false
      return true
    })
    return officialLink || articleUrl
  } catch {
    return articleUrl
  }
}