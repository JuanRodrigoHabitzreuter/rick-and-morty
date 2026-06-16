import { useEffect, useState } from "react";
import "./css/App.css";

function App() {
  const [personagens, setPersonagens] = useState([]);
  const [expandido, setExpandido] = useState(null);
  const [filtroEspecie, setFiltroEspecie] = useState("Todos");
  const [filtroStatus, setFiltroStatus] = useState("Todos");
  const [filtroGenero, setFiltroGenero] = useState("Todos");
  const [filtroEpisodios, setFiltroEpisodios] = useState("Todos");
  const episodiosLista = Array.from({ length: 51 }, (_, i) => i + 1);
  const [mostrarEpisodios, setMostrarEpisodios] = useState(false);
  const [mostrarStatus, setMostrarStatus] = useState(false);
  const [mostrarGenero, setMostrarGenero] = useState(false);
  const [mostrarEspecie, setMostrarEspecie] = useState(false);


  // 2 - Explica o fetch e cria os async await
  async function carregarTodosPersonagens() {
    try {
      const primeiraResposta = await fetch(
        "https://rickandmortyapi.com/api/character",
      );

      if (!primeiraResposta.ok) {
        throw new Error("Erro ao buscar personagens");
      }

      const primeiraPagina = await primeiraResposta.json();

      const totalPaginas = primeiraPagina.info.pages;

      const promessas = [];

      // Já temos a primeira página
      promessas.push(Promise.resolve(primeiraPagina));

      // Buscar as outras páginas em paralelo
      for (let pagina = 2; pagina <= totalPaginas; pagina++) {
        promessas.push(
          fetch(
            `https://rickandmortyapi.com/api/character?page=${pagina}`,
          ).then((res) => res.json()),
        );
      }

      const paginas = await Promise.all(promessas);

      // Junta todos os personagens
      const todos = paginas.flatMap((pagina) => pagina.results);

      // Remove possíveis duplicados pelo id
      const personagensUnicos = Array.from(
        new Map(todos.map((p) => [p.id, p])).values(),
      );

      return personagensUnicos;
    } catch (error) {
      console.error("Erro ao carregar personagens:", error);
      return [];
    }
  }

  {
    /*async function carregarTodosPersonagens() {
    {var requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    const result = await fetch(
      "https://rickandmortyapi.com/api/character",
      requestOptions,
    )
      .then((response) => response.text())
      .then((result) => {
        return result;
      })
      .catch((error) => console.log("error", error));

    const char = JSON.parse(result);

    {/*{
      const personagensFiltrados =
        filtroStatus === "Todos"
          ? personagens
          : personagens.filter((p) => p.status === filtroStatus);
    }*/
  }

  //return char.results;

  async function listaPersonagens() {
    const todosPersonagens = await carregarTodosPersonagens();

    // 1 - Arrumar essa listagem principal
    return todosPersonagens.map((personagem) => (
      <div className="card char" key={personagem.id}>
        <img src={personagem.image} alt={personagem.name} />

        <h2>{personagem.name}</h2>

        <div className="char-info">
          <span>
            <b>Espécie: </b>
            {personagem.species}
          </span>
          <span>
            <b>Gênero: </b>
            {personagem.gender}
          </span>
          <h5>
            <b>Status: </b> {personagem.status}
          </h5>
        </div>

        <div>
          <div className="lista-secundaria">
            <b>Participações:</b>
            {/* Desafio da aula*/}
            {personagem.episode.map((ep) => (
              <span key={personagem.name + ep.split("episode/")[1]}>
                Ep-{ep.split("episode/")[1]}
              </span>
            ))}
          </div>
        </div>
      </div>
    ));
  }

  useEffect(() => {
    async function getConteudo() {
      const todos = await carregarTodosPersonagens();
      setPersonagens(todos);
    }
    getConteudo();
  }, []);

  const especiesUnicas = [...new Set(personagens.map((p) => p.species))];
  const generosUnicos = [...new Set(personagens.map((p) => p.gender))];
  const statusUnicos = [...new Set(personagens.map((p) => p.status))];
  const episodiosUnicos = [
    ...new Set(personagens.map((p) => p.episode.length)),
  ].sort((a, b) => a - b);

  const personagensFiltrados = personagens.filter((p) => {
    const participaDoEpisodio =
      filtroEpisodios === "Todos" ||
      p.episode.some((ep) => ep.endsWith(`/episode/${filtroEpisodios}`));

    return (
      (filtroEspecie === "Todos" || p.species === filtroEspecie) &&
      (filtroStatus === "Todos" || p.status === filtroStatus) &&
      (filtroGenero === "Todos" || p.gender === filtroGenero) &&
      participaDoEpisodio
    );
  });

  return (
    <div className="App">
      <header className="cabecalho">
        <div className="cabecalho-inner">
          {/* GIF da esquerda */}
          <img
            src="/dedoDoMeio.webp"
            alt="Gif Esquerda"
            className="gif-lateral"
          />

          {/* Texto central com neon */}
          <h1>
            {"Rick and Morty API".split("").map((char, index) => (
              <span key={index} className="neon-letter">
                {char}
              </span>
            ))}
          </h1>

          {/* GIF da direita */}
          <img
            src="/dedoDoMeio.webp"
            alt="Gif Direita"
            className="gif-lateral"
          />
        </div>

        {/* Subtítulo abaixo do texto */}
        <h2>
          <a href="/">Personagens</a>
        </h2>
      </header>

      <div className="filtros">
        <div>
          <b>Espécie:</b>

          <button
            className={filtroEspecie === "Todos" ? "filtro-ativo" : ""}
            onClick={() => setFiltroEspecie("Todos")}
          >
            Todos
          </button>

          <button onClick={() => setMostrarEspecie(!mostrarEspecie)}>
            {mostrarEspecie ? "🔼" : "🔽"}
          </button>

          {mostrarEspecie && (
            <div>
              {especiesUnicas.map((esp) => (
                <button
                  key={esp}
                  className={filtroEspecie === esp ? "filtro-ativo" : ""}
                  onClick={() => setFiltroEspecie(esp)}
                >
                  {esp}
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <b>Gênero:</b>

          <button
            className={filtroGenero === "Todos" ? "filtro-ativo" : ""}
            onClick={() => setFiltroGenero("Todos")}
          >
            Todos
          </button>

          <button onClick={() => setMostrarGenero(!mostrarGenero)}>
            {mostrarGenero ? "🔼" : "🔽"}
          </button>

          {mostrarGenero && (
            <div>
              {generosUnicos.map((gen) => {
                const traduzido =
                  gen === "Male"
                    ? "Masculino"
                    : gen === "Female"
                      ? "Feminino"
                      : gen === "Genderless"
                        ? "Sem gênero"
                        : "Desconhecido";

                return (
                  <button
                    key={gen}
                    className={filtroGenero === gen ? "filtro-ativo" : ""}
                    onClick={() => setFiltroGenero(gen)}
                  >
                    {traduzido}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div>
          <b>Status:</b>

          <button
            className={filtroStatus === "Todos" ? "filtro-ativo" : ""}
            onClick={() => setFiltroStatus("Todos")}
          >
            Todos
          </button>

          <button onClick={() => setMostrarStatus(!mostrarStatus)}>
            {mostrarStatus ? "🔼" : "🔽"}
          </button>

          {mostrarStatus && (
            <div>
              {statusUnicos.map((stat) => {
                const traduzido =
                  stat === "Alive"
                    ? "Vivo"
                    : stat === "Dead"
                      ? "Morto"
                      : "Desconhecido";

                return (
                  <button
                    key={stat}
                    className={filtroStatus === stat ? "filtro-ativo" : ""}
                    onClick={() => setFiltroStatus(stat)}
                  >
                    {traduzido}
                  </button>
                );
              })}
            </div>
          )}
        </div>
        <div>
          <b>Participações:</b>

          <button
            className={filtroEpisodios === "Todos" ? "filtro-ativo" : ""}
            onClick={() => setFiltroEpisodios("Todos")}
          >
            Todos
          </button>

          <button onClick={() => setMostrarEpisodios(!mostrarEpisodios)}>
            {mostrarEpisodios ? "🔼" : "🔽"}
          </button>

          {mostrarEpisodios && (
            <div>
              {episodiosLista.map((num) => (
                <button
                  key={num}
                  className={
                    filtroEpisodios === String(num) ? "filtro-ativo" : ""
                  }
                  onClick={() => setFiltroEpisodios(String(num))}
                >
                  Ep {num}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="lista-principal">
        {personagensFiltrados.map((personagem) => (
          <div className="card char" key={personagem.id}>
            <img src={personagem.image} alt={personagem.name} />

            <h2>{personagem.name}</h2>

            <div className="char-info">
              <span>
                <b>Espécie:</b> {personagem.species}
              </span>
              <span>
                <b>Gênero:</b> {personagem.gender}
              </span>
              <h5>
                <b>Status:</b> {personagem.status}
              </h5>
              <h5>
                <b>Participações:</b> {personagem.episode.length}
              </h5>
            </div>

            <div className="lista-secundaria">
              <b>Participações:</b>

              {(expandido === personagem.id
                ? personagem.episode
                : personagem.episode.slice(0, 3)
              ).map((ep) => (
                <span key={ep}>Ep-{ep.split("episode/")[1]} </span>
              ))}

              {personagem.episode.length > 3 && (
                <button
                  className="ver-mais"
                  onClick={() =>
                    setExpandido(
                      expandido === personagem.id ? null : personagem.id,
                    )
                  }
                >
                  {expandido === personagem.id ? "Ver menos" : "Ver mais"}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
