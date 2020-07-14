let vm = new Vue({
  el: '#index-body',
  data: {
  },

  beforeCreate () {
  },
  created () {
  },
  beforeMount () {
  },
  mounted () {
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

      if (localStorage.getItem('dataArr')) {
        let dataArr = localStorage.getItem('dataArr');
        dataArr = JSON.parse(dataArr);
        console.log(dataArr[0]);
        //
        // localStorage.removeItem("dataArr");
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
          const dataArr = JSON.stringify(XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]));
          // const dataArr = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);

          console.log(dataArr);
          // localStorage.setItem('dataArr', dataArr);
        };
        reader.readAsBinaryString(f);
      };
    },

    clickImportFile: function () {
      document.getElementById("excel-file").click();
    }

  }
});