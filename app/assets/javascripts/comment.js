$(function(){
  function buildHTML(comment){
    var html = `<p>
                  <strong>
                    <a href=/users/${comment.user_id}>${comment.user_name}</a>
                    ：
                  </strong>
                  ${comment.text}
                </p>`
    return html;
  }
  $('#new_comment').on('submit', function(e){
    e.preventDefault();
    var formData = new FormData(this);
    var url = $(this).attr('action')
    $.ajax({
      url: url,
      type: "POST",
      data: formData,
      dataType: 'json',
      processData: false,
      contentType: false
    })
    .done(function(data){
      // console.log(data.text)user_id, user_nameも取り出し可能;
      if (data.text !== "") {
        var html = buildHTML(data);
        $('.comments').append(html);
        $('.textbox').val('');
      } else {
        alert('コメントを入力してください');
      }
    })
    .fail(function(){
      alert('送信失敗');
    })
    .always(function(){
      $('.form__submit').prop('disabled', false);
    })
  })
})