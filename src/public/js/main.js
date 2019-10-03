const fetchTasks = () => {
    axios.get('/api/tasks')
        .then(res => {
            const tasks = res.data;
            console.log(`GET list tasks`, tasks);
            // append to DOM
            appendToDOM(tasks);
        })
        .catch(error => console.error(error));
};

fetchTasks();

const appendToDOM = (tasks) => {
    resetTable()
    tasks.map(task => {
        createTable(task);
    });
}

const resetTable = () => {
    let table = document.getElementById('task-table')
    if(table.rows.length > 1){
        for(i=table.rows.length-1; i>0; i--){
            table.deleteRow(i)
        }
    }
}
const createTable = (task) => {
    
    const is_done = task.is_done;
    const id = parseInt(task.id);
    const table = document.getElementById('task-table');
    var row = table.insertRow(-1);
    var cell1 = row.insertCell(0)
    var cell2 = row.insertCell(1)
    var cell3 = row.insertCell(2)

    var  text = document.createElement('p');
    text.id = id
    text.innerHTML = is_done ? "<strike>"+`${task.title}`+"</strike>" : `${task.title}`
    cell2.appendChild(text)
    
    var checkButton = document.createElement('input');
    checkButton.type = "checkbox"
    checkButton.checked = is_done ? true : false
    cell1.appendChild(checkButton)
    checkButton.onclick = e => updateTask(cell1,is_done,id) 

    var btn = document.createElement('input');
    btn.type = "submit";
    btn.className = "btn";
    btn.value = "x"
    cell3.appendChild(btn)
    btn.onclick = e => deleteTask(cell3,id)

    return table;
}

// create a new task
const createTask = (task) => {
    console.log(task)
    axios.post('/api/tasks', task)
        .then(res => {
            const addedTask = res.data;
            console.log(`POST: task is added`, addedTask);
            // append to DOM
            // appendToDOM([addedTask]);
            fetchTasks()
        })
        .catch(error => console.error(error));
};

// event listener for form submission
const form = document.getElementById('submit-task');

const formEvent = form.addEventListener('submit', event => {
    event.preventDefault();
    
    const title = document.querySelector('#task').value;

    const row = { title };
    createTask(row);
    form.reset();
});


// delete a task
const deleteTask = (elem, id) => {
    var i = elem.parentNode.rowIndex;
    if(id){
        axios.delete(`/api/tasks/${id}`)
        .then(res => {
            console.log(`DELETE: task is removed`, id);
            // remove elem from DOM
            document.getElementById('task-table').deleteRow(i)
            fetchTasks();
        })
        .catch(error => console.error(error));
    } else {
        console.error("id not present")
    }
    
};

const updateTask = (elem, is_done, id) => {
    console.log(is_done)
    axios.put(`/api/tasks/${id}/${is_done}`)
        .then(res => {
            console.log(res.data);
            if(is_done == false){
                document.getElementById(id).style.setProperty("text-decoration", "line-through");
                fetchTasks();
            } else {
                document.getElementById(id).style.setProperty("text-decoration", "none");
                fetchTasks();
            }
        })
}