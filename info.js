
document.addEventListener("DOMContentLoaded", function () {
  // The URL of the image to load is passed on the URL fragment.
  var content = window.location.hash.substring(1);
  var tbody = document.getElementById("tbody");
  var tokenResponse = document.getElementById("tokenResponse");
  var allIds = document.getElementById("allIds");
  var pagesUrls;

  var accessTokenInput = document.getElementById('access_token');

  function runTokenCheck() {
    accessTokenInput.addEventListener("keyup", function(){
      if (this.value && this.value != '') {
        localStorage.access_token = this.value
        checkToken();
      }
    });

    if (localStorage.access_token && localStorage.access_token != '') {
      accessTokenInput.value = localStorage.access_token;
      checkToken();
    }

    function checkToken() {
      var request = new XMLHttpRequest();
      request.open('GET', 'https://graph.facebook.com/me?access_token=' + accessTokenInput.value, true);

      request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
          // Success!
          var resp = JSON.parse(request.responseText);
          tokenResponse.innerHTML = "TOKEN VALIDO";
          loadPages();
        } else {
          tokenResponse.innerHTML = "TOKEN INVALIDO";
          // We reached our target server, but it returned an error
        }
      };

      request.onerror = function() {
        // There was a connection error of some sort
        tokenResponse.innerHTML = "TOKEN INVALIDO";
      };

      request.send();
    }
  }

  if (content) {
    pagesUrls = content.replace(/ /g,' ').split(" ").filter(function(str){
      return /facebook\.com/.test(str);

    }).map(function(fbPage){
      fbPage = fbPage.replace(
        "http://", "https://")

      if (fbPage.indexOf("https://") == -1) {
        fbPage = "https://" + fbPage
      }

      fbPage = fbPage.replace(
        "https://www.facebook.com", "https://facebook.com").replace(
        "https://fb.com", "https://facebook.com").replace(
        "https://www.fb.com", "https://facebook.com");

      fbPage = fbPage.replace("https://facebook.com/", "");

      fbPage = fbPage.split('/')[0]

      return fbPage;
    });

    var html = pagesUrls.map(function(pageUrl){
      return [
        '<tr>',
          '<td>',
            pageUrl,
          '</td>',
          '<td>',
            'Carregando',
          '</td>',
          '<td>',
          '</td>',
        '</tr>'
      ].join('');
    }).join('');

    tbody.innerHTML = html;

    runTokenCheck();
  }

  function loadPages(){
    var request = new XMLHttpRequest();
    request.open('GET', 'https://graph.facebook.com/?ids=' + pagesUrls.join(',') + '&access_token=' + accessTokenInput.value, true);

    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        // Success!
        var resp = JSON.parse(request.responseText), id, infos = [];

        console.log(resp);

        for (var k in resp) {
            if (resp.hasOwnProperty(k)) {
               id = resp[k].id;

               infos.push({page: k, id: id});
            }
        }

        var html = infos.map(function(info){
          return [
            '<tr>',
              '<td>',
                info.page,
              '</td>',
              '<td>',
                info.id,
              '</td>',
              '<td>',
                '<a href="http://crawler.buzzmonitor.com.br/admin/fbmpages?utf8=%E2%9C%93&q%5Bpage_id_equals%5D='+ info.id +'&commit=Filter&order=id_desc" target="_blank">wall</a> ',
                '<a href="http://crawler.buzzmonitor.com.br/admin/pages?utf8=%E2%9C%93&q%5Bfanpage_id_contains%5D='+ info.id +'&commit=Filter&order=id_desc" target="_blank">pms</a>',
              '</td>',
            '</tr>'
          ].join('');
        }).join('');

        allIds.innerHTML = infos.map(function(info){
          return info.id;
        });

        tbody.innerHTML = html;
      }
    };

    request.send();
  }
});
