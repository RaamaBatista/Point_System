import React, { useState, useEffect } from "react";
import { useUser } from "../../UseContext";
import './principal.css';

function Principal() {
  const { user } = useUser();
  const [entryTime, setEntryTime] = useState(localStorage.getItem("entryTime") || null);
  const [exitTime, setExitTime] = useState(null);
  const [timer, setTimer] = useState(null);
  const [registers, setRegisters] = useState([]);

  useEffect(() => {
    if (entryTime && exitTime) {
      const entry = new Date(entryTime).toISOString();
      const exit = new Date(exitTime).toISOString();
      const diferenca = new Date(exit).getTime() - new Date(entry).getTime();
      setTimer(formatodiferente(diferenca));
    }
  }, [entryTime, exitTime]);

  useEffect(() => {
    fetch(`http://localhost:3333/users/${user.id}/registers`)
      .then(response => response.json())
      .then(data => {
        if (data.registers) {
          setRegisters(data.registers);
        }
      })
      .catch(error => {
        console.error("Erro na requisição:", error);
      });
  }, [user.id]);
  {/*funcao que ajusta as horas */ }
  const formatodiferente = (milliseconds) => {
    const seconds = Math.floor(milliseconds / 1000) % 60;
    const minutes = Math.floor(milliseconds / 1000 / 60) % 60;
    const hours = Math.floor(milliseconds / 1000 / 60 / 60);
    return `${hours}h ${minutes}m ${seconds}s`;
  }

  const handleLogin = () => {
    const entry = new Date().toISOString();
    setEntryTime(entry);
    setExitTime(null);
    localStorage.setItem("entryTime", entry);

    fetch(`http://localhost:3333/users/${user.id}/registers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        register: {
          entry: entry,
          departure: null
        }
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 1) {
          console.log("Registro de entrada criado com sucesso!");
          setRegisters([...registers, data.register]);
        } else {
          console.error("Falha ao criar registro de entrada");
        }
      })
      .catch((error) => {
        console.error("Erro na requisição:", error);
      });
  };

  const handleLogout = () => {
    const exit = new Date().toISOString();
    setExitTime(exit);
    localStorage.removeItem("entryTime");

    fetch(`http://localhost:3333/users/${user.id}/registers/${user.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        register: {
          entry: entryTime,
          departure: exit
        }
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 1) {
          console.log("Registro de saída atualizado com sucesso!");
          setRegisters(prevRegisters => {
            const updatedRegisters = [...prevRegisters];
            if (updatedRegisters.length > 0) {
              updatedRegisters[updatedRegisters.length - 1].departure_date = exit;
            }

            return updatedRegisters;
          });
          const diferenca = new Date(exit).getTime() - new Date(entryTime).getTime();
          setTimer(formatodiferente(diferenca));

        } else {
          console.error("Falha ao atualizar registro de saída");
        }
      })
      .catch((error) => {
        console.error("Erro na requisição:", error);
      });
  };

  return (
    <div className="pp">
      <h1>Página Principal</h1>
      <div>
        <h2>Bem-vindo, {user.name}!</h2>
        <p>Email: {user.email}</p>
        <h3>Registros de Entrada e Saída:</h3>
        <p>
          Horário de Entrada: {entryTime ? new Date(entryTime).toLocaleString() : "Não registrado"}
          <br />   <br />
          Horário de Saída: {exitTime ? new Date(exitTime).toLocaleString() : "Não registrado"}
          <br />   <br />
          Tempo: {timer || 'Aguardando saída'}
          {entryTime && !exitTime && (
            <div>

              <br />   <br />
              <button onClick={handleLogout}>Registrar Saída</button>
            </div>
          )}
          {!entryTime && (
            <button onClick={handleLogin}>Registrar Entrada</button>
          )}        </p>
      </div>
      <div>
        <h3>Registros:</h3>
        <ul>
          {registers.map((register, index) => (
            <li key={index}>
              Entrada: {new Date(entryTime).toLocaleString()} <br />
              Saída: {register.departure ? new Date(register.departure).toLocaleString() : "Não registrado"}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Principal;
