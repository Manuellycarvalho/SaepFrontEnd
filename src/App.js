import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import "./styles.css"
import CadastroUsuario from './components/home/CadastroUsuario';
import CadastroTarefas from './components/cadastro/CadastroTarefas';
import GerenciamentoTarefas from './components/gerenciamento/GerenciamentoTarefas';
import TaskForm from './components/editar/task'; 

const App = () => {
    return (
        <Router>
            <div>
                <header className="header">
                    <h1>Gerenciamento de Tarefas</h1>
                    <nav className="nav">
                        <Link to="/cadastro-usuario" className="nav-link">Cadastro de Usuários</Link>
                        <Link to="/cadastro-tarefas" className="nav-link">Cadastro de Tarefas</Link>
                        <Link to="/gerenciamento-tarefas" className="nav-link">Gerenciar Tarefas</Link>
                    </nav>
                </header>
                <main>
                    <Routes>
                        <Route path="/cadastro-usuario" element={<CadastroUsuario />} />
                        <Route path="/cadastro-tarefas" element={<CadastroTarefas />} />
                        <Route path="/gerenciamento-tarefas" element={<GerenciamentoTarefas />} />
                        <Route path="/editar-tarefa/:id" element={<TaskForm />} /> {/* Nova rota para editar tarefa */}
                    </Routes>
                </main>
            </div>
        </Router>
    );
};

export default App;
