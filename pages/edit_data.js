let vm = new Vue({
	el: '#edit-data-body',
	data: {
		loadingMask: true,

		stateCol: {},

		hasData: false,
		highLightIdx: -1,

		defaultModItemObj: {},
		modItemObj: {},

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
			this.loadingMask = false;

			this.stateCol = DATA_stateCol;

			this.checkLocalStorage();

			if (localStorage.getItem('dataArr')) {
				let dataArr = localStorage.getItem('dataArr');
				dataArr = JSON.parse(dataArr);
				this.dataArr = dataArr;
			}
		},

		timestamp2Str: function (stampStr) {
			if (!stampStr) {return ''}
			return stampStr.slice(0,4) + '/' + stampStr.slice(4,6) + '/' + stampStr.slice(6);
		},

		openModTableItemWin: function (idx) {
			this.popupFlag.modifyWin = true;

			const dataItem = this.dataArr[idx];
			this.modItemObj = dataItem;
			console.log(dataItem.stuName);
		},
		closeModTableItemWin: function () {this.popupFlag.modifyWin = false;},

		highLightItem: function (idx) {this.highLightIdx = idx},

		checkLocalStorage: checkLocalStorage,
		addZero: addZero,
	}
});