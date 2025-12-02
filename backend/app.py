import sqlite3
import requests
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

URL_SIGEO ="https://sig.niteroi.rj.gov.br/server/rest/services/Hosted/NGP_SMU_COORD_NITEROIDEBICICLETA_L_INFRACICLO_PUBLICO/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json"

def iniciar_banco():
    conexao = sqlite3.connect('dados_sigeo.db')
    cursor = conexao.cursor()

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS ciclovias (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT,
            tipo TEXT,
            extensao REAL,
            bairro TEXT
            )
    ''')
    conexao.commit()
    conexao.close()

def salvar_dados(dados_api):
    conexao = sqlite3.connect('dados_sigeo.db')
    cursor = conexao.cursor()

    cursor.execute("DELETE FROM ciclovias")

    for item in dados_api['features']:
        atributos = item['attributes']

        nome = atributos.get('tx_nome', 'Sem nome')
        tipo = atributos.get('tx_tipo', 'Não informado')
        extensao = atributos.get('d_extensao', 0)
        bairro = atributos.get('tx_trecho', '-')

        cursor.execute('''
            INSERT INTO ciclovias (nome, tipo, extensao, bairro)
            VALUES (?, ?, ?, ?)
        ''', (nome, tipo, extensao, bairro))

    conexao.commit()
    conexao.close()
    print(f"Concluído. {len(dados_api['features'])} Salvos com sucesso")

@app.route('/sincronizar', methods=['GET'])
#o botao do front vai chamar ela, ela vai até o sigeo, baixa os dados e vai atualizar o sqlite
def buscar_dados_externos():
    try:
        print("conectando no sigeo")
        resposta = requests.get(URL_SIGEO)
        dados = resposta.json()

        if 'features' in dados:
            salvar_dados(dados)
            return jsonify({
                "mensagem": "dados atualizados com sucesso",
                "total": len(dados['features'])
            }), 200
        else:
            return jsonify({"erro": "erro na resposta da API."}), 500

    except Exception as erro:
        return jsonify({"erro": str(erro)}), 500


@app.route('/ciclovias', methods=['GET'])
def listar_ciclovias():
    conexao = sqlite3.connect('dados_sigeo.db')
    conexao.row_factory = sqlite3.Row
    cursor = conexao.cursor()

    cursor.execute("SELECT * FROM ciclovias")
    linhas = cursor.fetchall()

    lista_ciclovias = []
    for linha in linhas:
        lista_ciclovias.append({
            "id": linha['id'],
            "nome": linha['nome'],
            "tipo": linha['tipo'],
            "extensao": linha['extensao'],
            "bairro": linha['bairro']
        })

    conexao.close()
    return jsonify(lista_ciclovias)

if __name__ == '__main__':
    iniciar_banco()
    app.run(debug=True, port=5000)
