var id = sessionStorage.getItem("patient_id");
console.log(id);
sessionStorage.removeItem("patient_id");
sessionStorage.clear();

let button = document.querySelector(".button");
button.addEventListener("click", function(event){
    let fname = document.getElementById("fname").value;
    let lname = document.getElementById("lname").value;
    let age = document.getElementById("age").value;
    let patient_id = document.getElementById("patient_id").value;

    if((fname == "")||(lname == "")||(patient_id == "")||(age == "")){
        
        console.log("Make PATCH Request");

        
        jsonBody = {};
        for(i=0; i< 4; i++){
            if (fname != ""){
                jsonBody["fname"] = fname;
            }
            if (lname != ""){
                jsonBody["lname"] = lname;
            }
            if (age != ""){
                jsonBody["age"] = age;
            }
            if (patient_id != ""){
                jsonBody["patient_id"] = patient_id;
            }                    
        }

     
        fetch("http://10.10.4.124:5000/api/patient/" + id, {
            method: "PATCH",
            body: JSON.stringify(jsonBody),
            headers:{
                 "Content-type": "application/json",
            },
        })
        .then((res) => res.json)
        .then((json) => console.log(json));
        console.log("Card Updated");

       
        document.getElementById("fname").value = "";
        document.getElementById("lname").value = "";
        document.getElementById("age").value = "";
        document.getElementById("patient_id").value = "";
    }
    else{
        
        console.log("Patient Added");

        
        jsonBody = {
            "fname": fname,
            "lname": lname,
            "age": age,
            "patient_id": patient_id
        };

      
        fetch("http://10.10.4.124:5000/api/patient", {
            method: "POST",
            body: JSON.stringify(jsonBody),
            headers:{
                 "Content-type": "application/json",
            },
        })
        .then((res) => res.json)
        .then((json) => console.log(json));

        
        document.getElementById("fname").value = "";
        document.getElementById("lname").value = "";
        document.getElementById("age").value = "";
        document.getElementById("patient_id").value = "";
    }
});