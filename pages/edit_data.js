let vm = new Vue({
	el: '#edit-data-body',
	data: {
		loadingMask: true,

		stateCol: {},
		tutorData: [],

		hasData: false,
		highLightIdx: -1,
		showRemarkIdx: -1,

		defaultModItemObj: {},
		modItemObj: {},
		editIdx: -1,

		popupFlag: {
			modifyWin: false,
			approveWin: false,
		},

		dataArr: null,
	},

	beforeCreate () {
	},
	created () {
	},
	beforeMount () {
	},
	mounted () {
		// localStorage.removeItem("dataArr");

		this.init();
	},

	/*
	destoryed(){
		console.log("---destoryed---");
	},
	*/

	computed: {
	},
	methods: {

		init: function () {
			//document.getElementById('table-body').scrollIntoView();
			this.loadingMask = false;

			this.stateCol = DATA_stateCol;
			this.tutorData = DATA_tutorData;

			this.checkLocalStorage();

			if (localStorage.getItem('dataArr')) {
				let dataArr = localStorage.getItem('dataArr');
				dataArr = JSON.parse(dataArr);
				this.dataArr = dataArr;
			}

			this.defaultModItemObj = {
				id: '',
				createTime: '',
				stuName: '',
				coName: '',
				tutorName: '',
				tutorClass: '',
				progress: 0,
				maxProgress: 4,
				meetTime: '',
				recLetterState: 0,	// 0未完成课程 1草拟中 2待签发 3已签发
				recTime: '',
				income: '',
				paymentState: 0, // 0未完成课程 1待支付 2已付清
				cost: '',
				remark: ''
			}
		},

		// 编辑或新增时点击确认按钮
		commitMod: function () {
			const itemObj = this.modItemObj;

			if (itemObj.progress<=3) {
				itemObj.recLetterState = 0;
				itemObj.recTime = '';
				itemObj.paymentState = 0;
			}
			if (itemObj.recLetterState<=2) {
				itemObj.recTime = '';
			}
			if (itemObj.progress>=4) {
				itemObj.meetTime = '已结束';
			}
			if (itemObj.progress<=3 && itemObj.meetTime.length<8) {
				itemObj.meetTime = '';
			}

			itemObj.id += '';
			itemObj.progress = parseInt(itemObj.progress);
			itemObj.maxProgress = parseInt(itemObj.maxProgress);
			itemObj.recLetterState = parseInt(itemObj.recLetterState);
			itemObj.income = parseInt(itemObj.income);
			itemObj.cost = parseInt(itemObj.cost);
			itemObj.paymentState = parseInt(itemObj.paymentState);
			console.log(itemObj);

			// 输入校验
			const checkPool = [
				[itemObj.createTime.length<8, '新增时间输入有误'],
				[itemObj.stuName.length<1, '学生姓名输入有误'],
				[itemObj.coName.length<1, '企业名称输入有误'],
				[itemObj.tutorClass.length<1, '导师职位输入有误'],
				[itemObj.recLetterState>2 && (itemObj.recTime.length<8), '签发时间输入有误'],
				[itemObj.income<1 || isNaN(itemObj.income), '合作价格输入有误'],
				[itemObj.cost<1 || isNaN(itemObj.cost), '支出输入有误'],
			];
			for (let i=0;i<checkPool.length;i++) {
				if (checkPool[i][0]) {
					alert(checkPool[i][1]);
					return;
				}
			}

			const dataArr = this.dataArr;
			dataArr[this.editIdx] = itemObj;
			this.dataArr = dataArr;

			this.closeModTableItemWin();
		},

		// 选择导师时导入默认数据
		applyDefaultData: function (tutorName) {
			const tutorData = this.tutorData;
			for (let i=0;i<tutorData.length;i++) {
				if (tutorData[i].tutorName === tutorName) {
					this.modItemObj.coName = tutorData[i].coName;
					this.modItemObj.tutorClass = tutorData[i].tutorClass;
					this.modItemObj.income = tutorData[i].income;
					this.modItemObj.cost = tutorData[i].cost;
				}
			}
		},

		// 编辑或新增时打开弹窗
		openModTableItemWin: function (idx) {
			let data;
			if (idx >= 0) {
				data = this.dataArr[idx];
				data = JSON.parse(JSON.stringify(data));
				this.editIdx = idx;
			}
			else {
				this.editIdx = this.dataArr.length;
				data = this.defaultModItemObj;
				data = JSON.parse(JSON.stringify(data));
				data.id = parseInt(this.dataArr[this.dataArr.length-1].id)+1+'';
				// console.log(data.id);
				// console.log(this.defaultModItemObj.id);
			}
			this.popupFlag.modifyWin = true;
			this.modItemObj = data;
			// console.log(dataItem.stuName);
		},
		closeModTableItemWin: function () {this.popupFlag.modifyWin = false;},

		// 提交修改至localStorage
		openApproveDataWin: function () {this.popupFlag.approveWin = true;},
		closeApproveDataWin: function () {this.popupFlag.approveWin = false;},
		approveData: function () {
			let dataArr = [];
			for (let i=0;i<this.dataArr.length;i++) {
				if (this.dataArr[i].remark==='delete') {continue}
				dataArr.push(this.dataArr[i]);
			}
			this.dataArr = dataArr;
			dataArr = JSON.stringify(dataArr);
			localStorage.setItem('dataArr', dataArr);
			this.closeApproveDataWin();
		},

		// 高亮鼠标滑过的条目
		highLightItem: function (idx) {this.highLightIdx = idx},
		// 对比修改过的单元格 bg变黄
		modifiedBgStr : function (itemIdx, keyName) {
			const oriData = JSON.parse(localStorage.getItem('dataArr'))[itemIdx];
			const curData = this.dataArr[itemIdx];
			if (curData.remark === 'delete') {return 'background: red';}
			if (!oriData) {return 'background: yellow';}
			if (oriData[keyName] !== curData[keyName]) {
				return 'background: yellow';
			}
			else {return '';}
		},
		// 鼠标悬停在有备注的条目上时，显示备注内容
		showRemark: function (idx) {
			this.showRemarkIdx = idx;
		},

		checkLocalStorage: checkLocalStorage,
		addZero: addZero,
	}
});