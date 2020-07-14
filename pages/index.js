let vm = new Vue({
  el: '#index-body',
  data: {
		loadingMask: true,

  	hasData: false,
		able2Import: true,		// 每次打开浏览器只允许导入一次excel，再次导入需要刷新页面
		able2StoreData: true,	// 每次打开浏览器只允许覆写一次localStorage，再次导入需要刷新页面
		inputRemoveCode: '',	// 输入的清除密码
		veriRemoveCode: 'jizhideadou1991',	// 清除密码

		popupFlag: {
			removeWin: false,
		},

		dataArr: [],
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

      if (localStorage.getItem('dataArr')) {
      	this.hasData = true;
        let dataArr = localStorage.getItem('dataArr');
        dataArr = JSON.parse(dataArr);
        this.dataArr = dataArr;
				console.log('探测到浏览器存储 localStorage[0].stuName: ' + dataArr[0].学生姓名);
      }
      else {
				console.log('未探测到浏览器存储');
			}
      
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
        };
        reader.readAsBinaryString(f);
      };
    },

    clickImportFile: function () {
    	if (this.able2Import) {
				document.getElementById("excel-file").click();
			}
    	this.able2Import = false;
    },

		storeData2Local: function () {
    	if (this.able2StoreData && this.dataArr.length>0) {
				const dataArr = JSON.stringify(this.dataArr);
				localStorage.setItem('dataArr', dataArr);
				this.hasData = true;
				console.log('覆写浏览器存储成功 localStorage[0].stuName: ' + this.dataArr[0].学生姓名)
			}
    	this.able2StoreData = false;
		},

		openRemoveWin: function () {
    	this.popupFlag.removeWin = true;
		},

		closeRemoveWin: function () {
			this.popupFlag.removeWin = false;
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
		}

  }
});