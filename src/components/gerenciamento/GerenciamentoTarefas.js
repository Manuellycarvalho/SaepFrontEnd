import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const GerenciamentoTarefas = () => {
    const navigate = useNavigate();
    const [usuarios, setUsuarios] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [statusOptions] = useState([
        { value: 'a_fazer', label: 'A Fazer' },
        { value: 'fazendo', label: 'Fazendo' },
        { value: 'pronto', label: 'Pronto' }
    ]);

    // Funções para buscar dados da API
    const fetchUsuarios = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/users/');
            setUsuarios(response.data);
        } catch (error) {
            console.error('Erro ao buscar usuários:', error);
        }
    };

    const fetchTasks = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/tasks/');
            setTasks(response.data);
        } catch (error) {
            console.error("Erro ao buscar as tarefas:", error);
        }
    };

    useEffect(() => {
        fetchUsuarios();
        fetchTasks();
    }, []);

    // Função para alterar o status da tarefa
    const handleStatusChange = async (taskId, newStatus) => {
        const taskToUpdate = tasks.find(task => task.id === taskId);

        if (!taskToUpdate) {
            console.error("Tarefa não encontrada!");
            return;
        }

        try {
            const updatedTask = { ...taskToUpdate, status: newStatus };
            await axios.put(`http://127.0.0.1:8000/api/tasks/${taskId}/`, updatedTask);

            // Atualiza localmente após sucesso no backend
            setTasks(prevTasks =>
                prevTasks.map(task => (task.id === taskId ? updatedTask : task))
            );

            alert("Status da tarefa atualizado com sucesso!");
        } catch (error) {
            console.error("Erro ao atualizar o status da tarefa:", error);
            alert("Erro ao atualizar o status. Verifique os dados e tente novamente.");
        }
    };

    // Função para excluir uma tarefa
    const handleDeleteTask = async (taskId) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/tasks/del/${taskId}/`);
            setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
            alert("Tarefa excluída com sucesso!");
        } catch (error) {
            console.error("Erro ao excluir a tarefa:", error);
            alert("Erro ao excluir a tarefa. Tente novamente.");
        }
    };

    return (
        <div style={styles.gridContainer}>
            {tasks.map((task) => (
                <div key={task.id} style={styles.taskCard}>
                    <h3>{task.descricao}</h3>
                    <p><strong>Setor:</strong> {task.setor}</p>
                    <p><strong>Prioridade:</strong> {task.prioridade}</p>
                    <p><strong>Usuário:</strong> {task.username}</p>
                    <p><strong>Data de Cadastro:</strong> {new Date(task.data_cadastro).toLocaleDateString()}</p>
                    <button
                        onClick={() => navigate(`/editar-tarefa/${task.id}`)}
                        style={styles.updateButton}>Editar
                    </button>
                    <button
                        onClick={() => handleDeleteTask(task.id)}
                        style={styles.deleteButton}>Excluir
                    </button>

                    <div style={styles.statusContainer}>
                        <label><strong>Status:</strong></label>
                        <select
                            value={task.status}
                            onChange={(e) => handleStatusChange(task.id, e.target.value)}
                            style={styles.statusDropdown}
                        >
                            {statusOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            ))}
        </div>
    );
};

const styles = {
    gridContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '20px',
        padding: '20px',
    },
    taskCard: {
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '15px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        backgroundColor: '#fff',
    },
    statusContainer: {
        display: 'flex',
        alignItems: 'center',
        marginTop: '10px',
    },
    statusDropdown: {
        marginLeft: '10px',
        marginRight: '10px',
    },
    updateButton: {
        padding: '5px 10px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        marginRight: '5px',
    },
    deleteButton: {
        padding: '5px 10px',
        backgroundColor: '#dc3545',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    }
};

export default GerenciamentoTarefas;
