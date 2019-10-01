const createLi = (task) => {
    const li = document.createElement('li');
    // add user details to `li`
    li.textContent = `${task.title}`;
    const id = parseInt(task.id)
    // attach onclick event
    li.onclick = e => deleteTask(li, id); 

    return li;
};

const appendToDOM = (tasks) => {
    const ul = document.querySelector('ul');
    //iterate over all users
    tasks.map(task => {
        ul.appendChild(createLi(task));
    });
};

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
const form = document.querySelector('form');

const formEvent = form.addEventListener('submit', event => {
    event.preventDefault();

    const title = document.querySelector('#task').value;

    const row = { title };
    createTask(row);
});


// delete a task
const deleteTask = (elem, id) => {
    axios.delete(`/api/tasks/${id}`)
        .then(res => {
            console.log(`DELETE: task is removed`, id);
            // remove elem from DOM
            elem.remove();
        })
        .catch(error => console.error(error));
};