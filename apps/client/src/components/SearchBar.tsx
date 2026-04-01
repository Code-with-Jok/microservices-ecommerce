"use client";

import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
} from "@repo/ui/components/ui/input-group";
import { Search } from "lucide-react";
import { useSearch } from "@/hooks/useSearch";

function SearchBar() {
  const { search, setSearch, handleSearch } = useSearch();

  return (
    <InputGroup className="hidden sm:flex items-center glass bg-white/5! border-white/5 focus-within:border-primary/30 focus-within:ring-4 focus-within:ring-primary/10 transition-all rounded-xl overflow-hidden px-1">
      <InputGroupInput
        value={search}
        placeholder="Search products..."
        className="bg-transparent border-none focus-visible:ring-0 placeholder:text-muted-foreground/50 text-sm py-2"
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearch();
          }
        }}
      />
      <InputGroupAddon
        className="cursor-pointer hover:text-primary transition-colors p-2 bg-primary/10 rounded-lg m-1"
        onClick={() => handleSearch()}
      >
        <Search size={16} className="text-primary hover:scale-110 transition-transform" />
      </InputGroupAddon>
    </InputGroup>
  );
}

export default SearchBar;
