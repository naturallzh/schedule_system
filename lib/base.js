/*获取url参数*/
function getQueryString(name){
  const reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
  const r = window.location.search.substr(1).match(reg);
  if (r!==null) return decodeURI(r[2]); return '';
}

function addZero (num) {
  num = parseInt(num);
  if (num>=10) {return num+''}
  else {return '0'+num}
}

function checkLocalStorage () {
  if (localStorage.getItem('dataArr')) {
    this.hasData = true;
    let dataArr = localStorage.getItem('dataArr');
    dataArr = JSON.parse(dataArr);
    //this.dataArr = dataArr;
    console.log('探测到浏览器存储 localStorage[0].stuName: ' + dataArr[0].stuName);
  }
  else {
    console.log('未探测到浏览器存储');
  }
}