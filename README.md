# Sistema de Agendamento para Barbearia – Barbearia Unifor

## 1. Introdução

O presente projeto tem como objetivo o desenvolvimento de um sistema web para gerenciamento de agendamentos em uma barbearia. A aplicação permite que clientes realizem marcações de serviços de forma prática, enquanto administradores possuem controle total sobre os agendamentos e serviços oferecidos.

O sistema foi desenvolvido seguindo conceitos de arquitetura moderna baseada em API REST, com separação entre frontend e backend, além de utilização de serviços em nuvem.



## 2. Objetivo

Desenvolver uma aplicação web completa que permita:

- Realizar cadastro e autenticação de usuários
- Criar e gerenciar agendamentos
- Controlar serviços disponíveis
- Permitir administração centralizada do sistema



## 3. Justificativa

A digitalização de serviços é uma necessidade crescente no mercado atual. Sistemas de agendamento automatizados reduzem erros operacionais, melhoram a experiência do cliente e aumentam a eficiência no atendimento.

Este projeto busca aplicar conhecimentos de desenvolvimento web, banco de dados e computação em nuvem para resolver um problema real de gestão de serviços.



## 4. Tecnologias Utilizadas

### Frontend
- React
- Vite
- Axios
- TailwindCSS

### Backend
- Node.js
- Express
- PostgreSQL (Supabase)
- JWT (autenticação)

### Infraestrutura
- Docker
- Render (backend)
- Vercel (frontend)

### Documentação
- Swagger / OpenAPI



## 5. Arquitetura do Sistema

O sistema segue o padrão cliente-servidor:

- O frontend (React) consome uma API REST
- O backend (Node.js) processa regras de negócio
- O banco de dados (PostgreSQL) armazena as informações



## 6. Funcionalidades

### Usuário
- Cadastro e login
- Criação de agendamentos
- Visualização dos próprios agendamentos
- Edição e exclusão de agendamentos

### Administrador
- Visualização de todos os agendamentos
- Alteração de status dos agendamentos
- Cadastro, edição e remoção de serviços



## 7. Regras de Negócio

- Não é permitido agendar horários no passado
- Os horários são disponibilizados em intervalos de 30 minutos
- Não é permitido agendamento duplicado no mesmo horário
- Usuários comuns visualizam apenas seus próprios dados
- Administradores possuem acesso total ao sistema



## 8. Estrutura do Projeto

MEU-APP/
│
├── backend/
│ ├── src/
│ │ ├── config/
│ │ ├── controllers/
│ │ ├── middlewares/
│ │ ├── routes/
│ │ ├── app.js
│ │ └── db.js
│ ├── Dockerfile
│ └── package.json
│
├── src/
├── public/
├── package.json
└── vite.config.js



## 9. Execução do Projeto

### Backend

```bash
cd backend
npm install
npm run dev

### Frontend

```bash
npm install
npm run dev

## 11. Documentação da API

A API está documentada com Swagger.

docker build -t barbearia-backend .
docker run -p 3000:3000 --env-file .env barbearia-backend

### 12. Endpoints Principais
Autenticação
POST /auth/register
POST /auth/login

Agendamentos
GET /appointments
POST /appointments
PUT /appointments/:id
DELETE /appointments/:id

Administração
GET /admin/appointments
PUT /admin/appointments/:id/status

### 13. Deploy
Backend
Hospedado no Render utilizando container Docker.

Frontend
Hospedado no Vercel.

Banco de Dados
Supabase (PostgreSQL em nuvem)

### 14. Conclusão

O sistema desenvolvido atende aos requisitos propostos, utilizando tecnologias modernas e boas práticas de desenvolvimento. A aplicação apresenta uma solução eficiente para gerenciamento de agendamentos, com arquitetura escalável e pronta para uso em ambientes reais.