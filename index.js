var live_server='http://localhost:5500/'

var a='';
let cr=0;
let attendence=new Array;
let courses=new Array;
function SignOut(){
  window.location.reload();
}
function onSuccess(googleUser) {

      console.log('Logged in as: ' + googleUser.getBasicProfile());
       var profile=googleUser.getBasicProfile();
       a=profile.getEmail();
       
       console.log(a);
       document.getElementById("signin").style.visibility = "hidden";
       document.getElementById("h4").style.visibility = "hidden";
       function GAdd() {  
                var myDiv = document.getElementById("output");  
                var button = document.createElement('BUTTON');  
                  button.setAttribute("id", "btn1");
                 
                var text = document.createTextNode("Go to my courses"); 
                  
                 
                button.appendChild(text); 
                myDiv.appendChild(button); ;  
       }
       GAdd();
       document.getElementById('btn1').addEventListener('click',getCourses);
       
       
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
  fetch('http://localhost:3000/'+name)
  .then(res =>res.json())
  .then((data)=>{
    console.log(data);
    // let output='<h2>Mark Attendence</h2>';
    let output='';
    output+=`<form id="attendenceform" >`;
    data.forEach(function(user){
      output+=`
      <p>${user.name}</p>
        <label for="${user.email}">Present</label>
        <input type="radio"  id="P" value="P" name="${user.email}" required>
        <label for="${user.email}">Absent</label>
        <input type="radio"  id="A" value="A"  name="${user.email}" required>
        <br>`
        
    
    })
    
    output+=`<input type="submit" value="Submit" >`;
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
          // console.log(attendence);
        }
      )
    })

  })

}
function getCourses(){
  fetch('http://www.localhost:3000/courses?email='+a)
  .then(res => res.json())
  .then((data)=>{
    console.log(data);
    let output='<h2>My Courses</h2>';
    data.forEach(function(user){
      cr=cr+1;
      output+=`<button id="button${cr}">${user.name} </button><br>`;
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


console.log(attendence);  


  

 
  





















