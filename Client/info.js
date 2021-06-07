/// Get id from session and clear the session
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
        // If any of the fields are left blank then make PATCH request
        console.log("Make PATCH Request");

        // Construct the JSON body to be sent in the PATCH request
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

        // Send the PATCH request
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

        // Clear the boxes so the user knows his request has gone through
        document.getElementById("fname").value = "";
        document.getElementById("lname").value = "";
        document.getElementById("age").value = "";
        document.getElementById("patient_id").value = "";
    }
    else{
        // If all fields are full, then make POST request
        console.log("Patient Added");

        // Construct the JSON body to be sent in the POST request
        jsonBody = {
            "fname": fname,
            "lname": lname,
            "age": age,
            "patient_id": patient_id
        };

        // Send the POST request 
        fetch("http://10.10.4.124:5000/api/patient", {
            method: "POST",
            body: JSON.stringify(jsonBody),
            headers:{
                 "Content-type": "application/json",
            },
        })
        .then((res) => res.json)
        .then((json) => console.log(json));

        // Clear the boxes so the user knows his request has gone through
        document.getElementById("fname").value = "";
        document.getElementById("lname").value = "";
        document.getElementById("age").value = "";
        document.getElementById("patient_id").value = "";
    }
});