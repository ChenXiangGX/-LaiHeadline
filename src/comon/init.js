import store from '@/store';

export default function () {
  return new Promise((res, rej) => {
    let token = localStorage.getItem('token');

    let tokenExpired = localStorage.getItem('tokenExpired');

    if (token) {
      let now = Date.now();
      if (now >= tokenExpired) {
        //  过期了
        localStorage.clear();
        res();
      } else {
        store.dispatch('getUserInfo', token).then(() => {
          res();
        });
      }
    } else {
      res();
    }
  });
}
