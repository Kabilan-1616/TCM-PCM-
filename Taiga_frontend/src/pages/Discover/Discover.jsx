// import Header from "../../components/Header/Header";
// import SearchBar from "../../components/SearchBar/SearchBar";
// import EmptyStateCard from "../../components/EmptyStateCard/EmptyStateCard";
// import "./Discover.css";

// export default function Discover() {
//   return (
//     <>
//       <Header />

//       <main className="discover">
//         <h1 className="discover__title">Discover projects</h1>

//         <SearchBar />

//         <div className="discover__content">
//           <EmptyStateCard
//             icon="heart"
//             text="There are no LIKED projects yet"
//           />
//           <EmptyStateCard
//             icon="chart"
//             text="There are no ACTIVE projects yet"
//           />
//         </div>
//       </main>
//     </>
//   );
// }

import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import SearchBar from "../../components/SearchBar/SearchBar";
import EmptyStateCard from "../../components/EmptyStateCard/EmptyStateCard";
import "./Discover.css";

export default function Discover() {
  const navigate = useNavigate();

  return (
    <>
      <Header />

      <main className="discover">
        <h1 className="discover__title">Discover projects</h1>

        <SearchBar />

        <button
          className="discover__login"
          onClick={() => navigate("/login")}
        >
          Login
        </button>

        <div className="discover__content">
          <EmptyStateCard
            icon="heart"
            text="There are no LIKED projects yet"
          />
          <EmptyStateCard
            icon="chart"
            text="There are no ACTIVE projects yet"
          />
        </div>
      </main>
    </>
  );
}
