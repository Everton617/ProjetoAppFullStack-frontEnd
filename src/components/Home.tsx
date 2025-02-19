import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';


// Estilos
const WelcomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  min-width: 100vw;
  background-color: #f8f9fa;
  padding: 20px;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 3rem;
  color: #333;
  margin-bottom: 20px;
  font-family: 'Arial', sans-serif;
`;

const Description = styled.p`
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 40px;
  max-width: 600px;
  line-height: 1.6;
`;

const StartButton = styled.button`
  padding: 15px 30px;
  font-size: 1rem;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

// Componente WelcomeScreen
const Home = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    
    const token = localStorage.getItem('token');

    if (token) {
     
      navigate('/tasks');
    } else {
      
      navigate('/login');
    }
  };

  return (
    <WelcomeContainer>
      <Title>Bem-vindo à sua Lista de Tarefas</Title>
      <Description>
        Organize suas tarefas diárias de forma simples e eficiente. Comece agora e
        aumente sua produtividade!
      </Description>
      <StartButton onClick={handleStart}>Começar</StartButton>
    </WelcomeContainer>
  );
};

export default Home;