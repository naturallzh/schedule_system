let vm = new Vue({
	el: '#edit-tutor-data-body',
	data: {
		loadingMask: true,

		highLightIdx: -1,
		showRemarkIdx: -1,

		defaultModItemObj: {},
		modItemObj: {},
		editIdx: -1,

		popupFlag: {
			modifyWin: false,
			resetWin: false,
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

			if (!localStorage.getItem('tutorData')) {
				const tutorData = JSON.stringify(DATA_tutorData);
				localStorage.setItem('tutorData', tutorData);
			}
			let dataArr = localStorage.getItem('tutorData');
			dataArr = JSON.parse(dataArr);
			this.dataArr = dataArr;

			this.defaultModItemObj = {
				id: '',
				tutorName: '',
				coName: '',
				tutorClass: '',
				income: '',
				cost: '',
				maxRece: 4,
				remark: ''
			}
		},

		// 编辑或新增时点击确认按钮
		commitMod: function () {
			const itemObj = this.modItemObj;

			itemObj.id += '';
			itemObj.income = parseInt(itemObj.income);
			itemObj.cost = parseInt(itemObj.cost);
			itemObj.maxRece = parseInt(itemObj.maxRece);
			console.log(itemObj);

			// 输入校验
			const checkPool = [
				[itemObj.tutorName.length<1, '导师名称输入有误'],
				[itemObj.coName.length<1, '企业名称输入有误'],
				[itemObj.tutorClass.length<1, '导师职位输入有误'],
				[itemObj.income<1 || isNaN(itemObj.income), '合作价格输入有误'],
				[itemObj.cost<1 || isNaN(itemObj.cost), '支出输入有误'],
				[itemObj.maxRece<1 || isNaN(itemObj.maxRece), '最大同时授课数输入有误'],
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
				// console.log(data.id);
				// console.log(this.defaultModItemObj.id);
			}
			this.popupFlag.modifyWin = true;
			this.modItemObj = data;
			// console.log(dataItem.stuName);
		},
		closeModTableItemWin: function () {this.popupFlag.modifyWin = false;},

		// 提交修改至localStorage
		openApproveTutorDataWin: function () {this.popupFlag.approveWin = true;},
		closeApproveTutorDataWin: function () {this.popupFlag.approveWin = false;},
		approveTutorData: function () {
			const tutorData = JSON.stringify(this.dataArr);
			localStorage.setItem('tutorData', tutorData);
			this.closeApproveTutorDataWin();
		},

		// 重置localStorage为页面自带默认数据
		openResetTutorDataWin: function () {this.popupFlag.resetWin = true;},
		closeResetTutorDataWin: function () {this.popupFlag.resetWin = false;},
		resetTutorData: function () {
			const tutorData = JSON.stringify(DATA_tutorData);
			localStorage.setItem('tutorData', tutorData);
			this.dataArr = DATA_tutorData;
			this.closeResetTutorDataWin();
		},

		// 高亮鼠标滑过的条目
		highLightItem: function (idx) {this.highLightIdx = idx},
		// 对比修改过的单元格 bg变黄
		modifiedBgStr : function (itemIdx, keyName) {
			const oriData = JSON.parse(localStorage.getItem('tutorData'))[itemIdx];
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

		addZero: addZero,
	}
});