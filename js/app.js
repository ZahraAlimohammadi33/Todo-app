const toDoTask = document.getElementById("task-input");
const toDODate =document.getElementById("date-input");
const addButton=document.getElementById("add-button");
const editButton=document.getElementById("edit-button");
const alertMassage = document.getElementById("alert");
const row= document.querySelector("tbody");
const deleteAllButton =document.getElementById("delete-button");
const filterButtons=document.querySelectorAll(".filter-button");
let todos = JSON.parse(localStorage.getItem("todos")) || [];

 
const generateId = ()=>{
   return Math.round(Math.random() * Math.random() * Math.pow(10, 15)).toString();
}

const saveTodo = ()=>{
    localStorage.setItem("todos", JSON.stringify(todos));
}

const displayTask= (data)=>{
    row.innerHTML="";
    todoList = data || todos;
    if(!todoList.length){
        row.innerHTML= "<tr><td colspan='4'>No task found!</td></tr>";
        return;
    }

    todoList.forEach((todo) => {
        row.innerHTML +=
            `<tr>
                <td>${todo.task}</td>
                <td>${todo.date|| "No Date" }</td>
                <td>${todo.completed ? "Completed" : "Pending"}</td>
                <td>
                    <button onclick="editHandler(${todo.id})">Edit</button>
                    <button onclick="toggleHandler(${todo.id.toString()})">${todo.completed ? "Undo" : "Do"}</button>
                    <button onclick="deleteHandler(${todo.id})">Delete</button>
                </td>
            </tr>
            `
        });
}
    


const showAlert = (massage, type)=>{
    alertMassage.innerHTML="";
    const alert =document.createElement("p");
    alert.innerText= massage;
    alert.classList.add("alert");
    alert.classList.add(`alert-${type}`);
    alertMassage.append(alert);
    setTimeout(()=>{
        alert.style.display= "none";
    },2000)
}

const addHandler = (e) =>{
    const task = toDoTask.value;
    const date = toDODate.value;
    const todo = {
        id : generateId(),
        task,
        date,
        completed : false
    }

    if(task){
        todos.push(todo);
        toDoTask.value = "";
        toDODate.value ="";
        displayTask();
        showAlert("Todo added successfully", "success") 
        saveTodo();
    } else {
        showAlert("Please enter a todo", "error")
    }
}

const deleteAllHandler = (e)=>{
    if(todos.length!=0){
      localStorage.clear();
      window.location.reload();
      showAlert("All todo cleared successfully", "success");
    } else {
        showAlert("No needs to clear!", "error");
    }
}

const deleteHandler= (id)=>{
    const newTodos = todos.filter((todo)=>todo.id != id);
    todos = newTodos;
    saveTodo();
    displayTask();
    showAlert("Todo deleted successfully", "success");
}

const toggleHandler=(id)=>{
    newid=id.toString()
    todos.forEach(todo =>{
        if(todo.id===newid){
            todo.completed= !todo.completed
             saveTodo();
            displayTask();
             showAlert("Todo status changed successfully", "success");
        }
    })
}

const editHandler=(id)=>{
    newid=id.toString()
    todos.forEach(todo =>{
        if(todo.id===newid){
            toDoTask.value= todo.task;
            toDODate.value=todo.date;
            addButton.style.display="none"
            editButton.style.display="block"
            editButton.dataset.id=newid;
        }})
}

const applyEditHandler=(e)=>{
    const id= e.target.dataset.id;
    todos.forEach(todo =>{
        if(todo.id===id){
            todo.task=toDoTask.value;
            todo.date=toDODate.value;
            saveTodo();
            displayTask();
            showAlert("Todo edited successfully", "success");
            toDODate.value="";
            toDoTask.value="";
            addButton.style.display="block"
            editButton.style.display="none"
        }}
    )
}

const filterHandler=(e)=>{
    filterTodos= null;
    value = e.target.dataset.filter;
    switch(value){
        case"pending":{
            filterTodos = todos.filter((todo)=>todo.completed===false)
            displayTask(filterTodos);
            break;
        }
        case"completed":{
            filterTodos = todos.filter((todo)=>todo.completed===true)
            console.log(filterTodos);
            displayTask(filterTodos);
            break;
        }

        default:{
            displayTask();
            break;
        }
    }

}

displayTask();

addButton.addEventListener("click", addHandler);
deleteAllButton.addEventListener("click", deleteAllHandler);
editButton.addEventListener("click", applyEditHandler);
filterButtons.forEach((filterButton)=>{
    filterButton.addEventListener("click", filterHandler);
})
