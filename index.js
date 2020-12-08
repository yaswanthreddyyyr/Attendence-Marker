var live_server='http://localhost:5500/'
let profi='';
var a='';
let cr=0;
let image_url='';
let attendence=new Array;
let courses=new Array;
function SignOut(){
   var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
  window.location.reload();
}
function onSuccess(googleUser) {

      console.log('Logged in as: ' + googleUser.getBasicProfile());
       var profile=googleUser.getBasicProfile();
       a=profile.getEmail();
       image_url=profile.getImageUrl();
       let image=`
       <a class="image-link" href="${image_url}">
    <img class="rounded-circle article-img" src="${image_url}" id="img">
    </a>
       
        
       `;
      
      //  profi+=`
      //  <center>
      //  <img class="rounded-circle article-img" src="${image_url}" id="img">
      //  Name:${profile.getName()}
      //  Email:${profile.getEmail()}
      //   </center>
      //  `
       
       document.getElementById('im').innerHTML=image;
       console.log(a);
       document.getElementById("signin").style.visibility = "hidden";
      //  document.getElementById("h4").style.visibility = "hidden";
        function check(){
          let b=a.slice(-11);
          let c='iitdh.ac.in'
          console.log(b);
          console.log(c);
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
  // document.getElementById('welco').visibility='hidden';
  fetch('http://ssl-backend-django.herokuapp.com/api/getAttandance?email='+a+'&course='+name)
  .then(res =>res.json())
  .then((data)=>{
    console.log(data);
    data = JSON.parse(data);
    let stud=data.enrolled_students.students;
    console.log(stud);
    // let output='<h2>Mark Attendence</h2>';
    let output='';
    output+=`<form id="attendenceform" >`;
    
    stud.forEach(function(user){
      // user = JSON.parse(user);
      console.log(user);
      
      output+=`
      
      
       <b>${user.name}:</b>
        <label for="${user.email}" class="form-check-label">Present</label>
        <input type="radio"  id="P" value="P" name="${user.email}" required class="form-check-input">
        
        <label for="${user.email}" class="form-check-label">Absent</label>
        <input type="radio"  id="A" value="A"  name="${user.email}" required class="form-check-input">
        
        <br>
        `;
    
    })
    

    output+=`<br><input type="submit" value="Submit" class="btn btn-dark" >`;
    output+=`</form>`;
    document.getElementById('output').innerHTML=output;
    
    document.getElementById('attendenceform').addEventListener('submit',function(e){
      e.preventDefault();
      // var formData = new FormData(document.querySelector('form'));
      var data = $('form').serializeArray();
      
      console.log(data);
      data.forEach(
        function(user){
          attendence.push(user.value);
          
        }
      )
      console.log(attendence);
      fetch('http://ssl-backend-django.herokuapp.com/api/setAttandance?email='+a+'&course='+name+'&attandance='+attendence)
      .then(res => console.log(res.status()))
      let p=0;
      let n=attendence.length;
      for(let i=0;i<attendence.length;i++){
        if(attendence[i]=='P'){
          p++;
        }
      }
      console.log(p);
      anychart.onDocumentReady(function() {

  // set the data
  var data = [
      {x: "Present", value: p},
      {x: "Absent", value: n-p},
      
  ];

  // create the chart
  var chart = anychart.pie();

  // set the chart title
  chart.title("Today's Attandance");

  // add the data
  chart.data(data);

  // display the chart in the container
  chart.container('container');
  chart.draw();

});
      let new_out='';
      new_out=`
      ${p} out of ${n} are present in Today's Class
      <br>
      <br>
      <button onclick="window.location.reload()" class="btn btn-dark">Back</button>
      
      `;
      document.getElementById('output').innerHTML=new_out;
    })

  })

}
function getCourses(){
  fetch('http://ssl-backend-django.herokuapp.com/api/getCourses?email='+a)
  .then(res => res.json())
  .then((data)=>{
    console.log(data);
    let output='<h2>My Courses</h2><br>';
    // console.log(data.name);
    data.forEach(function(user){
      user=JSON.parse(user);
      cr=cr+1;
      output+=`<button id="button${cr}"  class="btn btn-dark">${user.name}</button> <br> <br>`;
      // console.log(user.name);
      addArray(user.name);
       
      
  });
  
    
    document.getElementById('output').innerHTML= output;
    // console.log(data);
  console.log(cr);
  for(let i=1;i<=cr;i++){
    console.log(courses[i-1]);
    document.getElementById('button'+i).addEventListener('click',function(){
      
      getStudents(courses[i-1]);
    })
  }
})
}


// console.log(attendence);  


  


  





















