import ReactHtmlParser from "react-html-parser";
import { Text } from "@react-pdf/renderer";
import React from "react";

interface ParsedElementProps {
  children: React.ReactNode;
  [key: string]: any;
}

export const htmlParser = (taskDescription: string | null): JSX.Element => {
  const parseElements = (elements: React.ReactNode): React.ReactNode[] => {
    const returnContentConst: React.ReactNode[] = [];

    React.Children.forEach(elements, (element) => {
      if (typeof element === "string") {
        // Handle string content
        returnContentConst.push(<Text key={Math.random()}>{element}</Text>);
      } else if (React.isValidElement(element)) {
        const elementProps = element.props as ParsedElementProps;
        const type = element.type;
        const children = parseElements(elementProps.children);

        switch (type) {
          case "p":
            returnContentConst.push(
              <Text key={Math.random()} style={{ margin: 0, fontSize: 12 }}>
                {children}
              </Text>,
            );
            break;
          case "strong":
            returnContentConst.push(
              <Text key={Math.random()} style={{ margin: 0, fontSize: 12 }}>
                {children}
              </Text>,
            );
            break;
          // Add more cases as needed for other HTML tags
          default:
            returnContentConst.push(
              <Text key={Math.random()} style={{ margin: 0, fontSize: 12 }}>
                {children}
              </Text>,
            );
            break;
        }
      }
    });

    return returnContentConst;
  };

  if (taskDescription) {
    const parsedHtml = ReactHtmlParser(taskDescription);

    const returnContentConst = parseElements(parsedHtml);

    return <>{returnContentConst}</>;
  } else {
    return <></>;
  }
};
