$(document).ready(function(){
    readData()
    submitforms();

    $('#full').click(function(){
        let title=$("#title").val();
        let description=$('#description').val();
        let completiondate=$('#completiondate').val();
        let imagename=$('#form1 #myfile').val().split('\\').pop();;
        let docname=$('#form2 #myfile').val().split('\\').pop();;
        alert(title+" "+description+" "+completiondate+" "+imagename+" "+docname)
        $.ajax('https://fdpurq55gj.execute-api.ap-south-1.amazonaws.com/ProdTodo/tasks', {
            type: 'POST',  // http method
            dataType: 'json',
            //contentType: 'application/json',
            data: JSON.stringify({ id:Math.round(Math.random()*10000),title:title,description:description,completiondate:completiondate,imagename:imagename,docname:docname}),  // data to submit
            success: function (data, status, xhr) {
                alert("uploaded Successfully")
               console.log($("#form1"))
                 $( '#btn1' )[0].click()
                 $( '#btn2' )[0].click()

             
            },
            error: function (jqXhr, textStatus, errorMessage) {
                    alert("failure");
            }
        });
    })
})


function submitforms(){
    console.log($('#form1')[0])
$( '#btn1' ).click(

function( e ) {
    e.preventDefault();
    let form = $('#form1')[0]
  console.log('this is getting called')
  
 $.ajax( {
    url: 'http://3.110.84.186:8080/upload-image',
    type: 'POST',
    crossDomain:true,
    data: new FormData( form ),
    processData: false,
    contentType: "multipart/form-data",
    success:function(){
        console.log("file successfully uploaded")
    },
    error:function(e){
        console.log(e)
    }
  } );
  e.preventDefault();
} );
$( '#btn2' ).click( function( e ) {

    e.preventDefault();
    let form = $('#form2')[0]
  $.ajax( {
    url: 'http://3.110.84.186:8080/upload-image',
    type: 'POST',
    crossDomain:true,
    data: new FormData( form ),
    processData: false,
    contentType: "multipart/form-data",
    success:function(){
        console.log("file successfully uploaded")
    },
    error:function(e){
        console.log(e)
    }
  } );
 
} );
}
function readData(){
    $.get("https://fdpurq55gj.execute-api.ap-south-1.amazonaws.com/ProdTodo/tasks",function(data){
        let code="<ul class='list-group'>"
        for(let x in data.tasks){
           code+="<li class='list-group-item'>"
           code+="<h3>"+data.tasks[x].title+"</h3>"
           code+="<p>"+data.tasks[x].description+"</p>"
           code+="<h6>Completion Date:"+data.tasks[x].completiondate+"</h6>"
           code+="<h5> Document :: <a href='http://3.110.84.186:8080/download-file/"+data.tasks[x].docname+"'>"+data.tasks[x].docname+"</a><h5>"
           code+="<h5>Image::<h5>"+"<img src='http://3.110.84.186:8080/download-file/"+data.tasks[x].imagename+"'>"
           code+="</li>"
        }
        code+="</ul>"
        $("#container").html(code)
    })
}