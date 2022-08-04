<template>
  <div class="artice">
    <!-- 导航栏 -->
    <van-nav-bar left-text="返回" left-arrow @click-left="$router.back()">
      <template #title> 文章详情 </template>
    </van-nav-bar>
    <!-- /导航栏 -->
    <!--list 这里会出现一直加载评论，原因可能是加载太靠前了, 先关掉:immediate-check="false" 废弃 -->
    <!-- :style="{ height: 'calc(' + windowHeight + ' - 100px)' }" 解决双滚动条 -->
    <div class="container">
      <div class="article-content">
        <h1 class="title">{{ article.title || title }}</h1>
        <van-skeleton title avatar :row="3" :loading="!article.title">
          <div ref="renderContent">
            <van-cell center class="user-info">
              <div slot="title" class="name">{{ article.author }}</div>
              <van-image slot="icon" class="avatar" round fit="cover" :src="article.avatar" />
              <div slot="label" class="pubdate">{{ article.time }}</div>
              <!-- <van-button class="follow-btn" type="default" icon="plus" round size="small">已关注</van-button> -->
            </van-cell>
            <div class="markdown-body">
              {{ article.content }}
            </div>
          </div>
        </van-skeleton>
        <van-divider :style="{ borderColor: '#999' }"> </van-divider>
        <div class="section-title2">热门评论</div>
        <!-- 文章评论列表这里套div是因为下拉加载位置没找准导致的 所以添加div增加样式-->
        <div>
          <van-list v-model="commentLoading" :finished="commentFinished" @load="get_comment_list">
            <template #finished>
              <div>
                <p v-if="commentList.length === 0">抢沙发</p>
                <p v-else>没有更多数据了</p>
              </div>
            </template>
            <van-cell class="comment-item" v-for="(item, index) in commentList" :key="index">
              <van-image slot="icon" class="avatar" round fit="cover" :src="item.info.avatar" />
              <div slot="title" @click.stop="openReply(item, index)">
                <div class="title-w">
                  <div class="name">{{ item.info.nickname }}</div>
                  <div class="like-w">
                    <van-icon
                      :class="{ liked: item.is_like }"
                      @click.stop="toggleCommentLike(item._id, item.is_like, index)"
                      class="like-icon"
                      name="good-job"
                    />
                    <span class="like-count">{{ item.like_count == 0 ? '' : item.like_count }}</span>
                  </div>
                </div>
                <div class="content">{{ item.content }}</div>
                <div class="info">
                  <span class="pubdate">{{ item.create_time | formatDate }}</span>
                  <van-button
                    class="reply-btn"
                    round
                    size="mini"
                    @click.stop="PopupShow(1, item.info.nickname, item._id, item, index)"
                    >{{ item.reply_num == 0 ? '' : item.reply_num }}回复</van-button
                  >
                </div>
              </div>
            </van-cell>
          </van-list>
        </div>
        <!-- /文章评论列表 -->
      </div>
    </div>
    <!-- /发布评论 -->
    <div class="article-bottom">
      <van-button class="comment-btn" type="default" round size="small" @click="PopupShow(0)">写评论</van-button>
      <van-icon name="comment-o" v-if="article.comment && article.comment == 0" color="#777" />
      <van-icon v-else :badge="article.comment" name="comment-o" color="#777" />
      <van-icon name="star" @click="togglefav" :color="article.is_fav ? '#f00' : '#777'" />
      <van-icon @click="toggleLike" :color="article.is_like ? '#f00' : '#777'" name="good-job" />
      <van-icon name="share" @click="showShare = true" color="#777777"></van-icon>
    </div>
    <!-- 评论回复 -->

    <van-popup v-model="commentPopupShow" position="bottom">
      <div class="post-comment">
        <van-field
          v-model="content"
          rows="4"
          autosize
          type="textarea"
          maxlength="1000"
          :placeholder="reply_placeholder"
          show-word-limit
          ref="content"
        />
        <div style="width: 100%">
          <van-button size="large" @click="submit" type="primary">确定</van-button>
        </div>
      </div>
    </van-popup>
    <!-- /评论回复 -->

    <!--   /回复   -->

    <van-popup v-model="replyPopupShow" :overlay="false" position="bottom" style="height: 100%">
      <replyCom
        @close="replyPopupShow = false"
        :replyPopupShow="replyPopupShow"
        :replyInfo="replyInfo"
        :commentList="commentList"
      ></replyCom>
    </van-popup>

    <van-share-sheet v-model="showShare" title="立即分享给好友" :options="options" @select="onSelect" />
    <van-popup v-model="qrcodePopup" round>
      <p
        :style="{
          textAlign: 'center',
          margin: '10px 0 0 0',
        }"
      >
        打开微信/浏览器扫一扫
      </p>
      <van-image :src="qrcodeURL"></van-image>
    </van-popup>
  </div>
