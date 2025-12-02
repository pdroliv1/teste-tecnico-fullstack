import { useState, useEffect } from 'react'

function App() {
  const [ciclovias, setCiclovias] = useState([])
  const [carregando, setCarregando] = useState(false)

  const buscarCiclovias = async () => {
    try {
      const resposta = await fetch('http://localhost:5000/ciclovias')
      const dados = await resposta.json()
      setCiclovias(dados)
    } catch (erro) {
      console.error("Erro ao conectar:", erro)
    }
  }

  const sincronizarDados = async () => {
    setCarregando(true)
    try {
      await fetch('http://localhost:5000/sincronizar')
      await buscarCiclovias()
      alert("Dados atualizados!")
    } catch (erro) {
      alert("Erro ao sincronizar.")
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    buscarCiclovias()
  }, [])

  return (
    <div className="container">
      <style>{`
        body { font-family: sans-serif; margin: 0; padding: 20px; color: #333; background-color: #ffffff }
        .container { max-width: 800px; margin: 0 auto; text-align: center; }
        
        .cabecalho { border-bottom: 1px solid #ccc; padding-bottom: 20px; margin-bottom: 20px; }
        
        button { padding: 10px 20px; font-size: 16px; cursor: pointer; }
        
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
        th { background-color: #f5f5f5; font-weight: bold; }
        
        .tag { font-weight: bold; padding: 4px 8px; border-radius: 4px; font-size: 0.9em; }
        .tag-faixa { background-color: #fff3cd; color: #856404; } /* Amarelo claro */
        .tag-via { background-color: #d4edda; color: #155724; } /* Verde claro */
        
        .aviso { color: #666; margin-top: 20px; }
        .rodape { margin-top: 40px; font-size: 0.8em; color: #888; border-top: 1px solid #eee; padding-top: 10px; }
      `}</style>

      <header className="cabecalho">
        <h1>Infraestrutura Cicloviária</h1>
        <p>Dados de Niterói (Integração SIGEO)</p>
        
        <button onClick={sincronizarDados} disabled={carregando}>
          {carregando ? "Carregando" : "Atualizar Lista"}
        </button>
      </header>

      <main>
        {ciclovias.length === 0 ? (
          <p className="aviso">Nenhum dado exibido. Clique no botão para buscar.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Tipo</th>
                  <th>Extensão</th>
                  <th>Bairro/Trecho</th>
                </tr>
              </thead>
              <tbody>
                {ciclovias.map((item) => (
                  <tr key={item.id}>
                    <td>{item.nome}</td>
                    <td>
                      <span className={`tag ${item.tipo === 'Ciclofaixa' ? 'tag-faixa' : 'tag-via'}`}>
                        {item.tipo}
                      </span>
                    </td>
                    <td>{item.extensao?.toFixed(2)}m</td>
                    <td>{item.bairro}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
      
      <footer className="rodape">
        <p>Teste Técnico - Fullstack Developer</p>
      </footer>
    </div>
  )
}

export default App
