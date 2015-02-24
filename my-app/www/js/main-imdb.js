moviesData = null;

var currentItems = 1;
var initialItems = 15;

function myapifilms(data) {	
	console.log(data);
	moviesData = data;
}

$(document).ready(function () {

	$(document).on("scrollstop", checkScroll);
	$.ajax({
		data:      'start=1&end=250&format=JSONP&data=F',
		url:       'http://www.myapifilms.com/imdb/top',
		dataType:  'jsonp',
		success:   function (response, textStatus, jqXHR) {
			
		}
	});

	$('#item-list').bind('pagebeforeshow', function() {
		$('.content-list').listview('refresh');
	});

	$('.type-container > a').on('click', function() {
		//Fill item-list
		loadListContent(this);
		
	});		
});

function loadListContent(anchor) {
	//Clear list
	$('.content-list').empty();
	
	//Append data
	
	for(var i = 0; i < initialItems; i++) {
		var element = moviesData[i];
		var listItem = '<li><a id="' + element.idIMDB + '"  data-type="movie" href="#detail-page"><img class="ui-li-thumb" src="' + element.urlPoster + '">' + element.title + '<br/>Rank: ' + element.ranking + '</a></li>';
		$('.content-list').append(listItem);
		currentItems = (i+1);
	}

	
	attachListeners();	
}

function attachListeners() {
	$('.content-list > li > a').on('click', function() {
		var id = $(this).attr('id');
		var type = $(this).attr('data-type');
		var object = $.grep(moviesData, function(e){ return e.idIMDB == id; });
		if (object) {
			loadDetailPage(object[0]);
		}
	});
}

function loadDetailPage(item) {
	$('#item-title').text(item.title);
	$('#item-description').text(item.plot);
	
	$('#item-img-container').empty();
	$('#item-img-container').append('<img style="border-style: groove;" src="' + item.urlPoster + '" height="150" height="150">');
}

function checkScroll() {
    /* You always need this in order to target
       elements within active page */
    var activePage = $.mobile.pageContainer.pagecontainer("getActivePage"),
 
        /* Viewport's height */
        screenHeight = $.mobile.getScreenHeight(),
 
        /* Content div - include padding too! */
        contentHeight = $(".ui-content", activePage).outerHeight(),
 
        /* Height of scrolled content (invisible) */
        scrolled = $(window).scrollTop(),
 
        /* Height of both Header & Footer and whether they are fixed
           If any of them is fixed, we will remove (1px)
           If not, outer height is what we need */
        header = $(".ui-header", activePage).outerHeight() - 1,
        footer = $(".ui-footer", activePage).outerHeight() - 1,
 
        /* Math 101 - Window's scrollTop should
           match content minus viewport plus toolbars */
        scrollEnd = contentHeight - screenHeight + header + footer;
 
    /* if (pageX) is active and page's bottom is reached
       load more elements  */
    if (activePage[0].id == "item-list" && scrolled >= scrollEnd) {
        /* run loadMore function */
        addMore(activePage);
    }
}

function addMore(page) {
	$(document).off("scrollstop");
	
	$.mobile.loading("show" , {
		text: "Loading more elements...",
		textvisible: true
	});
	
	setTimeout(function() {
		var items = '';
		var last = $("li" , page).length;
		var cont = last + 10;
		
		for (var i = currentItems; i < cont; i++) {
			var element = moviesData[i];
			if(element) {
				items += '<li><a id="' + element.idIMDB + '"  data-type="movie" href="#detail-page"><img class="ui-li-thumb" src="' + element.urlPoster + '">' + element.title + '<br/>Rank: ' + element.ranking + '</a></li>';
				//$('.content-list').append(listItem);
			}
			//items += '<li><a id="' + (9000+i) + '"  data-type="unknown" href="#detail-page"><img class="ui-li-thumb" src="img/no-img.jpg">Element' + i + ' after scroll.</a></li>';
		}
		console.log("CONT: " + (cont));
		currentItems = cont;
		$(".content-list").append(items).listview('refresh');
		$.mobile.loading("hide");
		attachListeners();	
		$(document).on("scrollstop", checkScroll);
	}, 500);
}


