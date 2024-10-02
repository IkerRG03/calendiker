// Función para mostrar tareas en las secciones correspondientes
async function displayTasks() {
    // Limpiar las secciones
    document.getElementById('urgent-tasks').innerHTML = '';
    document.getElementById('soon-tasks').innerHTML = '';
    document.getElementById('later-tasks').innerHTML = '';
    document.getElementById('today-tasks').innerHTML = '';

    try {
        const response = await fetch('tasks.json'); // Obtener tareas del archivo JSON
        if (!response.ok) {
            throw new Error('Error al cargar las tareas: ' + response.statusText);
        }

        const tasks = await response.json(); // Convertir la respuesta en JSON

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
                document.getElementById('today-tasks').innerHTML += taskElement; // Mostrar tareas de hoy
            } else if (taskDate.toDateString() === tomorrow.toDateString()) {
                document.getElementById('urgent-tasks').innerHTML += taskElement;
            } else if (taskDate > today && taskDate <= fourDaysLater) {
                document.getElementById('soon-tasks').innerHTML += taskElement;
            } else if (taskDate > fourDaysLater && taskDate <= twoWeeksLater) {
                document.getElementById('later-tasks').innerHTML += taskElement;
            }
        });
    } catch (error) {
        console.error('Error al mostrar las tareas:', error);
    }
}

// Función para agregar una nueva tarea
async function addTask() {
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

        try {
            // Enviar tarea al backend
            const response = await fetch('/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(task)
            });

            if (!response.ok) {
                throw new Error('Error al agregar la tarea: ' + response.statusText);
            }

            // Limpiar el formulario
            document.getElementById('task-title').value = '';
            document.getElementById('task-description').value = '';
            document.getElementById('task-link').value = '';
            document.getElementById('task-date').value = '';
            document.getElementById('task-time').value = '';
            document.getElementById('task-location').value = '';

            alert("Tarea añadida con éxito!");
            displayTasks(); // Mostrar tareas actualizadas
        } catch (error) {
            console.error('Error al agregar la tarea:', error);
        }
    } else {
        alert("Por favor, completa todos los campos obligatorios.");
    }
}

// Mostrar las tareas al cargar la página
window.onload = function() {
    displayTasks(); // Asegúrate de que las tareas se muestren al cargar
};
