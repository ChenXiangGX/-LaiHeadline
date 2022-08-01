import { DatetimePicker } from 'vant';
import { formDate } from '@/comon/utils/utils';
export default {
  components: {
    [DatetimePicker.name]: DatetimePicker,
  },
  data() {
    return {
      //修改生日
      birPicker: false,
      minDate: new Date(1920, 0, 1),
      maxDate: new Date(),
      currentDate: '',
    };
  },
  methods: {
    //改生日
    birconfirm(e) {
      //   console.log(1);
      console.log(e);
      // let year = e.getFullYear();
      // let month = e.getMonth() + 1;
      // let date = e.getDate();
      // let d = [year, month, date]
      //   .map((v) => {
      //     return (v + "").length > 1 ? v : "0" + v;
      //   })
      //   .join();
      let d = formDate(e);
      this.userInfo.birthday = d;
      this.birPicker = false;
    },
    birchange(picker, value, index) {
      //   console.log("chan");
      // this.$toast(`当前值：${value}, 当前索引：${index}`);
    },
    bircancel(e) {
      this.birPicker = false;
      //   console.log("can");
    },
  },
};
