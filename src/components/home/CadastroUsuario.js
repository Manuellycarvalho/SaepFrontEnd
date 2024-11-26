import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/users/'; // URL da API
const USERS_API_URL = 'http://127.0.0.1:8000/api/users/'; // URL para buscar usuários, se necessário

const CadastroUsuario = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [mensagem, setMensagem] = useState('');
    const [loading, setLoading] = useState(false); // Para controlar o estado de carregamento
    const [usuarios, setUsuarios] = useState([]);
    const [erroUsuarios, setErroUsuarios] = useState('');

    // Carregar usuários ao montar o componente (se necessário)
    useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                const response = await axios.get(USERS_API_URL);
                setUsuarios(response.data);
            } catch (error) {
                console.error('Erro ao buscar usuários:', error);
                setErroUsuarios('Erro ao carregar usuários. Tente novamente.');
            }
        };
        fetchUsuarios();
    }, []); // O array vazio garante que o código será executado apenas uma vez, ao montar o componente.

    // Função para enviar os dados do formulário
    const handleSubmit = async (event) => {
        event.preventDefault();
        setMensagem(''); // Limpar mensagens anteriores
        setLoading(true); // Iniciar carregamento

        // Validação do e-mail
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setMensagem('Email inválido.');
            setLoading(false); // Finaliza carregamento
            return;
        }

        // Monta o objeto de novo usuário com as chaves corretas
        const novoUsuario = { username, email };

        try {
            // Envia a requisição POST para a API
            const response = await axios.post(API_URL, novoUsuario);
            setMensagem('Cadastro concluído com sucesso.');
            console.log('Usuário cadastrado:', response.data);

            // Limpar campos após o cadastro
            setUsername('');
            setEmail('');
        } catch (error) {
            // Verifica se o erro tem resposta e exibe a mensagem correspondente
            if (error.response) {
                // Log do erro para inspecionar a resposta completa
                console.error('Erro detalhado:', error.response); // Exibe toda a resposta do erro
                const errorMessage = error.response.data.detail || error.response.data.message || 'Erro desconhecido.';
                setMensagem(`Erro ao cadastrar usuário: ${errorMessage}`);
            } else if (error.request) {
                // Caso não tenha resposta do servidor
                setMensagem('Erro ao se conectar com o servidor. Tente novamente.');
            } else {
                // Erro desconhecido
                setMensagem('Erro desconhecido. Tente novamente.');
            }
        } finally {
            setLoading(false); // Finaliza carregamento
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px', textAlign: 'center' }}>
            <h2>Cadastro de Usuários</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
                <label htmlFor="username">Username:</label>
                <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    style={{ marginBottom: '10px', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                />

                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{ marginBottom: '20px', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                />

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        padding: '10px',
                        backgroundColor: '#007BFF',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                >
                    {loading ? 'Cadastrando...' : 'Cadastrar'}
                </button>
            </form>

            {mensagem && (
                <p style={{
                    marginTop: '20px',
                    color: mensagem.startsWith('Erro') ? 'red' : 'green',
                    fontWeight: 'bold'
                }}>
                    {mensagem}
                </p>
            )}
        </div>
    );
};

export default CadastroUsuario;