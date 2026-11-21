export const GOVERNMENT_LEVEL_OPTIONS = [
  { value: 'all', label: 'All government levels' },
  { value: 'central', label: 'Central Government' },
  { value: 'state', label: 'Telangana Government' },
  { value: 'unclassified', label: 'Unclassified sample items' },
]

export const APPLICATION_STATUS_OPTIONS = [
  { value: 'all', label: 'All application statuses' },
  { value: 'open', label: 'Open' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'closed', label: 'Closed' },
  { value: 'unknown', label: 'Unknown' },
]

export function matchesGovernmentLevel(opportunity, selectedLevel) {
  if (!selectedLevel || selectedLevel === 'all') return true
  if (selectedLevel === 'unclassified') return !opportunity?.government_level
  return opportunity?.government_level === selectedLevel
}

export function matchesApplicationStatus(opportunity, selectedStatus) {
  if (!selectedStatus || selectedStatus === 'all') return true
  return (opportunity?.application_status ?? 'unknown') === selectedStatus
}

