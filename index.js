var live_server='http://localhost:5500/'
let profi='';
var a='';
let cr=0;
let image_url='';
instructor_name='';
let attendence=new Array;
let courses=new Array;
function SignOut(){
   var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      // console.log('User signed out.');
    });
  window.location.reload();
}
function onSuccess(googleUser) {
  

      // console.log('Logged in as: ' + googleUser.getBasicProfile());
       var profile=googleUser.getBasicProfile();
       a=profile.getEmail();
       image_url=profile.getImageUrl();
       instructor_name=profile.getName();
       let image=`
       
    <img class="rounded-circle article-img" src="${image_url}" id="img">
    
       
        
       `;
      
       
       document.getElementById('im').innerHTML=image;
      //  console.log(a);
       document.getElementById("signin").style.visibility = "hidden";
      // console.log(name);
        function check(){
          let b=a.slice(-11);
          let c='iitdh.ac.in'
          if(b!=c){
            
            window.alert("Please login with iitdh email id")
            SignOut();
              }
              return;
}
check();
       function GAdd() {  
                var myDiv = document.getElementById("output");  
                var button = document.createElement('BUTTON');  
                  button.setAttribute("id", "btn1");
                  button.setAttribute("class","btn btn-dark")
                 
                var text = document.createTextNode("Go to my courses"); 
                  
                 
                button.appendChild(text); 
                myDiv.appendChild(button); ;  
       }
       GAdd();
       document.getElementById('btn1').addEventListener('click',getCourses);
       var so='';
       so+=`
       <button onclick="SignOut()" class="btn btn-primary" id="sout">
                Signout
            </button>
       `;
       document.getElementById('signOut').innerHTML=so;
       document.getElementById('welco').innerHTML=`<br><br>Hello! ${profile.getName()} `;
       
    }
    function onFailure(error) {
      console.log(error);
      window.location.replace('index.html');
    }
    function renderButton() {
      gapi.signin2.render('my-signin2', {
        'scope': 'profile email',
        'width': 240,
        'height': 50,
        'longtitle': true,
        'theme': 'dark',
        'onsuccess': onSuccess,
        'onfailure': onFailure
        
      });
    }
function addArray(value){
  courses.push(value);
}

function getStudents(name){
  fetch('http://ssl-backend-django.herokuapp.com/api/getAttandance?email='+a+'&course='+name)
  .then(res =>res.json())
  .then((data)=>{
    // console.log(data);
    data = JSON.parse(data);
    let stud=data.enrolled_students.students;
    // console.log(stud);
    let pres=data.number_present;
    // console.log(pres);
    let v='';
    v+=`
    <table class="dates">
    <tr>
    <th><u>Date</u></th>
    
    <th><u>Present Percentage</u></th></tr>
    `;
    var key;
    var num_students=stud.length;
    
    for (key in pres){
      v+=`
      <tr>
      <td>${key}</td>
      
      
      <td>${percentage(pres[key],num_students)}%</td>
      </tr>
      `;
    }
    v+=`</table>
    `;

    let output='';
 
    
    output+=`<form id="attendenceform" >
    <table  class="atte">
    <tr>
    <th><u>Name</u></th>
    <th colspan="2"><u>Attandence</u></th>
  </tr>
    
    `;
    
    stud.forEach(function(user){
      // console.log(user);
      
      output+=`
      <tr>
      <td>
       <b>${user.name}:</b></td>
        <td><label for="${user.email}" class="form-check-label">Present</label>
        <input type="radio"  id="P" value="P" name="${user.email}" required class="form-check-input"></td>
        
        <td><label for="${user.email}" class="form-check-label">Absent</label>
        <input type="radio"  id="A" value="A"  name="${user.email}" required class="form-check-input"></td>
        
        </tr>
        `;
    
    })
    

    output+=`</table><br><input type="submit" value="Submit" class="btn btn-primary" >`;
    output+=`</form>`;
    
    new_output=`
    <div class="row">
  <div class="column" id="left_column"></div>
  <div class="column" id="right_column"></div>
</div>`;
    document.getElementById('output').innerHTML=new_output;
    let left=`<br><br><h3>Course Name:${name}</h3>
    <br>
    <h4>Instuctor:${instructor_name}</h4>
    <br>
    <button class="btn btn-dark" id="mark">Mark Attandance</button>
    `;
    document.getElementById('left_column').innerHTML=left;
    document.getElementById('right_column').innerHTML=v;
    document.getElementById('mark').addEventListener('click',function(e){
      document.getElementById('right_column').innerHTML=output;
    


  document.getElementById('attendenceform').addEventListener('submit',function(e){
      e.preventDefault();
      
      var data = $('form').serializeArray();
      
      // console.log(data);
      data.forEach(
        function(user){
          attendence.push(user.value);
          
        }
      )
      // console.log(attendence);

      fetch('http://ssl-backend-django.herokuapp.com/api/setAttandance?email='+a+'&course='+name+'&attandance='+JSON.stringify(data))
      .then(res => console.log(res.status))
      let p=0;
      let n=attendence.length;
      for(let i=0;i<attendence.length;i++){
        if(attendence[i]=='P'){
          p++;
        }
      }
      // console.log(p);
      anychart.onDocumentReady(function() {


  var data = [
      {x: "Present", value: p},
      {x: "Absent", value: n-p},
      
  ];
  var chart = anychart.pie();
  chart.title("Today's Attandance");
  chart.data(data);
  chart.container('container');
  chart.draw();

});
      let new_out='';
      new_out=`
     <!-- ${p} out of ${n} are present in Today's Class-->
      <br>
      <br>
      <button onclick="window.location.reload()" class="btn btn-dark" id="back">Back</button>
      
      `;
      document.getElementById('output').innerHTML=new_out;
    })
    })
    

  })

}
function getCourses(){
  
  fetch('http://ssl-backend-django.herokuapp.com/api/getCourses?email='+a)
  .then(res => res.json())
  .then((data)=>{
    // console.log(data);
    let output='<h2>My Courses</h2><br>';
    data.forEach(function(user){
      user=JSON.parse(user);
      cr=cr+1;
      output+=`<button id="button${cr}"  class="btn btn-dark">${user.name}</button> <br> <br>`;
      addArray(user.name);
       
      
  });
  
    
    document.getElementById('output').innerHTML= output;
  for(let i=1;i<=cr;i++){
    // console.log(courses[i-1]);
    document.getElementById('button'+i).addEventListener('click',function(){
      
      getStudents(courses[i-1]);
    })
  }
})
document.getElementById('welco').innerHTML=``;
}



function percentage(a,b){
  return Math.round(((a/b)*100),2);
}

  


  





















