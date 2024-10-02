const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const TASKS_FILE = './tasks.json';

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // Sirve archivos estáticos desde la carpeta public

// Leer tareas desde el archivo JSON
app.get('/tasks', (req, res) => {
    fs.readFile(TASKS_FILE, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading tasks file');
        }
        res.send(JSON.parse(data || '[]'));
    });
});

// Guardar tareas en el archivo JSON
app.post('/tasks', (req, res) => {
    const newTask = req.body;

    fs.readFile(TASKS_FILE, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading tasks file');
        }

        const tasks = JSON.parse(data || '[]');
        tasks.push(newTask);

        fs.writeFile(TASKS_FILE, JSON.stringify(tasks, null, 2), (err) => {
            if (err) {
                return res.status(500).send('Error writing tasks file');
            }
            res.status(201).send(newTask);
        });
    });
});

// Actualizar tareas en el archivo JSON
app.put('/tasks', (req, res) => {
    const updatedTasks = req.body;

    fs.writeFile(TASKS_FILE, JSON.stringify(updatedTasks, null, 2), (err) => {
        if (err) {
            return res.status(500).send('Error writing tasks file');
        }
        res.status(204).send(); // No content
    });
});

// Eliminar una tarea
app.delete('/tasks/:index', (req, res) => {
    const index = parseInt(req.params.index, 10);

    fs.readFile(TASKS_FILE, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading tasks file');
        }

        let tasks = JSON.parse(data || '[]');
        if (index < 0 || index >= tasks.length) {
            return res.status(404).send('Task not found');
        }

        // Eliminar la tarea
        tasks.splice(index, 1);

        fs.writeFile(TASKS_FILE, JSON.stringify(tasks, null, 2), (err) => {
            if (err) {
                return res.status(500).send('Error writing tasks file');
            }
            res.status(204).send(); // No content
        });
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
