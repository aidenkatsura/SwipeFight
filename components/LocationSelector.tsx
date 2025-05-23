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
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Suggestion[]>([]);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const search = (text: string) => {
    setQuery(text);
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
          'User-Agent': 'YourAppName/1.0 (you@example.com)',
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
      <TextInput
        placeholder={initialLocation || "Search for a location"}
        value={query}
        onChangeText={search}
        style={styles.input}
      />
      <FlatList
        data={results}
        keyExtractor={(item, index) => `${item.lat}-${item.lon}-${index}`}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              onSelect({
                name: item.name,
                lat: parseFloat(item.lat),
                lng: parseFloat(item.lon),
              });
              setQuery(item.display_name);
              setResults([]);
            }}
          >
            <Text style={styles.item}>{item.display_name}</Text>
          </TouchableOpacity>
        )}
      />
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