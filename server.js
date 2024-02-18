const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para habilitar o CORS com opções específicas
app.use(cors({
    origin: '', // Permite apenas solicitações deste domínio
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Cabeçalhos permitidos
}));

// Middleware para análise de corpos de solicitação em formato JSON
app.use(express.json());

// Definindo a pasta de arquivos estáticos para o front-end
app.use(express.static(path.join(__dirname, 'public')));

// Rota para a página inicial (front-end)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota para o arquivo style.css
app.get('/style.css', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'style.css'));
});

// Dados de exemplo (simulando um banco de dados)
let tasks = [
  { id: 1, description: 'Fazer compras', completed: false },
  { id: 2, description: 'Estudar Node.js', completed: true },
  { id: 3, description: 'Limpar a casa', completed: false }
];

// Rota para obter todas as tarefas
app.get('/api/tasks', (req, res) => {
  res.json(tasks);
});

// Rota para obter uma tarefa pelo ID
app.get('/api/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const task = tasks.find(task => task.id === id);
  if (!task) {
    return res.status(404).json({ error: 'Tarefa não encontrada' });
  }
  res.json(task);
});

// Rota para adicionar uma nova tarefa
app.post('/api/tasks', (req, res) => {
  const { description } = req.body;
  if (!description) {
    return res.status(400).json({ error: 'O campo "description" é obrigatório' });
  }
  const id = tasks.length + 1;
  const newTask = { id, description, completed: false };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// Rota para atualizar uma tarefa existente
app.put('/api/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const task = tasks.find(task => task.id === id);
  if (!task) {
    return res.status(404).json({ error: 'Tarefa não encontrada' });
  }
  const { description, completed } = req.body;
  if (description !== undefined) {
    task.description = description;
  }
  if (completed !== undefined) {
    task.completed = completed;
  }
  res.json(task);
});

// Rota para excluir uma tarefa
app.delete('/api/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = tasks.findIndex(task => task.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Tarefa não encontrada' });
  }
  tasks.splice(index, 1);
  res.sendStatus(204);
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
