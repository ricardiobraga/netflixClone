import React, {useEffect, useState} from 'react';
import Tmdb from './Tmdb';
import './App.css';
import MovieRow from './components/MovieRow';
import FeatureMovie from './components/FeaturedMovie';
import Header from './components/Header';


export default () => {

  
  const [movieList, setMovieList] = useState([]);
  const [featureData, setFeatureData] = useState(null);
  const [blackHeader, setBlackHeader] = useState(false);

  useEffect(()=>{
    const loadAll = async () => {
      let list = await Tmdb.getHomeList();
      setMovieList(list);

      let originals = list.filter(i => i.slug === 'originals');
      let ramdomChosen = Math.floor(Math.random() * (originals[0].items.results.length - 1));
      let chosen = originals[0].items.results[ramdomChosen];
      let chosenInfo = await Tmdb.getMovieInfo(chosen.id, 'tv');
      setFeatureData(chosenInfo);
      
    }

    loadAll();
  }, []);

  useEffect(() => {
      const scrollListener = () => {
          if(window.scrollY > 10) {
            setBlackHeader(true);
          } else {
            setBlackHeader(false);
          }
      }

      window.addEventListener('scroll', scrollListener);

      return () => {
        window.removeEventListener('scroll', scrollListener);
      }
  }, []);

  return (
    <div className="page">

      <Header black={blackHeader} />

      {featureData &&
        <FeatureMovie item={featureData} />
      }

      <section className="lists">
        {movieList.map((item, key) => (
          <MovieRow key={key}  title={item.title} items={item.items}/>
        ))}
      </section>      
        <footer>
          Feito por @unholypixels <br />
          Direitos de imagem para Netflix<br />
          Dados pegos no site Themoviedb.org
        </footer>

        {movieList.length <= 0 &&
          <div className="loading">
            <img src="https://cdn.statically.io/img/techverge.io/wp-content/uploads/2018/01/Netflix_LoadTime.gif" alt="Carregando" />
          </div>
        }
      
    </div>
  );
}