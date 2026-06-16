import slugify from 'slugify'

export function generateSlug(title: string) {
  return slugify(title, { lower: true, strict: true }).slice(0, 80)
}

export function generateUniqueSlug(title: string) {
  return `${generateSlug(title)}-${Date.now().toString(36).slice(-4)}`
}

export function generateJobMeta(job: any) {
  const lastDate = new Date(job.last_date).toLocaleDateString('en-IN')
  return {
    title: job.meta_title || `${job.title} 2025 — ${job.total_posts} Posts | SarkariAlert`,
    description: job.meta_description || `${job.title} Recruitment 2025. ${job.total_posts} vacancies. Last Date: ${lastDate}. Salary: ${job.salary_text}. Apply at SarkariAlert.in`,
    keywords: `${job.title}, sarkari naukri, govt jobs 2025, ${job.department}`,
  }
}

export function generateJobSchema(job: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: job.description,
    datePosted: job.created_at,
    validThrough: job.last_date,
    hiringOrganization: { '@type': 'Organization', name: job.department, sameAs: job.official_website },
    jobLocation: { '@type': 'Place', address: { '@type': 'PostalAddress', addressCountry: 'IN' } },
    baseSalary: { '@type': 'MonetaryAmount', currency: 'INR', value: { '@type': 'QuantitativeValue', minValue: job.salary_min, maxValue: job.salary_max, unitText: 'MONTH' } },
    employmentType: 'FULL_TIME',
    applicationContact: { '@type': 'ContactPoint', url: job.apply_link }
  }
}

export function generateFAQSchema(job: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: `How to apply for ${job.title}?`, acceptedAnswer: { '@type': 'Answer', text: `Visit ${job.official_website} and click on Apply Online. Last date is ${new Date(job.last_date).toLocaleDateString('en-IN')}.` } },
      { '@type': 'Question', name: `What is the age limit for ${job.title}?`, acceptedAnswer: { '@type': 'Answer', text: job.age_text || 'Please check official notification for age limit details.' } },
      { '@type': 'Question', name: `What is the qualification for ${job.title}?`, acceptedAnswer: { '@type': 'Answer', text: job.qualification || 'Please check official notification for qualification details.' } },
      { '@type': 'Question', name: `What is the selection process for ${job.title}?`, acceptedAnswer: { '@type': 'Answer', text: job.selection_process || 'Written Exam followed by Document Verification.' } },
      { '@type': 'Question', name: `What is the salary for ${job.title}?`, acceptedAnswer: { '@type': 'Answer', text: job.salary_text || `Rs.${job.salary_min?.toLocaleString('en-IN')} - Rs.${job.salary_max?.toLocaleString('en-IN')} per month` } },
    ]
  }
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({ '@type': 'ListItem', position: i + 1, name: item.name, item: item.url }))
  }
}
