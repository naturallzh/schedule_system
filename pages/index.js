let vm = new Vue({
	el: '#index-body',
	data: {
		loadingMask: true,

		stateCol: {},

		hasData: false,
		able2Import: true,		// 每次打开浏览器只允许导入一次excel，再次导入需要刷新页面
		able2StoreData: true,	// 每次打开浏览器只允许覆写一次localStorage，再次覆写需要刷新页面
		able2RemoveData: true,	// 每次打开浏览器只允许清除一次localStorage，再次清除需要刷新页面
		able2ModMask: true,		// 是否允许修改浏览器存储的遮罩，挡住第一块区域的前三个按钮
		inputRemoveCode: '',	// 输入的清除密码
		veriRemoveCode: 'jizhideadou1991',	// 清除密码

		popupFlag: {
			importWin: false,
			removeWin: false,
			modMaskWin: false,
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
			this.stateCol = DATA_stateCol;

			this.checkLocalStorage();
			// 导入导师信息
			if (!localStorage.getItem('tutorData')) {
				const tutorData = JSON.stringify(DATA_tutorData);
				localStorage.setItem('tutorData', tutorData);
			}
			// 导入企业信息
			if (!localStorage.getItem('coData')) {
				const coData = JSON.stringify(DATA_coData);
				localStorage.setItem('coData', coData);
			}
			//checkLocalStorageTutorData();

			const inputEle = document.getElementById("excel-file");
			// 为input添加onchange事件
			inputEle.onchange = function(e) {

				const obj = e.target;
				const f = obj.files[0];
				const reader = new FileReader();
				reader.onload = function(e) {
					const data = e.target.result;
					//将文件读取为二进制字符串
					const wb = XLSX.read(data, {type : 'binary'});
					// wb.SheetNames[0]是获取Sheets中第一个Sheet的名字
					// wb.Sheets[Sheet名]获取第一个Sheet的数据
					// const dataArr = JSON.stringify(XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]));
					const dataArr = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
					if (wb.SheetNames[1]) {
						const tutorData = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[1]]);
						vm.tutorData = tutorData;
					}
					if (wb.SheetNames[2]) {
						const coData = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[2]]);
						vm.coData = coData;
					}

					vm.dataArr = dataArr;

					console.log('导入成功 dataArr[0].stuName: ' + dataArr[0].学生姓名);
					alert('导入excel数据成功 但还未覆写浏览器存储');
				};
				reader.readAsBinaryString(f);
			};
		},

		// 自定义div按钮调用input按钮
		clickImportFile: function () {
			if (!this.able2Import) {return}
			document.getElementById("excel-file").click();
			this.able2Import = false;
		},

		storeData2Local: function () {
			if (this.dataArr) {
				// 写入报表数据
				let dataArr = this.processImportData(this.dataArr);
				this.dataArr = dataArr;
				dataArr = JSON.stringify(this.dataArr);
				localStorage.setItem('dataArr', dataArr);
				this.hasData = true;

				// 写入导师数据
				let tutorData = this.processImportTutorData(this.tutorData);
				this.tutorData = tutorData;
				tutorData = JSON.stringify(this.tutorData);
				localStorage.setItem('tutorData', tutorData);

				// 写入公司数据
				let coData = this.processImportCoData(this.coData);
				this.coData = coData;
				coData = JSON.stringify(this.coData);
				localStorage.setItem('coData', coData);

				console.log('覆写浏览器存储成功 localStorage[0].stuName: ' + this.dataArr[0].stuName)
				this.closeImportWin();
				alert('覆写浏览器存储成功');
			}
			else {
				alert('无待处理数据 请先导入excel');
				this.closeImportWin();
			}
		},

		processImportData: function (dataArr) {
			// console.log(dataArr);
			const outputArr = [];
			for (let i=0;i<dataArr.length;i++) {
				if (!dataArr[i].新增时间) {break;}
				outputArr[i] = {
					// id: 20200000+parseInt(dataArr[i].编号)+'',
					id: dataArr[i].编号+'',
					// createTime: (dataArr[i].新增时间).split('/')[0] + '-' + this.addZero((dataArr[i].新增时间).split('/')[1]) + '-' + this.addZero((dataArr[i].新增时间).split('/')[2]),
					createTime: dataArr[i].新增时间,
					stuName: dataArr[i].学生姓名,
					coName: dataArr[i].企业名称,
					tutorName: dataArr[i].导师姓名,
					tutorClass: dataArr[i].导师职位,
					progress: parseInt((dataArr[i].实习进度).split('/')[0]),
					maxProgress: parseInt((dataArr[i].实习进度).split('/')[1]),
					meetTime: dataArr[i].沟通时间?dataArr[i].沟通时间:'',
					recLetterState: calcRecLetterState(dataArr[i].推荐信),	// 0未完成课程 1草拟中 2待签发 3已签发
					// recTime: dataArr[i].签发时间?(dataArr[i].签发时间).split('/')[0] + '-' + this.addZero((dataArr[i].签发时间).split('/')[1]) + '-' + this.addZero((dataArr[i].签发时间).split('/')[2]):'',
					recTime: dataArr[i].签发时间?dataArr[i].签发时间:'',
					income: parseInt(dataArr[i].合作价格),
					paymentState: calcPaymentState(dataArr[i].付款情况), // 0未完成课程 1待支付 2已付清
					cost: parseInt(dataArr[i].支出),
					remark: dataArr[i].备注?dataArr[i].备注:''
				}
			}
			// console.log(outputArr);
			return outputArr;

			function calcRecLetterState(str) {
				if (!str) {return 0}
				switch (str) {
					case '草拟中':
						return 1;
					case '待签发':
						return 2;
					case '已签发':
						return 3;
					default:
						alert('错误的字符串输入: ' + str);
						break;
				}
			}

			function calcPaymentState(str) {
				if (!str) {return 0}
				switch (str) {
					case '待支付':
						return 1;
					case '已付清':
						return 2;
					default:
						alert('错误的字符串输入: ' + str);
						break;
				}
			}

		},

		processImportTutorData: function (tutorData) {
			const outputArr = [];
			for (let i=0;i<tutorData.length;i++) {
				outputArr[i] = {
					id: tutorData[i].编号?tutorData[i].编号+'':'',
					tutorName: tutorData[i].导师姓名,
					coName: tutorData[i].企业名称,
					tutorClass: tutorData[i].导师职位,
					income: parseInt(tutorData[i].合作价格),
					cost: parseInt(tutorData[i].支出),
					maxRece: parseInt(tutorData[i].最大同时授课),
					remark: tutorData[i].备注?tutorData[i].备注:''
				}
			}
			// console.log(outputArr);
			return outputArr;
		},

		processImportCoData: function (coData) {
			const outputArr = [];
			for (let i=0;i<coData.length;i++) {
				outputArr[i] = {
					id: coData[i].编号?coData[i].编号+'':'',
					coName: coData[i].企业名称,
					remark: coData[i].备注?coData[i].备注:''
				}
			}
			// console.log(outputArr);
			return outputArr;
		},

		removeStorage: function () {
			if (this.inputRemoveCode === this.veriRemoveCode) {
				// 清除localStorage存储
				localStorage.removeItem("dataArr");
				localStorage.removeItem("tutorData");
				localStorage.removeItem("coData");
				this.hasData = false;
				console.log('清除浏览器存储成功');

				this.closeRemoveWin();
				alert('清除浏览器存储成功');
			}
			else {
				this.closeRemoveWin();
				alert('密码错误');
			}
		},

		openRemoveWin: function () {
			if (!this.able2RemoveData) {return}
			this.popupFlag.removeWin = true;
			this.able2RemoveData = false;
		},
		closeRemoveWin: function () {this.popupFlag.removeWin = false;},

		openImportWin: function () {
			if (!this.able2StoreData) {return}
			this.popupFlag.importWin = true;
			this.able2StoreData = false;
		},
		closeImportWin: function () {this.popupFlag.importWin = false;},

		openModMaskWin: function () {this.popupFlag.modMaskWin = true;},
		closeModMaskWin: function () {this.popupFlag.modMaskWin = false;},
		removeModMask: function () {
			this.able2ModMask = false;
			this.closeModMaskWin();
		},

		gotoEdit: function () {
			let url = "edit_data.html";
			window.open(url);
		},
		gotoEditTutor: function () {
			let url = "edit_tutor_data.html";
			window.open(url);
		},
		gotoEditCo: function () {
			let url = "edit_co_data.html";
			window.open(url);
		},

		exportFile: function () {
			const sheet1 = XLSX.utils.aoa_to_sheet(this.localStorage2Arr());
			const sheet2 = XLSX.utils.aoa_to_sheet(this.localStorageTutorData2Arr());
			const sheet3 = XLSX.utils.aoa_to_sheet(this.localStorageCoData2Arr());
			let fileName = 'True_Talent_Data_';
			const timeObj = new Date();
			fileName += timeObj.getFullYear() + addZero(timeObj.getMonth()+1) + addZero(timeObj.getDate()) + '_';
			fileName += addZero(timeObj.getHours()) + addZero(timeObj.getMinutes()) + addZero(timeObj.getSeconds()) + '.xlsx';
			openDownloadDialog(sheet2blob([sheet1,sheet2,sheet3]), fileName);
		},

		localStorage2Arr: function () {
			const data = JSON.parse(localStorage.getItem('dataArr'));
			const arr = [];
			arr[0] = [
				'编号', '新增时间', '学生姓名', '企业名称', '导师姓名', '导师职位', '实习进度',
				'沟通时间', '推荐信', '签发时间', '合作价格', '付款情况', '支出', '备注'
			];
			for (let i=0;i<data.length;i++) {
				arr[i+1] = [
					data[i].id, data[i].createTime, data[i].stuName,
					data[i].coName, data[i].tutorName, data[i].tutorClass,
					data[i].progress+'/'+data[i].maxProgress, data[i].meetTime,
					this.stateCol.recLetterState[data[i].recLetterState],
					data[i].recTime, data[i].income, this.stateCol.paymentState[data[i].paymentState],
					data[i].cost, data[i].remark
				];
			}
			//console.log(arr);
			return arr;
		},

		localStorageCoData2Arr: function () {
			const data = JSON.parse(localStorage.getItem('coData'));
			const arr = [];
			arr[0] = ['编号', '企业名称', '备注'];
			for (let i=0;i<data.length;i++) {
				arr[i+1] = [data[i].id, data[i].coName, data[i].remark];
			}
			//console.log(arr);
			return arr;
		},

		localStorageTutorData2Arr: function () {
			const data = JSON.parse(localStorage.getItem('tutorData'));
			const arr = [];
			arr[0] = ['编号', '导师姓名', '企业名称', '导师职位', '合作价格', '支出', '最大同时授课', '备注'];
			for (let i=0;i<data.length;i++) {
				arr[i+1] = [
					data[i].id, data[i].tutorName, data[i].coName, data[i].tutorClass,
					data[i].income, data[i].cost, data[i].maxRece, data[i].remark
				];
			}
			//console.log(arr);
			return arr;
		},

		checkLocalStorage: checkLocalStorage,
		addZero: addZero,
	}
});