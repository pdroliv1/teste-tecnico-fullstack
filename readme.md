# Teste Técnico Fullstack - Integração SIGEO Niterói

Aplicação desenvolvida para consumir, processar e visualizar dados da Infraestrutura Cicloviária de Niterói, integrando a API oficial do ArcGIS.

## Sobre o Projeto

O sistema atua como um middleware que centraliza os dados públicos, oferecendo performance e resiliência:

- **Backend (Python/Flask):** Consome a API do SIGEO, realiza ETL (tratamento de dados) e salva em cache local.
- **Frontend (React/Vite):** Interface moderna e responsiva para visualização dos dados.

---

## Tecnologias & Decisões Arquiteturais

### Backend
- **Linguagem:** Python 3  
- **Framework:** Flask.  
- **Banco de Dados:** SQLite.  

**Nota sobre o Banco de Dados:**  
Embora o teste sugerisse PostgreSQL/Mongo, optei intencionalmente pelo SQLite para garantir a *Portabilidade* e *Developer Experience (DX)*. Desta forma, o avaliador consegue rodar o teste imediatamente sem necessidade de configurar containers Docker ou credenciais de banco local.

---

### Frontend
- **Framework:** React.js (Vite)  
- **Estilização:** CSS Modules (Nativo e leve).

---

## Como Rodar

### 1. Backend
```bash
cd backend
pip install -r requirements.txt
python app.py
# Servidor rodará em: http://localhost:5000

### 2. Frontend
cd frontend
npm install
npm run dev
# Interface rodará em: http://localhost:5173

## Fluxo de aplicação

1- Acesse o Frontend e clique em "Sincronizar Agora".

2- O Backend busca os dados frescos na API do SIGEO.

3 - Os dados são tratados e salvos no SQLite.

4 - A tabela é atualizada automaticamente na tela.

Desenvolvido por Pedro Rigo.
