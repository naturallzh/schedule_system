let vm = new Vue({
	el: '#edit-data-body',
	data: {
		loadingMask: true,

		stateCol: {},
		tutorData: [],

		hasData: false,
		highLightIdx: -1,

		defaultModItemObj: {},
		modItemObj: {},
		editIdx: -1,

		popupFlag: {
			modifyWin: false,
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
		},

		commitMod: function () {
			if (this.modItemObj.progress<=3) {
				this.modItemObj.recLetterState = 0;
				this.modItemObj.recTime = null;
				this.modItemObj.paymentState = 0;
			}
			if (this.modItemObj.recLetterState<=2) {
				this.modItemObj.recTime = null;
			}
			console.log(this.modItemObj);

			const dataArr = this.dataArr;
			dataArr[this.editIdx] = this.modItemObj;
			this.dataArr = dataArr;

			this.closeModTableItemWin();
		},

		openModTableItemWin: function (idx) {
			let data = this.dataArr[idx];
			data = JSON.parse(JSON.stringify(data));
			this.popupFlag.modifyWin = true;
			this.editIdx = idx;

			this.modItemObj = data;
			//console.log(dataItem.stuName);
		},
		closeModTableItemWin: function () {this.popupFlag.modifyWin = false;},

		highLightItem: function (idx) {this.highLightIdx = idx},
		modifiedBgStr : function (itemIdx, keyName) {
			const oriData = JSON.parse(localStorage.getItem('dataArr'))[itemIdx];
			const curData = this.dataArr[itemIdx];
			if (!oriData) {return 'background: yellow';}
			if (oriData[keyName] != curData[keyName]) {
				return 'background: yellow';
			}
			else {return '';}
		},

		checkLocalStorage: checkLocalStorage,
		addZero: addZero,
	}
});