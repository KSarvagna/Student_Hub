export const EDUCATION_LEVEL_OPTIONS = [
  { value: 'all', label: 'All education levels' },
  { value: 'school', label: 'School (Class 1–12)' },
  { value: 'diploma', label: 'Diploma' },
  { value: 'undergraduate', label: 'Undergraduate' },
  { value: 'postgraduate', label: 'Postgraduate' },
  { value: 'research', label: 'Research' },
  { value: 'unclassified', label: 'Unclassified sample items' },
]

export function matchesEducationLevel(opportunity, selectedLevel) {
  if (!selectedLevel || selectedLevel === 'all') return true

  const levels = Array.isArray(opportunity?.education_levels) ? opportunity.education_levels : []
  if (selectedLevel === 'unclassified') return levels.length === 0
  return levels.includes(selectedLevel)
}
