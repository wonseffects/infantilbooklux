# 📚 InfantilBooksLux - Ebooks de Histórias Infantis Premium

Bem-vindo ao **InfantilBooksLux**, uma plataforma exclusiva e sofisticada dedicada à venda e leitura de livros digitais infantis. Oferecemos uma experiência de leitura imersiva, com design premium e fluxo simplificado para pais e crianças.

---

## 🚀 Funcionalidades Principais

### 🎨 Design & Interface Premium
- **Paleta de Cores:** Foco em **Azul Marinho** e **Roxo Escuro** (Tons Noturnos/Premium).
- **Temas:** Suporte completo para **Modo Escuro** (Padrão) e **Modo Claro** (Branco, Roxo e Azul Marinho).
- **Experiência Responsiva:** Otimizado para tablets, smartphones e desktops.

### 🏠 Landing Page (Home)
- **A Vitrine:** Exibição de 10 ebooks selecionados.
- **Slider Automático:** Carrossel de capas que passam automaticamente, criando uma vitrine dinâmica.
- **Preview de Conteúdo:** Botão para visualizar as primeiras 3 páginas de cada livro. Blocos posteriores são trancados com cadeado ("Conteúdo Bloqueado - Faça Assinatura").
- **Call to Action (CTA):** Botão irresistível para compra do **Pack de 10 Livros** ou compra individual.

### 💳 Fluxo de Aquisição & Pagamento
- **Cadastro Prévio:** O usuário é redirecionado para criar uma conta antes da finalização da compra.
- **Preços:**
    - Ebook Individual: **R$ 6,99**
    - Pack de 10 Ebooks: **R$ 59,90**
- **Gateway de Pagamento:** Integração com **Pagar.me** para transações seguras e rápidas.

### 📂 Dashboard do Usuário
- **Sidebar Lateral:** Navegação rápida entre os 10 ebooks com título e miniatura da capa.
- **Top Bar:** Nome do usuário e configurações de perfil/tema.
- **Leitor Imersivo:** Efeitos de transição de página (Page Flip) para simular a leitura de um livro físico.

---

## 🛠️ Stack Tecnológica (Sugestão)

- **Frontend:** [React](https://reactjs.org/) / [Next.js](https://nextjs.org/) (recomendado para SEO e performance).
- **Hosting:** [Vercel](https://vercel.com/).
- **Banco de Dados:** [Supabase](https://supabase.com/) (Autenticação, Armazenamento de Ebooks e Metadados).
- **Pagamentos:** [Pagar.me API](https://pagarme.medium.com/).
- **Estilização:** Vanilla CSS ou CSS Modules para controle total do design premium.

---

## 🎨 Guia de Cores (Tokens)

| Tema | Principal | Secundária | Fundo / Texto |
| :--- | :--- | :--- | :--- |
| **Dark** | Azul Marinho Deep | Roxo Escuro | Preto Elegante / Branco Gelo |
| **Light** | Roxo Vibrante | Azul Marinho | Branco / Azul Marinho |

---

## 🔧 Configuração Inicial (Desenvolvimento)

1. **Clone o repositório:**
   ```bash
   git clone <url-do-repositorio>
   ```
2. **Instale as dependências:**
   ```bash
   npm install
   ```
3. **Configure as variáveis de ambiente (.env):**
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `PAGARME_API_KEY`
4. **Execute o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

---

## 💡 Ideias Complementares para o App

1. **Audiobook:** Adicionar uma opção de narração para crianças que ainda não sabem ler.
2. **Modo Noturno (Temporizador):** Redução automática de luz azul no dashboard após as 20h para ajudar no sono da criança.
3. **Progress Tracking:** Mostrar aos pais quais livros a criança já terminou de ler.
4. **Certificados de Leitura:** Gerar um PDF de "Pequeno Leitor" após completar os 10 livros do pack.

---

*Desenvolvido com foco na excelência e na imaginação infantil.* ✨
