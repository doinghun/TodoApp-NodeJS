const createTable = (task) => {
    const id = parseInt(task.id)
    const table = document.getElementById('task-table');
    var row = table.insertRow(-1);
    var cell1 = row.insertCell(0)
    var cell2 = row.insertCell(1)
    var cell3 = row.insertCell(2)

    cell2.innerHTML = `${task.title}`;
    var btn = document.createElement('input');
    btn.type = "submit";
    btn.className = "btn";
    btn.value = "x"
    cell3.appendChild(btn)
    btn.onclick = e => deleteTask(cell3,id)

    return table;
}

const appendToDOM = (tasks) => {

    tasks.map(task => {
        createTable(task);
    })
}

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

// create a new task
const createTask = (task) => {
    console.log(task)
    axios.post('/api/tasks', task)
        .then(res => {
            const addedTask = res.data;
            console.log(`POST: task is added`, addedTask);
            // append to DOM
            appendToDOM([addedTask]);
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
    axios.delete(`/api/tasks/${id}`)
        .then(res => {
            console.log(`DELETE: task is removed`, id);
            // remove elem from DOM
            document.getElementById('task-table').deleteRow(i)
        })
        .catch(error => console.error(error));
};