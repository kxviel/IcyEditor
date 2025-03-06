import { useHeaderStore } from "@/store/useHeaderStore";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useFontSizeStore } from "@/store/useFontSizeStore";

type Props = {
  headerId: string;
  fontSize: number;
  fontWeight: number;
  isPreview: boolean;
  prefix?: string;
  textClassName?: string;
  inputClassName?: string;
  isTextarea?: boolean;
};

const EditableField = ({
  headerId,
  fontSize,
  fontWeight,
  isPreview,
  prefix,
  textClassName,
  inputClassName = "w-full",
  isTextarea = false,
}: Props) => {
  const item = useHeaderStore((state) => state.headerData);
  const currentFontSize = useFontSizeStore((state) => state.currentFontSize);

  const setValue = useHeaderStore((state) => state.setValue);
  const setIsEditing = useHeaderStore((state) => state.setIsEditing);

  if (item[headerId].isEditing) {
    if (isTextarea) {
      return (
        <Textarea
          className={`w-full rounded border bg-white p-2 text-xs text-black`}
          rows={4}
          autoFocus={true}
          placeholder={item[headerId].placeholder}
          value={item[headerId].value}
          onBlur={() => setIsEditing(headerId, false)}
          onChange={(e) => setValue(headerId, e.target.value)}
          style={{
            fontWeight,
            fontSize: fontSize + Number(currentFontSize),
          }}
        />
      );
    }

    return (
      <div className="flex items-center gap-2">
        {prefix && (
          <p
            style={{
              fontWeight,
              fontSize: fontSize + Number(currentFontSize),
            }}
          >
            {prefix}
          </p>
        )}

        <Input
          className={inputClassName}
          autoFocus={true}
          placeholder={item[headerId].placeholder}
          value={item[headerId].value}
          onBlur={() => setIsEditing(headerId, false)}
          onChange={(e) => setValue(headerId, e.target.value)}
          style={{
            fontWeight,
            fontSize: fontSize + Number(currentFontSize),
          }}
        />
      </div>
    );
  }

  return (
    <p
      className={`${textClassName || ""} p-1 ${isPreview ? "" : "hover:cursor-pointer hover:bg-gray-50"}`}
      onClick={() => !isPreview && setIsEditing(headerId, true)}
      style={{
        fontWeight,
        fontSize: fontSize + Number(currentFontSize),
      }}
    >
      {prefix} {item[headerId].value}
    </p>
  );
};

export default EditableField;
