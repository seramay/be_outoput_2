$(function() {
  // 検索した結果を表示するHTMLタグのクラスの要素を取得し変数に代入。処理で使用する。
  var search_list = $(".contents.row");

  function appendTweet(tweet) {
    // ツイートを投稿したユーザーがログイン状態、かつ、ログイン中のユーザーのidが 投稿したユーザーのidと一致する場合
    if(tweet.user_sign_in && tweet.user_sign_in.id == tweet.user_id){
      // 一致する場合は検索ページ上でも編集と削除が可能になるリンクタグが渡される。
      var current_user = `<li>
                            <a href="/tweets/${tweet.id}/edit" data-method="get" >編集</a>
                          </li>
                          <li>
                            <a href="/tweets/${tweet.id}" data-method="delete" >削除</a>
                          </li>`
    } else {
      //一致しない場合は編集、削除リンクはない
      var current_user = ""
    }
    // html変数には投稿情報のHTML要素がある。上述の条件に合わない場合は ${current_user} は空なのでリンクタグがない状態になっている。
    // 気をつける要素としては<%= %>のタグを渡してない、jbuilderで取得した値を使用して表示させているということ。
    
    const count = 25;
    if (tweet.text.length > count){
      var extraTweet = tweet.text.substring(0, count);
      var insertTweet = extraTweet += '...';
      // TODO 今回の改造では改行には対応していない。文字数制限はできたのでとりあえず進行
      var html = 
      `<div class="content_post" style="background-image: url(${tweet.image});">
        <div class="more">
          <span><img src="/assets/arrow_top.png"></span>
          <ul class="more_list">
            <li>
              <a href="/tweets/${tweet.id}" data-method="get" >詳細</a>
            </li>
            ${current_user}
          </ul>
        </div>
        <p>${insertTweet}</p><br>
        <span class="name">
          <a href="/users/${tweet.user_id}">
            <span>投稿者</span>${tweet.nickname}
          </a>
        </span>
      </div>`
    }else{
    var html = 
      `<div class="content_post" style="background-image: url(${tweet.image});">
        <div class="more">
          <span><img src="/assets/arrow_top.png"></span>
          <ul class="more_list">
            <li>
              <a href="/tweets/${tweet.id}" data-method="get" >詳細</a>
            </li>
            ${current_user}
          </ul>
        </div>
        <p>${tweet.text}</p><br>
        <span class="name">
          <a href="/users/${tweet.user_id}">
            <span>投稿者</span>${tweet.nickname}
          </a>
        </span>
      </div>`
  }
    // 最初の変数のHTML要素部分に.appendでHTML要素を追加していく。繰り返し処理で呼んでいるので、変数展開部分は引数で渡された配列の値ごとに変わっていく。
    search_list.append(html);
  }

  // tweetsが空の場合の関数、受け取ったメッセージ(引数)をHTML要素に渡して表示。
  function appendErrMsgToHTML(msg) {
    var html = `<div class='name'>${ msg }</div>`
    search_list.append(html);
  }

  // 処理部分
  $(".search-input").on("keyup", function() {
    var input = $(".search-input").val();
    $.ajax({
      type: 'GET',
      url: '/tweets/search',
      data: { keyword: input },
      dataType: 'json'
    })
    .done(function(tweets) {
      // 通信に成功した場合、検索する直前に投稿情報を削除
      search_list.empty();
      // 配列が空でない場合は、引数で配列を渡し、繰り返し処理で関数呼び出し。
      if (tweets.length !== 0) {
        tweets.forEach(function(tweet){
          appendTweet(tweet);
        });
      }
      else {
        appendErrMsgToHTML("一致するツイートがありません");
      }
    })
  });
});