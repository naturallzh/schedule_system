let vm = new Vue({
	el: '#edit-co-data-body',
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

			if (!localStorage.getItem('coData')) {
				const coData = JSON.stringify(DATA_coData);
				localStorage.setItem('coData', coData);
			}
			let dataArr = localStorage.getItem('coData');
			dataArr = JSON.parse(dataArr);
			this.dataArr = dataArr;

			this.defaultModItemObj = {
				id: '',
				coName: '',
				remark: ''
			}
		},

		// 编辑或新增时点击确认按钮
		commitMod: function () {
			const itemObj = this.modItemObj;

			itemObj.id += '';
			console.log(itemObj);

			// 输入校验
			const checkPool = [
				[itemObj.coName.length<1, '企业名称输入有误'],
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
		openApproveCoDataWin: function () {this.popupFlag.approveWin = true;},
		closeApproveCoDataWin: function () {this.popupFlag.approveWin = false;},
		approveCoData: function () {
			const coData = JSON.stringify(this.dataArr);
			localStorage.setItem('coData', coData);
			this.closeApproveCoDataWin();
		},

		// 重置localStorage为页面自带默认数据
		openResetCoDataWin: function () {this.popupFlag.resetWin = true;},
		closeResetCoDataWin: function () {this.popupFlag.resetWin = false;},
		resetCoData: function () {
			const coData = JSON.stringify(DATA_coData);
			localStorage.setItem('coData', coData);
			this.dataArr = DATA_coData;
			this.closeResetCoDataWin();
		},

		// 高亮鼠标滑过的条目
		highLightItem: function (idx) {this.highLightIdx = idx},
		// 对比修改过的单元格 bg变黄
		modifiedBgStr : function (itemIdx, keyName) {
			const oriData = JSON.parse(localStorage.getItem('coData'))[itemIdx];
			const curData = this.dataArr[itemIdx];
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