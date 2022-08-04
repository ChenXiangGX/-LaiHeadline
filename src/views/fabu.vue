<template>
  <div class="fabu">
    <van-nav-bar title="发布"> </van-nav-bar>

    <van-form @submit="onSubmit">
      <van-field
        v-model="title"
        name="title"
        label="标题"
        placeholder="标题"
        label-width="30px"
        :rules="[{ required: true, message: '请填写标题' }]"
      />
      <van-field
        :value="cate_name"
        label="分类"
        label-width="30px"
        placeholder="请选择分类"
        readonlyf
        name="cate_name"
        @click="catePickerShow = true"
      />

      <van-field
        v-model="content"
        name="content"
        label="内容"
        label-width="30px"
        placeholder="内容"
        type="textarea"
        :rules="[{ required: true, message: '请填写内容' }]"
      />
      <!--   上传 -->
      <van-field label="图片" label-width="30px" name="fileList">
        <template #input>
          <van-uploader v-model="fileList" multiple :max-count="3" />
        </template>
      </van-field>

      <div style="margin: 16px">
        <van-button round block type="info" native-type="submit">提交</van-button>
      </div>
    </van-form>

    <!--   弹出层 -->
    <van-popup v-model="catePickerShow" position="bottom" :style="{ height: '40%' }">
      <van-picker
        title="请选择"
        show-toolbar
        :columns="cate"
        @confirm="onConfirm"
        @cancel="catePickerShow = false"
        value-key="name"
      />
    </van-popup>

    <BomViem></BomViem>
  </div>
</template>

<script>
import BomViem from '@/components/BomViem.vue';
import { Form } from 'vant';
import { Field, Picker, Popup } from 'vant';
import { addArticle } from '@/api/qiniu/api';
import { mapState } from 'vuex';
import { mapActions } from 'vuex';
import { Uploader } from 'vant';
export default {
  name: 'publish',
  components: {
    BomViem,

    [Form.name]: Form,
    [Field.name]: Field,
    [Picker.name]: Picker,
    [Popup.name]: Popup,
    [Uploader.name]: Uploader,
  },
  data() {
    return {
      title: '',
      content: '',
      cate_id: '',
      cate_name: '',
      catePickerShow: false,
      fileList: [], //  vant上传组件 接收数据
    };
  },
  computed: {
    ...mapState(['cate', 'uid', 'userInfo']),
  },
  created() {
    this.$store.dispatch('getCate');
  },
  methods: {
    ...mapActions(['upload']),
    //  picker确定
    onConfirm(e) {
      // console.log(e);
      this.catePickerShow = false;
      this.cate_name = e.name;
      this.cate_id = e._id;
    },

    async onSubmit(values) {
      // console.log("submit", values);

      let { cate_id, uid, userInfo, fileList } = this;
      let { nickname } = userInfo;

      // console.log(uid);
      // console.log(cate_id);
      // console.log(nickname);

      // 需要把file传到服务器  服务器收到以后存到服务器上 返回该图片在服务器的地址
      if (!uid) {
        this.$toast('请先登录');
        setTimeout((v) => {
          this.$router.push('/login');
        }, 500);
        return;
      }

      //  上传图片操作

      // fileList  vant给的上传相关的文件
      let imageSrc = await this.upload(fileList);

      console.log(imageSrc);
      //为一个对象，里面除了接口所需的参数外话多个vant上传图片的filelist
      delete values.fileList;
      addArticle({
        ...values,
        cate_id,
        author: nickname,
        author_id: uid,
        imageSrc,
      }).then((res) => {
        console.log(res);
        this.$toast(res.msg);
      });
    },
  },
};
</script>

<style lang="less" scoped>
.fabu {
  ::v-deep .van-nav-bar {
    // background-color: #3288de;
  }
  // .van-nav-bar__content {
  //   background-color: #07c160;
  // }
  ::v-deep .van-field__label {
    min-width: 45px !important;
  }
}
</style>
>
