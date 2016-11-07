
function searchShare() {
    if(event.keyCode == 13){

        $("#shareTable").empty();
        $("#myPager").empty();
        var user = sessionStorage.id;

        $.ajax({
            url: "http://localhost:7070/book/shareList",
            type: "get",
            dataType: "jsonp",
            jsonp: "callback",
            data: {
                keyword: $("#shareSearchKey").val()
            },
            success: function (result) {

                var count = result.length;
                if(count != 0){
                    $("#bookFindResult2").text(count + " Books searched about \"" + $("#keyword").val() + "\"");

                    for(var i=0; i<result.length; i++){
                        var tr = $("<tr></tr>").attr("data-isbn", result[i].isbn);

                        var img = $("<img>").attr("src", result[i].img);
                        var imgTd = $("<td></td>").append(img);

                        var titleTd = $("<td></td>").text(result[i].title);
                        var authorTd = $("<td></td>").text(result[i].author);

                        var shareTag = $("<a></a>").attr("class", "share");
                        var iTag = $("<i></i>").attr("class", "glyphicon glyphicon-heart");
                        shareTag.append(iTag);
                        if(result[i].share == "true"){
                            var userId = $("<h5></h5>").text(result[i].id);
                            shareTag.append(userId);
                            iTag.css("color", "black");
                        } else{
                            shareTag.on("click", rentBook);
                        }
                        var shareTd = $("<td></td>").append(shareTag);

                        var returnTag = $("<a></a>").attr("class", "return");
                        var iTag2 = $("<i></i>").attr("class", "glyphicon glyphicon-repeat");
                        returnTag.append(iTag2);
                        var returnTd = $("<td></td>");
                        if(user == result[i].id){
                            returnTag.on("click", returnBook);
                            returnTd = $("<td></td>").append(returnTag);
                        }

                        tr.append(imgTd);
                        tr.append(titleTd);
                        tr.append(authorTd);
                        tr.append(shareTd);
                        tr.append(returnTd);

                        $("#shareTable").append(tr);

                    }

                    $('#shareTable').pageMe({pagerSelector:'#myPager',showPrevNext:true,hidePageNumbers:false,perPage:4});


                }

            },
            error: function () {
                alert("Share Book List AJAX ERROR.");
            }
        });
    }

}

function rentBook() {
    var isbn = $(this).parent().parent().attr("data-isbn");
    var thisTd = $(this).parent().parent().find("td:nth-child(4) > a");

    if(sessionStorage.loginStatus == "login"){
        console.log("rentBook: login");

        $.ajax({
            url: "http://localhost:7070/book/rentBook",
            type: "get",
            dataType: "jsonp",
            jsonp: "callback",
            data: {
                isbn: isbn
            },
            success: function (result) {
                alert("책 대여 성공! " + thisTd.val());
                $(".badge").text(result.length);
                thisTd.remove();
            },
            error: function () {
                alert("Share Book Add AJAX ERROR.");
            }
        });

    } else{
        alert("로그인 후 이용해주세요!");
    }
}

function returnBook() {
    var isbn = $(this).parent().parent().attr("data-isbn");
    var thisTd = $(this).parent().parent();
    var shareUser = $(this).parent().parent().find("td:nth-child(4) > a > h5").html();

    if(sessionStorage.loginStatus == "login"){

        if(sessionStorage.id == shareUser){
            $.ajax({
                url: "http://localhost:7070/book/returnBook",
                type: "get",
                dataType: "jsonp",
                jsonp: "callback",
                data: {
                    isbn: isbn
                },
                success: function (result) {
                    alert("책 반납 성공! ");
                    $(".badge").text(result.length);
                    thisTd.remove();
                },
                error: function () {
                    alert("Share Book Return AJAX ERROR.");
                }
            });
        } else{
            alert("본인이 대여한 책만 반납할 수 있습니다.");
        }



    } else{
        alert("로그인 후 이용해주세요!");
    }

}

