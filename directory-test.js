// testing copy
// last edited July 2022

//"data" refers to the column name with no spaces and no capitals
//punctuation or numbers in your column name
//"title" is the column name you want to appear in the published table

var columns = [
    {
        "data": "area",
        "title": "Area",
        "className": "areaName"
    },
    {
        "data": "area2",
        "title": "Area2",
        "render": function(data, type, row) {
            if (data === undefined) {
                data = "";
            }
            return data;
        }
    },
    {
        "data": "area3",
        "title": "Area3",
        "render": function(data, type, row) {
            if (data === undefined) {
                data = "";
            }
            return data;
        }
    },
    {
        "data": "topic",
        "title": "Topic",
        render: function(data) {
            return data + "  ";
        },
        "className": "question preLoad"
    },
    {
        "data": "location",
        "title": "Location",
        "render": function(data, type, row) {
            if (data === undefined) {
                data = "";
            }
            return data;
        },
        "visible": false
    },
    {
        "data": "email",
        "title": "Email",
        "render": function(data, type, row) {
            if (data === undefined) {
                data = "";
            }
            return data;
        },
        "visible": false
    },
    {
        "data": "phone",
        "title": "Phone",
        "render": function(data, type, row) {
            if (data === undefined) {
                data = "";
            }
            return data;
        },
        "visible": false
    },
    {
        "data": "whomtocontact",
        "title": "Contact",
        "render": function(data, type, row) {
            if (data === undefined) {
                data = "";
            } else {
                data = '<strong>' + data + '</strong>';
            }
            
            if (row['location'] != "") {
                data = data + "<br>" + row['location'];
            }
            if (row['phone'] != "") {
                data = data + '<br>' + row['phone'];
            }
            if (row['email'] != "") {
                data = data + '<br><a href="mailto:' + row['email'] + '">' + row['email'] + '</a';
            }

            return '<blockquote>' + data + '</blockquote>';
            
        },
        "className": "answer contact"
    },
    {
        "data": "information",
        "title": "Tell Me More",
        "render": function(data, type, row) {
            if (data === undefined) {
                data = "";
            }
            return data;
        },
        "visible": false
    },
    {
        "data": "url",
        "title": "Website",
        render: function (data, type, row){
            var webIntro = "";
            var webOutro = "";
            if (data === undefined) {
                data = "";
            }
            if (data.substring(0,4) == "http") {
                webIntro = "<a class='learnmorelink' href='";
                webOutro = "'>Learn More</a>"
            }

            if (data != "" && (row['information'] != "" && row['information'] !== undefined)) {
                var email = /[a-zA-Z0-9-_\.]+@[a-zA-Z-_\.]+\.[a-zA-Z]{3}/g
                var info = row['information'].replaceAll(email,'<a href="mailto:$&">$&</a>');
                return info + "<br><br>" + webIntro + data + webOutro;
            }
            else if (data != "") {
                return webIntro + data + webOutro;
            }
            else {
                return data;
            }
        }, 
        "className": "answer info"
    }
];
  
