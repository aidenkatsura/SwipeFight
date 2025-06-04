import { theme } from "@/styles/theme";
import axios from "axios";
import { useRef, useState } from "react";
import {
  FlatList,
  TextInput,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
} from "react-native";

type Suggestion = {
  name: string;          // short name (used in `onSelect`)
  display_name: string;  // full label (shown in dropdown)
  lat: string;
  lon: string;
};

// A location selector
// takes in a onSelect function and a initial location
// returns loc, with the selected location's name, and coordinates
export const LocationSelector = ({ onSelect, initialLocation,}: {
  onSelect: (loc: { name: string; lat: number; lng: number }) => void;
  initialLocation: string|null;
}) => {
  const [query, setQuery] = useState(initialLocation || '');
  const [results, setResults] = useState<Suggestion[]>([]);
  const [searchText, setSearchText] = useState(''); 
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const search = (text: string) => {
    setSearchText(text);
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    debounceTimeout.current = setTimeout(() => {
      if (text.length >= 3) {
        fetchResults(text);
      } else {
        setResults([]);
      }
    }, 500); // 500ms debounce
  };


  const fetchResults = async (text: string) => {
    try {
      const res = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: {
          q: text,
          format: 'json',
          addressdetails: 0, // speed improvement
          limit: 10,
        },
        headers: {
          'User-Agent': 'SwipeFight/1.0 (swipefight403@gmail.com)',
        },
      });

      const filteredResults: Suggestion[] = res.data
        .filter((item: any) =>
        ['city', 'town', 'village'].includes(item.addresstype)
        )
        .map((item: any) => ({
          name: item.name || item.address?.city || item.address?.town || item.address?.village || '',
          display_name: item.display_name,
          lat: item.lat,
          lon: item.lon,
        }));

      setResults(filteredResults);
    } catch (err) {
      console.error(err);
    }
  };

  return (
  <View>
    {/* Selected / Current Location (not tied to typing) */}
      <Text style={styles.input}>
        {query || 'Selected location will appear here'}
      </Text>


    {/* Search Input */}
    <TextInput
      placeholder="Search for a location"
      value={searchText}
      onChangeText={(text) => {
        search(text);
      }}
      style={styles.input}
    />

    {/* Search Results */}
    <View>
      {results.map((item, index) => (
        <TouchableOpacity
          key={`${item.lat}-${item.lon}-${index}`}
          onPress={() => {
            onSelect({
              name: item.name,
              lat: parseFloat(item.lat),
              lng: parseFloat(item.lon),
            });
            setQuery(item.display_name);  // Update selected location only on select
            setSearchText('');            // Clear typing box
            setResults([]);
          }}
        >
          <Text style={styles.item}>{item.display_name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);
};

const styles = StyleSheet.create({
  input: {
      borderWidth: 1,
      borderColor: theme.colors.gray[300],
      borderRadius: 8,
      padding: theme.spacing[3],
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      marginTop: theme.spacing[1],
      marginHorizontal: theme.spacing[2],
    },
  item: {
    padding: 10,
  },
});