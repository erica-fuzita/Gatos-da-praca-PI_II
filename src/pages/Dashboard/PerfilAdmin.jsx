import { useState, useRef, useEffect } from "react";
import "./PerfilAdmin.css";

// Firebase Auth
import {
  getAuth,
  updateEmail,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";

// Auth Context
import { useAuth } from "../../context/AuthContext";

export default function PerfilAdmin() {
  const { usuario } = useAuth();
  const auth = getAuth();

  const [nome, setNome] = useState(localStorage.getItem("adminName") || "Administrador");
  const [email, setEmail] = useState(localStorage.getItem("adminEmail") || usuario?.email || "");

  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarEmail, setMostrarEmail] = useState(false);

  const [novoEmail, setNovoEmail] = useState("");
  const [confirmarNovoEmail, setConfirmarNovoEmail] = useState("");
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarNovaSenha, setConfirmarNovaSenha] = useState("");

  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState("");

  // refs para detectar clique fora
  const areaEmailRef = useRef(null);
  const areaSenhaRef = useRef(null);

  function limparMensagem() {
    setMensagem("");
    setTipoMensagem("");
  }

  // Fechar áreas ao clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (mostrarEmail && areaEmailRef.current && !areaEmailRef.current.contains(event.target)) {
        setMostrarEmail(false);
      }

      if (mostrarSenha && areaSenhaRef.current && !areaSenhaRef.current.contains(event.target)) {
        setMostrarSenha(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mostrarEmail, mostrarSenha]);

  async function reautenticar() {
    if (!usuario?.email) return null;

    const cred = EmailAuthProvider.credential(usuario.email, senhaAtual);
    return reauthenticateWithCredential(usuario, cred);
  }

  async function handleAtualizarEmail() {
    limparMensagem();

    if (!novoEmail || !confirmarNovoEmail) {
      setTipoMensagem("error");
      setMensagem("Preencha todos os campos de e-mail.");
      return;
    }

    if (novoEmail !== confirmarNovoEmail) {
      setTipoMensagem("error");
      setMensagem("Os e-mails digitados não são iguais.");
      return;
    }

    try {
      await reautenticar();
      await updateEmail(usuario, novoEmail);

      setEmail(novoEmail);
      localStorage.setItem("adminEmail", novoEmail);

      setNovoEmail("");
      setConfirmarNovoEmail("");
      setSenhaAtual("");

      setTipoMensagem("success");
      setMensagem("E-mail atualizado com sucesso!");
      setMostrarEmail(false);
    } catch (err) {
      console.log("Erro Firebase:", err);

      const erros = {
        "auth/wrong-password": "Senha atual incorreta.",
        "auth/invalid-email": "E-mail inválido.",
        "auth/email-already-in-use": "Este e-mail já está em uso.",
        "auth/requires-recent-login": "Faça login novamente para concluir esta ação.",
      };

      setTipoMensagem("error");
      setMensagem(erros[err.code] || "Erro ao atualizar e-mail.");
    }
  }

  async function handleAtualizarSenha() {
    limparMensagem();

    if (!senhaAtual || !novaSenha || !confirmarNovaSenha) {
      setTipoMensagem("error");
      setMensagem("Preencha todos os campos de senha.");
      return;
    }

    if (novaSenha.length < 6) {
      setTipoMensagem("error");
      setMensagem("A nova senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (novaSenha !== confirmarNovaSenha) {
      setTipoMensagem("error");
      setMensagem("A confirmação da nova senha não confere.");
      return;
    }

    try {
      await reautenticar();
      await updatePassword(usuario, novaSenha);

      setSenhaAtual("");
      setNovaSenha("");
      setConfirmarNovaSenha("");

      setTipoMensagem("success");
      setMensagem("Senha atualizada com sucesso!");
      setMostrarSenha(false);
    } catch (err) {
      console.log("Erro Firebase:", err);

      const erros = {
        "auth/wrong-password": "Senha atual incorreta.",
        "auth/weak-password": "A nova senha é muito fraca.",
        "auth/requires-recent-login": "Faça login novamente.",
      };

      setTipoMensagem("error");
      setMensagem(erros[err.code] || "Erro ao atualizar senha.");
    }
  }

  function handleSalvarPerfil() {
    localStorage.setItem("adminName", nome);
    localStorage.setItem("adminEmail", email);

    setTipoMensagem("success");
    setMensagem("Perfil atualizado com sucesso!");
  }

  return (
    <div className="perfil-admin-page">
      <h1>Meu Perfil</h1>

      <div className="perfil-card">
        <div className="perfil-foto-area">
          <img
            src="https://i.imgur.com/POAxAIw.jpeg"
            alt="Foto do administrador"
            className="perfil-foto"
          />
          <span className="perfil-foto-legenda">Administração Gatos da Praça</span>
        </div>

        <div className="perfil-info">
          <div className="perfil-info-bloco">
            <div className="campo">
              <label>Nome</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => {
                  limparMensagem();
                  setNome(e.target.value);
                }}
              />
            </div>

            <div className="campo">
              <label>E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  limparMensagem();
                  setEmail(e.target.value);
                }}
              />
            </div>
          </div>

          <div className="senha-links">
            <button
              className="link-acao"
              onClick={() => {
                setMostrarEmail(!mostrarEmail);
                setMostrarSenha(false);
                limparMensagem();
              }}
            >
              {mostrarEmail ? "Fechar alteração de e-mail" : "Alterar e-mail"}
            </button>

            <button
              className="link-acao"
              onClick={() => {
                setMostrarSenha(!mostrarSenha);
                setMostrarEmail(false);
                limparMensagem();
              }}
            >
              {mostrarSenha ? "Fechar alteração de senha" : "Alterar senha"}
            </button>
          </div>

          {mostrarEmail && (
            <div className="alterar-email-area" ref={areaEmailRef}>
              <h2>Alterar e-mail</h2>

              <div className="campo">
                <label>Senha atual</label>
                <input
                  type="password"
                  value={senhaAtual}
                  onChange={(e) => setSenhaAtual(e.target.value)}
                />
              </div>

              <div className="campo">
                <label>Novo e-mail</label>
                <input
                  type="email"
                  value={novoEmail}
                  onChange={(e) => setNovoEmail(e.target.value)}
                  placeholder="Digite o novo e-mail"
                />
              </div>

              <div className="campo">
                <label>Confirmar novo e-mail</label>
                <input
                  type="email"
                  value={confirmarNovoEmail}
                  onChange={(e) => setConfirmarNovoEmail(e.target.value)}
                  placeholder="Repita o novo e-mail"
                />
              </div>

              <button className="btn-secundario" onClick={handleAtualizarEmail}>
                Atualizar e-mail
              </button>
            </div>
          )}

          {mostrarSenha && (
            <div className="alterar-senha-area" ref={areaSenhaRef}>
              <h2>Alterar senha</h2>

              <div className="campo">
                <label>Senha atual</label>
                <input
                  type="password"
                  value={senhaAtual}
                  onChange={(e) => setSenhaAtual(e.target.value)}
                />
              </div>

              <div className="campo">
                <label>Nova senha</label>
                <input
                  type="password"
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                />
              </div>

              <div className="campo">
                <label>Confirmar nova senha</label>
                <input
                  type="password"
                  value={confirmarNovaSenha}
                  onChange={(e) => setConfirmarNovaSenha(e.target.value)}
                />
              </div>

              <button className="btn-secundario" onClick={handleAtualizarSenha}>
                Atualizar senha
              </button>
            </div>
          )}

          {mensagem && (
            <div className={`feedback-message ${tipoMensagem}`}>
              {mensagem}
            </div>
          )}

          <button className="btn-salvar" onClick={handleSalvarPerfil}>
            Salvar alterações do perfil
          </button>
        </div>
      </div>
    </div>
  );
}
