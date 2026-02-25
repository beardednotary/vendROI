export function getROIColor(roi: number): string {
  if (roi >= 50) return '#059669'; // Dark green
  if (roi >= 30) return '#10B981'; // Green
  if (roi >= 10) return '#FBBF24'; // Amber
  return '#EF4444'; // Red
}

export function getROILabel(roi: number): string {
  if (roi >= 50) return 'Excellent';
  if (roi >= 30) return 'Strong';
  if (roi >= 10) return 'Acceptable';
  return 'Underperforming';
}