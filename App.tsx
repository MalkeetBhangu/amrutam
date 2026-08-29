import React from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Navigation from 'src/navigation';
import { QueryClientProvider } from 'src/apiConfigs/QueryClientProvider';
import colors from 'src/tokens/Colors';

function App() {
  return (
    <QueryClientProvider>
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" backgroundColor={colors.screenBackground} translucent={true} />
        <SafeAreaView style={styles.container} edges={['top']}>
          <Navigation />
        </SafeAreaView>
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
