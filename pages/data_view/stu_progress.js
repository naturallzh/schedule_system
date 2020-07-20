let vm = new Vue({
	el: '#stu-progress-body',
	data: {
		loadingMask: true,

		tutorDetailIdx: -1,
		tutorDetailKeyMap: [],
		finishListIdx: -1,		// 历史已完成(已签发)学员名字列表的index

		tutorFilterName: '不过滤',
		coFilterName: '不过滤',

		abstractIdx: [-1, -1, -1],	// 鼠标悬停时显示摘要的index
		mousePos: [0, 0],		// 鼠标位置

		// scheduleStartTime: '',	// 排期区间的起始时间
		// scheduleEndTime: '',	// 排期区间的结束时间
		progressArr: [],			// 用于图形化显示排班的数组

		popupFlag: {
			finishListWin: false,
			tutorDetailWin: false,
		},

		dataArr: null,
		tutorData: null,
		coData: null,
	},

	beforeCreate () {
	},
	created () {
		window.addEventListener('mousemove', this.getMousePos);
	},
	beforeMount () {
	},
	mounted () {
		// localStorage.removeItem("dataArr");

		this.init();
		this.processProgressArr();
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

			// const today = new Date();
			// this.scheduleStartTime = this.dateObj2timestamp(today);
			// this.scheduleEndTime = this.dateObj2timestamp(this.dateObjShift(today,29));
		},

		// startTimeChange: function () {
		// 	if (!this.checkDateLegal()) {
		// 		this.scheduleStartTime = this.scheduleEndTime;
		// 	}
		// 	this.processProgressArr();
		// },
		// endTimeChange: function () {
		// 	if (!this.checkDateLegal()) {
		// 		this.scheduleEndTime = this.scheduleStartTime;
		// 	}
		// 	this.processProgressArr();
		// },
		// checkDateLegal: function () {
		// 	const startTime = this.scheduleStartTime;
		// 	const endTime = this.scheduleEndTime;
		// 	if (startTime.length<8) {return false}
		// 	if (endTime.length<8) {return false}
		// 	if (this.timestamp2dateObj(endTime) - this.timestamp2dateObj(startTime) <0) {
		// 		return false;
		// 	}
		// 	return true;
		// },

		processProgressArr: function () {
			// console.log(this.scheduleStartTime, this.scheduleEndTime);
			// const scheduleStartTimeObj = this.timestamp2dateObj(this.scheduleStartTime);
			// const scheduleEndTimeObj = this.timestamp2dateObj(this.scheduleEndTime);
			// const N = (scheduleEndTimeObj - scheduleStartTimeObj)/3600/1000/24 + 1;
			const dataArr = this.dataArr;
			const tutorData = this.tutorData;

			const outputArr = [];
			for (let i=0;i<tutorData.length;i++) {
				outputArr[i] = [[],[],[],[],[],[]];
			}

			for (let i=0;i<dataArr.length;i++) {
				const tutorIdx = this.getTutorIdx(dataArr[i].tutorName);
				if (dataArr[i].recLetterState === 4) {
					outputArr[tutorIdx][5].push(dataArr[i]);
					continue;
				}
				if (dataArr[i].meetTime.length>8) {
					dataArr[i].overTime = this.timestamp2dateObj(this.dateObj2timestamp(new Date())) - this.timestamp2dateObj(this.timestampShift(dataArr[i].meetTime,7));
				}
				outputArr[tutorIdx][dataArr[i].progress].push(dataArr[i]);
			}
			// console.log(outputArr);
			this.progressArr = outputArr;
		},

		openTutorDetail: function (idx) {this.popupFlag.tutorDetailWin = true;this.tutorDetailIdx = idx},
		closeTutorDetail: function () {this.popupFlag.tutorDetailWin = false;},

		openFinishList: function (idx) {
			// idxArr 中最后一位为0时表示正在上课的人 为1时表示等待开课的人
			this.finishListIdx = idx;
			this.popupFlag.finishListWin = true;
		},
		closeFinishList: function () {this.popupFlag.finishListWin = false;},

		dateObj2timestamp: function (dateObj) {
			const Y = dateObj.getFullYear();
			const M = addZero(dateObj.getMonth()+1);
			const D = addZero(dateObj.getDate());
			return Y+'-'+M+'-'+D;
		},
		timestamp2dateObj: function (timestamp) {
			const strArr = timestamp.split('-');
			return new Date(strArr[0],strArr[1]-1,strArr[2]);
		},
		dateObjShift: function (dateObj, n) {
			return new Date(dateObj.getFullYear(),dateObj.getMonth(),dateObj.getDate()+n);
		},
		timestampShift: function (timestamp, n) {
			return this.dateObj2timestamp(this.dateObjShift(this.timestamp2dateObj(timestamp), n));
		},

		getAbstractIdx: function (arr) {
			this.abstractIdx = arr;
		},

		getTutorIdx: function (str) {
			const tutorData = this.tutorData;
			for (let i=0;i<tutorData.length;i++) {
				if (tutorData[i].tutorName === str) {
					return i;
				}
			}
			return false;
		},

		// 获取鼠标位置
		getMousePos: function () {
			this.mousePos = [window.event.clientX, window.event.clientY];
		},

		gotoEditOrder: function (id) {
			let url = "../edit_data.html?editOrderId="+id;window.open(url);
		},

		gotoEditTutor: function (idx) {
			let url = "../edit_tutor_data.html?editTutorIdx="+idx;window.open(url);
		}

	}
});