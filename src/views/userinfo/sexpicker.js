import { Picker } from "vant";

export default {
  data() {
    return {
      showPicker: false,
      columns: ["男", "女"],
    };
  },
  components: {
    [Picker.name]: Picker,
  },
  methods: {
    //修改性别
    setPicker() {
      this.showPicker = true;
    },
    sexConfirm(e) {
      this.userInfo.sex = e;
      this.showPicker = false;
    },
  },
};
