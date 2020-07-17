const DATA_tutorData = [
	{id:'', tutorName:'何雍森', coName: '普华永道', tutorClass: '高级审计经理', income: 6000, cost: 2000, maxRece: 4, remark: ''},
	{id:'', tutorName:'陈韵如', coName: '宝洁', tutorClass: 'City Manager', income: 6000, cost: 2500, maxRece: 4, remark: ''},
	{id:'', tutorName:'李敏威', coName: '毕马威', tutorClass: '高级审计经理', income: 6000, cost: 2500, maxRece: 4, remark: ''},
	{id:'', tutorName:'张荣斌', coName: '阿里巴巴', tutorClass: '高级项目经理', income: 7000, cost: 3000, maxRece: 4, remark: ''},
	{id:'', tutorName:'朱献饶', coName: '摩根士丹利', tutorClass: 'ECM Analyst', income: 8000, cost: 4500, maxRece: 4, remark: ''},
	{id:'', tutorName:'宋进', coName: '菜鸟', tutorClass: '高级运营解决方案专家', income: 6000, cost: 2000, maxRece: 4, remark: ''},
	{id:'', tutorName:'王顺恺', coName: '德勤', tutorClass: '高级审计经理', income: 6000, cost: 2500, maxRece: 4, remark: ''},
	{id:'', tutorName:'张凡', coName: '麦肯锡', tutorClass: '咨询经理', income: 8500, cost: 6500, maxRece: 4, remark: ''},
	{id:'', tutorName:'沈子杰', coName: '德勤', tutorClass: '高级审计经理', income: 6000, cost: 2500, maxRece: 4, remark: ''},
	{id:'', tutorName:'许馨怡', coName: '普华永道', tutorClass: '高级咨询经理', income: 6000, cost: 3000, maxRece: 4, remark: ''},
	{id:'', tutorName:'戴骥云', coName: '东方证券', tutorClass: '分析师', income: 6000, cost: 2700, maxRece: 4, remark: ''},
	{id:'', tutorName:'周琛', coName: '高盛', tutorClass: '分析师', income: 8500, cost: 4500, maxRece: 4, remark: ''},
];

const DATA_coData = [
	{id:'', coName: '普华永道', remark: ''},
	{id:'', coName: '宝洁', remark: ''},
	{id:'', coName: '毕马威', remark: ''},
	{id:'', coName: '阿里巴巴', remark: ''},
	{id:'', coName: '摩根士丹利', remark: ''},
	{id:'', coName: '菜鸟', remark: ''},
	{id:'', coName: '德勤', remark: ''},
	{id:'', coName: '麦肯锡', remark: ''},
	{id:'', coName: '东方证券', remark: ''},
	{id:'', coName: '高盛', remark: ''},
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
	meetTime: '沟通时间',			// 预计下一次见面沟通的时间
	recLetterState: '推荐信',	// 0未完成课程 1草拟中 2修改中 3待签发 4已签发
	recTime: '签发时间',
	income: '合作价格',
	paymentState: '付款情况', // 0未完成课程 1待支付 2已付清
	cost: '支出',
	remark: '备注'
};

const DATA_stateCol = {
	recLetterState: ['','草拟中','修改中','待签发','已签发'],
	paymentState: ['','待支付','已付清'],
};