-- Importe em um banco vazio selecionado no phpMyAdmin.
-- Estrutura apenas: não cria usuários nem importa registros.
-- Não é uma migração para alterar tabelas existentes.

CREATE TABLE IF NOT EXISTS users (
  id INT NOT NULL AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL,
  password VARCHAR(50) NOT NULL,
  nome VARCHAR(50) NOT NULL,
  email VARCHAR(150) NULL,
  role VARCHAR(50) NULL DEFAULT 'recepcao',
  created_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_username (username),
  UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS receptions (
  id VARCHAR(100) NOT NULL,
  dia VARCHAR(20) NOT NULL,
  nome VARCHAR(150) NOT NULL,
  cpf VARCHAR(20) NULL,
  motivo TEXT NOT NULL,
  setor VARCHAR(100) NOT NULL,
  entrada VARCHAR(10) NULL,
  saida VARCHAR(10) NULL,
  avaliacao INT NULL DEFAULT NULL,
  telefone VARCHAR(30) NULL,
  empresa VARCHAR(150) NULL,
  responsavel VARCHAR(150) NULL,
  observacoes TEXT NULL,
  documento VARCHAR(255) NULL,
  status VARCHAR(50) NULL DEFAULT 'Concluído',
  created_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  KEY idx_receptions_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
