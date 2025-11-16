import Carousel from "../components/Carousel";
import "./Home.css";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main className="home-container">

      <Carousel />

      {/* --- SEÇÃO 1 --- */}
      <section className="section" aria-labelledby="historia-title">
        <div className="section-content">
          <div className="text">
            <h2 id="historia-title">Conheça nossa história.</h2>

            <p>Somos parte do coletivo Horta das Flores, um projeto voluntário em que cultivamos hortas comunitárias e tratamos do meio ambiente.</p>

            <p>Nosso projeto acontece na Mooca em São Paulo, na praça Viveiro das flores, e durante nossos cultivos começamos a receber visitas de gatos, que a princípio vinham comer ou se abrigar da chuva e do frio.</p>

            <p>A partir daí surgiu o projeto Gatos da Praça, onde nós levamos um pouco de dignidade para esses gatinhos através da alimentação, castramento e direcionamento para lares adotivos, tudo de forma voluntária a partir de doações.</p>

            <p>Aqui tudo é feito em muitas mãos, nossos voluntários dispõe do seu tempo e de seus recursos para ajudar no projeto.</p>
          </div>

          <div className="image">
            <img 
              src="/home/casinha.jpg" 
              alt="Casinha de madeira construída para os gatos, posicionada entre árvores e folhas secas" 
            />
          </div>
        </div>
      </section>

      {/* --- SEÇÃO 2 --- */}
      <section className="section reverse" aria-labelledby="amor-title">
        <div className="section-content">

          <div className="image">
            <img 
              src="/home/gatos-relaxado.jpg" 
              alt="Gato tigrado de olhos fechados deitado na grama com outros gatos ao fundo" 
            />
          </div>

          <div className="text">
            <h2 id="amor-title">Compartilhando amor!</h2>

            <p>Nada seria possível sem o amor e dedicação dos nossos voluntários, 
              por isso te convidamos a acompanhar de pertinho nosso projedo Gatos da Praça, 
              quando você compartilha amor e compaixão recebe em troca todo o carinho dos nossos gatinhos, 
              que serão eternamente gratos pelo cuidado que tem recebido.</p>

            <p>Faça parte do nosso projeto!</p>

            <Link 
              to="/seja-voluntario" 
              className="btn-home"
              role="button"
            >
              Seja voluntário
            </Link>

          </div>
        </div>
      </section>

      {/* --- SEÇÃO FINAL --- */}
      <section className="section-circles" aria-label="Depoimentos de adotantes">

        <div className="circles-container">

          <div className="circle-item">
            <img src="/home/adotante-1.jpg" alt="Mércia segurando seu gato Pudim e beijando sua cabeça" />
            <h3>Adotante Mércia</h3>
            <p>Ter achado o Pudim no projeto foi a minha maior alegria!</p>
          </div>

          <div className="circle-item">
            <img src="/home/adotante-2.jpg" alt="Giba segurando seu gato enquanto sorri" />
            <h3>Adotante Giba</h3>
            <p>Minha companhia de todos os dias, encontrei no projeto meu melhor amigo.</p>
          </div>

          <div className="circle-item">
            <img src="/home/adotante-3.jpg" alt="Carolina segurando sua gata próxima ao rosto" />
            <h3>Adotante Carolina</h3>
            <p>Meu Home office agora é completo, achei minha parceira de trabalho e da vida.</p>
          </div>

        </div>
      </section>

    </main>
  );
}
