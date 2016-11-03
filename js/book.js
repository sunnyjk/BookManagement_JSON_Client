
function searchBook() {
    if(event.keyCode == 13){

        alert("d????");

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

    $("#goAddBook").on("click", function () {

        var addInfo = $("<h2>Add Books!</h2>").attr("class", "post-title");

        var addDiv = $("<div></div>").attr("class", "table-responsive");
        var addTable = $("<table></table>").attr("class", "table table-striped myTable");
        var addTbody = $("<tbody></tbody>");

        var bisbn = $("<th></th>").text("ISBN");
        var data1 = $("<input />").attr("type", "text").attr("id", "newIsbn");
        var td1 = $("<td></td>").append(data1);
        var tr1 = $("<tr></tr>");
        tr1.append(bisbn);
        tr1.append(td1);

        var btitle = $("<th></th>").text("TITLE");
        var data2 = $("<input />").attr("type", "text").attr("id", "newTitle");
        var td2 = $("<td></td>").append(data2);
        var tr2 = $("<tr></tr>");
        tr2.append(btitle);
        tr2.append(td2);

        var bdate = $("<th></th>").text("DATE");
        var data3 = $("<input />").attr("type", "text").attr("id", "newDate");
        var td3 = $("<td></td>").append(data3);
        var tr3 = $("<tr></tr>");
        tr3.append(bdate);
        tr3.append(td3);

        var bpage = $("<th></th>").text("PAGE");
        var data4 = $("<input />").attr("type", "text").attr("id", "newPage");
        var td4 = $("<td></td>").append(data4);
        var tr4 = $("<tr></tr>");
        tr4.append(bpage);
        tr4.append(td4);

        var bprice = $("<th></th>").text("PRICE");
        var data5 = $("<input />").attr("type", "text").attr("id", "newPrice");
        var td5 = $("<td></td>").append(data5);
        var tr5 = $("<tr></tr>");
        tr5.append(bprice);
        tr5.append(td5);

        var bauthor = $("<th></th>").text("AUTHOR");
        var data6 = $("<input />").attr("type", "text").attr("id", "newAuthor");
        var td6 = $("<td></td>").append(data6);
        var tr6 = $("<tr></tr>");
        tr6.append(bauthor);
        tr6.append(td6);

        var btranslator = $("<th></th>").text("TRANSLATOR");
        var data7 = $("<input />").attr("type", "text").attr("id", "newTranslator");
        var td7 = $("<td></td>").append(data7);
        var tr7 = $("<tr></tr>");
        tr7.append(btranslator);
        tr7.append(td7);

        var bpublisher = $("<th></th>").text("PUBLISHER");
        var data8 = $("<input />").attr("type", "text").attr("id", "newPublisher");
        var td8 = $("<td></td>").append(data8);
        var tr8 = $("<tr></tr>");
        tr8.append(bpublisher);
        tr8.append(td8);

        var bimgurl = $("<th></th>").text("IMG URL");
        var data9 = $("<input />").attr("type", "text").attr("id", "newImgurl");
        var td9 = $("<td></td>").append(data9);
        var tr9 = $("<tr></tr>");
        tr9.append(bimgurl);
        tr9.append(td9);

        var sendBtn = $("<button>ADD</button>").attr("class", "btn");
        sendBtn.on("click", addBookClick);
        var td10 = $("<td></td>").attr("colspan", "2").append(sendBtn);
        td10.append($("<button>Cancel</button>").attr("class", "btn"));
        var tr10 = $("<tr></tr>").append(td10);

        addTbody.append(tr1);
        addTbody.append(tr2);
        addTbody.append(tr3);
        addTbody.append(tr4);
        addTbody.append(tr5);
        addTbody.append(tr6);
        addTbody.append(tr7);
        addTbody.append(tr8);
        addTbody.append(tr9);
        addTbody.append(tr10);
        addTable.append(addTbody);
        addDiv.append(addTable);
        addDiv.append($("<hr>"));


        $("#addBookDiv").append(addInfo);
        $("#addBookDiv").append(addDiv);
    });

})

function addBookClick() {
    alert("add!!");

    var thisTd = $(this).parent().parent().parent().html();
    console.log(thisTd);

    var newIsbn = $("#newIsbn").val();
    var newTitle = $("#newTitle").val();
    var newDate = $("#newDate").val();
    var newPage = $("#newPage").val();
    var newPrice = $("#newPrice").val();
    var newAuthor = $("#newPrice").val();
    var newTranslator = $("#newPrice").val();
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
            pub : newPublisher,
            img : newImgurl
        },
        success : function (result) {

        },
        error : function () {

        }
    })
}
