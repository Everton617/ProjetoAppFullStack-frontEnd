import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { toast } from "mui-sonner";


const TitleContainer = styled.h1`
   text-align: center;
   font-size: 20px;
   color: black;
   font-family: sans-serif;
`;


const PageContainer = styled.div`
  padding-top: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  
`;


const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 32px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
`;


const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #007bff;
  }
`;


const Button = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #007bff;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Erro ao fazer login');
      }

      const data = await response.json();

      localStorage.setItem('token', data.token);
      
      toast.success("Login realizado com sucesso!");
      console.log('Token salvo:', data.token);

     
      navigate('/tasks');
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      toast.error("Erro ao fazer login");
    }
  };

  return (
    <PageContainer>
      <FormContainer onSubmit={handleSubmit}>
        <TitleContainer>Faça Seu Login</TitleContainer>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit">Entrar</Button>
        <span className='linkredirect'>
        <Link to="/signup">inda não tem conta? Criar conta.</Link>
          </span>
      </FormContainer>
    </PageContainer>
  );
};

export default Login;