import React from 'react';
import "./featured.css";
import useFetch from '../../hooks/useFetch.js';  // use lowercase 'u' for hooks by convention

const Featured = () => {
  const { data, loading, error } = useFetch("http://localhost:8800/api/hotels/countByCity?cities=Kathmandu,Lalitpur,Bhaktapur");

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  // Assuming data is an array like [countKathmandu, countLalitpur, countBhaktapur]
  return (
    <div className="featured">
      <div className="featuredItem">
        <img
          src="https://cf.bstatic.com/xdata/images/city/max500/957801.webp?k=a969e39bcd40cdcc21786ba92826063e3cb09bf307bcfeac2aa392b838e9b7a5&o="
          alt="Kathmandu"
          className="featuredImg"
        />
        <div className="featuredTitles">
          <h1>Kathmandu</h1>
          <h2>{data ? `${data[0]} properties` : "No data"}</h2>
        </div>
      </div>

      <div className="featuredItem">
        <img
          src="https://cf.bstatic.com/xdata/images/city/max500/690334.webp?k=b99df435f06a15a1568ddd5f55d239507c0156985577681ab91274f917af6dbb&o="
          alt="Lalitpur"
          className="featuredImg"
        />
        <div className="featuredTitles">
          <h1>Lalitpur</h1>
          <h2>{data ? `${data[1]} properties` : "No data"}</h2>
        </div>
      </div>

      <div className="featuredItem">
        <img
          src="https://cf.bstatic.com/xdata/images/city/max500/689422.webp?k=2595c93e7e067b9ba95f90713f80ba6e5fa88a66e6e55600bd27a5128808fdf2&o="
          alt="Bhaktapur"
          className="featuredImg"
        />
        <div className="featuredTitles">
          <h1>Bhaktapur</h1>
          <h2>{data ? `${data[2]} properties` : "No data"}</h2>
        </div>
      </div>
    </div>
  );
};

export default Featured;
