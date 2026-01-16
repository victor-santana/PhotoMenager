# 📸 PhotoManager - Full Stack Photo Gallery

Este projeto é uma plataforma completa de gerenciamento de álbuns de fotos, projetada para oferecer uma experiência de usuário fluida e responsiva. O foco principal é a organização de memórias de forma intuitiva, permitindo que o usuário tenha controle total sobre suas coleções de imagens.

O ecossistema da aplicação é dividido em um **Backend robusto** e um **Frontend dinâmico**, utilizando as tecnologias mais modernas do mercado.

---

## 🛠️ Tecnologias Utilizadas

### **Backend (Coração da Aplicação)**
* **Node.js & Express**: API RESTful desenvolvida com arquitetura modular para facilitar a manutenção.
* **MongoDB**: Banco de Dados NoSQL utilizado para armazenar usuários, álbuns e metadados das fotos.
* **Mongoose**: Modelagem de dados e comunicação eficiente com o banco.
* **Bcrypt**: Criptografia de ponta para garantir a segurança das senhas dos usuários.

### **Frontend (Experiência do Usuário)**
* **React + TypeScript**: Interface reativa e segura, construída com componentes reutilizáveis.
* **Vite**: Ferramenta de build de alta performance para um desenvolvimento ágil.
* **React-Bootstrap**: Design responsivo com efeitos modernos de transparência (*Glassmorphism*).

### **Serviços Cloud**
* **Cloudinary**: Gerenciamento completo de imagens na nuvem, incluindo upload direto, armazenamento seguro e redimensionamento automático.

---

## 🚀 Funcionalidades Principais

* **🔒 Autenticação de Usuário**: Cadastro e Login seguro com validação rigorosa de senhas.
* **📂 Gestão de Álbuns**: Criação e edição de álbuns com títulos e descrições. 
* **📏 Regras de Negócio**: Segurança na exclusão — um álbum só pode ser apagado se estiver vazio.
* **🖼️ Galeria Versátil**: Alternância entre visualização em **Tabela** ou **Miniaturas**.

## Imagens

Login:
<img width="1918" height="869" alt="image" src="https://github.com/user-attachments/assets/046b2cb5-dbde-4526-aa42-505bfb4cfb52" />

Cadastro:
<img width="1914" height="865" alt="image" src="https://github.com/user-attachments/assets/fbb58d5e-5296-4bca-be4c-637ffae797e8" />

Home:
<img width="1914" height="907" alt="image" src="https://github.com/user-attachments/assets/37f8d033-0d46-4ba2-b0dd-1d8193d45ec1" />

Fotos:
<img width="1915" height="912" alt="image" src="https://github.com/user-attachments/assets/b3d16c06-8ee6-4c25-a90a-114c5b24a7be" />
<img width="1919" height="907" alt="image" src="https://github.com/user-attachments/assets/3164af38-a693-4593-97d6-38eb57f14380" />

Novo Álbum
<img width="1919" height="910" alt="image" src="https://github.com/user-attachments/assets/7c946d88-239d-4012-aec5-80ce68e38ee2" />

Adicionar Fotos:
<img width="1915" height="908" alt="image" src="https://github.com/user-attachments/assets/cf7c3ce5-f735-4069-8eaa-c34aa0464493" />







* **🔢 Paginação Inteligente**: Carregamento otimizado de 8 álbuns por página e 4 fotos por álbum para maior performance.
* **📤 Upload Moderno**: Integração com o widget oficial do Cloudinary para captura via câmera ou arquivos locais.
