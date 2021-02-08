// CSS STYLES
import "./App.css";

// ASSETS
import foto1 from "../src/assets/foto1.jpg";
import foto2 from "../src/assets/foto2.jpg";
import foto3 from "../src/assets/foto3.jpeg";
import foto4 from "../src/assets/foto4.jpeg";

//THIRD PACKAGES
import { SRLWrapper } from "simple-react-lightbox";

function App() {
  return (
    <div className="container">
      <div className="m-4">
        <h2>Galeria de imagenes</h2>
      </div>
      <SRLWrapper>
        <div className="container-galeria">
          <div className="item-galeria">
            <img src={foto1} alt="foto1" className="img-galeria" />
            <h2 className="titulo-galeria">Foto 1</h2>
          </div>
          <div className="item-galeria">
            <img src={foto2} alt="foto2" className="img-galeria" />
            <h2 className="titulo-galeria">Foto 2</h2>
          </div>
          <div className="item-galeria">
            <img src={foto3} alt="foto3" className="img-galeria" />
            <h2 className="titulo-galeria">Foto 3</h2>
          </div>
          <div className="item-galeria">
            <img src={foto4} alt="foto4" className="img-galeria" />
            <h2 className="titulo-galeria">Foto 4</h2>
          </div>
          <div className="item-galeria">
            <img src={foto1} alt="foto1" className="img-galeria" />
            <h2 className="titulo-galeria">Foto 5</h2>
          </div>
          <div className="item-galeria">
            <img src={foto2} alt="foto2" className="img-galeria" />
            <h2 className="titulo-galeria">Foto 6</h2>
          </div>
          <div className="item-galeria">
            <img src={foto3} alt="foto3" className="img-galeria" />
            <h2 className="titulo-galeria">Foto 7</h2>
          </div>
          <div className="item-galeria">
            <img src={foto4} alt="foto4" className="img-galeria" />
            <h2 className="titulo-galeria">Foto 8</h2>
          </div>
        </div>
      </SRLWrapper>
    </div>
  );
}

export default App;