// create the table container and object
$(document).ready(function() {

    $('#demo').html('<table cellpadding="0" cellspacing="0" border="0" class="display table table-bordered table-striped" id="data-table-container"></table>');
    
    function createMenu() { //make menu buttons
         
        $("td.answer")
            .hide();
        
        $("td.preLoad")
            .append("<span class='answer-tab icon-arrow-right'></span>")
            .removeClass("preLoad");
            
        $("td.question")
            .click(function(){
                $(this)
                    .find("span.answer-tab")
                    .toggleClass("icon-arrow-right")
                    .toggleClass("icon-arrow-down")
                    .parent().parent()
                    .find("td.answer")
                    .slideToggle();
                return false;
            });
            
        $(".all-answers")
            .click(function(){
                $("td.answer")
                    .slideDown();
                $(".answer-tab")
                    .removeClass("icon-arrow-right")
                    .addClass("icon-arrow-down");
                return false;
            });
        $(".no-answers")
            .click(function(){
                $("td.answer")
                    .slideUp();
                $(".answer-tab")
                    .removeClass("icon-arrow-down")
                    .addClass("icon-arrow-right");
                return false;
            });

        //add credit image
        $('#data-table-container').after('<img src="https://www.bc.edu/content/dam/bc1/schools/law/js/library/contacts/built_by_bcll_400.png" alt="this application was built by the staff of the Boston College Law Library" width="150" id="library-credit">');

        var hash = window.location.hash;
        if (hash) {
            //console.log(hash);
            $(".topicSearch:contains('"+hash.replace("#","").replaceAll("-"," ")+"')").trigger('click');
        } else {
            //console.log('no hash');
            $("#all").addClass ("selected");
        } 
    }

    var faqTable = $('#data-table-container').dataTable({
        "dom": 'ftr',
        "autoWidth": false,
        "pageLength": 999,
        "ajax": { // pull data from google sheet via Sheets API V4
        url:"https://sheets.googleapis.com/v4/spreadsheets/1nKPgpNotU2NRH7fY-_bAjvFEc95M3MF_5uREiMyvoiw/values/A:J?key=AIzaSyD8Y28YJpVhE4XlVlOoA74Ws47YdPz5nGA",
        cache: true,
        "dataSrc": function(json) {
            var myData = json['values']; //spreadsheet data lives in an array with the name values
            //rewrite data to an object with key-value pairs. This is also a chance to rename or ignore columns
            myData = myData.map(function( n, i ) {
                myObject = {
                    area:n[0],
                    area2:n[1],
                    area3:n[2],
                    topic:n[3],
                    url:n[4],
                    whomtocontact:n[5],
                    location:n[6],
                    email:n[7],
                    phone:n[8],
                    information:n[9]
                };
                return myObject;
            });
            myData.splice(0,1); //remove the first row, which contains the orginal column headers
            //for object in myObject:
            myData.forEach(function extraAreas(obj,index,array) {
                //if area2 != "":
                if ("area2" in obj && obj.area2 != "") {
                    //if area3 != "":
                    if ("area3" in obj && obj.area3 != "") {
                        //append to myObject a new object with: area3->area, rest is a copy
                        myData.push({
                            area:obj.area3,
                            area2:"",
                            area3:"",
                            topic:obj.topic,
                            url:obj.url,
                            whomtocontact:obj.whomtocontact,
                            location:obj.location,
                            email:obj.email,
                            phone:obj.phone,
                            information:obj.information
                        });
                    }
                    //append to myObject a new object with: area2->area, rest is a copy
                    myData.push({
                        area:obj.area2,
                        area2:"",
                        area3:"",
                        topic:obj.topic,
                        url:obj.url,
                        whomtocontact:obj.whomtocontact,
                        location:obj.location,
                        email:obj.email,
                        phone:obj.phone,
                        information:obj.information
                    });
                }
            });
            console.log(myData);
            return myData;
        }
        },
        'columns': columns,
        'order': [[ 0, "asc" ],[ 3, "asc" ]],
        "columnDefs" : [
            { "targets": [0,1,2], "visible": false}
        ],
        'initComplete' : function (settings) {
            createMenu();
        },
        'drawCallback': function ( settings ) {
            var api = this.api();
            var rows = api.rows( {page:'current'} ).nodes();
            var last=null;

            api.column(0, {page:'current'} ).data().each( function ( group, i ) {
                if ( last !== group ) {
                    $(rows).eq( i ).before(
                        '<tr class="group"><td colspan="2">'+group+'</td></tr>'
                    );

                    last = group;
                }
            } );

            var tables = $('.dataTable').DataTable();

            if ($(".left-list")[0]) {
            } else {
                $('div.dataTables_filter').wrap('<div class="left-list"></div>');
                $('div.left-list').append('<ul id="second-list" class="buttons secondary"><li><span class="all-answers">Open all answers</span></li><li><span class="no-answers">Close all answers</span></li></ul>');
                $('div.left-list').before('<div id="topics-list"><ul id="top-list" class="buttons"></ul></div>');
            }

            //console.log('top-list length: ' + $('ul#top-list li').length);
            
            if ($('ul#top-list li').length <= 1 && api.columns(0).data()[0].length > 0) {
                //console.log('drawback list start');
                var subjectList=
                    api
                        .columns( 0, {search:'applied'} )
                        .data()
                        .eq( 0 )      // Reduce the 2D array into a 1D array of data
                        .sort()       // Sort data alphabetically
                        .unique();     // Reduce to unique values
                var cList = $('ul#top-list');
                var liAll = $('<li/>')//Add link for all areas
                    .appendTo(cList);
                var spanAll = $('<span/>')
                    .addClass('selected allTopics btn btn-default btn-red short_name')
                    .attr('id','all')
                    .text('All Topics')
                    .appendTo(liAll);
                $.each(subjectList, function(i)//create subject menu
                    {
                        var li = $('<li/>')
                            .appendTo(cList);
                        var span = $('<span class="btn btn-default btn-red"></span>')
                            .addClass('topicSearch')
                            .text(subjectList[i].toLowerCase());
                        if (subjectList[i].length < 22) {
                            span.addClass('short_name');
                        } 
                        span.appendTo(li);
                        //console.log('added subject');
                    }
                );
                $('span.topicSearch').click (function() { //add function to search buttons
                    $("#top-list span").removeClass("selected");
                    $(this).addClass("selected");	
                    
                    var search = $(this).text();
                    //console.log(search);
                    tables.search("");
                    tables.column(0).search( search, true, false ).draw();
                
                    history.pushState("", document.title, "#"+search.replaceAll(" ","-"));
                });
            
                $("span#all") //add function to All button
                    .click(function(){
                        //console.log("test");
                        $("#top-list span").removeClass("selected");
                        $(this).addClass("selected");	
                        tables.search("");
                        tables.column(0).search( "", true, false ).draw();
                        history.pushState("", document.title, window.location.href.split('#')[0]);
                        
                    });
                
                $('.dataTables_filter input').attr('placeholder',' Keyword, etc...');
            
            };
            

        } //end drawCallback
    }); //end Datatables
    
}); //end $(document).ready
  

//define two custom functions (asc and desc) for string sorting
jQuery.fn.dataTableExt.oSort['string-case-asc']  = function(x,y) {
    return ((x < y) ? -1 : ((x > y) ?  0 : 0));
};

jQuery.fn.dataTableExt.oSort['string-case-desc'] = function(x,y) {
    return ((x < y) ?  1 : ((x > y) ? -1 : 0));
};