<template>
  <div class="reply">
    <van-nav-bar title="1条回复" @click-left="close" border>
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
              @click="toggleCommentLike(replyInfo._id, replyInfo.is_like, index)"
              name="good-job"
            />
            <span class="like-count">{{ replyInfo.like_count == 0 ? '' : replyInfo.like_count }}</span>
          </div>
        </div>
        <div class="content">{{ replyInfo.content }}</div>
        <div class="info">
          <span class="pubdate">{{ replyInfo.create_time }}</span>
          <van-button class="reply-btn" round size="mini" @click.stop="popupShow(1, replyInfo.info.nickname, item._id)"
            >{{ replyInfo.reply_num == 0 ? '' : replyInfo.reply_num }}回复</van-button
          >
        </div>
      </div>
    </van-cell>
  </div>
</template>

<script>
import { Image as VanImage } from 'vant';

export default {
  name: 'replyCom',
  components: { [VanImage.name]: VanImage },
  props: {
    replyInfo: {
      default: {},
    },
  },
  methods: {
    close() {
      this.$emit('close');
    },
  },
};
</script>

<style lang="less" scoped>
::v-deep .van-nav-bar {
  background-color: pink;

  border-radius: 10px 10px 0 0;
}
::v-deep .van-nav-bar__title {
  color: #333;
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
