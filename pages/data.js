const DATA_TutorData = [
	{id:'', name:'何雍森'},
	{id:'', name:'陈韵如'},
	{id:'', name:'李敏威'},
	{id:'', name:'张荣斌'},
	{id:'', name:'朱献饶'},
	{id:'', name:'宋进'},
	{id:'', name:'王顺恺'},
	{id:'', name:'张凡'},
	{id:'', name:'沈子杰'},
	{id:'', name:'许馨怡'},
	{id:'', name:'戴骥云'},
	{id:'', name:'周琛'},
];

const DATA_tableHeaderMap = {
	id: '编号',
	creatTime: '新增时间',
	stuName: '学生姓名',
	coName: '企业名称',
	tutorName: '导师姓名',
	tutorClass: '导师职位',
	progress: '当前进度',
	maxProgress: '总进度',
	recLetterState: '推荐信',	// 0未完成课程 1草拟中 2待签发 3已签发
	recTime: '签发时间',
	income: '合作价格',
	paymentState: '付款情况', // 0未完成课程 1待支付 2已付清
	cost: '支出',
	remark: '备注'
};

const DATA_stateCol = {
	recLetterState: ['','草拟中','待签发','已签发'],
	paymentState: ['','待支付','已付清'],
};