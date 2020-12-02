var obj = {$group:{_id:'$studentIds',amount:{$sum:'$amount'},count:{$sum:'$count'},used:{$sum:'$used'},surplus:{$sum:'$surplus'},overdueCount:{$sum:{$cond:['$beOverdue','$surplus',0]}},activiteCount:{$sum:{$cond:['$isActive','$count',0]}},unActiviteCount:{$sum:{$cond:['$isActive',0,'$count']}}}}


console.log(obj)


var lookup = {$lookup:{from:'student',let:{stuId:{$toObjectId:'$_id'}},pipeline:[{$match:{$expr:{$eq:['$_id','$$stuId']}}}],as:'student'}}


var a = {$project:{_id:1,student:{$arrayElemAt:['$student',0]},amount:1,count:1,used:1,surplus:1,overdueCount:1,activiteCount:1,unActiviteCount:1}}