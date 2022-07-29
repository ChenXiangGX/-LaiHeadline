<template>
  <div class="edit">
    <van-nav-bar title="修改信息" left-arrow @click-left="onClickLeft" />
    <!-- {{ $store.state.userInfo }} -->
    <div class="container">
      <input id="file" @change="change" type="file" hidden accept="image/*" ref="file" />
      <!-- /导航栏 -->
      <van-cell title="头像" center>
        <label for="file"> <van-image width="50" height="50" round fit="cover" :src="userInfo.avatar" /></label>
      </van-cell>
      <!-- <van-cell title="昵称" is-link :value="userInfo.nickname" /> -->

      <van-cell title="昵称" is-link @click="down" :value="userInfo.nickname" />
      <van-dialog v-model="show" title="修改昵称" show-cancel-button @confirm="confirm">
        <van-cell-group> <van-field v-model="value" placeholder="请输入昵称" /> </van-cell-group
      ></van-dialog>
      <van-cell title="性别" is-link @click="setPicker" :value="userInfo.sex" />
      <van-popup v-model="showPicker" round position="bottom">
        <van-picker show-toolbar :columns="columns" @cancel="showPicker = false" @confirm="sexConfirm" />
      </van-popup>
      <van-cell title="生日" is-link @click="birPicker = true" :value="userInfo.birthday" />
      <van-popup v-model="birPicker" round position="bottom">
        <van-datetime-picker
          v-model="currentDate"
          type="date"
          title="选择年月日"
          :min-date="minDate"
          :max-date="maxDate"
          @change="birchange"
          @confirm="birconfirm"
          @cancel="bircancel"
        />
      </van-popup>
      <div style="margin: 30px 50px">
        <van-button round block type="primary" size="normal" :square="true" native-type="submit" @click="submit"
          >确定</van-button
        >
      </div>
    </div>
  </div>
</template>
<script>
import { Image as VanImage } from 'vant';
import { mapActions } from 'vuex';
import { editUserInfo } from '@/api/home';
import sexpicker from './userinfo/sexpicker';
import sexbir from './userinfo/sexbir';
import { Dialog } from 'vant';
export default {
  name: 'edit',
  components: {
    [VanImage.name]: VanImage,
    [Dialog.Component.name]: Dialog.Component,
  },
  mixins: [sexpicker, sexbir],

  data() {
    return {
      userInfo: {},
      value: '',
      show: false,
    };
  },
  methods: {
    //修改昵称
    down() {
      this.show = true;
    },
    mounted() {
      console.log('mou');
    },
    //如果有 keeplive  monted 只会执行一次
    //激活
    activated() {
      console.log(2);
    },
    //被缓存的组件加入到缓存中
    deactivated() {
      console.log(1);
    },
    //弹出框确定
    confirm() {
      this.userInfo.nickname = this.value;
    },
    ...mapActions(['upload']),
    //掉接口修改信息
    async submit() {
      let { _id, nickname, avatar, file, sex, birthday } = this.userInfo;
      if (file) {
        //证明我们上传头像
        let fileList = [
          {
            file,
          },
        ];
        let res = await this.upload(fileList);
        avatar = res[0];
        // console.log(avatar);
        editUserInfo({
          uid: _id,
          nickname,
          avatar,
          sex,
          birthday,
        }).then((res) => {
          console.log(res);

          if (res.code == 0) {
            this.$toast(res.msg);
            // 修改数据后主页没同步
            //1.直接调接口
            // this.$store.dispatch("getUserInfo", localStorage.getItem("token"));
            //2
            this.$store.commit('change', {
              key: 'userInfo',
              value: {
                _id,
                nickname,
                avatar,
                sex,
                birthday,
              },
            });
            setTimeout(() => {
              this.$router.push('/user');
            }, 1000);
          }
        });
      } else {
        editUserInfo({
          uid: _id,
          nickname,
          avatar,
          sex,
          birthday,
        }).then((res) => {
          console.log(res);

          if (res.code == 0) {
            this.$toast(res.msg);
            // 修改数据后主页没同步
            //1.直接调接口
            // this.$store.dispatch("getUserInfo", localStorage.getItem("token"));
            //2.本地修改
            this.$store.commit('change', {
              key: 'userInfo',
              value: {
                _id,
                nickname,
                avatar,
                sex,
                birthday,
              },
            });
            setTimeout(() => {
              this.$router.push('/user');
            }, 1000);
          } else {
            this.$toast('请修改信息后重试');
          }
        });
      }
    },
    onClickLeft() {
      this.$router.go(-1);
    },
    async change(e) {
      //   console.log(e.target.files);
      //因为没有用vant所以图片不是base64
      let file = e.target.files[0];

      this.userInfo.file = file;
      //   console.log(this.userInfo.file);
      //html5的一个读取文件的对象
      let fileReader = new FileReader();
      //   readAsDataURL 方法会读取指定的 Blob 或 File 对象。读取操作完成的时候，readyState 会变成已完成DONE，并触发 loadend (en-US) 事件，同时 result 属性将包含一个data:URL 格式的字符串（base64 编码）以表示所读取文件的内容。
      fileReader.readAsDataURL(file);
      fileReader.onload = (e) => {
        // console.log(e.target.result);
        this.userInfo.avatar = e.target.result;
      };
    },
  },
  watch: {
    //监听这个指定的值的变化
    // 让值最初时候watch就执行就用到了handler和immediate属性
    '$store.state.userInfo': {
      immediate: true,
      handler(n, o) {
        // console.log(n);
        // console.log(o);
        this.userInfo = JSON.parse(JSON.stringify(n));
      },
    },
  },
  created() {
    //数据回填
    //深拷贝，这样不会污染vuex数据，直接拿vuex里的userinfo进行修改的话会污染
    //这样刷新也会消失所以我们进行监听
    // this.userInfo = JSON.parse(JSON.stringify(this.$store.state.userInfo));
  },
};
</script>
<style scoped lang="less">
.edit {
  .van-nav-bar {
    background-color: #07c160;
  }
}
</style>
