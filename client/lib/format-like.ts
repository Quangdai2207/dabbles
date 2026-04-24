const formatLike = (num: number) => {
  if (num <= 100_000) return num.toString()

  const units = [
    { value: 1_000_000_000, suffix: 'B' },
    { value: 1_000_000, suffix: 'M' },
    { value: 1_000, suffix: 'k' }
  ]

  for (const unit of units) {
    if (num >= unit.value) {
      const val = (num / unit.value).toFixed(1)
      return val.endsWith('.0') ? val.replace('.0', '') + unit.suffix : val + unit.suffix
    }
  }

  return num.toString()
}

export default formatLike
