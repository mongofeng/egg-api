const a = [
  {
    $group: {
      _id: { $dateToString: { format: '%Y-%m', date: '$createDate' } },
      key: { $first: { $month: '$createDate' } },
      count: { $sum: '$num' },
    },
  },
  {
    $match: {
    },
  }
]