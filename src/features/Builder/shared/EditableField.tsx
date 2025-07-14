import { HeaderDataKeys, useHeaderStore } from "@/store/useHeaderStore";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { usePageSettingsStore } from "@/store/usePageSettingsStore";

type Props = {
  headerId: HeaderDataKeys;
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
  const headerData = useHeaderStore((state) => state.headerData);
  const item = headerData[headerId];

  const currentFontSize = usePageSettingsStore(
    (state) => state.currentFontSize,
  );
  const setHeaderValue = useHeaderStore((state) => state.setHeaderValue);
  const setIsEditing = useHeaderStore((state) => state.setIsEditing);

  if (item.isEditing) {
    if (isTextarea) {
      return (
        <Textarea
          className={`w-full rounded border bg-white p-2 text-xs text-black`}
          rows={4}
          autoFocus={true}
          placeholder={item.placeholder}
          value={item.value}
          onBlur={() => setIsEditing(headerId, false)}
          onChange={(e) => setHeaderValue(headerId, e.target.value)}
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
          placeholder={item.placeholder}
          value={item.value}
          onBlur={() => setIsEditing(headerId, false)}
          onChange={(e) => setHeaderValue(headerId, e.target.value)}
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
      className={`${textClassName || ""} py-1 ${
        isPreview ? "" : "hover:cursor-pointer hover:bg-gray-50 hover:p-1"
      }`}
      onClick={() => !isPreview && setIsEditing(headerId, true)}
      style={{
        fontWeight,
        fontSize: fontSize + Number(currentFontSize),
      }}
    >
      {prefix} {item.value}
    </p>
  );
};

export default EditableField;