$(document).ready(function () {
    $("#myShareBookBtn").hide();

    // // 현재 로그인 중인 사용자가 대여한 책 권수를 뱃지에 나타내는 기능
    if(sessionStorage.loginStatus == "login"){
        $("#loginUser").text(sessionStorage.id + " ");
        $("#myShareBookBtn").show();

        $.ajax({
            url: "http://localhost:7070/book/userShare",
            type: "get",
            dataType: "jsonp",
            jsonp: "callback",
            data: {
            },
            success: function (result) {
                $(".badge").text(result.length);
            },
            error: function () {
                alert("Share Book Num AJAX ERROR.");
            }
        });
    }

    // 현재 로그인 중인 사용자가 대여한 책 목록 보여주는 기능
    $("#myShareBookBtn").on("click", function () {
        $("#shareTable").empty();

        $.ajax({
            url: "http://localhost:7070/book/sharedBookList",
            type: "get",
            dataType: "jsonp",
            jsonp: "callback",
            data: {
            },
            success: function (result) {

                var count = result.length;
                if(count != 0){
                    $("#bookFindResult2").text(count + " Books searched about \"" + $("#keyword").val() + "\"");

                    for(var i=0; i<result.length; i++){
                        var tr = $("<tr></tr>").attr("data-isbn", result[i].isbn);

                        var img = $("<img>").attr("src", result[i].img);
                        var imgTd = $("<td></td>").append(img);

                        var titleTd = $("<td></td>").text(result[i].title);
                        var authorTd = $("<td></td>").text(result[i].author);

                        var shareTag = $("<a></a>").attr("class", "share");
                        var iTag = $("<i></i>").attr("class", "glyphicon glyphicon-heart");
                        shareTag.append(iTag);
                        if(result[i].share == "true"){
                            var userId = $("<h5></h5>").text(result[i].id);
                            shareTag.append(userId);
                            iTag.css("color", "black");
                        } else{
                            shareTag.on("click", rentBook);
                        }
                        var shareTd = $("<td></td>").append(shareTag);

                        var returnTag = $("<a></a>").attr("class", "return");
                        var iTag2 = $("<i></i>").attr("class", "glyphicon glyphicon-repeat");
                        returnTag.append(iTag2);
                        var returnTd = $("<td></td>");
                        if(result[i].share == "true"){
                            returnTag.on("click", returnBook);
                            returnTd = $("<td></td>").append(returnTag);
                        }

                        tr.append(imgTd);
                        tr.append(titleTd);
                        tr.append(authorTd);
                        tr.append(shareTd);
                        tr.append(returnTd);

                        $("#shareTable").append(tr);

                    }

                }

            },
            error: function () {
                alert("Share Book List AJAX ERROR.");
            }
        });
    });

})

// 페이징
$.fn.pageMe = function(opts) {
    var $this = this,
        defaults = {
            perPage: 7,
            showPrevNext: false,
            hidePageNumbers: false
        },
        settings = $.extend(defaults, opts);

    var listElement = $this;
    var perPage = settings.perPage;
    var children = listElement.children();
    var pager = $('.pager');

    if (typeof settings.childSelector!="undefined") {
        children = listElement.find(settings.childSelector);
    }

    if (typeof settings.pagerSelector!="undefined") {
        pager = $(settings.pagerSelector);
    }

    var numItems = children.size();
    var numPages = Math.ceil(numItems/perPage);

    pager.data("curr",0);

    if (settings.showPrevNext){
        $('<li><a href="#" class="prev_link">«</a></li>').appendTo(pager);
    }

    var curr = 0;
    while(numPages > curr && (settings.hidePageNumbers==false)){
        $('<li><a href="#" class="page_link">'+(curr+1)+'</a></li>').appendTo(pager);
        curr++;
    }

    if (settings.showPrevNext){
        $('<li><a href="#" class="next_link">»</a></li>').appendTo(pager);
    }

    pager.find('.page_link:first').addClass('active');
    pager.find('.prev_link').hide();
    if (numPages<=1) {
        pager.find('.next_link').hide();
    }
    pager.children().eq(1).addClass("active");

    children.hide();
    children.slice(0, perPage).show();

    pager.find('li .page_link').click(function(){
        var clickedPage = $(this).html().valueOf()-1;
        goTo(clickedPage,perPage);
        return false;
    });
    pager.find('li .prev_link').click(function(){
        previous();
        return false;
    });
    pager.find('li .next_link').click(function(){
        next();
        return false;
    });

    function previous(){
        var goToPage = parseInt(pager.data("curr")) - 1;
        goTo(goToPage);
    }

    function next(){
        goToPage = parseInt(pager.data("curr")) + 1;
        goTo(goToPage);
    }

    function goTo(page){
        var startAt = page * perPage,
            endOn = startAt + perPage;

        children.css('display','none').slice(startAt, endOn).show();

        if (page>=1) {
            pager.find('.prev_link').show();
        }
        else {
            pager.find('.prev_link').hide();
        }

        if (page<(numPages-1)) {
            pager.find('.next_link').show();
        }
        else {
            pager.find('.next_link').hide();
        }

        pager.data("curr",page);
        pager.children().removeClass("active");
        pager.children().eq(page+1).addClass("active");

    }

}