import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AssessmentScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.eyebrow}>ASSESSMENTS</Text>
        <Text style={styles.title}>Create Assessment</Text>
        <Text style={styles.subtitle}>
          AI assessment generation will be connected here next.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:{flex:1,backgroundColor:"#040A14"},
  container:{flex:1,padding:24,justifyContent:"center"},
  eyebrow:{color:"#43BFFF",fontSize:11,fontWeight:"900",letterSpacing:2},
  title:{color:"#FFF",fontSize:30,fontWeight:"800",marginTop:8},
  subtitle:{color:"#7188A2",fontSize:14,marginTop:8}
});

