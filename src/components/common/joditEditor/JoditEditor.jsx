//react
import { useRef, useMemo } from 'react';
//components
import JoditEditor from 'jodit-react';
// import HTMLReactParser from "html-react-parser";

export const CustomJoditEditor = ({
  placeholder,
  state,
  setState,
  $height,
  disabled,
}) => {
  // richText-jodit
  const editor = useRef(null);

  const config = useMemo(
    () => ({
      //https://xdsoft.net/jodit/docs/options.html
      readonly: false,
      width: '100%',
      height: $height ? $height : 'auto',
      placeholder: placeholder || 'Start typing...',
      saveModeInStorage: true,
      toolbarButtonSize: 'large',
      disabled: disabled,
      // buttons: [
      //   'bold', 'italic', 'underline', 'strike', 'align', 'olist', 'ulist', 'outdent', 'indent', 'link', 'undo', 'redo', 'source'
      // ]
    }),
    [placeholder, disabled, $height],
  );

  return (
    <>
      <JoditEditor
        ref={editor}
        value={state}
        config={config}
        tabIndex={1}
        onBlur={setState}
        onChange={setState}
      />
      {/* <div>{HTMLReactParser(content)}</div> */}
    </>
  );
};
