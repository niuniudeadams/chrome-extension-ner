(() => {
  let youtubeLeftControls, youtubePlayer;
  let currentVideo = "";
  let currentVideoBookmarks = [];
  var times=0;
  //find all text method 1
  function countWords() {

    var collectedText;

    $('p,h1,h2,h3,h4,h5').each(function(index, element){
      collectedText += element.innerText + " ";
    });

    // Remove 'undefined if there'
    collectedText = collectedText.replace('undefined', '');

    // Remove numbers, they're not words
    collectedText = collectedText.replace(/[0-9]/g, '');

    // Get
    console.log(collectedText);
    return collectedText;

  }

  // highlight all text method 1
  function highlightText(element) {

    var nodes = element.childNodes;
    for (var i = 0, l = nodes.length; i < l; i++) {
      if (nodes[i].nodeType === 3) {  // Node Type 3 is a text node

        var text = nodes[i].innerHTML;
        console.log(nodes[i].innerHTML);
        nodes[i].innerHTML = "<span style='background-color:yellow'>" + text + "</span>";

      } else if (nodes[i].childNodes.length > 0) {
        highlightText(nodes[i]);  // Not a text node or leaf, so check it's children
      }
    }
  }

  // highlight all text method2
  function doSearch(text, backgroundColor) {
    if (window.find && window.getSelection) {
      document.designMode = "on";
      var sel = window.getSelection();
      sel.collapse(document.body, 0);

      while (window.find(text)) {
        document.execCommand("HiliteColor", false, backgroundColor);
        sel.collapseToEnd();
      }
      document.designMode = "off";
    }
  }

  const getalltext =()=>{
    function isHidden(el) {
      var style = window.getComputedStyle(el);
      return ((style.display === 'none') || (style.visibility === 'hidden'))
    }
    // get the body tag
    var body = document.querySelector('body');

    // get all tags inside body
    var allTags = body.getElementsByTagName('*');



    var ids = [];
    // var index=0;
    // for (var i = 0, max = allTags.length; i < max; i++) {
    //   if (!isHidden(allTags[i])) {
    //     if (allTags[i].innerText != "" && allTags[i].innerText!=
    //         'undefined') {
    //       ids[index++]=allTags[i].innerText;
    //     }
    //
    //
    //   }
    //
    // }
    ids[0]=document.body.innerText;

    console.log(ids);
    if(times%2==0){
      times++;
      $.ajax({
        type: 'post',
        dataType: 'json',
        url: 'http://127.0.0.1:8000/dummypath',
        data: JSON.stringify(ids),
        contentType:"application/json",
        success: function (result){
          var set = new Set();

          for(var i=0;i<result.length;i++){

            set.add(result[i]);
          }
          
          set.forEach(function (element,index,array){
                doSearch(element,"yellow");
          });


          // highlight method3
          // for (var i = 0; i < max; i++) {
          //
          //   if (!isHidden(allTags[i])) {
          //
          //     if (allTags[i].innerHTML != "") {
          //
          //       var innerHTML=allTags[i].innerHTML;
          //       set.forEach(function (element, index, array) {
          //
          //         var cnt = innerHTML.indexOf(element);
          //         var cnt1 = innerHTML.indexOf("highlight");
          //         console.log(cnt1);
          //         if (cnt >=0 && cnt1<0) {
          //           console.log(cnt);
          //           innerHTML = innerHTML.substring(0, cnt) + "<span style='background-color: yellow' class='highlight'>" + innerHTML.substring(cnt, cnt + element.length) + "</span>" + innerHTML.substring(cnt + element.length);
          //           allTags[i].innerHTML= innerHTML;
          //           i++;
          //         }
          //       });
          //     }
          //
          //
          //   }
          // }



        },
        error: function(data){
          console.log("error");
        }

      });
    }else{
      console.log(1);
      if(document.querySelector('span[style*="background-color: yellow;"]') !== null){
        var elem = document.querySelector('span[style*="background-color: yellow;"]');
        var txt = elem.innerText || elem.textContent;
        elem.innerHTML = txt;
   }
        // times++;
        // const elements = document.getElementsByClassName("highlight");
        // for(var i=0;i<elements.length;i++){
        //   Object.assign(elements[i].style,{
        //     backgroundColor: 'transparent',
        //   })
        // }
    }
  }

  const fetchBookmarks = () => {
    return new Promise((resolve) => {
      chrome.storage.sync.get([currentVideo], (obj) => {
        resolve(obj[currentVideo] ? JSON.parse(obj[currentVideo]) : []);
      });
    });
  };

  const addNewBookmarkEventHandler = async () => {
    const currentTime = youtubePlayer.currentTime;
    const newBookmark = {
      time: currentTime,
      desc: "Bookmark at " + getTime(currentTime),
    };

    currentVideoBookmarks = await fetchBookmarks();

    chrome.storage.sync.set({
      [currentVideo]: JSON.stringify([...currentVideoBookmarks, newBookmark].sort((a, b) => a.time - b.time))
    });
  };

  const newVideoLoaded = async () => {
    const bookmarkBtnExists = document.getElementsByClassName("bookmark-btn")[0];

    currentVideoBookmarks = await fetchBookmarks();

    if (!bookmarkBtnExists) {
      const bookmarkBtn = document.createElement("img");

      bookmarkBtn.src = chrome.runtime.getURL("assets/bookmark.png");
      bookmarkBtn.className = "ytp-button " + "bookmark-btn";
      bookmarkBtn.title = "Click to bookmark current timestamp";

      youtubeLeftControls = document.getElementsByClassName("ytp-left-controls")[0];
      youtubePlayer = document.getElementsByClassName('video-stream')[0];

      youtubeLeftControls.appendChild(bookmarkBtn);
      bookmarkBtn.addEventListener("click", addNewBookmarkEventHandler);
    }
  };

  chrome.runtime.onMessage.addListener((obj, sender, response) => {
    const { type} = obj;


    if (type === "NEW") {
        getalltext();
    }
  });


})();

const getTime = t => {
  var date = new Date(0);
  date.setSeconds(t);

  return date.toISOString().substr(11, 8);
};
