



// 到期
var tuisong = [
  {$unwind:'$studentIds'},
  {$group:{_id:'$studentIds', n: {$sum: 1 },amount:{$sum:'$amount'},count:{$sum:'$count'},used:{$sum:'$used'},surplus:{$sum:'$surplus'},overdueCount:{$sum:{$cond:['$beOverdue','$surplus',0]}},activiteCount:{$sum:{$cond:['$isActive','$count',0]}},unActiviteCount:{$sum:{$cond:['$isActive',0,'$count']}}}},
  {$lookup:{from:'student',let:{stuId:{$toObjectId:'$_id'}},pipeline:[{$match:{$expr:{$eq:['$_id','$$stuId']}}}],as:'student'}},
  {$match: { 'student.status': 1,  surplus: {$lte: 6}}},
  { $sort : { surplus : 1, count: -1 } }
]

// 统计
var total  = [
  {$unwind:'$studentIds'},
  {$group:{_id:'$studentIds', n: {$sum: 1 },amount:{$sum:'$amount'},count:{$sum:'$count'},used:{$sum:'$used'},surplus:{$sum:'$surplus'},overdueCount:{$sum:{$cond:['$beOverdue','$surplus',0]}},activiteCount:{$sum:{$cond:['$isActive','$count',0]}},unActiviteCount:{$sum:{$cond:['$isActive',0,'$count']}}}},
  {$lookup:{from:'student',let:{stuId:{$toObjectId:'$_id'}},pipeline:[{$match:{$expr:{$eq:['$_id','$$stuId']}}}],as:'student'}},
  { $sort : { surplus : 1, count: -1 } }
]
