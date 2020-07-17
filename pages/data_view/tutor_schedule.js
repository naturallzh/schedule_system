let vm = new Vue({
	el: '#tutor-schedule-body',
	data: {
		loadingMask: true,

		tutorDetailIdx: -1,
		tutorDetailKeyMap: [],

		popupFlag: {
			tutorDetailWin: false,
		},

		dataArr: null,
		tutorData: null,
		coData: null,
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


			let dataArr = localStorage.getItem('dataArr');
			dataArr = JSON.parse(dataArr);
			this.dataArr = dataArr;

			let tutorData = localStorage.getItem('tutorData');
			tutorData = JSON.parse(tutorData);
			this.tutorData = tutorData;

			let coData = localStorage.getItem('coData');
			coData = JSON.parse(coData);
			this.coData = coData;

			this.tutorDetailKeyMap = [
				{name:'编号', key: 'id'},
				{name:'导师姓名', key: 'tutorName'},
				{name:'企业名称', key: 'coName'},
				{name:'导师职位', key: 'tutorClass'},
				{name:'合作价格', key: 'income'},
				{name:'支出', key: 'cost'},
				{name:'最大同时授课', key: 'maxRece'},
				{name:'备注', key: 'remark'},
			];
		},

		openTutorDetail: function (idx) {this.popupFlag.tutorDetailWin = true;this.tutorDetailIdx = idx},
		closeTutorDetail: function () {this.popupFlag.tutorDetailWin = false;},

	}
});