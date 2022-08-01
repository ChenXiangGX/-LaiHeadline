import { formDate } from '@/comon/utils/utils';
import { getArticleDetail, remove_fav, add_fav, unlike, like, comment_like, comment_unlike } from '@/api/home';
export default {
  //文章详情
  getArticleDetail() {
    // console.log(this);
    let { article_id, uid: user_id } = this;

    getArticleDetail({ article_id, user_id }).then((res) => {
      // console.log(res);
      if (res.code == 0) {
        res.data.time = formDate(res.data.time);
        this.article = res.data;
        //为了解决下拉加载问题
        // this.get_comment_list();
      }
    });
  },
  // 切换文章收藏
  togglefav() {
    let {
      uid,
      article: { is_fav },
      article_id,
    } = this;
    if (!uid) {
      this.$toast('请先登录');
      setTimeout(() => {
        this.$router.push('/login');
      }, 1000);
      return;
    }
    // 没收藏 收藏

    if (is_fav) {
      //  如果原来是收藏的   就调 取消的

      remove_fav({
        article_id,
        user_id: uid,
      }).then((res) => {
        this.$toast(res.msg);
        if (res.code == 0) {
          this.article.is_fav = false;
        }
      });
    } else {
      add_fav({
        article_id,
        user_id: uid,
      }).then((res) => {
        this.$toast(res.msg);
        if (res.code == 0) {
          this.article.is_fav = true;
        }
      });
    }
  },
  // 切换文章点赞
  toggleLike() {
    let {
      uid,
      article: { is_like },
      article_id,
    } = this;
    if (!uid) {
      this.$toast('请先登录');
      setTimeout((v) => {
        this.$router.push('/login');
      });
      return;
    }
    if (is_like) {
      unlike({
        article_id,
        user_id: uid,
      }).then((res) => {
        this.$toast(res.msg);
        if (res.code == 0) {
          this.article.is_like = false;
        }
      });
    } else {
      like({
        article_id,
        user_id: uid,
      }).then((res) => {
        this.$toast(res.msg);
        if (res.code == 0) {
          this.article.is_like = true;
        }
      });
    }
  },
  //切换评论点赞
  toggleCommentLike(comment_id, is_like, index) {
    if (!this.checkLogin()) return;

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
          this.commentList[index].like_count = res.count;
          this.commentList[index].is_like = false;
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
          this.commentList[index].like_count = res.count;
          this.commentList[index].is_like = true;
        }
      });
    }
  },
};
