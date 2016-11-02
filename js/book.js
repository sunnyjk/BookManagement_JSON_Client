
function searchBook() {
    if(event.keyCode == 13){

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
                    deleteTag.on("click", function () {
                        $(this).parent().parent().remove();
                    });
                    var deleteBtnTd = $("<td></td>").append(deleteTag);

                    var updateTag = $("<a></a>").attr("class", "remove");
                    var iTag2 = $("<i></i>").attr("class", "glyphicon glyphicon-pencil");
                    updateTag.append(iTag2);
                    updateTag.on("click", bookInfoUpdate());
                    var updateBtnTd = $("<td></td>").append(updateTag);

                    tr.append(imgTd);
                    tr.append(titleTd);
                    tr.append(authorTd);
                    tr.append(priceTd);
                    tr.append(deleteBtnTd);
                    tr.append(updateBtnTd);

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
    alert("update!!");
    // $(this).parent().parent().find("td:nth-child(4)").text();
    var tmpTd = $(this).parent().parent().children("td").eq(3);
    var title = $(this).parent().parent().find("td:nth-child(2)").text();
    var author = $(this).parent().parent().find("td:nth-child(3)").text();
    var price = tmpTd.text();
    var updateTitle = $("<input />").attr("type" ,"text").val(title);
    var updateAuthor = $("<input />").attr("type" ,"text").val(author);
    var updatebox = $("<input />").attr("type" ,"text").val(price);

    var finishBtn = $("<i></i>").attr("class", "glyphicon glyphicon-ok");
    $(this).parent().parent().find("td:nth-child(6) > i").replaceWith(finishBtn);


    updatebox.on("keyup", function () {
        if(event.keyCode == 13){
            // update 처리
            // 일단 DB 처리하고
            // AJAX 호출해서 서버프로그램을 실행시켜 Database 데이터를 변경.
            // 서버 프로그램에 어떤 값을 알려줘서 처리
            // 변경된 책 가격, ISBN 값 필요
            var isbn = $(this).parent().parent().attr("data-isbn");
            var updatePrice = $(this).val();

            console.log(isbn + " : " + updatePrice);

            $.ajax({
                url : "http://localhost:7070/book/bookUpdate",
                type : "GET",
                dataType : "jsonp",
                jsonp : "callback",
                data : {
                    isbn : isbn,
                    price : updatePrice
                },
                success : function (result) {
                    alert("정상 실행!");
                    $(this).parent().parent().find("td:nth-child(4)").empty();
                    $(this).parent().parent().find("td:nth-child(4)").text(price);
                },
                error : function () {
                    alert("업데이트 에러 발생");
                }
            })

            // 그 후에 화면처리
            alert("update finished!! " + isbn);
        }
    });

    $(this).parent().parent().find("td:nth-child(4)").empty();
    $(this).parent().parent().find("td:nth-child(4)").append(updatebox);
    //  tmpTd.replaceWith(updatebox);
    //  tmpTd.append(updatebox);

    $(this).parent().parent().find("[type=button]").attr("disabled", "disabled");
}