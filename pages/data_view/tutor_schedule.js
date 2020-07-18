let vm = new Vue({
	el: '#tutor-schedule-body',
	data: {
		loadingMask: true,

		tutorDetailIdx: -1,
		tutorDetailKeyMap: [],

		showScheduleIdx: [-1, -1],
		showPrepareIdx: [-1, -1],
		mousePos: [0, 0],		// 鼠标位置

		scheduleStartTime: '',	// 排期区间的起始时间
		scheduleEndTime: '',	// 排期区间的结束时间
		scheduleArr: [],			// 用于图形化显示排班的数组
		prepareArr: [],				// 0/4学生排班的数组

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
		window.addEventListener('mousemove', this.getMousePos);
	},
	beforeMount () {
	},
	mounted () {
		// localStorage.removeItem("dataArr");

		this.init();
		this.processScheduleArr();
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

			const today = new Date();
			this.scheduleStartTime = this.dateObj2timestamp(today);
			this.scheduleEndTime = this.dateObj2timestamp(this.dateObjShift(today,29));
		},

		startTimeChange: function () {
			if (!this.checkDateLegal()) {
				this.scheduleStartTime = this.scheduleEndTime;
			}
			this.processScheduleArr();
		},
		endTimeChange: function () {
			if (!this.checkDateLegal()) {
				this.scheduleEndTime = this.scheduleStartTime;
			}
			this.processScheduleArr();
		},
		checkDateLegal: function () {
			const startTime = this.scheduleStartTime;
			const endTime = this.scheduleEndTime;
			if (startTime.length<8) {return false}
			if (endTime.length<8) {return false}
			if (this.timestamp2dateObj(endTime) - this.timestamp2dateObj(startTime) <0) {
				return false;
			}
			return true;
		},

		processScheduleArr: function () {
			console.log(this.scheduleStartTime, this.scheduleEndTime);
			const scheduleStartTimeObj = this.timestamp2dateObj(this.scheduleStartTime);
			const scheduleEndTimeObj = this.timestamp2dateObj(this.scheduleEndTime);
			const N = (scheduleEndTimeObj - scheduleStartTimeObj)/3600/1000/24 + 1;
			const dataArr = this.dataArr;
			const tutorData = this.tutorData;

			// 初始化日程数组 本数组为中间过程对象 并非最终输出 三维数组 最小单位为当天该导师所授课学生名字的数组
			const schedulerArr = [];
			const prepareArr = [];
			for (let i=0;i<tutorData.length;i++) {
				schedulerArr[i] = [];
				prepareArr[i] = [];
				for (let j=0;j<N;j++) {
					schedulerArr[i][j] = [];
					prepareArr[i][j] = [];
				}
			}

			for (let i=0;i<dataArr.length;i++) {
				if (dataArr[i].meetTime.length<8 && dataArr[i].meetTime.length>1) {continue}
				const tutorIdx = this.getTutorIdx(dataArr[i].tutorName);
				const dayLen = (dataArr[i].maxProgress - dataArr[i].progress -1) * 7;

				let startTimeObj, endTimeObj;
				// 已写好下次见面时间的情况
				if (dataArr[i].meetTime.length>8) {
					endTimeObj = this.timestamp2dateObj(this.timestampShift(dataArr[i].meetTime,dayLen));
					if (endTimeObj < scheduleStartTimeObj) {continue}
					// startTimeObj = this.timestamp2dateObj(dataArr[i].meetTime);
					// 也做向前推算
					startTimeObj = this.dateObjShift(this.timestamp2dateObj(dataArr[i].meetTime),-7*dataArr[i].progress);
				}
				// 未写明下次见面的时间 只存在于0/4 从明天开始顺推21天
				else {
					startTimeObj = this.dateObjShift(new Date(),1);
					endTimeObj = this.dateObjShift(new Date(),22);
				}
				if (endTimeObj > scheduleEndTimeObj) {
					endTimeObj = scheduleEndTimeObj;
				}
				if (startTimeObj < scheduleStartTimeObj) {
					startTimeObj = scheduleStartTimeObj;
				}

				const startIdx = (startTimeObj-scheduleStartTimeObj)/3600/1000/24;
				const endIdx = (endTimeObj-scheduleStartTimeObj)/3600/1000/24;

				for (let j=startIdx;j<=endIdx;j++) {
					if (dataArr[i].meetTime.length>8) {
						schedulerArr[tutorIdx][j].push(dataArr[i].stuName);
					}
					else {
						prepareArr[tutorIdx][j].push(dataArr[i].stuName);
					}
				}
			}
			//console.log(schedulerArr);

			const outputArr = [];
			for (let i=0;i<schedulerArr.length;i++) {
				outputArr[i] = [];
				let curObj = {
					dayNum: 1,
					totalLen: N,
					nameArr: schedulerArr[i][0]
				};
				for (let j=1;j<schedulerArr[i].length;j++) {
					if (this.compareArr(curObj.nameArr, schedulerArr[i][j])) {
						curObj.dayNum++
					}
					else {
						curObj.styleStr = 'width:'+curObj.dayNum/curObj.totalLen*100+'%;';
						curObj.styleStr += 'background:' + this.perc2color(1-curObj.nameArr.length/4);
						outputArr[i].push(curObj);
						curObj = {
							dayNum: 1,
							totalLen: N,
							nameArr: schedulerArr[i][j]
						}
					}
				}
				curObj.styleStr = 'width:'+curObj.dayNum/curObj.totalLen*100+'%;';
				curObj.styleStr += 'background:' + this.perc2color(1-curObj.nameArr.length/4);
				outputArr[i].push(curObj);
			}
			//console.log(outputArr)
			this.scheduleArr = outputArr;

			const outputArr1 = [];
			for (let i=0;i<prepareArr.length;i++) {
				outputArr1[i] = [];
				let curObj = {
					dayNum: 1,
					totalLen: N,
					nameArr: prepareArr[i][0]
				};
				for (let j=1;j<prepareArr[i].length;j++) {
					if (this.compareArr(curObj.nameArr, prepareArr[i][j])) {
						curObj.dayNum++
					}
					else {
						curObj.styleStr = 'width:'+curObj.dayNum/curObj.totalLen*100+'%;';
						curObj.styleStr += 'background:' + this.perc2color(1-curObj.nameArr.length/4);
						outputArr1[i].push(curObj);
						curObj = {
							dayNum: 1,
							totalLen: N,
							nameArr: prepareArr[i][j]
						}
					}
				}
				curObj.styleStr = 'width:'+curObj.dayNum/curObj.totalLen*100+'%;';
				curObj.styleStr += 'background:' + this.perc2color(1-curObj.nameArr.length/4);
				outputArr1[i].push(curObj);
			}
			this.prepareArr = outputArr1;
		},

		openTutorDetail: function (idx) {this.popupFlag.tutorDetailWin = true;this.tutorDetailIdx = idx},
		closeTutorDetail: function () {this.popupFlag.tutorDetailWin = false;},

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

		showScheduleDetail: function (arr) {
			this.showScheduleIdx = arr;
		},
		showPrepareDetail: function (arr) {
			this.showPrepareIdx = arr;
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
		compareArr: function (arr1, arr2) {
			if (arr1.length!==arr2.length) {return false}
			// if (arr1===[] && arr2===[]) {return true}
			for (let i=0;i<arr1.length;i++) {
				if (arr1[i]!==arr2[i]) {return false}
			}
			return true;
		},

		// 小数转rgb字符串 0=>red 1=>green 负数=>red
		perc2color: function (perc) {
			let rgbStr = "rgb(";
			if (perc===1) {
				rgbStr = "lightblue";
			}
			else if (perc>=0.5) {
				perc = (1-perc) * 2;
				rgbStr += perc*255 + ",255,0)";
			}
			else if (perc>=0) {
				perc = perc * 2;
				rgbStr += "255," + perc*255 + ",0)";
			}
			else {
				rgbStr += "255,0,0)";
			}
			return rgbStr;
		},

		// 获取鼠标位置
		getMousePos: function () {
			this.mousePos = [window.event.clientX, window.event.clientY];
		}

	}
});