import { Text, View, StyleSheet } from "@react-pdf/renderer";
import { HeaderItem } from "@/store/useHeaderStore";

const sx = StyleSheet.create({
  root: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "12px",
    width: "100%",
    alignItems: "center",
    gap: "8px",
    padding: "12px",
  },
  row: {
    position: "relative",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  centerPosition: {
    width: "100%",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translateX(-50%) translateY(-50%)",
  },
  bottomRow: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "8px 12px",
    fontSize: 16,
    backgroundColor: "#e2e8f0",
    margin: "12px 0px",
  },
});

type PropsParent = {
  item: Record<string, HeaderItem>;
  currentFontSize: string;
};

const PaperHeaderEinz = ({ item, currentFontSize }: PropsParent) => {
  return (
    <View style={sx.root}>
      <ErsterTeil
        item={item["schoolName"]}
        fontSize={30}
        fontWeight={700}
        currentFontSize={currentFontSize}
      />
      <ErsterTeil
        item={item["examName"]}
        fontSize={16}
        fontWeight={500}
        currentFontSize={currentFontSize}
      />
      <View style={sx.row}>
        <ErsterTeil
          item={item["duration"]}
          prefix="Duration: "
          fontSize={14}
          fontWeight={400}
          currentFontSize={currentFontSize}
        />

        <ErsterTeil
          item={item["subjectName"]}
          fontSize={14}
          fontWeight={400}
          currentFontSize={currentFontSize}
          // extraStyle={sx.centerPosition}
        />

        <ErsterTeil
          item={item["totalMarks"]}
          prefix="Total Marks: "
          fontSize={14}
          fontWeight={400}
          currentFontSize={currentFontSize}
        />
      </View>

      <View style={sx.bottomRow}>
        <Text>Name: ____________</Text>
        <Text>Class: ____________</Text>
        <Text>Roll No.: ____________</Text>
      </View>
    </View>
  );
};

type PropsChild = {
  item: HeaderItem;
  fontSize: number;
  fontWeight: number;
  currentFontSize: string;
  prefix?: string;
  extraStyle?: any;
};

const ErsterTeil = ({
  item,
  fontSize,
  fontWeight,
  currentFontSize,
  prefix,
  extraStyle,
}: PropsChild) => {
  return (
    <Text
      style={{
        fontWeight,
        fontSize: fontSize + Number(currentFontSize),
        ...extraStyle,
      }}
    >
      {prefix}
      {item.value}
    </Text>
  );
};

export default PaperHeaderEinz;
