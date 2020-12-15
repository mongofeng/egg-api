const a = [
  {
    $match: {
      teacherId: ''
    },
  },
  {
    $group: {
      _id: { $dateToString: { format: '%Y-%m', date: '$createDate' } },
      key: { $first: { $month: '$createDate' } },
      count: { $sum: '$num' },
    },
  }
]


const b = {
  $match: {
      teacherId: '5fc5fae45303720b576a750e',
    $expr: { $gte: ['$createDate', { $toDate: '2020-12-15 00:00:00 +0800' }] }
  }
}