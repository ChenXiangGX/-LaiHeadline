// ...mapState(["uid", "token", "isLogin", "userInfo"]),解构详解
let arr = ["uid", "user"];
function aa(arr) {
  let obj = {};
  arr.forEach((v) => {
    obj[v] = function () {
      return 1;
    };
  });
  return obj;
}

let allObj = { ...aa(arr) };

console.log(allObj.uid());
