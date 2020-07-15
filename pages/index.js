let vm = new Vue({
	el: '#index-body',
	data: {
		loadingMask: true,

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

			this.checkLocalStorage();

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
				let dataArr = this.processImportData(this.dataArr);
				this.dataArr = dataArr;

				dataArr = JSON.stringify(this.dataArr);
				localStorage.setItem('dataArr', dataArr);
				this.hasData = true;
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
					id: 20200000+parseInt(dataArr[i].编号)+'',
					creatTime: (dataArr[i].新增时间).split('/')[0] + this.addZero((dataArr[i].新增时间).split('/')[1]) + this.addZero((dataArr[i].新增时间).split('/')[2]),
					stuName: dataArr[i].学生姓名,
					coName: dataArr[i].企业名称,
					tutorName: dataArr[i].导师姓名,
					tutorClass: dataArr[i].导师职位,
					progress: parseInt((dataArr[i].实习进度).split('/')[0]),
					maxProgress: parseInt((dataArr[i].实习进度).split('/')[1]),
					recLetterState: calcRecLetterState(dataArr[i].推荐信),	// 0未完成课程 1草拟中 2待签发 3已签发
					recTime: dataArr[i].签发时间?(dataArr[i].签发时间).split('/')[0] + this.addZero((dataArr[i].签发时间).split('/')[1]) + this.addZero((dataArr[i].签发时间).split('/')[2]):null,
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

		removeStorage: function () {
			if (this.inputRemoveCode === this.veriRemoveCode) {
				// 清除localStorage存储
				localStorage.removeItem("dataArr");
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

		checkLocalStorage: checkLocalStorage,
		addZero: addZero,
	}
});