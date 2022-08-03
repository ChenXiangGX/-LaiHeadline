<template>
  <div class="reply">
    <van-nav-bar title="评论列表" @click-left="close" border>
      <template #left>
        <van-icon name="cross" color="#333" />
      </template>
    </van-nav-bar>
    <van-cell class="comment-item">
      <van-image slot="icon" class="avatar" round fit="cover" :src="replyInfo.info.avatar" />
      <div slot="title">
        <div class="title-w">
          <div class="name">{{ replyInfo.info.nickname }}</div>
          <div class="like-w">
            <van-icon
              class="like-icon"
              :class="{ liked: replyInfo.is_like }"
              @click="Like(replyInfo._id, replyInfo.is_like, replyInfo.index)"
              name="good-job"
            />
            <span class="like-count">{{ replyInfo.like_count == 0 ? '' : replyInfo.like_count }}</span>
          </div>
        </div>
        <div class="content">{{ replyInfo.content }}</div>
        <div class="info">
          <span class="pubdate">{{ replyInfo.create_time | formatDate }}</span>
        </div>
      </div>
    </van-cell>

    <van-divider :style="{ borderColor: '#999' }"> </van-divider>
    <div class="section-title2">热门评论</div>
    <!-- 文章评论列表这里套div是因为下拉加载位置没找准导致的 所以添加div增加样式-->
    <div>
      <van-list>
        <template #finished>
          <div>
            <p v-if="commentLists.length === 0">抢沙发</p>
            <p v-else>没有更多数据了</p>
          </div>
        </template>
        <van-cell class="comment-item" v-for="(item, index) in commentLists" :key="index">
          <van-image slot="icon" class="avatar" round fit="cover" :src="item.info.avatar" />
          <div slot="title">
            <div class="title-w">
              <div class="name">{{ item.info.nickname }}</div>
              <div class="like-w">
                <van-icon
                  :class="{ liked: item.is_like }"
                  @click="Like(item._id, item.is_like, index, 2)"
                  class="like-icon"
                  name="good-job"
                />
                <span class="like-count">{{ item.like_count == 0 ? '' : item.like_count }}</span>
              </div>
            </div>
            <div class="content">{{ item.content }}</div>
            <div class="info">
              <span class="pubdate">{{ item.create_time | formatDate }}</span>
            </div>
          </div>
        </van-cell>
      </van-list>
    </div>
  </div>
</template>

<script>
import { Image as VanImage } from 'vant';
import { get_reply_list, comment_like, comment_unlike } from '@/api/home';
import { Divider } from 'vant';
import { mapState } from 'vuex';
export default {
  name: 'replyCom',
  components: { [VanImage.name]: VanImage, [Divider.name]: Divider },
  props: {
    replyInfo: {
      default: {},
    },
    commentList: { default: [] },
    replyPopupShow: { default: '' },
  },
  computed: {
    ...mapState(['uid']),
  },
  filters: {
    formatDate: function (value) {
      // 时间戳转换日期格式方法
      if (value == null) {
        return '';
      } else {
        let date = new Date(value);
        let y = date.getFullYear(); // 年
        let MM = date.getMonth() + 1; // 月
        MM = MM < 10 ? '0' + MM : MM;
        let d = date.getDate(); // 日
        d = d < 10 ? '0' + d : d;
        return y + '-' + MM + '-' + d;
      }
    },
  },
  data() {
    return {
      commentLists: [],
    };
  },
  mounted() {
    //监听
    // let { replyPopupShow } = this;
    // if (replyPopupShow) {
    //   this.get_reply_list();
    // }
    // console.log(this.replyPopupShow);
  },
  watch: {
    replyPopupShow: {
      immediate: true,
      handler(n, o) {
        if (n) {
          this.get_reply_list();
        }
      },
    },
  },
  methods: {
    get_reply_list() {
      let { uid: user_id } = this;
      let { article_id, _id: reply_comment_id } = this.replyInfo;
      // console.log(article_id, reply_comment_id);
      get_reply_list({
        article_id,
        skip: '',
        limit: '',
        user_id,
        reply_comment_id,
      })
        .then((res) => {
          // console.log(res);
          this.commentLists = res.data;
          // console.log(this.commentLists);
        })
        .catch((err) => {});
    },
    close() {
      this.$emit('close');
    },
    //切换评论点赞
    Like(comment_id, is_like, index, ff) {
      // console.log(ff);
      // console.log(comment_id, is_like, index);
      let { uid } = this;

      if (is_like) {
        //  取消
        comment_unlike({
          comment_id,
          user_id: uid,
        }).then((res) => {
          console.log(res);
          this.$toast(res.msg);
          if (res.code == 0) {
            if (ff == 2) {
              this.commentLists[index].like_count -= 1;
              this.commentLists[index].is_like = false;
            } else {
              this.replyInfo.is_like = false;
              this.replyInfo.like_count -= 1;

              this.commentList[index].like_count = this.replyInfo.like_count;
              this.commentList[index].is_like = this.replyInfo.is_like;
            }
          }
        });
      } else {
        comment_like({
          comment_id,
          user_id: uid,
        }).then((res) => {
          // console.log(res)
          this.$toast(res.msg);
          if (res.code == 0) {
            if (ff == 2) {
              this.commentLists[index].like_count += 1;
              this.commentLists[index].is_like = true;
            } else {
              this.replyInfo.is_like = true;
              this.replyInfo.like_count += 1;

              this.commentList[index].like_count = this.replyInfo.like_count;
              // this.commentList[index].like_count = res.count;
              this.commentList[index].is_like = this.replyInfo.is_like;
            }
          }
        });
      }
    },
  },
};
</script>

<style lang="less" scoped>
::v-deep .van-cell::after {
  border: none;
}
::v-deep .van-nav-bar {
  background-color: pink;

  border-radius: 10px 10px 0 0;
}
::v-deep .van-nav-bar__title {
  color: #333;
}

.section-title2 {
  padding: 10px;
  font-size: 24px;
  color: #222222;
}
.comment-item {
  .avatar {
    width: 36px;
    height: 36px;
    margin-right: 13px;
  }
  .name {
    font-size: 16px;
    color: #555;
  }
  .content {
    font-size: 16px;
    color: #222222;
    margin: 10px 0;
  }
  .info {
    display: flex;
    height: 36px;
    align-items: center;
  }
  .pubdate {
    font-size: 12px;
    margin-right: 12px;
  }
  .title-w {
    display: flex;
    justify-content: space-between;
    height: 36px;
    align-items: center;
  }
  .like-w {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .like-icon.liked {
    color: #ef092c;
  }
}
</style>
