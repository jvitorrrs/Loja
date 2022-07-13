


function readImage() {
    const preview = document.getElementById('preview');
    const file = document.querySelector('input[type=file]').files[0];
    const reader = new FileReader();

    reader.addEventListener("load", function () {
        preview.src = reader.result;
    }, false);
    if (file) {
        reader.readAsDataURL(file);
    }
}

var produtos = [];
var produtosNome;
var produtosId = [];
$.getJSON("/Produtos/Filter/", function (data) {
    $.each(data, function (_i, val) {
        produtos.push(val);
    })
    produtosId = produtos.map(item => item.id_Produto);
    produtosNome = produtos.map(item => item.nome);
});

    var cat;
    var groupBy = ({}, 0);
    $(document).ready(function () {
        $(".categoria-div-container").hover(function () {
            if (produtos != null) {
                var grupoCategorias = groupBy(produtos, 'categoria');
                $("<div class='categorias-disponiveis-div'></div>").appendTo(".categoria-div-container");
                $.each(grupoCategorias, function (i, val) {
                    $(".categorias-disponiveis-div").append("<div class='categoria' id='"+i+"' name='" + i +
                        "' onmouseleave='tiposOut()'>" + i + "</div>")
                    
                    $(i).hover(function () {
                        showTipos(i)
                    }, function () {
                        tiposOut();
                    })

                })
            }
            else {
                $("<div class='falha-categoria-div position-absolute'>Nenhuma categoria cadastrada.</div>")
                    .insertAfter(".categoria-div");
            }
        }, function () {
            $(".categorias-disponiveis-div").hide();
            $(".tipos-disponiveis-div").hide();
        })
    })


function showTipos (d) {
    const grupoFinal = groupBy(produtos, 'categoria');
    var name = $(d).attr("name");
    $.map(grupoFinal, function (p, k) {
        if (k == name) {
            var groupTipos = groupBy(p, 'tipo');
            $("<div class='tipos-disponiveis-div' onmouseover='keepTipos(this)'></div>")
            .appendTo(".categorias-disponiveis-div");
            $.each(groupTipos, function (a, b) {
                $("<div class='tipos' onmouseleave='tiposOut()' onclick='renderTiposView(" + a + ")'>"
                    + a + "</div>").appendTo(".tipos-disponiveis-div");
            })  
        }
    })
}

function tiposOut() {
    $(".tipos-disponiveis-div").css("display","none");
}

function keepTipos(a) {
    $(a).css("display", "block");
}

function renderTiposView(b) {
    var url = '/Produtos/Index/';
    $.get(url, b, function(result){
        $("#container").html(result);
    })


}


function renderSearchView() {
    var search = $("#busca-input").val();
    var url = '/Produtos/Index/';
    if(search!=""){
        $.get(url, search, function(result){
            $("#container").html(result);
        })
    }
}

    groupBy = (array, key) => {
        return array.reduce((result, currentValue) => {
            (result[currentValue[key]] = result[currentValue[key]] || []).push(
                currentValue
            );
            return result;
        }, {});
};

function syncFilter() {
    $.ajax({
        url:"/Produtos/Filter/",
        type:"get",
        async:"false",
        success:function(data){
        }
    })
}

function autoCompleteStart(a) {
    autocomplete(a, produtosNome, produtosId);
}
    function autocomplete(inp, arr, id) {
        /*the autocomplete function takes two arguments,
        the text field element and an array of possible autocompleted values:*/
        var currentFocus;
        //*execute a function when someone writes in the text field:*/
        inp.addEventListener("input", function(e) {
            var a, b, i, val = this.value;
            /*close any already open lists of autocompleted values*/
            closeAllLists();
            if (!val) { return false;}
            currentFocus = -1;
            /*create a DIV element that will contain the items (values):*/
            a = document.createElement("DIV");
            a.setAttribute("id", this.id + "autocomplete-list");
            a.setAttribute("class", "autocomplete-items");
            /*append the DIV element as a child of the autocomplete container:*/
            this.parentNode.appendChild(a);
            /*for each item in the array...*/
            for (i = 0; i < arr.length; i++) {
              /*check if the item starts with the same letters as the text field value:*/
              if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                /*create a DIV element for each matching element:*/
                b = document.createElement("DIV");
                /*make the matching letters bold:*/
                  b.innerHTML = "<a href='/Produtos/Details/" + id[i] + "'><strong>" + arr[i].substr(0, val.length)
                      + "</strong>" + arr[i].substr(val.length);
                /*insert a input field that will hold the current array item's value:*/
                b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                /*execute a function when someone clicks on the item value (DIV element):*/
                b.addEventListener("click", function(e) {
                    /*insert the value for the autocomplete text field:*/
                    inp.value = this.getElementsByTagName("input")[0].value;
                    /*close the list of autocompleted values,
                    (or any other open lists of autocompleted values:*/
                    closeAllLists();
                });
                a.appendChild(b);
              }
            }
        });
        /*execute a function presses a key on the keyboard:*/
        inp.addEventListener("keydown", function(e) {
            var x = document.getElementById(this.id + "autocomplete-list");
            if (x) x = x.getElementsByTagName("div");
            if (e.keyCode == 40) {
              /*If the arrow DOWN key is pressed,
              increase the currentFocus variable:*/
              currentFocus++;
              /*and and make the current item more visible:*/
              addActive(x);
            } else if (e.keyCode == 38) { //up
              /*If the arrow UP key is pressed,
              decrease the currentFocus variable:*/
              currentFocus--;
              /*and and make the current item more visible:*/
              addActive(x);
            } else if (e.keyCode == 13) {
              /*If the ENTER key is pressed, prevent the form from being submitted,*/
              e.preventDefault();
              if (currentFocus > -1) {
                /*and simulate a click on the "active" item:*/
                if (x) x[currentFocus].click();
              }
            }
        });
        function addActive(x) {
          /*a function to classify an item as "active":*/
          if (!x) return false;
          /*start by removing the "active" class on all items:*/
          removeActive(x);
          if (currentFocus >= x.length) currentFocus = 0;
          if (currentFocus < 0) currentFocus = (x.length - 1);
          /*add class "autocomplete-active":*/
          x[currentFocus].classList.add("autocomplete-active");
        }
        function removeActive(x) {
          /*a function to remove the "active" class from all autocomplete items:*/
          for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
          }
        }
        function closeAllLists(elmnt) {
          /*close all autocomplete lists in the document,
          except the one passed as an argument:*/
          var x = document.getElementsByClassName("autocomplete-items");
          for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
              x[i].parentNode.removeChild(x[i]);
            }
          }
        }
        /*execute a function when someone clicks in the document:*/
        document.addEventListener("click", function (e) {
            closeAllLists(e.target);
        });
      }
      /*initiate the autocomplete function on the "myInput" element, and pass along the countries array as possible autocomplete values:*/
   