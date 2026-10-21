import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="container-fluid py-4">
      {/* Welcome Card */}
      <div className="w-50">

     <div className="card bg-transparent border-0 shadow-none">
           <div className="card shadow-sm border-0 mb-4 w-75">
          <h1 className="display-4 fw-bold text-success">
            Welcome to SmartBite
          </h1>
          

          <p className="lead text-muted mt-3">
          “Happiness starts here — one plate at a time.” 
          </p>

          <div className="mt-4">
            <Link to="/foods" className="btn btn-success me-3">
              View Food List
            </Link>

            <Link to="/add" className="btn btn-outline-success">
              Add Food
            </Link>
          </div>
               </div>

        </div>
      </div>

      {/* About Card */}
   
       <div className="row mt-4">
  <div className="col-lg-6">
  <div className="card bg-transparent border-0 shadow-none w-50">
  <div className="card border-0 shadow-sm p-2">
    <h4 className="text-success"> SmartBite</h4>
    <p className="text-muted mb-0">
      "Let food be thy medicine and medicine be thy food."
    </p>
  </div>
</div>
  </div>
</div>

      {/* Food Gallery — its own full-height section, only visible after scrolling */}
      <div className="d-flex flex-column justify-content-center" style={{ minHeight: "100vh" }}>
        <div className="row g-4">
          <div className="col-12">
          
          </div>
          <div className="col-6 col-md-3">
          
              <img
                src="https://restaurantden.wpenginepowered.com/wp-content/uploads/2017/09/pixabay.jpg"
                style={{ height: "220px", objectFit: "cover" }}
              />
          
          </div>
          <div className="col-6 col-md-3">
            <div className="card border-0 shadow-sm overflow-hidden">
              <img
                src="https://restaurantden.wpenginepowered.com/wp-content/uploads/2017/09/pexels.jpg"
            
                style={{ height: "220px", objectFit: "cover" }}
              />
            </div>
         
          </div>

         {/* existing row of 4 images ends here with its closing </div> */}

{/* New row - appears below the first row of images */}
<div className="row g-4 mt-2">
  <div className="col-6 col-md-3">
    <div className="card border-0 shadow-sm overflow-hidden">
      <img
        src="https://restaurantden.wpenginepowered.com/wp-content/uploads/2017/09/free-stock-food-photography-websites.jpg"
        alt="Food inspiration 5"
        style={{ height: "220px", objectFit: "cover", width: "100%" }}
      />
    </div>
  </div>
</div>

          
        </div>
      </div>

   

    </div>
  );
}

export default Home;