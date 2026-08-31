import React from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Navigation from 'src/navigation';
import { QueryClientProvider } from 'src/apiConfigs/QueryClientProvider';
import colors from 'src/tokens/Colors';

function App() {
  return (
    <QueryClientProvider>
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" backgroundColor={colors.screenBackground} />
        <View style={styles.container}>
          <Navigation />
        </View>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.screenBackground,
  },
});

export default App;
