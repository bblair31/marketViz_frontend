/**
 * SearchBar Component - Modernized with API search
 *
 * Uses TanStack Query for API-based search with debouncing
 */
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Input } from 'semantic-ui-react'
import { useStockSearch } from '@/hooks'

export function SearchBar() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  // Debounce the search query to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query)
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  // Use TanStack Query hook for search
  const { data: results = [], isLoading } = useStockSearch(
    debouncedQuery,
    debouncedQuery.length >= 2
  )

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
    setShowSuggestions(true)
  }

  const handleSuggestionClick = (symbol: string) => {
    setQuery('')
    setShowSuggestions(false)
    navigate(`/stocks/${symbol}`)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      // Navigate to the first result or the query as-is
      const symbol = results[0]?.symbol || query.trim().toUpperCase()
      handleSuggestionClick(symbol)
    }
  }

  const renderSuggestions = () => {
    if (!showSuggestions || query.length < 2) return null

    if (isLoading) {
      return (
        <div className="search-suggestions">
          <div className="popup-text">
            <div className="search">Loading...</div>
          </div>
        </div>
      )
    }

    if (results.length === 0) {
      return (
        <div className="search-suggestions">
          <div className="popup-text">
            <div className="search">No results found</div>
          </div>
        </div>
      )
    }

    return (
      <div className="search-suggestions">
        <div className="popup-text">
          {results.slice(0, 10).map((result) => (
            <div
              key={result.symbol}
              className="search"
              onClick={() => handleSuggestionClick(result.symbol)}
            >
              {result.symbol} - {result.name}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="search-bar" ref={searchRef}>
      <form onSubmit={handleSubmit}>
        <Input
          icon="search"
          value={query}
          placeholder="Search by Ticker or Name"
          onChange={handleSearchChange}
          inverted
        />
      </form>
      {renderSuggestions()}
    </div>
  )
}

export default SearchBar
