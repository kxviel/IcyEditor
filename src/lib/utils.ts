import { ExamData } from "@/features/Builder/api/getExamById";
import { HeaderData } from "@/store/useHeaderStore";
import { Fieldtype } from "@/store/useQuestionBuilderStore";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isObjectEmpty(obj: any) {
  for (const prop in obj) {
    if (Object.hasOwn(obj, prop)) {
      return false;
    }
  }

  return true;
}

type ReturnProps = {
  fields: Fieldtype;
  headerData: HeaderData;
};
export function parseExamDataResponse(response: ExamData): ReturnProps {
  const fields: Fieldtype = {};
  const headerData: HeaderData = {
    schoolName: {
      placeholder: "SCHOOL NAME",
      value: response.SCHOOL_NAME,
      isEditing: false,
    },
    className: {
      placeholder: "CLASS NAME",
      value: response.CLASS_NAME,
      isEditing: false,
    },
    examName: {
      placeholder: "EXAMINATION TYPE",
      value: response.EXAM_NAME,
      isEditing: false,
    },
    subjectName: {
      placeholder: "SUBJECT NAME",
      value: response.SUBJECT_NAME,
      isEditing: false,
    },
    duration: {
      placeholder: "Duration",
      value: response.DURATION_MINS.toString(),
      isEditing: false,
    },
    totalMarks: {
      placeholder: "Marks",
      value: response.MARKS.toString(),
      isEditing: false,
    },
  };

  response.categories.forEach((category) => {
    fields[category.categoryId] = {
      categoryId: category.categoryId,
      categoryName: category.categoryName,
      questions: category.questions.map((question) => ({
        questionId: question.id,
        questionText: question.QUESTION_DATA,
      })),
    };
  });

  return { fields, headerData };
}

export const tempFields = {
  "660": {
    categoryId: "660",
    categoryName:
      "निम्नलिखित काव्यांश को ध्यानपूर्वक पढ़कर दिए गए प्रश्नों के उत्तर दीजिए—",
    questions: [
      {
        questionId: 8000,
        questionText:
          "विंध्य-सतपुड़ा, नागा-रवसिया, ये दो औघट घाट महा,</p>(क)\tदो औघट महाघाट कौन-से हैं?</p>(ख)\tकविता में चिर-अटल किसे कहा गया है?</p>(ग)\tभारत के पूरब-पश्चिम में स्थित घाटों की तुलना किससे की गई है?</p>(घ)\tबताइए, ‘हिमालय’ का समानार्थी शब्द क्या होगा?",
      },
    ],
  },
  "661": {
    categoryId: "661",
    categoryName: "उचित विकल्प पर सही (✓) का चिह्न लगाइए—",
    questions: [
      {
        questionId: 8001,
        questionText:
          "भारत का गौरव निशान इनमें से कौन-सा पर्वत माना जाता है?</p>नागा पर्वत</p>खसिया पर्वत</p>हिमालय पर्वत",
      },
      {
        questionId: 8002,
        questionText:
          "कविता में किसको माता कहकर पुकारा गया है?</p>रावी</p>गंगा</p>कृष्णा",
      },
      {
        questionId: 8003,
        questionText:
          "कविता में कौन-सी नदी का उल्लेख नहीं हुआ है?</p>नर्मदा नदी</p>सतलुज नदी</p>कावेरी नदी",
      },
      {
        questionId: 8004,
        questionText:
          "‘कोटि-कोटि कंठों से निकली’ इस पंक्ति में कोटि-कोटि का अर्थ है–</p>कोमल</p>ह़जारों</p>करोड़ों",
      },
    ],
  },
  "662": {
    categoryId: "662",
    categoryName: "निम्नलिखित पंक्तियों के भाव स्पष्ट कीजिए— ",
    questions: [
      {
        questionId: 8005,
        questionText:
          "(क) तुंग-शिखर, चिर-अटल हिमालय है पर्वत-सम्राट यहाँ,यह गिरिवर बन गया युगों से, विजय-निशान हमारा है।......................................................................................</p>(ख) ब्रह्मपुत्र, कृष्णा, कावेरी, वत्सलता-उत्संग-मती,इनसे प्लावित देश हमारा, यह रसखान हमारा है।.......................................................",
      },
    ],
  },
  "663": {
    categoryId: "663",
    categoryName: "निम्नलिखित प्रश्नों के उत्तर लिखिए—",
    questions: [
      {
        questionId: 8006,
        questionText:
          "लघु उत्तरीय प्रश्न</p></p>(क)\tभारतवासियों को किस बात पर गर्व है?</p>(ख) इस कविता में किन-किन नदियों के नाम दिए गए हैं?</p></p>विस्तृत उत्तरीय प्रश्न</p></p>(क)\t‘हिंदुस्तान हमारा है’ कविता किस भाव से ओत-प्रोत है? अपने विचार लिखिए।</p>(ख) हमारे देश को पुरातन कहे जाने का क्या कारण है?</p>(ग) हिमालय पर्वत किस प्रकार भारत देश की रक्षा करता है?",
      },
    ],
  },
  "808": {
    categoryId: "808",
    categoryName: "समास",
    questions: [
      {
        questionId: 104002,
        questionText:
          "(क)\tजिस सामासिक शब्द के दोनों पद प्रधान हों तथा दोनों पद ‘और’, ‘या’ आदि समुच्चयबोधकों से न जुड़कर योजक चिह्नों (-) से जुड़े हों, उसे द्वंद्व समास कहते हैं।</p>उदाहरण\t–\tसमस्त पद\tसमास-विग्रह</p>विंध्य-सतपुड़ा\tविंध्य और सतपुड़ा",
      },
      {
        questionId: 104003,
        questionText:
          "(ख)\tजिस समास में उत्तर पद प्रधान होता है, उसे तत्पुरुष समास कहते हैं। इस समास में दोनों पदों के मध्य कारक चिह्नों का लोप हो जाता है–</p>उदाहरण\t–\tसमास-विग्रह\tसमस्त पद</p>यश को प्राप्त\tयशप्राप्त</p>देश के लिए भक्ति\tदेशभक्ति",
      },
    ],
  },
  "809": {
    categoryId: "809",
    categoryName: "कविता में आए तत्पुरुष और द्वंद्व समास छाँटकर लिखिए–\t\t",
    questions: [
      {
        questionId: 104004,
        questionText:
          "............................................................................................</p>..................................................................",
      },
    ],
  },
  "810": {
    categoryId: "810",
    categoryName: "दिए गए काव्यांश में उचित स्थान पर योजक चिह्न लगाइए–",
    questions: [
      {
        questionId: 104005,
        questionText:
          "विंध्य सतपुड़ा, नागा खसिया, यह औघट घाट महा, भारत के पूरब पश्चिम के यह दो भीम कपाट महा, तुंग शिखर, चिर अटल हिमालय है पर्वत सम्राट यहाँ, यह गिरिवर बन गया युगों से, विजय निशान हमारा है।",
      },
    ],
  },
  "811": {
    categoryId: "811",
    categoryName: "निम्नलिखित शब्दों के विलोम शब्द लिखिए–",
    questions: [
      {
        questionId: 104006,
        questionText:
          "(क)\tमानव\t....................................</p>(ख)\tपुरातन\t....................................</p>(ग)\tमान\t....................................</p>(घ)\tविजय\t....................................</p>(ङ)\tजागरण\t....................................</p>(च)\tसृजन\t....................................</p>(छ)\tज्ञान\t....................................</p>(ज)\tस्वदेश\t....................................",
      },
    ],
  },
};
