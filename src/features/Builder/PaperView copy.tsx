import { Button } from "@/components/ui/button";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import { PDFViewer } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#fff",
    padding: 20,
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  section: {
    flexDirection: "column",
    alignItems: "center",
    gap: 10,
  },
  schoolName: {
    fontSize: 26,
  },
  examName: {
    fontSize: 20,
  },
  duration: {
    alignSelf: "flex-end",

    flexDirection: "row",
  },
  hr: {
    width: "100%",
    height: 1,
    backgroundColor: "black",
    margin: 0,
  },
  studentDetails: {
    flexDirection: "row",
    gap: 10,
  },
});

const PaperView = () => {
  return (
    <div className="h-full w-1/2 bg-blue-300">
      <PDFViewer width="100%" height="100%">
        <Document>
          <Page size="A3" style={styles.page}>
            <View style={styles.section}>
              <Text style={styles.schoolName}>Click for School Name</Text>
              <Text style={styles.examName}>Click for Exam/Session Name</Text>
            </View>
            <View style={styles.section}>
              <Text>Click for Class Name</Text>
              <Text>Click for Subject Name</Text>
            </View>

            <View style={styles.duration}>
              <Text>Duration: 1hr 30min</Text>
            </View>

            <View style={styles.hr}></View>
            <View style={styles.studentDetails}>
              <Text>Name: __________________</Text>
              <Text>Roll No.: __________________</Text>
            </View>
            <View style={styles.hr}></View>

            <View style={styles.section}>
              <Text>Click for Question Paper</Text>
              <Button>Download</Button>
            </View>
          </Page>
        </Document>
      </PDFViewer>
    </div>
  );
};

export default PaperView;