</template>

<script>
import { Image as VanImage } from 'vant';
import { ShareSheet } from 'vant';

import articleMethods from './articleMethods';
import commentList from './commentminxin';
import { mapState } from 'vuex';
import { Divider } from 'vant';
import { Skeleton } from 'vant';
import { addComment } from '@/api/home';
import replyCom from './replyCom.vue';
import '@/comon/utils/github-markdown.css';
import QRCode from 'qrcode';
import html2canvas from 'html2canvas';
export default {
  data() {
    return {
      // show: false,
      content: '',
      title: '',
      article_id: '',
      article: {},
      //
      commentPopupShow: false,
      comment_type: 0,

      reply_placeholder: '请留下您的精彩评论',
      reply_comment_id: '', //  回复的id  这个数据作为中转
      replyPopupShow: false, //  回复的 弹出层
      replyInfo: {},

      showShare: false,
      options: [
        { name: '微信', icon: 'wechat' },
        { name: 'QQ', icon: 'qq' },
        { name: '微博', icon: 'weibo' },
        { name: '复制链接', icon: 'link' },
        { name: '分享海报', icon: 'poster' },
        { name: '二维码', icon: 'qrcode' },
      ],
      qrcodePopup: false,
      qrcodeURL: '',
    };
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
  mixins: [commentList],
  computed: {
    ...mapState(['uid', 'userInfo']),
  },
  created() {
    let { title, article_id } = this.$route.query;
    this.title = title;
    this.article_id = article_id;
    this.getArticleDetail();
    // console.log(windowHeight);
  },
  methods: {
    //分享
    onSelect({ name }) {
      let title = this.article.title;
      let href = window.location.href;
      switch (name) {
        case 'QQ':
          window.location.href = `http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?title=${title}&href=${href}&content=${title}`;

          break;
        case '微博':
          window.location.href = `http://service.weibo.com/share/share.php?appkey=583395093&title=${title}&url=${window.location.href}&source=bshare&retcode=0&ralateUid=新浪微博`;

          break;
        case '复制链接':
          let input = document.createElement('input');

          input.value = href;
          document.body.appendChild(input);
          input.select();

          document.execCommand('Copy');

          document.body.removeChild(input);
          this.$toast('复制成功');
          break;
        case '二维码':
        case '微信':
          //

          QRCode.toDataURL(href)
            .then((url) => {
              console.log(url);
              this.qrcodeURL = url;
              this.qrcodePopup = true;
            })
            .catch((err) => {
              console.error(err);
            });

          break;

        case '分享海报':
          //useCORS: true
          html2canvas(this.$refs.renderContent, { useCORS: true }).then((canvas) => {
            document.body.appendChild(canvas);
            // console.log(canvas);
            let url = canvas.toDataURL();

            // console.log(url);

            // 生成一个a元素
            var a = document.createElement('a');
            document.body.appendChild(a);

            // 创建一个单击事件
            var event = new MouseEvent('click');

            // 将a的download属性设置为我们想要下载的图片名称，若name不存在则使用‘下载图片名称’作为默认名称
            a.download = name || '下载图片名称';
            // 将生成的URL设置为a.href属性
            a.href = url;

            // 触发a的单击事件
            a.dispatchEvent(event);
            document.body.removeChild(a);
          });

          break;
      }
    }, //  点击评论
    openReply(item, index) {
      this.replyPopupShow = true;

      // console.log(item, index);
      this.replyInfo = { ...item, index };
    },
    ...articleMethods,
    //发布评论
    submit() {
      // this.replyInfo.reply_num += 1;
      let { content, uid: user_id, article_id, comment_type, reply_comment_id } = this;
      content = content.trim();
      if (typeof content != 'string' || content.length === 0) {
        this.$toast('格式错误');
        return;
      }
      addComment({ content, user_id, article_id, comment_type, reply_comment_id })
        .then((res) => {
          // console.log(res);
          this.$toast(res.msg);
          if (res.code == 0) {
            this.commentPopupShow = false;
            this.content = '';
            this.article.comment++;
            // this.replyInfo.reply_num + 1;

            //老方法刷新评论
            //  this.skip = 0;
            //  this.commentFinished = false;
            //  this.commentList = []
            //  this.getCommentList()

            if (comment_type == 0) {
              let { avatar, nickname, username } = this.userInfo;
              let newCommentData = {
                article_id,
                comment_type,
                content,
                create_time: new Date().getTime(),
                like_count: 0,
                reply_comment_id: '',
                reply_num: 0,
                user_id,
                info: {
                  avatar,
                  nickname,
                  username,
                  _id: user_id,
                },
                _id: res.data.id, //   你刚发的这条数据的id
              };
              this.commentList.unshift(newCommentData);
            } else {
              this.replyInfo.reply_num++;
              this.replyPopupShow = true;
            }
          }
        })
        .catch((err) => {});
    },
    PopupShow(comment_type = 0, reply_placeholder, reply_comment_id, item, index) {
      //弹出弹窗

      if (!this.checkLogin()) return;

      this.comment_type = comment_type;

      if (comment_type == 0) {
        this.reply_placeholder = '留下您的精彩评论';
        this.reply_comment_id = '';
      } else {
        this.replyInfo = item;
        this.replyInfo.index = index;
        this.reply_placeholder = '回复：' + reply_placeholder;
        this.reply_comment_id = reply_comment_id;
      }

      this.commentPopupShow = true;
      // this.replyInfo = item;
      // 数据变动-虚拟dom变动  虚拟dom变动 真实dom变动

      //       改数据  统筹 先变动虚拟dom

      //       按照步骤有序的 生产dom
      // 下一次dom更新后  提供一个回调函数
      // this.$refs.content  undefined
      // $nextTick  把多个异步的方法 合一了
      //更新后的值
      this.$nextTick(function () {
        // console.log(this.$refs.content);
        this.$refs.content.focus();
      });
    },
    //
  },

  components: {
    replyCom,
    [VanImage.name]: VanImage,
    [Skeleton.name]: Skeleton,
    [Divider.name]: Divider,
    [ShareSheet.name]: ShareSheet,
  },
};
</script>

<style scoped lang="less">
.artice {
  ::v-deep .van-nav-bar {
    background-color: #caded554;
  }
  ::v-deep .van-nav-bar .van-icon {
    color: black;
  }
  ::v-deep .van-nav-bar__text {
    color: black;
  }
  .article-content {
    overflow-y: auto;
    padding-bottom: 50px;

    .title {
      text-align: center;
      overflow: hidden;
      // text-overflow: ellipsis;
      /*css代码：*/
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 5; /*行数*/
      -webkit-box-orient: vertical;
      max-height: 115px;
      font-size: 20px;
      color: #3a3a3a;
      padding: 24px 20px 18px;
      background-color: #fff;
      margin: 0;
    }
  }

  .user-info {
    .avatar {
      width: 35px;
      height: 35px;
      margin-right: 8px;
    }
    .name {
      font-size: 12px;
      color: #333333;
    }
    .pubdate {
      font-size: 11px;
      color: #b4b4b4;
    }
    .follow-btn {
      width: 85px;
      height: 29px;
    }
  }

  ul {
    list-style: unset;
  }

  .markdown-body {
    padding: 14px;
    word-break: break-all;
    background-color: #fff;
  }
  .section-title2 {
    padding: 10px;
    font-size: 24px;
    color: #222222;
  }
  .article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 44px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .comment-btn {
      width: 141px;
      height: 23px;
      border: 1px solid #eeeeee;
      font-size: 15px;
      line-height: 23px;
      color: #a7a7a7;
    }
    .van-icon {
      font-size: 20px;
      .van-info {
        font-size: 11px;
        background-color: #e22829;
      }
    }
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

  .article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 44px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .comment-btn {
      width: 200px;
      height: 30px;
      border: 1px solid #eeeeee;
      font-size: 15px;
      line-height: 23px;
      color: #a7a7a7;
    }
  }

  .post-comment {
    padding: 14px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }
}
</style>
