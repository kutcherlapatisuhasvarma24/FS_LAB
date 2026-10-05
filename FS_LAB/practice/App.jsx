import Student from "./Student";


function App() {
  function showMessage() {
        alert("Welcoome to Student Management System");
    }
    const imageUrl = "https://anits.org/static/images/campus.jpg";


    

  
    return (
      
        <div>
            <h1>Student Management System</h1>
            <img src={imageUrl} alt="Student" />
            
        <button onClick={showMessage}>
            Click Here  
        </button>


            <Student
                name="SUHAS"
                age="19"
                branch="CSM"
                
            />
            <Student
                name="SIVA GANESH"
                age="19"
                branch="CSM"
            />
            <Student
                name="TARUN"
                age="21"
                branch="CSM"
            />
            
            



            
        </div>
    );
}


export default App;
