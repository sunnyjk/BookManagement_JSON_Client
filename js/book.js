
function searchBook() {
    if(event.keyCode == 13){

        $("#bookListDiv").show();

        $.ajax({
            url: "http://localhost:7070/book/bookList",
            type: "get",
            dataType: "jsonp",
            jsonp: "callback",
            data: {
                keyword : $("#keyword").val()
            },
            success: function (result) {

                for(var i=0; i < result.length; i++){
                    var tr = $("<tr></tr>").attr("data-isbn", result[i].isbn);

                    var imgUrl = $("<img>").attr("src", result[i].img);
                    var imgTd = $("<td></td>").append(imgUrl);
                    var titleTd = $("<td></td>").text(result[i].title);
                    var authorTd = $("<td></td>").text(result[i].author);
                    var priceTd = $("<td></td>").text(result[i].price);
                    var deleteTag = $("<a></a>").attr("class", "remove");
                    var iTag = $("<i></i>").attr("class", "glyphicon glyphicon-remove");
                    deleteTag.append(iTag);
                    deleteTag.on("click", bookDelete);
                    var deleteBtnTd = $("<td></td>").append(deleteTag);

                    var updateTag = $("<a></a>").attr("class", "update");
                    var iTag2 = $("<i></i>").attr("class", "glyphicon glyphicon-pencil");
                    updateTag.append(iTag2);
                    updateTag.on("click", bookInfoUpdate);
                    var updateBtnTd = $("<td></td>").append(updateTag);

                    var detailTag = $("<a></a>").attr("class", "detail");
                    var iTag3 = $("<i></i>").attr("class", "glyphicon glyphicon-zoom-in");
                    detailTag.append(iTag3);
                    detailTag.on("click", bookDetail);
                    var detailBtnTd = $("<td></td>").append(detailTag);

                    var shareTag = $("<a></a>").attr("class", "share");
                    var iTag4 = $("<i></i>").attr("class", "glyphicon glyphicon-heart");
                    shareTag.append(iTag4);
                    shareTag.on("click", bookShare);
                    var shareBtnTd = $("<td></td>").append(shareTag);

                    tr.append(imgTd);
                    tr.append(titleTd);
                    tr.append(authorTd);
                    tr.append(priceTd);
                    tr.append(deleteBtnTd);
                    tr.append(updateBtnTd);
                    tr.append(detailBtnTd);
                    tr.append(shareBtnTd);

                    $("tbody").append(tr);
                }


            },
            error : function () {
                alert("Error!!");
            }
        });
    }
}

function mySort() {
    var rows = $("table").find("tbody > tr").get();
    rows.sort(function (a, b) {
        var keyA = Number($(a).children("td").eq(3).text());
        var keyB = Number($(b).children("td").eq(3).text());

        if(keyA < keyB) return -1;
        if(keyA > keyB) return 1;

        return 0;
    });

    $.each(rows, function (idx, row) {

        $("table").children("tbody").append(row);

    });
}

