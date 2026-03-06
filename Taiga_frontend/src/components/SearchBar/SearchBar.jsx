import "./SearchBar.css";

export default function SearchBar() {
  return (
    <div className="search">
      <input
        type="text"
        placeholder="Type something..."
        className="search__input"
      />
    </div>
  );
}