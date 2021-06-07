var position = 0;
var p_id = "";
var spanNum = 0;
function createPatientCards(patients, records){

    
    var patientDataDiv = document.createElement("DIV");
    patientDataDiv.classList.add("patient_data");

    //Button Div
    var patientButtonDiv = document.createElement("DIV");
    patientButtonDiv.classList.add("buttons");

    var deleteButton = document.createElement("DIV");
    deleteButton.classList.add("delete");
    deleteButton.setAttribute("id", patients.patient_id)
    deleteButton.innerHTML = "x";


    var editButton = document.createElement("DIV");
    editButton.classList.add("edit");
    editButton.setAttribute("id", patients.patient_id);
    editButton.innerHTML = "Edit";
    patientButtonDiv.append(deleteButton);
    patientButtonDiv.append(editButton);


    // Patient Image Div
    var patientImgDiv = document.createElement("DIV");
    patientImgDiv.classList.add("patient_img");

    var patientImgImg = document.createElement("IMG");
    patientImgImg.src = "images/user.png";    

   
    patientImgDiv.append(patientImgImg);
   

    // Display Div
    var displayDiv = document.createElement("DIV");
    displayDiv.classList.add("display");

    var firstNameDiv = document.createElement("DIV");
    firstNameDiv.classList.add("fname");
    var firstNameSpan1 = document.createElement("SPAN");
    firstNameSpan1.innerHTML = patients.fname;
    firstNameDiv.append(firstNameSpan1);

    var lastNameDiv = document.createElement("DIV");
    lastNameDiv.classList.add("lname");
    var lastNameSpan1 = document.createElement("SPAN");
    lastNameSpan1.innerHTML = patients.lname;
    lastNameDiv.append(lastNameSpan1);

    var positionDiv = document.createElement("DIV");
    positionDiv.classList.add("position");
    var positionSpan1 = document.createElement("SPAN");
    positionSpan1.innerHTML = records;
    positionDiv.append(positionSpan1);
    

    var patientIdDiv = document.createElement("DIV");
    patientIdDiv.classList.add("patient_id");
    var patientIdSpan1 = document.createElement("SPAN");
    patientIdSpan1.innerHTML = patients.patient_id;
    patientIdDiv.append(patientIdSpan1);

    displayDiv.append(firstNameDiv);
    displayDiv.append(lastNameDiv);   
    displayDiv.append(positionDiv); 
    

    patientDataDiv.append(patientButtonDiv);
    patientDataDiv.append(patientImgDiv);
    patientDataDiv.append(displayDiv);

    return patientDataDiv;
}

var patientPath = "http://10.10.4.124:5000/api/patient";
function getPatientData(){
    console.log("Patient Data");
    return fetch(patientPath).then(res => res.json()).then(json => json);
}

var recordPath = "http://10.10.4.124:5000/api/record/";
function getPosition(id){
    return fetch(recordPath + id).then(res => res.json()).then(json => json);
}

async function getPositionData(id){
    let record = await getPosition(id);
    console.log(record.position);
    position = record.position;
    return position;
}

async function displayPatientData(){
    let patients = await getPatientData();  
    console.log(patients);

    patients.forEach(patients => {
        console.log(patients.patient_id);
        getPositionData(patients.patient_id).then(res => {
            var content = document.querySelector(".content");
            console.log(res);
            content.append(createPatientCards(patients, res));
        });        
    });
}

window.onload = function(){
    var elements = document.getElementsByClassName("patient_img");




    displayPatientData();

    window.setTimeout(function(){
        var deleteButtons = document.querySelectorAll(".delete");
        deleteButtons.forEach(button => {
            button.addEventListener("click", function(){
               
                console.log("DELETE "+ button.id);
                fetch(patientPath +"/"+ button.id, {
                    method: "DELETE",
                    headers: {
                        "Content-type": "application/json",
                    },
                });

                var content = document.querySelector(".content");
                content.innerHTML = "";
            });
        });

        var editButtons = document.querySelectorAll(".edit");
        editButtons.forEach(button => {
            button.addEventListener("click", function(){
               
                console.log(button.id);

               
                sessionStorage.setItem("patient_id", button.id);
                location.href = "add_patient.html";
                window.open("add_patient.html");
            });
        });
        
    
    var patientImg = document.querySelectorAll("img");
    patientImg.forEach(img => {
        img.addEventListener("click", function(){
            console.log(img.id);

            
            sessionStorage.setItem("patient_id", img.id);
            location.href = "individual.html";
            window.open("individual.html");
        });
    })

    }, 3000);   
     
    eventSource.addEventListener("online", function(e) {
        
        info = JSON.parse(e.data);
        position = info.position;
        p_id = info.id;
        console.log(position +" "+p_id);

        
        var searchID = p_id + ":";
        var span2 = document.getElementById(searchID);
        span2.innerHTML = position;
        console.log(position);
        
    }, true);
} 