// Obtener tareas del localStorage al cargar la página
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Función para mostrar tareas en las secciones correspondientes
function displayTasks() {
    // Limpiar las secciones
    document.getElementById('urgent-tasks').innerHTML = '';
    document.getElementById('soon-tasks').innerHTML = '';
    document.getElementById('later-tasks').innerHTML = '';
    document.getElementById('today-tasks').innerHTML = '';

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const fourDaysLater = new Date(today);
    fourDaysLater.setDate(today.getDate() + 4);

    const twoWeeksLater = new Date(today);
    twoWeeksLater.setDate(today.getDate() + 14);

    tasks.forEach((task, index) => {
        const taskDate = new Date(task.date);
        const taskElement = `
            <div class="task-item" onclick="toggleDelete(${index})">
                <p><strong>${task.title}</strong></p>
                <p>${task.description}</p>
                <p>Fecha: ${task.date} - Hora: ${task.time}</p>
                <p>${task.location ? `Lugar: ${task.location}` : ''}</p>
                ${task.link ? `<p><a href="${task.link}" target="_blank">Enlace</a></p>` : ''}
                <button class="delete-btn" id="delete-btn-${index}" style="display: none;" onclick="deleteTask(event, ${index})">Borrar</button>
            </div>
        `;

        // Clasificar las tareas según la fecha
        if (taskDate.toDateString() === today.toDateString()) {
            document.getElementById('today-tasks').innerHTML += taskElement;
        } else if (taskDate.toDateString() === tomorrow.toDateString()) {
            document.getElementById('urgent-tasks').innerHTML += taskElement;
        } else if (taskDate > today && taskDate <= fourDaysLater) {
            document.getElementById('soon-tasks').innerHTML += taskElement;
        } else if (taskDate > fourDaysLater && taskDate <= twoWeeksLater) {
            document.getElementById('later-tasks').innerHTML += taskElement;
        }
    });
}

// Función para mostrar u ocultar el botón de borrar
function toggleDelete(index) {
    const deleteButton = document.getElementById(`delete-btn-${index}`);
    const isDisplayed = deleteButton.style.display === 'block';
    // Ocultar todos los botones antes de mostrar el seleccionado
    const allDeleteButtons = document.querySelectorAll('.delete-btn');
    allDeleteButtons.forEach(btn => btn.style.display = 'none');
    // Mostrar el botón si estaba oculto
    deleteButton.style.display = isDisplayed ? 'none' : 'block';
}

// Función para borrar una tarea
function deleteTask(event, index) {
    event.stopPropagation(); // Evitar que se dispare el evento de click en la tarea
    tasks.splice(index, 1); // Eliminar la tarea del array
    localStorage.setItem('tasks', JSON.stringify(tasks)); // Actualizar el almacenamiento
    displayTasks(); // Volver a mostrar las tareas
}

// Función para exportar tareas
function exportTasks() {
    const dataStr = JSON.stringify(tasks, null, 2); // Convertir tareas a formato JSON
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'tasks.json');
    a.click(); // Forzar la descarga
}

// Función para importar tareas
function importTasks(event) {
    const file = event.target.files[0]; // Obtener el archivo seleccionado
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const data = e.target.result;
        tasks = JSON.parse(data); // Parsear el JSON a un objeto
        localStorage.setItem('tasks', JSON.stringify(tasks)); // Guardar en localStorage
        displayTasks(); // Mostrar tareas actualizadas
    };
    
    reader.readAsText(file); // Leer el archivo como texto
}

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

// Mostrar las tareas al cargar la página
window.onload = function() {
    displayTasks(); // Asegúrate de que las tareas se muestren al cargar
};