function bookInfoUpdate() {

    var title = $(this).parent().parent().find("td:nth-child(2)").text();
    var author = $(this).parent().parent().find("td:nth-child(3)").text();
    var price = $(this).parent().parent().children("td").eq(3).text();

    var updateTitleBox = $("<input />").attr("type" ,"text").attr("class", "updateBox").val(title);
    var updateAuthorBox = $("<input />").attr("type" ,"text").attr("class", "updateBox").val(author);
    var updatePriceBox = $("<input />").attr("type" ,"text").attr("class", "updateBox").val(price);

    $(this).parent().parent().find("td:nth-child(2)").empty();
    $(this).parent().parent().find("td:nth-child(3)").empty();
    $(this).parent().parent().find("td:nth-child(4)").empty();
    $(this).parent().parent().find("td:nth-child(2)").append(updateTitleBox);
    $(this).parent().parent().find("td:nth-child(3)").append(updateAuthorBox);
    $(this).parent().parent().find("td:nth-child(4)").append(updatePriceBox);

    var finishBtn = $("<i></i>").attr("class", "glyphicon glyphicon-ok");
    var updateFinishBtn = $("<a></a>").attr("class", "updateFinish").append(finishBtn);

    var updateTd = $(this).parent().parent().find("td:nth-child(6)");
    updateTd.append("<br><br>");
    updateTd.append(updateFinishBtn);

    $(".remove").css("visibility", "hidden");
    $(".update").css("visibility", "hidden");
    $(".detail").css("visibility", "hidden");
    $(".share").css("visibility", "hidden");


    // $(this).parent().parent().find("td:nth-child(4)").empty();
    // $(this).parent().parent().find("td:nth-child(4)").append(updatePriceBox);
    //  tmpTd.replaceWith(updatebox);
    //  tmpTd.append(updatebox);


    updateFinishBtn.on("click", function () {
        var isbn = $(this).parent().parent().attr("data-isbn");
        var updateTitle = $(this).parent().parent().find("td:nth-child(2) > input").val();
        var updateAuthor = $(this).parent().parent().find("td:nth-child(3) > input").val();
        var updatePrice = $(this).parent().parent().find("td:nth-child(4) > input").val();
        console.log(updateTitle + " " + updateAuthor + " " + updatePrice);

        var thisTd = $(this).parent().parent();

        $.ajax({
            url : "http://localhost:7070/book/bookUpdate",
            type : "GET",
            dataType : "jsonp",
            jsonp : "callback",
            data : {
                isbn : isbn,
                title : updateTitle,
                author : updateAuthor,
                price : updatePrice
            },
            success : function (result) {

                console.log(result);
                if(result != null){
                    console.log(result.title);
                    console.log($(this).parent().parent().find("td:nth-child(2)").parent().html());

                    thisTd.find("td:nth-child(2)").text(result.title);
                    thisTd.find("td:nth-child(3)").text(result.author);
                    thisTd.find("td:nth-child(4)").text(result.price);
                }

                $(".updateBox").remove();

                $(".remove").css("visibility", "visible");
                $(".update").css("visibility", "visible");
                $(".detail").css("visibility", "visible");
                $(".share").css("visibility", "visible");
                $(".updateFinish").remove();
            },
            error : function () {
                alert("업데이트 에러 발생");
            }
        })

    });

  //  $(this).parent().parent().find("[type=button]").attr("disabled", "disabled");
}

function bookDelete() {
    var isbn = $(this).parent().parent().attr("data-isbn");
    var thisTd = $(this).parent().parent();

    $.ajax({
        url : "http://localhost:7070/book/bookDelete",
        type : "GET",
        dataType : "jsonp",
        jsonp : "callback",
        data : {
            isbn : isbn
        },
        success : function (result) {
            console.log("Book Delete Result: " + result);
            thisTd.remove();
        },
        error : function () {
            alert("bookDelete Error!!");
        }
    })

}

function bookDetail() {

    var isbn = $(this).parent().parent().attr("data-isbn");
    var thisTd = $(this).parent().parent().find("td:nth-child(2)");
    var detailATd = $(this).parent().parent().find("td:nth-child(7) > a");

    $.ajax({
        url : "http://localhost:7070/book/bookDetail",
        type : "GET",
        dataType : "jsonp",
        jsonp : "callback",
        data : {
            isbn : isbn
        },
        success : function (result) {
            var tableT = $("<table></table>").attr("class", "detailTable");
            var tableBody = $("<tbody></tbody>");

            var dateTd = $("<tr></tr>").append("<td></td>").text("발행일: " + result.date);
            tableBody.append(dateTd);

            var pageTd = $("<tr></tr>").append("<td></td>").text("페이지: " + result.page);
            tableBody.append(pageTd);

            var supTd = $("<tr></tr>").append("<td></td>").text("부록: " + result.supplement);
            tableBody.append(supTd);

            var pubTd = $("<tr></tr>").append("<td></td>").text("페이지: " + result.publisher);
            tableBody.append(pubTd);

            tableT.append(tableBody);
            thisTd.append(tableT);

            detailATd.css("visibility", "hidden");

        },
        error : function () {
            alert("bookDetail Error!!");
        }
    })

}

