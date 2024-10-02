// Obtener tareas del localStorage al cargar la página
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Función para agregar una nueva tarea
function addTask() {
    const title = document.getElementById('task-title').value;
    const description = document.getElementById('task-description').value;
    const link = document.getElementById('task-link').value;
    const date = document.getElementById('task-date').value;
    const time = document.getElementById('task-time').value;
    const location = document.getElementById('task-location').value;

    if (title && date && time) {
        const task = {
            title,
            description,
            link,
            date,
            time,
            location
        };

        // Obtener tareas existentes y añadir la nueva
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));

        // Limpiar el formulario
        document.getElementById('task-title').value = '';
        document.getElementById('task-description').value = '';
        document.getElementById('task-link').value = '';
        document.getElementById('task-date').value = '';
        document.getElementById('task-time').value = '';
        document.getElementById('task-location').value = '';

        alert("Tarea añadida con éxito!");
        return false; // Evitar el envío del formulario
    }
}
