// Inicialização do SQL.js e do banco de dados
let db;
initSqlJs().then((SQL) => {
    db = new SQL.Database();
    initializeDatabase();
    renderTasks();
});

function initializeDatabase() {
    db.run(`CREATE TABLE IF NOT EXISTS tarefas (
        id INTEGER PRIMARY KEY,
        descricao TEXT,
        status BOOLEAN,
        data_criacao TEXT
    );`);
}

// Função para adicionar uma nova tarefa
function addTask(description) {
    db.run(`INSERT INTO tarefas (descricao, status, data_criacao) VALUES (?, 0, datetime('now'));`, [description]);
    renderTasks();
}

// Função para obter todas as tarefas e renderizar na tela
function renderTasks() {
    const result = db.exec("SELECT * FROM tarefas;");
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = "";

    if (result.length > 0) {
        const rows = result[0].values;
        rows.forEach(row => {
            const [id, descricao, status, data_criacao] = row;
            const li = document.createElement("li");
            li.textContent = `${descricao} - ${status ? "Concluída" : "Pendente"} (Criada em: ${data_criacao})`;
            taskList.appendChild(li);

            // Botão para marcar como concluída
            const completeButton = document.createElement("button");
            completeButton.textContent = "Completar";
            completeButton.onclick = () => completeTask(id);
            li.appendChild(completeButton);

            // Botão para deletar
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Deletar";
            deleteButton.onclick = () => deleteTask(id);
            li.appendChild(deleteButton);
        });
    }
}

// Função para marcar uma tarefa como concluída
function completeTask(id) {
    db.run("UPDATE tarefas SET status = 1 WHERE id = ?;", [id]);
    renderTasks();
}

// Função para deletar uma tarefa
function deleteTask(id) {
    db.run("DELETE FROM tarefas WHERE id = ?;", [id]);
    renderTasks();
}

// Captura do evento de submissão do formulário
document.getElementById("taskForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const description = document.getElementById("taskDescription").value;
    addTask(description);
    document.getElementById("taskDescription").value = "";
});