function bookShare() {

    var isbn = $(this).parent().parent().attr("data-isbn");

}

$(document).ready(function () {

    $("#addBookDiv").hide();
    $("#bookListDiv").hide();

    $("#goAddBook").on("click", function () {

        $("#addBookDiv").slideToggle("slow", function () {
            $("#addBookBtn").on("click", addBookClick);
            $("#addBookCancelBtn").on("click", function () {
                $("#newIsbn").val("");
                $("#newTitle").val("");
                $("#newDate").val("");
                $("#newPage").val("");
                $("#newPrice").val("");
                $("#newPrice").val("");
                $("#newPrice").val("");
                $("#newSupp").val("");
                $("#newPrice").val("");
                $("#newPrice").val("");

                $("#addBookDiv").hide();
            });
        });


    });


    $("#dbJoinBtn").on("click", function () {
        alert("join!");

        var id = $("#joinId").val();
        var pw = $("#joinPw").val();
        var name = $("#joinName").val();

        $.ajax({
            url: "http://localhost:7070/book/join",
            type: "get",
            dataType: "jsonp",
            jsonp: "callback",
            data: {
                id : id,
                pw : pw,
                name : name
            },
            success: function (result) {

                if(result == true){
                    alert("회원가입 완료!");
                } else{
                    alert("회원가입을 다시 진행해주세요!");
                }
            },
            error: function () {

            }
        });
    });

    $("#goLogin").on("click", function () {

        if ($("#goLogin").text().trim() == "Logout") {

            alert("로그아웃 성공!");
            loginTextClear();
            $("#goLogin").text("Login");
            $("#goLogin").attr("data-target", "#loginmodal");
            $("#goJoin").show();
            sessionStorage.clear();

        }

    });

    $("#loginCancel").on("click", loginTextClear);

    $("#loginBtn").on("click", function () {

        var id = $("#loginid").val().trim();
        var pw = $("#loginpw").val().trim();

        if(id == "" || pw == ""){
            alert("ID 혹은 PW을 입력하세요.");
        } else{
            $.ajax({
                url: "http://localhost:7070/book/login",
                type: "get",
                dataType: "jsonp",
                jsonp: "callback",
                data: {
                    id : id,
                    pw : pw
                },
                success: function (result) {

                    if(result = true){
                        alert("로그인 성공!");
                        $("#goLogin").text("Logout");
                        $("#goLogin").attr("data-target", "");
                        $("#goJoin").hide();

                        sessionStorage.id = id;
                        sessionStorage.pw = pw;
                    } else{
                        alert("로그인 실패!");
                    }
                },
                error: function () {

                }
            });
        }

        loginTextClear();

    });

})

function loginTextClear() {
    $("#loginid").val("");
    $("#loginpw").val("");
}

function addBookClick() {

    alert("추가할꺼야!");

    var thisTd = $(this).parent().parent().parent().html();
    console.log(thisTd);

    var newIsbn = $("#newIsbn").val();
    var newTitle = $("#newTitle").val();
    var newDate = $("#newDate").val();
    var newPage = $("#newPage").val();
    var newPrice = $("#newPrice").val();
    var newAuthor = $("#newPrice").val();
    var newTranslator = $("#newPrice").val();
    var newSupp = $("#newSupp").val();
    var newPublisher = $("#newPrice").val();
    var newImgurl = $("#newPrice").val();

    $.ajax({
        url: "http://localhost:7070/book/addBook",
        type: "GET",
        dataType: "jsonp",
        jsonp: "callback",
        data : {
            isbn : newIsbn,
            title : newTitle,
            date : newDate,
            page : newPage,
            price: newPrice,
            author : newAuthor,
            trans : newTranslator,
            sup : newSupp,
            pub : newPublisher,
            img : newImgurl
        },
        success : function (result) {

        },
        error : function () {

        }
    })
}
