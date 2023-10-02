use env_logger;
use httprouter::Router;
use hyper::{Body, Error, Request, Response};
use log::info;
use serde::{Deserialize, Serialize};
use std::collections::BTreeMap;
use std::{env, fs, io::Write};

#[derive(Debug, Serialize, Deserialize)]
struct LogEntry {
    key: String,
    success: u8,
}

async fn serve_config(_: Request<Body>) -> Result<Response<Body>, Error> {
    // Tenta ler conteudo do arquivo em public/data.json
    match fs::read_to_string(format!("{}/public/data.json", env!("CARGO_MANIFEST_DIR"))) {
        Ok(content) => {
            // Retorna o conteúdo
            info!("GET /config => 200");
            Ok(Response::new(Body::from(content)))
        }
        Err(_) => {
            // Em caso de erro, retornar 500
            info!("GET /config => 500");
            Ok(Response::builder()
                .status(500)
                .body(Body::from("Internal Server Error"))
                .unwrap())
        }
    }
}

async fn log(req: Request<Body>) -> Result<Response<Body>, Error> {
    // Parseia o body da request como JSON
    let body_bytes = hyper::body::to_bytes(req.into_body()).await.unwrap();
    let body_str = String::from_utf8(body_bytes.to_vec()).unwrap();

    let log_entry: LogEntry = serde_json::from_str(&body_str).unwrap();

    let timestamp = chrono::Utc::now().timestamp();
    let mut log_data: BTreeMap<String, LogEntry> =
        match fs::read_to_string(format!("{}/public/log.json", env!("CARGO_MANIFEST_DIR"))) {
            Ok(content) => serde_json::from_str(&content).unwrap(),
            Err(_) => BTreeMap::new(),
        };

    // Cria o novo registro de Log
    log_data.insert(
        timestamp.to_string(),
        LogEntry {
            key: log_entry.key,
            success: log_entry.success,
        },
    );

    // Escreve entrada no arquivo de logs
    let log_data_str = serde_json::to_string_pretty(&log_data).unwrap();
    let mut file = fs::File::create("public/log.json").unwrap();
    file.write_all(log_data_str.as_bytes()).unwrap();

    info!("POST /log => 200");
    Ok(Response::new(Body::from("Log adicionado")))
}

#[tokio::main]
async fn main() {
    // Inicializa log
    env::set_var("RUST_LOG", "servidor");
    env_logger::init();

    // Mapeia as rotas
    let router = Router::default()
        .get("/config", serve_config)
        .post("/log", log);

    info!("Servidor inicializado em http://192.168.0.67:8080");
    _ = hyper::Server::bind(&([192, 168, 0, 67], 8080).into())
        .serve(router.into_service())
        .await;
}
