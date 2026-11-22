const STOP_WORDS = new Set([
  'about', 'and', 'are', 'for', 'from', 'give', 'have', 'help', 'how', 'in', 'is',
  'listed', 'me', 'of', 'please', 'scholarship', 'scholarships', 'scheme', 'the',
  'tell', 'what', 'which', 'who', 'with', 'documents', 'benefits', 'eligibility',
  'apply', 'application', 'deadline', 'amount', 'required',
])

function searchableSchemes(schemes) {
  return schemes.filter((scheme) => (
    scheme.type === 'scholarship' &&
    !scheme.id?.startsWith('example-') &&
    !/placeholder/i.test(scheme.name ?? '')
  ))
}

function scoreScheme(scheme, terms) {
  const searchableText = `${scheme.id} ${scheme.name} ${scheme.provider}`.toLowerCase()
  return terms.reduce((score, term) => score + (searchableText.includes(term) ? 1 : 0), 0)
}

export function createScholarshipDemoAnswer(question, schemes) {
  const records = searchableSchemes(schemes)
  const terms = question.toLowerCase().match(/[\p{L}\p{N}]+/gu)?.filter((term) => (
    term.length > 1 && !STOP_WORDS.has(term)
  )) ?? []
  const ranked = records
    .map((scheme) => ({ scheme, score: scoreScheme(scheme, terms) }))
    .filter(({ score }) => score > 0)
    .sort((left, right) => right.score - left.score)
  const selected = ranked.length > 0 ? ranked.slice(0, 2).map(({ scheme }) => scheme) : records.slice(0, 3)

  if (selected.length === 0) {
    return 'The local scholarship catalogue has no scholarship records available to answer this question.'
  }

  const lines = [
    ranked.length > 0
      ? 'Catalogue information matching your question:'
      : 'I could not match a specific scholarship. Here are scholarship entries in the local catalogue:',
  ]

  for (const scheme of selected) {
    lines.push('', scheme.name)
    lines.push(`Eligibility: ${(scheme.rules ?? []).map((rule) => rule.label).filter(Boolean).join('; ') || 'Not listed in this catalogue entry.'}`)
    lines.push(`Benefits: ${scheme.benefit_text && !/TODO\(VERIFY\)|placeholder/i.test(scheme.benefit_text) ? scheme.benefit_text : 'Not verified or not provided in this catalogue entry.'}`)
    const documents = (scheme.documents ?? []).map((document) => document.name).filter((name) => name && !/placeholder|TODO\(VERIFY\)/i.test(name))
    lines.push(`Documents: ${documents.length > 0 ? documents.join(', ') : 'No document list is provided in this catalogue entry.'}`)
    lines.push(`Deadline: ${scheme.deadline || 'Not listed.'}`)
    if (scheme.apply_url && !/example\.com/i.test(scheme.apply_url)) lines.push(`Application information: ${scheme.apply_url}`)
    lines.push(`Verification: ${scheme.verification_note || 'This catalogue entry is not marked fully verified; confirm details with the official source.'}`)
  }

  return lines.join('\n')
}
