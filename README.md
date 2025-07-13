# Fitplanner (Frontend)

A **Fitplanner** é uma aplicação para gerenciamento e planejamento de treinos de academia.  
Ela permite criar treinos, iniciar sessões ativas e visualizar um histórico de sessões concluídas.

> Repositório do backend: [Fitplanner Backend](https://github.com/Arthu085/fitplanner-api)  
> Acesse o sistema: [Fitplanner (Deploy)](https://fitplanner-xm8c.onrender.com)

---

## 🚀 Tecnologias Utilizadas

- **React.js**
- **Axios**
- **Vite**

---

## ⚙️ Como rodar o projeto

O sistema está hospedado no Render, mas você também pode executá-lo localmente:

### 1️⃣ Clonar o Repositório

```bash
git clone https://github.com/Arthu085/fitplanner
cd fitplanner
```

### 2️⃣ Instalar dependências

```bash
npm install
```

### 3️⃣ Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com a seguinte variável:

```bash
VITE_API_URL=http://localhost:3000/api
```

### 4️⃣ Iniciar o projeto

```bash
npm run dev
```

A aplicação estará disponível em:

- 🌐 **HTTP:** http://localhost:5173/

---

## 📌 Telas do Sistema

### 🔓 Telas Públicas (sem autenticação)

- **Registro** – Tela para cadastro de novos usuários.  
- **Login** – Tela para autenticação dos usuários.

---

### 🔒 Telas Protegidas (com autenticação)

- **Dashboard** – Visualização, finalização e exclusão do histórico de sessões.  
- **Treinos** – Visualização, criação, edição e exclusão de treinos.  
- **Sessões de Treino** – Início e visualização das sessões de treino.  
- **Sessão Ativa** – Finalização da sessão ativa, com ajustes em séries, repetições, pesos e anotações.  
- **Exercícios** – Visualização, criação, edição e exclusão de exercícios (somente os criados pelo usuário).
