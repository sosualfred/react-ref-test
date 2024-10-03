import { useEffect, useRef, useState } from "react";
import "./SearchBox.css";
import { countries } from "@/data";
import useDebounce from "@/hooks/useDebounce";

function SearchBox() {
  const inputRef = useRef<HTMLInputElement>(null);
  const searchBoxRef = useRef<HTMLDivElement>(null); // Ref for the search box container
  const [searchValue, setSearchValue] = useState("");
  const [, setOnFocus] = useState(false);
  const [results, setResults] = useState<Array<string>>(countries.slice(0, 5));

  // Debounced searchValue
  const debouncedSearchValue = useDebounce(searchValue, 250);

  // Debounced search logic
  useEffect(() => {
    const filteredCountries = countries.filter((country) =>
      country.toLowerCase().includes(debouncedSearchValue.toLowerCase())
    );
    setResults(filteredCountries.slice(0, 5));
  }, [debouncedSearchValue]);

  // Handle keyboard commands (Ctrl+K / Cmd+K to open search)
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      } else if (e.key === "Escape") {
        inputRef.current?.blur();
      }
    };
    document.addEventListener("keydown", handleKeydown);
    return () => {
      document.removeEventListener("keydown", handleKeydown);
    };
  }, []);

  // Handle clicks outside the search box
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchBoxRef.current &&
        !searchBoxRef.current.contains(event.target as Node)
      ) {
        inputRef.current?.blur();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClearSearch = () => {
    setSearchValue("");
    inputRef.current?.blur(); // Added blur to close the search box
  };

  return (
    <div ref={searchBoxRef}>
      {/* Added ref to the outer div */}
      <div className="relative search-box">
        <input
          ref={inputRef}
          tabIndex={0}
          data-testid={0}
          className="search-box__input"
          type="text"
          placeholder="Search..."
          value={searchValue}
          onFocus={() => setOnFocus(true)}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <button
          id="close-btn"
          className="search-box__icon"
          onClick={handleClearSearch}
        >
          X
        </button>
      </div>
      <div className="relative">
        <div className="search-box__results">
          <ul>
            {results?.map((item, index) => (
              <li key={index}>
                <a href={item} data-testid={index + 1} tabIndex={index + 1}>
                  {item}
                </a>
              </li>
            ))}
          </ul>
          {searchValue.length > 0 && (
            <a
              data-testid={6}
              href={`/search?q=${searchValue}`}
              className="search-box__results__footer"
            >
              Search: &quot;<span className="truncate">{searchValue}</span>
              &quot;
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchBox;
