import os
import sys
import random
from datetime import date, timedelta
import duckdb

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.dirname(BASE_DIR)
DATA_DIR = os.path.join(ROOT_DIR, "data")
DB_PATH = os.path.join(DATA_DIR, "sales.duckdb")

os.makedirs(DATA_DIR, exist_ok=True)

def generate_database():
    print("Iniciando pipeline de dados... Banco alvo: " + DB_PATH)
    if os.path.exists(DB_PATH):
        try:
            os.remove(DB_PATH)
        except Exception:
            pass

    con = duckdb.connect(DB_PATH)

    ddl_path = os.path.join(BASE_DIR, "star_schema_ddl.sql")
    if os.path.exists(ddl_path):
        with open(ddl_path, "r", encoding="utf-8") as f:
            ddl_sql = f.read()
            con.execute(ddl_sql)
            print("DDL do Star Schema executado com sucesso.")

    print("Populando d_calendario...")
    start_date = date(2024, 1, 1)
    end_date = date(2025, 12, 31)
    cur = start_date
    cal_rows = []
    meses_pt = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]
    dias_pt = ["Segunda", "Terca", "Quarta", "Quinta", "Sexta", "Sabado", "Domingo"]

    while cur <= end_date:
        data_id = int(cur.strftime("%Y%m%d"))
        ano = cur.year
        mes = cur.month
        nome_mes = meses_pt[mes - 1]
        mes_ano = f"{nome_mes}/{ano}"
        tri = f"Q{(mes - 1) // 3 + 1}"
        sem = "S1" if mes <= 6 else "S2"
        dia_sem = dias_pt[cur.weekday()]
        dia_util = cur.weekday() < 5
        cal_rows.append((data_id, cur, ano, mes, nome_mes, mes_ano, tri, sem, dia_sem, dia_util))
        cur += timedelta(days=1)

    con.executemany("INSERT INTO d_calendario VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", cal_rows)
    print("d_calendario populada com " + str(len(cal_rows)) + " dias.")

    print("Populando d_produtos...")
    produtos = [
        (1, "SKU-902", "Enterprise Analytics Platform", "Software", "Analytics", 2000.0, 960.0, 52.0, "A"),
        (2, "SKU-814", "Cloud Migration Pipeline Service", "Servicos", "Cloud Ops", 3020.0, 1676.0, 44.5, "A"),
        (3, "SKU-772", "Data Warehouse Dedicated Node", "Cloud", "Infraestrutura", 1513.0, 938.0, 38.0, "A"),
        (4, "SKU-650", "Executive Analytics Templates Pack", "Software", "Business Apps", 500.0, 160.0, 68.0, "A"),
        (5, "SKU-504", "ETL Connector Integration Hub", "Software", "Integracao", 1000.0, 588.0, 41.2, "B"),
        (6, "SKU-441", "Consultoria em Governanca de Dados", "Servicos", "Consultoria", 2940.0, 1911.0, 35.0, "B"),
        (7, "SKU-312", "Servidor On-Premise Rack 2U", "Hardware", "Servidores", 3000.0, 2445.0, 18.5, "C"),
        (8, "SKU-205", "Switches de Rede Gigabit 24p", "Hardware", "Networking", 1157.0, 983.0, 15.0, "C"),
    ]
    con.executemany("INSERT INTO d_produtos VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", produtos)
    print("d_produtos populada com " + str(len(produtos)) + " produtos.")

    print("Populando d_vendedores...")
    vendedores = [
        (1, "Beatriz Silveira", "Sudeste", "Senior Account Executive", date(2021, 3, 1), "beatriz.silveira@bi.com", "Ativo"),
        (2, "Carlos Eduardo Mendes", "Sul", "Senior Account Executive", date(2021, 6, 15), "carlos.mendes@bi.com", "Ativo"),
        (3, "Mariana Albuquerque", "Sudeste", "Key Account Manager", date(2022, 1, 10), "mariana.albuquerque@bi.com", "Ativo"),
        (4, "Lucas Fontes", "Nordeste", "Account Executive", date(2022, 8, 20), "lucas.fontes@bi.com", "Ativo"),
        (5, "Fernanda Rocha", "Centro-Oeste", "Account Executive", date(2023, 2, 1), "fernanda.rocha@bi.com", "Ativo"),
    ]
    con.executemany("INSERT INTO d_vendedores VALUES (?, ?, ?, ?, ?, ?, ?)", vendedores)
    print("d_vendedores populada com " + str(len(vendedores)) + " vendedores.")

    print("Populando d_clientes...")
    segmentos = ["Tecnologia", "Varejo", "Financeiro", "Industria", "Saude", "Logistica"]
    portes = ["Enterprise", "Mid-Market", "SMB"]
    estados_regiao = [
        ("SP", "Sudeste"), ("RJ", "Sudeste"), ("MG", "Sudeste"),
        ("PR", "Sul"), ("SC", "Sul"), ("RS", "Sul"),
        ("BA", "Nordeste"), ("PE", "Nordeste"), ("CE", "Nordeste"),
        ("GO", "Centro-Oeste"), ("DF", "Centro-Oeste"), ("MT", "Centro-Oeste")
    ]
    random.seed(42)
    clientes = []
    nomes_empresas = [
        "Nexus Solucoes Digitais", "Vanguard Logistica", "Aurora Alimentos S.A.", "Titanium Seguros",
        "Orion Fintech", "Horizonte Varejo", "Delta Industria Metalurgica", "Alfa Distribuidora",
        "BioSaude Diagnosticos", "Prime Motors", "Starlight Media", "Apex Consultoria",
        "Global Cargo", "Lumina Energia", "Quantum Capital", "Pinnacle Agro", "Inova Software",
        "Fortaleza Supermercados", "Sul Brasil Textil", "Minas Aco Engenharia", "Brasilia Telecom",
        "Bahia Fruit Export", "Catarina Malhas", "Paulista Pharma", "Goias Graos S.A.",
        "Metropole Shopping Centers", "Conectividade Brasil", "Omni Comunicacao", "Atlas Logistica Integrada",
        "Solum Fertilizantes", "Matrix Robotica", "InfraTech Obras", "ProCard Meios de Pagamento",
        "Valle Mineracao", "Vertice Educacao", "AeroExpress Transportes", "Soma Investimentos",
        "BioGen Farma", "Vision Tecnologia Optica", "EcoLimpa Sustentabilidade"
    ]
    for cid, nome in enumerate(nomes_empresas, start=1):
        seg = random.choice(segmentos)
        porte = random.choice(portes)
        uf, reg = random.choice(estados_regiao)
        clientes.append((cid, nome, seg, porte, uf, reg))
    con.executemany("INSERT INTO d_clientes VALUES (?, ?, ?, ?, ?, ?)", clientes)
    print("d_clientes populada com " + str(len(clientes)) + " clientes.")

    print("Populando d_canais...")
    canais = [
        (1, "B2B Enterprise", "Direto"),
        (2, "E-commerce Direto", "Digital"),
        (3, "Canais & Parceiros", "Indireto"),
        (4, "Grandes Contas", "Direto"),
    ]
    con.executemany("INSERT INTO d_canais VALUES (?, ?, ?)", canais)
    print("d_canais populada com " + str(len(canais)) + " canais.")

    print("Populando f_metas...")
    metas = []
    meta_id = 1
    base_quotas = {1: 65000.0, 2: 55000.0, 3: 60000.0, 4: 42000.0, 5: 38000.0}
    for ano in [2024, 2025]:
        growth = 1.0 if ano == 2024 else 1.15
        for mes in range(1, 13):
            data_id = ano * 10000 + mes * 100 + 1
            season = 1.0 + (mes - 1) * 0.04
            for vid, base_q in base_quotas.items():
                v_obj = [v for v in vendedores if v[0] == vid][0]
                meta_fat = round(base_q * growth * season, 2)
                meta_ped = int(meta_fat / 500)
                metas.append((meta_id, ano, mes, data_id, vid, v_obj[2], 1, meta_fat, meta_ped, 40.0))
                meta_id += 1
    con.executemany("INSERT INTO f_metas VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", metas)
    print("f_metas populada com " + str(len(metas)) + " registros.")

    print("Gerando transacoes para f_vendas...")
    vendas = []
    venda_id = 1
    prod_weights = [0.28, 0.22, 0.18, 0.14, 0.08, 0.05, 0.03, 0.02]
    vend_weights = [0.28, 0.24, 0.22, 0.15, 0.11]
    canal_weights = [0.42, 0.30, 0.16, 0.12]

    cur = date(2024, 1, 1)
    while cur <= end_date:
        data_id = int(cur.strftime("%Y%m%d"))
        mes = cur.month
        ano = cur.year
        mult = 1.0
        if mes == 11: mult = 1.45
        elif mes == 12: mult = 1.65
        elif mes in [1, 2]: mult = 0.85
        elif mes in [6, 9]: mult = 1.15
        if cur.weekday() >= 5:
            mult *= 0.3
        num_orders = max(2, int(random.gauss(22 * mult, 4)))
        for _ in range(num_orders):
            prod = random.choices(produtos, weights=prod_weights)[0]
            prod_id = prod[0]
            preco_base = prod[5]
            custo_base = prod[6]
            vend = random.choices(vendedores, weights=vend_weights)[0]
            vend_id = vend[0]
            cli = random.choice(clientes)
            cli_id = cli[0]
            canal_id = random.choices([1, 2, 3, 4], weights=canal_weights)[0]
            if prod[3] == "Software":
                qty = random.choices([1, 2, 5, 10], weights=[0.6, 0.25, 0.1, 0.05])[0]
            elif prod[3] == "Hardware":
                qty = random.choices([1, 2, 4], weights=[0.7, 0.2, 0.1])[0]
            else:
                qty = random.choices([1, 2, 3], weights=[0.75, 0.2, 0.05])[0]
            desconto_pct = random.choices([0.0, 0.05, 0.08, 0.10, 0.15], weights=[0.45, 0.25, 0.15, 0.10, 0.05])[0]
            preco_unitario = preco_base
            valor_bruto = round(preco_unitario * qty, 2)
            valor_desconto = round(valor_bruto * desconto_pct, 2)
            valor_liquido = round(valor_bruto - valor_desconto, 2)
            custo_total = round(custo_base * qty, 2)
            margem_valor = round(valor_liquido - custo_total, 2)
            margem_pct = round((margem_valor / valor_liquido) * 100, 2) if valor_liquido > 0 else 0.0
            status = random.choices(["Faturado", "Cancelado", "Devolvido"], weights=[0.96, 0.03, 0.01])[0]
            num_pedido = f"PED-{ano}-{venda_id:06d}"
            vendas.append((
                venda_id, num_pedido, data_id, prod_id, vend_id, cli_id, canal_id,
                qty, preco_unitario, valor_bruto, valor_desconto, valor_liquido,
                custo_total, margem_valor, margem_pct, status
            ))
            venda_id += 1
        cur += timedelta(days=1)

    con.executemany("INSERT INTO f_vendas VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", vendas)
    print("f_vendas populada com " + str(len(vendas)) + " transacoes.")

    print("[Resumo Estatistico do DuckDB]")
    query = "SELECT COUNT(*), ROUND(SUM(valor_liquido), 2), ROUND(AVG(margem_contribuicao_pct), 2), ROUND(SUM(valor_liquido) / COUNT(*), 2) FROM f_vendas WHERE status_pedido = 'Faturado'"
    res = con.execute(query).fetchall()
    print("Total Pedidos Faturados: " + str(res[0][0]))
    print("Faturamento Total: R$ " + str(res[0][1]))
    print("Margem Media: " + str(res[0][2]) + "%")
    print("Ticket Medio: R$ " + str(res[0][3]))
    con.close()
    print("Base de dados DuckDB gerada com sucesso!")

if __name__ == "__main__":
    generate_database()